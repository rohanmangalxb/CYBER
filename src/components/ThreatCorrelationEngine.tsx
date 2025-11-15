import React, { useState, useEffect } from 'react';
import { GitMerge, AlertCircle, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';

interface CorrelatedThreat {
  id: string;
  primaryThreat: string;
  relatedThreats: string[];
  correlation: number;
  sources: string[];
  severity: string;
}

export const ThreatCorrelationEngine: React.FC = () => {
  const [correlations, setCorrelations] = useState<CorrelatedThreat[]>([]);

  useEffect(() => {
    // Simulate threat correlation discovery
    const interval = setInterval(() => {
      const newCorrelation: CorrelatedThreat = {
        id: Date.now().toString(),
        primaryThreat: ['DDoS Attack', 'Malware', 'Phishing', 'SQL Injection'][Math.floor(Math.random() * 4)],
        relatedThreats: ['Botnet Activity', 'Port Scanning', 'Data Exfiltration'].slice(0, Math.floor(Math.random() * 3) + 1),
        correlation: Math.random() * 100,
        sources: ['IDS', 'Firewall', 'SIEM', 'Threat Feed'].slice(0, Math.floor(Math.random() * 4) + 1),
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
      };
      
      setCorrelations(prev => [newCorrelation, ...prev].slice(0, 20));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-6">
          <GitMerge className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-foreground">Real-time Threat Correlation Engine</h2>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-secondary/50 border-border">
            <p className="text-sm text-muted-foreground">Total Correlations</p>
            <p className="text-2xl font-bold text-foreground">{correlations.length}</p>
          </Card>
          <Card className="p-4 bg-secondary/50 border-border">
            <p className="text-sm text-muted-foreground">High Correlation</p>
            <p className="text-2xl font-bold text-primary">
              {correlations.filter(c => c.correlation > 70).length}
            </p>
          </Card>
          <Card className="p-4 bg-secondary/50 border-border">
            <p className="text-sm text-muted-foreground">Critical Threats</p>
            <p className="text-2xl font-bold text-destructive">
              {correlations.filter(c => c.severity === 'Critical').length}
            </p>
          </Card>
        </div>

        {/* Correlations List */}
        <div className="space-y-3">
          {correlations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Monitoring for threat correlations...
            </p>
          ) : (
            correlations.map(correlation => (
              <Card 
                key={correlation.id} 
                className="p-4 bg-secondary/50 border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle 
                        size={20} 
                        className={
                          correlation.severity === 'Critical' ? 'text-destructive' :
                          correlation.severity === 'High' ? 'text-orange-500' :
                          correlation.severity === 'Medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }
                      />
                      <h3 className="font-bold text-foreground">{correlation.primaryThreat}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Correlation Strength: 
                        <span className="ml-2 font-semibold text-primary">
                          {correlation.correlation.toFixed(1)}%
                        </span>
                      </p>
                    </div>

                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground mb-1">Related Threats:</p>
                      <div className="flex flex-wrap gap-2">
                        {correlation.relatedThreats.map((threat, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-primary/20 border border-primary/30 rounded text-xs text-primary"
                          >
                            {threat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Detection Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {correlation.sources.map((source, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-secondary border border-border rounded text-xs text-foreground"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    correlation.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    correlation.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    correlation.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {correlation.severity}
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
