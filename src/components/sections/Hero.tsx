
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PixelatedChaiCup } from '@/components/ui/icons';

interface SteamParticleData {
  id: number;
  style: React.CSSProperties;
}

const SteamParticle = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute text-foreground/50 animate-steam"
    style={style}
  >
    ~
  </div>
);

export function Hero({ showBounce }: { showBounce: boolean }) {
  const [steamParticles, setSteamParticles] = useState<SteamParticleData[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      return [...Array(15)].map((_, i) => ({
        id: i,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          fontSize: `${Math.random() * 2 + 1}rem`,
        },
      }));
    };
    setSteamParticles(generateParticles());
  }, []);

  return (
    <section id="home" className="relative text-center py-20 md:py-32 bg-accent/10 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {steamParticles.map(p => (
          <SteamParticle key={p.id} style={p.style}/>
        ))}
      </div>
      <div className="container mx-auto relative">
        <div className="flex justify-center items-center mb-4">
           <PixelatedChaiCup className={`w-24 h-24 text-primary ${showBounce ? 'animate-bounce-cup' : ''}`} />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary">
          Chaya Kada Chronicles
        </h1>
        <p className="font-body text-lg md:text-xl mt-4 text-accent">
          oru chaya kudikan poyalo!!
        </p>
        <p className="font-body text-lg md:text-xl mt-4 text-accent-foreground/80">
          Because counting tea breaks should be ridiculous
        </p>
        <Button asChild size="lg" className="mt-8 font-bold">
          <a href="/logger">Log a Chai Break</a>
        </Button>
      </div>
    </section>
  );
}
