"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React, { useRef } from "react";

interface SocialCardProps {
    id: string;
    title: string;
    category: string;
    description: string;
    url: string;
    color: string; // Tailwind gradient classes
    image?: string; // made optional to satisfy TS if data misses it temporarily
    index: number;
}

export default function SocialCard({ id, title, category, url, color, image, index }: SocialCardProps) {
    const ref = useRef<HTMLAnchorElement>(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="group relative h-[320px] perspective-1000 block cursor-pointer"
        >
            <div className="relative h-full flex flex-col items-center justify-center p-8 overflow-hidden rounded-3xl bg-[#1a1a1a] border border-white/5 transition-all duration-500 group-hover:border-white/20 shadow-2xl group-hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]">

                {/* Mid-hover Glow / Bloom */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${color} blur-2xl`} />
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] ${color}`} />

                {/* Arrow Icon Top Right */}
                <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white/50 group-hover:text-white" style={{ transform: "translateZ(30px)" }}>
                    <ArrowUpRight size={24} />
                </div>

                {/* Logo Image */}
                <div className="relative z-10 w-24 h-24 mb-6 transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl" style={{ transform: "translateZ(50px)" }}>
                    {image && (
                        <div className="relative w-full h-full">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    )}
                </div>

                {/* Minimal Label */}
                <div className="relative z-10 text-center" style={{ transform: "translateZ(30px)" }}>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-[0.2em] mb-2 group-hover:text-white/60 transition-colors">{category}</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                        {title}
                    </h3>
                </div>
            </div>
        </motion.a>
    );
}
