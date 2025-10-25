#!/bin/bash

echo "==================================="
echo "HuggingFace Token Setup for Pyannote"
echo "==================================="
echo ""
echo "To use speaker diarization, you need a HuggingFace token."
echo ""
echo "Steps:"
echo "1. Go to https://huggingface.co/settings/tokens"
echo "2. Create a new token (or use an existing one)"
echo "3. Accept the user agreement at: https://huggingface.co/pyannote/speaker-diarization-3.1"
echo "4. Run this script and paste your token when prompted"
echo ""
read -p "Enter your HuggingFace token: " TOKEN

if [ -z "$TOKEN" ]; then
    echo "Error: Token cannot be empty"
    exit 1
fi

# Add to your shell profile
SHELL_PROFILE=""
if [ -f ~/.zshrc ]; then
    SHELL_PROFILE=~/.zshrc
elif [ -f ~/.bashrc ]; then
    SHELL_PROFILE=~/.bashrc
elif [ -f ~/.bash_profile ]; then
    SHELL_PROFILE=~/.bash_profile
fi

if [ -n "$SHELL_PROFILE" ]; then
    echo "" >> "$SHELL_PROFILE"
    echo "# HuggingFace Token for Pyannote" >> "$SHELL_PROFILE"
    echo "export HUGGINGFACE_TOKEN=\"$TOKEN\"" >> "$SHELL_PROFILE"
    echo ""
    echo "✓ Token added to $SHELL_PROFILE"
    echo ""
    echo "To use it now, run: export HUGGINGFACE_TOKEN=\"$TOKEN\""
    echo "Or restart your terminal/shell"
else
    echo ""
    echo "Could not find shell profile. Please add this to your shell config:"
    echo "export HUGGINGFACE_TOKEN=\"$TOKEN\""
fi

echo ""
echo "Setup complete!"

