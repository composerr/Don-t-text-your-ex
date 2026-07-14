import React, { useState, useEffect, useRef } from 'react';
import { generateMathQuestion } from '@/lib/sobrietyMath';

const TIME_PER_QUESTION = 20;

export default function MathChallenge({ questionNumber, total = 3, onResult }) {
  const [question] = useState(() => generateMathQuestion());
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    if (timeLeft <= 0 && !answered) {
      setAnswered(true);
      const timer = setTimeout(() => onResultRef.current(false), 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answered]);

  const handleSelect = (val) => {
    if (answered) return;
    setSelected(val);
    setAnswered(true);
    const correct = Number(val) === Number(question.answer);
    setTimeout(() => onResultRef.current(correct), 700);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-[#FF6EC7] text-xs font-bold uppercase tracking-[0.2em] mb-1">
        Question {questionNumber} / {total}
      </div>

      <div className="relative mb-8 mt-4">
        <div
          className="text-5xl font-black text-white"
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}
        >
          {question.equation} = ?
        </div>
      </div>

      <div className={`text-3xl font-mono font-black mb-8 ${timeLeft <= 5 ? 'text-[#FF2D78] animate-pulse' : 'text-[#00D4FF]'}`}>
        {timeLeft}s
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {question.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = Number(opt) === Number(question.answer);
          let cls = 'bg-[#1A0533] text-[#00D4FF] border border-[#00D4FF]/30 hover:border-[#00D4FF] hover:bg-[#2D1B69]';
          if (answered) {
            if (isCorrect) cls = 'bg-green-500/30 text-green-400 border border-green-400';
            else if (isSelected) cls = 'bg-red-500/30 text-red-400 border border-red-400';
            else cls = 'bg-[#1A0533]/50 text-gray-600 border border-gray-800';
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={answered}
              className={`py-5 rounded-xl text-2xl font-black transition-all duration-200 active:scale-95 ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}