import google.generativeai as genai
from django.conf import settings
from .models import ChatbotLog

# Configure API Key
GEMINI_API_KEY = getattr(settings, 'GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def get_gemini_response(session_id, user_message, user=None, language='English'):
    """
    Connects to Gemini API, loads session chat history from ChatbotLog,
    sends the conversation to Gemini with a system prompt, and returns the response.
    """
    system_prompt = (
        "You are GCJ Assistant. Answer questions about Government College Jhang admissions, "
        "departments, courses, and student life. Support both English and Urdu. Keep responses "
        "concise and helpful. If the user asks in Urdu, respond in Urdu. If in English, respond in English."
    )

    # 1. Fetch conversation history from database
    history_logs = ChatbotLog.objects.filter(session_id=session_id).order_by('created_at')[:10]
    
    # Construct history messages list for Gemini
    contents = []
    for log in history_logs:
        contents.append({"role": "user", "parts": [log.message]})
        contents.append({"role": "model", "parts": [log.response]})

    # Add the current user message
    contents.append({"role": "user", "parts": [user_message]})

    response_text = ""

    if GEMINI_API_KEY:
        try:
            # We construct a chat session using the history
            model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=system_prompt
            )
            response = model.generate_content(contents)
            response_text = response.text.strip()
        except Exception as e:
            print(f"Gemini chatbot error: {e}")
            response_text = get_rules_fallback_response(user_message, language)
    else:
        # Fallback if API key is not configured
        response_text = get_rules_fallback_response(user_message, language)

    # 2. Save current conversation turn to database
    ChatbotLog.objects.create(
        user=user,
        session_id=session_id,
        message=user_message,
        response=response_text
    )

    return response_text


def get_rules_fallback_response(message, language):
    msg_lower = message.lower()
    
    # Check language
    is_urdu = any(word in msg_lower for word in ['سلام', 'کیسے', 'داخلہ', 'فیس', 'کورس', 'کالج', 'کلاس']) or language.lower() == 'urdu'

    if is_urdu:
        if 'داخلہ' in msg_lower or 'admission' in msg_lower:
            return "گورنمنٹ کالج جھنگ میں داخلے عام طور پر میٹرک اور انٹرمیڈیٹ کے امتحانات کے نتائج کے بعد شروع ہوتے ہیں۔ آپ ہماری ویب سائٹ پر آن لائن فارم پر کر سکتے ہیں۔"
        elif 'کورس' in msg_lower or 'course' in msg_lower:
            return "ہم کمپیوٹر سائنس (ICS, BSCS)، پری انجینئرنگ، پری میڈیکل اور ہیومینیٹیز کے کورسز پیش کرتے ہیں۔"
        else:
            return "سلام! میں جی سی جے (GCJ) اسسٹنٹ ہوں۔ میں آپ کی داخلہ، فیس، یا کورسز کے بارے میں رہنمائی کر سکتا ہوں۔"
    else:
        if 'admission' in msg_lower or 'apply' in msg_lower:
            return "GCJ Admissions generally open after matriculation/intermediate board results. You can submit your application online via our Admission Portal."
        elif 'course' in msg_lower or 'program' in msg_lower:
            return "We offer ICS (Physics/Stats), FSc (Pre-Engineering/Pre-Medical), ICom, and BS Honors in Computer Science, English, Mathematics, and Biology."
        elif 'fee' in msg_lower:
            return "Fees are structured per semester/annual term. Government subsidized rates apply. Please check our fees page or portal for details."
        else:
            return "Hello! I am the GCJ Assistant. How can I help you with admissions, departments, or college life at Government College Jhang today?"
