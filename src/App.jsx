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
const POPUP_TRIGGER_OPTIONS = [5, 6, 7];

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const ETHICAL_VALUES = [
  {
    title: "Integrity",
    message: "Do what's right, even when no one is watching.",
  },
  { title: "Compassion", message: "A kind heart can change someone's world." },
  { title: "Respect", message: "Treat others the way you want to be treated." },
  {
    title: "Gratitude",
    message: "Be thankful for what you have and those around you.",
  },
  {
    title: "Honesty",
    message: "Truth builds trust and strengthens character.",
  },
  {
    title: "Perseverance",
    message: "Keep moving forward, no matter the obstacle.",
  },
  {
    title: "Kindness",
    message: "Small acts of kindness create ripples of positive change.",
  },
  {
    title: "Courage",
    message: "Bravery is not the absence of fear, but action in spite of it.",
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
      const pos = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
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
        justifyContent: "center",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <InstructionsButton onClick={() => setShowInstructions(true)} />

      <h1
        style={{
          fontSize: "42px",
          fontWeight: "bold",
          color: "var(--color-secondary)",
          marginBottom: "5px",
          textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        TATA ETHICS GAME
      </h1>

      <h2
        style={{
          fontSize: "42px",
          fontWeight: "bold",
          color: "var(--color-secondary)",
          marginBottom: "10px",
          textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        🐍 Snake Game
      </h2>

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
