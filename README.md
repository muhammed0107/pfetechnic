# 🩺 Sa7ti — AI-Powered Mobile Health App

**Sa7ti** is a full-stack AI-powered mobile healthcare application built with React Native (Expo), offering real-time health tracking, disease prediction, smart assistant features, and personalized wellness planning. It integrates a modern mobile user experience with robust backend services and AI-driven insights.

## 📲 Demo Screens

<p align="center">
  <img src="https://github.com/user-attachments/assets/2fe56577-9f7e-4894-86fa-d24a3f3ea236" width="200"/>
  <img src="https://github.com/user-attachments/assets/f76183fd-f205-454c-835f-b59f5c3513f8" width="200"/>
  <img src="https://github.com/user-attachments/assets/b8393a65-8910-4e6b-8467-ee01580935d4" width="200"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/2ecd9326-28b0-4b8d-ac8f-ac51bf628b28" width="200"/>
  <img src="https://github.com/user-attachments/assets/6e35fdd7-8281-49e3-9b26-76f723147007" width="200"/>
  <img src="https://github.com/user-attachments/assets/9bfb711e-fbd8-4464-b451-8112d107ac20" width="200"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/35369076-1c97-4d96-a970-9d179006f963" width="200"/>
  <img src="https://github.com/user-attachments/assets/4749e04b-91ad-4a4d-82fa-ab19c2a5ac94" width="200"/>
  <img src="https://github.com/user-attachments/assets/f753da63-b38e-42c0-ae51-e55962703cb8" width="200"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/0ff8c15c-60e4-4dd4-a385-447fae66a60b" width="200"/>
  <img src="https://github.com/user-attachments/assets/30389a6b-6c31-4e86-a8c2-2f29ff9d9a5a" width="200"/>
</p>



## 📚 Table of Contents

- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Environment Variables](#-environment-variables)
- [Demo Screens](#-demo-screens)
- [Coming Soon](#-coming-soon)
- [Author](#-author)


---

## 📁 Project Structure

```
📦 Sa7ti/
├── frontend/           # React Native Expo app
├── backend/            # Node.js + Express backend with MongoDB
├── backend-ai/         # FastAPI AI service (health predictions, plans)
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sa7ti-app.git
cd sa7ti-app
```

### 2. Backend (Node.js + MongoDB)

```bash
cd backend
npm install
npm start
```

> ⚠️ Add your `.env` file for MongoDB URI, JWT secret, and email credentials.

### 3. Backend AI (Python + FastAPI)

```bash
cd backend-ai
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

> ⚠️ Add your `.env` file for model paths or settings if needed.

### 4. Frontend (React Native Expo)

```bash
cd frontend
npm install
npx expo start
```

---

## 🧠 Features

### 🏃 Activity Tracking
- Step counter using phone sensors  
- Calories burned estimation  
- Weekly activity chart  

### 🧬 AI-Powered Predictions
- Diabetes and blood pressure prediction  
- Smart assistant for exploring diseases, symptoms, and food calories  

### 🧘 Personalized Health Plans
- Auto-generated fitness & nutrition plans  
- Tailored by age, weight, height, BMI, gender, and goals  

### 📡 Real-Time Vitals
- Real-time health metrics from connected sensors (e.g., MQTT)

### 👤 Profile Management
- Edit profile image and information  
- Persisted data synced with backend  

---

## 💡 Technologies Used

| Layer     | Tech Stack                            |
|-----------|----------------------------------------|
| Frontend  | Expo (React Native), Zustand           |
| Backend   | Node.js, Express, MongoDB              |
| AI Engine | FastAPI, Scikit-learn, YOLOv8          |
| Auth      | JWT, AsyncStorage, Nodemailer          |

---

## 📌 Environment Variables

### `.env` in `backend/`

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### `.env` in `backend-ai/`

```
MODEL_PATH=./models/diabetes_model.pkl
```

---

## 📲 Demo Screens

Add screenshots of:
- Step Dashboard  
- Prediction Screen  
- Chat AI Assistant  
- Profile Screen  
- Weekly Plan  

---

## 🧪 Coming Soon

- Fall Detection with YOLOv8 (camera stream)  
- Push Notifications  
- Smart Reminders  

---

## 🧑‍💻 Author

Developed with ❤️ by **Ala Missaoui**  
https://www.linkedin.com/in/ala-missaoui-016a5b25a/
