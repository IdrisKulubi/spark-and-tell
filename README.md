<img width="500" height="850" alt="image" src="https://github.com/user-attachments/assets/090540b2-1e3f-46d6-b003-475ef26be180" />
<img width="606" height="825" alt="image" src="https://github.com/user-attachments/assets/94122852-2c48-4fd9-b94a-a4e82659ebaf" />



# 🎲💕 Spark & Tell

> Turn awkward dates into unforgettable connections through meaningful conversations

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://spark-and-tell.vercel.app)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support-yellow)](https://buymeacoffee.com/elliottchong)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ What is Spark & Tell?

Spark & Tell is an interactive conversation game designed for couples to deepen their connection through thoughtful questions, playful challenges, and meaningful conversations. No awkward silences, just genuine moments of connection.

### 🎮 How It Works

1. **Roll the Dice** - Each number corresponds to a different category
2. **Answer Questions** - Share your thoughts, stories, and dreams
3. **Award Sparks** - Give your partner points based on their answers
4. **Connect & Win** - The real victory is the connection you build together

## 🚀 Features

- 🎲 **6 Unique Categories** - From icebreakers to deep conversations
- ✨ **Spark Awarding System** - Reward your partner for great answers
- ⚡ **Power-Ups** - Skip, re-roll, or both answer for added fun
- 📊 **Progress Tracking** - See your connection score grow
- 📱 **Mobile Responsive** - Play on any device
- 🎨 **Beautiful Animations** - Smooth, engaging user experience
- 💾 **No Sign-up Required** - Jump right in and start playing

## 🎯 Question Categories

1. **🧊 Icebreakers** - Light, fun questions to get started
2. **✨ Dreams & Adventures** - Explore aspirations and future plans
3. **🤔 Would You Rather** - Fun dilemmas and choices
4. **📖 Story Time** - Share personal stories and memories
5. **🔥 Spicy** - Flirty and romantic questions
6. **💭 Deep Dive** - Meaningful, vulnerable conversations

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Package Manager**: [Bun](https://bun.sh/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/) (recommended)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spark-and-tell.git
cd spark-and-tell
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Run the development server:
```bash
bun dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
bun run build
bun run start
```

## 🎨 Customization

### Adding New Questions

Questions are stored in `src/data/questions.json`. Each question follows this structure:

```json
{
  "id": "unique-id",
  "category": 1,
  "difficulty": 1,
  "points": 1,
  "text": "Your question here",
  "tags": ["tag1", "tag2"],
  "type": "standard"
}
```

### Modifying Categories

Categories are defined in `src/types/game.ts`:

```typescript
export enum Category {
  ICEBREAKER = 1,
  DREAMS = 2,
  WOULD_YOU_RATHER = 3,
  STORY_TIME = 4,
  SPICY = 5,
  DEEP_DIVE = 6,
}
```

## 📝 Project Structure

```
spark-and-tell/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── _components/     # React components
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── data/
│   │   └── questions.json   # Question database
│   ├── store/
│   │   └── gameStore.ts     # Zustand store
│   └── types/
│       └── game.ts          # TypeScript types
├── public/                  # Static assets
└── package.json            # Dependencies
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- Add more questions to existing categories
- Create new question categories
- Add sound effects and music
- Implement additional power-ups
- Add multiplayer support
- Create themed question packs
- Improve accessibility features

## 💖 Support

If you enjoy Spark & Tell and it helps bring you closer to your partner, consider:

- ⭐ Starring this repository
- 🔄 Sharing it with friends
- ☕ [Buying me a coffee](https://buymeacoffee.com/elliottchong)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for couples everywhere
- Inspired by the need for deeper connections in the digital age
- Special thanks to all contributors and supporters

## 📧 Contact

Elliott Chong - [@elliottchong](https://github.com/elliott-chong)

Project Link: [https://github.com/yourusername/spark-and-tell](https://github.com/yourusername/spark-and-tell)

---

<p align="center">Made with ❤️ for meaningful connections</p>
