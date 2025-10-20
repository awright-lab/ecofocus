"use client";

import { motion } from "framer-motion";
import type { ReactNode, ElementType } from "react";

export function FadeUp({
  as: Tag = "div",
  delay = 0,
  children,
  className = "",
}: {
  as?: ElementType;
  delay?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
