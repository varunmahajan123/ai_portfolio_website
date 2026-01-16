"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getSequenceData } from "@/app/actions/getSequenceData";
import Overlay from "./Overlay";

export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loading, setLoading] = useState(true);

    // Scroll progress for the entire container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const [frameCount, setFrameCount] = useState(0);
    const [sequencePath, setSequencePath] = useState("");

    useEffect(() => {
        // Fetch sequence data (count and path) from server
        const initSequence = async () => {
            const data = await getSequenceData();
            setFrameCount(data.frameCount);
            setSequencePath(data.sequencePath);
        };
        initSequence();
    }, []);

    useEffect(() => {
        if (frameCount === 0) return;

        // Preload images
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            for (let i = 0; i < frameCount; i++) {
                const img = new Image();
                // Format directly: frame_000.png
                // Using 3-digit padding as standardized in rename step
                const indexStr = i.toString().padStart(3, "0");
                img.src = `${sequencePath}/frame_${indexStr}.png`;
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
                loadedImages.push(img);
            }
            setImages(loadedImages);
            setLoading(false);
        };

        loadImages();
    }, [frameCount, sequencePath]);

    useEffect(() => {
        // Canvas rendering loop
        const render = (index: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx || !images[index]) return;

            // Draw image
            // Object-fit: cover logic
            const img = images[index];
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = img.width * (canvas.height / img.height);
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = img.height * (canvas.width / img.width);
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Update canvas size
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Re-render current frame if possible, or wait for next scroll update
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        // Subscribe to scroll changes to render frames
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            if (loading || images.length === 0) return;

            const frameIndex = Math.floor(latest * (images.length - 1));
            requestAnimationFrame(() => render(frameIndex));
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            unsubscribe();
        };
    }, [loading, images, scrollYProgress]);

    return (
        <div ref={containerRef} className="h-[500vh] w-full relative bg-[#121212]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                />
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                        Loading Sequence...
                    </div>
                )}
                <Overlay scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}
