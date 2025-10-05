import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TaskBreakdown = () => {
  const [task, setTask] = useState("");
  const [bullets, setBullets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const breakDownTask = async () => {
    if (!task.trim() || isLoading) return;

    setIsLoading(true);
    setBullets([]);

    try {
      const response = await fetch("http://localhost:5000/task_breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task }),
      });

      if (!response.ok) {
        throw new Error("Failed to get breakdown");
      }

      const data = await response.json();

      if (!data.success || !data.task_breakdown) {
        throw new Error("Invalid response from backend");
      }

      // Cleanly split bullet points from backend text
      const lines = data.task_breakdown
        .split("\n")
        .map((line) => line.trim().replace(/^[-•]\s*/, "")) // remove "-" or "•"
        .filter((line) => line.length > 0);

      setBullets(lines);

      toast({
        title: "Task broken down!",
        description: "Here’s your simple action plan.",
      });
    } catch (error) {
      console.error("Error breaking down task:", error);
      toast({
        title: "Error",
        description: "Could not break down the task. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Break Down Your Task</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        <Textarea
          placeholder="Enter a big task you want to tackle..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="min-h-[80px]"
          disabled={isLoading}
        />

        <Button
          onClick={breakDownTask}
          disabled={isLoading || !task.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Breaking down...
            </>
          ) : (
            "Break It Down"
          )}
        </Button>

        {bullets.length > 0 && (
          <div className="flex-1 min-h-0 flex flex-col">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex-shrink-0">
              Your Action Plan:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground overflow-y-auto pr-2">
              {bullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskBreakdown;
