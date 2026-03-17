import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  "How have you been feeling overall in the past week?",
  "How often do you feel overwhelmed by your studies?",
  "How would you rate the quality of your sleep recently?",
  "Do you feel you have a good support system (friends/family)?",
  "How often do you take time for hobbies or relaxation?",
  "Do you find it difficult to concentrate on your coursework?",
  "How often do you feel anxious about upcoming exams or deadlines?",
  "Have you experienced any changes in your appetite?",
  "How motivated do you feel to attend classes and complete assignments?",
  "Do you feel comfortable asking for help when you need it?",
  "How often do you compare yourself to your peers academically?",
  "Do you feel hopeful about your future career prospects?",
  "How often do you exercise or engage in physical activity?",
  "Have you been experiencing any physical symptoms of stress (e.g., headaches, stomachaches)?",
  "Do you feel you have a healthy work-life balance?",
  "How often do you feel lonely or isolated on campus?",
  "Do you feel confident in your ability to succeed in your program?",
  "How often do you experience negative or intrusive thoughts?",
  "Do you feel that you have sufficient time to manage all your responsibilities?",
  "Overall, how satisfied are you with your college experience?"
];

const OPTIONS = [
  { value: 1, label: 'Never', emoji: '🟢' },
  { value: 2, label: 'Rarely', emoji: '🔵' },
  { value: 3, label: 'Sometimes', emoji: '🟡' },
  { value: 4, label: 'Often', emoji: '🟠' },
  { value: 5, label: 'Always', emoji: '🔴' }
];

const MoodTracker = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState(new Array(20).fill(null));
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setIsCompleted(true), 500);
    }
  };

  const calculateMood = () => {
    const totalScore = answers.reduce((a, b) => a + (b || 0), 0);
    // Rough calculation: higher score = more stressed
    if (totalScore < 40) return { title: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '🌟', msg: 'You seem to be in a great headspace! Keep up the good habits.' };
    if (totalScore < 60) return { title: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', icon: '😊', msg: 'You are doing fine, but remember to take breaks when needed.' };
    if (totalScore < 80) return { title: 'Stressed', color: 'text-amber-600', bg: 'bg-amber-50', icon: '😟', msg: 'You appear to be experiencing some stress. Consider talking to a mentor or using our AI guide.' };
    return { title: 'High Alert', color: 'text-red-600', bg: 'bg-red-50', icon: '🆘', msg: 'Your responses indicate high stress or burnout. Please connect with our counselors immediately.' };
  };

  if (isCompleted) {
    const result = calculateMood();
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto">
        <div className={`w-20 h-20 rounded-full ${result.bg} ${result.color} flex items-center justify-center text-4xl mx-auto mb-6`}>
          {result.icon}
        </div>
        <h2 className={`text-3xl font-bold mb-4 ${result.color}`}>Mood: {result.title}</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">{result.msg}</p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => { setAnswers(new Array(20).fill(null)); setCurrentStep(0); setIsCompleted(false); }}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Retake Check-in
          </button>
          {result.title === 'Stressed' || result.title === 'High Alert' ? (
            <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors">
              Talk to Someone Live
            </button>
          ) : null}
        </div>
      </motion.div>
    );
  }

  const progress = ((currentStep) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-8 flex justify-between items-center text-sm font-medium text-gray-400 mt-2">
          <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[200px] flex flex-col justify-center"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-10 text-center leading-snug">
              {QUESTIONS[currentStep]}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    answers[currentStep] === opt.value
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl mb-2">{opt.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
