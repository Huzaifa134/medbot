# Installation Guide

Complete guide to installing and setting up MedBot.

## 📋 Prerequisites

### System Requirements

- **Operating System**: macOS, Linux, or Windows (with WSL)
- **Python**: 3.9 or higher
- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher
- **RAM**: Minimum 8GB (16GB recommended for optimal performance)
- **Storage**: At least 5GB free space for models

### Required Accounts

1. **HuggingFace Account** (Free)
   - Sign up at https://huggingface.co/join
   - Required for speaker diarization models

2. **DigitalOcean AI Account**
   - Required for clinical note generation
   - Get API key from DigitalOcean AI platform

## 🔧 Step 1: Install System Dependencies

### macOS

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install ffmpeg (required for audio processing)
brew install ffmpeg

# Install Python 3.9+
brew install python@3.9

# Install Node.js
brew install node
```

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install ffmpeg
sudo apt install -y ffmpeg

# Install Python 3.9+
sudo apt install -y python3.9 python3-pip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Windows (WSL)

```bash
# Install WSL Ubuntu
wsl --install

# Follow Linux instructions above in WSL terminal
```

## 📦 Step 2: Clone the Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd medbot

# Or if you already have the files, navigate to the directory
cd /Users/mhuzaifa/Desktop/medbot
```

## 🐍 Step 3: Backend Setup

### Install Python Dependencies

```bash
cd medbot-api

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

### Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your preferred editor
nano .env
# or
vim .env
# or
code .env
```

Add your API keys to `.env`:

```bash
# HuggingFace Token for Speaker Diarization
HUGGINGFACE_TOKEN=hf_your_token_here

# DigitalOcean AI API Key for Clinical Note Generation
DO_AI_API_KEY=sk-do-your_key_here
```

### Get HuggingFace Token

1. Visit https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name (e.g., "medbot")
4. Select "Read" permission
5. Copy the token to your `.env` file

### Accept Model Terms

**IMPORTANT**: You must accept the terms for these models:

1. Visit https://huggingface.co/pyannote/speaker-diarization-3.1
2. Click "Agree and access repository"
3. Visit https://huggingface.co/pyannote/segmentation-3.0
4. Click "Agree and access repository"

Wait 2-3 minutes for permissions to propagate.

## 🎨 Step 4: Frontend Setup

```bash
cd ../medbot-frontend

# Install Node.js dependencies
npm install

# Or using yarn
yarn install
```

## ✅ Step 5: Verify Installation

### Test Backend

```bash
cd medbot-api

# Start the backend server
python3 index.py
```

You should see:
```
Loading Whisper model...
Whisper model loaded successfully!
Loading speaker diarization model...
Speaker diarization model loaded successfully!
INFO: Uvicorn running on http://0.0.0.0:8000
```

Test the health endpoint:
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "message": "MedBot API is running",
  "status": "healthy",
  "whisper_model": "base"
}
```

### Test Frontend

In a new terminal:

```bash
cd medbot-frontend

# Start the development server
npm run dev
```

You should see:
```
✓ Ready in 2.3s
➜ Local:   http://localhost:3000
```

Open http://localhost:3000 in your browser.

## 🎉 Success!

If both servers started successfully, you're ready to use MedBot!

Proceed to the [Quick Start Guide](./quickstart.md) to learn how to use the system.

## 🐛 Installation Issues?

### Python Module Not Found

```bash
# Make sure you're in the virtual environment
source medbot-api/venv/bin/activate

# Reinstall requirements
pip install -r medbot-api/requirements.txt
```

### ffmpeg Not Found

```bash
# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg

# Verify installation
ffmpeg -version
```

### Port Already in Use

```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### HuggingFace Token Issues

1. Verify token is correct in `.env`
2. Ensure no quotes around the token value
3. Restart the backend server
4. Check you accepted model terms
5. Wait 2-3 minutes after accepting terms

## 📚 Next Steps

- [Quick Start Guide](./quickstart.md) - Start using MedBot
- [Configuration Guide](./configuration.md) - Advanced settings
- [API Documentation](./api/overview.md) - Integrate with the API

## 🆘 Still Having Issues?

Check our [Troubleshooting Guide](./troubleshooting.md) for more solutions.

