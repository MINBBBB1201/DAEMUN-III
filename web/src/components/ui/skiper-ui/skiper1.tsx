"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

// Sample content for each section
const sectionContent = [
  { title: "Who we are", code: `const home = "Welcome";`, showCard: false },
  { title: "What we do", code: `const about = "Our Story";`, showCard: true },
  {
    title: "How we do it",
    code: `const services = ["Web", "Mobile"];`,
    showCard: true,
  },
  {
    title: "Our projects",
    code: `const portfolio = projects.map();`,
    showCard: true,
  },
  { title: "Our team", code: `const team = members.join();`, showCard: true },
  { title: "Pricing", code: `const pricing = plans.reduce();`, showCard: true },
  { title: "FAQ", code: `const faq = questions.find();`, showCard: true },
  { title: "Support", code: `const support = "24/7 Help";`, showCard: true },
  {
    title: "Downloads",
    code: `const downloads = files.sort();`,
    showCard: true,
  },
  {
    title: "No card for this section",
    code: `const gallery = images.slice();`,
    showCard: false,
  },
  {
    title: "No card for this section too",
    code: `const gallery = images.slice();`,
    showCard: false,
  },
  {
    title: "Gallery",
    code: `const gallery = images.slice();`,
    showCard: true,
  },
  {
    title: "Events",
    code: `const events = calendar.filter();`,
    showCard: true,
  },
  { title: "News", code: `const news = articles.reverse();`, showCard: true },
  {
    title: "Partners",
    code: `const partners = companies.map();`,
    showCard: true,
  },
  {
    title: "Careers",
    code: `const careers = jobs.available();`,
    showCard: true,
  },
  {
    title: "Resources",
    code: `const resources = docs.search();`,
    showCard: true,
  },
  { title: "Reviews", code: `const reviews = feedback.all();`, showCard: true },
  { title: "Legal", code: `const legal = terms.privacy();`, showCard: true },
  { title: "Footer", code: `const footer = "Thank you";`, showCard: true },
];

const Skiper1 = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [showScrollCard, setShowScrollCard] = useState(false);

  return (
    <div className="relative">
      <Content
        setActiveSection={setActiveSection}
        setShowScrollCard={setShowScrollCard}
      />
      <ScrollBar
        activeSection={activeSection}
        showScrollCard={showScrollCard}
      />
    </div>
  );
};

const ScrollBar = ({
  activeSection,
  showScrollCard,
}: {
  activeSection: number;
  showScrollCard: boolean;
}) => {
  const { scrollYProgress } = useScroll();
  const [scrollBarWrapperRef, bounds] = useMeasure();
  const translateX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, bounds.width - 1.5],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [ghostPosition, setGhostPosition] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const scrollBarRef = useRef(null);
  const dragControls = useDragControls();

  // --- Motion value for handle position ---
  const handleX = useMotionValue(0);

  // Sync handleX with scroll when not dragging
  useEffect(() => {
    if (!isDragging) {
      const unsubscribe = translateX.on("change", (v) => handleX.set(v));
      return () => unsubscribe();
    }
  }, [isDragging, translateX, handleX]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setGhostPosition(-20);
      return;
    }

    if (scrollBarRef.current) {
      const relativeX = Math.max(
        0,
        Math.min(e.clientX - bounds.left, bounds.width - 6),
      );
      setGhostPosition(relativeX);
    }
  };

  const handleScrollBarClick = (e: React.MouseEvent) => {
    if (!scrollBarRef.current || isDragging) return;

    const clickX = e.clientX - bounds.left;
    const barWidth = bounds.width;
    const relativePosition = Math.max(0, Math.min(1, clickX / barWidth));

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: scrollableHeight * relativePosition,
      behavior: "instant", // Use 'smooth' for smooth scroll
    });
  };

  // Handle drag on the indicator
  const handleDrag = (
    event: MouseEvent,
    info: { point: { x: number; y: number } },
  ) => {
    event.preventDefault();
    if (!scrollBarRef.current) return;

    const barWidth = bounds.width;
    const dragX = Math.max(0, Math.min(info.point.x - bounds.left, barWidth));
    const relativePosition = dragX / barWidth;

    // Update handleX motion value
    handleX.set(dragX);

    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: scrollableHeight * relativePosition,
      behavior: "instant",
    });
  };

  const scrollbarBars = useMemo(
    () =>
      [...Array(40)].map((_, item) => (
        <motion.div
          key={item}
          initial={{
            opacity: item % 5 === 0 ? 0.2 : 0.2,
            filter: "blur(1px)",
          }}
          animate={{
            opacity: item % 5 === 0 ? 1 : 0.2,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.2,
            delay: item % 5 === 0 ? (item / 5) * 0.05 : 0,
            ease: "easeOut",
          }}
          className={cn(
            "bg-foreground w-[1px]",
            item % 5 === 0 ? "h-[15px]" : "h-[15px]",
          )}
        />
      )),
    [],
  );

  return (
    <div className="fixed bottom-5 right-1/2 translate-x-1/2 flex-col overflow-hidden rounded-2xl sm:right-5 sm:translate-x-0">
      <AnimatePresence mode="popLayout">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={
            showScrollCard ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }
          }
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.5, bounce: 0, type: "spring" }}
          key={activeSection}
        >
          <ScrollCard section={sectionContent[activeSection]} />
        </motion.div>
      </AnimatePresence>
      <motion.div className="bg-background cursor-grab rounded-xl px-5 will-change-transform">
        <div ref={scrollBarWrapperRef}>
          <div
            className="relative flex h-[40px] items-center justify-center gap-1.5 overflow-hidden rounded-xl"
            ref={scrollBarRef}
            onClick={handleScrollBarClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
          >
            {scrollbarBars}

            <AnimatePresence mode="popLayout">
              {isHovering && !isDragging && (
                <motion.div
                  className="absolute h-[24px] w-1.5 cursor-grab rounded-full bg-[#FF4B4B] opacity-30"
                  style={{
                    left: ghostPosition,
                    willChange: "transform",
                  }}
                  transition={{
                    type: "tween",
                    duration: 0,
                  }}
                />
              )}
            </AnimatePresence>
            {/* The actual draggable cursor */}
            <motion.div
              layout
              drag="x"
              dragControls={dragControls}
              dragConstraints={scrollBarRef}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDrag={handleDrag}
              onDragEnd={() => setIsDragging(false)}
              className="absolute left-0 h-[24px] w-1.5 cursor-grab rounded-full bg-[#FF4B4B] active:cursor-grabbing"
              style={{ x: handleX }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ScrollCard = ({
  section,
}: {
  section: { title: string; code: string; showCard: boolean };
}) => {
  const [isUsageCopied, setIsUsageCopied] = useState(false);

  const handleCopyUsage = async () => {
    await navigator.clipboard.writeText(section.code);
    setIsUsageCopied(true);
    setTimeout(() => setIsUsageCopied(false), 1000);
  };

  return (
    <div className="bg-background mb-2 flex w-full rounded-xl p-4">
      <div className="flex-1">
        <div className="mb-2 text-xs text-[#585858] opacity-60">
          &#47;&#47; {section.title}
        </div>
        <pre className="text-sm">
          <code className="text-sm">
            <span className="text-[#FF4B4B]">{section.code.split("=")[0]}</span>
            {section.code.includes("=") && `=${section.code.split("=")[1]}`}
          </code>
        </pre>
      </div>
      <span
        onClick={handleCopyUsage}
        className="absolute right-4 top-4 cursor-pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          {!isUsageCopied ? (
            <motion.svg
              key="copy"
              exit={{ scale: 0 }}
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3 opacity-50 transition group-hover:opacity-100"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </motion.svg>
          ) : (
            <motion.svg
              key="copied"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="size-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                d="M20 6 9 17l-5-5"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
};

const Content = ({
  setActiveSection,
  setShowScrollCard,
}: {
  setActiveSection: (section: number) => void;
  setShowScrollCard: (show: boolean) => void;
}) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(
              entry.target as HTMLDivElement,
            );
            if (index !== -1) {
              setActiveSection(index);
              const currentSection = sectionContent[index];
              setShowScrollCard(currentSection?.showCard || false);
            }
          }
        });
      },
      {
        threshold: window.innerWidth < 768 ? 0.1 : 0.2, // 10% visible for mobile 20% for desktop
        rootMargin:
          window.innerWidth < 768 ? "-10% 0px -10% 0px" : "-20% 0px -20% 0px", // Less restrictive margin for mobile
      },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [setActiveSection, setShowScrollCard]);

  return (
    <div className="lg:py-12">
      {sectionContent.map((_, index) => (
        <div
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="text-foreground flex h-full w-full items-center justify-center px-5 sm:px-10"
          key={index}
        >
          <div className="max-w-xl py-12 text-justify lg:py-20">
            <h2 className="text-foreground/10 mb-2 text-2xl font-bold tracking-tight">
              #{index + 1}{" "}
              {sectionContent[index]?.title || `Section ${index + 1}`}
            </h2>
            <p className="opacity-30">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam,
              quos! Fugiat earum maiores nostrum dolores ipsum maxime aut vitae
              atque tempora non rem eveniet, tempore sed obcaecati iure minima
              rerum consequuntur officiis dolorum corporis. Reiciendis nesciunt
              dolor neque quibusdam. Rem, voluptatum quam necessitatibus
              molestias vel qui quidem nihil, atque ad, magni voluptate. Vitae
              laudantium dignissimos eos adipisci quae quasi, quibusdam odit
              natus iusto iure commodi nobis! Itaque nisi deserunt ut neque?
              Sunt voluptas excepturi odit, hic porro nam repudiandae beatae, ab
              accusantium eius aliquid molestias dignissimos quam nihil
              laboriosam vel laborum ratione quo mollitia ut maiores voluptatem
              consequuntur. Consequuntur rerum nihil illo aperiam, sequi in
              aspernatur iure quisquam voluptatum aut, necessitatibus velit
              aliquid dolores blanditiis, at cupiditate minus. Suscipit, ipsum
              ad quaerat libero exercitationem eius quam nulla debitis cum
              numquam ipsa, quas asperiores blanditiis natus praesentium
              recusandae soluta veritatis aspernatur odit assumenda odio sit,
              expedita culpa? Quia delectus doloremque iste porro obcaecati
              tempore ab molestiae blanditiis nam ducimus labore, mollitia quae
              unde animi quis iusto omnis sequi libero commodi. Quos enim quam
              nihil. Quis, nobis illo nam dolore ut labore distinctio odio fuga
              alias error repudiandae animi nihil voluptatibus voluptates
              dolorem delectus sequi pariatur aliquid mollitia eum magnam quam,
              tempore tenetur expedita. Debitis, ratione, quos quo veniam
              aspernatur commodi earum veritatis quaerat facilis nihil libero
              laudantium, voluptate est corrupti sunt voluptatibus sed!
              Quibusdam, labore eius laboriosam commodi veniam quasi placeat
              fugit, est dignissimos sequi modi quisquam nisi itaque officia
              rerum similique magni numquam, odio blanditiis dolores iste.
              Expedita sed quod, officiis eligendi voluptatibus eveniet sint
              quasi hic quas, explicabo tempora voluptas dignissimos molestiae,
              pariatur quia! Incidunt quae perferendis exercitationem at,
              quibusdam, minima aliquid sit fuga fugit dolore consequuntur quam
              obcaecati magni pariatur animi eius non voluptate illum autem
              perspiciatis ipsum repudiandae corrupti placeat. Distinctio,
              voluptatum iure? Quia quibusdam tenetur aperiam quas sapiente.
              Inventore adipisci non debitis ratione optio, laborum molestiae
              dolorum ipsam aut enim! Minus accusamus quaerat minima officia,
              vero quos, corporis error labore explicabo possimus veniam vitae
              hic, sed quae non distinctio delectus? Quasi, hic impedit numquam
              modi rem ipsum ex explicabo facere eaque. Quaerat enim debitis
              atque dolore.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export { Skiper1 };

/**
 * Scrollbar Animation Component — v1.0.0
 *
 * Inspired by the https://animejs.com/ Landing page and built with Motion for React.
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * Offers smooth, customizable scroll animations for modern web interfaces.
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
