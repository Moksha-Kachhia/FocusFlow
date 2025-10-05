// API service for backend communication
const API_BASE_URL = "http://127.0.0.1:5000";

export interface TranscriptionResponse {
  transcription: string;
  feedback: string;
  message: string;
}

export const apiService = {
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResponse> {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice_note.webm");

    const response = await fetch(`${API_BASE_URL}/transcribe`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    return response.json();
  },

  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch {
      return false;
    }
  }
};
