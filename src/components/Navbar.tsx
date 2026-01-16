"use client";

import { motion } from "framer-motion";
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
                    <Link
                        href="#work"
                        className="text-sm font-medium text-white/80 hover:text-white transition-colors mix-blend-difference"
                    >
                        Work
                    </Link>
                    <Link
                        href="#about"
                        className="text-sm font-medium text-white/80 hover:text-white transition-colors mix-blend-difference"
                    >
                        About
                    </Link>
                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="text-sm font-medium text-white/80 hover:text-white transition-colors mix-blend-difference"
                    >
                        Contact
                    </button>

                    <button
                        onClick={() => setIsContactOpen(true)}
                        className="hidden md:block px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:scale-105 transition-transform duration-300"
                    >
                        Let's Talk
                    </button>
                </div>
            </motion.nav>
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}
