import Navbar from "@/components/ui/navbar";
import { useLocation } from "wouter";
import HeroSection from "@/components/home/heroSection";
import AIAnalysis from "@/components/home/AIAnalysis";
import StreamLine from "@/components/home/StreamLine";
import FeatureOption from "@/components/home/FeatureOption";
import AboutUs from "@/components/home/AboutUs";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AIAnalysis />
      <StreamLine />
      <FeatureOption />
      <AboutUs />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
