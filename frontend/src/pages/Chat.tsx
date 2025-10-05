import { useState } from "react";
import { Mic, MicOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import TaskBreakdown from "@/components/TaskBreakdown";
import StressChatDialog from "@/components/StressChatDialog";
import Header from "@/components/Header";
import PomodoroTimer from "@/components/PomodoroTimer";

const Chat = () => {
  const [isListening, setIsListening] = useState(false);
  const [showStressChat, setShowStressChat] = useState(false);
  const navigate = useNavigate();

  const toggleListening = () => {
    setIsListening(!isListening);
    // TODO: Implement actual voice recording logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← Back
        </Button>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Left side - Microphone */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
          <Card className="w-full flex-1">
            <CardHeader>
              <CardTitle className="text-center">Explain Your Concept</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-12 h-full">
              <p className="text-center text-muted-foreground">
                Click the microphone and start explaining the topic you want to learn
              </p>

              <button
                onClick={toggleListening}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isListening
                    ? "bg-primary animate-pulse shadow-glow"
                    : "bg-primary/20 hover:bg-primary/30"
                }`}
              >
                {isListening ? (
                  <Mic className="w-16 h-16 text-primary-foreground" />
                ) : (
                  <MicOff className="w-16 h-16 text-primary" />
                )}
              </button>

              <p className="text-sm text-muted-foreground">
                {isListening ? "Listening... Speak now" : "Click to start"}
              </p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">How it works:</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Click the microphone to start recording</li>
                <li>2. Explain the concept in your own words</li>
                <li>3. Our AI will analyze your explanation</li>
                <li>4. Get personalized feedback and improvements</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Pomodoro Timer, Task Breakdown, and Stress Support */}
        <div className="lg:col-span-1 flex flex-col h-full">
          <div className="flex-shrink-0">
            <PomodoroTimer />
          </div>

          <div className="flex-1 min-h-0 mt-8">
            <TaskBreakdown />
          </div>

          <div className="flex-shrink-0 mt-4">
            <Button
              onClick={() => setShowStressChat(true)}
              variant="default"
              size="lg"
              className="w-full gap-3 text-lg font-semibold py-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-red-400"
            >
              <Heart className="h-6 w-6" />
              Feeling stressed? 💔
            </Button>
          </div>
        </div>
      </div>

        <StressChatDialog open={showStressChat} onOpenChange={setShowStressChat} />
      </div>
    </div>
  );
};

export default Chat;
