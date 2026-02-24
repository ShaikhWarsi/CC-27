'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import ModuleLayout from '@/components/ModuleLayout';
import CyberQuiz from '@/components/CyberQuiz';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import { BookOpen, Award, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "Why do I need to score 80% to pass?",
    answer: "In cybersecurity, close isn't good enough. A single mistake can lead to a security breach. We set the bar high to ensure you've truly mastered the concepts."
  },
  {
    question: "What happens if I fail the quiz?",
    answer: "Nothing bad! You can retake the quiz as many times as you need. We recommend reviewing the Learning Hub before your next attempt."
  },
  {
    question: "Are these badges real certificates?",
    answer: "They are digital achievements within SafeSurf to track your progress. While not official industry certifications, they represent real knowledge you've gained."
  },
  {
    question: "How can I improve my score?",
    answer: "Pay close attention to the explanations provided after each question. Most questions are based on real-world phishing tactics covered in our Phishing Guide."
  }
];

export default function QuizPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 relative">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-6 shadow-sm">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Cyber Safety Knowledge Check</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Validate your security expertise, earn badges, and prove you have what it takes to stay safe online.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Passing Grade</p>
              <p className="font-bold text-slate-900 text-lg">80% Required</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Mastery Badge</p>
              <p className="font-bold text-slate-900 text-lg">"Security Scholar"</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Support</p>
              <p className="font-bold text-slate-900 text-lg">24/7 AI Assistant</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden mb-12">
              <ModuleLayout
                id="quiz"
                title="Interactive Assessment"
                description="This quiz covers password security, link analysis, and common phishing tactics. Good luck!"
                icon={BookOpen}
                variant="blue"
              >
                <CyberQuiz />
              </ModuleLayout>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="text-blue-500" size={28} />
                <h2 className="text-2xl font-bold text-slate-900">Common Doubts</h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <button 
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between text-left py-2 hover:text-blue-600 transition-colors"
                    >
                      <span className="font-bold text-slate-800">{faq.question}</span>
                      {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="py-3 text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-lg shadow-blue-200">
              <h3 className="text-xl font-bold mb-4">Quiz Tips</h3>
              <ul className="space-y-4 text-blue-100 text-sm">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                  Read every option carefully before choosing.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                  Remember the "Link Detective" hover rule.
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                  Don't rush; accuracy is more important than speed.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
              <h3 className="text-xl font-bold mb-4">Stuck?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                If you have a specific question about cybersecurity or need clarification on a quiz topic, use our AI Assistant.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Assistant is Online
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 p-12 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Want to review first?</h3>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto">If you're not feeling confident yet, head back to our Learning Hub to refresh your memory on the core concepts of digital safety.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/learn" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200">
              Back to Learning Hub
            </a>
            <a href="/tools" className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
              Practice with Tools
            </a>
          </div>
        </div>
      </div>

      <Chatbot />
      <Footer />
    </main>
  );
}
