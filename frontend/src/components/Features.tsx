import { Card } from "@/components/ui/card";
import { Zap, Shield, TrendingUp, Users, BookOpen, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get real-time guidance as you explain concepts, helping you identify knowledge gaps immediately.",
  },
  {
    icon: BookOpen,
    title: "Any Subject",
    description: "From mathematics to philosophy, science to business - master any topic you choose.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your learning journey and see your understanding deepen over time.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Advanced AI analyzes your explanations and provides personalized learning insights.",
  },
  {
    icon: Users,
    title: "Proven Method",
    description: "Based on the legendary learning technique used by one of history's greatest minds.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your learning journey is completely private and your data is always protected.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to accelerate your learning and ensure lasting comprehension.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 space-y-4 hover:shadow-xl transition-all hover:-translate-y-2 bg-card border-border group"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
