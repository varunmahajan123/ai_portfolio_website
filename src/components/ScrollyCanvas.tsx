"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { getSequenceData } from "@/app/actions/getSequenceData";
import Overlay from "./Overlay";

export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use refs for heavy data to avoid re-renders
    const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
    const framesLoadedRef = useRef<boolean[]>([]);
    const frameCountRef = useRef(0);
    const sequencePathRef = useRef("");

    // Track initialization state
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    // Scroll progress for the entire container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const render = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        // Find the closest loaded frame if the current one isn't ready
        // First check the exact frame
        let frameToDraw = -1;

        if (framesLoadedRef.current[index] && imagesRef.current[index]) {
            frameToDraw = index;
        } else {
            // Search backwards for closest loaded frame
            for (let i = index - 1; i >= 0; i--) {
                if (framesLoadedRef.current[i] && imagesRef.current[i]) {
                    frameToDraw = i;
                    break;
                }
            }
            // If no previous frame, try searching forwards (rare, but good fallback for start)
            if (frameToDraw === -1) {
                for (let i = index + 1; i < frameCountRef.current; i++) {
                    if (framesLoadedRef.current[i] && imagesRef.current[i]) {
                        frameToDraw = i;
                        break;
                    }
                }
            }
        }

        if (frameToDraw === -1) return; // Nothing to draw yet

        const img = imagesRef.current[frameToDraw];
        if (!img) return;

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
    }, []);

    // Setup and Progressive Loading
    useEffect(() => {
        let isMounted = true;

        const initSequence = async () => {
            try {
                const data = await getSequenceData();
                if (!isMounted) return;

                frameCountRef.current = data.frameCount;
                sequencePathRef.current = data.sequencePath;

                // Initialize arrays
                imagesRef.current = new Array(data.frameCount).fill(null);
                framesLoadedRef.current = new Array(data.frameCount).fill(false);

                // Load Frame 0 IMMEDIATELY for LCP
                if (data.frameCount > 0) {
                    const img0 = new Image();
                    img0.src = `${data.sequencePath}/frame_000.png`;
                    img0.onload = () => {
                        if (!isMounted) return;
                        imagesRef.current[0] = img0;
                        framesLoadedRef.current[0] = true;
                        setIsCanvasReady(true); // Reveal canvas
                        render(0);

                        // Start loading the rest sequentially
                        loadRemainingFrames(data.sequencePath, data.frameCount);
                    };
                }
            } catch (error) {
                console.error("Failed to load sequence data", error);
            }
        };

        const loadRemainingFrames = async (path: string, count: number) => {
            // Load remaining frames in small batches to not block main thread
            const batchSize = 5;

            for (let i = 1; i < count; i += batchSize) {
                if (!isMounted) return;

                const promises = [];
                for (let j = i; j < i + batchSize && j < count; j++) {
                    promises.push(new Promise<void>((resolve) => {
                        const img = new Image();
                        const indexStr = j.toString().padStart(3, "0");
                        img.src = `${path}/frame_${indexStr}.png`;
                        img.onload = () => {
                            if (isMounted) {
                                imagesRef.current[j] = img;
                                framesLoadedRef.current[j] = true;
                            }
                            resolve();
                        };
                        img.onerror = () => resolve(); // Validate fail silently
                    }));
                }

                // Wait for this batch, then yield to main thread 
                await Promise.all(promises);
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        };

        if (frameCountRef.current === 0) {
            initSequence();
        }

        return () => { isMounted = false; };
    }, [render]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Re-render current frame based on scroll
                const latest = scrollYProgress.get();
                const frameIndex = Math.floor(latest * (frameCountRef.current - 1));
                render(Math.max(0, frameIndex));
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [scrollYProgress, render]);

    // Update on Scroll
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (frameCountRef.current === 0) return;
        const frameIndex = Math.floor(latest * (frameCountRef.current - 1));
        requestAnimationFrame(() => render(frameIndex));
    });

    return (
        <div ref={containerRef} className="h-[500vh] w-full relative bg-[#121212]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className={`w-full h-full object-cover transition-opacity duration-700 ${isCanvasReady ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* 
                   Removed blocking loader. 
                   The Overlay is always visible now so text appears instantly.
                 */}
                <Overlay scrollYProgress={scrollYProgress} />
            </div>
        </div>
    );
}
