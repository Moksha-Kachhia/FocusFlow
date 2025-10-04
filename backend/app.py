from flask import Flask, request, jsonify
from flask_cors import CORS
from elevenlabs import ElevenLabs
from dotenv import load_dotenv
import os

# --- Flask setup ---
app = Flask(__name__)
CORS(app)  # allow frontend access
os.makedirs("backend/uploads", exist_ok=True)

# --- API Keys ---
load_dotenv("backend/.env")
elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
client = ElevenLabs(api_key=elevenlabs_key)

# --- ROUTES ---


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "FocusFlow Backend is running!", "status": "success"})


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    # Receive uploaded audio file
    audio_file = request.files["audio"]
    file_path = "backend/uploads/voice_note.webm"
    audio_file.save(file_path)

    # Transcribe using ElevenLabs STT
    with open(file_path, "rb") as f:
        transcription = client.speech_to_text.convert(file=f, model_id="scribe_v1")
        print(f"Transcription: {transcription.text}")
    return jsonify(
        {"transcription": transcription.text, "message": "Transcription successful!"}
    )


if __name__ == "__main__":
    app.run(debug=True)
