#!/bin/bash

# FocusFlow Development Startup Script
echo "🚀 Starting FocusFlow Development Environment..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check if ports are available
echo "🔍 Checking ports..."
check_port 5000
check_port 5173

echo ""
echo "📋 To start the application:"
echo "1. Backend (Terminal 1): cd backend && python app.py"
echo "2. Frontend (Terminal 2): cd frontend && npm run dev"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://127.0.0.1:5000"
echo ""
echo "💡 Make sure you have:"
echo "   - Python dependencies: pip install -r backend/requirements.txt"
echo "   - Node dependencies: npm install (in frontend directory)"
echo "   - Environment variables: backend/.env with API keys"
echo ""
echo "🎤 Voice recording feature is now fully integrated!"
echo "   - Click microphone to start recording"
echo "   - Speak your explanation"
echo "   - Get AI feedback from Gemini"
