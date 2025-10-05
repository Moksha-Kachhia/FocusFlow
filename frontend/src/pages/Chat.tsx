import { useState, useRef } from "react";
import { Mic, MicOff, Heart, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import TaskBreakdown from "@/components/TaskBreakdown";
import StressChatDialog from "@/components/StressChatDialog";
import Header from "@/components/Header";
import PomodoroTimer from "@/components/PomodoroTimer";

// Types for our API responses
interface TranscriptionResponse {
  transcription: string;
  feedback: string;
  message: string;
}

const Chat = () => {
  // State management
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStressChat, setShowStressChat] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [geminiFeedback, setGeminiFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Refs for media recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // API configuration
  const API_BASE_URL = "http://127.0.0.1:5000";

  const startRecording = async () => {
    try {
      console.log("🎤 Starting recording...");
      setError("");
      setStatus("🎙️ Starting recording...");

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;

      // Create MediaRecorder with optimal settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Handle data available event
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`📦 Audio chunk received: ${event.data.size} bytes`);
        }
      });

      // Handle stop event
      mediaRecorder.addEventListener("stop", async () => {
        console.log("⏹️ Recording stopped, processing...");
        await processRecording();
      });

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsListening(true);
      setStatus("🎙️ Recording... Speak now!");
      setTranscription("");
      setGeminiFeedback("");

    } catch (error) {
      console.error("❌ Error starting recording:", error);
      setError(`Microphone access denied: ${(error as Error).message}`);
      setStatus("❌ Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      console.log("🛑 Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setStatus("⏹️ Processing your recording...");
    }
  };

  const processRecording = async () => {
    try {
      setIsProcessing(true);
      setError("");
      setStatus("📤 Uploading for transcription...");

      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      if (audioBlob.size === 0) {
        throw new Error("No audio data recorded");
      }

      console.log(`📤 Uploading audio: ${audioBlob.size} bytes`);

      // Create FormData
      const formData = new FormData();
      formData.append("audio", audioBlob, "voice_note.webm");

      // Send to backend
      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data: TranscriptionResponse = await response.json();
      console.log("✅ Received response:", data);

      // Update UI with results
      setTranscription(data.transcription);
      setGeminiFeedback(data.feedback);
      setStatus("✅ Analysis complete!");

    } catch (error) {
      console.error("❌ Error processing recording:", error);
      setError(`Processing failed: ${(error as Error).message}`);
      setStatus("❌ Error occurred during processing");
    } finally {
      setIsProcessing(false);
      // Clean up media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const resetSession = () => {
    setTranscription("");
    setGeminiFeedback("");
    setStatus("");
    setError("");
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
                  disabled={isProcessing}
                  className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening
                      ? "bg-primary animate-pulse shadow-glow"
                      : isProcessing
                      ? "bg-muted cursor-not-allowed"
                      : "bg-primary/20 hover:bg-primary/30"
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
                  ) : isListening ? (
                    <Mic className="w-16 h-16 text-primary-foreground" />
                  ) : (
                    <MicOff className="w-16 h-16 text-primary" />
                  )}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {isProcessing
                      ? "Processing..."
                      : isListening
                      ? "Listening... Click to stop"
                      : "Click to start recording"
                    }
                  </p>
                  {status && (
                    <p className={`text-sm font-medium flex items-center justify-center gap-2 ${
                      status.includes("✅") ? "text-green-600" :
                      status.includes("❌") ? "text-red-600" :
                      "text-foreground"
                    }`}>
                      {status.includes("✅") && <CheckCircle className="w-4 h-4" />}
                      {status.includes("❌") && <AlertCircle className="w-4 h-4" />}
                      {status}
                    </p>
                  )}
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded border">
                      {error}
                    </p>
                  )}
                </div>

                {/* Reset button */}
                {(transcription || geminiFeedback) && (
                  <Button
                    onClick={resetSession}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Start New Recording
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {(transcription || geminiFeedback) && (
              <div className="space-y-6">
                {/* Transcription Results */}
                {transcription && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Your Explanation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                        "{transcription}"
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Gemini Feedback */}
                {geminiFeedback && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5 text-blue-600" />
                        AI Study Partner Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed bg-blue-50 p-4 rounded-lg">
                        {geminiFeedback}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">How it works:</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Click the microphone to start recording</li>
                  <li>2. Explain the concept in your own words</li>
                  <li>3. Our AI will transcribe your explanation</li>
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
