# ⚠️ IMPORTANT: Accept HuggingFace Model Terms

## 🚫 Current Error

```
Could not download 'pyannote/speaker-diarization-3.1' pipeline.
It might be because the pipeline is gated.
```

## ✅ Solution: Accept Model Agreements

Your token is working, but you need to accept the user agreements for the gated models.

### Step 1: Accept Speaker Diarization Model

1. Go to: **https://huggingface.co/pyannote/speaker-diarization-3.1**
2. Make sure you're logged in
3. Click the **"Agree and access repository"** button
4. You should see "You have been granted access to this model"

### Step 2: Accept Segmentation Model

1. Go to: **https://huggingface.co/pyannote/segmentation-3.0**
2. Click the **"Agree and access repository"** button
3. Confirm access granted

### Step 3: Wait a Few Minutes

HuggingFace needs a few minutes to process your access. Wait 2-3 minutes after accepting.

### Step 4: Start Your Server

```bash
cd /Users/mhuzaifa/Desktop/medbot/medbot-api
python3 index.py
```

### You Should See:

```
Loading Whisper model...
Whisper model loaded successfully!
Loading speaker diarization model...
🎉 Speaker diarization model loaded successfully!
```

Instead of the error message.

## 📋 Checklist

- [ ] Logged in to HuggingFace account
- [ ] Accepted terms at https://huggingface.co/pyannote/speaker-diarization-3.1
- [ ] Accepted terms at https://huggingface.co/pyannote/segmentation-3.0
- [ ] Waited 2-3 minutes
- [ ] Restarted server
- [ ] Verified "Speaker diarization model loaded successfully!"

## 🔍 Verify Your Token

Your token is already configured correctly:
- ✅ `.env` file exists
- ✅ Token format is correct (no quotes)
- ✅ Token is being loaded by the server

The only issue is the model access permissions!

## 🆘 Still Not Working?

If you still get the error after accepting terms and waiting:

1. **Check you're using the right HuggingFace account**
   - The token must be from the same account that accepted the terms

2. **Try creating a new token**
   - Go to https://huggingface.co/settings/tokens
   - Create a new token with READ permissions
   - Update your `.env` file with the new token

3. **Verify token works**
   ```bash
   curl -H "Authorization: Bearer hf_your_token" \
     https://huggingface.co/api/models/pyannote/speaker-diarization-3.1
   ```
   Should NOT return 403 Forbidden

## 📝 Important Notes

- **Gated models** require explicit user acceptance
- **Token alone is not enough** - you must accept terms
- **Changes take 2-3 minutes** to propagate on HuggingFace
- **Free to use** - no payment required, just agreement

---

**Accept the terms and your speaker diarization will work!** 🎉

