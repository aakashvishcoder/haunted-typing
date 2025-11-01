import React, { useState, useState, useRef, useCallback } from 'react';
import { HALLOWEEN_WORDS } from '../lib/words';

const GAME_DURATION = 30;

const HauntedTypeGame = () => {
    const [words, setWords] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [errors, setErrors] = useState<number[]>([]);
    const [gameActive, setGameActive] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [startTime, setStartTime] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

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
        let timer: NodeJS.Timeout;
        if (gameActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && gameActive) {
            setGameActive(false);
            setGameFinished(true);
        }
        return () => clearTimeout(timer);
    }, [gameActive, timeLeft]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
    };
};

export default HauntedTypeGame;