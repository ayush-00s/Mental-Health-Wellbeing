import os
import streamlit as st
from langchain_groq import ChatGroq
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate 
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFDirectoryLoader, TextLoader
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import random

from dotenv import load_dotenv

load_dotenv()

## Load the GROQ and Google Generative API keys from the .env file
groq_api_key = os.getenv("GROQ_API_KEY")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

st.title("Mental Health Assessment")
st.markdown("This tool analyzes your responses to identify potential signs of depression, anxiety, or stress.")

# Initialize the LLM with a currently supported model
@st.cache_resource
def load_llm():
    return ChatGroq(groq_api_key=groq_api_key, model_name="llama3-8b-8192")

llm = load_llm()

# Define the prompt template for comprehensive analysis
prompt = ChatPromptTemplate.from_template(
    """
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
    """
)

# Create vector database
def vector_embedding():
    if "vectors" not in st.session_state:
        with st.spinner("Creating vector store, please wait..."):
            try:
                st.session_state.embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
                
                # Check if we're loading PDF or TXT files
                if os.path.exists("./trydata.txt"):
                    st.session_state.loader = TextLoader("./trydata.txt")
                else:
                    st.session_state.loader = PyPDFDirectoryLoader("./")
                    
                st.session_state.docs = st.session_state.loader.load()
                st.session_state.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                st.session_state.final_documents = st.session_state.text_splitter.split_documents(st.session_state.docs)
                st.session_state.vectors = FAISS.from_documents(st.session_state.final_documents, st.session_state.embeddings)
                return True
            except Exception as e:
                st.error(f"Error creating vector store: {e}")
                return False
    return True

# Define all questions with their origin
all_questions = [
    # PHQ-9 Depression questions
    {"text": "Little interest or pleasure in doing things", "origin": "Depression (PHQ-9)"},
    {"text": "Feeling down, depressed, or hopeless", "origin": "Depression (PHQ-9)"},
    {"text": "Trouble falling or staying asleep, or sleeping too much", "origin": "Depression (PHQ-9)"},
    {"text": "Feeling tired or having little energy", "origin": "Depression (PHQ-9)"},
    {"text": "Poor appetite or overeating", "origin": "Depression (PHQ-9)"},
    
    # GAD-7 Anxiety questions
    {"text": "Feeling nervous, anxious, or on edge", "origin": "Anxiety (GAD-7)"},
    {"text": "Not being able to stop or control worrying", "origin": "Anxiety (GAD-7)"},
    {"text": "Worrying too much about different things", "origin": "Anxiety (GAD-7)"},
    {"text": "Trouble relaxing", "origin": "Anxiety (GAD-7)"},
    {"text": "Being so restless that it's hard to sit still", "origin": "Anxiety (GAD-7)"},
    
    # PSS-10 Stress questions
    {"text": "Been upset because of something that happened unexpectedly", "origin": "Stress (PSS-10)"},
    {"text": "Felt that you were unable to control the important things in your life", "origin": "Stress (PSS-10)"},
    {"text": "Felt nervous and stressed", "origin": "Stress (PSS-10)"},
    {"text": "Felt confident about your ability to handle your personal problems", "origin": "Stress (PSS-10)", "reverse_scored": True},
    {"text": "Felt that things were going your way", "origin": "Stress (PSS-10)", "reverse_scored": True}
]

# Set a seed for reproducible randomization
random.seed(42)

# Select a mixed set of questions (5 from each category - randomly select 15 questions)
def get_mixed_questions():
    # Make sure we have the same selection for each session
    if "selected_questions" not in st.session_state:
        # Group questions by origin
        depression_questions = [q for q in all_questions if "Depression" in q["origin"]]
        anxiety_questions = [q for q in all_questions if "Anxiety" in q["origin"]]
        stress_questions = [q for q in all_questions if "Stress" in q["origin"]]
        
        # Select 5 from each category or all if less than 5 available
        selected_depression = random.sample(depression_questions, min(5, len(depression_questions)))
        selected_anxiety = random.sample(anxiety_questions, min(5, len(anxiety_questions)))
        selected_stress = random.sample(stress_questions, min(5, len(stress_questions)))
        
        # Combine and shuffle
        combined = selected_depression + selected_anxiety + selected_stress
        random.shuffle(combined)
        
        st.session_state.selected_questions = combined
    
    return st.session_state.selected_questions

# Interface
st.header("Combined Mental Health Assessment")
st.write("Over the last 2 weeks, how often have you experienced the following? Please answer honestly.")

# Get the mixed questions
mixed_questions = get_mixed_questions()

# Collect responses
user_responses = {}
question_origins = {}

for i, question in enumerate(mixed_questions):
    # Determine options based on question origin
    if "Depression" in question["origin"] or "Anxiety" in question["origin"]:
        options = ["0 - Not at all", "1 - Several days", "2 - More than half the days", "3 - Nearly every day"]
    else:  # PSS-10
        options = ["0 - Never", "1 - Almost never", "2 - Sometimes", "3 - Fairly often", "4 - Very often"]
    
    # Create the question label
    label = f"{i+1}. {question['text']}"
    if question.get("reverse_scored"):
        label += " (reverse scored)"
    
    # Get user response
    response = st.radio(label, options, key=f"q{i}")
    user_responses[f"Q{i+1}"] = response
    question_origins[f"Q{i+1}"] = question["origin"]

# Process responses
if st.button("Analyze My Responses"):
    # Ensure vector embedding is created
    if vector_embedding():
        # Format responses and question origins
        formatted_responses = "\n".join([f"Q{i+1}: {resp}" for i, resp in enumerate(user_responses.values())])
        formatted_origins = "\n".join([f"Q{i+1}: {origin}" for i, origin in enumerate(question_origins.values())])
        
        # Create the document chain
        document_chain = create_stuff_documents_chain(llm, prompt)
        
        # Create the retriever
        retriever = st.session_state.vectors.as_retriever(search_kwargs={"k": 3})
        
        # Create the retrieval chain
        retrieval_chain = create_retrieval_chain(retriever, document_chain)
        
        with st.spinner("Analyzing your responses..."):
            try:
                # Invoke the chain
                response = retrieval_chain.invoke({
                    "input": "mental health assessment",
                    "user_responses": formatted_responses,
                    "question_origins": formatted_origins
                })
                
                # Display the results in a nicer format with an info box
                st.subheader("Your Assessment Results")
                
                # Check for the correct key in the response
                result_text = ""
                if "answer" in response:
                    result_text = response["answer"]
                elif "output" in response:
                    result_text = response["output"]
                else:
                    result_text = "Analysis completed, but response format is unexpected."
                    st.write("Available keys in response: " + str(list(response.keys())))
                
                # Display the result in a nicer format
                st.info(result_text)
                
                # Add disclaimer
                st.warning("**Important Disclaimer**: This assessment is not a clinical diagnosis. " 
                         "It's meant to provide general insights and suggestions. For accurate diagnosis "
                         "and treatment, please consult with a qualified mental health professional.")
                
                # Show the references if available
                with st.expander("Additional Mental Health Resources"):
                    if "context" in response:
                        for i, doc in enumerate(response["context"]):
                            st.markdown(f"**Resource {i+1}:**")
                            st.write(doc.page_content)
                            st.write("---")
                    else:
                        st.write("No additional resources found in the knowledge base.")
                        st.write("Consider visiting reputable sources like:")
                        st.write("- [National Institute of Mental Health](https://www.nimh.nih.gov)")
                        st.write("- [Mental Health America](https://www.mhanational.org)")
                        st.write("- [SAMHSA's National Helpline](https://www.samhsa.gov/find-help/national-helpline)")
                        
            except Exception as e:
                st.error(f"Error in processing: {e}")
                st.info("If you're seeing an API error, please check that your API keys are set correctly")