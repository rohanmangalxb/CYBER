import React, { useState } from 'react';
import { Shield, Plus, Trash2, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Rule {
  id: string;
  type: 'ip' | 'country' | 'pattern';
  value: string;
  action: 'block' | 'allow';
  enabled: boolean;
}

export const AutomatedThreatBlocking: React.FC = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', type: 'ip', value: '192.168.1.100', action: 'block', enabled: true },
    { id: '2', type: 'country', value: 'Unknown', action: 'block', enabled: true },
  ]);
  const [whitelist, setWhitelist] = useState<string[]>(['10.0.0.0/8', '172.16.0.0/12']);
  const [blacklist, setBlacklist] = useState<string[]>(['45.142.214.0/24', '185.220.101.0/24']);
  const [newRule, setNewRule] = useState({ type: 'ip', value: '', action: 'block' });
  const [newWhitelist, setNewWhitelist] = useState('');
  const [newBlacklist, setNewBlacklist] = useState('');

  const addRule = () => {
    if (!newRule.value) {
      toast({
        title: "Error",
        description: "Please enter a value for the rule",
        variant: "destructive",
      });
      return;
    }

    const rule: Rule = {
      id: Date.now().toString(),
      type: newRule.type as 'ip' | 'country' | 'pattern',
      value: newRule.value,
      action: newRule.action as 'block' | 'allow',
      enabled: true,
    };

    setRules([...rules, rule]);
    setNewRule({ type: 'ip', value: '', action: 'block' });
    
    toast({
      title: "Rule Added",
      description: `New ${rule.action} rule created successfully`,
    });
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast({
      title: "Rule Deleted",
      description: "Blocking rule removed successfully",
    });
  };

  const addToWhitelist = () => {
    if (newWhitelist && !whitelist.includes(newWhitelist)) {
      setWhitelist([...whitelist, newWhitelist]);
      setNewWhitelist('');
      toast({
        title: "Added to Whitelist",
        description: `${newWhitelist} will always be allowed`,
      });
    }
  };

  const addToBlacklist = () => {
    if (newBlacklist && !blacklist.includes(newBlacklist)) {
      setBlacklist([...blacklist, newBlacklist]);
      setNewBlacklist('');
      toast({
        title: "Added to Blacklist",
        description: `${newBlacklist} will always be blocked`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Rule */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-primary" size={24} />
          <h2 className="text-xl font-bold text-foreground">Automated Threat Blocking Rules</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select 
            value={newRule.type}
            onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
            className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
          >
            <option value="ip">IP Address</option>
            <option value="country">Country</option>
            <option value="pattern">Pattern</option>
          </select>
          
          <Input
            placeholder="Enter value..."
            value={newRule.value}
            onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
          />
          
          <select 
            value={newRule.action}
            onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
            className="px-3 py-2 rounded-md border border-border bg-background text-foreground"
          >
            <option value="block">Block</option>
            <option value="allow">Allow</option>
          </select>
          
          <Button onClick={addRule}>
            <Plus className="mr-2" size={16} />
            Add Rule
          </Button>
        </div>
      </Card>

      {/* Active Rules */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Active Blocking Rules</h3>
        <div className="space-y-2">
          {rules.map(rule => (
            <div 
              key={rule.id} 
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    rule.enabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  {rule.enabled ? <Check size={20} className="text-primary-foreground" /> : <X size={20} className="text-muted-foreground" />}
                </button>
                
                <div>
                  <p className="font-semibold text-foreground">
                    {rule.type.toUpperCase()}: {rule.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Action: {rule.action.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteRule(rule.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Whitelist Management */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Whitelist (Always Allow)</h3>
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Enter IP or CIDR range..."
            value={newWhitelist}
            onChange={(e) => setNewWhitelist(e.target.value)}
          />
          <Button onClick={addToWhitelist}>
            <Plus className="mr-2" size={16} />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {whitelist.map((item, index) => (
            <div 
              key={index} 
              className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm flex items-center gap-2"
            >
              {item}
              <button
                onClick={() => setWhitelist(whitelist.filter((_, i) => i !== index))}
                className="hover:text-green-300"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Blacklist Management */}
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Blacklist (Always Block)</h3>
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="Enter IP or CIDR range..."
            value={newBlacklist}
            onChange={(e) => setNewBlacklist(e.target.value)}
          />
          <Button onClick={addToBlacklist}>
            <Plus className="mr-2" size={16} />
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {blacklist.map((item, index) => (
            <div 
              key={index} 
              className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm flex items-center gap-2"
            >
              {item}
              <button
                onClick={() => setBlacklist(blacklist.filter((_, i) => i !== index))}
                className="hover:text-red-300"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
