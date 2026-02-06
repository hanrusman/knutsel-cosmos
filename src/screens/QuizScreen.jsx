import React, { useState, useEffect } from 'react';
import Workbench from '../components/layout/Workbench';
import CardboardButton from '../components/ui/CardboardButton';
import useGameStore from '../store/gameStore';
import { QuestionService } from '../services/QuestionService';
import { motion, AnimatePresence } from 'framer-motion';

const QuizScreen = ({ levelId, onBack, onComplete }) => {
    const { addGears, addCoins, unlockLevel } = useGameStore();

    // State
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Stats Tracking
    const [correctCount, setCorrectCount] = useState(0);
    const [hasRetried, setHasRetried] = useState(false); // Track if current question was retried

    // Load questions on mount based on Level ID (simulating tag matching)
    useEffect(() => {
        const loadQuizData = async () => {
            setLoading(true);
            // For prototype, map level ID to tag. 
            // Level 1 -> 'level1', Level 2 -> 'level2', etc. Fallback to all 'space' if no specific match
            let tag = `level${levelId}`;

            // Limit to 10 questions per round
            let loaded = await QuestionService.getQuestionsByTag(tag, 10);

            if (loaded.length === 0) {
                // Fallback: Just load ANY question with 'space' tag if specific level questions missing
                loaded = await QuestionService.getQuestionsByTag('space', 10);
            }

            // Validate data structure
            if (loaded && loaded.length > 0) {
                setQuestions(loaded);
                setCurrentQuestion(loaded[0]);
            }
            setLoading(false);
        };

        loadQuizData();
    }, [levelId]);

    const handleAnswer = async (answer) => {
        setAnswered(true);

        const isAnsCorrect = answer.isCorrect;

        // Record Attempt in Background
        QuestionService.recordAttempt(currentQuestion.id, isAnsCorrect);

        if (isAnsCorrect) {
            setIsCorrect(true);
            if (!hasRetried) {
                setCorrectCount(prev => prev + 1);
            }
        } else {
            setIsCorrect(false);
            setHasRetried(true);
        }
    };

    const handleNext = () => {
        if (isCorrect) {
            // Did we finish the quiz?
            if (currentIndex < questions.length - 1) {
                // Go to next question
                setAnswered(false);
                setIsCorrect(false);
                setHasRetried(false); // Reset retry flag for new question
                const nextIdx = currentIndex + 1;
                setCurrentIndex(nextIdx);
                setCurrentQuestion(questions[nextIdx]);
            } else {
                // FINISHED QUIZ
                setQuizCompleted(true);
                setShowReward(true);

                // Calculate Rewards: Coins = Correct Answers on First Try
                const rewardAmount = Math.max(correctCount, 1); // Minimum 1 coin

                setTimeout(() => {
                    addGears(1); // Standard gear reward
                    addCoins(rewardAmount);
                    unlockLevel(levelId + 1);
                }, 500);
            }
        } else {
            // Retry current question (reset state UI only, logic tracks retry)
            setAnswered(false);
            setIsCorrect(false);
        }
    };

    if (loading) return (
        <Workbench>
            <div className="text-2xl font-bold font-hand animate-pulse">Vragen laden...</div>
        </Workbench>
    );

    if (!currentQuestion) return (
        <Workbench>
            <div className="text-2xl font-bold mb-4">Er zijn nog geen vragen voor dit level!</div>
            <div className="text-lg mb-8 italic text-gray-600">Voeg ze toe in het Admin scherm.</div>
            <CardboardButton onClick={onBack}>Terug</CardboardButton>
        </Workbench>
    );

    return (
        <Workbench>
            <div className="absolute top-4 left-4 z-50">
                <CardboardButton onClick={onBack} className="!px-4 !py-2 !text-lg">
                    ← TERUG
                </CardboardButton>
            </div>

            {!quizCompleted ? (
                <div className="flex flex-col items-center justify-between h-full w-full py-4 gap-4">

                    {/* Progress Indicator */}
                    <div className="absolute top-4 right-4 bg-paper border border-gray-400 px-3 py-1 font-bold rotate-2">
                        Vraag {currentIndex + 1} / {questions.length}
                    </div>

                    {/* Question Header */}
                    <div className="bg-paper p-6 rotate-1 shadow-md border border-gray-300 max-w-2xl text-center">
                        <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                            {currentQuestion.question}
                        </h2>
                    </div>

                    {/* Answers Grid */}
                    <div className="flex gap-8 items-center justify-center w-full flex-1">
                        {currentQuestion.answers.map((answer, idx) => (
                            <motion.div
                                key={idx}
                                className="relative group cursor-pointer"
                                whileHover={!answered ? { scale: 1.05, rotate: Math.random() * 4 - 2 } : {}}
                                onClick={() => !answered && handleAnswer(answer)}
                            >
                                {/* Polaroid Frame */}
                                <div className="bg-white p-4 pb-12 shadow-cardboard border border-gray-200 rotate-1 transition-transform group-hover:rotate-0 w-64 aspect-square flex flex-col">
                                    <div className="flex-1 w-full bg-gray-200 inner-shadow flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: answer.color || '#e5e7eb' }}>
                                        {answer.image ? (
                                            <img src={answer.image} alt={answer.label} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-4xl">📷</div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-2 left-0 w-full text-center font-bold text-xl text-gray-700 uppercase">
                                        {answer.label}
                                    </div>
                                </div>

                                {/* Status Overlay */}
                                {answered && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 flex items-center justify-center z-10"
                                    >
                                        {answer.isCorrect ? (
                                            <div className="bg-green-500 text-white rounded-full p-4 border-4 border-white shadow-xl text-4xl">✓</div>
                                        ) : (
                                            <div className="bg-red-500/80 text-white rounded-full p-4 border-4 border-white shadow-xl text-4xl">✗</div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Feedback / Next */}
                    <div className="h-24 flex items-center justify-center">
                        {answered && isCorrect && (
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                <CardboardButton onClick={handleNext} className="bg-green-100 !border-green-800 !text-green-900">
                                    VOLGENDE →
                                </CardboardButton>
                            </motion.div>
                        )}
                        {answered && !isCorrect && (
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                <div className="text-2xl text-red-800 font-bold bg-white p-4 shadow-lg rotate-2 border-2 border-red-800 cursor-pointer" onClick={() => setAnswered(false)}>
                                    Oeps! Probeer het nog eens. (Klik hier)
                                </div>
                            </motion.div>
                        )}
                    </div>

                </div>
            ) : (
                /* Quiz Completed View */
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    <h1 className="text-6xl font-bold bg-white px-8 py-4 rotate-minus-2 shadow-lg border-4 border-yellow-500 text-yellow-600">
                        GEWONNEN!
                    </h1>
                    <div className="text-2xl font-bold bg-paper px-6 py-2 rotate-1">
                        Je hebt {correctCount} muntjes verdiend! ({correctCount}/{questions.length} goed)
                    </div>
                    <CardboardButton onClick={onComplete} className="text-2xl">
                        TERUG NAAR DE KAART
                    </CardboardButton>
                </div>
            )}

            {/* Reward Animation */}
            <AnimatePresence>
                {showReward && <FlyingGear />}
            </AnimatePresence>

        </Workbench>
    );
};

// Isolated Gear Animation Component
const FlyingGear = () => {
    return (
        <motion.div
            className="fixed top-1/2 left-1/2 z-[100] pointer-events-none text-6xl"
            initial={{ scale: 0, x: '-50%', y: '-50%' }}
            animate={{
                scale: [1, 1.5, 0.5],
                rotate: 720,
                top: '5%',
                left: '90%',
                opacity: [1, 1, 0]
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
            ⚙️
        </motion.div>
    )
}

export default QuizScreen;
