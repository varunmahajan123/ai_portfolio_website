"use client";

import { motion } from "framer-motion";
import AnimatedButton from "./ui/AnimatedButton";
import Link from "next/link";
import { useState } from "react";
import ContactModal from "./ContactModal";

export default function Navbar() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 pointer-events-none"
            >
                <div className="pointer-events-auto">
                    <Link href="/" className="text-white text-lg font-bold tracking-tight mix-blend-difference hover:opacity-70 transition-opacity">
                        VM
                    </Link>
                </div>

                <div className="flex items-center gap-6 pointer-events-auto">
                    <AnimatedButton href="#projects" variant="ghost" className="text-sm font-medium mix-blend-difference">
                        Work
                    </AnimatedButton>

                    {/* Using standard link to avoid double-button nesting for simple anchors if needed, 
                       but AnimatedButton supports href which renders an <a>. 
                   */}

                    <AnimatedButton onClick={() => setIsContactOpen(true)} variant="ghost" className="text-sm font-medium mix-blend-difference">
                        Contact
                    </AnimatedButton>

                    <div className="hidden md:block">
                        <AnimatedButton onClick={() => setIsContactOpen(true)} variant="primary" className="text-black text-sm px-5 py-2">
                            Let's Talk
                        </AnimatedButton>
                    </div>
                </div>
            </motion.nav>
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}
