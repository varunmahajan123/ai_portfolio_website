"use server";

import fs from "fs";
import path from "path";

export async function getSequenceData() {
    const sequenceDir = path.join(process.cwd(), "public/sequences");

    try {
        const files = await fs.promises.readdir(sequenceDir);
        // Filter for frame_*.png and count them
        const frameCount = files.filter((file) =>
            file.startsWith("frame_") && file.endsWith(".png")
        ).length;

        return { frameCount, sequencePath: "/sequences" };
    } catch (error) {
        console.error("Error reading sequence directory:", error);
        return { frameCount: 0, sequencePath: "/sequences" };
    }
}
