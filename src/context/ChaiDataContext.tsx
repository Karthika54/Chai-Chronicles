
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { ChaiBreak, GetChaiFactOutput } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ChaiDataContextType {
  chaiBreaks: ChaiBreak[];
  facts: GetChaiFactOutput[];
  showBounce: boolean;
  showStreakPopup: boolean;
  setShowStreakPopup: (show: boolean) => void;
  currentStreak: number;
  handleLogBreak: (newBreak: Omit<ChaiBreak, 'id'>) => void;
  handleNewFact: (newFact: GetChaiFactOutput) => void;
}

const ChaiDataContext = createContext<ChaiDataContextType | undefined>(undefined);

const calculateCurrentStreak = (breaks: ChaiBreak[]) => {
  if (breaks.length === 0) return 0;

  const sortedBreaks = [...breaks].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastBreakDate = new Date(sortedBreaks[0].timestamp);
  lastBreakDate.setHours(0, 0, 0, 0);

  const diffDays = (today.getTime() - lastBreakDate.getTime()) / (1000 * 3600 * 24);

  if (diffDays > 1) {
    return 0; // Streak is broken if the last break was more than a day ago
  }

  const breakDays = [...new Set(sortedBreaks.map(b => new Date(b.timestamp).toDateString()))]
    .map(d => new Date(d))
    .sort((a,b) => b.getTime() - a.getTime());

  if (breakDays.length === 0) return 0;
  
  let currentStreak = 1;
  const todayString = new Date();
  todayString.setHours(0, 0, 0, 0);

  if (breakDays[0].getTime() !== todayString.getTime()) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      if(breakDays[0].getTime() !== yesterday.getTime()){
          return 0;
      }
  }

  for (let i = 0; i < breakDays.length - 1; i++) {
      const diff = (breakDays[i].getTime() - breakDays[i+1].getTime()) / (1000 * 3600 * 24);
      if (diff === 1) {
          currentStreak++;
      } else {
          break;
      }
  }
  return currentStreak;
};

export const ChaiDataProvider = ({ children }: { children: ReactNode }) => {
  const [chaiBreaks, setChaiBreaks] = useState<ChaiBreak[]>([]);
  const [facts, setFacts] = useState<GetChaiFactOutput[]>([]);
  const [showBounce, setShowBounce] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const { toast } = useToast();

  const handleLogBreak = (newBreak: Omit<ChaiBreak, 'id'>) => {
    const breakWithId = { ...newBreak, id: new Date().toISOString() };
    const newBreaks = [breakWithId, ...chaiBreaks];
    
    const previousStreak = currentStreak;
    const newStreak = calculateCurrentStreak(newBreaks);
    
    if (newStreak > 1 && newStreak > previousStreak) {
      setShowStreakPopup(true);
    }
    setCurrentStreak(newStreak);
    setChaiBreaks(newBreaks);
    
    setShowBounce(true);
    setTimeout(() => setShowBounce(false), 2000);

    toast({
        title: "Chai Break Logged!",
        description: `Vibe: ${newBreak.vibe.name}`,
    });
  };
  
  const handleNewFact = (newFact: GetChaiFactOutput) => {
    setFacts(prevFacts => [...prevFacts, newFact]);
  }

  return (
    <ChaiDataContext.Provider value={{ 
        chaiBreaks, 
        facts, 
        showBounce,
        showStreakPopup,
        setShowStreakPopup,
        currentStreak,
        handleLogBreak, 
        handleNewFact 
    }}>
      {children}
    </ChaiDataContext.Provider>
  );
};

export const useChaiData = () => {
  const context = useContext(ChaiDataContext);
  if (context === undefined) {
    throw new Error('useChaiData must be used within a ChaiDataProvider');
  }
  return context;
};
