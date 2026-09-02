"use client";

import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { Maximize, Minimize, Pause, Play } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Intro video with a poster state and an in-place custom player.
 *
 * Player chrome (elastic scrubber, hover time caret, springy play/pause
 * overlay) adapted from skiper-ui #91, restyled to DAEMUN navy/white tokens.
 */
export function IntroVideo({
  src,
  poster,
  caption,
}: {
  src: string;
  poster: string;
  caption?: string;
}) {
  const [started, setStarted] = useState(false);

  return (
    <figure className="m-0 w-full">
      {started ? (
        <VideoPlayer src={src} poster={poster} />
      ) : (
        <div className="relative aspect-[1600/906] w-full overflow-hidden rounded-sm border border-line bg-navy">
          <button
            type="button"
            onClick={() => setStarted(true)}
            aria-label="Play video"
            className="group relative block h-full w-full cursor-pointer"
          >
            <Image
              src={poster}
              alt=""
              width={1600}
              height={906}
              className="h-full w-full object-cover opacity-90"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 group-hover:scale-105 sm:h-[72px] sm:w-[72px]">
              <Play
                className="ml-0.5 h-5 w-5 fill-navy text-navy sm:h-6 sm:w-6"
                aria-hidden
              />
            </span>
          </button>
        </div>
      )}
      {caption ? (
        <figcaption className="mt-3 text-[13px] text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export const VideoPlayer = ({ src, poster }: { src: string; poster: string }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTime = useMotionValue(0);
  const duration = useMotionValue(0);
  const isVideoHover = useMotionValue(0);
  const isPaused = useMotionValue(0);
  const wasPlayingBeforeScrubRef = useRef(false);
  const isScrubbingRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Video event setup and seamless (rAF) time updates
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      duration.set(videoElement.duration || 0);
      currentTime.set(videoElement.currentTime || 0);
    };

    const handleEnded = () => {
      currentTime.set(videoElement.duration || 0);
      isPaused.set(1);
    };

    let animationFrameId: number | null = null;
    const updateCurrentTime = () => {
      if (!isScrubbingRef.current && !videoElement.paused) {
        currentTime.set(videoElement.currentTime);
      }
      animationFrameId = requestAnimationFrame(updateCurrentTime);
    };

    const handlePlay = () => {
      isPaused.set(0);
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateCurrentTime);
      }
    };

    const handlePause = () => {
      isPaused.set(1);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (!isScrubbingRef.current) {
        currentTime.set(videoElement.currentTime);
      }
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    if (videoElement.readyState >= 1) {
      handleLoadedMetadata();
    }
    if (!videoElement.paused) {
      animationFrameId = requestAnimationFrame(updateCurrentTime);
    }

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentTime, duration, isPaused]);

  // Fullscreen tracking
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const playVideo = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (videoElement.currentTime >= videoElement.duration) {
      videoElement.currentTime = 0;
    }
    try {
      await videoElement.play();
    } catch {
      // Autoplay/play was blocked; the paused overlay stays visible.
    }
  }, []);

  const pauseVideo = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const handleTogglePlayback = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (videoElement.paused) {
      void playVideo();
    } else {
      pauseVideo();
    }
  }, [pauseVideo, playVideo]);

  const handleToggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (root && typeof root.requestFullscreen === "function") {
      void root.requestFullscreen();
      return;
    }
    // iOS Safari fallback: fullscreen the video element itself
    const videoElement = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    videoElement?.webkitEnterFullscreen?.();
  }, []);

  // Overlay shows on hover or while paused
  const overlayOpacity = useTransform(
    [isVideoHover, isPaused],
    (values: number[]) => Math.max(values[0] ?? 0, values[1] ?? 0),
  );

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => animate(isVideoHover, 1, { duration: 0.2 })}
      onMouseLeave={() => animate(isVideoHover, 0, { duration: 0.2 })}
      className={cn(
        "relative w-full overflow-hidden rounded-sm border border-line bg-navy",
        isFullscreen ? "flex items-stretch" : "aspect-[1600/906]",
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        playsInline
        preload="metadata"
        className={cn(
          "absolute inset-0 h-full w-full",
          isFullscreen ? "object-contain" : "object-cover",
        )}
      />
      <PlaybackButton
        opacity={overlayOpacity}
        onToggle={handleTogglePlayback}
        videoRef={videoRef}
      />
      <button
        type="button"
        onClick={handleToggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        className="absolute right-2 top-2 z-20 rounded-sm bg-navy/50 p-1.5 text-white/70 transition-colors hover:text-white"
      >
        {isFullscreen ? (
          <Minimize className="h-4 w-4" aria-hidden />
        ) : (
          <Maximize className="h-4 w-4" aria-hidden />
        )}
      </button>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent px-4 pb-5 pt-6 sm:px-6">
        <Scrubber
          currentTime={currentTime}
          duration={duration}
          onScrubStart={() => {
            const videoElement = videoRef.current;
            if (!videoElement) return;
            isScrubbingRef.current = true;
            wasPlayingBeforeScrubRef.current = !videoElement.paused;
            videoElement.pause();
          }}
          onChange={(nextValue) => {
            const videoElement = videoRef.current;
            if (!videoElement) return;
            const safeValue = Math.min(
              Math.max(nextValue, 0),
              duration.get() || 0,
            );
            videoElement.currentTime = safeValue;
            currentTime.set(safeValue);
          }}
          onScrubEnd={() => {
            isScrubbingRef.current = false;
            if (wasPlayingBeforeScrubRef.current) {
              void playVideo();
            }
          }}
        />
      </div>
    </div>
  );
};

const PlaybackButton = ({
  opacity,
  onToggle,
  videoRef,
}: {
  opacity: MotionValue<number>;
  onToggle: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const checkPlaying = () => {
      setIsPlaying(!videoElement.paused);
    };

    videoElement.addEventListener("play", checkPlaying);
    videoElement.addEventListener("pause", checkPlaying);
    checkPlaying();

    return () => {
      videoElement.removeEventListener("play", checkPlaying);
      videoElement.removeEventListener("pause", checkPlaying);
    };
  }, [videoRef]);

  return (
    <motion.button
      type="button"
      style={{ opacity }}
      onClick={onToggle}
      aria-label={isPlaying ? "Pause" : "Play"}
      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-navy/35"
    >
      <div className="relative flex size-8 items-center justify-center">
        <motion.span
          key="pause"
          animate={{ scale: isPlaying ? 1 : 0 }}
          transition={{ type: "spring", duration: 0.9, bounce: 0.6 }}
          style={{ transformOrigin: "20px" }}
          className="absolute flex size-full items-center justify-center"
        >
          <Pause className="size-full fill-white stroke-0" aria-hidden />
        </motion.span>
        <motion.span
          key="play"
          animate={{ scale: isPlaying ? 0 : 1 }}
          transition={{ type: "spring", duration: 0.9, bounce: 0.6 }}
          style={{ transformOrigin: "10px" }}
          className="absolute flex size-full items-center justify-center"
        >
          <Play className="size-full fill-white stroke-0" aria-hidden />
        </motion.span>
      </div>
    </motion.button>
  );
};

const HoverTimeDisplay = ({
  hoverTime,
}: {
  hoverTime: MotionValue<number>;
}) => {
  const [timeStr, setTimeStr] = useState("00:00");

  useMotionValueEvent(hoverTime, "change", (latest) => {
    setTimeStr(formatTime(latest));
  });

  return (
    <motion.span className="absolute top-0 -translate-y-full rounded-sm border border-white/15 bg-navy px-1 py-0.5 text-[10px] leading-none text-gold-soft">
      {timeStr}
    </motion.span>
  );
};

const MAX_OVERFLOW = 40;

interface ScrubberProps {
  currentTime: MotionValue<number>;
  duration: MotionValue<number>;
  onChange: (nextValue: number) => void;
  onScrubStart: () => void;
  onScrubEnd: () => void;
}

const Scrubber: React.FC<ScrubberProps> = ({
  currentTime,
  duration,
  onChange,
  onScrubStart,
  onScrubEnd,
}) => {
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const [durationStr, setDurationStr] = useState("00:00");

  const sliderRef = useRef<HTMLDivElement>(null);
  const hoverTime = useMotionValue(0);

  useMotionValueEvent(currentTime, "change", (latest) => {
    setCurrentTimeStr(formatTime(latest));
  });

  useMotionValueEvent(duration, "change", (latest) => {
    setDurationStr(formatTime(latest));
  });

  const region = useMotionValue(0);
  const clientX = useMotionValue(0);
  const caretX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(0.8);
  const opacity = useMotionValue(0);

  useMotionValueEvent(clientX, "change", (latest: number) => {
    if (!sliderRef.current) return;
    const { left, right } = sliderRef.current.getBoundingClientRect();
    let newValue: number;
    if (latest < left) {
      region.set(-1);
      newValue = left - latest;
    } else if (latest > right) {
      region.set(1);
      newValue = latest - right;
    } else {
      region.set(0);
      newValue = 0;
    }
    overflow.jump(decay(newValue, MAX_OVERFLOW));
  });

  const rangePercentage = useMotionValue(0);

  useMotionValueEvent(currentTime, "change", (val) => {
    const max = duration.get();
    if (!max) {
      rangePercentage.set(0);
      return;
    }
    rangePercentage.set(Math.min(Math.max((val / max) * 100, 0), 100));
  });

  useMotionValueEvent(duration, "change", () => {
    const val = currentTime.get();
    const max = duration.get();
    if (!max) {
      rangePercentage.set(0);
      return;
    }
    rangePercentage.set(Math.min(Math.max((val / max) * 100, 0), 100));
  });

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();

      clientX.set(event.clientX);

      let hoverX: number;
      if (region.get() > 0) {
        hoverX = bounds.width + overflow.get();
        caretX.set(hoverX);
      } else if (region.get() < 0) {
        hoverX = 0 - overflow.get();
        caretX.set(hoverX);
      } else {
        hoverX = event.clientX - bounds.left;
        caretX.set(hoverX);
      }

      if (sliderRef.current) {
        const { width } = sliderRef.current.getBoundingClientRect();
        const max = duration.get();
        if (max) {
          const hoverPercentage = Math.min(
            Math.max((hoverX / width) * 100, 0),
            100,
          );
          hoverTime.set((hoverPercentage / 100) * max);
        }
      }

      if (event.buttons > 0 && sliderRef.current) {
        const { left, width } = sliderRef.current.getBoundingClientRect();
        const max = duration.get();
        if (max) {
          const clampedClientX = Math.min(
            Math.max(event.clientX, left),
            left + width,
          );
          const ratio = (clampedClientX - left) / width;
          onChange(ratio * max);
        }
      }
    },
    [caretX, clientX, duration, hoverTime, onChange, overflow, region],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onScrubStart();
      handlePointerMove(event);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [handlePointerMove, onScrubStart],
  );

  const handlePointerUp = useCallback(() => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
    onScrubEnd();
    region.set(0);
  }, [onScrubEnd, overflow, region]);

  const handlePointerLeave = useCallback(() => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
    region.set(0);
  }, [overflow, region]);

  return (
    <div>
      {/* Scrubber bar */}
      <div className="relative flex h-8 items-center justify-center">
        <motion.div
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onHoverStart={() => {
            setIsSliderHovered(true);
            animate(scale, 1);
            animate(opacity, 1);
          }}
          onHoverEnd={() => {
            setIsSliderHovered(false);
            animate(scale, 0.8);
            animate(opacity, 0);
          }}
          style={{
            scale,
            opacity: useTransform(scale, [0.8, 1], [0.85, 1]),
          }}
          className="relative flex h-12 w-full cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing"
        >
          <div
            ref={sliderRef}
            className="absolute flex w-full flex-1 select-none items-center py-3"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <motion.div
              style={{
                scaleX: useTransform(overflow, (ov) => {
                  if (!sliderRef.current) return 1;
                  const { width } = sliderRef.current.getBoundingClientRect();
                  return 1 + ov / width;
                }),
                scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
                transformOrigin: useTransform(region, (r) => {
                  if (r < 0) return "right";
                  if (r > 0) return "left";
                  return "center";
                }),
                height: useTransform(scale, [0.8, 1], [5, 20]),
                marginTop: useTransform(scale, [0.8, 1], [0, -3]),
                marginBottom: useTransform(scale, [0.8, 1], [0, -3]),
              }}
              className="flex grow"
            >
              <div className="relative h-full grow overflow-hidden rounded-sm bg-white/25">
                <motion.div
                  style={{
                    clipPath: useTransform(
                      rangePercentage,
                      (pct: number) => `inset(0 ${100 - pct}% 0 0)`,
                    ),
                  }}
                  className="absolute h-full w-full bg-white/90"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.p
          style={{ opacity, x: caretX }}
          className="pointer-events-none absolute left-0 flex h-8 w-px items-center justify-center border-r border-gold-soft"
        >
          <HoverTimeDisplay hoverTime={hoverTime} />
        </motion.p>
      </div>

      {/* Time display */}
      <motion.div
        animate={{ y: isSliderHovered ? 6 : -4 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="pointer-events-none flex items-center justify-between text-[11px] text-white/70"
      >
        <span>{currentTimeStr}</span>
        <span>{durationStr}</span>
      </motion.div>
    </div>
  );
};

function decay(value: number, max: number): number {
  if (max === 0) {
    return 0;
  }
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "00:00";
  }
  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
