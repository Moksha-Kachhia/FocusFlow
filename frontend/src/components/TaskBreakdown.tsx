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
      // Try Supabase Edge Function first
      const supabaseResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/break-down-task`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ task }),
        }
      );

      if (supabaseResponse.ok) {
        const data = await supabaseResponse.json();
        setSubtasks(data.subtasks || []);

        toast({
          title: "Task broken down!",
          description: "Here are your actionable subtasks.",
        });
        return;
      }

      // Fallback: Use direct Gemini API call
      const geminiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "You are a helpful task management assistant. Break down large tasks into 3-5 smaller, actionable subtasks. Each subtask should be clear and executable. Respond with a JSON array of objects, each with 'title' and 'description' fields."
            },
            {
              role: "user",
              content: `Break down this task into smaller subtasks: ${task}. Respond with only a JSON array in this format: [{"title": "Task 1", "description": "Description 1"}, {"title": "Task 2", "description": "Description 2"}]`
            }
          ],
        }),
      });

      if (!geminiResponse.ok) {
        if (geminiResponse.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again later.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to break down task");
      }

      const geminiData = await geminiResponse.json();
      const content = geminiData.choices[0]?.message?.content;

      if (content) {
        try {
          // Try to parse JSON response
          const parsedSubtasks = JSON.parse(content);
          setSubtasks(parsedSubtasks);

          toast({
            title: "Task broken down!",
            description: "Here are your actionable subtasks.",
          });
        } catch (parseError) {
          // If JSON parsing fails, create a simple breakdown
          const lines = content.split('\n').filter(line => line.trim());
          const simpleSubtasks = lines.slice(0, 5).map((line, index) => ({
            title: `Step ${index + 1}`,
            description: line.replace(/^\d+\.\s*/, '').trim()
          }));
          setSubtasks(simpleSubtasks);

          toast({
            title: "Task broken down!",
            description: "Here are your actionable subtasks.",
          });
        }
      } else {
        throw new Error("No response content");
      }
    } catch (error) {
      console.error("Error breaking down task:", error);

      // Fallback: Create a simple mock breakdown for demo purposes
      const mockSubtasks = [
        {
          title: "Research and Planning",
          description: `Research the topic thoroughly and create a detailed plan for "${task}"`
        },
        {
          title: "Gather Resources",
          description: "Collect all necessary materials, tools, and information needed"
        },
        {
          title: "Execute Core Tasks",
          description: "Work through the main components of the task systematically"
        },
        {
          title: "Review and Refine",
          description: "Review your work, make improvements, and ensure quality"
        },
        {
          title: "Finalize and Complete",
          description: "Complete any remaining tasks and finalize the deliverable"
        }
      ];

      setSubtasks(mockSubtasks);

      toast({
        title: "Demo Mode",
        description: "Here's a sample breakdown. Configure API keys for AI-powered breakdowns.",
        variant: "default",
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
          placeholder="Enter a big task you want to tackle... (e.g., 'Learn React', 'Plan a wedding', 'Start a business', 'Write a novel')"
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
            <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex-shrink-0">Your Action Plan:</h3>
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
