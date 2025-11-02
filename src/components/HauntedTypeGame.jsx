import React, { useState, useEffect, useRef, useCallback } from 'react';

const HALLOWEEN_WORDS = [
  "ghost", "witch", "pumpkin", "broom", "cauldron", "spider", "web", "fang", "moon", "grave",
  "crypt", "skull", "bone", "blood", "curse", "spell", "magic", "banshee", "zombie", "mummy",
  "vampire", "werewolf", "coffin", "curse", "tomb", "haunt", "spirit", "phantom", "shadow", "fear", "scream",
  "howl", "cackle", "omen", "ritual", "hex", "potion", "bat", "owl", "raven", "goblin", "ghoul", "demon",
  "devil", "hell", "candy", "trick", "treat", "mask", "costume", "lantern"
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

    const currentWord = words[currentWordIndex];
    const typedChars = value.split('');

    const newErrors = [];
    for (let i = 0; i < typedChars.length; i++) {
      if (typedChars[i] !== currentWord[i]) {
        newErrors.push(i);
      }
    }
    setErrors(errors);

    if (value.endsWith(' ')) {
      setInput("");
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
  for (let i = 0; i < words.length; i++) {
    groupedWords.push(words.slice(i, i + 8));
  }

  return (
    <div 
      className="relative min-h-screen bg-gray-900 text-gray-200 flex flex-col"
      style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}
    >
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-10 animate-float pointer-events-none"
          style={{
            left: `${-10 + (i % 5) * 25}%`,
            top: `${-10 -i * 15}%`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${25 + i * 4}s`,
          }}
        >
          👻
        </span>
      ))}

      <div className="relative z-10 flex flex-col flex-grow">
        <div className="flex-grow flex-col items-center justify-start pt-8 px-4 pb-16">
          <div className="w-full max-w-3xl">
            <div className="flex justify-between text-sm mb-6 text-gray-300">
              <div>
                <span className="text-amber-400 font-bold">{wpm}</span> WPM
              </div>
              <div>
                <span className={accuracy >= 90 ? 'text-emerald-400' : accuracy >= 75 ? 'text-amber-400' : 'text-rose-400'}>
                  {accuracy}%
                </span> Accuracy
              </div>
              <div>
                <span className="text-purple-400">{timeLeft}s</span>
              </div>
            </div>

            {!gameFinished ? (
              <div className="mb-6 p-6 bg-gray-800/30 backdrop-blur rounded-xl border border-gray-700/50">
                {groupedWords.map((line, lineIndex) => (
                  <div key={lineIndex} className="mb-2 last:mb-0">
                    {line.map((word, wordIndex) => {
                      const globalIndex = lineIndex * 8 + wordIndex;
                      if (globalIndex < currentWordIndex) {
                        return (
                          <span key={globalIndex} className="mr-3 relative inline-block">
                            {word}
                          </span>
                        );
                      } else if (globalIndex === currentWordIndex) {
                        return (
                          <span key={globalIndex} className="mr-3 relative inline-block">
                            {word.split('').map((char, j) => {
                              let color = 'text-white';
                              if (j < currentCharIndex) {
                                color = errors.includes(j) ? 'text-rose-400 line-through' : 'text-emerald-400';
                              } else if (j === currentCharIndex) {
                                color = 'text-amber-400';
                              } 
                              return (
                                <span key={j} className={`${color} text-lg`}>
                                  {char}
                                </span>
                              );
                            })}
                            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-amber-500/50 animate-pulse"></span>
                          </span>
                        );
                      } else {
                        return (
                          <span key={globalIndex} className="mr-3 text-gray-400 text-lg">
                            {word}
                          </span>
                        );
                      }
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-amber-400 mb-2">🪦 Test Complete!</h2>
                <p className="text-lg mb-1">WPM: <span className="font-bold text-white">{wpm}</span></p>
                <p className="text-lg mb-4">Accuracy: <span className="font-bold">{accuracy}%</span></p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition transform hover:scale-105"
                >
                  👻 Summon New Test
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
                placeholder={gameActive ? '' : "Click here or start typing..."}
                className="w-full p-4 text-lg bg-gray-900 border border-purple-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            )}
          </div>
        </div>

        <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-800/50 bg-gray-900/80 backdrop-blur">
            🎃 Made for Hackclub's Siege • Beware the typing spirits  
        </footer>
      </div>
    </div>
  );
};

export default HauntedTypeGame;