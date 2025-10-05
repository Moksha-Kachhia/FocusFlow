import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Settings, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TimerMode = 'work' | 'break' | 'longBreak';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [customWorkTime, setCustomWorkTime] = useState(25); // minutes
  const [customBreakTime, setCustomBreakTime] = useState(5); // minutes
  const [customLongBreakTime, setCustomLongBreakTime] = useState(15); // minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const workTime = customWorkTime * 60; // convert to seconds
  const breakTime = customBreakTime * 60; // convert to seconds
  const longBreakTime = customLongBreakTime * 60; // convert to seconds


  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    if (mode === 'work') {
      setSessionCount(prev => prev + 1);

      if (sessionCount + 1 >= 4) {
        setMode('longBreak');
        setTimeLeft(longBreakTime);
        toast({
          title: "🎉 Great work!",
          description: "Time for a long break (15 minutes). You've completed 4 Pomodoro sessions!",
        });
      } else {
        setMode('break');
        setTimeLeft(breakTime);
        toast({
          title: "⏰ Break time!",
          description: "Take a 5-minute break. You've earned it!",
        });
      }
    } else {
      setMode('work');
      setTimeLeft(workTime);
      toast({
        title: "🚀 Back to work!",
        description: "Break's over. Time to focus and get things done!",
      });
    }
  }, [mode, sessionCount, breakTime, longBreakTime, workTime, toast]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);


  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workTime);
    } else if (mode === 'break') {
      setTimeLeft(breakTime);
    } else {
      setTimeLeft(longBreakTime);
    }
  };

  const applySettings = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(customWorkTime * 60);
    } else if (mode === 'break') {
      setTimeLeft(customBreakTime * 60);
    } else {
      setTimeLeft(customLongBreakTime * 60);
    }
    setShowSettings(false);
    toast({
      title: "Settings Applied",
      description: "Timer durations have been updated.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work':
        return 'text-primary';
      case 'break':
        return 'text-accent';
      case 'longBreak':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'work':
        return '';
      case 'break':
        return '☕';
      case 'longBreak':
        return '🛋️';
      default:
        return '⏰';
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'work':
        return 'Focus Time';
      case 'break':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Timer';
    }
  };

  const progress = mode === 'work'
    ? ((workTime - timeLeft) / workTime) * 100
    : mode === 'break'
    ? ((breakTime - timeLeft) / breakTime) * 100
    : ((longBreakTime - timeLeft) / longBreakTime) * 100;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getModeIcon()}</span>
            Pomodoro Timer
            <span className={`text-sm font-normal ${getModeColor()}`}>
              ({getModeText()})
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-semibold text-sm">Customize Timer Durations</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="work-time" className="text-xs">Work (min)</Label>
                <Input
                  id="work-time"
                  type="number"
                  min="1"
                  max="60"
                  value={customWorkTime}
                  onChange={(e) => setCustomWorkTime(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="break-time" className="text-xs">Break (min)</Label>
                <Input
                  id="break-time"
                  type="number"
                  min="1"
                  max="30"
                  value={customBreakTime}
                  onChange={(e) => setCustomBreakTime(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-break-time" className="text-xs">Long Break (min)</Label>
                <Input
                  id="long-break-time"
                  type="number"
                  min="5"
                  max="60"
                  value={customLongBreakTime}
                  onChange={(e) => setCustomLongBreakTime(Math.max(5, parseInt(e.target.value) || 5))}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={applySettings} size="sm" className="flex-1">
                Apply Settings
              </Button>
              <Button
                onClick={() => setShowSettings(false)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${getModeColor()} mb-2`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground">
            Session {sessionCount + 1} of 4
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              mode === 'work' ? 'bg-primary' :
              mode === 'break' ? 'bg-accent' : 'bg-secondary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleTimer}
            variant="default"
            size="lg"
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Start
              </>
            )}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Mode Info */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <div>🎯 Work: {customWorkTime} min • ☕ Break: {customBreakTime} min • 🛋️ Long Break: {customLongBreakTime} min</div>
          <div>Complete 4 work sessions to unlock a long break!</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
