# Product Requirements Document: Spark & Tell

## 1. Product Overview

### 1.1 Product Name
**Spark & Tell** - A gamified dating question card game for couples

### 1.2 Vision Statement
Create an interactive web-based game that enhances real-life dates through meaningful conversations, playful challenges, and connection scoring, designed for two people sharing an in-person experience.

### 1.3 Target Users
- Couples on first dates to long-term relationships
- Ages 18-40
- People seeking deeper connections through guided conversation
- Users comfortable with mobile/tablet web apps

### 1.4 Core Value Proposition
Transform awkward date conversations into fun, meaningful connections through gamified questions and real-time spark scoring.

## 2. Technical Stack

- **Frontend**: Next.js 15 with App Router (React 19)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **State Management**: Zustand (for game state) + React Context (for session)
- **Backend**: tRPC v11 (optional for future features)
- **Database**: Not needed for MVP (questions stored as JSON)
- **Deployment**: Vercel
- **Type Safety**: TypeScript 5.8 with strict mode
- **Code Quality**: Biome for linting and formatting
- **Package Manager**: Bun
- **Environment Validation**: @t3-oss/env-nextjs with Zod

## 3. Core Features & User Flow

### 3.1 Landing Page
**User Story**: As a user, I want to quickly start a game with my date without complex setup.

**Requirements**:
- Single "Start New Game" button (no auth required)
- Brief animated tutorial (3 slides max)
- Optional: "How to Play" modal
- Mobile-first responsive design
- Dark/light mode toggle

### 3.2 Game Setup Screen
**User Story**: As a user, I want to customize our game experience before starting.

**Requirements**:
- **Player Names Input**: 
  - Two text fields for names
  - Auto-generate fun nicknames if skipped
- **Date Type Selection**:
  - First Date (easier questions, more icebreakers)
  - Been Dating (balanced mix)
  - Long-term Love (deeper questions, includes spicy)
  - Custom Mix (toggle categories on/off)
- **Game Length**:
  - Quick (15 mins / ~10 questions)
  - Standard (30 mins / ~20 questions)  
  - Marathon (60+ mins / unlimited)
- **Optional Settings**:
  - Enable timer per question (30/60/90 seconds)
  - Background music on/off
  - Spark scoring visible/hidden

### 3.3 Main Game Interface

#### 3.3.1 Layout Structure
```
┌─────────────────────────────┐
│     [Player 1] 's Turn      │ <- Turn indicator
│         Sparks: 23          │ <- Score display
├─────────────────────────────┤
│                             │
│      [3D Dice Animation]    │ <- Interactive dice
│                             │
├─────────────────────────────┤
│     [Question Card Area]    │ <- Question display
│                             │
│   "What's your biggest..."  │
│                             │
├─────────────────────────────┤
│ [Skip] [Timer] [Bookmark]   │ <- Action buttons
│                             │
│    [Award Sparks Panel]     │ <- Spark giving UI
└─────────────────────────────┘
```

#### 3.3.2 Dice Roll Mechanic
**Requirements**:
- Tap/click to roll animated 3D dice
- Dice numbers map to categories:
  1. 🧊 Icebreakers (Light & Easy)
  2. ✨ Dreams & Adventures  
  3. 🤔 Would You Rather
  4. 📖 Story Time (Past & Memories)
  5. 🔥 Spicy (Flirty/Physical)
  6. 💭 Deep Dive (Vulnerable)
- Satisfying roll animation (1-2 seconds)
- Sound effects (optional)
- Can't roll same category twice in a row

#### 3.3.3 Question Card Display
**Requirements**:
- Elegant card flip animation when category selected
- Clear, readable typography (min 18px on mobile)
- Difficulty indicator (1-3 dots/stars)
- Question number counter (e.g., "Question 7 of 20")
- Category color coding
- Optional timer display (countdown bar)

#### 3.3.4 Spark Points System
**After each question, the OTHER player awards sparks**:

**Spark Types** (other player chooses one or multiple):
- 😂 **Made Me Laugh** (+2 sparks)
- 🥰 **That's Adorable** (+2 sparks)  
- 🤯 **Didn't Know That** (+3 sparks)
- 💕 **Felt Connection** (+3 sparks)
- 🔥 **That Was Hot** (+2 sparks)
- 💪 **Brave Share** (+4 sparks)
- 🎯 **Same!** (+2 sparks)

**UI Requirements**:
- After answering, show "Award Sparks" panel
- Animated spark icons to choose from
- Running total for both players
- Subtle celebration animation for high spark moments
- Optional: Combo multipliers for special moments

### 3.4 Special Features

#### 3.4.1 Power-Ups (3 per player per game)
- **🔄 Reverse Card**: Ask the question back to them
- **👥 Both Answer**: Both players answer the same question
- **⏭️ Skip**: Skip uncomfortable question (limited to 2)
- **🎲 Re-roll**: Roll the dice again for new category

#### 3.4.2 Mini-Games (Every 5 questions)
- **Lightning Round**: 30-second rapid "This or That" 
- **Guess My Answer**: Predict partner's response
- **Complete the Sentence**: "My partner is..."
- **Photo Challenge**: Take a specific type of selfie together

#### 3.4.3 Progressive Difficulty
- Questions within categories get harder over time
- Level 1: First 3 questions from category
- Level 2: Next 3 questions  
- Level 3: All subsequent questions
- Visual indicator of current heat level

### 3.5 Game End Screen

**Requirements**:
- **Final Spark Score** comparison
- **Superlatives Awarded**:
  - "Most Laughs Given" 
  - "Vulnerability Champion"
  - "Best Story Teller"
  - "Spark Master"
- **Relationship Stats**:
  - Total questions answered
  - Favorite category (most questions)
  - Total sparks created together
  - Connection rating (sum of both scores)
- **Memory Book**:
  - List of bookmarked questions
  - Option to email questions to remember
- **Share Options**:
  - Save session locally
  - Generate shareable link to results
  - "Play Again" with same settings

## 4. Question Database Structure

### 4.1 Question Schema
```typescript
interface Question {
  id: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  text: string;
  followUp?: string; // Optional follow-up prompt
  minDateNumber?: number; // Don't show on first date
  tags: string[]; // ['funny', 'vulnerable', 'romantic']
  type: 'standard' | 'challenge' | 'both-answer';
}

enum Category {
  ICEBREAKER = 1,
  DREAMS = 2,
  WOULD_YOU_RATHER = 3,
  STORY_TIME = 4,
  SPICY = 5,
  DEEP_DIVE = 6
}
```

### 4.2 Question Count Requirements
- Minimum 30 questions per category (180 total)
- At least 10 per difficulty level per category
- 20% should be "both-answer" type
- 10% should include challenges

## 5. Non-Functional Requirements

### 5.1 Performance
- Initial load time < 2 seconds
- Dice roll animation smooth at 60fps
- Question transitions < 300ms
- Works offline after first load (PWA)

### 5.2 Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigable
- Screen reader friendly
- High contrast mode available
- Minimum touch target 44x44px

### 5.3 Device Support
- Mobile-first (iPhone 12 and up)
- Tablet optimized
- Desktop functional
- Landscape and portrait modes
- iOS Safari, Chrome, Android Chrome

### 5.4 Analytics to Track
- Average session length
- Most/least popular categories
- Skip rate by question
- Average sparks per question
- Completion rate

## 6. MVP Scope (Week 1 Launch)

### Must Have
- Basic game flow (setup → play → end)
- 6 categories with 20 questions each
- Dice roll mechanic
- Turn-based system
- Spark points awarding
- Mobile responsive design
- Local storage for session

### Nice to Have (Post-Launch)
- User accounts
- Custom question packs
- Multiplayer (double dates)
- Voice note responses
- AI-generated summaries
- Premium question packs
- Relationship progress tracking

## 7. UI/UX Design Guidelines

### 7.1 Visual Design
- **Color Palette**: 
  - Primary: Gradient from #FF6B6B (coral) to #4ECDC4 (teal)
  - Backgrounds: Dark mode default (#1a1a2e to #16213e)
  - Accents: Gold (#FFD700) for sparks
- **Typography**:
  - Headers: Bold, modern sans-serif
  - Questions: Readable serif or clean sans-serif
  - Min size: 18px mobile, 20px tablet
- **Animations**:
  - Smooth, playful, not distracting
  - Micro-interactions on all buttons
  - Particle effects for spark awards

### 7.2 Sound Design (Optional)
- Dice roll sound
- Spark award chime
- Background ambient music (3 options)
- Mutable by default

## 8. Sample Questions per Category

### Icebreakers (Level 1)
- "What's your go-to karaoke song?"
- "If you could have dinner with anyone dead or alive, who?"
- "What's your most unpopular opinion about food?"

### Dreams & Adventures (Level 2)
- "Describe your perfect day from sunrise to sunset"
- "If money wasn't a factor, what would you do tomorrow?"
- "What skill do you wish you had mastered?"

### Would You Rather (Level 1)
- "Would you rather be able to fly or be invisible?"
- "Would you rather live in the mountains or by the beach?"
- "Would you rather have more time or more money?"

### Story Time (Level 2)
- "Tell me about a time you were really proud of yourself"
- "What's your most embarrassing story that you can laugh about now?"
- "Describe your first kiss"

### Spicy (Level 3)
- "What did you notice first about me physically?"
- "Describe your ideal romantic evening"
- "What's something you've always wanted to try but haven't?"

### Deep Dive (Level 3)
- "What's a fear you haven't told many people?"
- "When was the last time you cried and why?"
- "What's something you need to forgive yourself for?"

## 9. Question Data Structure (Frontend JSON)

```typescript
// TypeScript types in /src/types/game.ts
export interface Question {
  id: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  text: string;
  followUp?: string;
  minDateNumber?: number;
  tags: string[];
  type: 'standard' | 'challenge' | 'both-answer';
}

export enum Category {
  ICEBREAKER = 1,
  DREAMS = 2,
  WOULD_YOU_RATHER = 3,
  STORY_TIME = 4,
  SPICY = 5,
  DEEP_DIVE = 6
}

// Questions stored in /src/data/questions.json
export const questions: Question[] = [
  {
    id: "ice-1",
    category: 1,
    difficulty: 1,
    text: "What's the weirdest food combination you enjoy?",
    tags: ["funny", "light"],
    type: "standard"
  },
  // ... all questions in JSON
];

// Game session stored in localStorage/sessionStorage
interface GameSession {
  player1Name: string;
  player2Name: string;
  dateType: 'first' | 'dating' | 'longterm' | 'custom';
  gameLength: 'quick' | 'standard' | 'marathon';
  player1Sparks: number;
  player2Sparks: number;
  questionsAnswered: string[]; // question IDs
  currentTurn: 1 | 2;
  startedAt: string;
}
```

## 10. Success Metrics

- **Week 1**: Successfully use on your date, gather feedback
- **Month 1**: 100 completed game sessions
- **Month 3**: 1000 users, 4.5+ app store rating
- **Month 6**: 10,000 users, premium tier launch

## 11. Development Phases

### Phase 1 (Days 1-3): Foundation
- ✅ Project setup complete (T3 Stack with Next.js 15)
- Create TypeScript types and JSON questions file in `/src/data/`
- Build basic game components in `/src/app/`
- Implement dice roll mechanic with Framer Motion
- Set up Zustand store for game state

### Phase 2 (Days 4-5): Game Logic
- Turn-based system using Zustand store
- Spark points awarding system
- Category selection logic with question filtering from JSON
- Session state management with localStorage
- Run `bun check` and `bun typecheck` after each feature

### Phase 3 (Days 6-7): Polish
- Animations and transitions with Framer Motion
- End game screen with statistics
- Mobile optimization and responsive design
- Testing with `bun build` and `bun preview`
- Deploy to Vercel

---

**Note for Claude Code**: Focus on building a working MVP with the core game loop first. Prioritize mobile experience, smooth animations, and the spark scoring system. Questions are stored as a typed JSON file on the frontend - no database needed. Use Zustand for game state and localStorage for session persistence. The game should be playable and delightful within one week.