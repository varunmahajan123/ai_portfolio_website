"use client";

import { useTransform, motion, MotionValue } from "framer-motion";

interface OverlayProps {
    scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
    // We need to link this to the same scroll timeline as the canvas.
    // Since ScrollyCanvas controls the height (500vh), we can assume this overlay 
    // sits on top of that same height or listens to window scroll if fixed.
    // However, the best approach is to have this overlay inside the same relative container 
    // or use the window scroll if it's position fixed.
    // Given the structure, `ScrollyCanvas` has the 500vh height. 
    // We should probably place this Overlay *inside* the ScrollyCanvas or 
    // as a sibling that also spans 500vh or is fixed.
    // Let's assume this component is rendered *inside* the sticky container or 
    // as a fixed sibling.

    // Actually, to make it easier, let's use the window scroll for now, 
    // or accept the scroll progress as a prop if we want tight coupling.
    // But independent `useScroll` works fine if the document height is 500vh.
    // Wait, `ScrollyCanvas` is 500vh. So the window scroll will drive everything.

    // Animations for Section 1: "My Name. Creative Developer." (0% - 20%)
    const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -30]);

    // Animations for Section 2: "I build digital experiences." (25% - 50%)
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.55], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.25, 0.55], [40, -40]);

    // Animations for Section 3: "Bridging design and engineering." (55% - 85%)
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.75, 0.85], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.55, 0.85], [40, -40]);


    return (
        <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-center text-white mix-blend-exclusion">
            {/* Section 1: Center */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
                <h1 className="text-[12vw] leading-none font-bold tracking-tighter mb-2">
                    VARUN
                </h1>
                <p className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase opacity-70">
                    Creative Developer
                </p>
            </motion.div>

            {/* Section 2: Corner */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="absolute inset-0 flex items-center justify-center md:justify-start p-12 md:p-32"
            >
                <h2 className="text-4xl md:text-6xl font-medium max-w-xl leading-[1.1] tracking-tight">
                    Crafting digital <br />
                    <span className="italic font-light opacity-80">experiences</span> that breathe.
                </h2>
            </motion.div>

            {/* Section 3: Bottom Right */}
            <motion.div
                style={{ opacity: opacity3, y: y3 }}
                className="absolute inset-0 flex items-center justify-center md:justify-end p-12 md:p-32 text-center md:text-right"
            >
                <h2 className="text-4xl md:text-6xl font-medium max-w-xl leading-[1.1] tracking-tight">
                    Bridging Design <br />
                    <span className="italic font-light opacity-80">& Engineering.</span>
                </h2>
            </motion.div>
        </div>
    );
}
