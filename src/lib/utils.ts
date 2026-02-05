import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// UUID generator
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format time mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Local storage helpers
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
  }
}

// Calculate score
export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// Get grade
export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 85) return 'A';
  if (percentage >= 80) return 'A-';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'B-';
  if (percentage >= 60) return 'C+';
  if (percentage >= 55) return 'C';
  if (percentage >= 50) return 'C-';
  if (percentage >= 45) return 'D+';
  if (percentage >= 40) return 'D';
  return 'E';
}

// Get feedback
export function getFeedback(percentage: number): string {
  if (percentage >= 90) return 'Outstanding! Excellent work!';
  if (percentage >= 80) return 'Great job! Well done!';
  if (percentage >= 70) return 'Good work! Keep it up!';
  if (percentage >= 60) return 'Satisfactory. Room for improvement.';
  if (percentage >= 50) return 'Pass. More practice needed.';
  return 'Keep practicing! You\'ll improve with more study.';
}

// Normalize and check answer - handles multiple formats
export function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const user = userAnswer.toString().trim().toLowerCase();
  const correct = correctAnswer.toString().trim().toLowerCase();
  
  // Direct match
  if (user === correct) return true;
  
  // Clean both answers
  const cleanUser = user.replace(/^\$/, '').replace(/\$$/, '').replace(/,/g, '').replace(/\s/g, '');
  const cleanCorrect = correct.replace(/^\$/, '').replace(/\$$/, '').replace(/,/g, '').replace(/\s/g, '');
  
  if (cleanUser === cleanCorrect) return true;
  
  // Numeric comparison
  const userNum = parseFloat(cleanUser);
  const correctNum = parseFloat(cleanCorrect);
  
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.001;
  }
  
  // Fraction comparison
  const userFrac = cleanUser.match(/^(-?\d+)\/(-?\d+)$/);
  const correctFrac = cleanCorrect.match(/^(-?\d+)\/(-?\d+)$/);
  
  if (userFrac && correctFrac) {
    const u = parseInt(userFrac[1]) / parseInt(userFrac[2]);
    const c = parseInt(correctFrac[1]) / parseInt(correctFrac[2]);
    return Math.abs(u - c) < 0.001;
  }
  
  if (userFrac && !isNaN(correctNum)) {
    const u = parseInt(userFrac[1]) / parseInt(userFrac[2]);
    return Math.abs(u - correctNum) < 0.001;
  }
  
  if (correctFrac && !isNaN(userNum)) {
    const c = parseInt(correctFrac[1]) / parseInt(correctFrac[2]);
    return Math.abs(userNum - c) < 0.001;
  }
  
  return false;
}
