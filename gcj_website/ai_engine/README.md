# GCJ AI Engine

The `/ai_engine` folder houses core scripts and utilities for interacting with AI models.

## Structure
- **`gemini_advisor.py`**: Interface script wrapping the Google Gemini Generative AI SDK, configured with System Instructions to serve as an academic advisor for GCJ Jhang.

## Requirements
To run scripts in this directory standalone:
1. Install requirements:
   ```bash
   pip install google-generativeai python-dotenv
   ```
2. Set your Google Gemini API key:
   ```bash
   # Windows PowerShell
   $env:GEMINI_API_KEY="your-gemini-key"
   
   # Linux/macOS Bash
   export GEMINI_API_KEY="your-gemini-key"
   ```
3. Execute the advisor script for testing:
   ```bash
   python gemini_advisor.py
   ```

## Integration
This engine is imported and run by the Django backend's `ai_assistant` app to process API queries from the React frontend chat widget.
