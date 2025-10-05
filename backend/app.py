from flask import Flask, request, jsonify
from flask_cors import CORS
from elevenlabs import ElevenLabs
import google.generativeai as genai
from dotenv import load_dotenv
import os

# --- Flask setup ---
app = Flask(__name__)
CORS(app)  # allow frontend access
os.makedirs("backend/uploads", exist_ok=True)

# --- API Keys ---
load_dotenv("backend/.env")
elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")

# Initialize API clients
client = ElevenLabs(api_key=elevenlabs_key)
genai.configure(api_key=gemini_key)

# --- ROUTES ---


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "FocusFlow Backend is running!", "status": "success"})


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    # Step 1: Receive uploaded audio file
    audio_file = request.files["audio"]
    file_path = "backend/uploads/voice_note.webm"
    audio_file.save(file_path)

    # Step 2: Transcribe using ElevenLabs STT
    with open(file_path, "rb") as f:
        transcription = client.speech_to_text.convert(file=f, model_id="scribe_v1")

    transcribed_text = transcription.text
    print(f"Transcription: {transcribed_text}")

    # Step 3: Send transcribed text to Gemini for processing
    try:
        # Use a lightweight Gemini model to avoid quota issues
        model = genai.GenerativeModel("gemini-flash-latest")
        prompt_desc = """
        You are an AI study partner using the Feynman technique.
        Your role is to help the student learn by explaining and questioning — not by lecturing.
        Rules:
        - Speak like a curious and thoughtful student, not an expert.
        - There are 3 cases: explanation is correct, explanation is unclear, explanation is incorrect.
        - If the explanation is correct, summarize it clearly in your own words, in short and in agreement.
        - Avoid long paragraphs or formal language. Keep responses natural and short.
        - If something is unclear, ask a gentle follow-up question under these rules:
        - One clarification question per turn is ideal.
        - Don’t ask if you already understand the point.
        - Only probe new or unclear ideas. Keep on topic, and make sure to ask follow up leading questions that are relevant.
        - If the explanation is incorrect, correct it and explain why it's incorrect, in a nice manner.

        """
        prompt = f"{prompt_desc} : {transcribed_text}"
        response = model.generate_content(prompt)
        gemini_feedback = response.text
        print(f"Gemini feedback: {gemini_feedback}")
    except Exception as e:
        print(f"Gemini error: {e}")
        # Fallback response if Gemini fails
        gemini_feedback = f"Great job! I heard you say '{transcribed_text}'. Keep practicing and you'll improve even more!"

    # Step 4: Return both transcription and Gemini feedback to frontend
    return jsonify(
        {
            "transcription": transcribed_text,
            "feedback": gemini_feedback,
            "message": "Transcription and feedback successful!",
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
