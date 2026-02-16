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

// Interactive Lessons - This is the actual teaching content
const LESSONS = {
  fundamentals: {
    "What is Product Management?": {
      content: `
# What is Product Management?

## The Role

A Product Manager (PM) is the "CEO of the product" - responsible for defining WHAT to build and WHY, working with engineering (HOW) and design (UX).

## Core Responsibilities

### 1. Define the Vision & Strategy
What problem are we solving? For whom? Why now?

### 2. Discover & Validate Problems
Talk to users, understand pain points, validate opportunities

### 3. Prioritize & Roadmap
Decide what to build first, second, third (and what NOT to build)

### 4. Work Cross-Functionally
Collaborate with Engineering, Design, Sales, Marketing, Support

### 5. Ship & Iterate
Launch products, measure results, learn, improve

## PM vs Other Roles

**PM vs Engineering**
- PM: WHAT to build and WHY
- Engineering: HOW to build it

**PM vs Design**
- PM: User problems and business goals
- Design: User experience and interface

**PM vs Project Manager**
- PM: Vision, strategy, what to build
- Project Manager: Timelines, resources, execution

## Types of PMs

### By Product Type
- **B2C PM**: Consumer apps (Instagram, TikTok)
- **B2B PM**: Business software (Salesforce, Slack)
- **Platform PM**: APIs, developer tools (Stripe, Twilio)
- **Internal PM**: Tools for company employees
- **Hardware PM**: Physical products (iPhone, Tesla)

### By Focus Area
- **Growth PM**: Acquisition, activation, retention
- **Data PM**: Analytics platforms, ML products
- **Technical PM**: API-first, infrastructure products
- **AI/ML PM**: AI-powered features

## Day in the Life

**Morning**:
- Review metrics dashboard
- Read user feedback
- Prioritize bug fixes

**Midday**:
- User interview
- Sprint planning with engineering
- Design review

**Afternoon**:
- Stakeholder sync
- Write PRD for new feature
- Competitive analysis

**Evening**:
- Roadmap update
- Read industry news
- Respond to customer questions

## Key Skills

### Hard Skills
1. Data analysis (SQL, Excel, analytics tools)
2. Technical understanding (APIs, system design basics)
3. UX principles
4. Business metrics (LTV, CAC, churn)
5. Prioritization frameworks (RICE, MoSCoW)

### Soft Skills
1. Communication (written & verbal)
2. Influence without authority
3. Empathy (for users and team)
4. Decision-making under uncertainty
5. Stakeholder management

## PM Success Metrics

❌ Lines of code written
❌ Features shipped
❌ Hours worked

✅ User problems solved
✅ Business impact (revenue, retention, engagement)
✅ Team velocity and morale
✅ Product-market fit signals

## Common PM Mistakes

**Mistake 1: Building Without Validation**
Building what YOU think users want vs what they actually need
→ Fix: Talk to 20+ users before writing any spec

**Mistake 2: Feature Factory**
Shipping features without measuring impact
→ Fix: Define success metrics before building

**Mistake 3: Saying Yes to Everything**
Trying to please all stakeholders
→ Fix: Learn to say no with data

**Mistake 4: Not Technical Enough**
Can't have meaningful conversations with engineers
→ Fix: Learn basics of APIs, databases, system design

**Mistake 5: Ignoring Data**
Making decisions based on opinions vs data
→ Fix: Always check analytics before deciding

## How to Break Into PM

### From Engineering
✅ Start contributing to product discussions
✅ Talk to users, share insights
✅ Volunteer for product specs
✅ Transition: APM program or PM role at smaller company

### From Design
✅ Focus on user research & strategy
✅ Learn business metrics
✅ Get technical (SQL, APIs)
✅ Transition: Product Designer → PM

### From Business/Consulting
✅ Build technical skills (learn to code basics)
✅ Get closer to product (PM internship)
✅ Work at product-led company
✅ Transition: Associate PM programs

### Fresh Grad
✅ APM programs (Google, Meta, Uber, Stripe)
✅ PM internships
✅ Build side projects (shows product sense)
✅ MBA → PM (traditional path)

## PM Career Ladder

**Associate PM (APM)** → 0-2 years
- Small features, well-defined scope
- Learning fundamentals

**Product Manager** → 2-5 years
- Own a product area
- Lead small team

**Senior PM** → 5-8 years
- Strategic projects
- Mentor junior PMs

**Lead/Principal PM** → 8-12 years
- Multiple product areas
- Set product vision

**Group PM / Director** → 10+ years
- Manage team of PMs
- Business unit strategy

**VP Product / CPO** → 15+ years
- Entire product organization
- Company strategy
      `,
      keyTakeaways: [
        "PMs own WHAT and WHY, not HOW",
        "Success = solving user problems + business impact",
        "Core skills: communication, data analysis, technical understanding, prioritization"
      ],
      framework: "PM Responsibility Framework",
      tools: [],
      nextSteps: "Start building product sense by analyzing products you use daily"
    },
    "Product Thinking": {
      content: `
# Product Thinking

Product thinking is the ability to understand user problems, identify opportunities, and design solutions that create value.

## What is Product Sense?

The ability to:
1. Identify what makes a product great
2. Understand user needs deeply
3. Make good product decisions
4. See opportunities others miss

## Developing Product Sense

### 1. Reverse Engineer Products

Pick any product and ask:
- **What problem does it solve?**
- **Who is it for? (Target user)**
- **What's the core value prop?**
- **What makes it 10x better than alternatives?**
- **What's the business model?**
- **What would I change?**

Example: Uber
- Problem: Getting a ride is slow, expensive, unreliable
- Target: Urban professionals, travelers
- Value prop: Push a button, get a ride in 5 minutes
- 10x better: Convenience + price + safety (ratings)
- Business model: 20-30% commission per ride
- Change: Improve driver earnings, reduce surge pricing unpredictability

### 2. Practice Product Critiques

Daily exercise: Pick a product feature and analyze:
- Why did they build this?
- What metrics are they trying to move?
- What tradeoffs did they make?
- How would you improve it?

### 3. Understand Your Users

**User Archetypes**:
- Power users (10x engagement)
- Casual users (80% of users)
- Non-users (potential market)
- Churned users (why did they leave?)

### 4. Think in Problems, Not Solutions

❌ "Let's add a chat feature"
✅ "Users need faster communication with sellers"

❌ "Competitors have dark mode"
✅ "Users want to reduce eye strain in low-light environments"

## Framework: CIRCLES Method™

For product design questions:

**C**omprehend the situation
- Clarify the goal, constraints, assumptions

**I**dentify the customer
- Who is the target user?

**R**eport customer needs
- What are their pain points?

**C**ut through prioritization
- Which needs are most important?

**L**ist solutions
- Brainstorm multiple solutions

**E**valuate tradeoffs
- Pros/cons of each solution

**S**ummarize recommendation
- Your pick + rationale

## Example: Design a Product for Busy Parents

**Comprehend**: Reduce stress around meals
**Identify**: Working parents, 2 kids, suburban
**Report needs**: 
- No time to plan meals
- Want healthy food
- Kids are picky

**Cut**: Prioritize time-saving over cost
**List solutions**:
1. Meal kit delivery (HelloFresh)
2. Ready-to-eat delivery (Factor)
3. Meal planning app + grocery delivery
4. Personal chef service

**Evaluate**:
- Meal kits: Time-saving but still need to cook
- Ready-to-eat: Most convenient, but expensive
- App: Cheapest, but still requires effort

**Summarize**: Start with meal kits (best balance of convenience, cost, health)

## Product Intuition Questions to Practice

1. Why does Instagram show double-tap heart animation?
2. Why does Slack have threads?
3. Why does Spotify have Discover Weekly vs Daily Mix?
4. Why does Amazon have 1-Click ordering?
5. Why does Airbnb ask about trip purpose?

## Building Product Judgment

**Good PMs ask**:
- What's the user trying to accomplish?
- What's the simplest solution?
- How will we measure success?
- What could go wrong?
- Is this the right problem to solve?

**Bad PMs ask**:
- What features do competitors have?
- What do stakeholders want?
- What's easiest to build?
- What looks coolest?

## The "Why" Ladder

Keep asking "why" until you reach the root:

"We need a notifications feature"
→ Why? "So users don't miss messages"
→ Why do they miss messages? "They don't check the app often"
→ Why not? "The content isn't engaging enough"
→ **Real problem**: Engagement, not notifications!
      `,
      keyTakeaways: [
        "Product sense = understanding users + seeing opportunities + good judgment",
        "Practice by reverse-engineering products daily",
        "Think in problems, not solutions"
      ],
      framework: "CIRCLES Method, Why Ladder",
      tools: ["Product Teardowns"],
      nextSteps: "Do 5 product critiques this week using the CIRCLES method"
    },
    "The Product Development Lifecycle": {
      content: `
# The Product Development Lifecycle

## Overview

The product lifecycle is the journey from idea → launch → growth → maturity → sunset.

## Stage 1: Discovery (Problem Space)

**Goal**: Find a problem worth solving

**Activities**:
- User research & interviews
- Market analysis
- Competitive research
- Problem validation

**Outputs**:
- Problem statement
- User personas
- Opportunity sizing
- Success criteria

**Duration**: 2-4 weeks

**Key Question**: "Is this a real problem people will pay to solve?"

## Stage 2: Define (Solution Space)

**Goal**: Design the right solution

**Activities**:
- Ideation workshops
- Prototyping
- User testing
- Technical feasibility check

**Outputs**:
- Product spec / PRD
- Wireframes / mockups
- Technical architecture
- Go/no-go decision

**Duration**: 2-4 weeks

**Key Question**: "Does our solution actually solve the problem?"

## Stage 3: Build

**Goal**: Ship a high-quality product

**Activities**:
- Sprint planning
- Daily standups
- Design QA
- Code reviews
- Bug fixing

**Outputs**:
- Working product
- Documentation
- Test coverage
- Beta release

**Duration**: 4-12 weeks (depends on scope)

**Key Question**: "Are we building this right?"

## Stage 4: Launch

**Goal**: Get the product into users' hands

**Activities**:
- Go-to-market planning
- Marketing campaigns
- Sales enablement
- Support prep
- Phased rollout

**Outputs**:
- Public launch
- Press coverage
- User onboarding
- Launch metrics

**Duration**: 1-2 weeks

**Key Question**: "How do we drive adoption?"

## Stage 5: Measure & Iterate

**Goal**: Learn and improve

**Activities**:
- Monitor metrics
- User feedback collection
- A/B tests
- Bug fixes
- Feature improvements

**Outputs**:
- Performance report
- Iteration plan
- User insights
- Roadmap updates

**Duration**: Ongoing

**Key Question**: "What are we learning? What should we change?"

## Product Development Methodologies

### Waterfall (Old School)
Research → Design → Build → Test → Launch
- Linear, sequential
- Hard to change once started
- ❌ Rarely used for modern products

### Agile / Scrum
2-week sprints, continuous iteration
- Flexible, adaptive
- Regular user feedback
- ✅ Most common for software

### Lean Startup
Build → Measure → Learn loop
- Minimum viable product (MVP)
- Validated learning
- Pivot or persevere
- ✅ Great for early-stage

### Dual-Track Agile
Discovery track + Delivery track run in parallel
- Validate ideas before building
- Reduces waste
- ✅ Best of both worlds

## Sprint Structure (Agile)

**Week 1**:
- Monday: Sprint planning (prioritize backlog)
- Tuesday-Thursday: Development
- Friday: Demo progress

**Week 2**:
- Monday-Wednesday: Development
- Thursday: Testing & QA
- Friday: Demo + Retrospective

## Key Documents PMs Create

### 1. Product Requirements Document (PRD)
- Problem statement
- Goals & success metrics
- User stories
- Wireframes
- Technical requirements
- Launch plan

### 2. User Stories
Format: "As a [user], I want [feature] so that [benefit]"

Example: "As a driver, I want to see rider ratings before accepting so that I can avoid problematic passengers"

### 3. Product Roadmap
Visual timeline of what you're building and why

### 4. Go-to-Market Plan
How you'll launch and drive adoption

## MVP vs MLP vs MMP

**MVP (Minimum Viable Product)**
- Smallest thing to test hypothesis
- May not be "sellable"
- Example: Landing page + signup form

**MLP (Minimum Lovable Product)**  
- Small but delightful
- Users actually enjoy it
- Example: Superhuman's curated launch

**MMP (Minimum Marketable Product)**
- Smallest thing you can charge for
- Has core value prop
- Example: Dropbox's initial 2GB offering

## When to Ship

✅ Ship when:
- Core value prop works
- Major bugs fixed
- Success metrics defined
- Go-to-market ready

❌ Don't wait for:
- Every feature idea
- Perfect polish
- Competitor parity
- 100% confidence

**"If you're not embarrassed by v1, you launched too late"** - Reid Hoffman
      `,
      keyTakeaways: [
        "Product lifecycle: Discovery → Define → Build → Launch → Iterate",
        "Agile/Scrum is standard for modern software products",
        "Ship early, learn fast, iterate based on real user feedback"
      ],
      framework: "Product Development Lifecycle, Agile/Scrum",
      tools: ["Jira", "Linear", "Asana"],
      nextSteps: "Familiarize yourself with Agile ceremonies and sprint planning"
    }
  },
  strategy: {
    "Vision & Mission": {
      content: `
# Product Vision & Mission

## What is it?
- **Vision**: An inspiring, long-term picture of what your product will achieve (3-10 years)
- **Mission**: The fundamental purpose - WHY the product exists

## Why it matters
A clear vision aligns your team, helps prioritize decisions, and attracts users/investors who share your values.

## Framework: Vision Statement Template
**For [target customer]**
**Who [statement of need/opportunity]**
**The [product name] is a [product category]**
**That [key benefit/compelling reason to buy]**
**Unlike [primary competitive alternative]**
**Our product [statement of primary differentiation]**

## Real Examples

### Airbnb Vision
"Belong anywhere" - Create a world where anyone can belong anywhere, providing healthy travel that is local, authentic, diverse, inclusive and sustainable.

### Tesla Vision  
"Accelerate the world's transition to sustainable energy"

### Spotify Mission
"Unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art and billions of fans the opportunity to enjoy and be inspired by it."

## Key Principles
1. **Aspirational**: Stretch goal that inspires
2. **Clear**: Anyone can understand it
3. **Stable**: Shouldn't change often
4. **Actionable**: Guides decisions

## Exercise
Draft a vision statement for a product you want to build. Use the template above.
      `,
      keyTakeaways: [
        "Vision = long-term aspiration, Mission = fundamental purpose",
        "Good visions inspire and provide decision-making clarity",
        "Test: Can a new team member use your vision to make product decisions?"
      ],
      framework: "Vision Statement Template",
      tools: [],
      nextSteps: "After defining vision, create a product strategy that shows HOW you'll achieve it"
    },
    "Market Analysis": {
      content: `
# Market Analysis for PMs

## The Goal
Understand the market landscape so you can identify opportunities, position effectively, and make data-driven bets.

## Key Frameworks

### 1. TAM/SAM/SOM Analysis
**TAM (Total Addressable Market)**: Everyone who could possibly use your solution
**SAM (Serviceable Addressable Market)**: Segment you can reach with your distribution
**SOM (Serviceable Obtainable Market)**: What you can realistically capture

**Example - Meal Kit Delivery:**
- TAM: All US households ($127B - entire food at home market)
- SAM: Urban households willing to pay premium ($18B)
- SOM: 2% market share in Year 3 ($360M)

### 2. SWOT Analysis
**Strengths**: What you do better than anyone
**Weaknesses**: Where you're vulnerable
**Opportunities**: External factors you can exploit
**Threats**: External risks

### 3. Porter's Five Forces
1. Threat of new entrants
2. Bargaining power of suppliers
3. Bargaining power of buyers
4. Threat of substitutes
5. Industry rivalry

## How to Do Market Research

### Primary Research (Talk to people)
- Customer interviews (20-50)
- Surveys (100+ responses)
- Focus groups
- Beta testing

### Secondary Research (Desk research)
- Industry reports (Gartner, Forrester)
- Competitor websites/reviews
- Google Trends, SimilarWeb
- Government data (Census, Bureau of Labor)
- Financial filings (public companies)

## Red Flags in Market Analysis
❌ "Market is $1 trillion" (too broad)
❌ Only looking at competitors' websites
❌ Assuming 1% of a huge market
✅ Bottom-up calculation from real user data
✅ Talking to 30+ potential customers
✅ Understanding WHY users choose alternatives

## Real Example: Notion's Market Analysis

**TAM**: $50B (all productivity software)
**SAM**: $8B (modern knowledge workers, tech companies)
**SOM**: $500M (Year 5 target, <1% of TAM)

**Key Insight**: Market wasn't "note-taking apps" but "collaborative workspaces" - much bigger opportunity.
      `,
      keyTakeaways: [
        "Always do bottom-up TAM calculation from real user data",
        "Talk to 30+ customers before believing your market hypothesis",
        "SWOT is just a starting point - validate everything with data"
      ],
      framework: "TAM/SAM/SOM, SWOT, Porter's Five Forces",
      tools: ["Google Trends", "SimilarWeb", "Crunchbase"],
      nextSteps: "Use market insights to craft competitive positioning and identify white space opportunities"
    },
    "Competitive Intelligence": {
      content: `
# Competitive Intelligence

## What to Track

### 1. Product Features
- What do they have that you don't?
- What do you have that they don't?
- Feature comparison matrix

### 2. Positioning & Messaging
- Who are they targeting?
- What's their value prop?
- How do they talk about the problem?

### 3. Business Model
- How do they make money?
- Pricing tiers
- Unit economics (if public)

### 4. Distribution Strategy
- How do users discover them?
- Self-serve vs sales-led?
- Partnership channels

### 5. Traction Signals
- Funding rounds
- Team growth (LinkedIn)
- Product releases
- Customer reviews

## Framework: Competitive Moats

A moat = sustainable competitive advantage

### Types of Moats:
1. **Network Effects**: Value increases with users (LinkedIn, Uber)
2. **Switching Costs**: Hard/expensive to leave (Salesforce, SAP)
3. **Economies of Scale**: Lower costs at scale (Amazon, Walmart)
4. **Brand**: Trust premium (Apple, Nike)
5. **Proprietary Tech/Data**: Can't be replicated (Google Search, Spotify's algorithm)

## Where to Gather Intel

**Free Sources:**
- Competitor websites/blogs
- App Store reviews
- G2/Capterra reviews
- LinkedIn (team growth, job posts)
- Crunchbase (funding)
- Product Hunt launches
- Reddit, Twitter discussions

**Paid Tools:**
- SimilarWeb (traffic)
- Sensor Tower (mobile)
- SEMrush (SEO/ads)
- Gartner/Forrester (enterprise)

## How to NOT Compete

❌ Feature parity ("me too" strategy)
❌ Racing to the bottom on price
❌ Fighting in their strongest area

✅ Find your unique wedge
✅ Go after underserved segment
✅ Compete on different dimensions

## Real Example: Figma vs Adobe

**Adobe's Moat**: 
- 30 years of features
- Industry standard (switching costs)
- Deep pockets

**Figma's Wedge**:
- Browser-based (no install friction)
- Real-time collaboration (network effects)
- Freemium (bottoms-up adoption)

Result: Figma didn't try to match Photoshop features. They redefined the game around collaboration.
      `,
      keyTakeaways: [
        "Don't compete on features alone - find a unique wedge",
        "Best moat = something that gets stronger as you grow",
        "Study competitors' weaknesses, not just strengths"
      ],
      framework: "Competitive Moats",
      tools: ["SimilarWeb", "Crunchbase", "G2 Reviews"],
      nextSteps: "Identify your defensible moat and double down on it"
    },
    "Business Model": {
      content: `
# Business Models for PMs

## Why PMs Need to Understand Business Models

You can't build the right product if you don't understand how the company makes money.

## Common SaaS Business Models

### 1. Freemium
**How it works**: Free tier → paid upgrades
**Examples**: Dropbox, Slack, Figma
**Key Metric**: Conversion rate (free → paid)
**PM Considerations**: 
- What features are free vs paid?
- How do you drive upgrades without annoying free users?

### 2. Subscription
**How it works**: Recurring monthly/annual fee
**Examples**: Netflix, Spotify, Adobe Creative Cloud
**Key Metric**: Monthly Recurring Revenue (MRR), Churn
**PM Considerations**:
- Retention > acquisition
- Must continuously add value

### 3. Usage-Based
**How it works**: Pay per API call, storage, compute
**Examples**: AWS, Twilio, Snowflake
**Key Metric**: Revenue per user, consumption growth
**PM Considerations**:
- Align product value with usage
- More usage = more revenue

### 4. Marketplace/Transaction
**How it works**: Take % of each transaction
**Examples**: Airbnb, Uber, Etsy
**Key Metric**: Gross Merchandise Value (GMV), take rate
**PM Considerations**:
- Balance supply/demand
- Two-sided optimization

### 5. Enterprise
**How it works**: Custom contracts, sales-led
**Examples**: Salesforce, Workday, ServiceNow
**Key Metric**: Annual Contract Value (ACV), logo retention
**PM Considerations**:
- Feature vs scalability tradeoffs
- Support + security requirements

## Unit Economics 101

### Key Formulas:

**Customer Acquisition Cost (CAC)**
= Sales + Marketing costs / # new customers

**Lifetime Value (LTV)**  
= Average Revenue per User × Gross Margin % × (1/Churn Rate)

**LTV:CAC Ratio**
= LTV / CAC
✅ Good: 3:1 or higher
⚠️ Warning: Under 1:1 (losing money per customer)

**Payback Period**
= CAC / (Monthly Revenue per Customer × Gross Margin %)
✅ Good: Under 12 months
⚠️ Warning: Over 24 months

## How Business Model Affects Product Decisions

### Example: Slack

**Model**: Freemium → Team subscriptions

**Product Decisions Driven By Model:**
- Free tier has message history limit (drives upgrades)
- Paid features: Unlimited integrations, SSO, compliance
- Virality built-in (users invite teammates)
- Land-and-expand motion (start with small team, grow to enterprise)

**Result**: 
- 49% of revenue from viral adoption
- Median payback period: 4 months
- Net Revenue Retention: 170% (upsells > churn)

## Exercise: Analyze a Product's Business Model

Pick a product you use:
1. What's the business model?
2. How does this affect product decisions?
3. Where are the monetization pressure points?
4. What features exist purely to drive revenue?
      `,
      keyTakeaways: [
        "Business model determines product priorities",
        "LTV:CAC ratio should be 3:1 or better",
        "Freemium needs clear value differentiation between free/paid"
      ],
      framework: "Unit Economics (LTV/CAC)",
      tools: ["Financial models", "Cohort analysis"],
      nextSteps: "Calculate unit economics for your product to validate business viability"
    },
    "Roadmapping": {
      content: `
# Product Roadmapping

## What is a Roadmap?

A visual plan that shows:
- **WHAT** you're building
- **WHY** it matters (ties to strategy)
- **WHEN** (roughly - avoid exact dates)

## Roadmap Anti-Patterns

❌ List of features with exact dates (you'll miss them)
❌ Commitments made without engineering input
❌ Everything is "high priority"
❌ No connection to strategy
❌ Locked in stone (no flexibility)

✅ Themes and outcomes, not just features
✅ Quarterly horizons with increasing ambiguity
✅ Clear prioritization rationale
✅ Tied to metrics and business goals
✅ Adaptable based on learnings

## Roadmap Horizons

**Now (Current Quarter)**
- Detailed, high confidence
- In development or about to start
- Defined success metrics

**Next (Next 1-2 Quarters)**  
- Medium detail
- Prioritized and sequenced
- May shift based on learnings

**Later (3-4 Quarters+)**
- High-level themes
- Strategic bets
- Expect to change

## Good Roadmap Structure

### Theme-Based Roadmap

**Q1: Activation & Onboarding**
- Improve new user experience
- Target: Increase Day 1 retention from 40% → 60%

**Q2: Power User Features**  
- Deepen engagement for active users
- Target: Increase weekly active users by 30%

**Q3: Monetization**
- Launch paid tier
- Target: 5% conversion rate

### Outcome-Based Roadmap

**Now**: Reduce churn by 20%
- Feature A: Improve core workflow
- Feature B: Better notifications

**Next**: Expand to new market segment
- Research enterprise needs
- Build admin controls

## Prioritization Frameworks

### RICE Score
**Reach**: How many users affected? (per quarter)
**Impact**: How much does it move the needle? (0.25 = minimal, 3 = massive)
**Confidence**: How sure are you? (0-100%)
**Effort**: How many person-months?

**RICE Score = (Reach × Impact × Confidence) / Effort**

Example:
- Reach: 1000 users/quarter
- Impact: 2 (large)
- Confidence: 80%
- Effort: 2 person-months

RICE = (1000 × 2 × 0.8) / 2 = 800

### Other Frameworks
- **MoSCoW**: Must have, Should have, Could have, Won't have
- **Value vs Effort**: 2x2 matrix
- **ICE**: Impact, Confidence, Ease
- **WSJF**: Weighted Shortest Job First (SAFe)

## How to Build a Roadmap

**Step 1**: Start with strategy
- What are our goals this year?
- What metrics move the needle?

**Step 2**: Gather input  
- Customer feedback
- Sales/support requests
- Engineering tech debt
- Market trends

**Step 3**: Prioritize ruthlessly
- Use RICE or similar framework
- Consider dependencies
- Check resource capacity

**Step 4**: Get buy-in
- Share draft with stakeholders
- Explain tradeoffs
- Align on "why"

**Step 5**: Review quarterly
- What changed?
- What did we learn?
- Reprioritize

## Stakeholder Communication

### For Executives
- High-level themes
- Business impact
- Resource needs
- Risks

### For Engineering
- Technical details
- Scope/requirements
- Timeline flexibility
- Architecture implications

### For Sales/Marketing
- Launch dates (with buffer)
- Customer value
- Positioning
- Competitive angle

### For Customers  
- Benefits, not features
- "When" as quarters, not dates
- Get feedback on priorities

## Real Example: Notion's 2019 Roadmap

**Theme**: Make Notion a "workspace for teams"

**Q1-Q2**: 
- Real-time collaboration (multiplayer)
- Comments and discussions
- Permissions and sharing

**Q3-Q4**:
- Web clipper (content acquisition)
- Public pages (distribution)
- API (ecosystem)

**Result**: Revenue grew 10x in 2019 because roadmap focused on expanding from individual to team use case.
      `,
      keyTakeaways: [
        "Roadmaps are communication tools, not contracts",
        "Organize by outcomes/themes, not just features",
        "RICE is great for scoring, but context matters"
      ],
      framework: "RICE Prioritization, Roadmap Horizons",
      tools: ["ProductBoard", "Aha!", "Notion", "Google Sheets"],
      nextSteps: "Create a one-page roadmap using outcome-based themes, not feature lists"
    }
  },
  discovery: {
    "User Research": {
      content: `
# User Research for Product Managers

## Why User Research Matters

Without research, you're just building based on your own assumptions. Most products fail because they solve problems users don't actually have.

## Types of User Research

### 1. Generative (Discovery)
**Goal**: Understand problems, needs, behaviors
**When**: Before building anything
**Methods**: 
- Interviews
- Ethnographic observation  
- Diary studies
- Jobs-to-be-Done interviews

### 2. Evaluative (Validation)
**Goal**: Test if your solution works
**When**: After building prototypes/MVP
**Methods**:
- Usability testing
- A/B tests
- Prototype testing
- First-click tests

### 3. Quantitative
**Goal**: Understand "how many" and "how much"
**Methods**:
- Surveys (100+ responses)
- Analytics
- Heatmaps
- Session recordings

### 4. Qualitative  
**Goal**: Understand "why" and context
**Methods**:
- Interviews (20-50)
- Focus groups
- Observation

## The Mom Test - How to Interview Users

### Bad Questions (Leading/Hypothetical)
❌ "Would you use a feature that does X?"
❌ "Do you think this is a good idea?"
❌ "How much would you pay for this?"
❌ "Would you buy this?"

### Good Questions (Specific Past Behavior)
✅ "Tell me about the last time you [struggled with problem]"
✅ "Walk me through how you currently solve this"
✅ "What's frustrating about your current solution?"
✅ "What have you tried to do about this?"
✅ "Who else is involved in this decision?"

## Interview Script Template

**Introduction (2 min)**
- Who you are
- What you're researching (stay vague)
- No right/wrong answers
- Permission to record

**Background (5 min)**
- Role/responsibilities
- Typical day/workflow
- Context setting

**Problem Exploration (20 min)**
- When did you last experience [problem]?
- Walk me through what happened
- What was frustrating about it?
- What did you do? Why?
- What alternatives have you tried?
- How much time/money does this cost you?

**Current Solutions (10 min)**  
- What tools do you use today?
- What do you love/hate about them?
- What's missing?
- If you had a magic wand...

**Wrap-up (3 min)**
- Anything else I should know?
- Can I follow up with questions?
- Who else should I talk to?

## How Many Interviews?

**Problem validation**: 10-15 (you'll see patterns)
**Solution validation**: 5-8 per user segment
**Usability testing**: 5 users (finds 85% of issues)

## Red Flags in User Research

❌ Only talking to existing happy customers
❌ Asking friends/family
❌ Sample size of 3
❌ Leading questions
❌ Talking more than listening (you should listen 80%+)
❌ Falling in love with quotes that confirm your bias

## Synthesizing Research

**Step 1**: Take detailed notes during interview
**Step 2**: Transcribe (or use AI tools)
**Step 3**: Tag insights with themes
**Step 4**: Look for patterns across interviews
**Step 5**: Prioritize insights by frequency + severity

### Common Patterns to Look For:
- Pain points mentioned by 70%+ of users
- Workarounds users have built
- Emotional reactions ("I hate...")
- Money/time users spend on problem
- "Hair on fire" problems vs nice-to-haves

## Real Example: Superhuman

**Research Finding**: 
Interviewed 100+ users who tried email clients. Asked: "How would you feel if you could no longer use this product?"
- "Very disappointed" = product-market fit signal
- <40% = no PMF
- Superhuman hit 58% on first try

**Action**: 
Doubled down on users who said "very disappointed." Asked them "what would make you more disappointed?" Those became feature priorities.

## Tools

**Free**:
- Google Meet/Zoom (recording)
- Otter.ai (transcription)
- Notion/Sheets (synthesis)

**Paid**:
- UserTesting.com (recruit testers)
- Dovetail (research repository)
- Maze (prototype testing)
      `,
      keyTakeaways: [
        "Ask about past behavior, not future intentions",
        "Sample size of 10-15 is enough to find patterns",
        "The Mom Test: Don't ask if they'd use it, ask how they solve the problem today"
      ],
      framework: "The Mom Test, Jobs-to-be-Done interviews",
      tools: ["Otter.ai", "Dovetail", "UserTesting", "Maze"],
      nextSteps: "Conduct 10 user interviews using the Mom Test principles"
    },
    "Problem Validation": {
      content: `
# Problem Validation

## What is Problem Validation?

Before building ANY solution, you must prove:
1. The problem exists
2. It's painful enough that people want it solved
3. People will change their behavior to solve it

## The Problem Validation Framework

### Step 1: Identify the Problem Hypothesis

**Format**: 
[User type] struggles with [problem] when [context] which causes [negative outcome]

**Example**:
"Busy parents struggle with meal planning during weeknights which causes stress, unhealthy eating, and food waste"

### Step 2: Define What "Validated" Means

Set clear criteria BEFORE talking to users:
- 70% of interviewees mention this problem unprompted
- Problem causes $X lost or Y hours wasted per month
- Users have tried 2+ solutions already
- Pain level 7+/10

### Step 3: Talk to Users (The Mom Test)

**Good Questions**:
- "Tell me about the last time you [experienced problem]"
- "How much time/money did that cost you?"
- "What have you tried to solve this?"
- "How painful was this? 1-10"

**Red Flags**:
- They've never experienced the problem
- They say it's painful but haven't tried to solve it
- They can't give specific examples
- Pain level < 5/10

### Step 4: Look for Evidence

**Strong Signals**:
✅ User mentions problem without prompting
✅ They've spent money trying to solve it
✅ They've built manual workarounds
✅ They mention it multiple times
✅ Emotional language ("frustrating," "hate," "waste")

**Weak Signals**:
⚠️ "Yeah, that would be nice I guess"
⚠️ Can't recall last time they had the problem
⚠️ Haven't tried any solutions
⚠️ Problem is theoretical

### Step 5: Segment by Pain

Not all users feel the pain equally. Segment:
- **Bleeding neck**: Will pay anything to solve (target first)
- **Hair on fire**: Strong pain, open to solutions
- **Nice to have**: Mild interest, low urgency
- **Don't care**: Wrong segment

## Validation Checklist

Problem is validated when:
- [ ] 15+ users interviewed
- [ ] 70%+ mention problem unprompted  
- [ ] At least 50% have tried existing solutions
- [ ] Average pain rating >7/10
- [ ] Can identify specific user segment with acute pain
- [ ] Users give specific examples from last 30 days

## Anti-Patterns

❌ **Solution in search of problem**
"We built AI chatbot. What problem should we solve?"
✅ Start with problem, then find solution

❌ **Confirmation bias**  
Only talking to people who agree with you
✅ Actively seek disconfirming evidence

❌ **Vanity metrics**
"100 people signed up for waitlist!"
✅ Did they PAY or meaningfully change behavior?

❌ **Hypothetical pain**
"People would definitely pay for this"
✅ Show me evidence they've tried to solve it

## Real Example: Superhuman

**Problem Hypothesis**:
"Professionals drown in email and existing clients are too slow"

**Validation Method**:
1. Interviewed 100+ email power users
2. Asked: "What's broken about email?" (open-ended)
3. Timed how long tasks took in Gmail vs Outlook
4. Measured pain: "How would you feel if you couldn't use your current email client?"

**Results**:
- 80% said "very disappointed" = validated
- Average email power user spends 3+ hrs/day in inbox
- Existing tools took 2-5 seconds per action
- Pain was acute for specific segment: exec assistants, VCs, founders

**Key Insight**: 
Problem wasn't "email clients are bad." It was "email power users are bottlenecked by speed." This led to keyboard-first UX.

## When to Pivot vs Persevere

**Pivot if**:
- <30% of users mention the problem
- Pain level consistently <5/10
- No one has tried to solve it
- Can't find a segment with acute pain

**Persevere if**:
- 50%+ validate the problem
- Clear segment with "bleeding neck" pain
- Evidence of money/time spent on problem
- Users get emotional talking about it

## Exercise

Take your product idea and:
1. Write your problem hypothesis
2. Define validation criteria
3. Interview 15 users
4. Score: How many validated the problem?
      `,
      keyTakeaways: [
        "Problem validation BEFORE solution design",
        "Pain level <7/10 usually means weak market",
        "Look for users who've already tried to solve the problem"
      ],
      framework: "Problem Validation Framework",
      tools: ["Interview scripts", "Pain scoring rubric"],
      nextSteps: "Interview 15 users and validate your problem hypothesis"
    },
    "Jobs-to-be-Done": {
      content: `
# Jobs-to-be-Done Framework

## What is JTBD?

People don't buy products - they "hire" them to make progress in their lives.

**Core Insight**: Focus on the job users are trying to accomplish, not demographics or features.

## The Job Statement Format

**When [situation]**
**I want to [motivation]**
**So I can [expected outcome]**

### Examples:

**Uber**:
When I need to get somewhere quickly in the city
I want reliable transportation on-demand
So I can arrive on time without the hassle of finding parking

**Slack**:
When I'm collaborating with my team on a project
I want fast, organized communication
So I can make decisions quickly without email chaos

**Superhuman**:
When I'm overwhelmed by my inbox
I want to process email blazingly fast
So I can get back to my real work

## JTBD vs Traditional Segmentation

### Traditional (Demographics)
"25-35 year old urban professionals"
❌ Doesn't tell you what they need

### JTBD (Circumstances)
"Someone who needs to get somewhere in 10 minutes with no car available"
✅ Tells you exactly what to optimize for

## Finding the Job

### Interview Questions:

1. **"Walk me through the last time you [used our product/solved this problem]"**
   - What triggered the need?
   - What were you hoping to accomplish?
   
2. **"What were you doing before?"**
   - Previous solution
   - Why did it fail?

3. **"What almost stopped you from switching?"**
   - Anxieties, inertia
   - What overcame them?

4. **"What do you use it for now?"**
   - Actual job (often differs from intended)

## The Forces of Progress

### Pushing Forces (Want to Change):
1. **Push of the situation**: Current solution is painful
2. **Pull of the new solution**: Promise of something better

### Resisting Forces (Want to Stay):
3. **Anxiety of the new**: Fear of unknown, learning curve
4. **Habit of the present**: Comfortable with status quo

**Change happens when**: Push + Pull > Anxiety + Habit

## Jobs vs Features

❌ **Feature thinking**: "Add a chat feature"
✅ **Job thinking**: "Help sales teams respond to leads in real-time"

❌ **Feature thinking**: "Dark mode"
✅ **Job thinking**: "Let me work late at night without eye strain"

## Outcome-Driven Innovation

For each job, identify desired outcomes:

**Job**: Get dinner on the table for my family

**Outcomes**:
- Minimize time spent planning (15 min → 5 min)
- Minimize food waste (30% waste → 10%)
- Maximize family nutrition (2 veggies/meal → 4)
- Minimize cooking time (60 min → 30 min)

## Example: Milkshake Study

**Question**: How do we sell more milkshakes?

**Traditional Approach**: 
Survey customers on taste, price, thickness
→ Incremental improvements, no breakthrough

**JTBD Approach**:
Interview: "When did you buy that milkshake?"

**Finding**:
- **Morning commuters**: Hired milkshake to make boring commute interesting and stay full until lunch
- **Parents**: Hired milkshake to appease children and feel like a good parent

**Insight**: Same product, two different jobs!

**Solution**:
- **Morning**: Thicker shake (lasts whole commute), easy to buy
- **Kids**: Faster service, smaller size, fun flavors

## How to Use JTBD

### 1. Discovery Phase
Understand what jobs users are hiring your product for

### 2. Positioning
Message around the job, not features
"The milkshake that makes your commute better" vs "Thick, creamy milkshake"

### 3. Innovation
Find under-served jobs
What jobs are people struggling to get done?

### 4. Competition
Your competitors aren't just similar products - they're anything solving the same job

Example: Cinemas compete with:
- Netflix (entertainment at home)
- Restaurants (date night)
- Video games (escape boredom)

## Exercise

Pick a product you use regularly:
1. What job are YOU hiring it for?
2. What outcomes matter most?
3. What alternatives did you consider?
4. What almost stopped you from using it?
      `,
      keyTakeaways: [
        "Focus on the job users are trying to accomplish, not demographics",
        "Your competition is anything that solves the same job",
        "Change happens when Push + Pull > Anxiety + Habit"
      ],
      framework: "Jobs-to-be-Done",
      tools: ["JTBD interview scripts"],
      nextSteps: "Interview 10 users to understand what job they're hiring your product to do"
    },
    "Customer Interviews": {
      content: `
# Mastering Customer Interviews

## Why Interviews > Surveys

**Interviews reveal**:
- Why behind the what
- Context and nuance
- Unexpected insights
- Emotional drivers

**Surveys only show**:
- What you thought to ask
- Shallow responses
- Biased by question framing

## The 5 Golden Rules

### 1. Talk About Their Life, Not Your Idea

❌ "Would you use a calendar app with AI scheduling?"
✅ "How do you currently manage your meetings?"

### 2. Ask About Specifics, Not Generics

❌ "Do you find scheduling hard?"
✅ "Tell me about the last meeting you scheduled. Walk me through it step by step."

### 3. Listen More, Talk Less

**Good Interview**: You talk 20%, they talk 80%
**Bad Interview**: You pitch for 50%+

### 4. Dig Into Emotions

When they mention frustration/excitement, probe deeper:
- "Tell me more about that"
- "How did that make you feel?"
- "What happened next?"

### 5. Don't Fish for Compliments

❌ "Do you think this solves your problem?"
✅ "What do you currently do about this problem?"

## The Perfect Interview Structure

### Opening (5 min)
- Introduce yourself
- Explain why you're talking (be vague: "researching productivity tools")
- Ask permission to record
- Build rapport

### Background (10 min)
- Get context on their role/life
- Understand their workflow
- "Walk me through a typical day"

### Problem Exploration (25 min)
- Dive deep into specific problems
- Recent examples only (last 30 days)
- Follow-up questions
- Get the emotional story

### Current Solutions (10 min)
- What do they use now?
- What do they love/hate?
- What's the workaround?
- Why haven't they switched?

### Wrap-up (5 min)
- "Anything else you wish I'd asked?"
- Ask for referrals: "Who else should I talk to?"
- Thank them

## Power Questions

### Discovery Questions:
- "Tell me about the last time you [problem scenario]"
- "What did you do before [current solution]? Why did you switch?"
- "What's the hardest part about [activity]?"
- "If you had a magic wand, what would you change?"

### Follow-up Questions:
- "Interesting - tell me more about that"
- "Why is that important to you?"
- "What happened next?"
- "How did that make you feel?"
- "What would have to be true for you to [action]?"

### Closing Questions:
- "If this problem went away tomorrow, what would that enable you to do?"
- "Who else struggles with this?"
- "What have you tried to solve this?"

## Red Flags During Interviews

🚩 **They're pitching you**
- They want to sell you something
- Treat it as learning, not commitment

🚩 **They're too polite**
- "Yeah, that sounds nice"
- Dig for real opinions: "What would REALLY make you switch?"

🚩 **They're hypothetical**
- "I would probably use that"
- Ground in reality: "When's the last time you needed something like this?"

🚩 **They're designing your product**
- "You should add feature X and Y"
- Acknowledge, but focus on their problem, not their solution

## Taking Notes

### During the Interview:
- Jot key quotes verbatim
- Note body language / emotion
- Mark patterns across interviews
- Don't stop the flow to write everything

### After the Interview:
- Write summary immediately (while fresh)
- Transcribe (Otter.ai, or manually)
- Tag insights by theme
- Add to research repository

## Synthesizing Insights

### After 5 interviews:
Look for initial patterns

### After 10 interviews:
Strong patterns emerge
- What do 70%+ mention?
- What are the strongest pain points?
- What's surprising?

### After 15+ interviews:
Diminishing returns - you'll hear repetition
Time to move to synthesis:

1. **List all problems mentioned**
2. **Score by frequency + intensity**
3. **Look for root causes** (5 Whys)
4. **Identify segments** (different user types with different needs)
5. **Prioritize** what to solve first

## Common Mistakes

### Mistake 1: Asking Leading Questions
❌ "Don't you hate how slow [competitor] is?"
✅ "What do you like and dislike about [competitor]?"

### Mistake 2: Pitching Your Solution
❌ Spending 20 minutes explaining your idea
✅ Spend 5% on context, 95% listening

### Mistake 3: Talking to the Wrong People
❌ Friends and family (too biased)
✅ Strangers who fit your target user profile

### Mistake 4: Ignoring Disconfirming Evidence
❌ "3 people loved it, so we're validated!"
✅ "7 out of 10 said they wouldn't use this - why?"

### Mistake 5: Stopping at 3 Interviews
❌ "We talked to some users"
✅ 15+ interviews minimum for validation

## Real Example: Airbnb's User Research

**Early Problem**: 
Hosts weren't making enough money. Why?

**Hypothesis**: 
Pricing is wrong

**Research Method**:
- Visited hosts in person
- Looked at listings
- Asked: "Show me your listing. Why did you choose these photos?"

**Key Finding**:
Photos were terrible - dark, blurry, shot on flip phones

**Insight**:
Problem wasn't pricing - it was trust. Bad photos = no bookings

**Solution**:
Offered professional photography for free
→ Bookings doubled for hosts with pro photos
→ Changed the entire business

**Lesson**: Would never have found this without in-person interviews and observation.
      `,
      keyTakeaways: [
        "Talk about their life, not your idea",
        "Ask about specific recent examples, not hypotheticals",
        "Listen 80%, talk 20%"
      ],
      framework: "The Mom Test, JTBD Interviews",
      tools: ["Otter.ai", "Zoom", "Dovetail"],
      nextSteps: "Schedule 15 customer interviews this week"
    },
    "Opportunity Assessment": {
      content: `
# Opportunity Assessment

## What is it?

Before investing resources, evaluate if an opportunity is worth pursuing.

## The Opportunity Assessment Framework

### 1. Problem Validation
- [ ] Is this a real problem?
- [ ] How painful is it? (1-10 scale)
- [ ] How frequently does it occur?
- [ ] Do people currently pay to solve it?

### 2. Market Size
- [ ] How many people have this problem?
- [ ] What's the TAM/SAM/SOM?
- [ ] Is the market growing or shrinking?

### 3. Competitive Landscape
- [ ] Who else is solving this?
- [ ] What's their approach?
- [ ] Where are they weak?
- [ ] What's our wedge?

### 4. Strategic Fit
- [ ] Does this align with our vision?
- [ ] Do we have unique advantages?
- [ ] Can we win this market?
- [ ] Does it open new opportunities?

### 5. Feasibility
- [ ] Can we build this?
- [ ] Do we have the resources?
- [ ] What's the timeline?
- [ ] What are the risks?

### 6. Business Impact
- [ ] How will this drive revenue?
- [ ] What metrics will it move?
- [ ] What's the ROI?
- [ ] Break-even timeline?

## Scoring Framework

**Score each dimension 1-10**:

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Problem Pain | 25% | 8 | 2.0 |
| Market Size | 20% | 7 | 1.4 |
| Strategic Fit | 20% | 9 | 1.8 |
| Feasibility | 15% | 6 | 0.9 |
| Competitive Advantage | 10% | 7 | 0.7 |
| Business Impact | 10% | 8 | 0.8 |
| **Total** | **100%** | | **7.6** |

**Interpretation**:
- **8-10**: Strong opportunity - pursue
- **6-8**: Worth exploring further
- **4-6**: Risky - proceed with caution
- **0-4**: Pass

## Example: Should Spotify Build Podcasts?

### Problem Validation (9/10)
- Podcast consumption growing 20%/year
- Users want audio content in one app
- Current solutions fragmented

### Market Size (8/10)
- 100M+ podcast listeners in US
- $1B+ market, rapidly growing

### Competitive Landscape (6/10)
- Apple Podcasts dominates
- Many podcast apps exist
- But: No one has Spotify's music user base

### Strategic Fit (10/10)
- Aligns with mission: "audio-first platform"
- Keeps users in ecosystem longer
- Reduces music royalty dependency

### Feasibility (8/10)
- Can reuse existing infrastructure
- Need podcast ingestion system
- Licensing simpler than music

### Business Impact (9/10)
- Higher margins (podcasts don't pay 70% royalty)
- More engagement = better retention
- New ad inventory

**Total Score: 8.3/10**

**Decision**: Strong opportunity ✅

**Result**: Spotify now has 5M+ podcasts, 100M+ listeners. Podcasts are a major growth driver.

## Red Flags to Watch For

🚩 **Only YOU see the opportunity**
Maybe you're visionary... or wrong

🚩 **The market is "everyone"**
Too broad = no one

🚩 **"If we get 1% of a huge market"**
Bottom-up validation needed

🚩 **"No one is solving this"**
Maybe there's no money in it?

🚩 **"We can pivot later"**
Opportunity cost is real

🚩 **"We're 5 years ahead of the market"**
Timing is everything

## When to Say No

✅ Say NO when:
- Problem isn't painful enough
- Market is tiny or shrinking
- We have no unique advantage
- Resources better spent elsewhere
- Strategic misfit

✅ Say YES when:
- Clear unmet need
- Large/growing market
- Unique insight or capability
- Strategic fit
- Strong unit economics potential

## Exercise

Pick a product opportunity:
1. Score it on the 6 dimensions
2. Calculate weighted score
3. List your assumptions
4. What would have to be true for this to succeed?
5. What's your recommendation?
      `,
      keyTakeaways: [
        "Validate opportunities before committing resources",
        "Score on: problem, market, strategy, feasibility, competition, business impact",
        "Strong opportunities score 8+ on weighted framework"
      ],
      framework: "Opportunity Assessment Scorecard",
      tools: ["Scoring matrix", "TAM analysis"],
      nextSteps: "Score your next 3 product ideas using this framework"
    }
  },
  execution: {
      content: `
# Product Vision & Mission

## What is it?
- **Vision**: An inspiring, long-term picture of what your product will achieve (3-10 years)
- **Mission**: The fundamental purpose - WHY the product exists

## Why it matters
A clear vision aligns your team, helps prioritize decisions, and attracts users/investors who share your values.

## Framework: Vision Statement Template
**For [target customer]**
**Who [statement of need/opportunity]**
**The [product name] is a [product category]**
**That [key benefit/compelling reason to buy]**
**Unlike [primary competitive alternative]**
**Our product [statement of primary differentiation]**

## Real Examples

### Airbnb Vision
"Belong anywhere" - Create a world where anyone can belong anywhere, providing healthy travel that is local, authentic, diverse, inclusive and sustainable.

### Tesla Vision  
"Accelerate the world's transition to sustainable energy"

### Spotify Mission
"Unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art and billions of fans the opportunity to enjoy and be inspired by it."

## Key Principles
1. **Aspirational**: Stretch goal that inspires
2. **Clear**: Anyone can understand it
3. **Stable**: Shouldn't change often
4. **Actionable**: Guides decisions

## Exercise
Draft a vision statement for a product you want to build. Use the template above.
      `,
      keyTakeaways: [
        "Vision = long-term aspiration, Mission = fundamental purpose",
        "Good visions inspire and provide decision-making clarity",
        "Test: Can a new team member use your vision to make product decisions?"
      ],
      framework: "Vision Statement Template",
      tools: [],
      nextSteps: "After defining vision, create a product strategy that shows HOW you'll achieve it"
    },
    "Market Analysis": {
      content: `
# Market Analysis for PMs

## The Goal
Understand the market landscape so you can identify opportunities, position effectively, and make data-driven bets.

## Key Frameworks

### 1. TAM/SAM/SOM Analysis
**TAM (Total Addressable Market)**: Everyone who could possibly use your solution
**SAM (Serviceable Addressable Market)**: Segment you can reach with your distribution
**SOM (Serviceable Obtainable Market)**: What you can realistically capture

**Example - Meal Kit Delivery:**
- TAM: All US households ($127B - entire food at home market)
- SAM: Urban households willing to pay premium ($18B)
- SOM: 2% market share in Year 3 ($360M)

### 2. SWOT Analysis
**Strengths**: What you do better than anyone
**Weaknesses**: Where you're vulnerable
**Opportunities**: External factors you can exploit
**Threats**: External risks

### 3. Porter's Five Forces
1. Threat of new entrants
2. Bargaining power of suppliers
3. Bargaining power of buyers
4. Threat of substitutes
5. Industry rivalry

## How to Do Market Research

### Primary Research (Talk to people)
- Customer interviews (20-50)
- Surveys (100+ responses)
- Focus groups
- Beta testing

### Secondary Research (Desk research)
- Industry reports (Gartner, Forrester)
- Competitor websites/reviews
- Google Trends, SimilarWeb
- Government data (Census, Bureau of Labor)
- Financial filings (public companies)

## Red Flags in Market Analysis
❌ "Market is $1 trillion" (too broad)
❌ Only looking at competitors' websites
❌ Assuming 1% of a huge market
✅ Bottom-up calculation from real user data
✅ Talking to 30+ potential customers
✅ Understanding WHY users choose alternatives

## Real Example: Notion's Market Analysis

**TAM**: $50B (all productivity software)
**SAM**: $8B (modern knowledge workers, tech companies)
**SOM**: $500M (Year 5 target, <1% of TAM)

**Key Insight**: Market wasn't "note-taking apps" but "collaborative workspaces" - much bigger opportunity.
      `,
      keyTakeaways: [
        "Always do bottom-up TAM calculation from real user data",
        "Talk to 30+ customers before believing your market hypothesis",
        "SWOT is just a starting point - validate everything with data"
      ],
      framework: "TAM/SAM/SOM, SWOT, Porter's Five Forces",
      tools: ["Google Trends", "SimilarWeb", "Crunchbase"],
      nextSteps: "Use market insights to craft competitive positioning and identify white space opportunities"
    },
    "Competitive Intelligence": {
      content: `
# Competitive Intelligence

## What to Track

### 1. Product Features
- What do they have that you don't?
- What do you have that they don't?
- Feature comparison matrix

### 2. Positioning & Messaging
- Who are they targeting?
- What's their value prop?
- How do they talk about the problem?

### 3. Business Model
- How do they make money?
- Pricing tiers
- Unit economics (if public)

### 4. Distribution Strategy
- How do users discover them?
- Self-serve vs sales-led?
- Partnership channels

### 5. Traction Signals
- Funding rounds
- Team growth (LinkedIn)
- Product releases
- Customer reviews

## Framework: Competitive Moats

A moat = sustainable competitive advantage

### Types of Moats:
1. **Network Effects**: Value increases with users (LinkedIn, Uber)
2. **Switching Costs**: Hard/expensive to leave (Salesforce, SAP)
3. **Economies of Scale**: Lower costs at scale (Amazon, Walmart)
4. **Brand**: Trust premium (Apple, Nike)
5. **Proprietary Tech/Data**: Can't be replicated (Google Search, Spotify's algorithm)

## Where to Gather Intel

**Free Sources:**
- Competitor websites/blogs
- App Store reviews
- G2/Capterra reviews
- LinkedIn (team growth, job posts)
- Crunchbase (funding)
- Product Hunt launches
- Reddit, Twitter discussions

**Paid Tools:**
- SimilarWeb (traffic)
- Sensor Tower (mobile)
- SEMrush (SEO/ads)
- Gartner/Forrester (enterprise)

## How to NOT Compete

❌ Feature parity ("me too" strategy)
❌ Racing to the bottom on price
❌ Fighting in their strongest area

✅ Find your unique wedge
✅ Go after underserved segment
✅ Compete on different dimensions

## Real Example: Figma vs Adobe

**Adobe's Moat**: 
- 30 years of features
- Industry standard (switching costs)
- Deep pockets

**Figma's Wedge**:
- Browser-based (no install friction)
- Real-time collaboration (network effects)
- Freemium (bottoms-up adoption)

Result: Figma didn't try to match Photoshop features. They redefined the game around collaboration.
      `,
      keyTakeaways: [
        "Don't compete on features alone - find a unique wedge",
        "Best moat = something that gets stronger as you grow",
        "Study competitors' weaknesses, not just strengths"
      ],
      framework: "Competitive Moats",
      tools: ["SimilarWeb", "Crunchbase", "G2 Reviews"],
      nextSteps: "Identify your defensible moat and double down on it"
    },
    "Business Model": {
      content: `
# Business Models for PMs

## Why PMs Need to Understand Business Models

You can't build the right product if you don't understand how the company makes money.

## Common SaaS Business Models

### 1. Freemium
**How it works**: Free tier → paid upgrades
**Examples**: Dropbox, Slack, Figma
**Key Metric**: Conversion rate (free → paid)
**PM Considerations**: 
- What features are free vs paid?
- How do you drive upgrades without annoying free users?

### 2. Subscription
**How it works**: Recurring monthly/annual fee
**Examples**: Netflix, Spotify, Adobe Creative Cloud
**Key Metric**: Monthly Recurring Revenue (MRR), Churn
**PM Considerations**:
- Retention > acquisition
- Must continuously add value

### 3. Usage-Based
**How it works**: Pay per API call, storage, compute
**Examples**: AWS, Twilio, Snowflake
**Key Metric**: Revenue per user, consumption growth
**PM Considerations**:
- Align product value with usage
- More usage = more revenue

### 4. Marketplace/Transaction
**How it works**: Take % of each transaction
**Examples**: Airbnb, Uber, Etsy
**Key Metric**: Gross Merchandise Value (GMV), take rate
**PM Considerations**:
- Balance supply/demand
- Two-sided optimization

### 5. Enterprise
**How it works**: Custom contracts, sales-led
**Examples**: Salesforce, Workday, ServiceNow
**Key Metric**: Annual Contract Value (ACV), logo retention
**PM Considerations**:
- Feature vs scalability tradeoffs
- Support + security requirements

## Unit Economics 101

### Key Formulas:

**Customer Acquisition Cost (CAC)**
= Sales + Marketing costs / # new customers

**Lifetime Value (LTV)**  
= Average Revenue per User × Gross Margin % × (1/Churn Rate)

**LTV:CAC Ratio**
= LTV / CAC
✅ Good: 3:1 or higher
⚠️ Warning: Under 1:1 (losing money per customer)

**Payback Period**
= CAC / (Monthly Revenue per Customer × Gross Margin %)
✅ Good: Under 12 months
⚠️ Warning: Over 24 months

## How Business Model Affects Product Decisions

### Example: Slack

**Model**: Freemium → Team subscriptions

**Product Decisions Driven By Model:**
- Free tier has message history limit (drives upgrades)
- Paid features: Unlimited integrations, SSO, compliance
- Virality built-in (users invite teammates)
- Land-and-expand motion (start with small team, grow to enterprise)

**Result**: 
- 49% of revenue from viral adoption
- Median payback period: 4 months
- Net Revenue Retention: 170% (upsells > churn)

## Exercise: Analyze a Product's Business Model

Pick a product you use:
1. What's the business model?
2. How does this affect product decisions?
3. Where are the monetization pressure points?
4. What features exist purely to drive revenue?
      `,
      keyTakeaways: [
        "Business model determines product priorities",
        "LTV:CAC ratio should be 3:1 or better",
        "Freemium needs clear value differentiation between free/paid"
      ],
      framework: "Unit Economics (LTV/CAC)",
      tools: ["Financial models", "Cohort analysis"],
      nextSteps: "Calculate unit economics for your product to validate business viability"
    },
    "Roadmapping": {
      content: `
# Product Roadmapping

## What is a Roadmap?

A visual plan that shows:
- **WHAT** you're building
- **WHY** it matters (ties to strategy)
- **WHEN** (roughly - avoid exact dates)

## Roadmap Anti-Patterns

❌ List of features with exact dates (you'll miss them)
❌ Commitments made without engineering input
❌ Everything is "high priority"
❌ No connection to strategy
❌ Locked in stone (no flexibility)

✅ Themes and outcomes, not just features
✅ Quarterly horizons with increasing ambiguity
✅ Clear prioritization rationale
✅ Tied to metrics and business goals
✅ Adaptable based on learnings

## Roadmap Horizons

**Now (Current Quarter)**
- Detailed, high confidence
- In development or about to start
- Defined success metrics

**Next (Next 1-2 Quarters)**  
- Medium detail
- Prioritized and sequenced
- May shift based on learnings

**Later (3-4 Quarters+)**
- High-level themes
- Strategic bets
- Expect to change

## Good Roadmap Structure

### Theme-Based Roadmap

**Q1: Activation & Onboarding**
- Improve new user experience
- Target: Increase Day 1 retention from 40% → 60%

**Q2: Power User Features**  
- Deepen engagement for active users
- Target: Increase weekly active users by 30%

**Q3: Monetization**
- Launch paid tier
- Target: 5% conversion rate

### Outcome-Based Roadmap

**Now**: Reduce churn by 20%
- Feature A: Improve core workflow
- Feature B: Better notifications

**Next**: Expand to new market segment
- Research enterprise needs
- Build admin controls

## Prioritization Frameworks

### RICE Score
**Reach**: How many users affected? (per quarter)
**Impact**: How much does it move the needle? (0.25 = minimal, 3 = massive)
**Confidence**: How sure are you? (0-100%)
**Effort**: How many person-months?

**RICE Score = (Reach × Impact × Confidence) / Effort**

Example:
- Reach: 1000 users/quarter
- Impact: 2 (large)
- Confidence: 80%
- Effort: 2 person-months

RICE = (1000 × 2 × 0.8) / 2 = 800

### Other Frameworks
- **MoSCoW**: Must have, Should have, Could have, Won't have
- **Value vs Effort**: 2x2 matrix
- **ICE**: Impact, Confidence, Ease
- **WSJF**: Weighted Shortest Job First (SAFe)

## How to Build a Roadmap

**Step 1**: Start with strategy
- What are our goals this year?
- What metrics move the needle?

**Step 2**: Gather input  
- Customer feedback
- Sales/support requests
- Engineering tech debt
- Market trends

**Step 3**: Prioritize ruthlessly
- Use RICE or similar framework
- Consider dependencies
- Check resource capacity

**Step 4**: Get buy-in
- Share draft with stakeholders
- Explain tradeoffs
- Align on "why"

**Step 5**: Review quarterly
- What changed?
- What did we learn?
- Reprioritize

## Stakeholder Communication

### For Executives
- High-level themes
- Business impact
- Resource needs
- Risks

### For Engineering
- Technical details
- Scope/requirements
- Timeline flexibility
- Architecture implications

### For Sales/Marketing
- Launch dates (with buffer)
- Customer value
- Positioning
- Competitive angle

### For Customers  
- Benefits, not features
- "When" as quarters, not dates
- Get feedback on priorities

## Real Example: Notion's 2019 Roadmap

**Theme**: Make Notion a "workspace for teams"

**Q1-Q2**: 
- Real-time collaboration (multiplayer)
- Comments and discussions
- Permissions and sharing

**Q3-Q4**:
- Web clipper (content acquisition)
- Public pages (distribution)
- API (ecosystem)

**Result**: Revenue grew 10x in 2019 because roadmap focused on expanding from individual to team use case.
      `,
      keyTakeaways: [
        "Roadmaps are communication tools, not contracts",
        "Organize by outcomes/themes, not just features",
        "RICE is great for scoring, but context matters"
      ],
      framework: "RICE Prioritization, Roadmap Horizons",
      tools: ["ProductBoard", "Aha!", "Notion", "Google Sheets"],
      nextSteps: "Create a one-page roadmap using outcome-based themes, not feature lists"
    }
  },
  discovery: {
    "User Research": {
      content: `
# User Research for Product Managers

## Why User Research Matters

Without research, you're just building based on your own assumptions. Most products fail because they solve problems users don't actually have.

## Types of User Research

### 1. Generative (Discovery)
**Goal**: Understand problems, needs, behaviors
**When**: Before building anything
**Methods**: 
- Interviews
- Ethnographic observation  
- Diary studies
- Jobs-to-be-Done interviews

### 2. Evaluative (Validation)
**Goal**: Test if your solution works
**When**: After building prototypes/MVP
**Methods**:
- Usability testing
- A/B tests
- Prototype testing
- First-click tests

### 3. Quantitative
**Goal**: Understand "how many" and "how much"
**Methods**:
- Surveys (100+ responses)
- Analytics
- Heatmaps
- Session recordings

### 4. Qualitative  
**Goal**: Understand "why" and context
**Methods**:
- Interviews (20-50)
- Focus groups
- Observation

## The Mom Test - How to Interview Users

### Bad Questions (Leading/Hypothetical)
❌ "Would you use a feature that does X?"
❌ "Do you think this is a good idea?"
❌ "How much would you pay for this?"
❌ "Would you buy this?"

### Good Questions (Specific Past Behavior)
✅ "Tell me about the last time you [struggled with problem]"
✅ "Walk me through how you currently solve this"
✅ "What's frustrating about your current solution?"
✅ "What have you tried to do about this?"
✅ "Who else is involved in this decision?"

## Interview Script Template

**Introduction (2 min)**
- Who you are
- What you're researching (stay vague)
- No right/wrong answers
- Permission to record

**Background (5 min)**
- Role/responsibilities
- Typical day/workflow
- Context setting

**Problem Exploration (20 min)**
- When did you last experience [problem]?
- Walk me through what happened
- What was frustrating about it?
- What did you do? Why?
- What alternatives have you tried?
- How much time/money does this cost you?

**Current Solutions (10 min)**  
- What tools do you use today?
- What do you love/hate about them?
- What's missing?
- If you had a magic wand...

**Wrap-up (3 min)**
- Anything else I should know?
- Can I follow up with questions?
- Who else should I talk to?

## How Many Interviews?

**Problem validation**: 10-15 (you'll see patterns)
**Solution validation**: 5-8 per user segment
**Usability testing**: 5 users (finds 85% of issues)

## Red Flags in User Research

❌ Only talking to existing happy customers
❌ Asking friends/family
❌ Sample size of 3
❌ Leading questions
❌ Talking more than listening (you should listen 80%+)
❌ Falling in love with quotes that confirm your bias

## Synthesizing Research

**Step 1**: Take detailed notes during interview
**Step 2**: Transcribe (or use AI tools)
**Step 3**: Tag insights with themes
**Step 4**: Look for patterns across interviews
**Step 5**: Prioritize insights by frequency + severity

### Common Patterns to Look For:
- Pain points mentioned by 70%+ of users
- Workarounds users have built
- Emotional reactions ("I hate...")
- Money/time users spend on problem
- "Hair on fire" problems vs nice-to-haves

## Real Example: Superhuman

**Research Finding**: 
Interviewed 100+ users who tried email clients. Asked: "How would you feel if you could no longer use this product?"
- "Very disappointed" = product-market fit signal
- <40% = no PMF
- Superhuman hit 58% on first try

**Action**: 
Doubled down on users who said "very disappointed." Asked them "what would make you more disappointed?" Those became feature priorities.

## Tools

**Free**:
- Google Meet/Zoom (recording)
- Otter.ai (transcription)
- Notion/Sheets (synthesis)

**Paid**:
- UserTesting.com (recruit testers)
- Dovetail (research repository)
- Maze (prototype testing)
      `,
      keyTakeaways: [
        "Ask about past behavior, not future intentions",
        "Sample size of 10-15 is enough to find patterns",
        "The Mom Test: Don't ask if they'd use it, ask how they solve the problem today"
      ],
      framework: "The Mom Test, Jobs-to-be-Done interviews",
      tools: ["Otter.ai", "Dovetail", "UserTesting", "Maze"],
      nextSteps: "Conduct 10 user interviews using the Mom Test principles"
    },
    "Problem Validation": {
      content: `
# Problem Validation

## What is Problem Validation?

Before building ANY solution, you must prove:
1. The problem exists
2. It's painful enough that people want it solved
3. People will change their behavior to solve it

## The Problem Validation Framework

### Step 1: Identify the Problem Hypothesis

**Format**: 
[User type] struggles with [problem] when [context] which causes [negative outcome]

**Example**:
"Busy parents struggle with meal planning during weeknights which causes stress, unhealthy eating, and food waste"

### Step 2: Define What "Validated" Means

Set clear criteria BEFORE talking to users:
- 70% of interviewees mention this problem unprompted
- Problem causes $X lost or Y hours wasted per month
- Users have tried 2+ solutions already
- Pain level 7+/10

### Step 3: Talk to Users (The Mom Test)

**Good Questions**:
- "Tell me about the last time you [experienced problem]"
- "How much time/money did that cost you?"
- "What have you tried to solve this?"
- "How painful was this? 1-10"

**Red Flags**:
- They've never experienced the problem
- They say it's painful but haven't tried to solve it
- They can't give specific examples
- Pain level < 5/10

### Step 4: Look for Evidence

**Strong Signals**:
✅ User mentions problem without prompting
✅ They've spent money trying to solve it
✅ They've built manual workarounds
✅ They mention it multiple times
✅ Emotional language ("frustrating," "hate," "waste")

**Weak Signals**:
⚠️ "Yeah, that would be nice I guess"
⚠️ Can't recall last time they had the problem
⚠️ Haven't tried any solutions
⚠️ Problem is theoretical

### Step 5: Segment by Pain

Not all users feel the pain equally. Segment:
- **Bleeding neck**: Will pay anything to solve (target first)
- **Hair on fire**: Strong pain, open to solutions
- **Nice to have**: Mild interest, low urgency
- **Don't care**: Wrong segment

## Validation Checklist

Problem is validated when:
- [ ] 15+ users interviewed
- [ ] 70%+ mention problem unprompted  
- [ ] At least 50% have tried existing solutions
- [ ] Average pain rating >7/10
- [ ] Can identify specific user segment with acute pain
- [ ] Users give specific examples from last 30 days

## Anti-Patterns

❌ **Solution in search of problem**
"We built AI chatbot. What problem should we solve?"
✅ Start with problem, then find solution

❌ **Confirmation bias**  
Only talking to people who agree with you
✅ Actively seek disconfirming evidence

❌ **Vanity metrics**
"100 people signed up for waitlist!"
✅ Did they PAY or meaningfully change behavior?

❌ **Hypothetical pain**
"People would definitely pay for this"
✅ Show me evidence they've tried to solve it

## Real Example: Superhuman

**Problem Hypothesis**:
"Professionals drown in email and existing clients are too slow"

**Validation Method**:
1. Interviewed 100+ email power users
2. Asked: "What's broken about email?" (open-ended)
3. Timed how long tasks took in Gmail vs Outlook
4. Measured pain: "How would you feel if you couldn't use your current email client?"

**Results**:
- 80% said "very disappointed" = validated
- Average email power user spends 3+ hrs/day in inbox
- Existing tools took 2-5 seconds per action
- Pain was acute for specific segment: exec assistants, VCs, founders

**Key Insight**: 
Problem wasn't "email clients are bad." It was "email power users are bottlenecked by speed." This led to keyboard-first UX.

## When to Pivot vs Persevere

**Pivot if**:
- <30% of users mention the problem
- Pain level consistently <5/10
- No one has tried to solve it
- Can't find a segment with acute pain

**Persevere if**:
- 50%+ validate the problem
- Clear segment with "bleeding neck" pain
- Evidence of money/time spent on problem
- Users get emotional talking about it

## Exercise

Take your product idea and:
1. Write your problem hypothesis
2. Define validation criteria
3. Interview 15 users
4. Score: How many validated the problem?
      `,
      keyTakeaways: [
        "Problem validation BEFORE solution design",
        "Pain level <7/10 usually means weak market",
        "Look for users who've already tried to solve the problem"
      ],
      framework: "Problem Validation Framework",
      tools: ["Interview scripts", "Pain scoring rubric"],
      nextSteps: "Interview 15 users and validate your problem hypothesis"
    }
  }
};

// Updated Resources with actual external links
const RESOURCES = {
  strategy: [
    { type: "article", title: "Good Product Strategy/Bad Product Strategy", url: "https://medium.com/@melissaperri/good-product-strategy-bad-product-strategy-826cdcb5d80f", time: "15 min" },
    { type: "video", title: "Product Vision Workshop by Gibson Biddle", url: "https://gibsonbiddle.medium.com/", time: "45 min" },
    { type: "template", title: "Product Strategy Canvas", url: "https://www.productplan.com/templates/", time: "5 min" },
    { type: "book", title: "Inspired by Marty Cagan", url: "https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507", time: "6 hours" },
    { type: "course", title: "Reforge Product Strategy", url: "https://www.reforge.com/product-strategy", time: "8 hours" }
  ],
  discovery: [
    { type: "book", title: "The Mom Test by Rob Fitzpatrick", url: "https://www.momtestbook.com/", time: "3 hours" },
    { type: "article", title: "12 Things about Product-Market Fit", url: "https://a16z.com/product-market-fit/", time: "20 min" },
    { type: "video", title: "Jobs-to-be-Done Framework", url: "https://jobs-to-be-done.com/", time: "30 min" },
    { type: "template", title: "User Interview Script", url: "https://www.userinterviews.com/ux-research-field-guide-chapter/user-interview-templates", time: "10 min" },
    { type: "course", title: "Product Discovery Bootcamp (Reforge)", url: "https://www.reforge.com/", time: "6 hours" }
  ],
  execution: [
    { type: "article", title: "RICE Prioritization Framework", url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/", time: "12 min" },
    { type: "video", title: "Agile for PMs Crash Course", url: "https://www.youtube.com/results?search_query=agile+for+product+managers", time: "40 min" },
    { type: "tool", title: "Jira for Product Managers", url: "https://www.atlassian.com/software/jira/guides", time: "30 min" },
    { type: "tool", title: "Linear Guide", url: "https://linear.app/method", time: "20 min" },
    { type: "template", title: "PRD Template", url: "https://www.atlassian.com/software/confluence/templates/product-requirements-document", time: "10 min" }
  ],
  stakeholders: [
    { type: "article", title: "Influence Without Authority", url: "https://review.firstround.com/the-power-of-influence-without-authority", time: "18 min" },
    { type: "book", title: "Crucial Conversations", url: "https://www.amazon.com/Crucial-Conversations-Talking-Stakes-Second/dp/1469266822", time: "6 hours" },
    { type: "video", title: "Executive Communication for PMs", url: "https://www.lennysnewsletter.com/", time: "35 min" },
    { type: "template", title: "Stakeholder Mapping Canvas", url: "https://miro.com/templates/stakeholder-map/", time: "10 min" }
  ],
  metrics: [
    { type: "article", title: "Choosing North Star Metrics", url: "https://amplitude.com/blog/product-north-star-metric", time: "15 min" },
    { type: "course", title: "SQL for Data Analysis (Mode)", url: "https://mode.com/sql-tutorial/", time: "8 hours" },
    { type: "article", title: "A/B Testing Guide", url: "https://www.optimizely.com/optimization-glossary/ab-testing/", time: "20 min" },
    { type: "template", title: "OKR Template", url: "https://www.whatmatters.com/get-examples", time: "8 min" },
    { type: "tool", title: "Google Analytics for PMs", url: "https://analytics.google.com/analytics/academy/", time: "4 hours" }
  ],
  technical: [
    { type: "article", title: "Technical Skills Every PM Needs", url: "https://www.lennysnewsletter.com/", time: "20 min" },
    { type: "course", title: "APIs for Non-Engineers", url: "https://www.postman.com/webinars/", time: "2 hours" },
    { type: "video", title: "System Design for PMs", url: "https://www.youtube.com/results?search_query=system+design+primer", time: "45 min" },
    { type: "course", title: "Intro to Computer Science (CS50)", url: "https://cs50.harvard.edu/", time: "40 hours" }
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

// PM Books Library
const PM_BOOKS = {
  fundamentals: [
    { title: "Inspired: How to Create Tech Products Customers Love", author: "Marty Cagan", why: "The PM bible. Covers discovery, delivery, and building strong product teams.", level: "Beginner", rating: 5, link: "https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507" },
    { title: "The Lean Product Playbook", author: "Dan Olsen", why: "Practical framework for achieving product-market fit.", level: "Beginner", rating: 5, link: "https://www.amazon.com/Lean-Product-Playbook-Innovate-Products/dp/1118960874" },
    { title: "Cracking the PM Interview", author: "Gayle McDowell", why: "Breaking into PM - covers product design, strategy, metrics questions.", level: "Beginner", rating: 4, link: "https://www.amazon.com/Cracking-PM-Interview-Product-Technology/dp/0984782818" }
  ],
  userResearch: [
    { title: "The Mom Test", author: "Rob Fitzpatrick", why: "Best book on customer interviews. How to talk to customers when everyone is lying to you.", level: "Beginner", rating: 5, link: "https://www.momtestbook.com/" },
    { title: "Continuous Discovery Habits", author: "Teresa Torres", why: "Weekly touchpoints with customers to continuously discover opportunities.", level: "Intermediate", rating: 5, link: "https://www.amazon.com/Continuous-Discovery-Habits-Discover-Products/dp/1736633309" }
  ],
  strategy: [
    { title: "Good Strategy Bad Strategy", author: "Richard Rumelt", why: "What real strategy is. Kernel: diagnosis, guiding policy, coherent actions.", level: "Intermediate", rating: 5, link: "https://www.amazon.com/Good-Strategy-Bad-Difference-Matters/dp/0307886239" },
    { title: "Crossing the Chasm", author: "Geoffrey Moore", why: "Moving from early adopters to mainstream market.", level: "Intermediate", rating: 4, link: "https://www.amazon.com/Crossing-Chasm-3rd-Disruptive-Mainstream/dp/0062292986" },
    { title: "7 Powers", author: "Hamilton Helmer", why: "What creates lasting competitive advantage.", level: "Advanced", rating: 5, link: "https://www.amazon.com/7-Powers-Foundations-Business-Strategy/dp/0998116319" }
  ],
  growth: [
    { title: "Hacking Growth", author: "Sean Ellis & Morgan Brown", why: "Growth tactics from Dropbox, Airbnb, Facebook.", level: "Intermediate", rating: 4, link: "https://www.amazon.com/Hacking-Growth-Fastest-Growing-Companies-Breakout/dp/045149721X" },
    { title: "Hooked", author: "Nir Eyal", why: "Building habit-forming products. The Hook Model.", level: "Intermediate", rating: 4, link: "https://www.amazon.com/Hooked-How-Build-Habit-Forming-Products/dp/1591847788" }
  ],
  leadership: [
    { title: "Radical Candor", author: "Kim Scott", why: "Be a great boss: care personally + challenge directly.", level: "Advanced", rating: 5, link: "https://www.amazon.com/Radical-Candor-Revised-Kick-Ass-Humanity/dp/1250235375" },
    { title: "The Culture Code", author: "Daniel Coyle", why: "What makes great teams work.", level: "Intermediate", rating: 4, link: "https://www.amazon.com/Culture-Code-Secrets-Highly-Successful/dp/0804176981" }
  ],
  classics: [
    { title: "The Innovator's Dilemma", author: "Clayton Christensen", why: "Why great companies fail. Disruptive innovation theory.", level: "Advanced", rating: 5, link: "https://www.amazon.com/Innovators-Dilemma-Technologies-Management-Innovation/dp/1633691780" },
    { title: "Zero to One", author: "Peter Thiel", why: "Building companies that create new things. 10x vs 10% better.", level: "Intermediate", rating: 4, link: "https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296" }
  ]
};

// PM People & Resources
const PM_PEOPLE_RESOURCES = {
  influencers: [
    { name: "Lenny Rachitsky", role: "Ex-Airbnb PM", why: "Best PM newsletter. Deep dives on growth, PMF, hiring.", link: "https://www.lennysnewsletter.com/" },
    { name: "Shreyas Doshi", role: "Ex-Google/Stripe/Twitter", why: "PM frameworks, prioritization, career advice.", link: "https://twitter.com/shreyas" },
    { name: "Teresa Torres", role: "Product Discovery Coach", why: "Continuous discovery habits. User research.", link: "https://www.producttalk.org/" },
    { name: "Marty Cagan", role: "Silicon Valley Product Group", why: "Author of Inspired. Product leadership wisdom.", link: "https://www.svpg.com/articles/" },
    { name: "Gibson Biddle", role: "Ex-Netflix VP Product", why: "Product strategy, consumer products.", link: "https://gibsonbiddle.medium.com/" },
    { name: "Julie Zhuo", role: "Ex-Facebook Design VP", why: "Product design, leadership, building teams.", link: "https://medium.com/@joulee" }
  ],
  newsletters: [
    { name: "Lenny's Newsletter", focus: "PM frameworks, growth, hiring", link: "https://www.lennysnewsletter.com/" },
    { name: "Reforge", focus: "Growth, retention, PLG", link: "https://www.reforge.com/" },
    { name: "Product Coalition", focus: "PM community content", link: "https://productcoalition.com/" },
    { name: "Mind the Product", focus: "Events and community", link: "https://www.mindtheproduct.com/" }
  ],
  communities: [
    { name: "Product School", description: "PM courses and certification", link: "https://productschool.com/" },
    { name: "Reforge", description: "Advanced growth & product courses", link: "https://www.reforge.com/" },
    { name: "Mind the Product", description: "PM events worldwide", link: "https://www.mindtheproduct.com/" },
    { name: "r/ProductManagement", description: "Reddit PM community", link: "https://www.reddit.com/r/ProductManagement/" }
  ],
  podcasts: [
    { name: "Lenny's Podcast", host: "Lenny Rachitsky", why: "Interviews with top PMs and founders", link: "https://www.lennyspodcast.com/" },
    { name: "Product Thinking", host: "Melissa Perri", why: "Product strategy and leadership", link: "https://produxlabs.com/product-thinking" }
  ]
};

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
      caseStudyResponses: [],
      completedLessons: []
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
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await initializeStorage();
      setUserData(data);
      // Load completed lessons from storage if exists
      if (data.completedLessons) {
        setCompletedLessons(data.completedLessons);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const markLessonComplete = async (skillId, conceptName) => {
    const lessonKey = `${skillId}-${conceptName}`;
    if (!completedLessons.includes(lessonKey)) {
      const newCompletedLessons = [...completedLessons, lessonKey];
      setCompletedLessons(newCompletedLessons);
      
      // Update user data storage
      const updatedUserData = {
        ...userData,
        completedLessons: newCompletedLessons
      };
      await saveUserData(updatedUserData);
    }
  };

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
            {['dashboard', 'learn', 'skills', 'quiz', 'resources', 'cases', 'projects', 'books', 'checklist', 'people'].map(view => (
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
            {/* Learn First Reminder */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-start gap-4">
                <BookOpen className="w-12 h-12 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold mb-2">📖 Learn → Practice → Master</h3>
                  <p className="text-purple-100 mb-4">
                    Start with interactive lessons in the <strong>Learn</strong> tab, then test your knowledge with quizzes. 
                    Each lesson includes frameworks, real examples, and practical exercises.
                  </p>
                  <button
                    onClick={() => setCurrentView('learn')}
                    className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                  >
                    Start Learning →
                  </button>
                </div>
              </div>
            </div>

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

        {currentView === 'learn' && !selectedLesson && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">📚 Learn: Interactive Lessons</h2>
              <p className="text-gray-600 mb-4">
                Master each concept with in-depth lessons before taking quizzes. Progress is tracked automatically.
              </p>
            </div>

            {Object.entries(LESSONS).map(([skillKey, concepts]) => {
              const skill = SKILL_TREE[skillKey];
              const isUnlocked = userData.progress[skillKey].unlocked;
              const skillProgress = userData.progress[skillKey];
              
              return (
                <div key={skillKey} className={`bg-white rounded-lg shadow-lg p-6 ${!isUnlocked && 'opacity-50'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                      {skill.name}
                      {!isUnlocked && <span className="text-sm text-gray-500">(🔒 Locked)</span>}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {Object.keys(concepts).filter(c => completedLessons.includes(`${skillKey}-${c}`)).length} / {Object.keys(concepts).length} completed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(concepts).map(([conceptName, lesson]) => {
                      const lessonKey = `${skillKey}-${conceptName}`;
                      const isCompleted = completedLessons.includes(lessonKey);
                      const conceptStrength = skillProgress.conceptStrength[conceptName] || 0;
                      
                      return (
                        <button
                          key={conceptName}
                          disabled={!isUnlocked}
                          onClick={() => isUnlocked && setSelectedLesson({ skillKey, conceptName, lesson })}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            !isUnlocked
                              ? 'border-gray-200 cursor-not-allowed'
                              : isCompleted
                              ? 'border-green-300 bg-green-50 hover:border-green-400'
                              : 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-semibold text-gray-900">{conceptName}</div>
                            {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                          </div>
                          
                          {isUnlocked && (
                            <>
                              <div className="text-xs text-gray-600 mb-2">
                                Framework: {lesson.framework}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      conceptStrength >= 0.7 ? 'bg-green-500' :
                                      conceptStrength >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${conceptStrength * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {Math.round(conceptStrength * 100)}%
                                </span>
                              </div>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentView === 'learn' && selectedLesson && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedLesson(null)}
              className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
            >
              ← Back to Lessons
            </button>

            <div className="mb-6">
              <div className="text-sm text-indigo-600 mb-2">
                {SKILL_TREE[selectedLesson.skillKey].name}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedLesson.conceptName}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  📐 Framework: {selectedLesson.lesson.framework}
                </span>
                {selectedLesson.lesson.tools.length > 0 && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    🛠️ Tools: {selectedLesson.lesson.tools.join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Lesson Content */}
            <div className="prose prose-indigo max-w-none mb-8">
              <div 
                className="lesson-content"
                style={{
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}
              >
                {selectedLesson.lesson.content.split('\n').map((line, idx) => {
                  // Handle headings
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">{line.substring(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.substring(3)}</h2>;
                  }
                  if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
                  }
                  
                  // Handle bold
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={idx} className="font-bold my-2">{line.replace(/\*\*/g, '')}</p>;
                  }
                  
                  // Handle lists
                  if (line.startsWith('- ')) {
                    return <li key={idx} className="ml-6 my-1">{line.substring(2)}</li>;
                  }
                  if (/^\d+\./.test(line)) {
                    return <li key={idx} className="ml-6 my-1 list-decimal">{line.substring(line.indexOf('.') + 1)}</li>;
                  }
                  
                  // Handle checkmarks and X marks
                  if (line.startsWith('✅')) {
                    return <p key={idx} className="text-green-700 my-1">{line}</p>;
                  }
                  if (line.startsWith('❌')) {
                    return <p key={idx} className="text-red-700 my-1">{line}</p>;
                  }
                  if (line.startsWith('⚠️')) {
                    return <p key={idx} className="text-yellow-700 my-1">{line}</p>;
                  }
                  
                  // Regular paragraphs
                  if (line.trim() === '') {
                    return <div key={idx} className="h-2" />;
                  }
                  
                  return <p key={idx} className="my-2">{line}</p>;
                })}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {selectedLesson.lesson.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="text-indigo-900">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Next Steps
              </h3>
              <p className="text-green-900">{selectedLesson.lesson.nextSteps}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  markLessonComplete(selectedLesson.skillKey, selectedLesson.conceptName);
                  setSelectedLesson(null);
                }}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </button>
              <button
                onClick={() => {
                  markLessonComplete(selectedLesson.skillKey, selectedLesson.conceptName);
                  startQuiz(selectedLesson.skillKey);
                  setSelectedLesson(null);
                  setCurrentView('quiz');
                }}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Take Quiz Now
              </button>
            </div>
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">📚 Curated Resources</h2>
              <p className="text-gray-600">
                Hand-picked articles, videos, courses, and tools to supplement your learning journey.
              </p>
            </div>

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
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`border rounded-lg p-4 transition-all ${
                          isUnlocked 
                            ? 'hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md cursor-pointer' 
                            : 'cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-900 flex-1 pr-2">{resource.title}</div>
                          <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                            resource.type === 'book' ? 'bg-purple-100 text-purple-700' :
                            resource.type === 'course' ? 'bg-blue-100 text-blue-700' :
                            resource.type === 'video' ? 'bg-red-100 text-red-700' :
                            resource.type === 'tool' ? 'bg-green-100 text-green-700' :
                            resource.type === 'template' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-indigo-100 text-indigo-700'
                          }`}>
                            {resource.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {resource.time}
                        </div>
                        {isUnlocked && (
                          <div className="mt-2 text-xs text-indigo-600 flex items-center gap-1">
                            Open resource →
                          </div>
                        )}
                      </a>
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

        {currentView === 'books' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">📚 Essential PM Books</h2>
              <p className="text-gray-600">Hand-picked books that every PM should read, organized by topic.</p>
            </div>

            {Object.entries(PM_BOOKS).map(([category, books]) => (
              <div key={category} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((book, idx) => (
                    <a
                      key={idx}
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-bold text-gray-900 flex-1">{book.title}</div>
                        <div className="flex items-center gap-1 ml-2">
                          {'⭐'.repeat(book.rating)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">by {book.author}</div>
                      <div className="text-sm text-gray-700 mb-3">{book.why}</div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          book.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          book.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {book.level}
                        </span>
                        <span className="text-xs text-indigo-600">View on Amazon →</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'checklist' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">✅ PM Career Checklist</h2>
              <p className="text-gray-600 mb-4">
                A 12-month roadmap to becoming a Product Manager. Track your progress through each phase.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Phase 1: Foundations (Months 1-3)",
                  description: "Build baseline product knowledge",
                  items: [
                    "Read Inspired by Marty Cagan",
                    "Read The Mom Test",
                    "Complete Fundamentals module in this app",
                    "Do 10 product teardowns",
                    "Learn basic SQL",
                    "Follow 10 PM influencers",
                    "Join PM communities"
                  ]
                },
                {
                  title: "Phase 2: Hands-On Practice (Months 4-6)",
                  description: "Apply knowledge through projects",
                  items: [
                    "Complete 5 user interviews",
                    "Build a side project from idea → launch",
                    "Write 3 PRDs for imaginary features",
                    "Create a product roadmap",
                    "Practice 20 product design questions",
                    "Learn a no-code tool (Webflow/Bubble)",
                    "Attend 3 PM meetups"
                  ]
                },
                {
                  title: "Phase 3: Portfolio Building (Months 7-9)",
                  description: "Create work samples to show employers",
                  items: [
                    "Complete 5 portfolio projects",
                    "Write 5 product case studies",
                    "Create a product strategy deck",
                    "Contribute to open source",
                    "Do 10+ product critiques online",
                    "Build personal website"
                  ]
                },
                {
                  title: "Phase 4: Job Search (Months 10-12)",
                  description: "Land your first PM role",
                  items: [
                    "Apply to 50+ PM jobs",
                    "20 coffee chats with PMs",
                    "Practice 50+ product sense questions",
                    "Practice 20+ estimation questions",
                    "Mock interview with 3 PMs",
                    "Optimize LinkedIn + resume",
                    "Apply to APM programs"
                  ]
                }
              ].map((phase, phaseIdx) => (
                <div key={phaseIdx} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                  <p className="text-gray-600 mb-4">{phase.description}</p>
                  <div className="space-y-2">
                    {phase.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                        <input
                          type="checkbox"
                          className="mt-1 w-5 h-5 text-indigo-600 rounded"
                          onChange={(e) => {
                            // Store in local state or storage
                            console.log(`Toggled: ${item}`, e.target.checked);
                          }}
                        />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'people' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">👥 People & Resources to Follow</h2>
              <p className="text-gray-600">
                Top PM influencers, newsletters, communities, and podcasts to accelerate your learning.
              </p>
            </div>

            {/* Influencers */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">🌟 PM Influencers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PM_PEOPLE_RESOURCES.influencers.map((person, idx) => (
                  <a
                    key={idx}
                    href={person.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <div className="font-bold text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{person.role}</div>
                    <div className="text-sm text-gray-700">{person.why}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletters */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">📧 Newsletters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PM_PEOPLE_RESOURCES.newsletters.map((newsletter, idx) => (
                  <a
                    key={idx}
                    href={newsletter.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <div className="font-bold text-gray-900">{newsletter.name}</div>
                    <div className="text-sm text-gray-600">Focus: {newsletter.focus}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Communities */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">🤝 Communities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PM_PEOPLE_RESOURCES.communities.map((community, idx) => (
                  <a
                    key={idx}
                    href={community.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <div className="font-bold text-gray-900">{community.name}</div>
                    <div className="text-sm text-gray-600">{community.description}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* Podcasts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">🎙️ Podcasts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PM_PEOPLE_RESOURCES.podcasts.map((podcast, idx) => (
                  <a
                    key={idx}
                    href={podcast.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                  >
                    <div className="font-bold text-gray-900">{podcast.name}</div>
                    <div className="text-sm text-gray-600 mb-1">Host: {podcast.host}</div>
                    <div className="text-sm text-gray-700">{podcast.why}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

