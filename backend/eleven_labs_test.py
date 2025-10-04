from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
import os

# use this to set the path to the ffmpeg binary - may be different for OS
# os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\ffmpeg-8.0-full_build-shared\bin"
load_dotenv()

elevenlabs = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY"),
)

audio = elevenlabs.text_to_speech.convert(
    text="Hi how can I help you.",
    voice_id="cgSgspJ2msm6clMCkdW9",
    model_id="eleven_multilingual_v2",
    output_format="mp3_44100_128",
)

play(audio)

print("Audio played")
