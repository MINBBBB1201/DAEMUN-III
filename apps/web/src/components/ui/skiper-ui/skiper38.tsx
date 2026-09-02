"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Menu, Plus } from "lucide-react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

// Types
type MenuItem = {
  title: string;
  items: string[];
};

type MenuContent = {
  firstUl: MenuItem;
  secondUl: MenuItem;
  thirdUl: MenuItem;
};

type MenuData = Record<string, MenuContent>;

// Data
const NAVIGATION_ITEMS = [
  "Store",
  "Mac",
  "iPad",
  "iPhone",
  "Watch",
  "AirPods",
  "Vision",
  "TV & Home",
  "Entertainment",
  "Support",
] as const;

const MENU_CONTENT: MenuData = {
  Store: {
    firstUl: {
      title: "Shop",
      items: [
        "Shop the latest",
        "Mac",
        "iPad",
        "iPhone",
        "Watch",
        "AirPods",
        "Vision",
      ],
    },
    secondUl: {
      title: "Quick Links",
      items: [
        "find a store",
        "Help me choose",
        "Check order status",
        "Contact us",
      ],
    },
    thirdUl: {
      title: "Shop Special Features",
      items: [
        "find a store",
        "Help me choose",
        "Check order status",
        "Contact us",
      ],
    },
  },
  Mac: {
    firstUl: {
      title: "Mac",
      items: [
        "Shop Mac",
        "MacBook Air",
        "MacBook Pro",
        "iMac",
        "Mac mini",
        "Mac Studio",
        "Mac Pro",
      ],
    },
    secondUl: {
      title: "Compare Mac",
      items: [
        "Choose your Mac",
        "Mac vs PC",
        "Which Mac is right for you?",
        "Shop with a Specialist",
      ],
    },
    thirdUl: {
      title: "More from Mac",
      items: [
        "Mac Support",
        "AppleCare+ for Mac",
        "macOS Sonoma",
        "Continuity",
      ],
    },
  },
  iPad: {
    firstUl: {
      title: "iPad",
      items: [
        "Shop iPad",
        "iPad Pro",
        "iPad Air",
        "iPad",
        "iPad mini",
        "Apple Pencil",
        "Smart Keyboard",
      ],
    },
    secondUl: {
      title: "Compare iPad",
      items: [
        "Choose your iPad",
        "iPad vs MacBook",
        "Which iPad is right for you?",
        "Shop with a Specialist",
      ],
    },
    thirdUl: {
      title: "More from iPad",
      items: [
        "iPad Support",
        "AppleCare+ for iPad",
        "iPadOS 17",
        "Apple Pencil",
      ],
    },
  },
  iPhone: {
    firstUl: {
      title: "iPhone",
      items: [
        "Shop iPhone",
        "iPhone 15 Pro",
        "iPhone 15",
        "iPhone 14",
        "iPhone SE",
        "Compare iPhone",
        "AirPods",
      ],
    },
    secondUl: {
      title: "Switch to iPhone",
      items: [
        "Move to iOS",
        "Shop iPhone",
        "iPhone at Work",
        "Shop with a Specialist",
      ],
    },
    thirdUl: {
      title: "More from iPhone",
      items: ["iPhone Support", "AppleCare+ for iPhone", "iOS 17", "Privacy"],
    },
  },
  Watch: {
    firstUl: {
      title: "Watch",
      items: [
        "Shop Apple Watch",
        "Apple Watch Series 9",
        "Apple Watch SE",
        "Apple Watch Ultra 2",
        "Compare Apple Watch",
        "Apple Watch Studio",
      ],
    },
    secondUl: {
      title: "More from Watch",
      items: [
        "Apple Watch Support",
        "AppleCare+ for Apple Watch",
        "watchOS 10",
        "Apple Fitness+",
      ],
    },
    thirdUl: {
      title: "Shop Watch Accessories",
      items: ["Apple Watch Bands", "AirPods", "Apple TV+", "Apple One"],
    },
  },
  AirPods: {
    firstUl: {
      title: "AirPods",
      items: [
        "Shop AirPods",
        "AirPods Pro",
        "AirPods",
        "AirPods Max",
        "AirPods (3rd generation)",
        "Compare AirPods",
      ],
    },
    secondUl: {
      title: "More from AirPods",
      items: [
        "AirPods Support",
        "AppleCare+ for AirPods",
        "Apple Music",
        "Spatial Audio",
      ],
    },
    thirdUl: {
      title: "Shop Accessories",
      items: [
        "AirPods Cases",
        "Lightning Cables",
        "Wireless Charging",
        "Apple TV+",
      ],
    },
  },
  Vision: {
    firstUl: {
      title: "Vision",
      items: [
        "Shop Apple Vision Pro",
        "Apple Vision Pro",
        "Compare Apple Vision Pro",
        "AppleCare+ for Vision Pro",
      ],
    },
    secondUl: {
      title: "More from Vision",
      items: ["Vision Pro Support", "visionOS", "Apple TV+", "Apple Arcade"],
    },
    thirdUl: {
      title: "Shop Accessories",
      items: [
        "Vision Pro Accessories",
        "Apple TV+",
        "Apple Music",
        "Apple One",
      ],
    },
  },
  "TV & Home": {
    firstUl: {
      title: "TV & Home",
      items: [
        "Shop Apple TV",
        "Apple TV 4K",
        "Apple TV+",
        "HomePod",
        "HomePod mini",
        "Apple TV app",
      ],
    },
    secondUl: {
      title: "More from TV & Home",
      items: [
        "Apple TV Support",
        "HomePod Support",
        "AppleCare+",
        "Apple Music",
      ],
    },
    thirdUl: {
      title: "Shop Accessories",
      items: ["Apple TV Remote", "HomeKit", "Apple TV+", "Apple Arcade"],
    },
  },
  Entertainment: {
    firstUl: {
      title: "Entertainment",
      items: [
        "Apple TV+",
        "Apple Music",
        "Apple Arcade",
        "Apple Podcasts",
        "Apple Books",
        "App Store",
      ],
    },
    secondUl: {
      title: "Support",
      items: [
        "Apple TV+ Support",
        "Apple Music Support",
        "Apple Arcade Support",
        "Apple Books Support",
      ],
    },
    thirdUl: {
      title: "Account",
      items: ["Manage your Apple ID", "Apple One", "Apple Account", "Privacy"],
    },
  },
  Support: {
    firstUl: {
      title: "Support",
      items: [
        "Apple Support",
        "AppleCare+",
        "AppleCare Products",
        "Apple Support App",
        "Apple Support Community",
      ],
    },
    secondUl: {
      title: "More from Support",
      items: [
        "Contact Apple Support",
        "Apple Support Phone Numbers",
        "Apple Support Chat",
        "Apple Support Email",
      ],
    },
    thirdUl: {
      title: "Resources",
      items: [
        "Apple Manuals",
        "Apple Software Downloads",
        "Apple Service Programs",
        "Apple Legal",
      ],
    },
  },
};

// Animation variants
const menuItemVariants = {
  hidden: { opacity: 0, y: "-20%" },
  visible: { opacity: 1, y: 0 },
};

const menuContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// Components
const MenuSection = ({
  title,
  items,
  isLarge = false,
}: {
  title: string;
  items: string[];
  isLarge?: boolean;
}) => (
  <motion.ul
    className="space-y-2"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={menuContainerVariants}
  >
    <motion.li
      variants={menuItemVariants}
      transition={{ duration: 0.3 }}
      className="my-4 text-xs opacity-50"
    >
      {title}
    </motion.li>
    {items.map((item, index) => (
      <motion.li
        key={index}
        variants={menuItemVariants}
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer tracking-tight",
          isLarge
            ? "group relative flex items-center text-2xl font-[600]"
            : "text-sm font-[500]",
        )}
      >
        {item}
        {isLarge && (
          <ChevronRight className="absolute -right-10 size-6 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
        )}
      </motion.li>
    ))}
  </motion.ul>
);

const AppleIcon = ({
  children,
  isMenuOpen,
}: {
  children: React.ReactNode;
  isMenuOpen: boolean;
}) => (
  <motion.span
    animate={{ opacity: isMenuOpen ? 0 : 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.span>
);

const AppleSearch = () => (
  <svg
    className="h-12 lg:h-10"
    viewBox="0 0 17 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m16.2294 29.9556-4.1755-4.0821a6.4711 6.4711 0 1 0 -1.2839 1.2625l4.2005 4.1066a.9.9 0 1 0 1.2588-1.287zm-14.5294-8.0017a5.2455 5.2455 0 1 1 5.2455 5.2527 5.2549 5.2549 0 0 1 -5.2455-5.2527z" />
  </svg>
);

const AppleBag = () => (
  <svg
    className="h-12 lg:h-10"
    viewBox="0 0 17 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m13.4575 16.9268h-1.1353a3.8394 3.8394 0 0 0 -7.6444 0h-1.1353a2.6032 2.6032 0 0 0 -2.6 2.6v8.9232a2.6032 2.6032 0 0 0 2.6 2.6h9.915a2.6032 2.6032 0 0 0 2.6-2.6v-8.9231a2.6032 2.6032 0 0 0 -2.6-2.6001zm-4.9575-2.2768a2.658 2.658 0 0 1 2.6221 2.2764h-5.2442a2.658 2.658 0 0 1 2.6221-2.2764zm6.3574 13.8a1.4014 1.4014 0 0 1 -1.4 1.4h-9.9149a1.4014 1.4014 0 0 1 -1.4-1.4v-8.9231a1.4014 1.4014 0 0 1 1.4-1.4h9.915a1.4014 1.4014 0 0 1 1.4 1.4z" />
  </svg>
);

const MobileMenu = ({
  items,
  isOpen,
}: {
  items: readonly string[];
  isOpen: boolean;
}) => (
  <div className="pt-15 h-screen w-screen bg-white backdrop-blur-2xl">
    <motion.ul
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
          },
        },
      }}
      className="flex flex-col gap-5 text-3xl font-[600] tracking-tight"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={{
            hidden: { opacity: 0, y: "-10%" },
            visible: { opacity: 1, y: 0 },
          }}
          className="group relative flex cursor-pointer items-center justify-between px-8"
        >
          {item}
          <ChevronRight className="size-6 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
        </motion.li>
      ))}
    </motion.ul>
  </div>
);

const AppleNavbar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentContent = hoveredItem ? MENU_CONTENT[hoveredItem] : null;
  const showMenu = hoveredItem || isMenuOpen;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="absolute top-0 flex w-screen flex-col items-center justify-center">
      {/* Header */}
      <div className="relative z-20 flex w-full items-center justify-center bg-white">
        <ul className="flex w-full max-w-[1024px] items-center justify-between gap-5 bg-white px-5 text-xs lg:px-0">
          <motion.li
            className="text-lg"
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            
          </motion.li>

          {/* Desktop Navigation */}
          {NAVIGATION_ITEMS.map((item, index) => (
            <li
              key={index}
              className="hidden cursor-pointer lg:block"
              onMouseEnter={() => setHoveredItem(item)}
            >
              {item}
            </li>
          ))}

          {/* Icons */}
          <li className="flex items-center justify-center gap-5 lg:gap-8">
            <AppleIcon isMenuOpen={isMenuOpen}>
              <AppleSearch />
            </AppleIcon>
            <AppleIcon isMenuOpen={isMenuOpen}>
              <AppleBag />
            </AppleIcon>
            <span className="cursor-pointer" onClick={toggleMenu}>
              {!isMenuOpen ? (
                <Menu className="block size-6 stroke-[1] lg:hidden lg:size-4" />
              ) : (
                <Plus className="block size-6 -rotate-45 stroke-[1] lg:hidden lg:size-4" />
              )}
            </span>
          </li>
        </ul>
      </div>

      {/* Dropdown Menu */}
      <motion.div
        initial={{ height: "0px" }}
        animate={{ height: showMenu ? "auto" : "0" }}
        transition={{ ease: [0.645, 0.045, 0.355, 1], duration: 0.5 }}
        onMouseLeave={() => setHoveredItem(null)}
        className="relative z-20 flex w-full justify-center overflow-hidden bg-white"
      >
        <AnimatePresence>
          {currentContent && (
            <motion.div
              exit={{
                opacity: 0,
                transition: { duration: 0.4, delay: 0.5 },
              }}
              className="flex w-full max-w-[1024px] gap-32 pb-20 pt-10"
            >
              <MenuSection
                title={currentContent.firstUl.title}
                items={currentContent.firstUl.items}
                isLarge
              />
              <MenuSection
                title={currentContent.secondUl.title}
                items={currentContent.secondUl.items}
              />
              <MenuSection
                title={currentContent.thirdUl.title}
                items={currentContent.thirdUl.items}
              />
            </motion.div>
          )}

          {isMenuOpen && (
            <MobileMenu items={NAVIGATION_ITEMS} isOpen={isMenuOpen} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hoveredItem ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="pointer-events-none absolute left-0 top-0 z-10 h-screen w-screen bg-white/20 blur-lg backdrop-blur-xl"
      />
    </nav>
  );
};

// Main Component
const Skiper38 = () => {
  return (
    <div className="relative h-full w-full bg-[#F2F2F4] text-black">
      <AppleNavbar />
      {/* Background Image */}
      <img
        className="absolute left-0 h-[calc(100vh-1rem)] w-full rounded-2xl object-cover"
        src="https://pbs.twimg.com/media/GwY_Uc6bsAETDCF?format=jpg&name=4096x4096"
        alt=""
      />
    </div>
  );
};

export { AppleNavbar, Skiper38 };

/**
 * Skiper 38 Navbar_002 — React + framer motion
 * Inspired by and adapted from https://apple.com
 * Illustrations by Aarzoo Aly  https://x.com/AarzooAly
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the apple.com . They’re independent recreations meant to study interaction design
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
