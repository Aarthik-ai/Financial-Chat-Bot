import Navbar from "@/components/ui/navbar";
import { useLocation } from "wouter";
import HeroSection from "@/components/home/heroSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection/>
    </div>
  );
}
