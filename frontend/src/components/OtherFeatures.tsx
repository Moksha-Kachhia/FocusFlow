import { Card } from "@/components/ui/card";
import { CheckSquare, Heart, Brain, Sparkles } from "lucide-react";

const otherFeatures = [
  {
    icon: CheckSquare,
    title: "AI-Powered Task Breakdown",
    description: "Give our AI any big task or project, and it will intelligently break it down into smaller, more manageable steps. No more feeling overwhelmed by complex goals - we'll create a clear roadmap for your success.",
    gradient: "from-blue-500 to-cyan-500",
    hoverGradient: "from-blue-600 to-cyan-600"
  },
  {
    icon: Heart,
    title: "Motivator AI",
    description: "Our emotional support AI is here to help you through your learning journey. Get personalized encouragement, stress management tips, and mental health support as you work through challenging concepts.",
    gradient: "from-purple-400 to-pink-400",
    hoverGradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Brain,
    title: "Pomodoro Technique Timer",
    description: "Boost your productivity with our customizable Pomodoro timer! Work in focused 25-minute sessions with 5-minute breaks, and earn longer breaks after completing 4 sessions. Scientifically proven to improve focus and reduce mental fatigue.",
    gradient: "from-purple-500 to-violet-500",
    hoverGradient: "from-purple-600 to-violet-600"
  }
];

const OtherFeatures = () => {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our Other Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Beyond the Feynman Technique, we offer powerful AI tools to support your entire learning journey and mental well-being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherFeatures.map((feature, index) => (
            <Card
              key={index}
              className="p-8 space-y-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border group"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              <div className={`h-1 w-full bg-gradient-to-r ${feature.gradient} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-lg font-medium text-primary">
              All features work together to create your perfect learning environment
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherFeatures;
