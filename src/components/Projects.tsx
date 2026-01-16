"use client";

import { motion } from "framer-motion";

const projects = [
    {
        id: 1,
        title: "Neon Nexus",
        category: "Cyberpunk E-commerce",
        description: "A futuristic shopping experience built with WebGL and Next.js.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Aether Lens",
        category: "Photography Portfolio",
        description: "Minimalist portfolio featuring masonry layout and seamless transitions.",
        image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2070&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Orbital Dash",
        category: "WebGL Game",
        description: "Browser-based racing game using Three.js and React Three Fiber.",
        image: "https://images.unsplash.com/photo-1614726365723-49cfae927846?q=80&w=1974&auto=format&fit=crop",
    },
];

export default function Projects() {
    return (
        <section className="relative z-20 bg-[#121212] py-32 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tighter">
                        Selected Works
                    </h2>
                    <p className="hidden md:block text-white/40 text-sm tracking-widest uppercase">
                        01 — 03
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:border-white/20"
                        >
                            <div className="aspect-[16/10] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-[0.2,1,0.2,1]"
                                />
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-xs text-white/50 font-medium uppercase tracking-[0.2em]">{project.category}</p>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 text-white">
                                        ↗
                                    </span>
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight group-hover:text-white/90">{project.title}</h3>
                                <p className="text-white/60 leading-relaxed text-sm">{project.description}</p>

                                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    View Case Study
                                </div>
                            </div>

                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-t from-black/50 to-transparent" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
