'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Trophy, RotateCcw, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const questions = [
    {
        id: 1,
        question: 'What is the most effective way to protect against credential stuffing attacks?',
        options: [
            'Using a complex password for all accounts',
            'Using a unique password for every account',
            'Changing your password every 30 days',
            'Not using your email as a username'
        ],
        correct: 1,
        explanation: 'Credential stuffing relies on people reusing the same password across multiple sites. Unique passwords ensure a breach on one site doesn’t compromise others.'
    },
    {
        id: 2,
        question: 'You receive an email from "IT Support" asking you to click a link and log in to fix a security issue. What should you do?',
        options: [
            'Click the link to fix the issue immediately',
            'Reply to the email asking for more details',
            'Go directly to the official IT portal in your browser without clicking the link',
            'Forward the email to your friends to warn them'
        ],
        correct: 2,
        explanation: 'Always navigate to official portals directly. Links in unsolicited emails are a common way to lead users to fake login pages.'
    },
    {
        id: 3,
        question: 'What does "Two-Factor Authentication" (2FA) primarily provide?',
        options: [
            'A second password to remember',
            'Encryption for your local files',
            'A secondary layer of verification beyond just a password',
            'A way to recover your account if you forget your password'
        ],
        correct: 2,
        explanation: '2FA requires something you know (password) and something you have (phone/token), making it much harder for attackers to gain access.'
    },
    {
        id: 1,
        question: 'Which of the following is a common red flag in phishing emails?',
        options: [
            'The company name is spelled correctly',
            'The email address ends in @google.com',
            'Use of urgent tone or threats of account closure',
            'The email contains zero links'
        ],
        correct: 2,
        explanation: 'Attackers create a false sense of urgency to make you act quickly without thinking critically.'
    },
    {
        id: 5,
        question: 'Why is it dangerous to connect to public Wi-Fi without a VPN for sensitive tasks?',
        options: [
            'The connection is usually too slow for banking',
            'Public Wi-Fi is expensive to use',
            'Attackers can intercept your data traffic on unencrypted networks',
            'Public Wi-Fi only works on mobile devices'
        ],
        correct: 2,
        explanation: 'Unencrypted networks allow others on the same network to potentially view your data traffic, known as a Man-in-the-Middle attack.'
    }
];

export default function CyberQuiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));

    const handleOptionSelect = (index: number) => {
        if (isSubmitted) return;
        setSelectedOption(index);
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(answers[currentQuestion + 1]);
            setIsSubmitted(false);
        } else {
            calculateScore();
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        let newScore = 0;
        answers.forEach((ans, idx) => {
            if (ans === questions[idx].correct) newScore += 1;
        });
        setScore(newScore);
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResults(false);
        setAnswers(new Array(questions.length).fill(null));
    };

    const currentQ = questions[currentQuestion];

    if (showResults) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center bg-white p-12 rounded-[2.5rem] shadow-xl border border-slate-100"
            >
                <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Trophy size={48} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Quiz Complete!</h3>
                <p className="text-slate-500 mb-8">You've finished the Cyber Hygiene Challenge.</p>

                <div className="bg-slate-50 rounded-3xl p-8 mb-8">
                    <div className="text-5xl font-black text-blue-600 mb-2">{(score / questions.length) * 100}%</div>
                    <p className="text-slate-600 font-medium">You got {score} out of {questions.length} questions correct.</p>
                </div>

                <p className="text-slate-600 mb-10 leading-relaxed italic">
                    {score === questions.length
                        ? "Perfect! You're a true Cyber Sentinel."
                        : score >= 3
                            ? "Great job! You have a solid grasp of cyber hygiene."
                            : "Keep learning! Consistency is key to staying safe online."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={restartQuiz} className="btn-primary">
                        <RotateCcw size={20} /> Try Again
                    </button>
                    <a href="#detective" className="btn-secondary">
                        Next Module <ArrowRight size={20} />
                    </a>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Knowledge Check</h3>
                    <p className="text-slate-500 text-sm">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
                <button
                    onClick={handleNext}
                    className="text-blue-500 font-semibold text-sm hover:underline flex items-center gap-1"
                >
                    {currentQuestion === questions.length - 1 ? 'Finish' : 'Skip'} <ChevronRight size={16} />
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="h-2 bg-slate-100 w-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <div className="p-8 md:p-12">
                    <h4 className="text-2xl font-bold text-slate-900 mb-10">{currentQ.question}</h4>

                    <div className="space-y-4">
                        {currentQ.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                className={cn(
                                    "w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group",
                                    selectedOption === idx
                                        ? "border-blue-500 bg-blue-50 text-blue-900"
                                        : "border-slate-50 hover:border-slate-200 text-slate-600"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm",
                                        selectedOption === idx ? "border-blue-500 bg-blue-500 text-white" : "border-slate-200 text-slate-400 group-hover:border-slate-300"
                                    )}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="font-semibold">{option}</span>
                                </div>
                                {selectedOption === idx && <CheckCircle2 size={24} className="text-blue-500" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-between items-center">
                        <div className="text-slate-400 text-sm italic">You can change your mind before proceeding.</div>
                        <button
                            onClick={handleNext}
                            disabled={selectedOption === null}
                            className={cn(
                                "px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2",
                                selectedOption === null
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-blue-500 text-white shadow-soft-blue hover:bg-blue-600 active:scale-95"
                            )}
                        >
                            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
