# FocusFlow 🎓

> A mobile-first productivity and study app designed with accessibility in mind: from voice-driven learning to distraction-free study modes. Our focus is on supporting students with ADHD, learning disabilities, and diverse study needs, while being helpful for *all students* to make studying more enjoyable, inclusive, and effective.

## 💡 Inspiration
Students with learning disabilities (like ADHD and dyslexia) or limited resources often struggle with traditional study tools. FocusFlow helps every student learn in the way that works best for them, through focus, reflection, and emotional support.

## 🌍 Themes
- **Inclusive Innovation by Dell Technologies**: Accessibility-first learning.  
- **Revolutionizing Learning**: Interactive, reflective, and personalized education.  

## 🧠 MVP Features
- **Voice-Based Learning (Feynman Tool)**: Students explain concepts out loud; AI provides clarity feedback.  
- **Low-Distraction Mode**: Minimalist, focused UI.  
- **AI Study Therapist**: Motivation and emotional support when stressed or unmotivated.  
- **Mobile-First Design**: Works well on smartphones.  

## ⚙️ Tech Stack
- **Frontend**: React + Tailwind CSS (Vercel)  
- **Backend**: Flask (Render)  
- **AI Services**: Gemini API, Web Speech API *(browser-based STT for demo)*, ElevenLabs (TTS)  
- **Database**: Firebase (optional)  
- **Authentication**: Auth0  
- **Deployment**: Vercel (frontend) + Render (backend)  

## 🛠️ Setup

### Prerequisites
- Node 18+ and npm  
- Python 3.10+  
- Git + GitHub account  
- Gemini API key (Google AI Studio)  
- (Optional) Vercel & Render accounts

### 1) Clone & Initialize Repo
```bash
git clone https://github.com/Moksha-Kachhia/FocusFlow.git
cd focusflow
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

### .env for local dev: 
```bash
VITE_API_BASE=http://localhost:8000
```

### 3) Backend
```bash
cd ../backend
pip install -r requirements.txt
python app.py
```

### .env for local dev: 
```bash
GEMINI_API_KEY=YOUR_KEY
ALLOWED_ORIGIN=http://localhost:5173
```

### 4) Demo Flow
```css
[ Student speaks → Web Speech API → Flask backend → Gemini AI → ElevenLabs TTS → Feedback ]
```
Steps:
Enter topic.
Click “Start Explaining” and speak.
Press “Get AI Feedback” to see study coach feedback.
Optionally enter mood and press “Boost Me” for encouragement.

### 5) Deployment
```
Backend → Render
Build: pip install -r requirements.txt
Start: python app.py
Env: GEMINI_API_KEY, ALLOWED_ORIGIN=https://your-frontend.vercel.app
Frontend → Vercel
```
### .env:
```bash

VITE_API_BASE=https://your-backend.onrender.com
Push + import project on Vercel → auto-detect Vite build
```

### 6) Notes / Tips
Mic access: Chrome/Edge required for Web Speech API (HTTPS or localhost).
CORS: Ensure ALLOWED_ORIGIN matches your frontend URL.
Accessibility angle: Minimal UI + voice feedback supports neurodiverse learners.
Optional upgrades: Swap Web Speech API for Whisper API or AssemblyAI for higher accuracy in production.