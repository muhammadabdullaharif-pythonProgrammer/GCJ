import os
from dotenv import load_dotenv

# Load environments if running standalone
load_dotenv()

try:
    from google import genai
    from google.genai import types
    USE_NEW_SDK = True
except ImportError:
    import google.generativeai as genai  # type: ignore[no-redef]
    USE_NEW_SDK = False

class GCJAmiAdvisor:
    """
    Automated Student Advisor and Assistant chatbot powered by Google Gemini API
    specifically designed for Government College Jhang (GCJ).
    """
    
    SYSTEM_INSTRUCTION = """
    You are "GCJ Advisor", an intelligent and friendly AI Academic Advisor for Government College Jhang (GCJ), Pakistan.
    Your objective is to help students, parents, and visitors with academic information, admissions, courses, and general details about GCJ.

    GCJ Background Information:
    - Located in Jhang, Punjab, Pakistan. It is one of the premier educational institutions in the region.
    - Offers Intermediate Programs:
      * F.Sc Pre-Medical (Physics, Chemistry, Biology)
      * F.Sc Pre-Engineering (Physics, Chemistry, Mathematics)
      * ICS (Physics/Statistics, Mathematics, Computer Science)
      * I.Com (Commerce, Economics, Accounting, IT)
      * General Science & Humanities (Arts)
    - Offers Undergraduate Programs (BS 4-Year):
      * BS Computer Science (BS CS)
      * BS Information Technology (BS IT)
      * BS Chemistry
      * BS Physics
      * BS Mathematics
      * BS English
      * BS Economics
    - Admissions info:
      * Intermediate admissions start usually in July/August after Matriculation results.
      * BS admissions start in August/September after Intermediate results.
      * Merit lists are based on marks obtained in Matric (for Intermediate) and Intermediate (for BS).
    - Facilities: Library, Computer Labs, Science Labs, Sports Grounds, Hostel facility.
    - Values: Academic Excellence, Discipline, and Character Building.

    Rules for your responses:
    1. Be polite, professional, and welcoming.
    2. Keep responses structured, concise, and easy to read (use bullet points where appropriate).
    3. If you do not know the answer to a highly specific query (e.g., specific dates or fees for the current year), ask the user to contact the GCJ Admin office or visit the official admin portal on campus.
    4. Provide answers in English, but if the query is in Urdu, you can reply in Urdu or Roman Urdu.
    """

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("Warning: GEMINI_API_KEY environment variable is not set.")
            self.client = None
            self.model = None
            return

        if USE_NEW_SDK:
            # New google-genai SDK (v1.0+)
            self.client = genai.Client(api_key=api_key)
            self.model = None  # model specified per-request
        else:
            # Legacy google-generativeai SDK
            self.client = None
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel(
                model_name='gemini-1.5-flash',
                system_instruction=self.SYSTEM_INSTRUCTION
            )

    def get_advice(self, user_query: str, chat_history: list = None) -> str:
        """
        Generates a response from the Gemini model based on user query and history.
        """
        if not self.client and not self.model:
            return (
                "The GCJ AI Advisor is currently in mock mode because no valid "
                "GEMINI_API_KEY was found. Please configure the API key in your "
                f".env configuration.\nMock response for: '{user_query}'"
            )

        try:
            if USE_NEW_SDK and self.client:
                response = self.client.models.generate_content(
                    model='gemini-2.0-flash',
                    contents=user_query,
                    config=types.GenerateContentConfig(
                        system_instruction=self.SYSTEM_INSTRUCTION
                    )
                )
                return response.text
            else:
                if chat_history:
                    chat = self.model.start_chat(history=chat_history)
                    response = chat.send_message(user_query)
                else:
                    response = self.model.generate_content(user_query)
                return response.text
        except Exception as e:
            return f"Error interacting with GCJ AI Advisor: {str(e)}"

# Quick standalone test execution
if __name__ == "__main__":
    advisor = GCJAmiAdvisor()
    print("Testing GCJ Advisor...")
    test_query = "What BS courses does Government College Jhang offer?"
    response = advisor.get_advice(test_query)
    print("Response:")
    print(response)
