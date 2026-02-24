'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Trophy, RotateCcw, ArrowRight, Shield, Smartphone, Globe, UserCheck, Wifi, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
}

interface QuizCategory {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    questions: Question[];
}

const quizData: QuizCategory[] = [
    {
        id: 'hygiene',
        name: 'Cyber Hygiene',
        description: 'Basics of digital safety and account protection.',
        icon: Shield,
        color: 'blue',
        questions: [
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
                id: 3,
                question: 'When should you install software updates on your devices?',
                options: [
                    'Only when the device stops working',
                    'As soon as they become available',
                    'Once every six months',
                    'Only when you have a lot of free time'
                ],
                correct: 1,
                explanation: 'Software updates often include critical security patches that fix vulnerabilities before hackers can exploit them.'
            },
            {
                id: 4,
                question: 'What is "End-to-End Encryption" (E2EE)?',
                options: [
                    'Encryption that only works at the end of the day',
                    'A system where only the communicating users can read the messages',
                    'A way to speed up your internet connection',
                    'Encryption that only applies to the end of a file'
                ],
                correct: 1,
                explanation: 'E2EE ensures that messages are encrypted on the sender device and only decrypted on the recipient device, preventing intermediaries from reading them.'
            }
        ]
    },
    {
        id: 'phishing',
        name: 'Phishing Defense',
        description: 'Learn to spot and avoid deceptive messages.',
        icon: Mail,
        color: 'amber',
        questions: [
            {
                id: 1,
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
                id: 2,
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
                id: 3,
                question: 'What is "Spear Phishing"?',
                options: [
                    'A type of fishing done with a spear',
                    'A targeted phishing attack aimed at a specific individual or organization',
                    'Phishing emails that only contain images of spears',
                    'A way to catch hackers using digital spears'
                ],
                correct: 1,
                explanation: 'Spear phishing is highly personalized and uses specific information about the target to appear more legitimate.'
            },
            {
                id: 4,
                question: 'How can you verify the true destination of a link in an email?',
                options: [
                    'By clicking it and seeing where it goes',
                    'By looking at the blue underlined text',
                    'By hovering your mouse over the link to see the URL',
                    'By checking the sender’s profile picture'
                ],
                correct: 2,
                explanation: 'Hovering over a link (on desktop) or long-pressing (on mobile) usually reveals the actual destination URL before you visit it.'
            }
        ]
    },
    {
        id: 'social',
        name: 'Social Engineering',
        description: 'Psychological manipulation and human-centric risks.',
        icon: UserCheck,
        color: 'purple',
        questions: [
            {
                id: 1,
                question: 'Someone calls claiming to be from your bank and asks for your PIN to "verify your identity." What should you do?',
                options: [
                    'Give them the PIN so they can help you',
                    'Hang up and call the official number on your bank card',
                    'Ask them for their employee ID first',
                    'Give them a fake PIN to see if they notice'
                ],
                correct: 1,
                explanation: 'Banks will NEVER ask for your PIN or full password over the phone. This is a common vishing (voice phishing) tactic.'
            },
            {
                id: 2,
                question: 'What is "Tailgating" in a physical security context?',
                options: [
                    'Driving too close to the car in front of you',
                    'Following an authorized person into a restricted area without a badge',
                    'Waiting in line for a long time',
                    'Hosting a party in a parking lot'
                ],
                correct: 1,
                explanation: 'Tailgating (or piggybacking) is a social engineering technique where an attacker gains physical access to a secure building by following a legitimate employee.'
            },
            {
                id: 3,
                question: 'What is "Quid Pro Quo" in social engineering?',
                options: [
                    'A type of legal contract',
                    'An attacker offering a service or benefit in exchange for information',
                    'A latin phrase for "security first"',
                    'A way to encrypt data using ancient methods'
                ],
                correct: 1,
                explanation: 'In quid pro quo attacks, hackers might pretend to be IT support offering to "fix" a problem if you provide your credentials.'
            }
        ]
    },
    {
        id: 'mobile',
        name: 'Mobile & IoT Safety',
        description: 'Protecting your smartphone and smart home devices.',
        icon: Smartphone,
        color: 'emerald',
        questions: [
            {
                id: 1,
                question: 'Why is it dangerous to connect to public Wi-Fi without a VPN for sensitive tasks?',
                options: [
                    'The connection is usually too slow for banking',
                    'Public Wi-Fi is expensive to use',
                    'Attackers can intercept your data traffic on unencrypted networks',
                    'Public Wi-Fi only works on mobile devices'
                ],
                correct: 2,
                explanation: 'Unencrypted networks allow others on the same network to potentially view your data traffic, known as a Man-in-the-Middle attack.'
            },
            {
                id: 2,
                question: 'What is "Sideloading" an app?',
                options: [
                    'Loading an app from the side of the screen',
                    'Installing an app from a source other than the official App Store/Play Store',
                    'Updating an app while it is running',
                    'Moving an app to an SD card'
                ],
                correct: 1,
                explanation: 'Sideloading bypasses the security checks of official stores, significantly increasing the risk of installing malware.'
            },
            {
                id: 3,
                question: 'What is the most important security step for a new Smart Home (IoT) device?',
                options: [
                    'Naming it something funny',
                    'Changing the default administrator password',
                    'Connecting it to as many devices as possible',
                    'Hiding it behind a curtain'
                ],
                correct: 1,
                explanation: 'Many IoT devices come with default passwords (like "admin") that are publicly known. Changing them is critical to prevent unauthorized access.'
            }
        ]
    }
];

export default function CyberQuiz() {
    const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>([]);

    const startCategory = (category: QuizCategory) => {
        setSelectedCategory(category);
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResults(false);
        setAnswers(new Array(category.questions.length).fill(null));
    };

    const handleOptionSelect = (index: number) => {
        if (isSubmitted) return;
        setSelectedOption(index);
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (!selectedCategory) return;
        if (currentQuestion < selectedCategory.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(answers[currentQuestion + 1]);
            setIsSubmitted(false);
        } else {
            calculateScore();
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        if (!selectedCategory) return;
        let newScore = 0;
        answers.forEach((ans, idx) => {
            if (ans === selectedCategory.questions[idx].correct) newScore += 1;
        });
        setScore(newScore);
    };

    const restartQuiz = () => {
        setSelectedCategory(null);
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setShowResults(false);
        setAnswers([]);
    };

    if (!selectedCategory) {
        return (
            <div className="max-w-4xl mx-auto py-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose a Challenge</h2>
                    <p className="text-slate-600">Select a category to test your knowledge in specific areas of cybersecurity.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizData.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => startCategory(cat)}
                            className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left hover:-translate-y-1"
                        >
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                                cat.color === 'blue' ? "bg-blue-100 text-blue-600" :
                                cat.color === 'amber' ? "bg-amber-100 text-amber-600" :
                                cat.color === 'purple' ? "bg-purple-100 text-purple-600" :
                                "bg-emerald-100 text-emerald-600"
                            )}>
                                <cat.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                            <p className="text-slate-500 text-sm mb-6">{cat.description}</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-blue-500 transition-colors">
                                Start Quiz <ChevronRight size={16} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const currentQ = selectedCategory.questions[currentQuestion];

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
                <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Category Complete!</h3>
                <p className="text-slate-500 mb-8">You've finished the {selectedCategory.name} module.</p>

                <div className="bg-slate-50 rounded-3xl p-8 mb-8">
                    <div className="text-5xl font-black text-blue-600 mb-2">{(score / selectedCategory.questions.length) * 100}%</div>
                    <p className="text-slate-600 font-medium">You got {score} out of {selectedCategory.questions.length} questions correct.</p>
                </div>

                <p className="text-slate-600 mb-10 leading-relaxed italic">
                    {score === selectedCategory.questions.length
                        ? "Perfect! You've mastered this category."
                        : score / selectedCategory.questions.length >= 0.8
                            ? "Excellent! You have a very strong grasp of these concepts."
                            : "Good effort! Consider reviewing the Learning Hub to fill in the gaps."}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => startCategory(selectedCategory)} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        <RotateCcw size={20} /> Try Again
                    </button>
                    <button onClick={restartQuiz} className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold flex items-center gap-2 justify-center hover:bg-slate-50 transition-all">
                        Change Category <ArrowRight size={20} />
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1">
                        <selectedCategory.icon size={16} />
                        {selectedCategory.name}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Knowledge Check</h3>
                    <p className="text-slate-500 text-sm">Question {currentQuestion + 1} of {selectedCategory.questions.length}</p>
                </div>
                <button
                    onClick={restartQuiz}
                    className="text-slate-400 font-semibold text-sm hover:text-red-500 transition-colors"
                >
                    Quit Quiz
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="h-2 bg-slate-100 w-full overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / selectedCategory.questions.length) * 100}%` }}
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

                    <div className="mt-12 flex flex-col md:flex-row gap-6 justify-between items-center">
                        <div className="text-slate-400 text-sm italic text-center md:text-left">You can change your mind before proceeding to the next question.</div>
                        <button
                            onClick={handleNext}
                            disabled={selectedOption === null}
                            className={cn(
                                "w-full md:w-auto px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 justify-center",
                                selectedOption === null
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-blue-500 text-white shadow-lg shadow-blue-100 hover:bg-blue-600 active:scale-95"
                            )}
                        >
                            {currentQuestion === selectedCategory.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
