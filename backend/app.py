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


@app.route("/stress_chat", methods=["POST"])
def stress_chat():
    data = request.json
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"success": False, "message": "No messages provided"}), 400

    # Build the conversation as a single prompt for Gemini
    conversation_text = "\n".join(
        [f"{msg['role'].capitalize()}: {msg['content']}" for msg in messages]
    )

    prompt = f"""
You are a kind, calm, and supportive AI therapist.
Your job is to help users manage stress, anxiety, and emotional overwhelm.
Guidelines:
- Respond in a warm, conversational, and empathetic tone.
- Use short messages — 1 to 3 sentences max.
- Do not give medical advice.
- Focus on listening, validation, and gentle guidance.
- Avoid sounding robotic or overly formal.
- If appropriate, ask thoughtful follow-up questions.

Conversation so far:
{conversation_text}

Respond as the therapist:
"""

    try:
        response = model.generate_content(prompt)
        reply = response.text.strip()
        print("✅ Stress Chat Reply Generated:\n", reply)

        return jsonify({"success": True, "reply": reply})

    except Exception as e:
        print("❌ Stress Chat Error:", e)
        return (
            jsonify(
                {"success": False, "message": "Error generating therapist response"}
            ),
            500,
        )


@app.route("/task_breakdown", methods=["POST"])
def task_breakdown():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"success": False, "message": "No text provided"}), 400

    prompt = f"""
You are a concise task decomposer. Convert the user's goal into concrete, do-able steps.

STRICT OUTPUT RULES (must follow all):
- Return ONLY bullet points, each on its own line, starting with "- ".
- 5 steps exactly (unless the user explicitly asks for a different number).
- Each step starts with a strong verb (Plan, Define, Set, Create, Build, Practice, Review, etc.).
- 6–12 words per step. One action per step. Step-by-step sequence.
- Prefer observable actions over vague advice; include practical detail when helpful.
- No numbering, headings, summaries, tables, code blocks, quotes, emojis, or extra text.

Task:
{text}

If the input is vague, infer a reasonable concrete goal and proceed.
"""

    try:
        response = model.generate_content(prompt)
        breakdown = response.text.strip()

        print("✅ Task Breakdown Generated:\n", breakdown)

        return jsonify({"success": True, "task_breakdown": breakdown})

    except Exception as e:
        print("❌ Task Breakdown Gemini Error:", e)
        return (
            jsonify({"success": False, "message": "Error generating task breakdown"}),
            500,
        )


@app.errorhandler(404)
def not_found(e):
    return send_from_directory("../frontend/dist", "index.html")


if __name__ == "__main__":
    app.run(debug=True)
