'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuizQuestion {
  id: number;
  question: string;
  options: Array<{
    text: string;
    emoji: string;
    type: 'relaxed' | 'curious' | 'adventurer';
  }>;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is your ideal vacation vibe?",
    options: [
      { text: 'Comfortable and curated experiences', emoji: '☕', type: 'relaxed' },
      { text: 'Learning about local culture and traditions', emoji: '📚', type: 'curious' },
      { text: 'Adrenaline and outdoor challenges', emoji: '⛰️', type: 'adventurer' },
    ],
  },
  {
    id: 2,
    question: 'How do you feel about extreme cold (-40°C)?',
    options: [
      { text: 'Need assurance I will be warm and comfortable', emoji: '🧥', type: 'relaxed' },
      { text: 'Curious to experience it, want to understand it', emoji: '🤔', type: 'curious' },
      { text: 'Bring it on! Part of the adventure', emoji: '💪', type: 'adventurer' },
    ],
  },
  {
    id: 3,
    question: 'Your dream aurora viewing experience:',
    options: [
      { text: 'Heated cabin with gourmet meal included', emoji: '🏠', type: 'relaxed' },
      { text: 'Indigenous guide explaining the cultural significance', emoji: '🌟', type: 'curious' },
      { text: 'Snowshoeing to a remote location', emoji: '🥾', type: 'adventurer' },
    ],
  },
  {
    id: 4,
    question: 'How do you prefer to plan activities?',
    options: [
      { text: 'All-inclusive package, everything arranged', emoji: '📦', type: 'relaxed' },
      { text: 'Mix of planned and spontaneous, meet locals', emoji: '🗺️', type: 'curious' },
      { text: 'Pack as much as possible, maximize experiences', emoji: '⚡', type: 'adventurer' },
    ],
  },
  {
    id: 5,
    question: 'Your accommodation preference:',
    options: [
      { text: 'Upscale hotel with all amenities', emoji: '🏨', type: 'relaxed' },
      { text: 'Local B&B to experience authentic hospitality', emoji: '🏡', type: 'curious' },
      { text: 'Whatever is practical, I will be outside anyway', emoji: '⛺', type: 'adventurer' },
    ],
  },
  {
    id: 6,
    question: 'When things do not go as planned:',
    options: [
      { text: 'I appreciate having backup indoor options', emoji: '🛡️', type: 'relaxed' },
      { text: 'Opportunity to discover something unexpected', emoji: '🎲', type: 'curious' },
      { text: 'Improvise and make it part of the adventure', emoji: '🚀', type: 'adventurer' },
    ],
  },
  {
    id: 7,
    question: 'Your typical travel group:',
    options: [
      { text: 'Partner or small group of friends', emoji: '👫', type: 'relaxed' },
      { text: 'Open to meeting other travelers', emoji: '👥', type: 'curious' },
      { text: 'Solo or with fellow adventurers', emoji: '🧗', type: 'adventurer' },
    ],
  },
  {
    id: 8,
    question: 'What matters most to you?',
    options: [
      { text: 'Comfort, quality, and peace of mind', emoji: '😌', type: 'relaxed' },
      { text: 'Authentic experiences and cultural respect', emoji: '🙏', type: 'curious' },
      { text: 'Unique challenges and epic stories', emoji: '📖', type: 'adventurer' },
    ],
  },
];

const travelerProfiles = {
  relaxed: {
    title: 'The Relaxed Traveler',
    emoji: '☕',
    description: 'You value comfort and quality experiences without the stress of planning every detail.',
    color: 'aurora-blue',
    recommendations: [
      'All-inclusive aurora viewing packages',
      'Upscale accommodations with full amenities',
      'Guided tours with experienced operators',
      'Indoor cultural experiences as backups',
    ],
  },
  curious: {
    title: 'The Curious Explorer',
    emoji: '🌍',
    description: 'You seek authentic cultural experiences and want to understand the deeper meaning of what you encounter.',
    color: 'aurora-purple',
    recommendations: [
      'Indigenous cultural experiences',
      'Local guide-led tours',
      'Community-based accommodations',
      'Educational workshops and demonstrations',
    ],
  },
  adventurer: {
    title: 'The Extreme Adventurer',
    emoji: '⛰️',
    description: 'You crave unique outdoor challenges and are not afraid of extreme conditions or physical demands.',
    color: 'aurora-green',
    recommendations: [
      'Multi-day wilderness expeditions',
      'Dog sledding and snowmobiling',
      'Ice fishing and backcountry skiing',
      'Aurora hunting in remote locations',
    ],
  },
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (type: string) => {
    const newAnswers = { ...answers, [currentQuestion]: type };
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 300);
    }
  };

  const calculateResult = (): 'relaxed' | 'curious' | 'adventurer' => {
    const counts = { relaxed: 0, curious: 0, adventurer: 0 };
    Object.values(answers).forEach((answer) => {
      counts[answer as keyof typeof counts]++;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as 'relaxed' | 'curious' | 'adventurer';
  };

  const result = showResults ? calculateResult() : null;
  const profile = result ? travelerProfiles[result] : null;

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-gray-400 hover:text-aurora-green transition inline-flex items-center gap-2 mb-8">
            ← YK Buddy
          </Link>

          <div className="max-w-3xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-12">
              <div className="text-8xl mb-6 animate-bounce">{profile.emoji}</div>
              <h1 className="text-5xl font-bold text-white mb-4">
                You are {profile.title}!
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {profile.description}
              </p>
            </div>

            {/* Recommendations Card */}
            <div className={`bg-gradient-to-br from-${profile.color}/20 to-${profile.color}/5 backdrop-blur-sm p-8 rounded-2xl border border-${profile.color}/30 mb-8`}>
              <h2 className="text-2xl font-bold text-white mb-6">
                Perfect Activities for You
              </h2>
              <ul className="space-y-4">
                {profile.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className={`text-${profile.color} text-xl flex-shrink-0`}>✓</span>
                    <span className="text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/activities"
                className="px-8 py-4 bg-aurora-gradient text-white text-lg font-semibold rounded-xl hover:shadow-aurora transform hover:scale-105 transition-all text-center"
              >
                Explore Recommended Activities →
              </Link>
              <Link
                href="/calculator"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-xl border-2 border-white/20 hover:bg-white/20 transition text-center"
              >
                Calculate Trip Cost
              </Link>
            </div>

            {/* Retake Quiz */}
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                }}
                className="text-gray-400 hover:text-aurora-green transition"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-gray-400 hover:text-aurora-green transition inline-flex items-center gap-2 mb-8">
          ← YK Buddy
        </Link>

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Discover Your Travel Style
            </h1>
            <p className="text-xl text-gray-300">
              Answer 8 quick questions to get personalized recommendations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-aurora-gradient transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-lg p-8 md:p-12 rounded-2xl border border-white/20 mb-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {quizQuestions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.type)}
                  className="w-full p-6 bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-aurora-green/50 rounded-xl transition-all transform hover:scale-105 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{option.emoji}</span>
                    <span className="text-lg text-gray-200 group-hover:text-white transition">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {currentQuestion > 0 && (
            <div className="text-center">
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="text-gray-400 hover:text-aurora-green transition"
              >
                ← Previous Question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
