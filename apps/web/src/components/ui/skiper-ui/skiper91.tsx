"use client";

import { Pause, Play } from "lucide-react";
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const Skiper91 = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTime = useMotionValue(0);
  const duration = useMotionValue(0);
  const isVideoHover = useMotionValue(0);
  const wasPlayingBeforeScrubRef = useRef(false);
  const isScrubbingRef = useRef(false);

  // Single useEffect for video event setup and seamless time updates
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      duration.set(videoElement.duration || 0);
      currentTime.set(videoElement.currentTime || 0);
    };

    const handleEnded = () => {
      currentTime.set(videoElement.duration || 0);
    };

    // Use requestAnimationFrame for seamless updates (60fps)
    let animationFrameId: number | null = null;
    const updateCurrentTime = () => {
      if (!isScrubbingRef.current && !videoElement.paused) {
        currentTime.set(videoElement.currentTime);
      }
      animationFrameId = requestAnimationFrame(updateCurrentTime);
    };

    // Start the animation loop when video is playing
    const handlePlay = () => {
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updateCurrentTime);
      }
    };

    const handlePause = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      // Update one final time on pause
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

    // Start animation loop if video is already playing
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
  }, [currentTime, duration]);

  const playVideo = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.currentTime >= videoElement.duration) {
      videoElement.currentTime = 0;
    }

    try {
      await videoElement.play();
    } catch (error) {
      console.error("Failed to play video", error);
    }
  }, []);

  const pauseVideo = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.pause();
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

  // Transform hover motion value to opacity (0 or 1)
  const hoverOpacity = useTransform(isVideoHover, [0, 1], [0, 1]);

  return (
    <div className={cn("flex h-full w-full items-center justify-center")}>
      <div
        className={cn(
          "bg-background py-15 flex w-full max-w-3xl flex-col items-center justify-center gap-10 rounded-[50px]",
        )}
      >
        <motion.div
          onMouseEnter={() => isVideoHover.set(1)}
          onMouseLeave={() => isVideoHover.set(0)}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
          }}
          className={cn(
            "aspect-1180/2556 rounded-4xl relative z-20 max-h-[500px] origin-top overflow-hidden",
          )}
        >
          <video
            ref={videoRef}
            autoPlay
            className={cn("h-full w-full object-cover")}
            src="/video/random/iphone.mp4"
            playsInline
            preload="metadata"
            muted
          />
          <PlaybackButton
            opacity={hoverOpacity}
            onToggle={handleTogglePlayback}
            videoRef={videoRef}
          />
        </motion.div>
        <div className={cn("flex w-full max-w-md flex-col gap-3 px-6")}>
          <Slider
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
      <p className="text-muted-foreground absolute top-5 text-xs">
        Inspired by{" "}
        <a
          href="https://www.spottedinprod.com/blog/any-distance-goes-open-source"
          target="_blank"
          className="hover:text-foreground underline"
        >
          Spotted in Prod
        </a>
      </p>
    </div>
  );
};

export { Skiper91 };

// PlaybackButton component using state
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

  // Update isPlaying motion value when video state changes
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
      transition={{ duration: 0.24, ease: "easeOut" }}
      onClick={onToggle}
      className={cn(
        "text-background absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30",
      )}
    >
      <div className={cn("relative flex size-8 items-center justify-center")}>
        <motion.span
          key="pause"
          animate={{
            scale: isPlaying ? 1 : 0,
          }}
          transition={{
            type: "spring",
            duration: 0.9,
            bounce: 0.6,
          }}
          style={{
            transformOrigin: "20px",
          }}
          className={cn("absolute flex size-full items-center justify-center")}
        >
          <Pause className={cn("size-full fill-white stroke-0")} />
        </motion.span>
        <motion.span
          key="play"
          animate={{
            scale: isPlaying ? 0 : 1,
          }}
          transition={{
            type: "spring",
            duration: 0.9,
            bounce: 0.6,
          }}
          style={{
            transformOrigin: "10px",
          }}
          className={cn("absolute flex size-full items-center justify-center")}
        >
          <Play className={cn("size-full fill-white stroke-0")} />
        </motion.span>
      </div>
    </motion.button>
  );
};

// HoverTimeDisplay component using motion value
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
    <motion.span
      className={cn(
        "bg-background absolute top-0 -translate-y-full rounded px-1 py-0.5 text-[10px] leading-none text-orange-500",
      )}
    >
      {timeStr}
    </motion.span>
  );
};

const MAX_OVERFLOW = 50;

interface SliderProps {
  currentTime: MotionValue<number>;
  duration: MotionValue<number>;
  onChange: (nextValue: number) => void;
  onScrubStart: () => void;
  onScrubEnd: () => void;
}

const Slider: React.FC<SliderProps> = ({
  currentTime,
  duration,
  onChange,
  onScrubStart,
  onScrubEnd,
}) => {
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("0:00");

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
  const CaretX = useMotionValue(0);
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

  // Create a seamless transform that calculates percentage from motion values
  // This will update smoothly at 60fps as currentTime motion value updates
  // We use useMotionValueEvent to make it reactive to duration changes too
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

      // Always update clientX for overflow calculation (works on hover and drag)
      clientX.set(event.clientX);

      let hoverX: number;
      if (region.get() > 0) {
        hoverX = bounds.width + overflow.get();
        CaretX.set(hoverX);
      } else if (region.get() < 0) {
        hoverX = 0 - overflow.get();
        CaretX.set(hoverX);
      } else {
        hoverX = event.clientX - bounds.left;
        CaretX.set(hoverX);
      }

      // Calculate hover time based on hover position
      if (sliderRef.current) {
        const { width } = sliderRef.current.getBoundingClientRect();
        const max = duration.get();
        if (max) {
          const hoverPercentage = Math.min(
            Math.max((hoverX / width) * 100, 0),
            100,
          );
          const calculatedHoverTime = (hoverPercentage / 100) * max;
          hoverTime.set(calculatedHoverTime);
        }
      }

      // Only update video time when actively dragging
      if (event.buttons > 0 && sliderRef.current) {
        const { left, width } = sliderRef.current.getBoundingClientRect();
        const max = duration.get();
        if (max) {
          const clampedClientX = Math.min(
            Math.max(event.clientX, left),
            left + width,
          );
          const ratio = (clampedClientX - left) / width;
          const nextValue = ratio * max;
          onChange(nextValue);
        }
      }
    },
    [CaretX, clientX, duration, hoverTime, onChange, overflow, region],
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
    <div className="">
      {/* Slider */}
      <div className={cn("relative flex h-10 items-center justify-center")}>
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
            opacity: useTransform(scale, [0.8, 1], [0.7, 1]),
          }}
          className={cn(
            "relative flex h-20 w-full cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing",
          )}
        >
          <div
            ref={sliderRef}
            className={cn(
              "absolute flex w-full flex-1 select-none items-center py-4",
            )}
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
                  if (r < 0) return "right"; // Left overflow - scale from right
                  if (r > 0) return "left"; // Right overflow - scale from left
                  return "center"; // No overflow
                }),
                height: useTransform(scale, [0.8, 1], [6, 28]),
                marginTop: useTransform(scale, [0.8, 1], [0, -3]),
                marginBottom: useTransform(scale, [0.8, 1], [0, -3]),
              }}
              className={cn("flex grow")}
            >
              <div
                className={cn(
                  "bg-muted relative h-full grow overflow-hidden rounded-lg",
                )}
              >
                <motion.div
                  style={{
                    clipPath: useTransform(
                      rangePercentage,
                      (pct: number) => `inset(0 ${100 - pct}% 0 0)`,
                    ),
                  }}
                  className={cn("bg-foreground/80 absolute h-full w-full")}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.p
          style={{ opacity, x: CaretX }}
          className={cn(
            "pointer-events-none absolute left-0 flex h-10 w-px items-center justify-center border-r border-orange-500",
          )}
        >
          <HoverTimeDisplay hoverTime={hoverTime} />
        </motion.p>
      </div>

      {/* Time display */}
      <motion.div
        animate={{
          y: isSliderHovered ? 10 : -27,
        }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="pointer-events-none flex items-center justify-between text-xs"
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
