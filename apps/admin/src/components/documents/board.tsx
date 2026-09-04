// apps/admin/src/components/documents/board.tsx
"use client";

import { useRef, useState } from "react";
import type { SiteData, SiteDocument } from "@daemun/shared";
import { ApiError, MAX_UPLOAD_BYTES } from "@/lib/api";
import {
  documentHooks,
  useCreateDocumentFromFile,
  useReplaceDocumentFile,
} from "@/lib/documents";
import { InlineText } from "@/components/inline-edit";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

const ACCEPT = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp";
const ACCEPT_RE = /\.(pdf|docx?|jpe?g|png|webp)$/i;

function msg(err: unknown): string | null {
  if (!err) return null;
  return err instanceof ApiError ? err.message : "Save failed.";
}

function validate(file: File): string | null {
  if (!ACCEPT_RE.test(file.name)) return "Only PDF, DOC, and image files can be uploaded.";
  if (file.size > MAX_UPLOAD_BYTES) return "File exceeds 25MB.";
  return null;
}

export function DocumentsBoard({ site }: { site: SiteData }) {
  const create = useCreateDocumentFromFile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localErr, setLocalErr] = useState<string | null>(null);

  function pick(file: File | undefined) {
    setLocalErr(null);
    if (!file) return;
    const bad = validate(file);
    if (bad) {
      setLocalErr(bad);
      return;
    }
    create.mutate(file);
  }

  return (
    <div className="space-y-4">
      {site.documents.length === 0 && (
        <p className="text-sm text-faint">
          No documents yet. Upload a file to add it to the list.
        </p>
      )}

      <ul className="space-y-2">
        {site.documents.map((doc, i) => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            siblings={site.documents}
            index={i}
          />
        ))}
      </ul>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button variant="ghost" disabled={create.isPending} onClick={() => inputRef.current?.click()}>
          {create.isPending ? "Uploading…" : "+ Add document (upload file)"}
        </Button>
        {(localErr || create.error) && (
          <p className="mt-1 text-xs text-[#b23b3b]">
            {localErr ?? msg(create.error)}
          </p>
        )}
      </div>
    </div>
  );
}

function DocumentRow({
  doc,
  siblings,
  index,
}: {
  doc: SiteDocument;
  siblings: SiteDocument[];
  index: number;
}) {
  const update = documentHooks.useUpdate();
  const remove = documentHooks.useRemove();
  const reorder = documentHooks.useReorder();
  const replace = useReplaceDocumentFile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const busy =
    update.isPending ||
    remove.isPending ||
    reorder.isPending ||
    replace.isPending;
  const err =
    localErr ??
    msg(remove.error) ??
    msg(reorder.error) ??
    msg(replace.error);

  const move = (dir: -1 | 1) => {
    const next = [...siblings];
    const j = index + dir;
    [next[index], next[j]] = [next[j]!, next[index]!];
    reorder.mutate(next.map((d) => d.id));
  };

  const patch = (p: Parameters<typeof update.mutateAsync>[0]["patch"]) =>
    update.mutateAsync({ id: doc.id, patch: p });

  function pickReplacement(file: File | undefined) {
    setLocalErr(null);
    if (!file) return;
    const bad = validate(file);
    if (bad) {
      setLocalErr(bad);
      return;
    }
    replace.mutate({ id: doc.id, file });
  }

  return (
    <li className="rounded-xl border border-line bg-white p-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <InlineText
            ariaLabel="Document title"
            value={doc.title}
            placeholder="Document title"
            pending={update.isPending}
            className="font-medium"
            onCommit={(v) => patch({ title: v })}
          />
          <InlineText
            ariaLabel="One-line description"
            value={doc.blurb}
            placeholder="One-line description (optional)"
            pending={update.isPending}
            className="text-xs"
            onCommit={(v) => patch({ blurb: v })}
          />
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <a
              href={doc.file}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-line px-2 py-0.5 font-medium text-body hover:bg-wash"
            >
              View file
            </a>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => {
                pickReplacement(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="text-muted hover:text-ink disabled:opacity-50"
            >
              {replace.isPending ? "Uploading…" : "Replace"}
            </button>
            <span className="text-line">·</span>
            <span>{doc.kind || "Unknown format"}</span>
            {doc.size && <span>· {doc.size}</span>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton label="Move up" disabled={index <= 0 || busy} onClick={() => move(-1)}>
            ↑
          </IconButton>
          <IconButton
            label="Move down"
            disabled={index >= siblings.length - 1 || busy}
            onClick={() => move(1)}
          >
            ↓
          </IconButton>
          <IconButton
            label="Delete document"
            danger
            disabled={busy}
            onClick={() => {
              if (window.confirm(`Delete "${doc.title}"?`))
                remove.mutate(doc.id);
            }}
          >
            ✕
          </IconButton>
        </div>
      </div>
      {err && <p className="mt-1 text-xs text-[#b23b3b]">{err}</p>}
    </li>
  );
}
