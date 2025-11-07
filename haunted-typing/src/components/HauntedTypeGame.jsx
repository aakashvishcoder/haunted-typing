import React, { useState, useEffect, useRef, useCallback } from 'react';

const HALLOWEEN_WORDS = [
  "ghost", "witch", "pumpkin", "broom", "cauldron", "spider", "web", "fang", "moon", "grave",
  "crypt", "skull", "bone", "blood", "curse", "spell", "magic", "banshee", "zombie", "mummy",
  "vampire", "werewolf", "coffin", "tomb", "haunt", "spirit", "phantom", "shadow", "fear", "scream",
  "howl", "cackle", "omen", "ritual", "hex", "potion", "bat", "owl", "raven", "goblin",
  "ghoul", "demon", "devil", "hell", "candy", "trick", "treat", "mask", "costume", "lantern"
];

const GAME_DURATION = 10;

const HauntedTypeGame = () => {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [errors, setErrors] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [startTime, setStartTime] = useState(null);
  const [wpmHistory, setWpmHistory] = useState([]);

  const inputRef = useRef(null);

  const generateWords = useCallback(() => {
    return Array.from({ length: 100 }, () =>
      HALLOWEEN_WORDS[Math.floor(Math.random() * HALLOWEEN_WORDS.length)]
    );
  }, []);

  const resetGame = useCallback(() => {
    const newWords = generateWords();
    setWords(newWords);
    setInput('');
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setErrors([]);
    setWpmHistory([]);
    setGameActive(false);
    setGameFinished(false);
    setTimeLeft(GAME_DURATION);
    setStartTime(null);
    if (inputRef.current) inputRef.current.focus();
  }, [generateWords]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameActive(false);
            setGameFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (!gameActive || !startTime) return;

    const interval = setInterval(() => {
      const totalTypedNow = words
        .slice(0, currentWordIndex)
        .reduce((sum, word) => sum + word.length, 0) + input.length;
      const correctCharsNow = totalTypedNow - errors.length;
      const elapsedSec = (Date.now() - startTime) / 1000;
      const wpmNow = elapsedSec > 0 ? Math.round((correctCharsNow / 5) / (elapsedSec / 60)) : 0;
      setWpmHistory(prev => [...prev, wpmNow]);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameActive, startTime, currentWordIndex, input.length, errors, words]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!gameActive && value) {
      setGameActive(true);
      setStartTime(Date.now());
    }

    const currentWord = words[currentWordIndex];
    const typedChars = value.split('');

    const newErrors = [];
    for (let i = 0; i < typedChars.length; i++) {
      if (typedChars[i] !== currentWord[i]) {
        newErrors.push(i);
      }
    }
    setErrors(newErrors);

    if (value.endsWith(' ')) {
      setInput('');
      setCurrentWordIndex(prev => prev + 1);
      setCurrentCharIndex(0);
    } else {
      setCurrentCharIndex(value.length);
    }
  };

  const totalTyped = words
    .slice(0, currentWordIndex)
    .reduce((sum, word) => sum + word.length, 0) + input.length;
  const correctChars = totalTyped - errors.length;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
  const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : GAME_DURATION - timeLeft;
  const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / (timeElapsed / 60)) : 0;

  const groupedWords = [];
  for (let i = 0; i < words.length; i += 8) {
    groupedWords.push(words.slice(i, i + 8));
  }

  return (
    <div 
      className="relative min-h-screen bg-[#0a0500] text-amber-100 flex flex-col"
      style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
    >
      <div className="flex flex-col flex-grow items-center justify-center px-4 pb-16 pt-8">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between text-sm mb-6 text-amber-300/80">
            <div><span className="text-orange-400 font-bold">{wpm}</span> WPM</div>
            <div>
              <span className={accuracy >= 90 ? 'text-amber-400' : accuracy >= 75 ? 'text-orange-400' : 'text-rose-400'}>
                {accuracy}%
              </span> Accuracy
            </div>
            <div><span className="text-amber-500">{timeLeft}s</span></div>
          </div>

          {!gameFinished ? (
            <div className="mb-6 p-6 bg-[rgba(20,10,0,0.4)] backdrop-blur rounded-xl border border-amber-900/30">
              {groupedWords.map((line, lineIndex) => (
                <div key={lineIndex} className="mb-2 last:mb-0">
                  {line.map((word, wordIndex) => {
                    const globalIndex = lineIndex * 8 + wordIndex;
                    if (globalIndex < currentWordIndex) {
                      return (
                        <span key={globalIndex} className="mr-3 text-amber-400 text-lg">
                          {word}
                        </span>
                      );
                    } else if (globalIndex === currentWordIndex) {
                      return (
                        <span key={globalIndex} className="mr-3 relative inline-block">
                          {word.split('').map((char, j) => {
                            let color = 'text-amber-100';
                            if (j < currentCharIndex) {
                              color = errors.includes(j) ? 'text-rose-400 line-through' : 'text-amber-400';
                            } else if (j === currentCharIndex) {
                              color = 'text-orange-400';
                            }
                            return (
                              <span key={j} className={`${color} text-lg`}>
                                {char}
                              </span>
                            );
                          })}
                          <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-orange-500/60 animate-pulse"></span>
                        </span>
                      );
                    } else {
                      return (
                        <span key={globalIndex} className="mr-3 text-amber-600 text-lg">
                          {word}
                        </span>
                      );
                    }
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-orange-400 mb-4">🪦 Haunting Complete!</h2>
              <p className="text-lg mb-1">WPM: <span className="font-bold text-amber-100">{wpm}</span></p>
              <p className="text-lg mb-4">Accuracy: <span className="font-bold">{accuracy}%</span></p>

              {/* 📊 Graph appears after game ends */}
              {wpmHistory.length > 0 && (
                <div className="mb-6 p-4 bg-[rgba(20,10,0,0.4)] rounded-lg border border-amber-900/30">
                  <h3 className="text-amber-300 mb-2 text-sm">WPM Over Time</h3>
                  <div className="flex items-end h-24 gap-1 justify-center px-2">
                    {wpmHistory.map((wpmVal, i) => {
                      const max = Math.max(...wpmHistory);
                      const height = max > 0 ? (wpmVal / max) * 100 : 0;
                      return (
                        <div
                          key={i}
                          className="w-2 bg-amber-500 rounded-t"
                          style={{ height: `${height}%`, minHeight: '2px' }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    Test duration: {wpmHistory.length}s • Peak: {Math.max(...wpmHistory)} WPM
                  </p>
                </div>
              )}

              <button
                onClick={resetGame}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition transform hover:scale-105"
              >
                👻 New Test
              </button>
            </div>
          )}

          {!gameFinished && (
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              disabled={timeLeft <= 0}
              placeholder={gameActive ? '' : 'Type to begin...'}
              className="w-full p-4 text-lg bg-[rgba(10,5,0,0.6)] border border-orange-700/50 rounded-lg text-amber-100 placeholder-amber-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
            />
          )}
        </div>
      </div>

      <footer className="py-3 text-center text-sm text-amber-700/80 border-t border-amber-900/20 bg-[rgba(10,5,0,0.7)]">
        🎃 Haunted Typing Game
      </footer>
    </div>
  );
};

export default HauntedTypeGame;
