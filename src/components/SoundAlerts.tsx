import { useEffect, useRef } from 'react';

interface SoundAlertsProps {
  threatLevel: string;
  enabled: boolean;
}

export const SoundAlerts = ({ threatLevel, enabled }: SoundAlertsProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (enabled && threatLevel && audioContextRef.current) {
      playAlertSound(threatLevel);
    }
  }, [threatLevel, enabled]);

  const playAlertSound = (level: string) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Different frequencies and patterns for different threat levels
    const patterns: { [key: string]: { freq: number[]; duration: number[]; volume: number } } = {
      'Low': { freq: [440], duration: [0.1], volume: 0.1 },
      'Medium': { freq: [523, 659], duration: [0.15, 0.15], volume: 0.15 },
      'High': { freq: [659, 784, 659], duration: [0.1, 0.1, 0.1], volume: 0.2 },
      'Critical': { freq: [880, 1047, 880, 1047], duration: [0.08, 0.08, 0.08, 0.08], volume: 0.25 }
    };

    const pattern = patterns[level] || patterns['Low'];
    let currentTime = ctx.currentTime;

    pattern.freq.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(pattern.volume, currentTime + 0.01);
      gain.gain.linearRampToValueAtTime(0, currentTime + pattern.duration[index]);
      
      osc.start(currentTime);
      osc.stop(currentTime + pattern.duration[index]);
      
      currentTime += pattern.duration[index] + 0.05;
    });
  };

  return null;
};

export default SoundAlerts;