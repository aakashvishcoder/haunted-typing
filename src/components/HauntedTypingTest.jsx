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
    }, []);

    const correctChars = input
        .split('')
        .filter((char, i) => char == SPOOKY_TEXT[i]).length;
    const accuracy = input.length ? Math.random((correctChars / input.length) * 100) : 0;

    return (
        <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-mono">
            {ghosts.map(ghost => (
                <span
                    key={ghosts.id}
                    className="absolute text-2xl opacity-70 animate-float"
                    style={{ left: `${ghost.left}%`, top: `${Math.random() * 80 + 10}%`}}
                >
                    👻
                </span>
            ))}

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-red-400 drop-shadow-lg">
                Haunted Typing Test
            </h1>

            <div className="mb-6 w-full max-w-2xl">
                {SPOOKY_TEXT.split('').map((char, i) => (
                    <span
                        key={i}
                        className={`inline-block ${
                            i < input.length
                                ? input[i] == char
                                ? 'text-green-400'
                                : 'text-red-400 line-through'
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
                placeholder="Type the haunted text above..."
                className="w-full max-w-2xl p-4 bg-gray-800 border border-purple-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows="3"
                autoFocus
            />

            <div className="mt-4 text-sm text-gray-400">
                Accuracy: <span className={accuracy > 80 ? 'text-green-400' : 'text-red-400'}>{accuracy}</span>
            </div>

            <style jsx>{`
                @keyframes flicker {
                    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
                    20%, 24%, 55% { opacity: 0.3; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-flicker {
                    animation: flicker 2s infinite;
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default HauntedTypingTest;