import React, { useState } from 'react';
import { Link, Database, TrendingUp, Brain, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  url: string;
  totalRecords: number;
  threatsDetected: number;
  riskScore: number;
  timeSeriesData: any[];
  mlPredictions: any[];
  radarData: any[];
}

export const ApiDataAnalysis: React.FC = () => {
  const { toast } = useToast();
  const [apiUrl, setApiUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [storing, setStoring] = useState(false);

  const handleAnalyze = async () => {
    if (!apiUrl) {
      toast({
        title: "Error",
        description: "Please enter an API URL",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    toast({
      title: "Analyzing API Data",
      description: "Fetching and analyzing data from the provided endpoint...",
    });

    // Simulate API analysis
    setTimeout(() => {
      const mockResults: AnalysisResult = {
        url: apiUrl,
        totalRecords: Math.floor(Math.random() * 10000) + 1000,
        threatsDetected: Math.floor(Math.random() * 500),
        riskScore: Math.random() * 100,
        timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
          hour: `${i}:00`,
          threats: Math.floor(Math.random() * 50),
          blocked: Math.floor(Math.random() * 30),
          critical: Math.floor(Math.random() * 10),
        })),
        mlPredictions: Array.from({ length: 12 }, (_, i) => ({
          month: `Month ${i + 1}`,
          predicted: Math.floor(Math.random() * 100) + 50,
          actual: i < 6 ? Math.floor(Math.random() * 100) + 50 : null,
          confidence: 75 + Math.random() * 20,
        })),
        radarData: [
          { category: 'Malware', value: Math.random() * 100 },
          { category: 'Phishing', value: Math.random() * 100 },
          { category: 'DDoS', value: Math.random() * 100 },
          { category: 'SQL Injection', value: Math.random() * 100 },
          { category: 'XSS', value: Math.random() * 100 },
          { category: 'Brute Force', value: Math.random() * 100 },
        ],
      };

      setResults(mockResults);
      setAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${mockResults.totalRecords} records, found ${mockResults.threatsDetected} threats`,
      });
    }, 3000);
  };

  const handleStoreData = async () => {
    if (!results) return;

    setStoring(true);
    toast({
      title: "Storing Data",
      description: "Saving analysis results to cloud database...",
    });

    try {
      // Store in Supabase
      const { error } = await supabase.from('threats').insert(
        results.timeSeriesData.map(item => ({
          attack_type: 'API_Analysis',
          country: 'Unknown',
          country_code: 'XX',
          latitude: 0,
          longitude: 0,
          threat_level: item.critical > 5 ? 'Critical' : item.threats > 30 ? 'High' : 'Medium',
          attacker_ip: `api-${Math.random().toString(36).substr(2, 9)}`,
          network_type: 'API',
          blocked: item.blocked > item.threats / 2,
        }))
      );

      if (error) throw error;

      toast({
        title: "Data Stored Successfully",
        description: `${results.timeSeriesData.length} records saved to cloud database`,
      });
    } catch (error) {
      console.error('Error storing data:', error);
      toast({
        title: "Storage Failed",
        description: "Failed to store data in database",
        variant: "destructive",
      });
    } finally {
      setStoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <Link className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-foreground">API Data Analysis</h2>
        </div>
        
        <div className="flex gap-3">
          <Input
            type="url"
            placeholder="Enter API endpoint URL (e.g., https://api.example.com/threats)"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="min-w-[120px]"
          >
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold text-foreground">{results.totalRecords.toLocaleString()}</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Threats Detected</p>
              <p className="text-2xl font-bold text-destructive">{results.threatsDetected}</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="text-2xl font-bold text-primary">{results.riskScore.toFixed(1)}%</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <Button 
                onClick={handleStoreData} 
                disabled={storing}
                className="w-full"
              >
                <Database className="mr-2" size={16} />
                {storing ? 'Storing...' : 'Store in Database'}
              </Button>
            </Card>
          </div>

          {/* Time Series Analysis */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="text-primary" size={20} />
              24-Hour Threat Timeline
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={results.timeSeriesData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="threats" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorThreats)" />
                <Area type="monotone" dataKey="blocked" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorBlocked)" />
                <Area type="monotone" dataKey="critical" stroke="hsl(var(--destructive))" fillOpacity={1} fill="url(#colorCritical)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* ML Predictions */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Brain className="text-primary" size={20} />
              Machine Learning Predictions (12-Month Forecast)
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={results.mlPredictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Actual Threats"
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Predicted Threats"
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={2}
                  name="Confidence %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Radar Chart */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Threat Category Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={results.radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="category" stroke="hsl(var(--foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--foreground))" />
                <Radar name="Threat Level" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};
