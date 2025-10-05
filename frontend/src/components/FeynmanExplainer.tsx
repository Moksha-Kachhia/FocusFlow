import { Card } from "@/components/ui/card";
import { Brain, MessageSquare, Lightbulb, Target } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Choose a Concept",
    description: "Pick any topic you want to master, from quantum physics to marketing strategies.",
  },
  {
    icon: MessageSquare,
    title: "Explain Simply",
    description: "Teach it to our AI as if explaining to a beginner. No jargon allowed.",
  },
  {
    icon: Brain,
    title: "Identify Gaps",
    description: "Our AI pinpoints areas where your understanding needs improvement.",
  },
  {
    icon: Lightbulb,
    title: "Refine & Master",
    description: "Review, simplify, and clarify until you've achieved true comprehension.",
  },
];

const FeynmanExplainer = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            The Feynman Technique
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Named after Nobel Prize-winning physicist Richard Feynman, this method ensures deep understanding through simple explanation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-6 space-y-4 hover:shadow-lg transition-all hover:-translate-y-1 bg-card border-border"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <step.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <div className="h-0.5 w-6 bg-gradient-to-r from-primary to-transparent" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeynmanExplainer;
