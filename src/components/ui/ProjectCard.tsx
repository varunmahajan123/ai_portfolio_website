"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Github, Instagram, ExternalLink } from "lucide-react";
import React, { useRef } from "react";
import AnimatedButton from "./AnimatedButton";

interface ProjectLink {
    demo?: string;
    github?: string;
    instagram?: string;
}

interface ProjectCardProps {
    title: string;
    category: string;
    description: string;
    image: string;
    index: number;
    links?: ProjectLink;
}

export default function ProjectCard({ title, category, description, image, index, links }: ProjectCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
        <motion.div
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
            className="group relative h-full perspective-1000"
        >
            <div className="relative h-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-colors duration-500 hover:border-white/20">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                    <motion.img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[0.2,1,0.2,1] group-hover:scale-110"
                        style={{ transform: "translateZ(0px)" }} // Fix for safari flickering
                    />

                    {/* External Links Overlay */}
                    <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                        {links?.github && (
                            <AnimatedButton href={links.github} variant="icon" isExternal>
                                <Github size={20} />
                            </AnimatedButton>
                        )}
                        {links?.instagram && (
                            <AnimatedButton href={links.instagram} variant="icon" isExternal>
                                <Instagram size={20} />
                            </AnimatedButton>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 relative z-20" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-xs text-white/60 font-medium uppercase tracking-[0.2em]">{category}</p>
                        {links?.demo && (
                            <motion.a
                                href={links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                whileHover={{ scale: 1.2, rotate: 45 }}
                            >
                                <ArrowUpRight size={24} />
                            </motion.a>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-200 transition-colors">{title}</h3>
                    <p className="text-white/70 leading-relaxed text-sm line-clamp-3">{description}</p>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-blue-500/10 to-transparent" />
            </div>
        </motion.div>
    );
}
