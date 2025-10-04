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

## 🔄 CI/CD & Quality Checks
> FocusFlow incorporates a modern CI/CD pipeline to ensure code quality, security, and reliable deployment:
### 1) Pre-commit Hooks (local dev):
- black for Python formatting
- eslint for JS/React formatting
- Trailing whitespace & EOF fixes
- Prevent committing large files
### 2) GitHub Actions Workflow:
- Automatically runs pre-commit, linting, and tests on each push or PR
- Optionally runs a mock test coverage report (pytest --cov=backend)
### 3) GitHub Secrets:
- `GEMINI_API_KEY` securely stored
- `ALLOWED_ORIGIN` for CORS
- Any other environment-specific keys
### 4) Extras:
- Dependabot: automatic dependency updates + security alerts
- Branch Protection Rules: require CI to pass before merging to main
- README Badge: shows latest workflow status
![CI](https://github.com/Moksha-Kachhia/FocusFlow/actions/workflows/main.yml/badge.svg)

### Pipeline benefits:
Ensures high code quality, reduces human error, speeds up deployments, and demonstrates security-conscious development practices.


## 🛠️ Setup

### Prerequisites
- Node 18+ and npm
- Python 3.10+
- Git + GitHub account
- Gemini API key (Google AI Studio)
- (Optional) Vercel & Render accounts
- Instal Pip Pre-commit locally:
    ```bash
    pip install pre-commit
    pre-commit install

    ```

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

### Notes / Tips
Mic access: Chrome/Edge required for Web Speech API (HTTPS or localhost).
CORS: Ensure ALLOWED_ORIGIN matches your frontend URL.
Accessibility angle: Minimal UI + voice feedback supports neurodiverse learners.
Optional upgrades: Swap Web Speech API for Whisper API or AssemblyAI for higher accuracy in production.
