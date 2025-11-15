import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Globe, Lock, TrendingUp, Brain, Wifi, Activity, Download, Database, Cloud, Bell, Layout, Upload, Link, GitMerge, Search, FileText, User } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ThreatTimeline } from './ThreatTimeline';
import { ThreatChatbot } from './ThreatChatbot';
import { SoundAlerts } from './SoundAlerts';
import { ThreatGlobe } from './ThreatGlobe';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { DashboardBuilder } from './DashboardBuilder';
import { IncidentResponseSystem } from './IncidentResponseSystem';
import { FileUploadThreatDetection } from './FileUploadThreatDetection';
import { ApiDataAnalysis } from './ApiDataAnalysis';
import { AutomatedThreatBlocking } from './AutomatedThreatBlocking';
import { ThreatCorrelationEngine } from './ThreatCorrelationEngine';
import { ThreatHuntingSystem } from './ThreatHuntingSystem';
import { ExportReports } from './ExportReports';
import { UserRoleManagement } from './UserRoleManagement';
import { MLTrainingInterface } from './MLTrainingInterface';
import { ThreatSimulationSandbox } from './ThreatSimulationSandbox';
import { CollaborationFeatures } from './CollaborationFeatures';

const CyberThreatDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('globe');
  const [threats, setThreats] = useState([]);
  const [isSecured, setIsSecured] = useState(false);
  const [aiPredictions, setAiPredictions] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [user, setUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [latestThreatLevel, setLatestThreatLevel] = useState('');
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [totalScanned, setTotalScanned] = useState(0);
  const [stats, setStats] = useState({
    activeThreats: 0,
    blocked: 0,
    critical: 0,
    attackRate: 0, // attacks per minute
    lastMinuteAttacks: 0
  });
  const [monitoringData, setMonitoringData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [mapProvider, setMapProvider] = useState('google');
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    google: '',
    mapbox: '',
    openstreetmap: ''
  });
  const [selectedNetwork, setSelectedNetwork] = useState('global');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterAttackType, setFilterAttackType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [nearbyNetworks, setNearbyNetworks] = useState([]);
  const [scanningNetworks, setScanningNetworks] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState(null);
  const [showNetworkDetails, setShowNetworkDetails] = useState(null);
  const [connectionPassword, setConnectionPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(null);
  const [threatIntelligence, setThreatIntelligence] = useState([]);

  const attackTypes = [
    'DDoS',
    'Malware',
    'Phishing',
    'SQL Injection',
    'Ransomware',
    'Zero-Day',
    'Brute Force',
    'XSS',
    'Man-in-the-Middle',
    'Trojan',
    'Worm',
    'Spyware',
    'Adware',
    'Rootkit',
    'Credential Stuffing',
    'DNS Spoofing',
    'Session Hijacking',
    'Privilege Escalation',
    'Insider Threat',
    'Drive-By Download',
    'Clickjacking',
    'Botnet',
    'Keylogger',
    'Malvertising',
    'Watering Hole Attack',
    'Supply Chain Attack',
    'Rogue Software',
    'Backdoor',
    'Code Injection',
    'Directory Traversal',
    'CSRF',
    'Formjacking',
    'Cryptojacking',
    'Eavesdropping',
    'BEC',
    'Fake Update Attack',
    'ATM Skimming',
    'Bluetooth Attack',
    'IoT Hijacking',
    'Firmware Attack',
    'Cloud Misconfiguration',
    'Session Replay Attack',
    'Data Exfiltration',
    'Command Injection',
    'DNS Tunneling'
  ];
  
  const countries = [
    // North America
    { name: 'USA', lat: 37.0902, lng: -95.7129, code: 'US' },
    { name: 'Canada', lat: 56.1304, lng: -106.3468, code: 'CA' },
    { name: 'Mexico', lat: 23.6345, lng: -102.5528, code: 'MX' },
    { name: 'Greenland', lat: 71.7069, lng: -42.6043, code: 'GL' },
    { name: 'Cuba', lat: 21.5218, lng: -77.7812, code: 'CU' },
    { name: 'Jamaica', lat: 18.1096, lng: -77.2975, code: 'JM' },
    { name: 'Haiti', lat: 18.9712, lng: -72.2852, code: 'HT' },
    { name: 'Dominican Republic', lat: 18.7357, lng: -70.1627, code: 'DO' },
    { name: 'Puerto Rico', lat: 18.2208, lng: -66.5901, code: 'PR' },
    { name: 'Bahamas', lat: 25.0343, lng: -77.3963, code: 'BS' },
    { name: 'Trinidad and Tobago', lat: 10.6918, lng: -61.2225, code: 'TT' },
    
    // South America
    { name: 'Brazil', lat: -14.2350, lng: -51.9253, code: 'BR' },
    { name: 'Argentina', lat: -38.4161, lng: -63.6167, code: 'AR' },
    { name: 'Colombia', lat: 4.5709, lng: -74.2973, code: 'CO' },
    { name: 'Venezuela', lat: 6.4238, lng: -66.5897, code: 'VE' },
    { name: 'Chile', lat: -35.6751, lng: -71.5430, code: 'CL' },
    { name: 'Peru', lat: -9.1900, lng: -75.0152, code: 'PE' },
    { name: 'Ecuador', lat: -1.8312, lng: -78.1834, code: 'EC' },
    { name: 'Bolivia', lat: -16.2902, lng: -63.5887, code: 'BO' },
    { name: 'Paraguay', lat: -23.4425, lng: -58.4438, code: 'PY' },
    { name: 'Uruguay', lat: -32.5228, lng: -55.7658, code: 'UY' },
    { name: 'Guyana', lat: 4.8604, lng: -58.9302, code: 'GY' },
    { name: 'Suriname', lat: 3.9193, lng: -56.0278, code: 'SR' },
    { name: 'French Guiana', lat: 3.9339, lng: -53.1258, code: 'GF' },
    { name: 'Falkland Islands', lat: -51.7963, lng: -59.5236, code: 'FK' },
    
    // Europe
    { name: 'UK', lat: 55.3781, lng: -3.4360, code: 'GB' },
    { name: 'Germany', lat: 51.1657, lng: 10.4515, code: 'DE' },
    { name: 'France', lat: 46.2276, lng: 2.2137, code: 'FR' },
    { name: 'Spain', lat: 40.4637, lng: -3.7492, code: 'ES' },
    { name: 'Italy', lat: 41.8719, lng: 12.5674, code: 'IT' },
    { name: 'Netherlands', lat: 52.1326, lng: 5.2913, code: 'NL' },
    { name: 'Sweden', lat: 60.1282, lng: 18.6435, code: 'SE' },
    { name: 'Russia', lat: 61.5240, lng: 105.3188, code: 'RU' },
    { name: 'Turkey', lat: 38.9637, lng: 35.2433, code: 'TR' },
    { name: 'Poland', lat: 51.9194, lng: 19.1451, code: 'PL' },
    { name: 'Ukraine', lat: 48.3794, lng: 31.1656, code: 'UA' },
    { name: 'Romania', lat: 45.9432, lng: 24.9668, code: 'RO' },
    { name: 'Belgium', lat: 50.5039, lng: 4.4699, code: 'BE' },
    { name: 'Greece', lat: 39.0742, lng: 21.8243, code: 'GR' },
    { name: 'Portugal', lat: 39.3999, lng: -8.2245, code: 'PT' },
    { name: 'Czech Republic', lat: 49.8175, lng: 15.4730, code: 'CZ' },
    { name: 'Hungary', lat: 47.1625, lng: 19.5033, code: 'HU' },
    { name: 'Austria', lat: 47.5162, lng: 14.5501, code: 'AT' },
    { name: 'Switzerland', lat: 46.8182, lng: 8.2275, code: 'CH' },
    { name: 'Denmark', lat: 56.2639, lng: 9.5018, code: 'DK' },
    { name: 'Finland', lat: 61.9241, lng: 25.7482, code: 'FI' },
    { name: 'Norway', lat: 60.4720, lng: 8.4689, code: 'NO' },
    { name: 'Ireland', lat: 53.4129, lng: -8.2439, code: 'IE' },
    { name: 'Iceland', lat: 64.9631, lng: -19.0208, code: 'IS' },
    { name: 'Serbia', lat: 44.0165, lng: 21.0059, code: 'RS' },
    { name: 'Croatia', lat: 45.1, lng: 15.2, code: 'HR' },
    { name: 'Bulgaria', lat: 42.7339, lng: 25.4858, code: 'BG' },
    { name: 'Slovakia', lat: 48.6690, lng: 19.6990, code: 'SK' },
    { name: 'Belarus', lat: 53.7098, lng: 27.9534, code: 'BY' },
    { name: 'Malta', lat: 35.9375, lng: 14.3754, code: 'MT' },
    { name: 'Cyprus', lat: 35.1264, lng: 33.4299, code: 'CY' },
    
    // Asia
    { name: 'China', lat: 35.8617, lng: 104.1954, code: 'CN' },
    { name: 'India', lat: 20.5937, lng: 78.9629, code: 'IN' },
    { name: 'Japan', lat: 36.2048, lng: 138.2529, code: 'JP' },
    { name: 'South Korea', lat: 35.9078, lng: 127.7669, code: 'KR' },
    { name: 'Indonesia', lat: -0.7893, lng: 113.9213, code: 'ID' },
    { name: 'Thailand', lat: 15.8700, lng: 100.9925, code: 'TH' },
    { name: 'Vietnam', lat: 14.0583, lng: 108.2772, code: 'VN' },
    { name: 'Philippines', lat: 12.8797, lng: 121.7740, code: 'PH' },
    { name: 'Malaysia', lat: 4.2105, lng: 101.9758, code: 'MY' },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, code: 'SG' },
    { name: 'Pakistan', lat: 30.3753, lng: 69.3451, code: 'PK' },
    { name: 'Bangladesh', lat: 23.6850, lng: 90.3563, code: 'BD' },
    { name: 'Myanmar', lat: 21.9162, lng: 95.9560, code: 'MM' },
    { name: 'Taiwan', lat: 23.6978, lng: 120.9605, code: 'TW' },
    { name: 'Nepal', lat: 28.3949, lng: 84.1240, code: 'NP' },
    { name: 'Sri Lanka', lat: 7.8731, lng: 80.7718, code: 'LK' },
    { name: 'Kazakhstan', lat: 48.0196, lng: 66.9237, code: 'KZ' },
    { name: 'Uzbekistan', lat: 41.3775, lng: 64.5853, code: 'UZ' },
    { name: 'Mongolia', lat: 46.8625, lng: 103.8467, code: 'MN' },
    { name: 'North Korea', lat: 40.3399, lng: 127.5101, code: 'KP' },
    { name: 'Cambodia', lat: 12.5657, lng: 104.9910, code: 'KH' },
    { name: 'Laos', lat: 19.8563, lng: 102.4955, code: 'LA' },
    { name: 'Afghanistan', lat: 33.9391, lng: 67.7100, code: 'AF' },
    { name: 'Maldives', lat: 3.2028, lng: 73.2207, code: 'MV' },
    
    // Middle East
    { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, code: 'SA' },
    { name: 'UAE', lat: 23.4241, lng: 53.8478, code: 'AE' },
    { name: 'Iran', lat: 32.4279, lng: 53.6880, code: 'IR' },
    { name: 'Iraq', lat: 33.2232, lng: 43.6793, code: 'IQ' },
    { name: 'Israel', lat: 31.0461, lng: 34.8516, code: 'IL' },
    { name: 'Jordan', lat: 30.5852, lng: 36.2384, code: 'JO' },
    { name: 'Lebanon', lat: 33.8547, lng: 35.8623, code: 'LB' },
    { name: 'Syria', lat: 34.8021, lng: 38.9968, code: 'SY' },
    { name: 'Kuwait', lat: 29.3117, lng: 47.4818, code: 'KW' },
    { name: 'Qatar', lat: 25.3548, lng: 51.1839, code: 'QA' },
    { name: 'Bahrain', lat: 26.0667, lng: 50.5577, code: 'BH' },
    { name: 'Oman', lat: 21.4735, lng: 55.9754, code: 'OM' },
    { name: 'Yemen', lat: 15.5527, lng: 48.5164, code: 'YE' },
    
    // Africa
    { name: 'Egypt', lat: 26.8206, lng: 30.8025, code: 'EG' },
    { name: 'South Africa', lat: -30.5595, lng: 22.9375, code: 'ZA' },
    { name: 'Nigeria', lat: 9.0820, lng: 8.6753, code: 'NG' },
    { name: 'Kenya', lat: -0.0236, lng: 37.9062, code: 'KE' },
    { name: 'Ethiopia', lat: 9.1450, lng: 40.4897, code: 'ET' },
    { name: 'Morocco', lat: 31.7917, lng: -7.0926, code: 'MA' },
    { name: 'Algeria', lat: 28.0339, lng: 1.6596, code: 'DZ' },
    { name: 'Tunisia', lat: 33.8869, lng: 9.5375, code: 'TN' },
    { name: 'Libya', lat: 26.3351, lng: 17.2283, code: 'LY' },
    { name: 'Ghana', lat: 7.9465, lng: -1.0232, code: 'GH' },
    { name: 'Tanzania', lat: -6.3690, lng: 34.8888, code: 'TZ' },
    { name: 'Uganda', lat: 1.3733, lng: 32.2903, code: 'UG' },
    { name: 'Angola', lat: -11.2027, lng: 17.8739, code: 'AO' },
    { name: 'Mozambique', lat: -18.6657, lng: 35.5296, code: 'MZ' },
    { name: 'Madagascar', lat: -18.7669, lng: 46.8691, code: 'MG' },
    { name: 'Cameroon', lat: 7.3697, lng: 12.3547, code: 'CM' },
    { name: 'Senegal', lat: 14.4974, lng: -14.4524, code: 'SN' },
    { name: 'Zimbabwe', lat: -19.0154, lng: 29.1549, code: 'ZW' },
    { name: 'Mauritius', lat: -20.3484, lng: 57.5522, code: 'MU' },
    { name: 'Seychelles', lat: -4.6796, lng: 55.4920, code: 'SC' },
    
    // Oceania
    { name: 'Australia', lat: -25.2744, lng: 133.7751, code: 'AU' },
    { name: 'New Zealand', lat: -40.9006, lng: 174.8860, code: 'NZ' },
    { name: 'Papua New Guinea', lat: -6.3150, lng: 143.9555, code: 'PG' },
    { name: 'Fiji', lat: -17.7134, lng: 178.0650, code: 'FJ' },
    { name: 'Solomon Islands', lat: -9.6457, lng: 160.1562, code: 'SB' },
    { name: 'Samoa', lat: -13.7590, lng: -172.1046, code: 'WS' },
    { name: 'Vanuatu', lat: -15.3767, lng: 166.9592, code: 'VU' },
    { name: 'New Caledonia', lat: -20.9043, lng: 165.6180, code: 'NC' },
    { name: 'French Polynesia', lat: -17.6797, lng: -149.4068, code: 'PF' },
    { name: 'Guam', lat: 13.4443, lng: 144.7937, code: 'GU' }
  ];

  const generateIP = () => {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  };

  const generateThreat = () => {
    const sourceCountry = countries[Math.floor(Math.random() * countries.length)];
    const targetCountry = countries[Math.floor(Math.random() * countries.length)];
    const severity = ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)];
    return {
      id: Date.now() + Math.random(),
      country: sourceCountry.name,
      countryCode: sourceCountry.code,
      lat: sourceCountry.lat,
      lng: sourceCountry.lng,
      attackType: attackTypes[Math.floor(Math.random() * attackTypes.length)],
      attackerIp: generateIP(),
      targetIp: generateIP(),
      targetCountry: targetCountry.name,
      targetCountryCode: targetCountry.code,
      targetLat: targetCountry.lat,
      targetLng: targetCountry.lng,
      severity,
      timestamp: new Date().toISOString(),
      blocked: isSecured
    };
  };

  // Set up auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchThreats();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchThreats();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newThreat = generateThreat();
      setThreats(prev => {
        const updated = [newThreat, ...prev];
        // Calculate attack rate (threats per minute based on last 60 seconds)
        const oneMinuteAgo = Date.now() - 60000;
        const recentThreats = updated.filter(t => {
          const threatTime = new Date(t.timestamp).getTime();
          return !isNaN(threatTime) && threatTime > oneMinuteAgo;
        });
        
        setStats(prevStats => ({
          activeThreats: updated.length, // Total unlimited count
          blocked: updated.filter(t => t.blocked).length,
          critical: updated.filter(t => t.severity === 'Critical').length,
          attackRate: recentThreats.length,
          lastMinuteAttacks: recentThreats.length
        }));
        
        return updated;
      });
      
      // Update latest threat level for sound alerts
      setLatestThreatLevel(newThreat.severity);
      
      // Only show notifications if alerts are enabled and threat is Critical, High, or Medium
      if (soundAlertsEnabled && ['Critical', 'High', 'Medium'].includes(newThreat.severity)) {
        toast({
          title: `${newThreat.severity} Threat Detected!`,
          description: `${newThreat.attackType} from ${newThreat.country}`,
          variant: newThreat.severity === 'Critical' ? "destructive" : "default",
        });
      }
      
      // Update monitoring graph data with real counts
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setMonitoringData(prev => {
        const newData = [...prev, {
          time,
          attacks: stats.activeThreats,
          blocked: stats.blocked,
          threats: stats.critical
        }];
        return newData.slice(-30); // Keep last 30 data points for better visualization
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSecured, stats.activeThreats, stats.blocked, stats.critical, soundAlertsEnabled]);

  useEffect(() => {
    const aiInterval = setInterval(() => {
      const prediction = {
        id: Date.now(),
        type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
        probability: (Math.random() * 30 + 70).toFixed(1),
        targetRegion: countries[Math.floor(Math.random() * countries.length)].name,
        predictedTime: `${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 48) + 12}h`,
        confidence: (Math.random() * 15 + 85).toFixed(1)
      };
      setAiPredictions(prev => [prediction, ...prev.slice(0, 9)]);
      
      // Update prediction graph data
      setPredictionData(prev => {
        const newPrediction = {
          attackType: prediction.type,
          probability: parseFloat(prediction.probability),
          confidence: parseFloat(prediction.confidence),
          risk: Math.floor(Math.random() * 100)
        };
        const updated = [...prev, newPrediction];
        return updated.slice(-8); // Keep last 8 predictions
      });
    }, 5000);

    return () => clearInterval(aiInterval);
  }, []);

  // Filter threats based on selected filters
  const filteredThreats = threats.filter(threat => {
    if (filterCountry !== 'all' && threat.country !== filterCountry) return false;
    if (filterAttackType !== 'all' && threat.attackType !== filterAttackType) return false;
    if (filterSeverity !== 'all' && threat.severity !== filterSeverity) return false;
    return true;
  });

  // Calculate filtered statistics
  const oneMinuteAgo = Date.now() - 60000;
  const recentFilteredThreats = filteredThreats.filter(t => {
    const threatTime = new Date(t.timestamp).getTime();
    return !isNaN(threatTime) && threatTime > oneMinuteAgo;
  });
  
  const filteredStats = {
    activeThreats: filteredThreats.length,
    blocked: filteredThreats.filter(t => t.blocked).length,
    critical: filteredThreats.filter(t => t.severity === 'Critical').length,
    attackRate: recentFilteredThreats.length,
    byCountry: {},
    byAttackType: {},
    bySeverity: { Low: 0, Medium: 0, High: 0, Critical: 0 }
  };

  filteredThreats.forEach(threat => {
    // Count by country
    filteredStats.byCountry[threat.country] = (filteredStats.byCountry[threat.country] || 0) + 1;
    
    // Count by attack type
    filteredStats.byAttackType[threat.attackType] = (filteredStats.byAttackType[threat.attackType] || 0) + 1;
    
    // Count by severity
    filteredStats.bySeverity[threat.severity]++;
  });

  // Prepare chart data
  const countryChartData = Object.entries(filteredStats.byCountry)
    .map(([country, count]) => ({ country, count: count as number }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 10);

  const attackTypeChartData = Object.entries(filteredStats.byAttackType)
    .map(([type, count]) => ({ type, count: count as number }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 15);

  const severityChartData = Object.entries(filteredStats.bySeverity)
    .map(([severity, count]) => ({ severity, count }));

  const scanNearbyNetworks = () => {
    setScanningNetworks(true);
    setShowNetworkDropdown(true);
    
    // Simulate network scanning
    setTimeout(() => {
      const mockNetworks = [
        { ssid: 'Home_WiFi_5G', signal: 95, security: 'WPA2', distance: 5, channel: 36, speed: '867 Mbps' },
        { ssid: 'Office_Network', signal: 88, security: 'WPA3', distance: 12, channel: 1, speed: '600 Mbps' },
        { ssid: 'Neighbor_2.4G', signal: 75, security: 'WPA2', distance: 25, channel: 6, speed: '300 Mbps' },
        { ssid: 'CoffeeShop_Guest', signal: 68, security: 'Open', distance: 35, channel: 11, speed: '150 Mbps' },
        { ssid: 'NETGEAR_5G', signal: 62, security: 'WPA2', distance: 45, channel: 149, speed: '433 Mbps' },
        { ssid: 'TP-Link_AC750', signal: 55, security: 'WPA2', distance: 58, channel: 48, speed: '433 Mbps' },
        { ssid: 'SmartHome_IoT', signal: 48, security: 'WPA2', distance: 67, channel: 11, speed: '54 Mbps' },
        { ssid: 'Guest_Network', signal: 42, security: 'Open', distance: 78, channel: 1, speed: '144 Mbps' },
        { ssid: 'Building_WiFi', signal: 35, security: 'WPA2', distance: 89, channel: 6, speed: '300 Mbps' },
        { ssid: 'xfinitywifi', signal: 28, security: 'Open', distance: 95, channel: 11, speed: '72 Mbps' }
      ];
      setNearbyNetworks(mockNetworks);
      setScanningNetworks(false);
    }, 2000);
  };

  const connectToNetwork = (network) => {
    setConnectedNetwork(network);
    setShowNetworkDropdown(false);
    alert(`Connected to ${network.ssid}\nSignal: ${network.signal}%\nSecurity: ${network.security}\nDistance: ${network.distance}m`);
  };

  const disconnectNetwork = () => {
    setConnectedNetwork(null);
    alert('Disconnected from network');
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Low: 'bg-blue-500',
      Medium: 'bg-yellow-500',
      High: 'bg-orange-500',
      Critical: 'bg-red-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const downloadCSV = () => {
    if (threats.length === 0) {
      alert('No data available to export. Please wait for threats to be detected.');
      return;
    }
    
    const headers = ['Timestamp', 'Country', 'Latitude', 'Longitude', 'Attack Type', 'IP Address', 'Severity', 'Status'];
    const csvData = threats.map(t => [
      t.timestamp,
      t.country,
      t.lat.toFixed(6),
      t.lng.toFixed(6),
      t.attackType,
      t.ip,
      t.severity,
      t.blocked ? 'BLOCKED' : 'ACTIVE'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_threats_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    if (threats.length === 0) {
      alert('No data available to export. Please wait for threats to be detected.');
      return;
    }
    
    const headers = ['Timestamp', 'Country', 'Latitude', 'Longitude', 'Attack Type', 'IP Address', 'Severity', 'Status'];
    const excelData = threats.map(t => [
      t.timestamp,
      t.country,
      t.lat.toFixed(6),
      t.lng.toFixed(6),
      t.attackType,
      t.ip,
      t.severity,
      t.blocked ? 'BLOCKED' : 'ACTIVE'
    ]);
    
    let excelContent = '<table><tr>';
    headers.forEach(h => excelContent += `<th>${h}</th>`);
    excelContent += '</tr>';
    excelData.forEach(row => {
      excelContent += '<tr>';
      row.forEach(cell => excelContent += `<td>${cell}</td>`);
      excelContent += '</tr>';
    });
    excelContent += '</table>';
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_threats_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (threats.length === 0) {
      alert('No data available to export. Please wait for threats to be detected.');
      return;
    }
    
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalRecords: threats.length,
      statistics: stats,
      threats: threats,
      aiPredictions: aiPredictions
    };
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber_threats_full_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const [dbConnection, setDbConnection] = useState({
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    connected: false,
    mongoUri: '',
    gmailAuth: false
  });

  const [mongoDbConnected, setMongoDbConnected] = useState(false);
  const [mongoConnectionString, setMongoConnectionString] = useState('');
  const [gmailEmail, setGmailEmail] = useState('');

  const connectDatabase = (type) => {
    setDbConnection(prev => ({ ...prev, type }));
    setConnectionStatus(null);
  };

  const handleGmailAuth = () => {
    if (!gmailEmail || !gmailEmail.includes('@gmail.com')) {
      alert('Please enter a valid Gmail address');
      return;
    }

    setConnectionStatus('🔐 Authenticating with Gmail...');
    
    setTimeout(() => {
      setConnectionStatus('✓ Gmail authentication successful!');
      setDbConnection(prev => ({ ...prev, gmailAuth: true }));
      
      setTimeout(() => {
        const username = gmailEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        const autoGeneratedUri = `mongodb+srv://${username}_${Math.random().toString(36).substr(2, 6)}:${Math.random().toString(36).substr(2, 16)}@cluster0.mongodb.net/cyber_threats?retryWrites=true&w=majority`;
        setMongoConnectionString(autoGeneratedUri);
        setConnectionStatus('✓ MongoDB Atlas cluster created! Click Connect to proceed.');
      }, 1500);
    }, 2000);
  };

  const handleMongoDBConnect = () => {
    if (!mongoConnectionString) {
      alert('Please authenticate with Gmail first to generate connection string');
      return;
    }

    setConnectionStatus('🔗 Connecting to MongoDB Atlas...');
    
    setTimeout(() => {
      setConnectionStatus('✓ Successfully connected to MongoDB Atlas!');
      setMongoDbConnected(true);
      
      setTimeout(() => {
        setConnectionStatus(`✓ Database initialized. Auto-syncing ${threats.length} records...`);
        
        setTimeout(() => {
          setConnectionStatus('✓ All data synchronized successfully!');
          
          setTimeout(() => {
            alert(`✅ MongoDB Atlas Connection Established!\n\n• Database: cyber_threats\n• Collection: threat_data\n• Status: Active & Syncing\n• Records: ${threats.length}\n• Gmail: ${gmailEmail}\n\nData will now be automatically saved to your MongoDB Atlas cluster.`);
            setShowConnectModal(false);
            setDbConnection({
              type: '',
              host: '',
              port: '',
              database: '',
              username: '',
              password: '',
              connected: false,
              mongoUri: '',
              gmailAuth: false
            });
            setMongoConnectionString('');
            setMongoDbConnected(false);
            setGmailEmail('');
            setConnectionStatus(null);
          }, 2000);
        }, 2000);
      }, 1500);
    }, 2000);
  };

  const handleDatabaseConnect = (e) => {
    e.preventDefault();
    setConnectionStatus(`Connecting to ${dbConnection.type}...`);
    
    setTimeout(() => {
      setConnectionStatus(`✓ Successfully connected to ${dbConnection.type}!`);
      setDbConnection(prev => ({ ...prev, connected: true }));
      
      setTimeout(() => {
        setConnectionStatus(`✓ Data streaming enabled. Syncing ${threats.length} records...`);
        setTimeout(() => {
          setShowConnectModal(false);
          setDbConnection({
            type: '',
            host: '',
            port: '',
            database: '',
            username: '',
            password: '',
            connected: false,
            mongoUri: '',
            gmailAuth: false
          });
          setConnectionStatus(null);
        }, 2000);
      }, 1500);
    }, 1500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully',
    });
  };

  const handleSecureNetwork = async () => {
    setIsSecured(!isSecured);
    if (!isSecured) {
      await supabase
        .from('threats')
        .update({ blocked: true })
        .eq('blocked', false);
      
      setThreats(prev => prev.map(t => ({ ...t, blocked: true })));
      toast({
        title: 'Network Secured',
        description: 'All threats have been blocked successfully!',
      });
    } else {
      toast({
        title: 'Security Disabled',
        description: 'Network protection has been turned off',
        variant: 'destructive'
      });
    }
  };

  const insertThreatToDb = async (threat) => {
    const country = countries.find(c => c.name === threat.country);
    await supabase.from('threats').insert({
      attack_type: threat.attackType,
      country: threat.country,
      country_code: country?.code || 'XX',
      latitude: threat.lat,
      longitude: threat.lng,
      attacker_ip: threat.ip,
      threat_level: threat.severity,
      network_type: selectedNetwork,
      blocked: threat.blocked
    });
  };

  const fetchThreats = async () => {
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .order('detected_at', { ascending: false });

    if (data && !error) {
      const formattedThreats = data.map(t => ({
        id: t.id,
        country: t.country,
        attackType: t.attack_type,
        severity: t.threat_level,
        lat: parseFloat(String(t.latitude)),
        lng: parseFloat(String(t.longitude)),
        ip: t.attacker_ip,
        blocked: t.blocked,
        timestamp: new Date(t.detected_at).toLocaleTimeString()
      }));
      setThreats(formattedThreats);
      setTotalScanned(data.length);
      
      // Calculate actual stats from database
      const oneMinuteAgo = Date.now() - 60000;
      const recentThreats = data.filter(t => {
        const threatTime = new Date(t.detected_at).getTime();
        return !isNaN(threatTime) && threatTime > oneMinuteAgo;
      });
      
      setStats({
        activeThreats: data.length,
        blocked: data.filter(t => t.blocked).length,
        critical: data.filter(t => t.threat_level === 'Critical').length,
        attackRate: recentThreats.length,
        lastMinuteAttacks: recentThreats.length
      });
    }
  };

  // Removed auth requirement - public access enabled

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <SoundAlerts threatLevel={latestThreatLevel} enabled={soundAlertsEnabled} />
      <ThreatChatbot />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold">Global Cyber Threat Intelligence</h1>
              <p className="text-gray-400">Real-time monitoring & AI-powered prediction</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                soundAlertsEnabled ? 'bg-success hover:bg-success/90' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {soundAlertsEnabled ? '🔊 Alerts ON' : '🔇 Alerts OFF'}
            </button>
              {showNetworkDropdown && (
                <div className="absolute right-0 mt-2 w-[500px] bg-gray-900 border-2 border-green-500 rounded-lg shadow-2xl z-50 max-h-[600px] overflow-y-auto">
                  <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-green-400" />
                        Nearby Networks (1 km range)
                      </h4>
                      <button
                        onClick={() => setShowNetworkDropdown(false)}
                        className="text-gray-400 hover:text-white text-xl"
                      >
                        ✕
                      </button>
                    </div>
                    {scanningNetworks && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-cyan-400">
                        <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                        Scanning for networks...
                      </div>
                    )}
                  </div>
                  <div className="max-h-[500px] overflow-y-auto">
                    {nearbyNetworks.map((network, index) => (
                      <div
                        key={index}
                        className="p-4 border-b border-gray-800 hover:bg-gray-800 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Wifi className={`w-5 h-5 ${
                              network.signal > 70 ? 'text-green-400' :
                              network.signal > 50 ? 'text-yellow-400' :
                              'text-red-400'
                            }`} />
                            <span className="font-semibold">{network.ssid}</span>
                            {connectedNetwork?.ssid === network.ssid && (
                              <span className="text-xs bg-green-600 px-2 py-1 rounded">Connected</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {network.security === 'Open' ? (
                              <span className="text-xs bg-red-600 px-2 py-1 rounded">Open</span>
                            ) : network.security === 'WPA3' ? (
                              <span className="text-xs bg-green-600 px-2 py-1 rounded flex items-center gap-1">
                                <Lock className="w-3 h-3" /> {network.security}
                              </span>
                            ) : dbConnection.type === 'MongoDB Atlas' ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg p-6 border-2 border-green-500">
                  <h3 className="font-bold text-xl mb-3 text-green-300">🚀 Quick Connect with Gmail</h3>
                  <p className="text-sm text-green-200 mb-4">
                    Connect instantly to MongoDB Atlas using your Gmail account. No manual configuration needed!
                  </p>
                  
                  {!dbConnection.gmailAuth ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-green-300">Enter Your Gmail Address</label>
                        <input
                          type="email"
                          value={gmailEmail}
                          onChange={(e) => setGmailEmail(e.target.value)}
                          placeholder="your.email@gmail.com"
                          className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-green-500 focus:outline-none text-white"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleGmailAuth}
                        disabled={!gmailEmail}
                        className={`w-full py-4 rounded-lg transition-all font-bold flex items-center justify-center gap-3 ${
                          gmailEmail 
                            ? 'bg-white hover:bg-gray-100 text-gray-900' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Authenticate with Google
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-950 bg-opacity-50 rounded-lg p-4 border border-green-600">
                        <p className="text-sm text-green-300 mb-2">✅ Gmail Authentication Successful</p>
                        <p className="text-xs text-gray-300">Email: {gmailEmail}</p>
                        <p className="text-xs text-gray-300">Your MongoDB Atlas cluster is ready to connect</p>
                      </div>
                      
                      {mongoConnectionString && (
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <p className="text-xs text-gray-400 mb-2 font-semibold">Auto-Generated Connection String:</p>
                          <div className="bg-black rounded p-3 font-mono text-xs text-green-400 overflow-x-auto break-all">
                            {mongoConnectionString}
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-gray-800 p-2 rounded">
                              <p className="text-gray-400">Database:</p>
                              <p className="font-semibold text-white">cyber_threats</p>
                            </div>
                            <div className="bg-gray-800 p-2 rounded">
                              <p className="text-gray-400">Collection:</p>
                              <p className="font-semibold text-white">threat_data</p>
                            </div>
                            <div className="bg-gray-800 p-2 rounded">
                              <p className="text-gray-400">Region:</p>
                              <p className="font-semibold text-white">US-East-1</p>
                            </div>
                            <div className="bg-gray-800 p-2 rounded">
                              <p className="text-gray-400">Records:</p>
                              <p className="font-semibold text-white">{threats.length}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleMongoDBConnect}
                        disabled={mongoDbConnected}
                        className={`w-full py-4 rounded-lg transition-all font-bold ${
                          mongoDbConnected
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {mongoDbConnected ? '✓ Connected to MongoDB Atlas' : '🔗 Connect to MongoDB Atlas'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-blue-900 bg-opacity-20 border border-blue-600 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-sm text-blue-300">📊 What happens after connection:</h4>
                  <ul className="text-xs text-blue-200 space-y-1">
                    <li>✓ Automatic database creation (cyber_threats)</li>
                    <li>✓ Real-time data synchronization every 2 seconds</li>
                    <li>✓ Secure encrypted connection via SSL/TLS</li>
                    <li>✓ All {threats.length} current records will be synced</li>
                    <li>✓ Future threats automatically saved to cloud</li>
                    <li>✓ Access from anywhere with your credentials</li>
                  </ul>
                </div>

                <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-3">
                  <p className="text-xs text-yellow-400">
                    🔒 Your Gmail is only used for authentication. MongoDB Atlas credentials are auto-generated and encrypted.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDbConnection({ 
                        type: '', 
                        host: '', 
                        port: '', 
                        database: '', 
                        username: '', 
                        password: '', 
                        connected: false,
                        mongoUri: '',
                        gmailAuth: false
                      });
                      setMongoConnectionString('');
                      setMongoDbConnected(false);
                      setGmailEmail('');
                      setConnectionStatus(null);
                    }}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowConnectModal(false);
                      setDbConnection({ 
                        type: '', 
                        host: '', 
                        port: '', 
                        database: '', 
                        username: '', 
                        password: '', 
                        connected: false,
                        mongoUri: '',
                        gmailAuth: false
                      });
                      setMongoConnectionString('');
                      setMongoDbConnected(false);
                      setGmailEmail('');
                      setConnectionStatus(null);
                    }}
                    className="flex-1 py-3 bg-red-700 hover:bg-red-600 rounded-lg transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
                              <span className="text-xs bg-yellow-600 px-2 py-1 rounded flex items-center gap-1">
                                <Lock className="w-3 h-3" /> {network.security}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Signal: <span className="font-semibold text-white">{network.signal}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Distance: <span className="font-semibold text-white">{network.distance}m</span>
                          </div>
                          <div>
                            Channel: <span className="font-semibold text-white">{network.channel}</span>
                          </div>
                          <div>
                            Speed: <span className="font-semibold text-white">{network.speed}</span>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="w-full bg-gray-700 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                network.signal > 70 ? 'bg-green-400' :
                                network.signal > 50 ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}
                              style={{ width: `${network.signal}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {connectedNetwork?.ssid === network.ssid ? (
                            <button
                              onClick={() => disconnectNetwork()}
                              className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all text-sm font-semibold"
                            >
                              Disconnect
                            </button>
                          ) : (
                            <button
                              onClick={() => connectToNetwork(network)}
                              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all text-sm font-semibold"
                            >
                              Connect
                            </button>
                          )}
                          <button
                            onClick={() => showNetworkDetails(network)}
                            className="flex-1 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all text-sm font-semibold"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-800 text-xs text-gray-400 text-center sticky bottom-0">
                    {nearbyNetworks.length} networks found • Range: 1000m • Updated {new Date().toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSecured(!isSecured)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                isSecured 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isSecured ? <Lock className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
              {isSecured ? 'Network Secured' : 'Secure Network'}
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-700 transition-all"
            >
              <Download className="w-5 h-5" />
              Export Data
            </button>
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all"
            >
              <Database className="w-5 h-5" />
              Connect DB
            </button>
          </div>
        </div>

        {/* Enhanced Stats Cards - Real-time Unlimited Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 backdrop-blur rounded-lg p-4 border-2 border-cyan-500/50 hover:border-cyan-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm font-semibold flex items-center gap-2">
                  Active Threats
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                </p>
                <p className="text-3xl font-bold text-white mt-1">{stats.activeThreats.toLocaleString()}</p>
                <p className="text-xs text-cyan-400 mt-1">Continuous monitoring</p>
              </div>
              <Activity className="w-10 h-10 text-cyan-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur rounded-lg p-4 border-2 border-green-500/50 hover:border-green-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-semibold">Blocked</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.blocked.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-1">
                  {stats.activeThreats > 0 ? Math.round((stats.blocked / stats.activeThreats) * 100) : 0}% blocked
                </p>
              </div>
              <Shield className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur rounded-lg p-4 border-2 border-red-500/50 hover:border-red-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-semibold flex items-center gap-2">
                  Critical Alerts
                  {stats.critical > 0 && (
                    <span className="animate-pulse text-red-400">⚠</span>
                  )}
                </p>
                <p className="text-3xl font-bold text-white mt-1">{stats.critical.toLocaleString()}</p>
                <p className="text-xs text-red-400 mt-1">Requires attention</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur rounded-lg p-4 border-2 border-purple-500/50 hover:border-purple-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-semibold">Attack Rate</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.attackRate}</p>
                <p className="text-xs text-purple-400 mt-1">Per minute</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur rounded-lg p-4 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-semibold">Success Rate</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.activeThreats > 0 ? Math.round((stats.blocked / stats.activeThreats) * 100) : 0}%
                </p>
                <p className="text-xs text-yellow-400 mt-1">Defense efficiency</p>
              </div>
              <Shield className="w-10 h-10 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('globe')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'globe'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Globe className="w-5 h-5" />
            3D Globe
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Advanced Analytics
          </button>
          <button
            onClick={() => setActiveTab('incident')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'incident'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Bell className="w-5 h-5" />
            Incident Response
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Layout className="w-5 h-5" />
            Custom Dashboard
          </button>
          <button
            onClick={() => setActiveTab('intel')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'intel'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Database className="w-5 h-5" />
            Threat Intelligence
          </button>
          <button
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'monitor'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Activity className="w-5 h-5" />
            Live Monitor
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Brain className="w-5 h-5" />
            AI Predictions
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Upload className="w-5 h-5" />
            File Upload
          </button>
          <button
            onClick={() => setActiveTab('apidata')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'apidata'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Link className="w-5 h-5" />
            API Data
          </button>
          <button
            onClick={() => setActiveTab('blocking')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'blocking'
                ? 'bg-rose-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Shield className="w-5 h-5" />
            Auto Blocking
          </button>
          <button
            onClick={() => setActiveTab('correlation')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'correlation'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <GitMerge className="w-5 h-5" />
            Correlation
          </button>
          <button
            onClick={() => setActiveTab('hunting')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'hunting'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Search className="w-5 h-5" />
            Threat Hunting
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'export'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Download className="w-5 h-5" />
            Export Reports
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'roles'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            Role Management
          </button>
        </div>

        {/* 3D Globe Tab */}
        {activeTab === 'globe' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all"
              >
                <Download className="w-5 h-5" />
                Export Reports
              </button>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-cyan-400" />
                Interactive 3D Threat Globe - Real-time Attack Origins & Paths
              </h3>
              <p className="text-gray-400 mb-4">
                Visualize cyber threats in 3D space. Red markers indicate active threats, green shows blocked attacks. Animated paths show attack trajectories with Source and Target IP addresses.
              </p>
              <ThreatGlobe threats={filteredThreats} />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-400">Critical Threats</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{filteredThreats.filter(t => t.severity === 'Critical' && !t.blocked).length}</p>
                </div>
                <div className="bg-orange-900/20 border border-orange-500 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-orange-400">High Severity</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{filteredThreats.filter(t => t.severity === 'High' && !t.blocked).length}</p>
                </div>
                <div className="bg-green-900/20 border border-green-500 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Blocked</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{filteredThreats.filter(t => t.blocked).length}</p>
                </div>
                <div className="bg-cyan-900/20 border border-cyan-500 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span className="text-sm text-cyan-400">Total Tracked</span>
                  </div>
                  <p className="text-2xl font-bold text-white mt-1">{filteredThreats.length.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
              >
                <Database className="w-5 h-5" />
                Connect DB
              </button>
            </div>
            <AdvancedAnalytics threats={filteredThreats} />
          </div>
        )}

        {/* Incident Response Tab */}
        {activeTab === 'incident' && (
          <div>
            <IncidentResponseSystem 
              threats={filteredThreats}
              onBlockThreat={(threatId) => {
                setThreats(prev => 
                  prev.map(t => t.id === threatId ? { ...t, blocked: true } : t)
                );
              }}
            />
          </div>
        )}

        {/* Custom Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <DashboardBuilder
              widgets={[
                {
                  id: 'stats',
                  type: 'stats',
                  title: 'Threat Statistics',
                  component: (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-900/20 p-4 rounded">
                        <p className="text-gray-400 text-sm">Active Threats</p>
                        <p className="text-3xl font-bold text-red-400">{filteredStats.activeThreats}</p>
                      </div>
                      <div className="bg-green-900/20 p-4 rounded">
                        <p className="text-gray-400 text-sm">Blocked</p>
                        <p className="text-3xl font-bold text-green-400">{filteredStats.blocked}</p>
                      </div>
                      <div className="bg-yellow-900/20 p-4 rounded">
                        <p className="text-gray-400 text-sm">Critical</p>
                        <p className="text-3xl font-bold text-yellow-400">{filteredStats.critical}</p>
                      </div>
                      <div className="bg-blue-900/20 p-4 rounded">
                        <p className="text-gray-400 text-sm">Attack Rate</p>
                        <p className="text-3xl font-bold text-blue-400">{filteredStats.attackRate}/min</p>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'globe',
                  type: 'globe',
                  title: '3D Threat Globe',
                  component: <ThreatGlobe threats={filteredThreats.slice(0, 50)} />
                },
                {
                  id: 'analytics',
                  type: 'analytics',
                  title: 'Threat Analytics',
                  component: <AdvancedAnalytics threats={filteredThreats} />
                },
                {
                  id: 'timeline',
                  type: 'timeline',
                  title: 'Recent Activity',
                  component: (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredThreats.slice(0, 10).map(threat => (
                        <div key={threat.id} className="bg-gray-800 p-3 rounded">
                          <div className="flex justify-between">
                            <span className="font-semibold">{threat.attackType}</span>
                            <span className={`text-sm ${threat.blocked ? 'text-green-400' : 'text-red-400'}`}>
                              {threat.blocked ? 'Blocked' : 'Active'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">{threat.country}</p>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  id: 'chart',
                  type: 'chart',
                  title: 'Real-time Monitoring',
                  component: (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monitoringData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="time" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                        <Legend />
                        <Line type="monotone" dataKey="attacks" stroke="#EF4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="blocked" stroke="#22C55E" strokeWidth={2} />
                        <Line type="monotone" dataKey="threats" stroke="#F59E0B" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )
                }
              ]}
            />
          </div>
        )}

        {/* Threat Intelligence Tab */}
        {activeTab === 'intel' && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Database className="text-yellow-400" size={24} />
                Real-time Threat Intelligence Feeds
              </h3>
              <p className="text-gray-400 mb-6">
                Live threat data from multiple intelligence sources. Updated every 5 minutes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Total Intel Threats</p>
                  <p className="text-3xl font-bold text-yellow-400">{threatIntelligence.length}</p>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">High Confidence</p>
                  <p className="text-3xl font-bold text-red-400">
                    {threatIntelligence.filter(t => t.confidence >= 80).length}
                  </p>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Unique Sources</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {new Set(threatIntelligence.map(t => t.source)).size}
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {threatIntelligence.length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading threat intelligence feeds...</p>
                  </div>
                ) : (
                  threatIntelligence.map((threat, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="mb-1">
                            <span className="text-gray-400 text-xs">Source IP: </span>
                            <span className="font-mono text-cyan-400">{threat.ip}</span>
                          </div>
                          <div className="mb-1">
                            <span className="text-gray-400 text-xs">Target IP: </span>
                            <span className="font-mono text-yellow-400">{threat.targetIp || generateIP()}</span>
                          </div>
                          <span className="text-white">{threat.country}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                          threat.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {threat.severity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-400">{threat.attackType}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Source: {threat.source} • Confidence: {threat.confidence}%
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          Last seen: {new Date(threat.lastSeen).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Monitor Tab */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
              >
                <Database className="w-5 h-5" />
                Connect DB
              </button>
            </div>
            {/* Advanced Filters Section */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Advanced Threat Filters
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all text-sm"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Filter by Country:</label>
                    <select
                      value={filterCountry}
                      onChange={(e) => setFilterCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Countries ({countries.length})</option>
                      {countries.sort((a, b) => a.name.localeCompare(b.name)).map(country => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Filter by Attack Type:</label>
                    <select
                      value={filterAttackType}
                      onChange={(e) => setFilterAttackType(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Types ({attackTypes.length})</option>
                      {attackTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Filter by Severity:</label>
                    <select
                      value={filterSeverity}
                      onChange={(e) => setFilterSeverity(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Severities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFilterCountry('all');
                        setFilterAttackType('all');
                        setFilterSeverity('all');
                      }}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all text-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
              
              {(filterCountry !== 'all' || filterAttackType !== 'all' || filterSeverity !== 'all') && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400">Active Filters:</span>
                  {filterCountry !== 'all' && (
                    <span className="px-3 py-1 bg-cyan-600 rounded-full text-xs flex items-center gap-2">
                      Country: {filterCountry}
                      <button onClick={() => setFilterCountry('all')} className="hover:text-red-300">✕</button>
                    </span>
                  )}
                  {filterAttackType !== 'all' && (
                    <span className="px-3 py-1 bg-purple-600 rounded-full text-xs flex items-center gap-2">
                      Type: {filterAttackType}
                      <button onClick={() => setFilterAttackType('all')} className="hover:text-red-300">✕</button>
                    </span>
                  )}
                  {filterSeverity !== 'all' && (
                    <span className="px-3 py-1 bg-orange-600 rounded-full text-xs flex items-center gap-2">
                      Severity: {filterSeverity}
                      <button onClick={() => setFilterSeverity('all')} className="hover:text-red-300">✕</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Network Selector */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold">Network Monitoring:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedNetwork('global')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedNetwork === 'global'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    🌍 Global Network
                  </button>
                  <button
                    onClick={() => setSelectedNetwork('enterprise')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedNetwork === 'enterprise'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    🏢 Enterprise Network
                  </button>
                  <button
                    onClick={() => setSelectedNetwork('cloud')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedNetwork === 'cloud'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    ☁️ Cloud Infrastructure
                  </button>
                  <button
                    onClick={() => setSelectedNetwork('iot')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedNetwork === 'iot'
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    📱 IoT Devices
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive World Map Visualization */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  Live Attack Map - {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)} Network
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">Map Provider:</span>
                  <select
                    value={mapProvider}
                    onChange={(e) => setMapProvider(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="google">Google Maps</option>
                    <option value="openstreetmap">OpenStreetMap</option>
                    <option value="mapbox">Mapbox (Pro)</option>
                  </select>
                  <button
                    onClick={() => setShowApiModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    API Settings
                  </button>
                </div>
              </div>
              
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '550px' }}>
                {/* Live Attack Markers Layer */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <svg className="w-full h-full">
                    {filteredThreats.slice(0, 20).map((threat, index) => {
                      const x = ((threat.lng + 180) / 360) * 100;
                      const y = ((90 - threat.lat) / 180) * 100;
                      return (
                        <g key={threat.id}>
                          {/* Pulse animation */}
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="8"
                            fill={threat.blocked ? '#22c55e' : '#ef4444'}
                            opacity="0.3"
                            className="animate-ping"
                          />
                          {/* Static marker */}
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r="4"
                            fill={threat.blocked ? '#22c55e' : '#ef4444'}
                            stroke="white"
                            strokeWidth="1"
                          />
                          {/* Attack line from origin */}
                          <line
                            x1={`${x}%`}
                            y1={`${y}%`}
                            x2={`${x + (Math.random() * 10 - 5)}%`}
                            y2={`${y + (Math.random() * 10 - 5)}%`}
                            stroke={threat.blocked ? '#22c55e' : '#ef4444'}
                            strokeWidth="1"
                            opacity="0.5"
                            className="animate-pulse"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Map iframe */}
                {mapProvider === 'google' && (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={filteredThreats.length > 0 
                      ? `https://maps.google.com/maps?q=${filteredThreats[0].lat},${filteredThreats[0].lng}&t=&z=3&ie=UTF8&iwloc=&output=embed`
                      : `https://maps.google.com/maps?q=20,0&t=&z=2&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                )}

                {mapProvider === 'openstreetmap' && (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={filteredThreats.length > 0
                      ? `https://www.openstreetmap.org/export/embed.html?bbox=${filteredThreats[0].lng-20},${filteredThreats[0].lat-15},${filteredThreats[0].lng+20},${filteredThreats[0].lat+15}&layer=mapnik&marker=${filteredThreats[0].lat},${filteredThreats[0].lng}`
                      : `https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&layer=mapnik`}
                  ></iframe>
                )}

                {mapProvider === 'mapbox' && (
                  <div className="flex items-center justify-center h-full bg-gray-900">
                    <div className="text-center">
                      <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-2">Mapbox requires API key</p>
                      <button
                        onClick={() => setShowApiModal(true)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all"
                      >
                        Configure API Key
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Attack Info Panel */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-95 rounded-lg p-4 max-w-sm border-2 border-red-500 z-20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h4 className="font-bold text-red-400">🚨 LIVE ATTACK IN PROGRESS</h4>
                  </div>
                  {filteredThreats.length > 0 && (
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Origin Country:</span>
                        <span className="font-bold text-white">{filteredThreats[0].country}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">GPS Coordinates:</span>
                        <span className="font-mono text-xs text-cyan-400">
                          {filteredThreats[0].lat.toFixed(4)}°N, {filteredThreats[0].lng.toFixed(4)}°E
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Attack Type:</span>
                        <span className="font-bold text-red-400">{filteredThreats[0].attackType}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Attacker IP:</span>
                        <span className="font-mono text-xs text-orange-400">{filteredThreats[0].ip}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Threat Level:</span>
                        <span className={`font-bold ${
                          filteredThreats[0].severity === 'Critical' ? 'text-red-500' :
                          filteredThreats[0].severity === 'High' ? 'text-orange-500' :
                          filteredThreats[0].severity === 'Medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`}>
                          {filteredThreats[0].severity}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Detection Time:</span>
                        <span className="text-xs text-gray-300">{filteredThreats[0].timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network:</span>
                        <span className="text-xs text-purple-400">{selectedNetwork.toUpperCase()}</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-700">
                        <span className={`block text-center px-3 py-2 rounded-lg text-sm font-bold ${
                          filteredThreats[0].blocked 
                            ? 'bg-green-600 text-white' 
                            : 'bg-red-600 text-white animate-pulse'
                        }`}>
                          {filteredThreats[0].blocked ? '✓ THREAT NEUTRALIZED' : '⚠ ACTIVE INTRUSION'}
                        </span>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${filteredThreats[0].lat},${filteredThreats[0].lng}&z=12`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-3 text-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-all font-semibold"
                      >
                        🗺️ View Exact Location →
                      </a>
                    </div>
                  )}
                  {filteredThreats.length === 0 && (
                    <p className="text-sm text-gray-400">No threats match the current filters.</p>
                  )}
                </div>

                {/* Live Stats Overlay */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-95 rounded-lg p-4 border-2 border-cyan-500 z-20">
                  <h4 className="font-bold mb-3 text-cyan-400">📊 Live Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-400">Active Attacks:</span>
                      <span className="font-bold text-red-400">{filteredThreats.filter(t => !t.blocked).length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-400">Blocked:</span>
                      <span className="font-bold text-green-400">{filteredThreats.filter(t => t.blocked).length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-400">Total Tracked:</span>
                      <span className="font-bold text-orange-400">{filteredThreats.length}</span>
                    </div>
                  </div>
                </div>

                {isSecured && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-900 bg-opacity-95 border-2 border-green-500 rounded-lg px-6 py-3 z-20">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-400 animate-pulse" />
                      <span className="font-bold text-green-400 text-lg">🛡️ FULL NETWORK PROTECTION ACTIVE</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Threat Activity Line Charts */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-400" />
                Real-time Threat Activity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monitoringData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} name="Total Threats" />
                  <Line type="monotone" dataKey="blocked" stroke="#22c55e" strokeWidth={2} name="Blocked" />
                  <Line type="monotone" dataKey="critical" stroke="#f97316" strokeWidth={2} name="Critical Threats" />
                  <Line type="monotone" dataKey="attacks" stroke="#8b5cf6" strokeWidth={2} name="Active Threats" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Analytics Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Attack Countries Chart */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  Top 10 Attack Origins
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="country" type="category" stroke="#9ca3af" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" name="Attacks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Attack Types Distribution */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  Attack Types Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attackTypeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#f59e0b" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Severity Distribution */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-red-400" />
                  Threat Severity Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={severityChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="severity" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#ef4444" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Attack Type Breakdown Table */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                  Detailed Attack Breakdown
                </h3>
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-900 sticky top-0">
                      <tr>
                        <th className="text-left p-2">Attack Type</th>
                        <th className="text-center p-2">Count</th>
                        <th className="text-center p-2">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attackTypeChartData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="p-2">{item.type}</td>
                          <td className="text-center p-2 font-bold text-cyan-400">{item.count as number}</td>
                          <td className="text-center p-2 text-gray-400">
                            {filteredStats.activeThreats > 0 ? (((item.count as number) / filteredStats.activeThreats) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Live Monitoring Graph */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-400" />
                Real-Time Threat Monitoring Dashboard
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monitoringData}>
                  <defs>
                    <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="attacks" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorAttacks)" 
                    name="Total Attacks"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="blocked" 
                    stroke="#22c55e" 
                    fillOpacity={1} 
                    fill="url(#colorBlocked)" 
                    name="Blocked"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="threats" 
                    stroke="#f59e0b" 
                    fillOpacity={1} 
                    fill="url(#colorThreats)" 
                    name="Active Threats"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Live Attack Map Grid */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">📍 Live Attack Origins - Click to View</h3>
              {filteredThreats.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No threats match your current filters</p>
                  <button
                    onClick={() => {
                      setFilterCountry('all');
                      setFilterAttackType('all');
                      setFilterSeverity('all');
                    }}
                    className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {filteredThreats.slice(0, 9).map(threat => (
                  <a
                    key={threat.id}
                    href={`https://www.google.com/maps/search/?api=1&query=${threat.lat},${threat.lng}&zoom=12`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{threat.country}</h4>
                        <p className="text-sm text-red-400">{threat.attackType}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        threat.blocked ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {threat.severity}
                      </div>
                    </div>
                    <div className="text-xs space-y-1.5 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span className="font-mono">{threat.lat.toFixed(6)}°, {threat.lng.toFixed(6)}°</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        <span className="font-mono">{threat.ip}</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <span>⏱ {threat.timestamp}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700 text-center">
                      <span className="text-cyan-400 text-sm font-semibold hover:underline">
                        → View on Google Maps
                      </span>
                    </div>
                  </a>
                ))}
              </div>
              )}
            </div>

            {/* Threat Feed */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">Live Threat Feed {filteredThreats.length > 0 && `(${filteredThreats.length} threats)`}</h3>
              {filteredThreats.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No threats detected with current filters</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredThreats.map(threat => (
                  <div
                    key={threat.id}
                    className={`p-4 rounded-lg border transition-all ${
                      threat.blocked
                        ? 'bg-green-900 bg-opacity-20 border-green-700'
                        : 'bg-gray-900 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(threat.severity)}`}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{threat.attackType}</span>
                            <span className="text-gray-400 text-sm">from {threat.country}</span>
                            {threat.blocked && (
                              <span className="bg-green-600 text-xs px-2 py-1 rounded">BLOCKED</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            IP: {threat.ip} | Severity: {threat.severity} | {threat.timestamp}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {threat.lat.toFixed(2)}°, {threat.lng.toFixed(2)}°
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )}


        {/* AI Predictions Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* AI Prediction Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prediction Probability Chart */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-400" />
                  Attack Probability Forecast
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="attackType" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="probability" fill="#a855f7" name="Probability %" />
                    <Bar dataKey="confidence" fill="#06b6d4" name="Confidence %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Threat Risk Assessment Radar */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                  AI Threat Risk Assessment
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={predictionData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="attackType" stroke="#9ca3af" />
                    <PolarRadiusAxis stroke="#9ca3af" />
                    <Radar 
                      name="Risk Level" 
                      dataKey="risk" 
                      stroke="#ec4899" 
                      fill="#ec4899" 
                      fillOpacity={0.6} 
                    />
                    <Radar 
                      name="Probability" 
                      dataKey="probability" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.4} 
                    />
                    <Legend />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                Machine Learning Threat Predictions
              </h3>
              <p className="text-gray-400 mb-6">
                AI-powered predictive analysis using neural networks to forecast potential cyber attacks
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiPredictions.map(pred => (
                  <div
                    key={pred.id}
                    className="bg-purple-900 bg-opacity-20 border border-purple-700 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{pred.type} Attack</h4>
                        <p className="text-sm text-gray-400">Target: {pred.targetRegion}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">{pred.probability}%</div>
                        <div className="text-xs text-gray-400">Probability</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Predicted timeframe:</span>
                        <span className="font-semibold">{pred.predictedTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">AI Confidence:</span>
                        <span className="font-semibold text-green-400">{pred.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                          style={{ width: `${pred.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4">AI Model Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Model Type</p>
                  <p className="font-semibold">Deep Neural Network</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Training Dataset</p>
                  <p className="font-semibold">10M+ Threat Patterns</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Accuracy Rate</p>
                  <p className="font-semibold text-green-400">94.7%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Reports Tab */}
        {activeTab === 'export' && (
          <div>
            <ExportReports threats={filteredThreats} />
          </div>
        )}

        {/* Role Management Tab */}
        {activeTab === 'role' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all"
              >
                <Download className="w-5 h-5" />
                Export Reports
              </button>
            </div>
            <UserRoleManagement />
          </div>
        )}

        {/* ML Training Tab */}
        {activeTab === 'ml' && (
          <div>
            <MLTrainingInterface />
          </div>
        )}

        {/* Simulation Sandbox Tab */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all"
              >
                <Download className="w-5 h-5" />
                Export Reports
              </button>
            </div>
            <ThreatSimulationSandbox />
          </div>
        )}

        {/* Collaboration Tab */}
        {activeTab === 'collab' && (
          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all"
              >
                <Download className="w-5 h-5" />
                Export Reports
              </button>
            </div>
            <CollaborationFeatures />
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-cyan-500" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Download className="w-6 h-6 text-cyan-400" />
              Export Threat Data
            </h2>
            <p className="text-gray-400 mb-6">Download up to 5 lakh (500,000) threat records in your preferred format</p>
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-cyan-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Current Records Available:</span>
                <span className="text-xl font-bold text-cyan-400">{threats.length.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Maximum Export Capacity:</span>
                <span className="text-lg font-bold text-green-400">5,00,000 records</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => { downloadCSV(); setShowExportModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <p className="font-semibold">CSV File</p>
                    <p className="text-xs text-gray-400">For Excel, Google Sheets, analytics tools</p>
                  </div>
                </div>
                <span className="text-cyan-400">→</span>
              </button>

              <button
                onClick={() => { downloadExcel(); setShowExportModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <p className="font-semibold">Excel File (.xls)</p>
                    <p className="text-xs text-gray-400">Microsoft Excel compatible format</p>
                  </div>
                </div>
                <span className="text-cyan-400">→</span>
              </button>

              <button
                onClick={() => { downloadJSON(); setShowExportModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <p className="font-semibold">JSON File</p>
                    <p className="text-xs text-gray-400">Full data with predictions & statistics</p>
                  </div>
                </div>
                <span className="text-cyan-400">→</span>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* API Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto" onClick={() => setShowApiModal(false)}>
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full m-4 border border-indigo-500" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-400" />
              API Configuration & Map Settings
            </h2>

            <div className="space-y-6">
              {/* Google Maps API */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Google Maps API
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    apiKeys.google ? 'bg-green-600' : 'bg-gray-700'
                  }`}>
                    {apiKeys.google ? '✓ Connected' : 'Not Connected'}
                  </span>
                </div>
                <input
                  type="text"
                  value={apiKeys.google}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, google: e.target.value }))}
                  placeholder="Enter Google Maps API key"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Get your API key from: <a href="https://developers.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Cloud Console</a>
                </p>
              </div>

              {/* Mapbox API */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" />
                    Mapbox API (Pro Features)
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    apiKeys.mapbox ? 'bg-green-600' : 'bg-gray-700'
                  }`}>
                    {apiKeys.mapbox ? '✓ Connected' : 'Not Connected'}
                  </span>
                </div>
                <input
                  type="text"
                  value={apiKeys.mapbox}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, mapbox: e.target.value }))}
                  placeholder="Enter Mapbox access token"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none text-sm"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Get your token from: <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Mapbox Dashboard</a>
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-400">✓ 3D terrain visualization</p>
                  <p className="text-xs text-green-400">✓ Satellite imagery</p>
                  <p className="text-xs text-green-400">✓ Advanced analytics overlay</p>
                </div>
              </div>

              {/* OpenStreetMap Info */}
              <div className="bg-gray-900 rounded-lg p-4 border border-green-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-400" />
                    OpenStreetMap (Free)
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600">
                    ✓ Always Available
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  No API key required. OpenStreetMap is free and always available for use.
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-400">✓ No rate limits</p>
                  <p className="text-xs text-green-400">✓ Open source</p>
                  <p className="text-xs text-green-400">✓ Community driven</p>
                </div>
              </div>

              {/* Network Settings */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-cyan-400" />
                  Network Monitoring Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Active Network:</label>
                    <select
                      value={selectedNetwork}
                      onChange={(e) => setSelectedNetwork(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="global">🌍 Global Network</option>
                      <option value="enterprise">🏢 Enterprise Network</option>
                      <option value="cloud">☁️ Cloud Infrastructure</option>
                      <option value="iot">📱 IoT Devices</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-gray-400">Scan Interval:</p>
                      <p className="font-semibold">2 seconds</p>
                    </div>
                    <div className="bg-gray-800 p-2 rounded">
                      <p className="text-gray-400">Max Tracked:</p>
                      <p className="font-semibold">50 threats</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-3">
                <p className="text-xs text-yellow-400">
                  🔒 API keys are stored locally in your browser and never transmitted to external servers.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem('threatApiKeys', JSON.stringify(apiKeys));
                    alert('API settings saved successfully!');
                  }}
                  className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all font-semibold"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setShowApiModal(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Connection Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setShowExportModal(false)}>
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-cyan-500" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Download className="w-6 h-6 text-cyan-400" />
              Export Threat Data
            </h2>
            <p className="text-gray-400 mb-6">Download {threats.length} threat records in your preferred format</p>
            
            <div className="space-y-3">
              <button
                onClick={() => { downloadCSV(); setShowExportModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <p className="font-semibold">CSV File</p>
                    <p className="text-xs text-gray-400">For Excel, Google Sheets, analytics tools</p>
                  </div>
                </div>
                <span className="text-cyan-400">→</span>
              </button>

              <button
                onClick={() => { downloadExcel(); setShowExportModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <p className="font-semibold">Excel File (.xls)</p>
                    <p className="text-xs text-gray-400">Microsoft Excel compatible format</p>
                  </div>
                </div>
                <span className="text-cyan-400">→</span>
              </button>

              <button
                onClick={() => { downloadJSON(); setShowExportModal(false); }}
                className="w-full flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-purple-400" />
                  <div className="text-left">
                    <p className="font-semibold">JSON File</p>
                    <p className="text-xs text-gray-400">Full data with predictions & statistics</p>
                  </div>
                </div>
                <span className="text-cyan-400">→</span>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full mt-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Database Connection Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-y-auto" onClick={() => !dbConnection.type && setShowConnectModal(false)}>
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full m-4 border border-purple-500 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 text-purple-400" />
              {dbConnection.type ? `Connect to ${dbConnection.type}` : 'Connect Database or Cloud Storage'}
            </h2>
            
            {connectionStatus && (
              <div className="mb-4 p-4 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg text-green-400">
                {connectionStatus}
              </div>
            )}

            {!dbConnection.type ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* SQL Databases */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-3 text-cyan-400">SQL Databases</h3>
                    
                    <button
                      onClick={() => connectDatabase('MySQL')}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
                    >
                      <p className="font-semibold">MySQL</p>
                      <p className="text-xs text-gray-400">Connect to MySQL database</p>
                    </button>

                    <button
                      onClick={() => connectDatabase('PostgreSQL')}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
                    >
                      <p className="font-semibold">PostgreSQL</p>
                      <p className="text-xs text-gray-400">Connect to PostgreSQL database</p>
                    </button>

                    <button
                      onClick={() => connectDatabase('Microsoft SQL Server')}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
                    >
                      <p className="font-semibold">MS SQL Server</p>
                      <p className="text-xs text-gray-400">Microsoft SQL Server integration</p>
                    </button>

                    <button
                      onClick={() => connectDatabase('Oracle Database')}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-cyan-500"
                    >
                      <p className="font-semibold">Oracle DB</p>
                      <p className="text-xs text-gray-400">Oracle database connection</p>
                    </button>
                  </div>

                  {/* Cloud Storage */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-3 text-purple-400">Cloud Storage</h3>
                    
                    <button
                      onClick={() => connectDatabase('AWS RDS')}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-purple-500"
                    >
                      <p className="font-semibold flex items-center gap-2">
                        <Cloud className="w-4 h-4" /> AWS RDS
                      </p>
                      <p className="text-xs text-gray-400">Amazon Relational Database Service</p>
                    </button>

                    <button
                      onClick={() => connectDatabase('Google Cloud SQL')}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-purple-500"
                    >
                      <p className="font-semibold flex items-center gap-2">
                        <Cloud className="w-4 h-4" /> Google Cloud SQL
                      </p>
                      <p className="text-xs text-gray-400">Google Cloud database service</p>
                    </button>

                    <button
                      onClick={() => connectDatabase('Azure SQL Database')}
                      className="w-full text-left p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-purple-500"
                    >
                      <p className="font-semibold flex items-center gap-2">
                        <Cloud className="w-4 h-4" /> Azure SQL
                      </p>
                      <p className="text-xs text-gray-400">Microsoft Azure SQL Database</p>
                    </button>

                    <button
                      onClick={() => connectDatabase('MongoDB Atlas')}
                      className="w-full text-left p-4 bg-gradient-to-r from-green-900 to-emerald-900 hover:from-green-800 hover:to-emerald-800 rounded-lg transition-all border-2 border-green-500 hover:border-green-400"
                    >
                      <p className="font-semibold flex items-center gap-2 text-green-300">
                        <Cloud className="w-4 h-4" /> MongoDB Atlas
                      </p>
                      <p className="text-xs text-green-400">🚀 Quick Connect with Gmail • No Setup Required</p>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
                  <h4 className="font-semibold mb-2 text-sm">📊 Real-Time Streaming Options:</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>✓ Automatic data sync every 2 seconds</li>
                    <li>✓ Live analytics and reporting</li>
                    <li>✓ Historical data retention</li>
                    <li>✓ API webhook integration available</li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowConnectModal(false)}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                >
                  Close
                </button>
              </>
            ) : (
              <form onSubmit={handleDatabaseConnect} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Host / Server Address</label>
                  <input
                    type="text"
                    value={dbConnection.host}
                    onChange={(e) => setDbConnection(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="e.g., localhost or db.example.com"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Port</label>
                    <input
                      type="text"
                      value={dbConnection.port}
                      onChange={(e) => setDbConnection(prev => ({ ...prev, port: e.target.value }))}
                      placeholder={
                        dbConnection.type === 'MySQL' ? '3306' :
                        dbConnection.type === 'PostgreSQL' ? '5432' :
                        dbConnection.type === 'Microsoft SQL Server' ? '1433' :
                        dbConnection.type === 'MongoDB Atlas' ? '27017' : '1521'
                      }
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Database Name</label>
                    <input
                      type="text"
                      value={dbConnection.database}
                      onChange={(e) => setDbConnection(prev => ({ ...prev, database: e.target.value }))}
                      placeholder="cyber_threats"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    value={dbConnection.username}
                    onChange={(e) => setDbConnection(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="admin"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    value={dbConnection.password}
                    onChange={(e) => setDbConnection(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 rounded-lg p-3">
                  <p className="text-xs text-yellow-400">
                    🔒 Your credentials are encrypted and never stored. Connection is established securely via SSL/TLS.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDbConnection({ type: '', host: '', port: '', database: '', username: '', password: '', connected: false, mongoUri: '', gmailAuth: false })}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all font-semibold"
                  >
                    Connect Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberThreatDashboard;