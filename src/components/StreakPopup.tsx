
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Award } from 'lucide-react';
import { useChaiData } from '@/context/ChaiDataContext';

export function StreakPopup() {
  const { showStreakPopup, setShowStreakPopup, currentStreak } = useChaiData();
  return (
    <AlertDialog open={showStreakPopup} onOpenChange={setShowStreakPopup}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center items-center mb-4">
             <Award className="w-16 h-16 text-primary animate-bounce" />
          </div>
          <AlertDialogTitle className="text-center font-headline text-2xl">
            Streak Maintained!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You've kept the flame alive! You are on a {currentStreak}-day chai streak. Keep it up!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setShowStreakPopup(false)}>Awesome!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
