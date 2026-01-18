"use client";

import { motion } from "framer-motion";
import SocialCard from "./ui/SocialCard";
import { SOCIALS } from "@/lib/data";

export default function Projects() {
    return (
        <section className="relative z-20 bg-[#121212] py-32 px-4 md:px-12" id="projects">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tighter">
                        Connect
                    </h2>
                    <p className="hidden md:block text-white/40 text-sm tracking-widest uppercase">
                        Social — Hub
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                    {SOCIALS.map((social, index) => (
                        <SocialCard
                            key={social.id}
                            index={index}
                            {...social}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
