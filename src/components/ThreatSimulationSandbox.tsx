import React, { useState } from 'react';
import { Play, Shield, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  attackType: string;
  severity: string;
}

interface SimulationResult {
  scenarioId: string;
  scenarioName: string;
  success: boolean;
  detectionTime: number;
  blockingEffectiveness: number;
  vulnerabilities: string[];
  timestamp: string;
}

export const ThreatSimulationSandbox: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const scenarios: SimulationScenario[] = [
    {
      id: 'sim_1',
      name: 'DDoS Attack Simulation',
      description: 'Simulate distributed denial of service attack with varying intensities',
      attackType: 'DDoS',
      severity: 'Critical'
    },
    {
      id: 'sim_2',
      name: 'SQL Injection Test',
      description: 'Test database security against SQL injection attempts',
      attackType: 'SQL Injection',
      severity: 'High'
    },
    {
      id: 'sim_3',
      name: 'Phishing Campaign',
      description: 'Simulate phishing attack vectors and measure detection rates',
      attackType: 'Phishing',
      severity: 'Medium'
    },
    {
      id: 'sim_4',
      name: 'Ransomware Infection',
      description: 'Test ransomware detection and containment protocols',
      attackType: 'Ransomware',
      severity: 'Critical'
    },
    {
      id: 'sim_5',
      name: 'Zero-Day Exploit',
      description: 'Simulate unknown vulnerability exploitation',
      attackType: 'Zero-Day',
      severity: 'Critical'
    },
    {
      id: 'sim_6',
      name: 'Brute Force Attack',
      description: 'Test password security and account lockout mechanisms',
      attackType: 'Brute Force',
      severity: 'High'
    }
  ];

  const handleRunSimulation = async (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setIsRunning(true);
    setSelectedScenario(scenarioId);

    toast({
      title: "Simulation Started",
      description: `Running ${scenario.name}...`
    });

    // Simulate the test
    await new Promise(resolve => setTimeout(resolve, 3000));

    const result: SimulationResult = {
      scenarioId,
      scenarioName: scenario.name,
      success: Math.random() > 0.3,
      detectionTime: Math.floor(Math.random() * 5000) + 500,
      blockingEffectiveness: Math.floor(Math.random() * 30) + 70,
      vulnerabilities: Math.random() > 0.5 ? [
        'Weak firewall rules',
        'Outdated security patches'
      ] : [],
      timestamp: new Date().toISOString()
    };

    setResults(prev => [result, ...prev]);
    setIsRunning(false);
    setSelectedScenario(null);

    toast({
      title: result.success ? "Simulation Passed" : "Vulnerabilities Detected",
      description: result.success 
        ? `Security configurations successfully defended against ${scenario.name}`
        : `Found ${result.vulnerabilities.length} vulnerabilities during ${scenario.name}`,
      variant: result.success ? "default" : "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Threat Simulation Sandbox</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur rounded-lg p-6 border-2 border-blue-500/50">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Total Tests</h3>
          </div>
          <p className="text-3xl font-bold text-blue-400">{results.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur rounded-lg p-6 border-2 border-green-500/50">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Passed</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">
            {results.filter(r => r.success).length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur rounded-lg p-6 border-2 border-red-500/50">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Failed</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">
            {results.filter(r => !r.success).length}
          </p>
        </div>
      </div>

      {/* Simulation Scenarios */}
      <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Attack Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map(scenario => (
            <div key={scenario.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{scenario.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{scenario.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  scenario.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  scenario.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {scenario.severity}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRunSimulation(scenario.id)}
                  disabled={isRunning}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {selectedScenario === scenario.id ? 'Running...' : 'Run Test'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results History */}
      <div className="bg-gray-900/50 backdrop-blur rounded-lg p-6 border-2 border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Test Results</h3>
        <div className="space-y-3">
          {results.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No test results yet. Run a simulation to see results.</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <h4 className="text-white font-semibold">{result.scenarioName}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Detection Time:</span>
                        <span className="text-white ml-2">{result.detectionTime}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Blocking Effectiveness:</span>
                        <span className="text-white ml-2">{result.blockingEffectiveness}%</span>
                      </div>
                    </div>
                    {result.vulnerabilities.length > 0 && (
                      <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded">
                        <p className="text-red-400 text-sm font-semibold mb-2">Vulnerabilities Found:</p>
                        <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                          {result.vulnerabilities.map((vuln, i) => (
                            <li key={i}>{vuln}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
