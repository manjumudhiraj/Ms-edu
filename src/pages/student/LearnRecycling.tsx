import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, SectionCard } from '@/components/ui';
import { BookOpen, CheckCircle, XCircle, ChevronDown, ChevronUp, Award, Recycle } from 'lucide-react';
import { recyclingArticles, recyclingQuizzes, recyclingFlowSteps } from '@/data/recyclingData';

export default function LearnRecycling() {
  const { user } = useAuth();
  const { data } = useStore();
  const sid = user?.studentId || 'STU005';

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const currentQuiz = recyclingQuizzes[quizIdx];

  const handleAnswer = (idx: number) => {
    if (showResult) return;
    setSelectedAnswer(idx);
    setShowResult(true);
    if (idx === currentQuiz.correctAnswer && !answered.has(quizIdx)) {
      setQuizScore(quizScore + currentQuiz.points);
      setAnswered(new Set(answered).add(quizIdx));
      updateStore((d) => {
        d.studentEcoPoints[sid] = (d.studentEcoPoints[sid] || 0) + currentQuiz.points;
        d.notifications.unshift({
          id: `NQ${Date.now()}`,
          title: 'Quiz Points Earned!',
          message: `You earned ${currentQuiz.points} Eco Points for answering correctly.`,
          date: new Date().toISOString().split('T')[0],
          type: 'eco-points',
          read: false,
          forRole: 'student',
          studentId: sid,
        });
      });
    }
  };

  const nextQuiz = () => {
    if (quizIdx < recyclingQuizzes.length - 1) {
      setQuizIdx(quizIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const prevQuiz = () => {
    if (quizIdx > 0) {
      setQuizIdx(quizIdx - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Learn Recycling" subtitle="Educational resources about waste management and recycling" />

      {/* Recycling process flow */}
      <SectionCard title="The Recycling Process" subtitle="From used plastic to new products" className="mb-4">
        <div className="flex items-center justify-between flex-wrap gap-1">
          {recyclingFlowSteps.map((step, i) => (
            <div key={step.step} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1 w-16">
                <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center text-xl`}>
                  {step.icon}
                </div>
                <span className="text-[9px] text-center text-gray-600 font-medium leading-tight">{step.title}</span>
              </div>
              {i < recyclingFlowSteps.length - 1 && (
                <div className="text-gray-300 text-lg hidden md:block">→</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 bg-green-50 rounded-xl p-3">
          <p className="text-xs text-edu-green">
            Collected plastic can contribute to recycled-material products such as sustainable classroom furniture.
          </p>
        </div>
      </SectionCard>

      {/* Educational cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {recyclingArticles.map((article) => (
          <div key={article.id} className="card p-4">
            <button
              onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
              className="w-full text-left"
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl ${article.color} flex items-center justify-center text-xl shrink-0`}>
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-navy-800">{article.title}</h3>
                    {expandedId === article.id ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{article.readTime} read</p>
                </div>
              </div>
            </button>
            {expandedId === article.id && (
              <p className="text-sm text-gray-600 leading-relaxed mt-3 animate-fade-in">{article.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* Quiz section */}
      <SectionCard title="Recycling Quiz" subtitle={`Question ${quizIdx + 1} of ${recyclingQuizzes.length} · Score: ${quizScore} pts`} className="mb-4">
        <div className="bg-gray-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-edu-blue" />
            <span className="text-xs font-medium text-edu-blue">Quiz Question</span>
          </div>
          <p className="text-base font-semibold text-navy-800 mb-4">{currentQuiz.question}</p>
          <div className="space-y-2">
            {currentQuiz.options.map((opt, idx) => {
              const isCorrect = idx === currentQuiz.correctAnswer;
              const isSelected = idx === selectedAnswer;
              let style = 'bg-white border-gray-200 hover:border-gray-300 text-navy-700';
              if (showResult && isCorrect) style = 'bg-green-50 border-green-300 text-edu-green';
              else if (showResult && isSelected && !isCorrect) style = 'bg-red-50 border-red-300 text-edu-red';
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all text-sm font-medium ${style}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showResult && isCorrect && <CheckCircle className="w-4 h-4" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-4 animate-fade-in">
              <div className={`rounded-xl p-3 ${selectedAnswer === currentQuiz.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-xs font-medium text-navy-700">{currentQuiz.explanation}</p>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-400">
                  {selectedAnswer === currentQuiz.correctAnswer ? `+${currentQuiz.points} points earned!` : 'No points awarded. Try the next question!'}
                </p>
                <div className="flex gap-2">
                  {quizIdx > 0 && <button onClick={prevQuiz} className="btn-secondary text-xs px-3 py-2">Previous</button>}
                  {quizIdx < recyclingQuizzes.length - 1 && <button onClick={nextQuiz} className="btn-primary text-xs px-3 py-2">Next Question</button>}
                </div>
              </div>
            </div>
          )}
        </div>

        {quizIdx === recyclingQuizzes.length - 1 && showResult && (
          <div className="mt-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 text-center">
            <Award className="w-8 h-8 text-edu-amber mx-auto mb-2" />
            <p className="text-sm font-semibold text-navy-800">Quiz Complete!</p>
            <p className="text-xs text-gray-500 mt-1">Total quiz points earned: {quizScore}</p>
          </div>
        )}
      </SectionCard>

      {/* Sustainability message */}
      <div className="card p-5 bg-gradient-to-br from-green-50 to-cyan-50 border-green-100">
        <div className="flex items-center gap-3">
          <Recycle className="w-8 h-8 text-edu-green shrink-0" />
          <div>
            <p className="text-sm font-semibold text-navy-800">Ms.Edu turns students from passive learners into active participants in recycling.</p>
            <p className="text-xs text-gray-500 mt-1">You don't just learn "what is recyclable" — you identify, collect, submit, recycle, and earn points.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
