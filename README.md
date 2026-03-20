<div align="center">
  <img src="https://img.icons8.com/?size=100&id=13724&format=png&color=4FC3F7" alt="TriggerPay Logo" width="80" />
  <h1>TriggerPay ⚡</h1>
  <p><strong>India's first AI-powered parametric insurance for gig delivery workers. Built for Guidewire Devtrails.</strong></p>
  <p><em>Created with ❤️ by <strong>Team Comet</strong></em></p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Status-Prototype-success?style=for-the-badge" alt="Status" />
</p>

## 🚀 Overview

**TriggerPay** is a gig-economy parametric insurance platform that replaces slow, manual insurance claims with **AI-driven, zero-touch payouts**. Tailored specifically for delivery partners (Zomato, Swiggy) in India, TriggerPay actively monitors localized disruptions like:

- 🌧️ Severe Rainstorms & Floods
- 🔥 Extreme Heatwaves
- 😷 Hazardous AQI Spikes
- 🚫 Curfews & Local Strikes

When a disruption breaches safe operating thresholds, TriggerPay automatically files a claim, validates it using our ML Fraud Detection engine, and processes an instant UPI payout—protecting the worker's daily earnings without a single phone call.

## 🌟 Key Features

### 👤 Worker App
- **Frictionless Onboarding:** Partners enter their EMP ID and delivery zone. TriggerPay's **AI Risk Engine** dynamically calculates a personalized micro-premium (e.g., ₹49/week) based on historical weather and city data.
- **Parametric Peace of Mind:** A live dashboard tracks active coverage limits and recent AI-processed payouts.
- **Manual Claim Fallback:** If the automated system misses a highly localized event, workers can file a manual claim which pings the Admin for rapid 1-click approval.

### 👨‍💼 Admin Nerve Center (Insurer Portal)
- **Live Disruption Map:** A real-time telemetry dashboard (built with React Leaflet) visualizing active risks across India.
- **1-Click Approvals:** Review flagged Manual Claims, override risk scores, and approve payouts with zero friction.
- **Fraud Detection Engine:** Tracks claim frequency, IP mismatch, GPS spoofing, and pattern anomalies to assign trust scores.
- **Analytics Dashboard:** Deep-dive into premium collections vs. payout ratios across diverse geographical delivery zones.

## 🛠️ Tech Stack
- **Frontend Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Custom Vanilla CSS (Dark Mode / Glassmorphism UI)
- **Mapping:** Leaflet & React-Leaflet
- **Charts:** Chart.js & React-Chartjs-2
- **Icons:** Lucide React

## 📦 Getting Started

To run the TriggerPay prototype locally:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd TriggerPay
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Explore the Demo:**
   - **Worker Login:** Click "Worker Access" from the landing page. Select "Existing" and enter `001`, `002`, or `003` to view populated worker dashboards. Alternatively, select "New" to experience the AI Risk Onboarding flow.
   - **Admin Login:** Click "Admin Demo" directly from the landing page to access the powerful Disruption Nerve Center, Claims Queue, and Fraud Detection dashboards.

## 💡 The "Why" for Guidewire Devtrails

Gig workers are highly vulnerable to localized climate & socio-economic disruptions. Traditional insurance products are too expensive, require immense paperwork, and take weeks to process a simple ₹500 payout. 

**TriggerPay** solves this data and UX problem using **parametric modeling** and **AI localized scoring**, offering an innovative, micro-transaction-based product loop perfectly suited for modern P&C Insurtech portfolios.
