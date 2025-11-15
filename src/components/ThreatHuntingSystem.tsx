import React, { useState, useEffect } from 'react';
import { Search, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface IoC {
  id: string;
  type: string;
  value: string;
  severity: string;
  found: boolean;
  timestamp: string;
  sources: number;
}

export const ThreatHuntingSystem: React.FC = () => {
  const { toast } = useToast();
  const [hunting, setHunting] = useState(false);
  const [iocs, setIocs] = useState<IoC[]>([]);
  const [stats, setStats] = useState({ searched: 0, found: 0, critical: 0 });

  const startHunt = () => {
    setHunting(true);
    toast({
      title: "Threat Hunt Initiated",
      description: "Proactively searching for indicators of compromise...",
    });

    // Simulate automated threat hunting
    const interval = setInterval(() => {
      const newIoC: IoC = {
        id: Date.now().toString(),
        type: ['Malicious IP', 'Suspicious Domain', 'File Hash', 'Registry Key', 'Network Pattern'][Math.floor(Math.random() * 5)],
        value: `IoC-${Math.random().toString(36).substr(2, 9)}`,
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        found: Math.random() > 0.5,
        timestamp: new Date().toISOString(),
        sources: Math.floor(Math.random() * 10) + 1,
      };
      
      setIocs(prev => [newIoC, ...prev].slice(0, 50));
      setStats(prev => ({
        searched: prev.searched + 1,
        found: prev.found + (newIoC.found ? 1 : 0),
        critical: prev.critical + (newIoC.found && newIoC.severity === 'Critical' ? 1 : 0),
      }));

      if (newIoC.found && newIoC.severity === 'Critical') {
        toast({
          title: "Critical IoC Found!",
          description: `Detected ${newIoC.type}: ${newIoC.value}`,
          variant: "destructive",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  const stopHunt = () => {
    setHunting(false);
    toast({
      title: "Threat Hunt Stopped",
      description: `Searched ${stats.searched} indicators, found ${stats.found} matches`,
    });
  };

  useEffect(() => {
    if (hunting) {
      return startHunt();
    }
  }, [hunting]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Search className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-foreground">Automated Threat Hunting</h2>
          </div>
          
          <Button 
            onClick={hunting ? stopHunt : () => setHunting(true)}
            variant={hunting ? "destructive" : "default"}
          >
            {hunting ? 'Stop Hunt' : 'Start Hunt'}
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-secondary/50 border-border">
            <p className="text-sm text-muted-foreground">Indicators Searched</p>
            <p className="text-2xl font-bold text-foreground">{stats.searched}</p>
          </Card>
          <Card className="p-4 bg-secondary/50 border-border">
            <p className="text-sm text-muted-foreground">Matches Found</p>
            <p className="text-2xl font-bold text-primary">{stats.found}</p>
          </Card>
          <Card className="p-4 bg-secondary/50 border-border">
            <p className="text-sm text-muted-foreground">Critical Findings</p>
            <p className="text-2xl font-bold text-destructive">{stats.critical}</p>
          </Card>
        </div>

        {/* IoC Results */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground mb-3">Indicators of Compromise</h3>
          {iocs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {hunting ? 'Hunting for threats...' : 'Click "Start Hunt" to begin proactive threat hunting'}
            </p>
          ) : (
            iocs.map(ioc => (
              <Card 
                key={ioc.id} 
                className={`p-4 ${
                  ioc.found 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'bg-secondary/50 border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {ioc.found ? (
                      <AlertTriangle className="text-destructive" size={20} />
                    ) : (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{ioc.type}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          ioc.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          ioc.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                          ioc.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {ioc.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">{ioc.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Found in {ioc.sources} source{ioc.sources > 1 ? 's' : ''} • {new Date(ioc.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ioc.found 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {ioc.found ? 'FOUND' : 'CLEAR'}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
