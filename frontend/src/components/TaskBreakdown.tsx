import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subtask {
  title: string;
  description: string;
}

const TaskBreakdown = () => {
  const [task, setTask] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const breakDownTask = async () => {
    if (!task.trim() || isLoading) return;

    setIsLoading(true);
    setSubtasks([]);

    try {
      const response = await fetch("http://127.0.0.1:5000/breakdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: task }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to get breakdown");
      }

      const lines = data.breakdown.split("\n").filter(line => line.trim());
      const parsedSubtasks = lines.slice(0, 5).map((line, index) => ({
        title: `Step ${index + 1}`,
        description: line.replace(/^\d+\.\s*/, "").trim(),
      }));

      setSubtasks(parsedSubtasks);

      toast({
        title: "Task broken down!",
        description: "Here are your actionable subtasks.",
      });
    } catch (error) {
      console.error("Error breaking down task:", error);
      toast({
        title: "Error",
        description: "Could not break down the task.",
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

        {subtasks.length > 0 && (
          <div className="flex-1 min-h-0 flex flex-col">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex-shrink-0">
              Your Action Plan:
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {subtasks.map((subtask, i) => (
                <div
                  key={i}
                  className="border border-border rounded-lg p-3 space-y-2 bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{subtask.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {subtask.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskBreakdown;
