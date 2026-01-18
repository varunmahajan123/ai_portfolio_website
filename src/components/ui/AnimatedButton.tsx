"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    href?: string;
    variant?: "primary" | "secondary" | "ghost" | "icon";
    isExternal?: boolean;
}

export default function AnimatedButton({
    children,
    onClick,
    className,
    href,
    variant = "primary",
    isExternal = false,
}: AnimatedButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
        primary: "bg-white text-black px-6 py-3 rounded-full hover:bg-white/90",
        secondary: "bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 backdrop-blur-sm border border-white/10",
        ghost: "bg-transparent text-white hover:text-white/80 px-4 py-2",
        icon: "p-2 rounded-full hover:bg-white/10 text-white",
    };

    const content = (
        <motion.div
            className={cn(baseStyles, variants[variant], className)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );

    if (href) {
        return (
            <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                onClick={onClick}
            >
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick}>
            {content}
        </button>
    );
}
