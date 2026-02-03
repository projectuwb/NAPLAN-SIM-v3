import { useState, useEffect } from 'react';
import type { Question, TestMode, TestResult, TestState, StoredTest } from '@/types';
import { generateTest } from '@/lib/questions';
import { formatTime, saveToStorage, loadFromStorage, removeFromStorage, calculateScore, getGrade, getFeedback, normalizeAnswer } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Timer, Calculator, BookOpen, ChevronLeft, ChevronRight, Check, X, RotateCcw, Home, Trophy, AlertCircle, Trash2, History } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

type AppView = 'home' | 'test' | 'review' | 'results' | 'history';

const TEST_DURATION = 40 * 60; // 40 minutes in seconds
const STORAGE_KEY = 'naplan-test-state';
const RESULTS_KEY = 'naplan-test-results';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [testMode, setTestMode] = useState<TestMode>('non-calculator');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numericInput, setNumericInput] = useState('');
  
  // Test history state
  const [testHistory, setTestHistory] = useState<StoredTest[]>([]);
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewingTest, setReviewingTest] = useState<StoredTest | null>(null);
  
  // In-progress tests state
  const [inProgressTests, setInProgressTests] = useState<{nonCalculator: boolean; calculator: boolean}>({nonCalculator: false, calculator: false});

  // Load saved data on mount
  useEffect(() => {
    // Load test history
    const history = loadFromStorage<StoredTest[]>(RESULTS_KEY, []);
    setTestHistory(history);
    
    // Check for in-progress tests
    const savedState = loadFromStorage<TestState | null>(STORAGE_KEY, null);
    if (savedState && !savedState.isComplete) {
      setInProgressTests({
        nonCalculator: savedState.mode === 'non-calculator',
        calculator: savedState.mode === 'calculator'
      });
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
      setInProgressTests({
        nonCalculator: testMode === 'non-calculator',
        calculator: testMode === 'calculator'
      });
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
    } catch (err) {
      setError('An error occurred while starting the test.');
      console.error(err);
    }
  };

  const resumeTest = () => {
    const savedState = loadFromStorage<TestState | null>(STORAGE_KEY, null);
    if (savedState && !savedState.isComplete) {
      setTestMode(savedState.mode);
      setQuestions(savedState.questions);
      setCurrentIndex(savedState.currentQuestionIndex);
      setTimeRemaining(savedState.timeRemaining);
      const savedAnswers: Record<string, string> = {};
      savedState.questions.forEach(q => {
        if (q.userAnswer !== undefined) {
          savedAnswers[q.id] = String(q.userAnswer);
        }
      });
      setAnswers(savedAnswers);
      setIsTestComplete(false);
      setNumericInput(savedAnswers[savedState.questions[savedState.currentQuestionIndex]?.id] || '');
      setView('test');
    }
  };

  const cancelTest = () => {
    removeFromStorage(STORAGE_KEY);
    setInProgressTests({nonCalculator: false, calculator: false});
  };

  const completeTest = () => {
    setIsTestComplete(true);
    
    // Calculate results
    const questionResults = questions.map(q => {
      const userAnswer = answers[q.id] || '';
      let correct = false;
      
      if (q.answerFormat === 'multiple-choice') {
        correct = userAnswer === q.correctAnswer;
      } else {
        correct = normalizeAnswer(userAnswer, q.correctAnswer);
      }
      
      return {
        questionId: q.id,
        questionType: q.type,
        correct,
        userAnswer,
        correctAnswer: String(q.correctAnswer),
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
    const newTest: StoredTest = {
      id: Date.now().toString(),
      result,
    };
    const history = loadFromStorage<StoredTest[]>(RESULTS_KEY, []);
    const updatedHistory = [newTest, ...history];
    saveToStorage(RESULTS_KEY, updatedHistory);
    setTestHistory(updatedHistory);
    
    removeFromStorage(STORAGE_KEY);
    setInProgressTests({
      nonCalculator: false,
      calculator: false
    });
    setView('results');
  };

  const handleAnswer = (answer: string) => {
    if (questions[currentIndex]) {
      setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: answer }));
    }
  };

  const handleNumericSubmit = () => {
    if (numericInput.trim() && questions[currentIndex]) {
      handleAnswer(numericInput.trim());
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      const q = questions[index];
      setNumericInput(answers[q.id] || '');
    }
  };

  const deleteSelectedTests = () => {
    const updatedHistory = testHistory.filter(t => !selectedTests.has(t.id));
    saveToStorage(RESULTS_KEY, updatedHistory);
    setTestHistory(updatedHistory);
    setSelectedTests(new Set());
    setShowDeleteDialog(false);
  };

  const deleteAllTests = () => {
    saveToStorage(RESULTS_KEY, []);
    setTestHistory([]);
    setSelectedTests(new Set());
    setShowDeleteDialog(false);
  };

  const toggleTestSelection = (id: string) => {
    const newSelected = new Set(selectedTests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTests(newSelected);
  };

  const selectAllTests = () => {
    if (selectedTests.size === testHistory.length) {
      setSelectedTests(new Set());
    } else {
      setSelectedTests(new Set(testHistory.map(t => t.id)));
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

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Non-Calculator Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Non-Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              
              {inProgressTests.nonCalculator ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 font-medium mb-2">Test in Progress</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={resumeTest}>Resume Test</Button>
                    <Button size="sm" variant="outline" onClick={cancelTest}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Test your mental math skills with questions on number, algebra, measurement, and geometry.
                  </p>
                  <Button className="w-full" onClick={() => startTest('non-calculator')}>Start Test</Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Calculator Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Calculator Allowed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              
              {inProgressTests.calculator ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 font-medium mb-2">Test in Progress</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={resumeTest}>Resume Test</Button>
                    <Button size="sm" variant="outline" onClick={cancelTest}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Use your calculator for more complex problems including statistics and probability.
                  </p>
                  <Button className="w-full" onClick={() => startTest('calculator')}>Start Test</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test History Button */}
        <div className="text-center">
          <Button variant="outline" onClick={() => setView('history')} className="mb-4">
            <History className="w-4 h-4 mr-2" />
            Test History ({testHistory.length} tests)
          </Button>
        </div>

        <div className="mt-4 text-center">
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
                    const optionLetter = option.charAt(0);
                    const isSelected = answers[currentQuestion.id] === optionLetter;
                    return (
                      <button
                        key={`${currentQuestion.id}-${i}`}
                        onClick={() => handleAnswer(optionLetter)}
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
                      placeholder="Type your answer here"
                      value={numericInput}
                      onChange={(e) => setNumericInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNumericSubmit()}
                      className="flex-1 text-lg"
                      autoFocus
                    />
                    <Button onClick={handleNumericSubmit}>Submit</Button>
                  </div>
                  {isAnswered && (
                    <p className="text-sm text-green-600">
                      Answer saved: {answers[currentQuestion.id]}
                    </p>
                  )}
                  <p className="text-xs text-slate-400">
                    Tip: You can type numbers, fractions (e.g., 3/4), decimals, or money (e.g., $5 or 5.00)
                  </p>
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

          <div className="flex gap-4 justify-center mb-8 flex-wrap">
            <Button onClick={() => {
              setReviewingTest({id: 'current', result: testResult});
              setView('review');
            }} variant="outline">
              Review Answers
            </Button>
            <Button onClick={() => startTest(testMode)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => setView('history')} variant="outline">
              <History className="w-4 h-4 mr-2" />
              Test History
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

  const renderHistory = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test History</h1>
          <Button onClick={() => setView('home')} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {testHistory.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-500">No tests completed yet.</p>
              <Button className="mt-4" onClick={() => setView('home')}>Start a Test</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={selectAllTests}>
                  {selectedTests.size === testHistory.length ? 'Deselect All' : 'Select All'}
                </Button>
                {selectedTests.size > 0 && (
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedTests.size})
                  </Button>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </Button>
            </div>

            <div className="space-y-4">
              {testHistory.map((test, index) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedTests.has(test.id)}
                        onCheckedChange={() => toggleTestSelection(test.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">Test #{testHistory.length - index}</p>
                          <span className={`px-2 py-1 rounded text-xs ${
                            test.result.mode === 'non-calculator' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {test.result.mode === 'non-calculator' ? 'Non-Calculator' : 'Calculator'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-slate-500">Score:</span>
                            <span className="font-medium ml-1">{test.result.score}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Correct:</span>
                            <span className="font-medium ml-1">{test.result.correctAnswers}/{test.result.totalQuestions}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Grade:</span>
                            <span className="font-medium ml-1">{getGrade(test.result.score)}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Date:</span>
                            <span className="font-medium ml-1">{new Date(test.result.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setReviewingTest(test);
                          setView('review');
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tests</DialogTitle>
            <DialogDescription>
              {selectedTests.size > 0 
                ? `Are you sure you want to delete ${selectedTests.size} selected test(s)?`
                : 'Are you sure you want to delete all tests?'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={selectedTests.size > 0 ? deleteSelectedTests : deleteAllTests}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderReview = () => {
    const testToReview = reviewingTest || (testResult ? {id: 'current', result: testResult} : null);
    if (!testToReview) return null;

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Review Answers</h1>
            <Button onClick={() => {
              setReviewingTest(null);
              setView(testToReview.id === 'current' ? 'results' : 'history');
            }} variant="outline">
              Back
            </Button>
          </div>

          <div className="space-y-6">
            {testToReview.result.questionResults.map((result, i) => (
              <Card key={result.questionId} className={result.correct ? 'border-green-200' : 'border-red-200'}>
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
                      
                      <div className="space-y-2">
                        <p>
                          <span className="text-slate-500">Your answer: </span>
                          <span className={result.correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {result.userAnswer || 'Not answered'}
                          </span>
                        </p>
                        {!result.correct && (
                          <p>
                            <span className="text-slate-500">Correct answer: </span>
                            <span className="text-green-600 font-medium">{result.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
      {view === 'history' && renderHistory()}
    </div>
  );
}

export default App;
