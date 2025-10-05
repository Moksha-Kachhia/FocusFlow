from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from elevenlabs import ElevenLabs
from elevenlabs.play import play
import google.generativeai as genai
from dotenv import load_dotenv
import os
import uuid

# --- Setup ---
app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
CORS(app)
os.makedirs("backend/uploads", exist_ok=True)
os.makedirs("backend/audio", exist_ok=True)

# --- Load API Keys ---
load_dotenv("backend/.env")
elevenlabs = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- Initialize Gemini persistent chat session ---
model = genai.GenerativeModel("gemini-flash-latest")
chat = model.start_chat(history=[])


@app.route("/")
def serve_index():
    return send_from_directory("../frontend/dist", "index.html")


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    # 1️⃣ Receive uploaded audio
    audio_file = request.files["audio"]
    file_path = "backend/uploads/voice_note.webm"
    audio_file.save(file_path)

    # 2️⃣ Transcribe with ElevenLabs STT
    with open(file_path, "rb") as f:
        transcription = elevenlabs.speech_to_text.convert(file=f, model_id="scribe_v1")
    transcribed_text = transcription.text
    print(f"🗣️ Transcription: {transcribed_text}")

    # 3️⃣ Send to persistent Gemini chat (with memory)
    try:
        # Add user message
        chat.history.append({"role": "user", "parts": [transcribed_text]})

        # Generate response using chat memory
        response = chat.send_message(
            f"""
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

        Do not use Markdown, LaTeX, or formatting characters.
        Avoid using **asterisks**, **underscores**, **backticks**, or **dollar signs**.
        Write your response as plain text only.
        If referring to math or equations, write them in plain words (e.g., 'x squared' instead of '$x^2$').
        """
        )

        gemini_feedback = response.text.strip()
        print(f"💬 Gemini Feedback: {gemini_feedback}")

    except Exception as e:
        print("❌ Gemini error:", e)
        gemini_feedback = f"I heard: '{transcribed_text}'. Keep practicing!"

    # 4️⃣ Speak Gemini’s reply
    try:
        audio_stream = elevenlabs.text_to_speech.convert(
            text=gemini_feedback,
            voice_id="cgSgspJ2msm6clMCkdW9",
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )
        play(audio_stream)
        print("🎶 Audio played successfully.")
    except Exception as e:
        print("❌ ElevenLabs error:", e)

    # 5️⃣ Return text output (frontend shows transcription + AI response)
    return jsonify(
        {
            "success": True,
            "transcription": transcribed_text,
            "feedback": gemini_feedback,
            "message": "Success",
        }
    )


@app.errorhandler(404)
def not_found(e):
    return send_from_directory("../frontend/dist", "index.html")


if __name__ == "__main__":
    app.run(debug=True)
