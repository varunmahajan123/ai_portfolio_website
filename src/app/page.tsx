import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="bg-[#121212] min-h-screen selection:bg-white selection:text-black">
      <Navbar />
      <ScrollyCanvas />
      <Projects />

      {/* Footer / Contact placeholder */}
      <footer className="py-20 text-center text-white/50 text-sm">
        <p>&copy; 2024 Varun Mahajan. All rights reserved.</p>
      </footer>
    </main>
  );
}
