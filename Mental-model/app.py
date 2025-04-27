import os
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate 
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader, TextLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import random

# Load environment variables
load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Initialize Flask app
app = Flask(__name__)

# ---- SETUP LLM ----
def load_llm():
    return ChatGroq(groq_api_key=groq_api_key, model_name="llama3-8b-8192")

llm = load_llm()

# ---- SETUP VECTORSTORE ----
def setup_vectorstore():
    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        if os.path.exists("./trydata.txt"):
            loader = TextLoader("./trydata.txt")
        else:
            loader = PyPDFDirectoryLoader("./")

        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        final_documents = text_splitter.split_documents(docs)
        vectors = FAISS.from_documents(final_documents, embeddings)
        
        return vectors
    except Exception as e:
        print(f"Error setting up vectorstore: {e}")
        return None

vectors = setup_vectorstore()

# ---- DEFINE PROMPT ----
prompt = ChatPromptTemplate.from_template("""
    You are a compassionate mental health assistant. Analyze the following responses to a mixed mental health questionnaire containing items from PHQ-9 (depression), GAD-7 (anxiety), and PSS-10 (stress) assessments.

    User responses:
    {user_responses}

    Question origins:
    {question_origins}

    Based on the responses, determine which condition(s) the user might be experiencing (depression, anxiety, stress, or combinations). Calculate approximate scores for each condition based on the relevant questions.

    Scoring information:
    - Depression questions (PHQ-9): Each answer is scored 0-3. Total score ranges: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe depression.
    - Anxiety questions (GAD-7): Each answer is scored 0-3. Total score ranges: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe anxiety.
    - Stress questions (PSS-10): Items about feeling in control are reverse scored. Score ranges: 0-13 low, 14-26 moderate, 27-40 high perceived stress.

    Provide:
    1. An assessment of which condition(s) appear most prominent
    2. Approximate scores for each condition based on the relevant questions answered
    3. A gentle, supportive explanation of what these symptoms might indicate
    4. 3-5 evidence-based suggestions tailored specifically to the user's most prominent condition(s)
    5. A clear disclaimer that this is not a clinical diagnosis and professional help is recommended

    Context information about mental health approaches from the database:
    {context}
""")

# ---- ANALYSIS FUNCTION ----
def run_analysis(user_responses, question_origins):
    try:
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = vectors.as_retriever(search_kwargs={"k": 3})
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        response = retrieval_chain.invoke({
            "input": "mental health assessment",
            "user_responses": user_responses,
            "question_origins": question_origins
        })

        if "answer" in response:
            return response["answer"]
        elif "output" in response:
            return response["output"]
        else:
            return "Analysis completed, but unexpected response format."
    except Exception as e:
        return f"Error during analysis: {str(e)}"

# ---- API ENDPOINT ----
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        user_responses = data.get('user_responses', '')
        question_origins = data.get('question_origins', '')

        if not user_responses or not question_origins:
            return jsonify({"error": "Missing user_responses or question_origins"}), 400

        result = run_analysis(user_responses, question_origins)

        return jsonify({"result": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- MAIN ----
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
