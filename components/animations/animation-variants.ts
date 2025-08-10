import { Variants } from "framer-motion";

// Basic fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

// Directional fade animations
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 50, 
      damping: 10,
      duration: 0.7
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 50, 
      damping: 10,
      duration: 0.7
    }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 50, 
      damping: 10,
      duration: 0.7
    }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 50, 
      damping: 10,
      duration: 0.7
    }
  }
};

// Special animations
export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 60, 
      damping: 12,
      duration: 0.8
    }
  }
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -5, scale: 0.95 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 70, 
      damping: 12,
      duration: 0.7
    }
  }
};

export const flipIn: Variants = {
  hidden: { opacity: 0, rotateX: -15 },
  visible: { 
    opacity: 1, 
    rotateX: 0,
    transition: { 
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Stagger animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      ease: "easeOut"
    }
  }
};

export const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      ease: "easeOut"
    }
  }
};

export const slowStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
      ease: "easeOut"
    }
  }
};

// Stagger items
export const staggerItemFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.6
    }
  }
};

export const staggerItemUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  }
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 70,
      damping: 12
    }
  }
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  }
};

export const staggerItemRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  }
};

// Special stagger items
export const staggerItemRotate: Variants = {
  hidden: { opacity: 0, rotate: -3, y: 20 },
  visible: {
    opacity: 1,
    rotate: 0,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 70,
      damping: 12
    }
  }
};

export const staggerItemFlip: Variants = {
  hidden: { opacity: 0, rotateY: -15, y: 20 },
  visible: {
    opacity: 1,
    rotateY: 0,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 70,
      damping: 12
    }
  }
};

// List item animations
export const listItemAnimation: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Card animations
export const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 60,
      damping: 12
    }
  }
};

// Hero section animations
export const heroTextAnimation: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 40,
      damping: 10,
      duration: 0.9
    }
  }
};

export const heroImageAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 40,
      damping: 12,
      delay: 0.2,
      duration: 1.0
    }
  }
}; 