from google import genai
from dotenv import load_dotenv
import os

# Load variables from your .env file
load_dotenv()


# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Give a 10 sentence description of seventeen kpop group",
)
print(response.text)
