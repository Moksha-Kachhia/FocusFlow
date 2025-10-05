import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";

interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowItWorksDialog = ({ open, onOpenChange }: HowItWorksDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            How It Works
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Visual representation */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Mic className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-center">Step-by-Step Process</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">1</span>
                  <span>Click the microphone to start recording</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">2</span>
                  <span>Explain the concept in your own words</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">3</span>
                  <span>Our AI will analyze your explanation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">4</span>
                  <span>Get personalized feedback and improvements</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Additional info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Ready to start learning? Click "Start Learning Free" to begin!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksDialog;
