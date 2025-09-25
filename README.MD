# Full-Stack Lead Scoring App

A full-stack web application that accepts Product/Offer information and a CSV of leads, then scores each lead’s buying intent (High / Medium / Low) using **rule-based logic + AI reasoning**, and displays results in a web UI.

---

# Live Deployed Links
1. Frontend- https://lead-analysis-with-ai-budx.vercel.app/
2. Backend - https://lead-analysis-with-ai.onrender.com/

---

## **Table of Contents**
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Deployment](#deployment)
- [Bonus Features](#bonus-features)
- [Screenshots / Demo](#screenshots--demo)

---

## **Features**
- Accepts **offer details**: name, value propositions, ideal use cases.
- Accepts **CSV upload** of leads with fields: name, role, company, industry, location, linkedin_bio.
- Scores leads using:
  - **Rules Layer** (max 50 points)
    - Role relevance (0-20)
    - Industry match (0-20)
    - Data completeness (0-10)
  - **AI Layer** (max 50 points)
    - AI determines High/Medium/Low intent + reasoning
- **Final Score** = Rules points + AI points (0-100)
- Displays **results dashboard**:
  - Name, Role, Company, Industry
  - Intent (High/Medium/Low with badges)
  - Score (0–100)
  - Reasoning (short text)
- Optional: CSV export, filters, charts.

---

## **Tech Stack**
- **Backend**: Django + Django REST Framework
- **Frontend**: ReactJS + Tailwind CSS
- **AI Integration**: Google Gemini / OpenAI
- **Database**: SQLite (or PostgreSQL for production)
- **Deployment**: Render (backend), Vercel (frontend)
- **Other**:
  - Axios for API calls
  - react-toastify for notifications

---

## **Project Structure**
project-root/
│
├─ backend/
│ ├─ manage.py
│ ├─ api/
│ │ ├─ models.py
│ │ ├─ serializers.py
│ │ ├─ views.py
│ │ ├─ urls.py
│ │ └─ ai_scoring.py
│ └─ requirements.txt
│
├─ frontend/
│ ├─ package.json
│ ├─ src/
│ │ ├─ App.jsx
│ │ ├─ apiService.js
│ │ ├─ components/
│ │ │ ├─ Home.jsx
│ │ │ ├─ AuthPage.jsx
│ │ │ ├─ Dashboard.jsx
│ │ │ └─ Header.jsx
│ │ └─ index.jsx
│ └─ vite.config.js

## **Setup Instructions**

### **Backend**
1. Navigate to the backend folder:
```bash
cd backend
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Create .env file and set:
```bash
GOOGLE_API_KEY=your_google_api_key
```
4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```
5. Start the server:
```bash
python manage.py runserver
```

## Frontend Setup (React + Tailwind CSS)

### **Prerequisites**
- Node.js (v18 or higher recommended)
- npm or yarn
- Access to backend API URL (set in `.env`)

---

### **1. Navigate to frontend folder**
cd frontend

---

### **2. Install dependencies**
npm install
# or
yarn install

---

### **3. Configure environment variables**
Create a `.env` file in the `frontend` folder with the backend API URL:
VITE_API_URL=http://localhost:8000

---

### **4. Run the development server**
npm run dev
# or
yarn dev

- The app will run at `http://localhost:5173` (default Vite port)
- Open in your browser to test.

---

### **5. Available Scripts**
| Command              | Description |
|---------------------|-------------|
| npm run dev          | Start development server |
| npm run build        | Build production bundle |
| npm run preview      | Preview production build |

---

### **6. Usage**
1. **Offer Form** – Enter product/offer details and submit.
2. **CSV Upload** – Upload leads CSV file.
3. **Run Scoring** – Click "Score Leads" to process leads via AI and rules.
4. **Results Dashboard** – View results table with:
   - Name, Role, Company, Industry
   - AI intent (High / Medium / Low) with color badges
   - Score (0–10)
   - Reasoning

---

### **7. Notes**
- Ensure the backend server is running and `VITE_API_URL` points to it.
- Tailwind CSS is preconfigured for styling components.
- Notifications use **react-toastify**:
- import { toast } from "react-toastify";
- toast.success("Leads scored successfully!");
- toast.error("Failed to score leads");
- Axios is used for API calls via `apiService.js`.

## API Endpoints (Backend)

---

### 1. Create Offer
**POST** `intent/offer/`

**Description:** Accepts product/offer details in JSON and creates a new offer.

**Request Body:**
- `name` (string)
- `value_props` (string)
- `ideal_use_cases` (string)
- `target_roles` (array of strings, optional)
- `target_industries` (array of strings, optional)

**Response:** JSON object of the created offer.

---

### 2. Upload Leads CSV
**POST** `intent/leads/upload/`

**Description:** Accepts a CSV file of leads to create multiple lead entries.

**Request:** Multipart form-data with `file` field (CSV with columns: `name, role, company, industry, location, linkedin_bio`).

**Response:** JSON with number of leads created and lead details.

---

### 3. Score Leads
**POST** `intent/score/?offer_id=offer_id`

**Description:** Processes leads for a given `offer_id` using rules + AI, returns intent and final score.

**Request Body:**
- `offer_id` (integer)

**Response:** JSON with number of processed leads, skipped leads, and results array.

---

### 4. Get Processed Results
**GET** `intent/results/`

**Description:** Retrieves all processed lead scores with intent, reasoning, and final score.

**Response:** JSON array of processed lead results.
