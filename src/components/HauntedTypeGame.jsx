import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HALLOWEEN_PASSAGES } from '../lib/passages';

const GAME_DURATION = 10; 
const HauntedTypeGame = () => {
  const [passage, setPassage] = useState('');
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [startTime, setStartTime] = useState(null);

  const inputRef = useRef(null);

  const resetGame = useCallback(() => {
    const randomPassage = HALLOWEEN_PASSAGES[Math.floor(Math.random() * HALLOWEEN_PASSAGES.length)];
    setPassage(randomPassage);
    setInput('');
    setErrors([]);
    setGameActive(false);
    setGameFinished(false);
    setTimeLeft(GAME_DURATION);
    setStartTime(null);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameFinished(true);
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!gameActive && value) {
      setGameActive(true);
      setStartTime(Date.now());
    }

    const newErrors = [];
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== passage[i]) {
        newErrors.push(i);
      }
    }
    setErrors(newErrors);

    if (value.length === passage.length) {
      setGameFinished(true);
      setGameActive(false);
    }
  };

  const correctChars = input.length - errors.length;
  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
  const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : GAME_DURATION - timeLeft;
  const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / (timeElapsed / 60)) : 0;

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 font-mono">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-4xl opacity-10 animate-drift"
            style={{
              left: `${-20 + (i % 4) * 25}%`,
              top: `${-10 - (i * 15)}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${20 + i * 3}s`,
            }}
          >
            👻
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="flex gap-4">
            <span><span className="text-amber-400 font-bold">{wpm}</span> WPM</span>
            <span>
              <span className={accuracy >= 90 ? 'text-emerald-400' : accuracy >= 75 ? 'text-amber-400' : 'text-rose-400'}>
                {accuracy}%
              </span> Accuracy
            </span>
          </div>
          <div className="text-purple-400 font-mono">{timeLeft}s</div>
        </div>

        {!gameFinished ? (
          <div className="mb-6 p-6 bg-gray-800/30 backdrop-blur rounded-xl border border-gray-700/50 leading-relaxed">
            {passage.split('').map((char, i) => {
              let color = 'text-gray-400';
              if (i < input.length) {
                color = errors.includes(i) ? 'text-rose-400 line-through' : 'text-emerald-400';
              } else if (i === input.length) {
                color = 'text-amber-400';
              }
              return (
                <span key={i} className={color}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">🪦 Haunting Complete!</h2>
            <p className="text-lg mb-2">WPM: <span className="font-bold text-white">{wpm}</span></p>
            <p className="text-lg mb-6">Accuracy: <span className="font-bold">{accuracy}%</span></p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition transform hover:scale-105 shadow-lg"
            >
              👻 Summon New Passage
            </button>
          </div>
        )}

        {!gameFinished && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            disabled={timeLeft === 0}
            placeholder={gameActive ? '' : 'Begin your incantation...'}
            className="w-full p-4 bg-gray-800 border border-amber-800/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-lg"
            autoFocus
          />
        )}
      </div>
    </div>
  );
};

export default HauntedTypeGame;