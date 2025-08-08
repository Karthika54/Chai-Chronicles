import type { Badge, ChaiBreak, GetChaiFactOutput } from './types';
import { SNACKS } from './consts';
import { Coffee, Moon, Sun, Users, Award, BookOpen, Gem } from 'lucide-react';

export const BADGES: Badge[] = [
  {
    id: 'first-break',
    name: 'The First Sip',
    description: 'Log your very first chai break.',
    icon: Coffee,
    isUnlocked: (breaks) => breaks.length >= 1,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Log a chai break before 9 AM.',
    icon: Sun,
    isUnlocked: (breaks) => breaks.some(b => new Date(b.timestamp).getHours() < 9),
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Log a chai break after 9 PM.',
    icon: Moon,
    isUnlocked: (breaks) => breaks.some(b => new Date(b.timestamp).getHours() >= 21),
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Have a chai break with 3 or more friends.',
    icon: Users,
    isUnlocked: (breaks) => breaks.some(b => b.attendees.length >= 3),
  },
  {
    id: 'frequent-sipper',
    name: 'Frequent Sipper',
    description: 'Log 5 chai breaks.',
    icon: Award,
    isUnlocked: (breaks) => breaks.length >= 5,
  },
  {
    id: 'snack-sampler',
    name: 'Snack Sampler',
    description: 'Try at least 3 different types of snacks.',
    icon: Gem,
    isUnlocked: (breaks) => {
        const uniqueSnacks = new Set(breaks.map(b => b.snack));
        return uniqueSnacks.size >= 3;
    }
  },
  {
    id: 'historian-initiate',
    name: 'Historian Initiate',
    description: 'Unearth 5 ancient chai facts.',
    icon: BookOpen,
    isUnlocked: (breaks, facts) => facts.length >= 5,
  }
];
