import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import GameBoard from "./components/GameBoard";
import ScoreBoard from "./components/ScoreBoard";
import InstructionsButton from "./components/InstructionsButton";
import InstructionsModal from "./components/InstructionsModal";
import EthicsPopup from "./components/EthicsPopup";
import GameOverModal from "./components/GameOverModal";
import "./App.css";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const MOVEMENT_SPEED = 150;
const POPUP_TRIGGER_OPTIONS = [4, 5, 6];

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const ETHICAL_VALUES = [
  {
    title: "Whistleblower",
    message:
      "Someone who bravely exposes wrongdoing for the greater good. Courage in truth safeguards integrity in any system.",
    icon: "📣",
  },
  {
    title: "Ethics",
    message:
      "The foundation of right conduct. Ethics guide our decisions and shape our collective trust and humanity.",
    icon: "⚖️",
  },
  {
    title: "Integrity",
    message:
      "Being honest and staying true to your moral principles, even when no one is watching. Integrity earns lifelong respect.",
    icon: "🛡️",
  },
  {
    title: "Excellence",
    message:
      "Strive for the highest standards in everything you do. Excellence is a journey of continuous improvement and purpose.",
    icon: "🏆",
  },
  {
    title: "Pioneering",
    message:
      "Being the first to explore new ideas and lead innovation. True pioneers inspire others to dream and act boldly.",
    icon: "🚀",
  },
  {
    title: "Unity",
    message:
      "Standing together as one. Unity builds strength, fosters understanding, and creates unstoppable teams.",
    icon: "🤝",
  },
  {
    title: "Responsibility",
    message:
      "Owning your actions and their outcomes. Responsibility is the foundation of leadership and trust.",
    icon: "⚖️",
  },
  {
    title: "Transparency",
    message:
      "Communicating openly and honestly. Transparency creates clarity, prevents misunderstandings, and builds credibility.",
    icon: "🔍",
  },
  {
    title: "Respect",
    message:
      "Honoring the value and dignity of others. Respect transforms differences into meaningful collaboration.",
    icon: "🙏",
  },
  {
    title: "Trust",
    message:
      "Believing in the reliability and integrity of others. Trust is earned through consistent actions over time.",
    icon: "🤝",
  },
  {
    title: "Accountability",
    message:
      "Taking ownership of your words, actions, and results. Accountability strengthens credibility and teamwork.",
    icon: "📘",
  },
  {
    title: "Fairness",
    message:
      "Treating everyone equally and justly. Fairness ensures harmony, justice, and lasting relationships.",
    icon: "⚖️",
  },
  {
    title: "Honesty",
    message:
      "Always speak the truth with kindness and courage. Honesty builds the foundation of every meaningful connection.",
    icon: "💬",
  },
  {
    title: "Diversity",
    message:
      "Celebrating differences and learning from every perspective. Diversity makes teams stronger and ideas richer.",
    icon: "🌎",
  },
  {
    title: "Equality",
    message:
      "Everyone deserves equal opportunity and respect. Equality empowers people to reach their full potential.",
    icon: "🤲",
  },
  {
    title: "Meritocracy",
    message:
      "Rewarding effort and talent fairly. Meritocracy ensures that success comes from hard work and ability, not privilege.",
    icon: "🎯",
  },
  {
    title: "Innovation",
    message:
      "Turning imagination into reality. Innovation drives progress and transforms challenges into opportunities.",
    icon: "💡",
  },
  {
    title: "Sustainability",
    message:
      "Building a better world without harming tomorrow. Sustainability means mindful growth and conscious action.",
    icon: "🌱",
  },
  {
    title: "Confidentiality",
    message:
      "Protecting private information with discretion. Trust thrives when confidentiality is respected.",
    icon: "🔒",
  },
  {
    title: "Leadership",
    message:
      "Guiding with vision, empathy, and example. True leadership uplifts others and cultivates growth.",
    icon: "🌟",
  },
  {
    title: "Commitment",
    message:
      "Dedication to goals and values even when challenges arise. Commitment is the seed of accomplishment.",
    icon: "💪",
  },
  {
    title: "Courage",
    message:
      "Facing fear with determination. Courage is the bridge between intention and achievement.",
    icon: "🦁",
  },
  {
    title: "Empathy",
    message:
      "Feeling and understanding the emotions of others. Empathy fosters compassion and strong human connections.",
    icon: "❤️",
  },
  {
    title: "Collaboration",
    message:
      "Working together with shared purpose. Collaboration multiplies creativity and success.",
    icon: "🤝",
  },
  {
    title: "Professionalism",
    message:
      "Maintaining competence, respect, and accountability. Professionalism builds confidence and trust in your work.",
    icon: "💼",
  },
  {
    title: "Tolerance",
    message:
      "Embracing differences with patience and respect. Tolerance nurtures peace and cooperation.",
    icon: "🕊️",
  },
  {
    title: "Learning",
    message:
      "A lifelong journey of curiosity and discovery. Each lesson shapes a wiser version of yourself.",
    icon: "📚",
  },
  {
    title: "Empowerment",
    message:
      "Giving people the confidence and authority to act. Empowerment transforms potential into performance.",
    icon: "⚡",
  },
  {
    title: "Communication",
    message:
      "Sharing information clearly and respectfully. Effective communication builds understanding and trust.",
    icon: "🗣️",
  },
  {
    title: "Protection",
    message:
      "Safeguarding people, values, and truth. Protection ensures safety, dignity, and justice for all.",
    icon: "🛡️",
  },
  {
    title: "Objectivity",
    message:
      "Judging situations with facts, not emotions. Objectivity helps maintain fairness and sound decision-making.",
    icon: "🎯",
  },
  {
    title: "Authenticity",
    message:
      "Being genuine and true to yourself. Authenticity inspires confidence and connection.",
    icon: "✨",
  },
  {
    title: "Inclusivity",
    message:
      "Creating space for everyone to belong. Inclusivity celebrates differences and strengthens unity.",
    icon: "🌍",
  },
  {
    title: "Credibility",
    message:
      "Earning trust through consistency and reliability. Credibility turns promises into proven results.",
    icon: "📜",
  },
  {
    title: "Discipline",
    message:
      "Training yourself to stay focused and consistent. Discipline is the key to turning goals into achievements.",
    icon: "🎯",
  },
  {
    title: "Dedication",
    message:
      "Staying fully committed to your purpose. Dedication transforms hard work into lasting success.",
    icon: "🔥",
  },
  {
    title: "Motivation",
    message:
      "The inner drive that pushes you toward greatness. Motivation fuels progress and persistence.",
    icon: "🚀",
  },
  {
    title: "Clarity",
    message:
      "Understanding what truly matters. Clarity helps you make better decisions and stay on your path.",
    icon: "🔦",
  },
  {
    title: "Support",
    message:
      "Helping others grow and succeed. True support strengthens teams and builds lasting bonds.",
    icon: "🫶",
  },
  {
    title: "Recognition",
    message:
      "Acknowledging effort and contribution. Recognition motivates excellence and inspires gratitude.",
    icon: "🏅",
  },
  {
    title: "Resilience",
    message:
      "The strength to recover from challenges stronger than before. Resilience turns obstacles into growth.",
    icon: "🌱",
  },
  {
    title: "Optimism",
    message:
      "Believing in positive outcomes even in adversity. Optimism fuels hope and innovation.",
    icon: "☀️",
  },
  {
    title: "Growth",
    message:
      "Continuously improving and evolving. Growth happens when you step outside your comfort zone.",
    icon: "🌳",
  },
  {
    title: "Vision",
    message:
      "Seeing beyond the present to shape the future. Visionaries turn ideas into reality through belief and action.",
    icon: "🔭",
  },
  {
    title: "Strategy",
    message:
      "Crafting a thoughtful plan to reach your goals. A clear strategy turns dreams into achievable milestones.",
    icon: "🗺️",
  },
  {
    title: "Synergy",
    message:
      "The power of combined effort. Synergy makes collaboration more effective than individual action.",
    icon: "⚙️",
  },
  {
    title: "Inspiration",
    message:
      "The spark that ignites creativity and courage. Inspiration pushes boundaries and elevates others.",
    icon: "💫",
  },
  {
    title: "Honour",
    message:
      "Living with dignity, respect, and truth. Honour defines how others remember your character.",
    icon: "🎖️",
  },

  // --- Additional curated values ---
  {
    title: "Kindness",
    message:
      "A small act of kindness can make a big difference. Compassion is contagious — spread it widely.",
    icon: "💖",
  },
  {
    title: "Mindfulness",
    message:
      "Be fully present in the moment. Mindfulness brings calmness, clarity, and better choices.",
    icon: "🧘",
  },
  {
    title: "Curiosity",
    message:
      "Keep asking questions and exploring. Curiosity is the beginning of all wisdom and discovery.",
    icon: "🔍",
  },
  {
    title: "Accountable",
    message:
      "Owning your results and learning from them. Accountability builds respect and growth.",
    icon: "📗",
  },
  {
    title: "Safety",
    message:
      "Protect yourself and others by acting responsibly. Safety ensures wellbeing and trust for all.",
    icon: "🦺",
  },
  {
    title: "Culture",
    message:
      "A reflection of shared beliefs and practices. A strong culture fosters belonging and pride.",
    icon: "🎭",
  },
  {
    title: "Governance",
    message:
      "Leading with fairness, clarity, and accountability. Good governance ensures lasting progress.",
    icon: "🏛️",
  },
  {
    title: "Prevention",
    message:
      "Act early to avoid harm or failure. Prevention is the best form of protection.",
    icon: "🛑",
  },
  {
    title: "Empowerment",
    message:
      "When people are trusted and encouraged, they grow beyond limits. Empowerment fuels innovation and joy.",
    icon: "⚡",
  },
];

const getRandomPopupTrigger = () => {
  return POPUP_TRIGGER_OPTIONS[
    Math.floor(Math.random() * POPUP_TRIGGER_OPTIONS.length)
  ];
};

export default function App() {
  const [snake, setSnake] = useState([
    { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
    { x: Math.floor(GRID_SIZE / 2) - 1, y: Math.floor(GRID_SIZE / 2) },
    { x: Math.floor(GRID_SIZE / 2) - 2, y: Math.floor(GRID_SIZE / 2) },
  ]);
  const [fruit, setFruit] = useState(null);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("ready"); // ready, playing, paused, gameOver
  const [showInstructions, setShowInstructions] = useState(false);
  const [showEthicsPopup, setShowEthicsPopup] = useState(false);
  const [currentEthicalMessage, setCurrentEthicalMessage] = useState(null);
  const [fruitsEaten, setFruitsEaten] = useState(0);
  const [fruitsUntilPopup, setFruitsUntilPopup] = useState(
    getRandomPopupTrigger()
  );
  const [touchStart, setTouchStart] = useState(null);

  const directionRef = useRef(direction);
  const gameStateRef = useRef(gameState);

  const generateFruit = useCallback((currentSnake) => {
    const findValidPosition = () => {
      // Avoid border cells - generate in inner area
      const pos = {
        x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
        y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
      };

      const isOccupied = currentSnake.some(
        (segment) => segment.x === pos.x && segment.y === pos.y
      );
      return isOccupied ? findValidPosition() : pos;
    };

    const position = findValidPosition();

    // 90% chance normal fruit (1 point), 10% chance special fruit (2-3 points)
    const random = Math.random();
    if (random < 0.9) {
      return { ...position, value: 1, type: "normal" };
    } else {
      const value = Math.random() < 0.5 ? 2 : 3;
      return { ...position, value, type: "special" };
    }
  }, []);

  // Initialize fruit position
  useEffect(() => {
    if (!fruit) {
      setFruit(generateFruit(snake));
    }
  }, [fruit, generateFruit, snake]);

  // Update refs
  useEffect(() => {
    directionRef.current = direction;
    gameStateRef.current = gameState;
  }, [direction, gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        gameStateRef.current !== "playing" &&
        gameStateRef.current !== "ready"
      )
        return;

      // Start game if in ready state
      if (gameStateRef.current === "ready") {
        setGameState("playing");
      }

      const currentDir = directionRef.current;
      let newDirection = null;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir !== DIRECTIONS.DOWN) newDirection = DIRECTIONS.UP;
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir !== DIRECTIONS.UP) newDirection = DIRECTIONS.DOWN;
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir !== DIRECTIONS.RIGHT) newDirection = DIRECTIONS.LEFT;
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir !== DIRECTIONS.LEFT) newDirection = DIRECTIONS.RIGHT;
          e.preventDefault();
          break;
        default:
          break;
      }

      if (newDirection) {
        setDirection(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Touch/Swipe controls
  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e) => {
      if (!touchStart) return;

      if (
        gameStateRef.current !== "playing" &&
        gameStateRef.current !== "ready"
      )
        return;

      // Start game if in ready state
      if (gameStateRef.current === "ready") {
        setGameState("playing");
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;

      const minSwipeDistance = 30;
      const currentDir = directionRef.current;
      let newDirection = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0 && currentDir !== DIRECTIONS.LEFT) {
            newDirection = DIRECTIONS.RIGHT;
          } else if (deltaX < 0 && currentDir !== DIRECTIONS.RIGHT) {
            newDirection = DIRECTIONS.LEFT;
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0 && currentDir !== DIRECTIONS.UP) {
            newDirection = DIRECTIONS.DOWN;
          } else if (deltaY < 0 && currentDir !== DIRECTIONS.DOWN) {
            newDirection = DIRECTIONS.UP;
          }
        }
      }

      if (newDirection) {
        setDirection(newDirection);
      }
      setTouchStart(null);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStart]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameState("gameOver");
          return prevSnake;
        }

        // Check self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameState("gameOver");
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check fruit collision
        if (fruit && newHead.x === fruit.x && newHead.y === fruit.y) {
          // Increase score by fruit value (default 1)
          const fruitValue = fruit.value || 1;
          setScore((prevScore) => prevScore + fruitValue);

          // Count fruits eaten (always +1 regardless of value)
          const newFruitsEaten = fruitsEaten + 1;
          setFruitsEaten(newFruitsEaten);

          // Generate new fruit
          setFruit(generateFruit(newSnake));

          // Check if popup should be triggered based on fruits eaten count
          if (newFruitsEaten >= fruitsUntilPopup) {
            // Trigger popup
            const randomMessage =
              ETHICAL_VALUES[Math.floor(Math.random() * ETHICAL_VALUES.length)];
            setCurrentEthicalMessage(randomMessage);
            setShowEthicsPopup(true);
            setGameState("paused");
            // Reset counter and set new random interval
            setFruitsEaten(0);
            setFruitsUntilPopup(getRandomPopupTrigger());
          }

          // Snake grows (don't remove tail)
          return newSnake;
        }

        // Snake doesn't grow, remove tail
        newSnake.pop();
        return newSnake;
      });
    }, MOVEMENT_SPEED);

    return () => clearInterval(gameInterval);
  }, [gameState, fruit, fruitsUntilPopup, generateFruit, fruitsEaten]);

  // Handle ethics popup continue
  const handleContinue = () => {
    setShowEthicsPopup(false);
    setGameState("playing");
  };

  // Handle game restart
  const handleRestart = () => {
    const initialSnake = [
      { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) },
      { x: Math.floor(GRID_SIZE / 2) - 1, y: Math.floor(GRID_SIZE / 2) },
      { x: Math.floor(GRID_SIZE / 2) - 2, y: Math.floor(GRID_SIZE / 2) },
    ];
    setSnake(initialSnake);
    setDirection(DIRECTIONS.RIGHT);
    setFruit(generateFruit(initialSnake));
    setScore(0);
    setFruitsEaten(0);
    setGameState("ready");
    setFruitsUntilPopup(getRandomPopupTrigger());
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "5px",
        minHeight: "100vh",
        maxWidth: "100vw",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <InstructionsButton onClick={() => setShowInstructions(true)} />

      <h1
        style={{
          fontSize: "clamp(24px, 6vw, 42px)",
          fontWeight: "bold",
          color: "var(--color-secondary)",
          marginBottom: "10px",
          textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
          textAlign: "center",
        }}
      >
        🐍 Snake Game
      </h1>

      <ScoreBoard score={score} />

      <GameBoard
        snake={snake}
        fruit={fruit}
        gridSize={GRID_SIZE}
        cellSize={CELL_SIZE}
        direction={direction}
      />

      {gameState === "ready" && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            color: "var(--color-text-light)",
            fontWeight: "bold",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            animation: "pulse 2s infinite",
          }}
        >
          Press any arrow key or swipe to start! 🎮
        </div>
      )}

      <AnimatePresence>
        {showInstructions && (
          <InstructionsModal onClose={() => setShowInstructions(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEthicsPopup && currentEthicalMessage && (
          <EthicsPopup
            message={currentEthicalMessage}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === "gameOver" && (
          <GameOverModal score={score} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
