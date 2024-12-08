# Charcha - The Chat App

Welcome to **Charcha**, a dynamic real-time chat application designed to bring people together through personal messaging, community-driven chat rooms, and seamless, category-based search. Whether you're looking to have a private conversation or join a bustling community, Charcha keeps the conversation flowing effortlessly.

### ✨ Features
- **Real-Time Messaging**: Instantly send and receive messages with real-time synchronization.
- **Personal Messages**: Stay connected with friends, family, or colleagues in secure one-on-one chats.
- **Community Chat Room**: Public Chat Room for people to publish and share their views on any topic.
- **Category-Based Search**: Easily find relevant discussions within community chat rooms with category-based search functionality.

### 🚀 Tech Stack
- **Frontend**: React (TypeScript), Tailwind CSS, Shadcn
- **Backend**: Django Channels (Python)
- **Databases**: Redis (in-memory caching), PostgreSQL (long-term storage)

### 📚 How It Works
* The **frontend** is built using modern technologies like **React** and **Tailwind CSS**, ensuring a clean and responsive user interface.
* The **backend** leverages **Django Channels** to handle real-time web sockets, with **Redis** for in-memory caching to keep things fast and efficient.
* **PostgreSQL** ensures reliable long-term storage of user messages and chat history.
* Everything is containerized using **Docker**, so setting up the app is as easy as running a single command!

## ⚙️ Setup Instructions

1. **Run PostgreSQL Server**:
   ```bash
   docker run -e POSTGRES_PASSWORD=1234 -h localhost -p 5432:5432 -d postgres
   ```
2. **Run Redis Server**:
    ```bash
    docker run --rm -p 6379:6379 redis:7
    ```
3. **Set Up the Backend**:
    - Navigate to the server folder and create a virtual environment:

        ```bash
        python -m venv venv
        source venv/bin/activate  # On Windows: venv\Scripts\activate
        ```
    - Install dependencies:

        ```bash
        pip install -r requirements.txt
        ```
    - Start the Django server:

        ```bash
        python manage.py runserver
        ```
4. **Set Up the Frontend**:
    - Navigate to the client folder and start the frontend:

        ```bash
        npm i && npm run dev
        ```

You're all set! Open your browser and experience Charcha, the ultimate chat app for real-time conversations.