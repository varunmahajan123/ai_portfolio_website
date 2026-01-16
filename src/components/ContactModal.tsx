"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { sendEmail } from "@/app/actions/sendEmail";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");

        const formData = new FormData(e.currentTarget);
        const result = await sendEmail(formData);

        if (result.success) {
            setStatus("success");
            setTimeout(() => {
                onClose();
                setStatus("idle");
            }, 2000);
        } else {
            setStatus("error");
        }
        setLoading(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
                    />
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-[#1a1a1a] border border-white/10 p-8 md:p-12 rounded-2xl pointer-events-auto relative shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                ✕
                            </button>

                            <h2 className="text-3xl font-medium text-white mb-2">Let's talk.</h2>
                            <p className="text-white/50 mb-8 text-sm">Tell me about your project or just say hello.</p>

                            {status === "success" ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xl mb-4">
                                        ✓
                                    </div>
                                    <h3 className="text-xl text-white font-medium">Message sent!</h3>
                                    <p className="text-white/50 mt-2">I'll get back to you soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-xs uppercase tracking-wider text-white/40 mb-2">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-xs uppercase tracking-wider text-white/40 mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-xs uppercase tracking-wider text-white/40 mb-2">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                            placeholder="What's on your mind?"
                                        />
                                    </div>

                                    {status === "error" && (
                                        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white text-black font-medium py-3 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                        ) : (
                                            "Send Message"
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
