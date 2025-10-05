import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 -z-10" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDk5LCA5OSwgMjU1LCAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-30 -z-10" />

      <div className="container max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Start Your Learning Journey Today</span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Ready to Transform How You{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Learn?
          </span>
        </h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of learners who have mastered complex concepts through the power of simple explanation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link to="/chat">
            <Button size="lg" className="text-lg gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg hover:shadow-xl px-8 py-6">
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Free to try • No credit card required
          </p>
        </div>

        <div className="pt-8 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="space-y-2">
            <p className="text-3xl font-bold text-primary">36 Hr</p>
            <p className="text-sm text-muted-foreground">Straight Hacking</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-accent"> 3K mg</p>
            <p className="text-sm text-muted-foreground">Caffeine Consumed</p>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-secondary">3</p>
            <p className="text-sm text-muted-foreground">Sleep Deprived Girls </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
