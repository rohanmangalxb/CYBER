import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Bell, Lock, Activity, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Threat {
  id: string | number;
  severity: string;
  attackType: string;
  country: string;
  attackerIp?: string;
  targetIp?: string;
  blocked: boolean;
  timestamp: string;
}

interface IncidentResponse {
  id: string;
  threatId: string | number;
  action: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  details: string;
}

interface IncidentResponseSystemProps {
  threats: Threat[];
  onBlockThreat?: (threatId: string | number) => void;
}

export const IncidentResponseSystem: React.FC<IncidentResponseSystemProps> = ({ 
  threats, 
  onBlockThreat 
}) => {
  const { toast } = useToast();
  const [responses, setResponses] = useState<IncidentResponse[]>([]);
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);
  const [criticalThreshold, setCriticalThreshold] = useState(5);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (!autoResponseEnabled) return;

    const criticalThreats = threats.filter(
      t => t.severity === 'Critical' && !t.blocked
    );

    if (criticalThreats.length >= criticalThreshold) {
      handleMassBlockingProtocol(criticalThreats);
    }

    criticalThreats.forEach(threat => {
      if (!responses.find(r => r.threatId === threat.id)) {
        handleAutomatedResponse(threat);
      }
    });
  }, [threats, autoResponseEnabled, criticalThreshold]);

  const handleAutomatedResponse = (threat: Threat) => {
    const responseId = `resp_${Date.now()}_${Math.random()}`;
    
    const response: IncidentResponse = {
      id: responseId,
      threatId: threat.id,
      action: 'Auto-Block',
      status: 'pending',
      timestamp: new Date().toISOString(),
      details: `Automated response triggered for ${threat.attackType} from ${threat.country}`
    };

    setResponses(prev => [response, ...prev]);

    // Simulate blocking action
    setTimeout(() => {
      setResponses(prev => 
        prev.map(r => 
          r.id === responseId 
            ? { ...r, status: 'completed' as const }
            : r
        )
      );

      onBlockThreat?.(threat.id);

      if (notificationsEnabled) {
        toast({
          title: "Threat Blocked",
          description: `${threat.attackType} attack from ${threat.attackerIp} has been blocked automatically.`,
          variant: "default",
        });

        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Critical Threat Blocked', {
            body: `${threat.attackType} from ${threat.country} blocked`,
            icon: '/favicon.ico'
          });
        }
      }
    }, 1000);
  };

  const handleMassBlockingProtocol = (threats: Threat[]) => {
    toast({
      title: "Mass Blocking Protocol Activated",
      description: `${threats.length} critical threats detected. Initiating automated defense.`,
      variant: "destructive",
    });

    threats.forEach(threat => {
      if (!responses.find(r => r.threatId === threat.id)) {
        handleAutomatedResponse(threat);
      }
    });
  };

  const handleManualBlock = (threatId: string | number) => {
    const responseId = `resp_${Date.now()}_${Math.random()}`;
    
    const response: IncidentResponse = {
      id: responseId,
      threatId,
      action: 'Manual Block',
      status: 'completed',
      timestamp: new Date().toISOString(),
      details: 'Threat manually blocked by operator'
    };

    setResponses(prev => [response, ...prev]);
    onBlockThreat?.(threatId);

    toast({
      title: "Threat Manually Blocked",
      description: "The threat has been blocked successfully.",
    });
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast({
            title: "Notifications Enabled",
            description: "You will now receive threat alerts.",
          });
        }
      });
    }
  };

  useEffect(() => {
    if (notificationsEnabled && 'Notification' in window) {
      requestNotificationPermission();
    }
  }, [notificationsEnabled]);

  const criticalThreats = threats.filter(t => t.severity === 'Critical' && !t.blocked);
  const blockedCount = threats.filter(t => t.blocked).length;

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="text-blue-400" size={24} />
          Incident Response Control Panel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={autoResponseEnabled}
                onChange={(e) => setAutoResponseEnabled(e.target.checked)}
                className="rounded"
              />
              Automated Response
            </label>
            <p className="text-xs text-gray-500">
              Automatically block critical threats
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="rounded"
              />
              Push Notifications
            </label>
            <p className="text-xs text-gray-500">
              Receive alerts for critical events
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">
              Critical Threshold: {criticalThreshold}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Trigger mass blocking at this count
            </p>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Critical Threats</p>
              <p className="text-3xl font-bold text-red-400">{criticalThreats.length}</p>
            </div>
            <AlertTriangle className="text-red-400" size={32} />
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Threats Blocked</p>
              <p className="text-3xl font-bold text-green-400">{blockedCount}</p>
            </div>
            <Lock className="text-green-400" size={32} />
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Automated Responses</p>
              <p className="text-3xl font-bold text-blue-400">{responses.length}</p>
            </div>
            <Activity className="text-blue-400" size={32} />
          </div>
        </div>
      </div>

      {/* Active Critical Threats */}
      {criticalThreats.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-red-500/30">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Active Critical Threats Requiring Attention
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {criticalThreats.slice(0, 10).map(threat => (
              <div key={threat.id} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                <div className="flex-1">
                  <p className="text-white font-semibold">{threat.attackType}</p>
                  <p className="text-sm text-gray-400">{threat.attackerIp} → {threat.targetIp}</p>
                </div>
                <button
                  onClick={() => handleManualBlock(threat.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                >
                  Block Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Log */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity size={20} />
          Response Activity Log
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {responses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No incident responses yet</p>
          ) : (
            responses.map(response => (
              <div key={response.id} className="flex items-start gap-3 bg-gray-800 p-3 rounded">
                {response.status === 'completed' ? (
                  <CheckCircle className="text-green-400 mt-1" size={20} />
                ) : response.status === 'failed' ? (
                  <XCircle className="text-red-400 mt-1" size={20} />
                ) : (
                  <Activity className="text-yellow-400 mt-1 animate-pulse" size={20} />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-white font-semibold">{response.action}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      response.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                      response.status === 'failed' ? 'bg-red-900/30 text-red-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {response.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{response.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(response.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};