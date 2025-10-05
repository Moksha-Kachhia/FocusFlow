import Hero from "@/components/Hero";
import FeynmanExplainer from "@/components/FeynmanExplainer";
import OtherFeatures from "@/components/OtherFeatures";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import VoiceRecorder from "../components/VoiceRecorder";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <FeynmanExplainer />
      <OtherFeatures />
      <Features />
      <CTA />
      <Footer />
      <VoiceRecorder />

    </div>
  );
};

export default Index;
