export interface ChaiBreak {
  id: string;
  timestamp: Date;
  attendees: string[];
  description: string;
  snack: string;
  budget?: number;
  rating?: number;
  vibe: {
    name: string;
    description: string;
  };
}

export interface Snack {
  name: string;
  personality: string;
  pairingScore: number;
  price: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: (breaks: ChaiBreak[], facts: GetChaiFactOutput[]) => boolean;
}

export interface GetChaiFactOutput {
  fact: string;
}
