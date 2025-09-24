from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import random

# 1. Initialize model
model = SentenceTransformer('all-MiniLM-L6-v2')  # small and fast

# 2. University intents and training examples
intents = {
    "greeting": [
        "hi", "hello", "good morning", "hey"
    ],
    "goodbye": [
        "bye", "goodbye", "see you later"
    ],
    "enrollment": [
        "how do I enroll", "where can I enroll", "how to register", "enrollment process",
        "steps to sign up for classes"
    ],
    "tuition": [
        "how much is the tuition", "tuition fees", "payment for school", "school fees"
    ],
    "facilities": [
        "where is the library", "how do I get to the clinic", "location of registrar"
    ],
    "complaint": [
        "how to file a complaint", "report an issue", "where do I complain"
    ]
}

# 3. Responses
responses = {
    "greeting": ["Hello! How can I help you with university info?", "Hi there! What would you like to know?"],
    "goodbye": ["Goodbye!", "See you around campus!", "Take care!"],
    "enrollment": ["You can enroll by visiting the registrar or using the online portal."],
    "tuition": ["Tuition fees vary by program. Please check with the cashier’s office or website."],
    "facilities": ["The library is at the main building, 2nd floor. The clinic is beside the gym. The registrar is near the main gate."],
    "complaint": ["You can file a complaint at the student affairs office or submit it online via the feedback form."]
}

# 4. Precompute embeddings for all training sentences
all_training_sentences = []
sentence_to_intent = []
for intent, sentences in intents.items():
    for s in sentences:
        all_training_sentences.append(s)
        sentence_to_intent.append(intent)

training_embeddings = model.encode(all_training_sentences)

# 5. Chatbot function
def chatbot_response(user_input):
    user_embedding = model.encode([user_input])
    similarities = cosine_similarity(user_embedding, training_embeddings)[0]
    max_index = similarities.argmax()
    max_score = similarities[max_index]

    # confidence threshold
    if max_score < 0.5:
        return "Sorry, I didn’t quite get that. Could you rephrase?"

    intent = sentence_to_intent[max_index]
    return random.choice(responses[intent])

# 6. Run chatbot
while True:
    user_input = input("You: ")
    if user_input.lower() in ["quit", "exit", "bye"]:
        print("Bot: Goodbye! 👋")
        break
    print("Bot:", chatbot_response(user_input))
