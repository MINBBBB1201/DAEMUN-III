import { and, desc, eq, sql } from "drizzle-orm";
import { faqs } from "@daemun/db";
import { db } from "../db";

/**
 * 안내 챗봇 RAG의 검색(retrieval) 단계.
 *
 * 사용자 질문에서 키워드를 뽑아 `faqs`(공개된 것만)를 LIKE로 훑고, 매칭된
 * 키워드 수가 많은 순 → 최근 수정 순으로 상위 N건을 돌려준다. 전문검색
 * (tsvector)이나 임베딩 없이 바로 쓰는 MVP 수준 — FAQ가 수십 건 규모라
 * seq scan으로 충분하다. 규모가 커지면 pg_trgm GIN 인덱스나 pgvector로
 * 교체 (설계안 §3-1 2차 고도화).
 */

export type FaqHit = {
  id: string;
  question: string;
  answer: string;
  category: string;
  updatedAt: Date;
};

/** 질문 문자열을 검색어 토큰으로 자른다. 문장부호 제거, 2글자 미만·중복 제거. */
export function tokenize(query: string): string[] {
  const seen = new Set<string>();
  for (const raw of query.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/)) {
    const t = raw.trim();
    if (t.length >= 2) seen.add(t);
  }
  return [...seen].slice(0, 12);
}

/**
 * 질문과 관련된 공개 FAQ를 최대 `limit`건. 키워드가 하나도 안 걸리면 빈 배열.
 * (호출 측에서 "관련 FAQ 없음"으로 처리 — 설계안 §4 fallback)
 */
export async function searchFaqs(query: string, limit = 5): Promise<FaqHit[]> {
  const terms = tokenize(query);
  const cols = {
    id: faqs.id,
    question: faqs.question,
    answer: faqs.answer,
    category: faqs.category,
    updatedAt: faqs.updatedAt,
  };

  if (terms.length === 0) return [];

  // question + answer + category를 한 덩어리로 소문자화해서 각 토큰의 부분일치
  // 여부를 0/1로 더한다 → 매칭 키워드 수 점수.
  const haystack = sql`lower(${faqs.question} || ' ' || ${faqs.answer} || ' ' || ${faqs.category})`;
  const score = sql<number>`(${sql.join(
    terms.map((t) => sql`(${haystack} like ${`%${t}%`})::int`),
    sql` + `,
  )})`;

  return db
    .select(cols)
    .from(faqs)
    .where(and(eq(faqs.published, true), sql`${score} > 0`))
    .orderBy(desc(score), desc(faqs.updatedAt))
    .limit(limit);
}

/**
 * 검색 결과를 system prompt의 <context>에 넣을 문자열로. 설계안 §4 형식:
 *   [FAQ] Q: ... A: ...
 * 결과가 없으면 모델이 fallback을 확실히 따르도록 안내 문구를 돌려준다.
 */
export function renderFaqContext(hits: FaqHit[]): string {
  if (hits.length === 0) return "관련된 FAQ를 찾지 못했습니다.";
  return hits
    .map((h) => {
      const cat = h.category ? ` (${h.category})` : "";
      return `[FAQ]${cat} Q: ${h.question} A: ${h.answer}`;
    })
    .join("\n");
}
