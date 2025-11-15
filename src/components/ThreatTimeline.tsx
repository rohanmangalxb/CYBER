import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';

interface Threat {
  id: string;
  attack_type: string;
  country: string;
  threat_level: string;
  detected_at: string;
  attacker_ip: string;
  blocked: boolean;
}

export const ThreatTimeline = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchThreats();
  }, [dateRange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentIndex < threats.length - 1) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= threats.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, threats.length, playbackSpeed]);

  const fetchThreats = async () => {
    let query = supabase
      .from('threats')
      .select('*')
      .order('detected_at', { ascending: true });

    if (dateRange.start) {
      query = query.gte('detected_at', dateRange.start);
    }
    if (dateRange.end) {
      query = query.lte('detected_at', dateRange.end);
    }

    const { data, error } = await query.limit(1000);
    if (data && !error) {
      setThreats(data);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setCurrentIndex(Math.max(0, currentIndex - 10));
  };

  const handleSkipForward = () => {
    setCurrentIndex(Math.min(threats.length - 1, currentIndex + 10));
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentIndex(value[0]);
    setIsPlaying(false);
  };

  const currentThreat = threats[currentIndex];
  const progress = threats.length > 0 ? (currentIndex / threats.length) * 100 : 0;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Threat Timeline Playback
          </h3>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <input
              type="datetime-local"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-secondary border border-border rounded px-2 py-1 text-foreground"
            />
            <span className="self-center">to</span>
            <input
              type="datetime-local"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-secondary border border-border rounded px-2 py-1 text-foreground"
            />
          </div>
        </div>

        {currentThreat && (
          <div className="bg-secondary/50 p-4 rounded-lg border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Attack Type</p>
                <p className="text-lg font-semibold text-foreground">{currentThreat.attack_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origin</p>
                <p className="text-lg font-semibold text-foreground">{currentThreat.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Threat Level</p>
                <p className={`text-lg font-semibold ${
                  currentThreat.threat_level === 'Critical' ? 'text-destructive' :
                  currentThreat.threat_level === 'High' ? 'text-warning' :
                  currentThreat.threat_level === 'Medium' ? 'text-accent' : 'text-success'
                }`}>
                  {currentThreat.threat_level}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-lg font-semibold ${currentThreat.blocked ? 'text-success' : 'text-destructive'}`}>
                  {currentThreat.blocked ? 'Blocked' : 'Active'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Detected At</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(currentThreat.detected_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Slider
            value={[currentIndex]}
            onValueChange={handleSliderChange}
            max={Math.max(0, threats.length - 1)}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Event {currentIndex + 1} / {threats.length}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSkipBack}
            disabled={currentIndex === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={handlePlayPause}
            disabled={threats.length === 0}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleSkipForward}
            disabled={currentIndex >= threats.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="bg-secondary border border-border rounded px-3 py-2 text-foreground text-sm"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="5">5x</option>
            <option value="10">10x</option>
          </select>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {threats.length === 0 ? 'No threats recorded yet' : `Playing ${threats.length} threat events`}
        </div>
      </div>
    </Card>
  );
};