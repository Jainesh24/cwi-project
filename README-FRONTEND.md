# 🏥 Clinical Waste Intelligence - Frontend

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://cwi-project-xumz.vercel.app/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> AI-Powered Clinical Waste Management System - Frontend Application

**Live Demo:** [https://cwi-project-xumz.vercel.app/](https://cwi-project-xumz.vercel.app/)

---

## 🎯 Overview

Clinical Waste Intelligence (CWI) is a comprehensive healthcare waste management platform that uses AI to analyze, track, and optimize clinical waste disposal. This repository contains the **React frontend** application.

### Key Features

- 🤖 **Real-Time AI Analysis** - Get instant AI-powered insights as you log waste
- 📊 **Interactive Dashboard** - Visualize waste data with dynamic charts
- 🚨 **Alert Management** - Acknowledge and resolve waste alerts with notes
- 🔐 **Multi-Auth Support** - Email, Phone, Google, and Organization login
- 📱 **Responsive Design** - Works seamlessly on desktop and tablet
- ⚡ **Real-Time Updates** - Live data synchronization with backend

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see [backend repo](https://github.com/Jainesh24/cwi-backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/Jainesh24/cwi-project.git
cd cwi-project

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

The app will open at `http://localhost:3000`

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API URL
REACT_APP_API_URL=https://cwi-backend-f2rxs6fbx-jainesh24s-projects.vercel.app/api

# Optional: Firebase Config (if using Firebase Auth)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_PROJECT_ID=clinical-waste-intelligenc
```

---

## 📁 Project Structure

```
cwi-project/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIInsights.js    # AI analysis display
│   │   ├── RiskScoreGauge.js
│   │   ├── Sidebar.js
│   │   └── StatCard.js
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.js   # Authentication state
│   │   └── WasteContext.js  # Waste data state
│   ├── pages/               # Page components
│   │   ├── LoginPage.js     # Authentication
│   │   ├── DashboardPage.js # Main dashboard
│   │   ├── LogWastePage.js  # Waste entry form
│   │   ├── AlertsPage.js    # Alert management
│   │   └── SettingsPage.js  # Settings & logout
│   ├── utils/               # Utility functions
│   │   ├── analytics.js     # Analytics calculations
│   │   ├── constants.js     # App constants
│   │   └── storage.js       # Storage helpers
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🎨 Features in Detail

### 1. Authentication System
- **Email/Password** - Traditional login
- **Phone Authentication** - 20+ country codes supported
- **Google Sign-In** - One-click authentication
- **Organization Login** - Enterprise access with org ID
- **Persistent Sessions** - Stay logged in across refreshes

### 2. Dashboard Analytics
- **KPI Cards** - Total waste, alerts, costs, sustainability score
- **7-Day Trend Chart** - Line chart showing waste by type
- **Risk Score Gauge** - Circular gauge (0-100)
- **Waste Composition** - Pie chart breakdown
- **Department Performance** - Progress bars with variance
- **AI Insights** - Latest entry analysis display

### 3. Waste Logging
- **Complete Form** - 7 fields with validation
- **Real-Time Preview** - See AI analysis as you type
- **Department Selection** - 10 hospital departments
- **Waste Types** - 7 categories (Infectious, Pharmaceutical, etc.)
- **Procedure Categories** - 8 medical procedures
- **AI Analysis** - Instant risk scoring and recommendations

### 4. Alert Management
- **View Alerts** - See all active alerts
- **Acknowledge** - Mark alerts as acknowledged with notes
- **Resolve** - Close alerts with resolution documentation
- **Filter** - View by status (Active/Acknowledged/Resolved/All)
- **Color Coding** - Visual status indicators

### 5. Settings
- **User Profile** - View account information
- **Department Config** - Manage baselines
- **Logout** - Secure sign out

---

## 🛠️ Available Scripts

### Development
```bash
npm start          # Start development server (port 3000)
npm run build      # Create production build
npm test           # Run tests
```

### Deployment
```bash
npm run build      # Build for production
vercel --prod      # Deploy to Vercel
```

---

## 🔗 API Integration

### Backend Endpoints Used

```javascript
// Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

// Waste Management
POST   /api/waste              // Create with AI analysis
GET    /api/waste              // Get all entries
PUT    /api/waste/:id          // Update entry
DELETE /api/waste/:id          // Delete entry

// Alerts
GET    /api/alerts
PUT    /api/alerts/:id/acknowledge
PUT    /api/alerts/:id/resolve

// AI Services
POST   /api/ai/chat            // Chat with AI assistant
POST   /api/ai/analyze         // Get AI analysis
GET    /api/ai/insights        // Dashboard insights
```

### Example API Call

```javascript
// Creating a waste entry
const response = await fetch(`${API_URL}/waste`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    department: 'Emergency',
    wasteType: 'Infectious',
    quantity: 120,
    procedureCategory: 'Emergency Response'
  })
});

const data = await response.json();
// Returns entry with AI analysis included
```

---

## 🎨 UI/UX Design

### Tech Stack
- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Design System
- **Colors** - Teal/Emerald gradient theme
- **Typography** - Inter font family
- **Components** - Modular, reusable
- **Responsive** - Mobile-first approach

### Animations
- Smooth page transitions
- Hover effects on interactive elements
- Slide-in animations for AI insights
- Loading states with spinners

---

## 🚀 Deployment (Vercel)

### Automatic Deployment

This repository is configured for automatic deployment on Vercel:

1. **Push to GitHub** - Automatically triggers deployment
2. **Production URL** - https://cwi-project-xumz.vercel.app/
3. **Preview Deployments** - Created for pull requests

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel

Set these in Vercel Dashboard → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

---

## 📊 Data Flow

```
User Input (Form)
    ↓
Frontend Validation
    ↓
API Request to Backend
    ↓
Backend + AI Processing
    ↓
Response with AI Analysis
    ↓
Frontend Display & State Update
    ↓
Dashboard Charts Update
```

---

## 🔒 Security

- **JWT Tokens** - Stored securely in localStorage
- **HTTPS Only** - All API calls encrypted
- **Input Validation** - Client-side validation
- **XSS Protection** - React built-in protection
- **CORS** - Configured for backend domain only

---

## 🧪 Testing

### Test User Flow

1. Navigate to https://cwi-project-xumz.vercel.app/
2. Click "Sign In"
3. Use any authentication method
4. Go to "Log Waste"
5. Fill in the form - see real-time AI preview
6. Submit - view AI analysis on Dashboard
7. Check "Alerts" for any notifications
8. Manage alerts (Acknowledge/Resolve)

---

## 🐛 Troubleshooting

### Common Issues

**Issue: API calls failing**
```
Solution: Check REACT_APP_API_URL in .env points to correct backend
```

**Issue: Authentication not working**
```
Solution: 
1. Clear localStorage
2. Check backend is running
3. Verify CORS settings in backend
```

**Issue: Charts not displaying**
```
Solution: 
1. Ensure recharts is installed: npm install recharts
2. Check data format from API
```

**Issue: Build fails**
```
Solution:
1. Delete node_modules and package-lock.json
2. Run: npm install
3. Run: npm run build
```

---

## 📈 Performance

- **Lighthouse Score** - 90+ (Performance)
- **Bundle Size** - Optimized with code splitting
- **Lazy Loading** - Components loaded on demand
- **Caching** - Service worker for offline support

---

## 🔄 Updates & Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Check for Security Issues
```bash
npm audit
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Related Repositories

- **Backend API** - [https://github.com/Jainesh24/cwi-backend](https://github.com/Jainesh24/cwi-backend)

---

## 📞 Support

For issues or questions:
- Open an issue in this repository
- Contact: [Your Contact Info]

---

## 🎉 Acknowledgments

- React Team for the amazing framework
- Vercel for seamless deployment
- OpenAI for AI capabilities
- All contributors and testers

---

## 📸 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Waste Logging with Real-Time AI
![Waste Logging](screenshots/log-waste.png)

### Alert Management
![Alerts](screenshots/alerts.png)

---

**Built with ❤️ for healthcare sustainability**

**Live App:** [https://cwi-project-xumz.vercel.app/](https://cwi-project-xumz.vercel.app/)
