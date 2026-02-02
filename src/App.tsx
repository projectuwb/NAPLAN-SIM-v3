import { useState, useEffect } from 'react';
import type { Question, TestMode, TestResult, TestState } from '@/types';
import { generateTest } from '@/lib/questions';
import { formatTime, saveToStorage, loadFromStorage, removeFromStorage, calculateScore, getGrade, getFeedback, validateNumericAnswer } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Timer, Calculator, BookOpen, ChevronLeft, ChevronRight, Check, X, RotateCcw, Home, Trophy, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Import diagram components
import { 
  Protractor, 
  MeasuringJug, 
  View3D, 
  MapDiagram, 
  ShapeDiagram, 
  RotationShape,
  BarGraph,
  Clock,
  NumberLine,
  Spinner,
} from '@/components/diagrams';

type AppView = 'home' | 'test' | 'review' | 'results';

const TEST_DURATION = 40 * 60; // 40 minutes in seconds
const STORAGE_KEY = 'naplan-test-state';
const RESULTS_KEY = 'naplan-test-results';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [testMode, setTestMode] = useState<TestMode>('non-calculator');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numericInput, setNumericInput] = useState('');

  // Load saved test state on mount
  useEffect(() => {
    const savedState = loadFromStorage<TestState | null>(STORAGE_KEY, null);
    if (savedState && !savedState.isComplete) {
      // Restore test state
      setTestMode(savedState.mode);
      setQuestions(savedState.questions);
      setCurrentIndex(savedState.currentQuestionIndex);
      setTimeRemaining(savedState.timeRemaining);
      const savedAnswers: Record<string, string | number> = {};
      savedState.questions.forEach(q => {
        if (q.userAnswer !== undefined) {
          savedAnswers[q.id] = q.userAnswer;
        }
      });
      setAnswers(savedAnswers);
      setView('test');
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (view !== 'test' || isTestComplete) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, isTestComplete]);

  // Save test state
  useEffect(() => {
    if (view === 'test' && questions.length > 0) {
      const state: TestState = {
        mode: testMode,
        questions: questions.map(q => ({ ...q, userAnswer: answers[q.id] })),
        currentQuestionIndex: currentIndex,
        timeRemaining,
        isComplete: isTestComplete,
        startTime: Date.now(),
      };
      saveToStorage(STORAGE_KEY, state);
    }
  }, [view, questions, answers, currentIndex, timeRemaining, isTestComplete, testMode]);

  const startTest = (mode: TestMode) => {
    setError(null);
    try {
      const generatedQuestions = generateTest(mode, 32);
      if (generatedQuestions.length === 0) {
        setError('Failed to generate questions. Please try again.');
        return;
      }
      setTestMode(mode);
      setQuestions(generatedQuestions);
      setCurrentIndex(0);
      setTimeRemaining(TEST_DURATION);
      setAnswers({});
      setIsTestComplete(false);
      setNumericInput('');
      setView('test');
      removeFromStorage(STORAGE_KEY);
    } catch (err) {
      setError('An error occurred while starting the test.');
      console.error(err);
    }
  };

  const completeTest = () => {
    setIsTestComplete(true);
    
    // Calculate results
    const questionResults = questions.map(q => {
      const userAnswer = answers[q.id];
      let correct = false;
      
      if (q.answerFormat === 'multiple-choice') {
        correct = userAnswer === q.correctAnswer;
      } else {
        correct = typeof userAnswer === 'string' 
          ? validateNumericAnswer(userAnswer, q.correctAnswer as number)
          : userAnswer === q.correctAnswer;
      }
      
      return {
        questionId: q.id,
        questionType: q.type,
        correct,
        userAnswer,
        correctAnswer: q.correctAnswer,
      };
    });
    
    const correctCount = questionResults.filter(r => r.correct).length;
    const result: TestResult = {
      mode: testMode,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: calculateScore(correctCount, questions.length),
      timeTaken: TEST_DURATION - timeRemaining,
      questionResults,
      completedAt: new Date().toISOString(),
    };
    
    setTestResult(result);
    
    // Save to history
    const history = loadFromStorage<TestResult[]>(RESULTS_KEY, []);
    history.push(result);
    saveToStorage(RESULTS_KEY, history.slice(-10)); // Keep last 10 results
    
    removeFromStorage(STORAGE_KEY);
    setView('results');
  };

  const handleAnswer = (answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: answer }));
  };

  const handleNumericSubmit = () => {
    if (numericInput.trim()) {
      handleAnswer(numericInput.trim());
      setNumericInput('');
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      const q = questions[index];
      setNumericInput(typeof answers[q.id] === 'string' ? (answers[q.id] as string) : '');
    }
  };

  const renderDiagram = (question: Question) => {
    if (!question.diagram) return null;
    
    const { type, data } = question.diagram;
    
    switch (type) {
      case 'protractor':
        return <Protractor angle={(data as { angle: number }).angle} size={180} />;
      case 'measuring-jug':
        return (
          <MeasuringJug 
            capacity={(data as { capacity: number }).capacity}
            currentLevel={(data as { currentLevel: number }).currentLevel}
            unit={(data as { unit: 'mL' | 'L' }).unit}
            size={140}
          />
        );
      case '3d-view':
        return (
          <View3D 
            view={(data as { view: 'top' | 'front' | 'side' }).view}
            blocks={(data as { blocks: number[][] }).blocks}
            size={140}
          />
        );
      case 'map':
        return (
          <MapDiagram 
            towns={(data as { towns: { name: string; x: number; y: number }[] }).towns}
            highlightedTowns={(data as { highlightedTowns?: string[] }).highlightedTowns}
            size={220}
          />
        );
      case 'shape':
        return (
          <ShapeDiagram 
            type={(data as { type: 'rectangle' | 'triangle' | 'L-shape' | 'compound' | 'polygon' }).type}
            dimensions={(data as { dimensions: Record<string, number> }).dimensions}
            size={160}
          />
        );
      case 'rotation':
        return (
          <RotationShape 
            shape={(data as { shape: 'L' | 'T' | 'cross' | 'arrow' | 'zigzag' }).shape}
            rotation={(data as { rotation: 0 | 90 | 180 | 270 }).rotation}
            direction={(data as { direction?: 'clockwise' | 'anticlockwise' }).direction}
            size={140}
          />
        );
      case 'bar-graph':
        return (
          <BarGraph 
            data={(data as { data: { label: string; value: number }[] }).data}
            title={(data as { title?: string }).title}
            yAxisLabel={(data as { yAxisLabel?: string }).yAxisLabel}
            size={{ width: 280, height: 180 }}
          />
        );
      case 'clock':
        return (
          <Clock 
            hours={(data as { hours: number }).hours}
            minutes={(data as { minutes: number }).minutes}
            size={130}
          />
        );
      case 'number-line':
        return (
          <NumberLine 
            min={(data as { min: number }).min}
            max={(data as { max: number }).max}
            markedPosition={(data as { markedPosition?: number }).markedPosition}
            size={260}
          />
        );
      case 'spinner':
        return (
          <Spinner 
            sections={(data as { sections: number[] }).sections}
            highlightNumber={(data as { highlightNumber?: number }).highlightNumber}
            size={130}
          />
        );
      default:
        return null;
    }
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            NAPLAN Year 7 Numeracy
          </h1>
          <p className="text-slate-600">Practice Test Generator</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('non-calculator')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Non-Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              <p className="text-sm text-slate-500">
                Test your mental math skills with questions on number, algebra, measurement, and geometry.
              </p>
              <Button className="mt-4 w-full">Start Test</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('calculator')}>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Calculator Allowed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              <p className="text-sm text-slate-500">
                Use your calculator for more complex problems including statistics and probability.
              </p>
              <Button className="mt-4 w-full">Start Test</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            This is a practice tool. Actual NAPLAN tests may differ in format and content.
          </p>
        </div>
      </div>
    </div>
  );

  const renderTest = () => {
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return null;

    const isAnswered = answers[currentQuestion.id] !== undefined;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => setView('home')}>
                  <Home className="w-4 h-4" />
                </Button>
                <span className="font-medium text-slate-700">
                  {testMode === 'non-calculator' ? 'Non-Calculator' : 'Calculator'} Test
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 font-mono text-lg font-bold ${
                  timeRemaining < 300 ? 'text-red-600' : 'text-slate-700'
                }`}>
                  <Timer className="w-5 h-5" />
                  {formatTime(timeRemaining)}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-sm text-slate-500 mb-1">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{answeredCount} answered</span>
              </div>
              <Progress value={(answeredCount / questions.length) * 100} className="h-2" />
            </div>
          </div>
        </header>

        {/* Question */}
        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                  {currentQuestion.category.replace('-', ' & ')}
                </span>
              </div>
              
              <p className="text-lg mb-6 whitespace-pre-line">{currentQuestion.questionText}</p>
              
              {currentQuestion.diagram && (
                <div className="flex justify-center mb-6 p-4 bg-slate-50 rounded-lg">
                  {renderDiagram(currentQuestion)}
                </div>
              )}

              {currentQuestion.answerFormat === 'multiple-choice' ? (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, i) => {
                    const isSelected = answers[currentQuestion.id] === option.charAt(0);
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(option.charAt(0))}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="font-medium">{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter your answer"
                      value={numericInput}
                      onChange={(e) => setNumericInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNumericSubmit()}
                      className="flex-1"
                    />
                    <Button onClick={handleNumericSubmit}>Submit</Button>
                  </div>
                  {isAnswered && (
                    <p className="text-sm text-green-600">
                      Answer saved: {answers[currentQuestion.id]}
                    </p>
                  )}
                  
                  {/* Virtual Numpad for mobile */}
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {['7', '8', '9', '/'].map(key => (
                      <button
                        key={key}
                        onClick={() => setNumericInput(prev => prev + key)}
                        className="p-3 bg-slate-100 rounded-lg text-center font-medium hover:bg-slate-200"
                      >
                        {key}
                      </button>
                    ))}
                    {['4', '5', '6', '.'].map(key => (
                      <button
                        key={key}
                        onClick={() => setNumericInput(prev => prev + key)}
                        className="p-3 bg-slate-100 rounded-lg text-center font-medium hover:bg-slate-200"
                      >
                        {key}
                      </button>
                    ))}
                    {['1', '2', '3', '-'].map(key => (
                      <button
                        key={key}
                        onClick={() => setNumericInput(prev => prev + key)}
                        className="p-3 bg-slate-100 rounded-lg text-center font-medium hover:bg-slate-200"
                      >
                        {key}
                      </button>
                    ))}
                    {['0', 'space', '⌫', 'C'].map(key => (
                      <button
                        key={key}
                        onClick={() => {
                          if (key === 'space') setNumericInput(prev => prev + ' ');
                          else if (key === '⌫') setNumericInput(prev => prev.slice(0, -1));
                          else if (key === 'C') setNumericInput('');
                          else setNumericInput(prev => prev + key);
                        }}
                        className="p-3 bg-slate-100 rounded-lg text-center font-medium hover:bg-slate-200"
                      >
                        {key === 'space' ? '␣' : key}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentIndex === questions.length - 1 ? (
                <Button onClick={completeTest} variant="default">
                  Finish Test
                </Button>
              ) : (
                <Button onClick={() => goToQuestion(currentIndex + 1)}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="mt-6">
            <p className="text-sm text-slate-500 mb-2">Jump to question:</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(i)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                      isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : isAnswered 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderResults = () => {
    if (!testResult) return null;

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Test Complete!</h1>
            <p className="text-slate-600">{getFeedback(testResult.score)}</p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{testResult.score}%</p>
                  <p className="text-sm text-slate-500">Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{testResult.correctAnswers}/{testResult.totalQuestions}</p>
                  <p className="text-sm text-slate-500">Correct</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{getGrade(testResult.score)}</p>
                  <p className="text-sm text-slate-500">Grade</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{formatTime(testResult.timeTaken)}</p>
                  <p className="text-sm text-slate-500">Time Taken</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center mb-8">
            <Button onClick={() => setView('review')} variant="outline">
              Review Answers
            </Button>
            <Button onClick={() => startTest(testMode)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => setView('home')} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    if (!testResult) return null;

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Review Answers</h1>
            <Button onClick={() => setView('results')} variant="outline">
              Back to Results
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((q, i) => {
              const result = testResult.questionResults.find(r => r.questionId === q.id);
              if (!result) return null;

              return (
                <Card key={q.id} className={result.correct ? 'border-green-200' : 'border-red-200'}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        result.correct ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {result.correct ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">Question {i + 1}</p>
                        <p className="text-slate-700 mb-4">{q.questionText}</p>
                        
                        {q.diagram && (
                          <div className="flex justify-center mb-4 p-4 bg-slate-50 rounded-lg">
                            {renderDiagram(q)}
                          </div>
                        )}

                        <div className="space-y-2">
                          <p>
                            <span className="text-slate-500">Your answer: </span>
                            <span className={result.correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {result.userAnswer?.toString() || 'Not answered'}
                            </span>
                          </p>
                          {!result.correct && (
                            <p>
                              <span className="text-slate-500">Correct answer: </span>
                              <span className="text-green-600 font-medium">{result.correctAnswer.toString()}</span>
                            </p>
                          )}
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Solution: </span>
                              {q.workedSolution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      {view === 'home' && renderHome()}
      {view === 'test' && renderTest()}
      {view === 'results' && renderResults()}
      {view === 'review' && renderReview()}
    </div>
  );
}

export default App;
