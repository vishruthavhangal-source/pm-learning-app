# 🎓 PM Learning App - Adaptive Product Management Learning System

An interactive, adaptive learning platform for aspiring Product Managers with spaced repetition, progress tracking, and comprehensive PM content.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## ✨ Features

### 🎯 Adaptive Learning System
- **Progression Algorithm**: `Next Level = Current Level + (Performance × Difficulty Factor)`
- **Spaced Repetition**: Reviews scheduled using `Interval = Base × e^(-Strength)`
- **Memory System**: Tracks mistakes, weak concepts, and review schedules
- **Skill Tree**: Progressive unlocking based on mastery level

### 📚 Comprehensive Content
- **13 Interactive Lessons** across PM Fundamentals, Strategy, and Discovery
- **50+ Quiz Questions** with adaptive difficulty
- **3 Real-World Case Studies** (Netflix, Airbnb, Slack)
- **5 Portfolio Projects** with deliverables
- **20+ Essential PM Books** with ratings and links
- **12-Month Career Checklist** (28 actionable tasks)
- **Curated Resources**: PM influencers, newsletters, communities, podcasts

### 🎨 Rich UI/UX
- Beautiful gradient design with Tailwind CSS
- Interactive charts and progress visualization (Recharts)
- Persistent storage across sessions
- Mobile-responsive layout

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed ([Download here](https://nodejs.org/))
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pm-learning-app.git
cd pm-learning-app

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

## 📋 Learning Modules

### Module 1: PM Fundamentals ✅
- What is Product Management?
- Product Thinking & Product Sense
- Product Development Lifecycle

### Module 2: Strategy ✅
- Vision & Mission
- Market Analysis (TAM/SAM/SOM, SWOT, Porter's Five Forces)
- Competitive Intelligence & Moats
- Business Models & Unit Economics
- Roadmapping (RICE Framework)

### Module 3: Discovery ✅
- User Research & The Mom Test
- Problem Validation
- Jobs-to-be-Done Framework
- Customer Interviews
- Opportunity Assessment

### Modules 4-7: Coming Soon
- Execution (Agile/Scrum, Prioritization)
- Stakeholder Management
- Metrics & Analytics (KPIs, OKRs, A/B Testing)
- Technical Skills (APIs, System Design)

## 🎮 How to Use

1. **Dashboard**: See your overall progress and due reviews
2. **Learn**: Complete interactive lessons with frameworks and examples
3. **Quiz**: Test your knowledge with adaptive questions
4. **Skills**: Track mastery across 6 PM domains
5. **Resources**: Access curated articles, videos, and courses
6. **Cases**: Analyze real product scenarios
7. **Projects**: Build your PM portfolio
8. **Books**: Discover essential PM reading
9. **Checklist**: Follow the 12-month PM career roadmap
10. **People**: Connect with top PM influencers and communities

## 🏗️ Project Structure

```
pm-learning-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
├── README.md
└── .gitignore
```

## 🛠️ Built With

- **React** - UI framework
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **Tailwind CSS** - Styling (via CDN)
- **Browser Storage API** - Persistent data

## 📊 Key Algorithms

### Progression System
```javascript
// Level up calculation
const calculateLevelUp = (currentLevel, performance, difficultyFactor) => {
  const xpGain = performance * difficultyFactor * 100;
  return { newXp: xpGain, shouldLevelUp: xpGain >= 1000 };
};
```

### Spaced Repetition
```javascript
// Review interval based on concept strength
const calculateReviewInterval = (strength) => {
  const baseDays = 1;
  return baseDays * Math.exp(-strength) * 86400000; // milliseconds
};
```

## 🎯 Roadmap

- [x] Core learning system
- [x] Adaptive quiz engine
- [x] Progress tracking
- [x] Books & resources library
- [x] Career checklist
- [ ] Add Execution module lessons
- [ ] Add Stakeholder Management lessons
- [ ] Add Metrics & Analytics lessons
- [ ] Add Technical Skills lessons
- [ ] User authentication
- [ ] Social features (share progress)
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Marty Cagan** - Inspired framework and PM wisdom
- **Rob Fitzpatrick** - The Mom Test interview methodology
- **Lenny Rachitsky** - PM insights and frameworks
- **Teresa Torres** - Continuous discovery habits
- **Product School** - PM education resources

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - your.email@example.com

Project Link: [https://github.com/YOUR_USERNAME/pm-learning-app](https://github.com/YOUR_USERNAME/pm-learning-app)

---

⭐ **Star this repo if it helped you on your PM journey!**

Made with ❤️ for aspiring Product Managers
