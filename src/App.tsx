import { useState, useEffect, useCallback } from 'react';
import type { Question, TestMode, TestResult } from './types';
import { generateTest } from './lib/questions';
import { 
  formatTime, 
  saveToStorage, 
  loadFromStorage, 
  removeFromStorage, 
  calculateScore, 
  getGrade, 
  getFeedback,
  checkAnswer,
  uuidv4 
} from './lib/utils';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { 
  Timer, Calculator, BookOpen, ChevronLeft, ChevronRight, 
  Check, X, RotateCcw, Home, Trophy, Trash2, History 
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './components/ui/dialog';
import { BarGraph, ShapeDiagram, Spinner, MapDiagram, RotationShape } from './components/diagrams';

type View = 'home' | 'test' | 'results' | 'review' | 'history';

const TEST_DURATION = 40 * 60;
const TEST_STATE_KEY = 'naplan_test_state';
const TEST_HISTORY_KEY = 'naplan_test_history';

interface SavedTestState {
  mode: TestMode;
  questions: Question[];
  currentIndex: number;
  timeRemaining: number;
  answers: Record<string, string>;
}

export default function App() {
  // View state
  const [view, setView] = useState<View>('home');
  
  // Test state
  const [mode, setMode] = useState<TestMode>('non-calculator');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  
  // Results state
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  
  // History state
  const [history, setHistory] = useState<TestResult[]>([]);
  const [selectedTests, setSelectedTests] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Check for saved test on mount
  useEffect(() => {
    const savedHistory = loadFromStorage<TestResult[]>(TEST_HISTORY_KEY, []);
    setHistory(savedHistory);
  }, []);
  
  // Timer
  useEffect(() => {
    if (view !== 'test') return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [view, questions.length]);
  
  // Auto-save test state
  useEffect(() => {
    if (view === 'test' && questions.length > 0) {
      const state: SavedTestState = {
        mode,
        questions,
        currentIndex,
        timeRemaining,
        answers,
      };
      saveToStorage(TEST_STATE_KEY, state);
    }
  }, [view, mode, questions, currentIndex, timeRemaining, answers]);
  
  const startTest = useCallback((testMode: TestMode) => {
    // Check for existing test of this type
    const saved = loadFromStorage<SavedTestState | null>(TEST_STATE_KEY, null);
    if (saved && saved.mode === testMode && saved.questions.length > 0) {
      // Resume existing test
      setMode(saved.mode);
      setQuestions(saved.questions);
      setCurrentIndex(saved.currentIndex);
      setTimeRemaining(saved.timeRemaining);
      setAnswers(saved.answers);
      setInputValue(saved.answers[saved.questions[saved.currentIndex]?.id] || '');
    } else {
      // Start new test
      const newQuestions = generateTest(testMode, 32);
      setMode(testMode);
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setTimeRemaining(TEST_DURATION);
      setAnswers({});
      setInputValue('');
      removeFromStorage(TEST_STATE_KEY);
    }
    setView('test');
  }, []);
  
  const cancelTest = useCallback(() => {
    removeFromStorage(TEST_STATE_KEY);
    setView('home');
  }, []);
  
  const handleAnswer = useCallback((answer: string) => {
    const q = questions[currentIndex];
    if (!q) return;
    
    setAnswers(prev => ({ ...prev, [q.id]: answer }));
  }, [questions, currentIndex]);
  
  const submitNumeric = useCallback(() => {
    if (inputValue.trim()) {
      handleAnswer(inputValue.trim());
    }
  }, [inputValue, handleAnswer]);
  
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setInputValue(answers[questions[index]?.id] || '');
    }
  }, [questions, answers]);
  
  const finishTest = useCallback(() => {
    const results = questions.map(q => {
      const userAns = answers[q.id] || '';
      const correct = q.answerFormat === 'multiple-choice' 
        ? userAns === q.correctAnswer
        : checkAnswer(userAns, q.correctAnswer);
      
      return {
        questionId: q.id,
        questionType: q.type,
        correct,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
      };
    });
    
    const correctCount = results.filter(r => r.correct).length;
    const result: TestResult = {
      id: uuidv4(),
      mode,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      score: calculateScore(correctCount, questions.length),
      timeTaken: TEST_DURATION - timeRemaining,
      completedAt: new Date().toISOString(),
      questionResults: results,
    };
    
    setTestResult(result);
    
    // Save to history
    const updatedHistory = [result, ...history].slice(0, 100); // Keep last 100
    setHistory(updatedHistory);
    saveToStorage(TEST_HISTORY_KEY, updatedHistory);
    
    removeFromStorage(TEST_STATE_KEY);
    setView('results');
  }, [questions, answers, mode, timeRemaining, history]);
  
  const deleteSelected = useCallback(() => {
    const updated = history.filter(t => !selectedTests.has(t.id));
    setHistory(updated);
    saveToStorage(TEST_HISTORY_KEY, updated);
    setSelectedTests(new Set());
    setShowDeleteDialog(false);
  }, [history, selectedTests]);
  
  const deleteAll = useCallback(() => {
    setHistory([]);
    saveToStorage(TEST_HISTORY_KEY, []);
    setSelectedTests(new Set());
    setShowDeleteDialog(false);
  }, []);
  
  const toggleSelection = useCallback((id: string) => {
    setSelectedTests(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  
  const selectAll = useCallback(() => {
    if (selectedTests.size === history.length) {
      setSelectedTests(new Set());
    } else {
      setSelectedTests(new Set(history.map(t => t.id)));
    }
  }, [history, selectedTests.size]);
  
  // Get saved test info for home screen
  const savedTest = loadFromStorage<SavedTestState | null>(TEST_STATE_KEY, null);
  const hasNonCalcProgress = savedTest?.mode === 'non-calculator';
  const hasCalcProgress = savedTest?.mode === 'calculator';
  const progressText = savedTest 
    ? `${Object.keys(savedTest.answers).length}/${savedTest.questions.length} answered, ${formatTime(savedTest.timeRemaining)} left`
    : '';
  
  // Render diagram for questions that have them
  const renderDiagram = (question: Question) => {
    if (!question.diagram) return null;
    
    const { type, data } = question.diagram;
    
    switch (type) {
      case 'bar-graph':
        return (
          <div className="my-6 flex justify-center">
            <BarGraph 
              data={data.data} 
              title={data.title}
              yAxisLabel={data.yAxisLabel}
            />
          </div>
        );
      case 'shape':
        return (
          <div className="my-6 flex justify-center">
            <ShapeDiagram {...data} />
          </div>
        );
      case 'spinner':
        return (
          <div className="my-6 flex justify-center">
            <Spinner sections={data.sections} highlightNumber={data.highlightNumber} />
          </div>
        );
      case 'map':
        return (
          <div className="my-6 flex justify-center">
            <MapDiagram towns={data.towns} highlightedTowns={data.highlightedTowns} />
          </div>
        );
      case 'rotation':
        return (
          <div className="my-6 flex justify-center">
            <RotationShape shape={data.shape} rotation={data.rotation} direction={data.direction} />
          </div>
        );
      default:
        return null;
    }
  };
  
  // Render functions
  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            NAPLAN Year 7 Numeracy
          </h1>
          <p className="text-slate-600">Practice Test Generator</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Non-Calculator Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Non-Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              
              {hasNonCalcProgress ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 font-medium mb-1">Test in Progress</p>
                  <p className="text-amber-600 text-sm mb-3">{progressText}</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={() => startTest('non-calculator')}>Resume</Button>
                    <Button size="sm" variant="outline" onClick={cancelTest}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Test your mental math skills with number, algebra, measurement, and geometry.
                  </p>
                  <Button className="w-full" onClick={() => startTest('non-calculator')}>Start Test</Button>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Calculator Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Calculator Allowed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-600 mb-4">40 minutes • 32 questions</p>
              
              {hasCalcProgress ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 font-medium mb-1">Test in Progress</p>
                  <p className="text-amber-600 text-sm mb-3">{progressText}</p>
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={() => startTest('calculator')}>Resume</Button>
                    <Button size="sm" variant="outline" onClick={cancelTest}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Use your calculator for complex problems including statistics and probability.
                  </p>
                  <Button className="w-full" onClick={() => startTest('calculator')}>Start Test</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button variant="outline" onClick={() => setView('history')}>
            <History className="w-4 h-4 mr-2" />
            Test History ({history.length})
          </Button>
        </div>
      </div>
    </div>
  );
  
  const renderTest = () => {
    const q = questions[currentIndex];
    if (!q) return null;
    
    const answeredCount = Object.keys(answers).length;
    const isAnswered = answers[q.id] !== undefined;
    
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
                  {mode === 'non-calculator' ? 'Non-Calculator' : 'Calculator'}
                </span>
              </div>
              <div className={`flex items-center gap-2 font-mono text-lg font-bold ${
                timeRemaining < 300 ? 'text-red-600' : 'text-slate-700'
              }`}>
                <Timer className="w-5 h-5" />
                {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-slate-500 mb-1">
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
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded capitalize">
                  {q.category.replace('-', ' & ')}
                </span>
              </div>
              
              <p className="text-lg mb-6 whitespace-pre-line">{q.questionText}</p>
              
              {renderDiagram(q)}
              
              {q.answerFormat === 'multiple-choice' ? (
                <div className="space-y-3">
                  {q.options?.map((opt, i) => {
                    const letter = opt.charAt(0);
                    const selected = answers[q.id] === letter;
                    return (
                      <button
                        key={`${q.id}-${i}`}
                        onClick={() => handleAnswer(letter)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="font-medium">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Type your answer"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitNumeric()}
                      className="flex-1 text-lg"
                    />
                    <Button onClick={submitNumeric}>Submit</Button>
                  </div>
                  {isAnswered && (
                    <p className="text-sm text-green-600">Answer saved: {answers[q.id]}</p>
                  )}
                  <p className="text-xs text-slate-400">
                    You can type numbers, fractions (e.g., 3/4), decimals, or money (e.g., $5)
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
            
            {currentIndex === questions.length - 1 ? (
              <Button onClick={finishTest}>Finish Test</Button>
            ) : (
              <Button onClick={() => goToQuestion(currentIndex + 1)}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          
          {/* Question Navigator */}
          <div className="mt-6">
            <p className="text-sm text-slate-500 mb-2">Jump to:</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => goToQuestion(i)}
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    i === currentIndex ? 'bg-blue-500 text-white' :
                    answers[q.id] ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
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
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button onClick={() => setView('review')} variant="outline">Review Answers</Button>
            <Button onClick={() => startTest(mode)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => setView('history')} variant="outline">
              <History className="w-4 h-4 mr-2" />
              History
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
            <Button onClick={() => setView('results')} variant="outline">Back</Button>
          </div>
          
          <div className="space-y-4">
            {testResult.questionResults.map((r, i) => (
              <Card key={r.questionId} className={r.correct ? 'border-green-200' : 'border-red-200'}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      r.correct ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {r.correct ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">Question {i + 1}</p>
                      <p className="text-slate-500 text-sm mb-1">Your answer: 
                        <span className={r.correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {r.userAnswer || 'Not answered'}
                        </span>
                      </p>
                      {!r.correct && (
                        <p className="text-slate-500 text-sm">Correct answer: 
                          <span className="text-green-600 font-medium">{r.correctAnswer}</span>
                        </p>
                      )}
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
  
  const renderHistory = () => (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test History</h1>
          <Button onClick={() => setView('home')} variant="outline">Home</Button>
        </div>
        
        {history.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-500">No tests yet.</p>
              <Button className="mt-4" onClick={() => setView('home')}>Start a Test</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedTests.size === history.length ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedTests.size > 0 && (
                <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedTests.size})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All
              </Button>
            </div>
            
            <div className="space-y-3">
              {history.map((test, i) => (
                <Card key={test.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedTests.has(test.id)}
                        onCheckedChange={() => toggleSelection(test.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Test #{history.length - i}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            test.mode === 'non-calculator' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {test.mode === 'non-calculator' ? 'Non-Calc' : 'Calculator'}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500">
                          Score: {test.score}% • {test.correctAnswers}/{test.totalQuestions} correct • Grade: {getGrade(test.score)} • {new Date(test.completedAt).toLocaleDateString()}
                        </div>
                      </div>
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
                ? `Delete ${selectedTests.size} selected test(s)?`
                : 'Delete all tests?'
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={selectedTests.size > 0 ? deleteSelected : deleteAll}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
  
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
