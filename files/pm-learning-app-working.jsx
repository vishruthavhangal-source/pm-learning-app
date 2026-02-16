import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpen, Target, Brain, Trophy, Play, CheckCircle, XCircle, Clock, Zap, TrendingUp } from 'lucide-react';

// Skill tree structure with concepts
const SKILL_TREE = {
  strategy: {
    name: "Product Strategy",
    concepts: ["Vision & Mission", "Market Analysis", "Competitive Intelligence", "Business Model", "Roadmapping"],
    level: 1,
    unlocked: true
  },
  discovery: {
    name: "Product Discovery",
    concepts: ["User Research", "Problem Validation", "Opportunity Assessment", "Jobs-to-be-Done", "Customer Interviews"],
    level: 1,
    unlocked: true
  },
  execution: {
    name: "Product Execution",
    concepts: ["Agile/Scrum", "Sprint Planning", "Backlog Management", "Feature Prioritization", "Release Management"],
    level: 1,
    unlocked: false,
    requires: ["strategy"]
  },
  stakeholders: {
    name: "Stakeholder Management",
    concepts: ["Communication", "Influence Without Authority", "Executive Presentations", "Cross-functional Leadership", "Conflict Resolution"],
    level: 1,
    unlocked: false,
    requires: ["strategy", "discovery"]
  },
  metrics: {
    name: "Metrics & Analytics",
    concepts: ["KPIs/OKRs", "A/B Testing", "Data Analysis", "SQL Basics", "Funnel Analysis"],
    level: 1,
    unlocked: false,
    requires: ["execution"]
  },
  technical: {
    name: "Technical Skills",
    concepts: ["API Basics", "System Design", "Tech Stack Understanding", "Engineering Collaboration", "Technical Debt"],
    level: 1,
    unlocked: false,
    requires: ["execution", "metrics"]
  }
};

// Quiz questions bank
const QUIZ_BANK = {
  strategy: [
    {
      id: "s1",
      difficulty: 1,
      question: "What is the primary purpose of a product vision?",
      options: ["To define quarterly goals", "To inspire and align the team around a long-term goal", "To list all features", "To satisfy stakeholders"],
      correct: 1,
      concept: "Vision & Mission"
    },
    {
      id: "s2",
      difficulty: 1,
      question: "Which framework helps identify Strengths, Weaknesses, Opportunities, and Threats?",
      options: ["RICE", "SWOT", "MoSCoW", "AARRR"],
      correct: 1,
      concept: "Market Analysis"
    },
    {
      id: "s3",
      difficulty: 2,
      question: "When building a product roadmap, what should be prioritized first?",
      options: ["Features requested by sales", "Items aligned with strategic goals and user needs", "Quick wins only", "Whatever engineering wants to build"],
      correct: 1,
      concept: "Roadmapping"
    },
    {
      id: "s4",
      difficulty: 2,
      question: "What is a 'moat' in product strategy?",
      options: ["A water feature", "A competitive advantage that's hard to replicate", "A marketing campaign", "A pricing strategy"],
      correct: 1,
      concept: "Competitive Intelligence"
    },
    {
      id: "s5",
      difficulty: 3,
      question: "How would you validate if a new market is worth entering?",
      options: ["Ask the CEO", "Run TAM/SAM/SOM analysis + competitive research + talk to potential customers", "Check Google Trends", "Copy competitors"],
      correct: 1,
      concept: "Market Analysis"
    }
  ],
  discovery: [
    {
      id: "d1",
      difficulty: 1,
      question: "What is the main goal of user research?",
      options: ["Validate our solution", "Understand user problems and behaviors", "Prove we're right", "Get good reviews"],
      correct: 1,
      concept: "User Research"
    },
    {
      id: "d2",
      difficulty: 1,
      question: "In Jobs-to-be-Done framework, what is a 'job'?",
      options: ["An employment position", "Progress a customer wants to make in a particular circumstance", "A task list", "A feature request"],
      correct: 1,
      concept: "Jobs-to-be-Done"
    },
    {
      id: "d3",
      difficulty: 2,
      question: "Which question is best for customer discovery interviews?",
      options: ["Would you use this feature?", "Tell me about the last time you experienced [problem]", "Do you like our idea?", "How much would you pay?"],
      correct: 1,
      concept: "Customer Interviews"
    },
    {
      id: "d4",
      difficulty: 2,
      question: "What does 'problem validation' mean?",
      options: ["Making sure the problem exists and matters to users", "Getting approval from your manager", "Building a prototype", "Writing PRD"],
      correct: 0,
      concept: "Problem Validation"
    },
    {
      id: "d5",
      difficulty: 3,
      question: "You've interviewed 20 users. 15 mentioned a pain point, but it's not your original hypothesis. What should you do?",
      options: ["Stick to original plan", "Pivot to investigate this new pain point deeper", "Ignore it as noise", "Interview 100 more people"],
      correct: 1,
      concept: "Opportunity Assessment"
    }
  ],
  execution: [
    {
      id: "e1",
      difficulty: 2,
      question: "What is the purpose of a sprint retrospective?",
      options: ["Blame people for mistakes", "Reflect on process and identify improvements", "Plan next features", "Demo to stakeholders"],
      correct: 1,
      concept: "Agile/Scrum"
    },
    {
      id: "e2",
      difficulty: 2,
      question: "How should you prioritize features using RICE framework?",
      options: ["Reach × Impact × Confidence ÷ Effort", "Revenue + Interest + Cost + Execution", "Randomly", "By who shouts loudest"],
      correct: 0,
      concept: "Feature Prioritization"
    },
    {
      id: "e3",
      difficulty: 3,
      question: "Engineering says a feature will take 6 months. Leadership wants it in 1 month. What do you do?",
      options: ["Promise 1 month and hope", "Negotiate scope: identify MVP that delivers core value in realistic timeline", "Quit", "Tell leadership to build it themselves"],
      correct: 1,
      concept: "Backlog Management"
    }
  ],
  stakeholders: [
    {
      id: "st1",
      difficulty: 2,
      question: "A senior executive contradicts your product decision in a meeting. Best response?",
      options: ["Argue back immediately", "Acknowledge their concern, share data/reasoning, offer to discuss offline", "Agree and change everything", "Ignore them"],
      correct: 1,
      concept: "Executive Presentations"
    },
    {
      id: "st2",
      difficulty: 3,
      question: "Sales and Engineering have conflicting priorities for next quarter. How do you resolve this?",
      options: ["Side with sales (revenue)", "Side with engineering (tech debt)", "Facilitate discussion using data and strategy to find balance", "Let them fight it out"],
      correct: 2,
      concept: "Conflict Resolution"
    }
  ],
  metrics: [
    {
      id: "m1",
      difficulty: 2,
      question: "What's the difference between a KPI and an OKR?",
      options: ["No difference", "KPI = health metric you maintain; OKR = ambitious goal you're trying to reach", "KPI is old, OKR is new", "KPI for execs, OKR for teams"],
      correct: 1,
      concept: "KPIs/OKRs"
    },
    {
      id: "m2",
      difficulty: 2,
      question: "Your A/B test shows a 5% improvement but isn't statistically significant. What do you do?",
      options: ["Ship it anyway", "Run the test longer or with more users to reach significance", "Flip a coin", "Ask your manager"],
      correct: 1,
      concept: "A/B Testing"
    },
    {
      id: "m3",
      difficulty: 3,
      question: "Conversion rate drops 20% after a redesign. Your first action?",
      options: ["Panic and revert", "Segment data to understand which users/flows are affected, check for bugs", "Blame design team", "Wait and see"],
      correct: 1,
      concept: "Funnel Analysis"
    }
  ],
  technical: [
    {
      id: "t1",
      difficulty: 2,
      question: "What is an API?",
      options: ["A programming language", "An interface that lets different software talk to each other", "A database", "A server"],
      correct: 1,
      concept: "API Basics"
    },
    {
      id: "t2",
      difficulty: 3,
      question: "Engineering says 'This creates technical debt.' What should you understand?",
      options: ["It's free money", "Quick solution now that will make future changes harder/slower", "A payment plan", "Nothing, ignore it"],
      correct: 1,
      concept: "Technical Debt"
    }
  ]
};

// Resources for each skill
const RESOURCES = {
  strategy: [
    { type: "article", title: "Good Product Strategy by Melissa Perri", url: "#", time: "15 min" },
    { type: "video", title: "Product Vision Workshop", url: "#", time: "45 min" },
    { type: "template", title: "Product Strategy Canvas", url: "#", time: "5 min" },
    { type: "book", title: "Inspired by Marty Cagan", url: "#", time: "6 hours" }
  ],
  discovery: [
    { type: "article", title: "The Mom Test - Customer Interview Guide", url: "#", time: "20 min" },
    { type: "video", title: "Jobs-to-be-Done Framework", url: "#", time: "30 min" },
    { type: "template", title: "User Research Script Template", url: "#", time: "10 min" },
    { type: "course", title: "Product Discovery Bootcamp", url: "#", time: "4 hours" }
  ],
  execution: [
    { type: "article", title: "Mastering Agile as a PM", url: "#", time: "12 min" },
    { type: "video", title: "RICE Prioritization Framework", url: "#", time: "25 min" },
    { type: "template", title: "Sprint Planning Template", url: "#", time: "8 min" },
    { type: "tool", title: "Jira/Linear Tutorial for PMs", url: "#", time: "40 min" }
  ],
  stakeholders: [
    { type: "article", title: "Influence Without Authority", url: "#", time: "18 min" },
    { type: "video", title: "Executive Communication for PMs", url: "#", time: "35 min" },
    { type: "template", title: "Stakeholder Mapping Canvas", url: "#", time: "10 min" }
  ],
  metrics: [
    { type: "article", title: "Choosing the Right Metrics", url: "#", time: "15 min" },
    { type: "video", title: "A/B Testing for PMs", url: "#", time: "40 min" },
    { type: "template", title: "OKR Template", url: "#", time: "8 min" },
    { type: "course", title: "SQL for Product Managers", url: "#", time: "6 hours" }
  ],
  technical: [
    { type: "article", title: "Technical Skills for PMs", url: "#", time: "20 min" },
    { type: "video", title: "API Basics for Non-Engineers", url: "#", time: "30 min" },
    { type: "course", title: "System Design for PMs", url: "#", time: "8 hours" }
  ]
};

// Case studies
const CASE_STUDIES = [
  {
    id: 1,
    company: "Netflix",
    title: "The Recommendation Algorithm Pivot",
    scenario: "Netflix needed to transition from DVD-by-mail to streaming. How did they use data and product strategy to build their recommendation engine?",
    skills: ["strategy", "metrics", "technical"],
    difficulty: 2,
    questions: [
      "What was the strategic insight that led to prioritizing recommendations?",
      "How would you measure success of a recommendation engine?",
      "What trade-offs did they make between personalization and content costs?"
    ]
  },
  {
    id: 2,
    company: "Airbnb",
    title: "Building Trust in a Two-Sided Marketplace",
    scenario: "Early Airbnb faced a trust problem: how do you get strangers to let other strangers into their homes?",
    skills: ["discovery", "execution", "stakeholders"],
    difficulty: 2,
    questions: [
      "What user research methods would reveal the trust barriers?",
      "How would you prioritize trust features (reviews, verification, insurance)?",
      "How do you balance host and guest needs?"
    ]
  },
  {
    id: 3,
    company: "Slack",
    title: "Transitioning from Gaming to B2B SaaS",
    scenario: "Slack started as an internal tool for a gaming company. How did they pivot to become a B2B product?",
    skills: ["strategy", "discovery", "metrics"],
    difficulty: 3,
    questions: [
      "How do you validate a pivot this drastic?",
      "What metrics would indicate product-market fit?",
      "How would you approach enterprise sales vs bottom-up adoption?"
    ]
  }
];

// Portfolio projects
const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: "End-to-End Product Launch",
    description: "Take a feature from 0 to 1: research, PRD, roadmap, launch plan, and post-launch analysis",
    skills: ["strategy", "discovery", "execution", "metrics"],
    duration: "4-6 weeks",
    deliverables: ["User research summary", "PRD", "Go-to-market plan", "Success metrics dashboard"],
    difficulty: 3
  },
  {
    id: 2,
    title: "Product Strategy Deck",
    description: "Create a 3-year product vision and strategy for a real or hypothetical product",
    skills: ["strategy", "stakeholders"],
    duration: "2-3 weeks",
    deliverables: ["Vision statement", "Market analysis", "Competitive positioning", "High-level roadmap"],
    difficulty: 2
  },
  {
    id: 3,
    title: "Data-Driven Feature Prioritization",
    description: "Analyze a product's metrics, identify opportunities, and create a prioritized backlog",
    skills: ["metrics", "execution"],
    duration: "2 weeks",
    deliverables: ["Data analysis report", "Prioritization framework", "Backlog with rationale"],
    difficulty: 2
  },
  {
    id: 4,
    title: "User Research Project",
    description: "Conduct 10+ user interviews, synthesize findings, and present insights",
    skills: ["discovery"],
    duration: "3 weeks",
    deliverables: ["Interview guide", "Research findings", "Persona/journey map", "Opportunity areas"],
    difficulty: 2
  },
  {
    id: 5,
    title: "Product Teardown & Redesign",
    description: "Analyze an existing product, identify problems, and propose improvements",
    skills: ["strategy", "discovery", "execution", "stakeholders"],
    duration: "3-4 weeks",
    deliverables: ["Product critique", "User journey analysis", "Redesign proposal", "Business case"],
    difficulty: 3
  }
];

const PMLearningApp = () => {
  // Initialize storage with default data
  const initializeStorage = async () => {
    const defaultData = {
      skills: SKILL_TREE,
      progress: Object.keys(SKILL_TREE).reduce((acc, key) => {
        acc[key] = {
          level: 1,
          xp: 0,
          unlocked: SKILL_TREE[key].unlocked,
          conceptStrength: SKILL_TREE[key].concepts.reduce((cAcc, concept) => {
            cAcc[concept] = 0.5; // Start at 50% strength
            return cAcc;
          }, {})
        };
        return acc;
      }, {}),
      mistakes: [],
      weakConcepts: [],
      completedQuizzes: [],
      reviewSchedule: [],
      lastActivity: Date.now(),
      completedProjects: [],
      caseStudyResponses: []
    };

    try {
      const existing = await window.storage.get('pm-learning-data');
      if (!existing) {
        await window.storage.set('pm-learning-data', JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(existing.value);
    } catch (error) {
      return defaultData;
    }
  };

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await initializeStorage();
      setUserData(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const saveUserData = async (newData) => {
    try {
      await window.storage.set('pm-learning-data', JSON.stringify(newData));
      setUserData(newData);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Progression function: Next Level = Current Level + (Performance × Difficulty Factor)
  const calculateLevelUp = (currentLevel, performance, difficultyFactor) => {
    const xpGain = performance * difficultyFactor * 100;
    return { newXp: xpGain, shouldLevelUp: xpGain >= 1000 };
  };

  // Review interval: Base × e^(-Strength)
  const calculateReviewInterval = (strength) => {
    const baseDays = 1;
    return baseDays * Math.exp(-strength) * 86400000; // Convert to milliseconds
  };

  const startQuiz = (skillId) => {
    const questions = QUIZ_BANK[skillId] || [];
    const skillLevel = userData.progress[skillId].level;
    
    // Filter questions based on difficulty (current level ± 1)
    const appropriateQuestions = questions.filter(q => 
      q.difficulty >= skillLevel - 1 && q.difficulty <= skillLevel + 1
    );
    
    // Pick 3 random questions
    const selectedQuestions = appropriateQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setCurrentQuestion({
      skillId,
      questions: selectedQuestions,
      currentIndex: 0,
      answers: [],
      startTime: Date.now()
    });
    setQuizActive(true);
  };

  const answerQuestion = (answerIndex) => {
    const question = currentQuestion.questions[currentQuestion.currentIndex];
    const isCorrect = answerIndex === question.correct;
    
    const newAnswers = [...currentQuestion.answers, {
      questionId: question.id,
      correct: isCorrect,
      concept: question.concept,
      difficulty: question.difficulty
    }];

    if (currentQuestion.currentIndex < currentQuestion.questions.length - 1) {
      setCurrentQuestion({
        ...currentQuestion,
        currentIndex: currentQuestion.currentIndex + 1,
        answers: newAnswers
      });
    } else {
      // Quiz complete - calculate results
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (answers) => {
    const correctCount = answers.filter(a => a.correct).length;
    const totalQuestions = answers.length;
    const performance = correctCount / totalQuestions;
    const avgDifficulty = answers.reduce((sum, a) => sum + a.difficulty, 0) / totalQuestions;
    
    const skillId = currentQuestion.skillId;
    const currentProgress = userData.progress[skillId];
    
    // Calculate XP gain
    const { newXp, shouldLevelUp } = calculateLevelUp(currentProgress.level, performance, avgDifficulty);
    const totalXp = currentProgress.xp + newXp;
    const newLevel = shouldLevelUp ? currentProgress.level + 1 : currentProgress.level;
    
    // Update concept strengths
    const newConceptStrength = { ...currentProgress.conceptStrength };
    answers.forEach(answer => {
      const currentStrength = newConceptStrength[answer.concept];
      if (answer.correct) {
        newConceptStrength[answer.concept] = Math.min(1, currentStrength + 0.1);
      } else {
        newConceptStrength[answer.concept] = Math.max(0, currentStrength - 0.15);
      }
    });
    
    // Track mistakes and weak concepts
    const newMistakes = [...userData.mistakes];
    const newWeakConcepts = new Set(userData.weakConcepts);
    
    answers.forEach(answer => {
      if (!answer.correct) {
        newMistakes.push({
          concept: answer.concept,
          questionId: answer.questionId,
          timestamp: Date.now()
        });
        if (newConceptStrength[answer.concept] < 0.5) {
          newWeakConcepts.add(answer.concept);
        }
      } else {
        newWeakConcepts.delete(answer.concept);
      }
    });
    
    // Update review schedule
    const newReviewSchedule = [...userData.reviewSchedule];
    Object.entries(newConceptStrength).forEach(([concept, strength]) => {
      const reviewInterval = calculateReviewInterval(strength);
      newReviewSchedule.push({
        concept,
        skillId,
        nextReview: Date.now() + reviewInterval,
        strength
      });
    });
    
    // Check if this unlocks new skills
    const newProgress = { ...userData.progress };
    newProgress[skillId] = {
      ...currentProgress,
      level: newLevel,
      xp: shouldLevelUp ? totalXp - 1000 : totalXp,
      conceptStrength: newConceptStrength
    };
    
    // Unlock dependent skills if level is high enough
    Object.entries(SKILL_TREE).forEach(([key, skill]) => {
      if (skill.requires && !newProgress[key].unlocked) {
        const requirementsMet = skill.requires.every(req => newProgress[req].level >= 2);
        if (requirementsMet) {
          newProgress[key].unlocked = true;
        }
      }
    });
    
    const updatedUserData = {
      ...userData,
      progress: newProgress,
      mistakes: newMistakes.slice(-50), // Keep last 50 mistakes
      weakConcepts: Array.from(newWeakConcepts),
      reviewSchedule: newReviewSchedule.slice(-100), // Keep last 100 reviews
      completedQuizzes: [...userData.completedQuizzes, {
        skillId,
        score: performance,
        timestamp: Date.now(),
        xpGained: newXp,
        leveledUp: shouldLevelUp
      }]
    };
    
    saveUserData(updatedUserData);
    
    setQuizResults({
      score: correctCount,
      total: totalQuestions,
      xpGained: newXp,
      leveledUp: shouldLevelUp,
      newLevel,
      answers
    });
    setQuizActive(false);
  };

  const getDueReviews = () => {
    if (!userData) return [];
    return userData.reviewSchedule.filter(review => review.nextReview <= Date.now());
  };

  const getProgressData = () => {
    if (!userData) return [];
    return Object.entries(userData.progress).map(([key, value]) => ({
      skill: SKILL_TREE[key].name,
      level: value.level,
      xp: value.xp,
      progress: (value.xp / 1000) * 100
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PM Mastery Path</h1>
              <p className="text-gray-600 mt-1">Adaptive Learning System with Spaced Repetition</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {Object.values(userData.progress).reduce((sum, p) => sum + p.level, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Levels</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {getDueReviews().length}
                </div>
                <div className="text-sm text-gray-600">Due Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {['dashboard', 'skills', 'quiz', 'resources', 'cases', 'projects'].map(view => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  currentView === view
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Your Progress
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getProgressData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="level" fill="#4F46E5" name="Level" />
                  <Bar dataKey="progress" fill="#9333EA" name="Progress to Next Level %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weak Concepts Alert */}
            {userData.weakConcepts.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-6 h-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold text-yellow-900">Concepts Needing Review</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userData.weakConcepts.map(concept => (
                    <span key={concept} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Due Reviews */}
            {getDueReviews().length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Time to Review!</h3>
                </div>
                <p className="text-blue-800 mb-3">
                  You have {getDueReviews().length} concepts due for spaced repetition review
                </p>
                <button
                  onClick={() => setCurrentView('quiz')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Start Review Session
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(SKILL_TREE).map(([key, skill]) => {
              const progress = userData.progress[key];
              const isLocked = !progress.unlocked;
              
              return (
                <div
                  key={key}
                  className={`bg-white rounded-lg shadow-lg p-6 ${
                    isLocked ? 'opacity-50' : 'cursor-pointer hover:shadow-xl'
                  } transition-shadow`}
                  onClick={() => !isLocked && setSelectedSkill(key)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{skill.name}</h3>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">Lv {progress.level}</span>
                    </div>
                  </div>
                  
                  {isLocked ? (
                    <div className="text-gray-500 text-sm">
                      🔒 Unlock by reaching Level 2 in: {skill.requires.join(', ')}
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <div className="bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all"
                            style={{ width: `${(progress.xp / 1000) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600">{progress.xp}/1000 XP</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-700">Concepts:</div>
                        {skill.concepts.map(concept => {
                          const strength = progress.conceptStrength[concept];
                          return (
                            <div key={concept} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{concept}</span>
                              <div className="flex items-center gap-1">
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      strength >= 0.7 ? 'bg-green-500' :
                                      strength >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${strength * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-10">
                                  {Math.round(strength * 100)}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startQuiz(key);
                        }}
                        className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Take Quiz
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {currentView === 'quiz' && !quizActive && !quizResults && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Select a Skill to Quiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(SKILL_TREE).map(([key, skill]) => {
                const isUnlocked = userData.progress[key].unlocked;
                return (
                  <button
                    key={key}
                    disabled={!isUnlocked}
                    onClick={() => startQuiz(key)}
                    className={`p-6 rounded-lg border-2 text-left ${
                      isUnlocked
                        ? 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-bold text-lg mb-2">{skill.name}</div>
                    <div className="text-sm text-gray-600">
                      Level {userData.progress[key].level}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {quizActive && currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion.currentIndex + 1} of {currentQuestion.questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  {SKILL_TREE[currentQuestion.skillId].name}
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentQuestion.currentIndex + 1) / currentQuestion.questions.length) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="mb-8">
              <div className="text-sm text-indigo-600 mb-2">
                Concept: {currentQuestion.questions[currentQuestion.currentIndex].concept}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {currentQuestion.questions[currentQuestion.currentIndex].question}
              </h3>

              <div className="space-y-3">
                {currentQuestion.questions[currentQuestion.currentIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => answerQuestion(idx)}
                    className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {quizResults && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className={`text-6xl font-bold mb-2 ${
                quizResults.score / quizResults.total >= 0.7 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {quizResults.score}/{quizResults.total}
              </div>
              <div className="text-xl text-gray-600 mb-4">
                {Math.round((quizResults.score / quizResults.total) * 100)}% Correct
              </div>
              
              {quizResults.leveledUp && (
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-yellow-900 mb-1">🎉 LEVEL UP!</div>
                  <div className="text-yellow-800">You reached Level {quizResults.newLevel}!</div>
                </div>
              )}

              <div className="inline-block bg-indigo-50 px-6 py-3 rounded-lg">
                <div className="text-sm text-indigo-600">XP Gained</div>
                <div className="text-2xl font-bold text-indigo-900">+{Math.round(quizResults.xpGained)}</div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3">Detailed Results:</h4>
              <div className="space-y-2">
                {quizResults.answers.map((answer, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg flex items-center gap-3 ${
                      answer.correct ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {answer.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{answer.concept}</div>
                      <div className="text-sm text-gray-600">
                        Difficulty: {answer.difficulty}/3
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setQuizResults(null);
                  setCurrentView('dashboard');
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => {
                  setQuizResults(null);
                  setCurrentView('quiz');
                }}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        )}

        {currentView === 'resources' && (
          <div className="space-y-6">
            {Object.entries(RESOURCES).map(([skillKey, resources]) => {
              const skill = SKILL_TREE[skillKey];
              const isUnlocked = userData.progress[skillKey].unlocked;
              
              return (
                <div key={skillKey} className={`bg-white rounded-lg shadow-lg p-6 ${!isUnlocked && 'opacity-50'}`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    {skill.name}
                    {!isUnlocked && <span className="text-sm text-gray-500">(🔒 Locked)</span>}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map((resource, idx) => (
                      <div key={idx} className="border rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-900">{resource.title}</div>
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            {resource.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {resource.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentView === 'cases' && (
          <div className="space-y-6">
            {CASE_STUDIES.map(caseStudy => (
              <div key={caseStudy.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-indigo-600 mb-1">{caseStudy.company}</div>
                    <h3 className="text-xl font-bold text-gray-900">{caseStudy.title}</h3>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    Difficulty: {caseStudy.difficulty}/3
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{caseStudy.scenario}</p>
                
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Skills practiced:</div>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.skills.map(skillKey => (
                      <span key={skillKey} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {SKILL_TREE[skillKey].name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Discussion questions:</div>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    {caseStudy.questions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ol>
                </div>
                
                <button
                  onClick={() => setSelectedCase(caseStudy.id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Work on Case Study
                </button>
              </div>
            ))}
          </div>
        )}

        {currentView === 'projects' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">Portfolio Must-Haves</h2>
              <p className="text-gray-600 mb-6">
                Complete these 5 projects to build a strong PM portfolio that demonstrates end-to-end product skills.
              </p>
            </div>
            
            {PORTFOLIO_PROJECTS.map(project => {
              const isCompleted = userData.completedProjects.includes(project.id);
              const hasRequiredSkills = project.skills.every(s => userData.progress[s].level >= 2);
              
              return (
                <div
                  key={project.id}
                  className={`bg-white rounded-lg shadow-lg p-6 ${!hasRequiredSkills && 'opacity-60'}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                        {isCompleted && (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full whitespace-nowrap">
                      Difficulty: {project.difficulty}/3
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Duration:</div>
                      <div className="text-gray-600">{project.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-2">Skills used:</div>
                      <div className="flex flex-wrap gap-1">
                        {project.skills.map(skillKey => (
                          <span key={skillKey} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {SKILL_TREE[skillKey].name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2">Deliverables:</div>
                    <ul className="space-y-1">
                      {project.deliverables.map((d, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <Target className="w-4 h-4 text-indigo-600" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {!hasRequiredSkills && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                      <p className="text-sm text-yellow-800">
                        🔒 Reach Level 2 in required skills to unlock this project
                      </p>
                    </div>
                  )}
                  
                  <button
                    disabled={!hasRequiredSkills}
                    onClick={() => setSelectedProject(project.id)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      hasRequiredSkills
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    {isCompleted ? 'Review Project' : 'Start Project'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PMLearningApp;