import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroIllustration from "@/assets/hero-illustration.jpg";
import HowItWorksDialog from "@/components/HowItWorksDialog";

const Hero = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/30 -z-10" />

      <div className="container max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Learn Smarter, Not Harder</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Master Any Concept with the{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Feynman Technique
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Break down complex ideas into simple explanations. Our AI-powered chatbot guides you through the learning process, ensuring true understanding.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/chat">
                <Button size="lg" className="text-lg gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg" onClick={() => setShowHowItWorks(true)}>
                How It Works
              </Button>
            </div>

            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>AI-powered learning</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl -z-10 animate-pulse" />
            <img
              src={heroIllustration}
              alt="AI-powered learning illustration"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      <HowItWorksDialog open={showHowItWorks} onOpenChange={setShowHowItWorks} />
    </section>
  );
};

export default Hero;
