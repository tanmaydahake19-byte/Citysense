# CitySense — Smart Urban Exploration & Safety Navigator

> **City Life: Exploring, Experiencing & Navigating the Chaos We Call Home**

**CitySense** is a modern full-stack web platform that transforms real-world urban data into verified, actionable insights and recommendations. It helps citizens and travelers navigate cities smartly, safely, and enjoyably.

---

## 🌐 Local Live Link
- **Application URL:** [http://localhost:3000](http://localhost:3000)
- **API Health & Endpoints:**
  - Places API: [http://localhost:3000/api/places](http://localhost:3000/api/places)
  - Safety & Routes API: [http://localhost:3000/api/safety](http://localhost:3000/api/safety)
  - AI NLP Assistant API: `POST http://localhost:3000/api/ai`

---

## 🚀 Key Modules & Capabilities

1. **Exploration & Hospitality:**
   - Filter through food, tourist attractions, hotels, and budget-friendly hidden gems ($ to $$$$).
   - Rich venue cards with real-time safety scores, opening hours, local tips, ratings, and instant map pin viewing.

2. **History & Culture:**
   - Detailed historical periods and cultural backstories (e.g. 16th-century Citadel, classical weekend concerts).
   - Heritage filters and audio guide suggestions.

3. **Safety & Security Radar:**
   - Real-time incident hazard tracking (street lighting outages, congestion, road hazards).
   - Severity filters: Critical, High, Medium, Low.
   - Verified community upvoting and AI confidence scores.

4. **Safe Route Intelligence Engine:**
   - Compares **Safest Route** vs. **Fastest Route** vs. **Scenic Route**.
   - Analyzes well-lit street percentage, municipal CCTV coverage, emergency SOS booth count, and active hazard avoidance.
   - Turn-by-turn safe navigation simulation with audio guidance.

5. **Urban Matrix (Best vs. Worst Places):**
   - Head-to-head neighborhood comparison on:
     - Safety Index
     - Cleanliness & Air Quality
     - Affordability Index
     - Transit Accessibility & Walkability
   - Highlights key strengths and caution points for each urban district.

6. **Live Citizen Pulse & AI Feed:**
   - Crowdsourced reports with NLP verification and sentiment analysis.
   - Interactive report submission modal with photo and voice memo attachments.

7. **AI CitySense Assistant:**
   - Floating interactive assistant answering queries about budget dining, historical landmarks, and safest nighttime walking paths.

8. **Emergency SOS Command:**
   - One-touch emergency distress dispatch.
   - Live GPS broadcasting with nearest police station & hospital finder.
   - Audio siren simulation and instant local helpline dialing.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Dark Theme Tokens
- **Maps:** Leaflet + CartoDB Dark/Voyager Tiles
- **State Management:** Zustand
- **Icons:** Lucide React
- **Backend & APIs:** Next.js App Router API Routes (`/api/places`, `/api/safety`, `/api/ai`)
- **AI / NLP Engine:** Contextual NLP recommendation pipeline & sentiment scoring

---

## 💻 Running the Project

```bash
cd citysense-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.