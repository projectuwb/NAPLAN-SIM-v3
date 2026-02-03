import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// UUID generator for question IDs
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Format time from seconds to mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Shuffle array
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate distractors for multiple choice
export function generateDistractors(correct: number, count: number = 3): number[] {
  const distractors = new Set<number>();
  const variations = [
    correct + 1,
    correct - 1,
    correct * 2,
    Math.floor(correct / 2),
    correct + 10,
    correct - 10,
    correct * 10,
    correct + 100,
    correct - 100,
  ];
  
  for (const v of variations) {
    if (v !== correct && v >= 0 && distractors.size < count) {
      distractors.add(v);
    }
  }
  
  return Array.from(distractors);
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

// Calculate score percentage
export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Normalize and validate numeric answer
// Handles: $5, 5.00, 5, 3/4, 0.75, etc.
export function normalizeAnswer(userAnswer: string, correctAnswer: string | number): boolean {
  const normalized = userAnswer.toString().trim().toLowerCase();
  const correct = correctAnswer.toString().trim().toLowerCase();
  
  // Direct match
  if (normalized === correct) return true;
  
  // Remove common prefixes/suffixes and compare
  const cleanUser = normalized
    .replace(/^\$/, '')
    .replace(/\$$/, '')
    .replace(/,/g, '')
    .replace(/\s/g, '');
  
  const cleanCorrect = correct
    .replace(/^\$/, '')
    .replace(/\$$/, '')
    .replace(/,/g, '')
    .replace(/\s/g, '');
  
  if (cleanUser === cleanCorrect) return true;
  
  // Try numeric comparison
  const userNum = parseFloat(cleanUser);
  const correctNum = parseFloat(cleanCorrect);
  
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    // Allow small floating point differences
    return Math.abs(userNum - correctNum) < 0.001;
  }
  
  // Handle fractions like "3/4"
  const userFracMatch = cleanUser.match(/^(-?\d+)\/(-?\d+)$/);
  const correctFracMatch = cleanCorrect.match(/^(-?\d+)\/(-?\d+)$/);
  
  if (userFracMatch && correctFracMatch) {
    const userNum = parseInt(userFracMatch[1]) / parseInt(userFracMatch[2]);
    const correctNum = parseInt(correctFracMatch[1]) / parseInt(correctFracMatch[2]);
    return Math.abs(userNum - correctNum) < 0.001;
  }
  
  // If user entered decimal and correct is fraction (or vice versa)
  if (userFracMatch && !isNaN(correctNum)) {
    const userVal = parseInt(userFracMatch[1]) / parseInt(userFracMatch[2]);
    return Math.abs(userVal - correctNum) < 0.001;
  }
  
  if (correctFracMatch && !isNaN(userNum)) {
    const correctVal = parseInt(correctFracMatch[1]) / parseInt(correctFracMatch[2]);
    return Math.abs(userNum - correctVal) < 0.001;
  }
  
  return false;
}

// Get grade from percentage
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

// Get feedback based on score
export function getFeedback(percentage: number): string {
  if (percentage >= 90) return 'Outstanding! Excellent work!';
  if (percentage >= 80) return 'Great job! Well done!';
  if (percentage >= 70) return 'Good work! Keep it up!';
  if (percentage >= 60) return 'Satisfactory. Room for improvement.';
  if (percentage >= 50) return 'Pass. More practice needed.';
  return 'Keep practicing! You\'ll improve with more study.';
}
