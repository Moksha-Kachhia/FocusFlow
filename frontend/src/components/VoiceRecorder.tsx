import React, { useState, useRef } from "react";

const VoiceRecorder: React.FC = () => {
  const [status, setStatus] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorder.addEventListener("stop", handleStop);

      mediaRecorder.start();
      setStatus("🎙️ Recording...");
    } catch (error: any) {
      console.error("Error starting recording:", error);
      setStatus("❌ Failed to start recording");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setStatus("⏹️ Recording stopped");
    }
  };

  const handleStop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice_note.webm");

    setStatus("📤 Uploading for transcription...");

    try {
      const response = await fetch("http://127.0.0.1:5000/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setFeedback(
        `📝 Transcribed text: ${data.transcription}\n\n🤖 AI Feedback: ${data.feedback}`
      );
      setStatus("✅ Done!");
    } catch (error: any) {
      console.error("Error uploading:", error);
      setStatus("❌ Upload failed");
      setFeedback(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", border: "2px solid #ccc", borderRadius: "12px" }}>
      <h2>🎙️ Record a Voice Note</h2>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop</button>
      <p>{status}</p>
      <pre style={{ whiteSpace: "pre-wrap" }}>{feedback}</pre>
    </div>
  );
};

export default VoiceRecorder;
