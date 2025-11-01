import React, { useState, useEffect, useCallback } from 'react';

const SPOOKY_TEXT = "Beware the whispering shadows that dance beneath the moonless sky...";

const HauntedTypingTest = () => {
    const [input, setInput] = useState('');
    const [ghosts, setGhosts] = useState([]);

    const handleChange = useCallback((e) => {
        let value = e.target.value;

        if (Math.random() < 0.1 && value.length > input.length) {
            const lastChar = value[value.length - 1];
            const isLastCharCorrect = lastChar == SPOOKY_TEXT[input.length];

            if (isLastCharCorrect && Math.random() < 0.5) {
                value = input;
            } else {
                const spookyChars = '💀🕷️🕸️🧟‍♂️🔮🩸🕯️';
                const randomChar = spookyChars[Math.floor(Math.random() * spookyChars.length)];
                value = input + randomChar;
            }
        }

        setInput(value);

        if (value.length > 0 && Math.random() < 0.15) {
            setGhosts(prev => [...prev, { id: Date.now(), left: Math.random() * 90 }]);
        }
    }, [input]);

    useEffect(() => {
        const interval = setInterval(() => {
            setGhosts(prev => prev.slice(-5));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const correctChars = input
        .split('')
        .filter((char, i) => char == SPOOKY_TEXT[i]).length;
    const accuracy = input.length ? Math.round((correctChars / input.length) * 100) : 0;

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
            {ghosts.map(ghost => (
                <span
                    key={ghost.id}
                    className="absolute text-3xl opacity-60 animate-float pointer-events-none"
                    style={{
                        left: `${ghost.left}%`,
                        top: `${Math.random() * 70 + 15}%`,
                        fontSize: `${Math.random() * 24 + 20}px`,
                    }}
                >
                    👻
                </span>
            ))}

            <div className="relative z-10 w-full max-w-3xl bg-gray-900/60 backdrop-blur-sm border border-purple-900/40 rounded-xl p-6 shadow-2xl shadow-purple-900/20">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center bg-gradient-to-r from-red-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-md">
                    Haunted Typing Test
                </h1>
                <p className="text-center text-purple-300 text-sm mb-6">Type if you dare...</p>

                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 font-mono text-lg tracking-wide leading-relaxed">
                    {SPOOKY_TEXT.split('').map((char, i) => (
                        <span
                            key={i}
                            className={`inline-block ${
                                i < input.length
                                    ? input[i] === char
                                        ? 'text-emerald-400'
                                        : 'text-rose-400 line-through'
                                    : 'animate-flicker'
                            }`}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>

                <textarea
                    value={input}
                    onChange={handleChange}
                    placeholder="Begin your incantation..."
                    className="w-full p-4 bg-gray-800/70 border border-purple-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-lg resize-none"
                    rows="3"
                    autoFocus
                />

                <div className="mt-4 text-center text-sm text-gray-300">
                    Accuracy: <span className={accuracy > 80 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{accuracy}%</span>
                </div>
            </div>
        </div>
    );
};

export default HauntedTypingTest;