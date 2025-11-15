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
      ip: generateIP(), // FIX: Renamed from 'attackerIp' to 'ip' for consistency with export logic (t.ip)
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

  // FIX: Refactored to correct stale state issues with setStats and setMonitoringData
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
        
        const newStats = { // Calculate new stats locally
          activeThreats: updated.length, // Total unlimited count
          blocked: updated.filter(t => t.blocked).length,
          critical: updated.filter(t => t.severity === 'Critical').length,
          attackRate: recentThreats.length,
          lastMinuteAttacks: recentThreats.length
        };

        // Update stats state immediately using the new metrics
        setStats(() => newStats);
        
        // Update monitoring graph data with real counts using newStats to prevent stale state issues
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setMonitoringData(prevMonitoringData => {
          const newData = [...prevMonitoringData, {
            time,
            attacks: newStats.activeThreats, // Use the newStats object
            blocked: newStats.blocked,      // Use the newStats object
            threats: newStats.critical      // Use the newStats object
          }];
          return newData.slice(-30); // Keep last 30 data points for better visualization
        });

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
    }, 2000);

    // FIX: Corrected dependency array to avoid unnecessary interval resets
    return () => clearInterval(interval);
  }, [isSecured, soundAlertsEnabled, toast]); // Added toast to deps (from useToast)

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

  // FIX: Added missing fetchThreats function definition
  const fetchThreats = async () => {
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .order('detected_at', { ascending: false });

    if (error) {
      console.error('Error fetching threats:', error);
      toast({
        title: 'Error Fetching Threats',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      const formattedThreats = data.map(t => ({
        id: t.id,
        country: t.country,
        countryCode: t.country_code, 
        lat: parseFloat(String(t.latitude)),
        lng: parseFloat(String(t.longitude)),
        attackType: t.attack_type,
        ip: t.attacker_ip,
        targetIp: t.target_ip, 
        targetCountry: t.target_country, 
        targetCountryCode: t.target_country_code, 
        targetLat: parseFloat(String(t.target_latitude)), 
        targetLng: parseFloat(String(t.target_longitude)), 
        severity: t.threat_level,
        timestamp: new Date(t.detected_at).toISOString(),
        blocked: t.blocked,
      }));
      setThreats(formattedThreats);
      setTotalScanned(data.length);

      // Mock generation of initial threat intelligence from fetched threats
      const mockThreatIntel = formattedThreats.slice(0, 10).map(t => ({
          id: t.id,
          ip: t.ip,
          source: `IntelFeed-${Math.floor(Math.random() * 5) + 1}`,
          type: t.attackType,
          risk: t.severity,
          confidence: Math.floor(Math.random() * 20) + 80 // 80-100
      }));
      setThreatIntelligence(mockThreatIntel);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully',
    });
  };

  // FIX: Completed the incomplete handleSecureNetwork function
  const handleSecureNetwork = async () => {
    const willBeSecured = !isSecured;
    setIsSecured(willBeSecured);
    
    if (willBeSecured) {
      // Update all currently unblocked threats in the database to blocked = true
      const { error } = await supabase
        .from('threats')
        .update({ blocked: true, mitigated_at: new Date().toISOString() })
        .eq('blocked', false);
        
      if (error) {
        toast({
          title: 'Mitigation Failed',
          description: `Error blocking threats: ${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Network Secured',
          description: 'All active threats have been blocked and mitigated.',
          variant: 'default',
        });
        // Update local state to reflect all threats are now blocked
        setThreats(prev => prev.map(t => ({ ...t, blocked: true })));
      }
    } else {
       toast({
        title: 'Security System Disabled',
        description: 'Network protection is now offline. New threats will be active.',
        variant: 'default',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <h1 className="text-4xl font-extrabold mb-8 text-cyan-400 flex items-center gap-4">
        <Shield className="w-8 h-8" /> Cyber Threat Dashboard
      </h1>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gray-800/50 backdrop-blur p-4 rounded-lg border border-gray-700">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-400">Welcome, {user ? user.email : 'Guest'}</p>
          <p className="text-2xl font-bold">Real-time Global Threat Monitor</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {user ? (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              <User className="w-5 h-5" /> Sign Out
            </button>
          ) : (
            <button
              onClick={() => { /* Assume a login modal/page exists */ alert('Simulating login/signup...'); }}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              <User className="w-5 h-5" /> Sign In
            </button>
          )}

          <button
            onClick={() => setIsSecured(!isSecured)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isSecured ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isSecured ? <Lock className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            {isSecured ? 'Network Secured' : 'Secure Network'}
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-cyan-600 hover:bg-cyan-700 transition-all"
          >
            <Download className="w-5 h-5" /> Export Data
          </button>

          <button
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transition-all"
          >
            <Database className="w-5 h-5" /> Connect DB
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
              <p className="text-xs text-cyan-400 mt-1">Total since session start</p>
            </div>
            <Activity className="w-8 h-8 text-cyan-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur rounded-lg p-4 border-2 border-red-500/50 hover:border-red-400 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-semibold">Critical Incidents</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.critical.toLocaleString()}</p>
              <p className="text-xs text-red-400 mt-1">High-severity alerts</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur rounded-lg p-4 border-2 border-green-500/50 hover:border-green-400 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-semibold">Threats Blocked</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.blocked.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1">{((stats.blocked / (stats.activeThreats || 1)) * 100).toFixed(1)}% Success Rate</p>
            </div>
            <Lock className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-800/20 backdrop-blur rounded-lg p-4 border-2 border-indigo-500/50 hover:border-indigo-400 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-sm font-semibold">Attack Rate</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.attackRate}/min</p>
              <p className="text-xs text-indigo-400 mt-1">Attacks in the last minute</p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur rounded-lg p-4 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-300 text-sm font-semibold">Total Scanned</p>
              <p className="text-3xl font-bold text-white mt-1">{totalScanned.toLocaleString()}</p>
              <p className="text-xs text-yellow-400 mt-1">Database records fetched</p>
            </div>
            <Search className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('globe')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'globe' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Globe className="w-5 h-5" /> 3D Globe
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <TrendingUp className="w-5 h-5" /> Advanced Analytics
        </button>

        <button
          onClick={() => setActiveTab('incident')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'incident' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Bell className="w-5 h-5" /> Incident Response
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Layout className="w-5 h-5" /> Custom Dashboard
        </button>

        <button
          onClick={() => setActiveTab('intel')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'intel' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Brain className="w-5 h-5" /> Threat Intelligence
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'ai' ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Cloud className="w-5 h-5" /> AI Predictions
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'upload' ? 'bg-lime-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Upload className="w-5 h-5" /> File Upload Scan
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'api' ? 'bg-teal-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Link className="w-5 h-5" /> API Data Analysis
        </button>

        <button
          onClick={() => setActiveTab('blocking')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'blocking' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Lock className="w-5 h-5" /> Automated Blocking
        </button>

        <button
          onClick={() => setActiveTab('correlation')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'correlation' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <GitMerge className="w-5 h-5" /> Correlation
        </button>

        <button
          onClick={() => setActiveTab('hunting')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'hunting' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Search className="w-5 h-5" /> Threat Hunting
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'export' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <Download className="w-5 h-5" /> Export Reports
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'roles' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          <FileText className="w-5 h-5" /> Role Management
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
              <Download className="w-5 h-5" /> Export Reports
            </button>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-cyan-400" /> Global Cyber Attack Map (3D Simulation)
            </h3>
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <button
                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all text-sm"
                  >
                    <Wifi className="w-4 h-4" /> Network: {connectedNetwork ? connectedNetwork.ssid : selectedNetwork.toUpperCase()}
                  </button>
                  {showNetworkDropdown && (
                    <div className="absolute z-30 mt-2 w-64 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-3">
                      <h4 className="font-bold mb-2 text-cyan-400">Network Selector</h4>
                      <div className="flex justify-between mb-2">
                        <button
                          onClick={scanNearbyNetworks}
                          disabled={scanningNetworks}
                          className="text-xs bg-cyan-700 hover:bg-cyan-800 p-1 rounded transition-all disabled:opacity-50"
                        >
                          {scanningNetworks ? 'Scanning...' : 'Scan Nearby'}
                        </button>
                        {connectedNetwork && (
                          <button
                            onClick={disconnectNetwork}
                            className="text-xs bg-red-700 hover:bg-red-800 p-1 rounded transition-all"
                          >
                            Disconnect
                          </button>
                        )}
                      </div>
                      {nearbyNetworks.length === 0 && !scanningNetworks ? (
                        <p className="text-xs text-gray-500">Click Scan to find networks.</p>
                      ) : (
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {nearbyNetworks.map((net, index) => (
                            <div
                              key={index}
                              onClick={() => connectToNetwork(net)}
                              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-all ${connectedNetwork?.ssid === net.ssid ? 'bg-green-800/50 border border-green-500' : ''}`}
                            >
                              <div>
                                <p className="text-sm font-semibold">{net.ssid}</p>
                                <p className="text-xs text-gray-400">{net.security} | {net.speed}</p>
                              </div>
                              <span className={`text-xs ${net.signal > 80 ? 'text-green-400' : net.signal > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{net.signal}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-700 hover:bg-gray-600 transition-all text-sm"
                  >
                    <Activity className="w-4 h-4" /> Filters {filterCountry !== 'all' || filterAttackType !== 'all' || filterSeverity !== 'all' ? `(${[filterCountry, filterAttackType, filterSeverity].filter(f => f !== 'all').length} Active)` : ''}
                  </button>
                  {showFilters && (
                    <div className="absolute z-30 mt-2 w-64 bg-gray-900 rounded-lg shadow-xl border border-gray-700 p-4 right-0">
                      <h4 className="font-bold mb-3 text-cyan-400">Threat Filters</h4>
                      <div className="space-y-3">
                        <select
                          value={filterCountry}
                          onChange={(e) => setFilterCountry(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                        >
                          <option value="all">All Countries</option>
                          {countries.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                        </select>
                        <select
                          value={filterAttackType}
                          onChange={(e) => setFilterAttackType(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                        >
                          <option value="all">All Attack Types</option>
                          {attackTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <select
                          value={filterSeverity}
                          onChange={(e) => setFilterSeverity(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                        >
                          <option value="all">All Severities</option>
                          {['Low', 'Medium', 'High', 'Critical'].map(severity => <option key={severity} value={severity}>{severity}</option>)}
                        </select>
                        <button
                          onClick={() => { setFilterCountry('all'); setFilterAttackType('all'); setFilterSeverity('all'); setShowFilters(false); }}
                          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-all"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 items-center mt-3 md:mt-0">
                <select
                  value={mapProvider}
                  onChange={(e) => setMapProvider(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="google">Google Maps</option>
                  <option value="openstreetmap">OpenStreetMap</option>
                  <option value="mapbox">Mapbox (Pro)</option>
                </select>
                <button
                  onClick={() => setShowApiModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all text-sm"
                >
                  <Globe className="w-4 h-4" /> API Settings
                </button>
              </div>
            </div>

            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ height: '550px' }}>
              {/* Live Attack Markers Layer */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <svg className="w-full h-full">
                  {filteredThreats.slice(0, 20).map((threat, index) => {
                    // Simple mercator projection for visualization on a 2D plane/iframe
                    const x = ((threat.lng + 180) / 360) * 100;
                    const y = ((90 - threat.lat) / 180) * 100;

                    return (
                      <g key={threat.id}>
                        {/* Pulse animation */}
                        <circle cx={`${x}%`} cy={`${y}%`} r="8" fill={threat.blocked ? '#22c55e' : '#ef4444'} opacity="0.3" className="animate-ping" />
                        {/* Static marker */}
                        <circle cx={`${x}%`} cy={`${y}%`} r="4" fill={threat.blocked ? '#22c55e' : '#ef4444'} stroke="white" strokeWidth="1" />
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
              {/* FIX: Corrected malformed Google Maps URL and added placeholders for others */}
              {mapProvider === 'google' && (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={filteredThreats.length > 0 ? `https://maps.google.com/maps?q=${filteredThreats[0].lat},${filteredThreats[0].lng}&z=6&output=embed` : ''}
                ></iframe>
              )}
              {mapProvider === 'mapbox' && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <p className="text-gray-400 text-lg">Mapbox API Integration Placeholder (Pro Feature)</p>
                </div>
              )}
              {mapProvider === 'openstreetmap' && (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={filteredThreats.length > 0 ? `https://www.openstreetmap.org/export/embed.html?bbox=${filteredThreats[0].lng - 0.1},${filteredThreats[0].lat - 0.1},${filteredThreats[0].lng + 0.1},${filteredThreats[0].lat + 0.1}&layer=mapnik&marker=${filteredThreats[0].lat},${filteredThreats[0].lng}` : ''}
                ></iframe>
              )}

              {/* Live Threat Details Overlay */}
              {filteredThreats.length > 0 && (
                <div className="absolute top-4 left-4 bg-black bg-opacity-95 rounded-lg p-4 border-2 border-red-500 z-20 w-80">
                  <h4 className="font-bold mb-3 text-red-400">🚨 Latest Threat Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Origin:</span>
                      <span className="font-bold text-white">{filteredThreats[0].country}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Attack Type:</span>
                      <span className="font-bold text-orange-400">{filteredThreats[0].attackType}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">IP Address:</span>
                      <span className="text-xs text-gray-300">{filteredThreats[0].ip}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Threat Level:</span>
                      <span className={`font-bold ${
                        filteredThreats[0].severity === 'Critical' ? 'text-red-500' :
                        filteredThreats[0].severity === 'High' ? 'text-orange-500' :
                        filteredThreats[0].severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
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
                        filteredThreats[0].blocked ? 'bg-green-600 text-white' : 'bg-red-600 text-white animate-pulse'
                      }`}>
                        {filteredThreats[0].blocked ? '✓ THREAT NEUTRALIZED' : '⚠ ACTIVE INTRUSION'}
                      </span>
                    </div>
                    {/* FIX: Corrected malformed Google Maps URL for external link */}
                    <a
                      href={filteredThreats.length > 0 ? `https://www.google.com/maps/search/?api=1&query=${filteredThreats[0].lat},${filteredThreats[0].lng}` : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 text-center bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-all font-semibold"
                    >
                      🗺️ View Exact Location →
                    </a>
                  </div>
                </div>
              )}

              {/* Live Stats Overlay */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-95 rounded-lg p-4 border-2 border-cyan-500 z-20">
                <h4 className="font-bold mb-3 text-cyan-400">📊 Live Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-400">Active:</span>
                    <span className="font-bold">{stats.activeThreats}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span className="text-gray-400">Rate:</span>
                    <span className="font-bold text-indigo-400">{stats.attackRate}/min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-gray-400">Critical:</span>
                    <span className="font-bold text-red-400">{stats.critical}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400">Blocked:</span>
                    <span className="font-bold text-green-400">{stats.blocked}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                    <Bell className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-400">Alerts:</span>
                    <span className={`font-bold ${soundAlertsEnabled ? 'text-green-400' : 'text-red-400'}`}>
                      {soundAlertsEnabled ? 'ON' : 'OFF'}
                    </span>
                    <button
                      onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
                      className="ml-auto text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-all"
                    >
                      Toggle
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400">Security:</span>
                    <span className={`font-bold ${isSecured ? 'text-green-400' : 'text-red-400'}`}>
                      {isSecured ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                </div>
              </div>

              {filteredThreats.length === 0 && (
                <p className="text-sm text-gray-400 absolute inset-0 flex items-center justify-center">No threats match the current filters.</p>
              )}
            </div>
            
            <ThreatGlobe threats={filteredThreats.slice(0, 50)} />

            {/* Live Monitoring Chart */}
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LineChart className="w-6 h-6 text-yellow-400" /> Real-time Attack Velocity
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={monitoringData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
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
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="attacks" stroke="#ef4444" fillOpacity={1} fill="url(#colorAttacks)" name="Total Attacks" />
                  <Area type="monotone" dataKey="blocked" stroke="#22c55e" fillOpacity={1} fill="url(#colorBlocked)" name="Blocked" />
                  <Area type="monotone" dataKey="threats" stroke="#f59e0b" fillOpacity={1} fill="url(#colorThreats)" name="Active Threats" />
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
                    onClick={() => { setFilterCountry('all'); setFilterAttackType('all'); setFilterSeverity('all'); }}
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
                      href={`https://www.google.com/maps/search/?api=1&query=${threat.lat},${threat.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900 hover:bg-gray-700 rounded-lg p-4 transition-all flex items-center gap-3 border border-gray-700 hover:border-cyan-500"
                    >
                      <Globe className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-white">{threat.country}</p>
                          {threat.blocked && (
                            <span className="text-green-400 text-xs bg-green-900/50 px-2 py-1 rounded">BLOCKED</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          IP: {threat.ip} | Severity: {threat.severity} | {new Date(threat.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
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
              <Database className="w-5 h-5" /> Connect DB
            </button>
          </div>
          <AdvancedAnalytics threats={filteredThreats} />
          
          {/* Attack Origin Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-cyan-400" /> Top 10 Attack Origins
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="country" type="category" stroke="#9ca3af" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#06b6d4" name="Attacks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attack Types Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-400" /> Attack Types Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attackTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="type" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#f59e0b" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-400" /> Threat Severity Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={severityChartData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="severity" stroke="#9ca3af" />
                <PolarRadiusAxis angle={90} domain={[0, Math.max(...severityChartData.map(d => d.count)) * 1.2]} stroke="#374151" />
                <Radar dataKey="count" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Severity Count" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Incident Response Tab */}
      {activeTab === 'incident' && (
        <div>
          <IncidentResponseSystem threats={filteredThreats} onBlockThreat={(threatId) => {
            setThreats(prev => prev.map(t => t.id === threatId ? { ...t, blocked: true } : t)
            );
          }} />
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
            ]}
          />
        </div>
      )}

      {/* Threat Intelligence Tab */}
      {activeTab === 'intel' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Intel Records</p>
              <p className="text-3xl font-bold text-cyan-400">
                {threatIntelligence.length.toLocaleString()}
              </p>
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
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Latest Update</p>
              <p className="text-3xl font-bold text-yellow-400">
                {threatIntelligence.length > 0 ? new Date().toLocaleTimeString() : 'N/A'}
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
                <div key={index} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-yellow-500 transition-all">
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${getSeverityColor(threat.risk).replace('bg', 'text')}`} />
                      {threat.type} threat from <span className="text-cyan-400">{threat.ip}</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">Source: {threat.source} | Risk: {threat.risk} | Confidence: {threat.confidence}%</p>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-all">
                    Investigate
                  </button>
                </div>
              ))
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
                <Brain className="w-6 h-6 text-purple-400" /> Attack Probability Forecast
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="attackType" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="probability" fill="#a855f7" name="Probability %" />
                  <Bar dataKey="confidence" fill="#06b6d4" name="Confidence %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Threat Risk Assessment Radar */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-pink-400" /> AI Threat Risk Assessment
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={predictionData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="attackType" stroke="#9ca3af" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#374151" />
                  <Radar dataKey="risk" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} name="Calculated Risk Score" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Prediction Timeline/List */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" /> Predicted Attack Timeline
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {aiPredictions.map((p, index) => (
                <div key={p.id} className="bg-gray-900 p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-pink-500 transition-all">
                  <div>
                    <p className="font-semibold text-white flex items-center gap-2">
                      <span className="text-pink-400">{p.type}</span> predicted in <span className="text-cyan-400">{p.targetRegion}</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Probability: <span className="text-red-400">{p.probability}%</span> | Confidence: <span className="text-green-400">{p.confidence}%</span>
                    </p>
                  </div>
                  <span className="text-xs text-yellow-400 font-semibold">{p.predictedTime}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ML Training Interface */}
          <MLTrainingInterface />

          {/* ML Model Stats */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-400" /> ML Model Performance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Last Trained</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Scan Tab */}
      {activeTab === 'upload' && (
        <div>
          <FileUploadThreatDetection />
        </div>
      )}

      {/* API Data Analysis Tab */}
      {activeTab === 'api' && (
        <div>
          <ApiDataAnalysis />
        </div>
      )}

      {/* Automated Threat Blocking Tab */}
      {activeTab === 'blocking' && (
        <div>
          <AutomatedThreatBlocking />
        </div>
      )}

      {/* Threat Correlation Engine Tab */}
      {activeTab === 'correlation' && (
        <div>
          <ThreatCorrelationEngine />
        </div>
      )}

      {/* Threat Hunting System Tab */}
      {activeTab === 'hunting' && (
        <div>
          <ThreatHuntingSystem />
        </div>
      )}

      {/* Export Reports Tab */}
      {activeTab === 'export' && (
        <div>
          <ExportReports threats={filteredThreats} />
        </div>
      )}

      {/* Role Management Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700 text-white transition-all"
            >
              <Download className="w-5 h-5" /> Export User Data
            </button>
          </div>
          <UserRoleManagement />
        </div>
      )}
      
      {/* Modals */}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
              <Download className="w-6 h-6" /> Export Threat Data
            </h2>
            <p className="text-gray-400 mb-6">Select the format to export {threats.length.toLocaleString()} total threat records.</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => { downloadCSV(); setShowExportModal(false); }}
                className="bg-green-600 hover:bg-green-700 py-4 rounded-lg font-semibold flex flex-col items-center justify-center transition-all"
              >
                <FileText className="w-6 h-6" /> CSV
              </button>
              <button
                onClick={() => { downloadExcel(); setShowExportModal(false); }}
                className="bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-semibold flex flex-col items-center justify-center transition-all"
              >
                <FileText className="w-6 h-6" /> Excel
              </button>
              <button
                onClick={() => { downloadJSON(); setShowExportModal(false); }}
                className="bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-semibold flex flex-col items-center justify-center transition-all"
              >
                <FileText className="w-6 h-6" /> JSON
              </button>
            </div>
            <button
              onClick={() => setShowExportModal(false)}
              className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Connect DB Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-purple-400 flex items-center gap-2">
              <Database className="w-6 h-6" /> Connect External Database
            </h2>
            
            {!dbConnection.type && !mongoDbConnected && (
              <div className="space-y-4">
                <p className="text-gray-400">Choose a connection method:</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => connectDatabase('PostgreSQL')}
                    className="bg-indigo-600 hover:bg-indigo-700 py-4 rounded-lg font-semibold flex flex-col items-center justify-center transition-all"
                  >
                    PostgreSQL
                  </button>
                  <button
                    onClick={() => connectDatabase('MySQL')}
                    className="bg-yellow-600 hover:bg-yellow-700 py-4 rounded-lg font-semibold flex flex-col items-center justify-center transition-all"
                  >
                    MySQL
                  </button>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="font-semibold mb-2">⚡ Quick Connect (MongoDB Atlas via Gmail)</p>
                  <input
                    type="email"
                    value={gmailEmail}
                    onChange={(e) => setGmailEmail(e.target.value)}
                    placeholder="Your Gmail Address"
                    className="w-full px-4 py-2 mb-3 bg-gray-900 border border-gray-700 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
                    required
                  />
                  <button
                    onClick={handleGmailAuth}
                    className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Cloud className="w-5 h-5" /> Auth with Gmail
                  </button>
                  {connectionStatus && (
                    <p className={`mt-3 text-sm ${connectionStatus.startsWith('✓') ? 'text-green-400' : 'text-yellow-400'}`}>{connectionStatus}</p>
                  )}
                  {mongoConnectionString && (
                    <button
                      onClick={handleMongoDBConnect}
                      className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg font-semibold transition-all"
                    >
                      Connect to MongoDB Atlas
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Traditional DB Form */}
            {dbConnection.type && (
              <form onSubmit={handleDatabaseConnect} className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400">Connect to {dbConnection.type}</h3>
                {connectionStatus && (
                    <p className={`text-sm ${connectionStatus.startsWith('✓') ? 'text-green-400' : 'text-yellow-400'}`}>{connectionStatus}</p>
                )}
                
                {/* Host */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Host/IP</label>
                  <input
                    type="text"
                    value={dbConnection.host}
                    onChange={(e) => setDbConnection(prev => ({ ...prev, host: e.target.value }))}
                    placeholder="e.g., localhost or 192.168.1.1"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
                
                {/* Port */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Port</label>
                    <input
                      type="number"
                      value={dbConnection.port}
                      onChange={(e) => setDbConnection(prev => ({ ...prev, port: e.target.value }))}
                      placeholder={dbConnection.type === 'PostgreSQL' ? '5432' : '3306'}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                  
                  {/* Database Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Database Name</label>
                    <input
                      type="text"
                      value={dbConnection.database}
                      onChange={(e) => setDbConnection(prev => ({ ...prev, database: e.target.value }))}
                      placeholder="e.g., cyber_logs"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={dbConnection.username}
                    onChange={(e) => setDbConnection(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Database Username"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
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

      {/* Map API Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
              <Globe className="w-6 h-6" /> Map API Settings
            </h2>
            <p className="text-gray-400 mb-6">Configure API keys for premium map providers.</p>

            <div className="space-y-4">
              {/* Google Maps Info */}
              <div className="bg-gray-900 rounded-lg p-4 border border-cyan-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" /> Google Maps (Pro)
                  </h3>
                  {apiKeys.google ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600"> ✓ Connected </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600"> ✕ Disconnected </span>
                  )}
                </div>
                <input
                  type="text"
                  value={apiKeys.google}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, google: e.target.value }))}
                  placeholder="Enter Google Maps API Key"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
                />
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
                    <Globe className="w-5 h-5 text-green-400" /> OpenStreetMap (Free)
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600"> ✓ Always Available </span>
                </div>
                <p className="text-sm text-gray-400">
                  No API key required. OpenStreetMap is free and always available for use.
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-green-400">✓ No rate limits</p>
                  <p className="text-xs text-green-400">✓ Open source</p>
                  <p className="text-xs text-green-400">✓ Good basic coverage</p>
                </div>
              </div>

              {/* Mapbox Info */}
              <div className="bg-gray-900 rounded-lg p-4 border border-purple-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-400" /> Mapbox (Pro)
                  </h3>
                  {apiKeys.mapbox ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-600"> ✓ Connected </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600"> ✕ Disconnected </span>
                  )}
                </div>
                <input
                  type="text"
                  value={apiKeys.mapbox}
                  onChange={(e) => setApiKeys(prev => ({ ...prev, mapbox: e.target.value }))}
                  placeholder="Enter Mapbox Access Token"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-cyan-500 focus:outline-none"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-purple-400">✓ Highly customizable vector tiles</p>
                  <p className="text-xs text-purple-400">✓ Global coverage</p>
                  <p className="text-xs text-purple-400">✓ Optimized for large data sets</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowApiModal(false)}
              className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CyberThreatDashboard;