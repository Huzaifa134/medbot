# Environment Setup Guide

## Quick Start with .env File

Your MedBot API now uses a `.env` file to manage environment variables securely!

### Step 1: Create Your .env File

Copy the example file:
```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
cp .env.example .env
```

### Step 2: Get Your HuggingFace Token

1. Go to [HuggingFace Token Settings](https://huggingface.co/settings/tokens)
2. Create a new token (or use an existing one)
3. Accept the model agreement at: [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1)

### Step 3: Add Your Token to .env

Open the `.env` file and replace `your_token_here` with your actual token:

```bash
# Edit the .env file
nano .env
```

Or use this command:
```bash
echo "HUGGINGFACE_TOKEN=hf_your_actual_token_here" > .env
```

Your `.env` file should look like:
```
HUGGINGFACE_TOKEN=hf_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```

### Step 4: Start the Server

The server will automatically load the token from `.env`:

```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
python3 index.py
```

You should see:
```
Loading Whisper model...
Whisper model loaded successfully!
Loading speaker diarization model...
Speaker diarization model loaded successfully!  ✓
```

## Security Notes

✅ **DO:**
- Keep your `.env` file private
- Add `.env` to `.gitignore` (already done!)
- Never commit `.env` to version control

❌ **DON'T:**
- Share your `.env` file
- Commit tokens to git
- Hardcode tokens in your code

## Troubleshooting

### Token Not Loading?

Check if `.env` file exists:
```bash
ls -la /Users/mhuzaifa/Desktop/medbot/medbot-api/.env
```

View the file (be careful not to share this output):
```bash
cat /Users/mhuzaifa/Desktop/medbot/medbot-api/.env
```

### "Speaker diarization is not available"

Make sure:
1. `.env` file exists in the same directory as `index.py`
2. Token is properly formatted: `HUGGINGFACE_TOKEN=hf_...`
3. No extra spaces or quotes around the token
4. You've accepted the pyannote model agreement

### Still Not Working?

Try setting it manually to test:
```bash
export HUGGINGFACE_TOKEN="your_token_here"
python3 index.py
```

If that works, the issue is with your `.env` file format.

## Benefits of Using .env

✅ Easy to manage multiple environments (dev, staging, production)  
✅ Keep secrets out of version control  
✅ Team members can have their own tokens  
✅ Simple to update without changing code  
✅ Standard practice in Python development  

## File Structure

```
medbot-api/
├── .env                 # Your secrets (NOT in git)
├── .env.example         # Template (safe to commit)
├── .gitignore          # Protects .env
├── index.py            # Loads .env automatically
└── requirements.txt    # Includes python-dotenv
```

Happy coding! 🚀

