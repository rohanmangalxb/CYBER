import React, { useState } from 'react';
import { Upload, FileText, AlertTriangle, TrendingUp, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ThreatDetectionResult {
  fileName: string;
  fileSize: number;
  threatsDetected: number;
  riskLevel: string;
  analysisData: any[];
  predictions: any[];
}

export const FileUploadThreatDetection: React.FC = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<ThreatDetectionResult | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    toast({
      title: "Analyzing File",
      description: `Processing ${file.name} for threat detection...`,
    });

    // Simulate threat detection analysis
    setTimeout(() => {
      const mockResults: ThreatDetectionResult = {
        fileName: file.name,
        fileSize: file.size,
        threatsDetected: Math.floor(Math.random() * 50),
        riskLevel: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        analysisData: [
          { category: 'Malware', count: Math.floor(Math.random() * 20) },
          { category: 'Phishing', count: Math.floor(Math.random() * 15) },
          { category: 'DDoS', count: Math.floor(Math.random() * 10) },
          { category: 'SQL Injection', count: Math.floor(Math.random() * 8) },
          { category: 'XSS', count: Math.floor(Math.random() * 12) },
        ],
        predictions: Array.from({ length: 7 }, (_, i) => ({
          day: `Day ${i + 1}`,
          predicted: Math.floor(Math.random() * 30) + 10,
          confidence: Math.random() * 100,
        })),
      };

      setResults(mockResults);
      setUploading(false);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${mockResults.threatsDetected} potential threats`,
        variant: mockResults.riskLevel === 'Critical' || mockResults.riskLevel === 'High' ? 'destructive' : 'default',
      });
    }, 2000);
  };

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-foreground">Static Data Upload & Threat Detection</h2>
        </div>
        
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
            accept="*/*"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-foreground font-semibold mb-2">
              {uploading ? 'Analyzing...' : 'Click to upload any file type'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports all file formats - AI-powered threat detection
            </p>
          </label>
        </div>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="text-lg font-bold text-foreground truncate">{results.fileName}</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Threats Detected</p>
              <p className="text-2xl font-bold text-destructive">{results.threatsDetected}</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className={`text-2xl font-bold ${
                results.riskLevel === 'Critical' ? 'text-destructive' :
                results.riskLevel === 'High' ? 'text-orange-500' :
                results.riskLevel === 'Medium' ? 'text-yellow-500' :
                'text-green-500'
              }`}>
                {results.riskLevel}
              </p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="text-lg font-bold text-foreground">
                {(results.fileSize / 1024).toFixed(2)} KB
              </p>
            </Card>
          </div>

          {/* Threat Distribution Chart */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="text-primary" size={20} />
              Threat Distribution Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.analysisData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie Chart */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Threat Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={results.analysisData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {results.analysisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Prediction Chart */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Brain className="text-primary" size={20} />
              AI Threat Prediction (7-Day Forecast)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.predictions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
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
                  dataKey="predicted" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Predicted Threats"
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Confidence %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};
