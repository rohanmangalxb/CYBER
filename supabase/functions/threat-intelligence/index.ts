import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ThreatIntelData {
  source: string;
  threats: Array<{
    ip: string;
    country: string;
    attackType: string;
    severity: string;
    confidence: number;
    lastSeen: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching threat intelligence feeds...');

    // Simulated threat intelligence from multiple sources
    // In production, you would integrate with real APIs like:
    // - AbuseIPDB
    // - VirusTotal
    // - AlienVault OTX
    // - Shodan
    // - IPInfo

    const threatFeeds: ThreatIntelData[] = [
      {
        source: 'Global Threat Feed',
        threats: generateThreatIntel('global', 10)
      },
      {
        source: 'Regional Security Monitor',
        threats: generateThreatIntel('regional', 8)
      },
      {
        source: 'DDoS Protection Network',
        threats: generateThreatIntel('ddos', 6)
      }
    ];

    // Aggregate and deduplicate threats
    const allThreats = threatFeeds.flatMap(feed => 
      feed.threats.map(threat => ({
        ...threat,
        source: feed.source
      }))
    );

    // Remove duplicates based on IP
    const uniqueThreats = Array.from(
      new Map(allThreats.map(t => [t.ip, t])).values()
    );

    console.log(`Fetched ${uniqueThreats.length} unique threats from ${threatFeeds.length} sources`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        totalThreats: uniqueThreats.length,
        sources: threatFeeds.length,
        threats: uniqueThreats
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching threat intelligence:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function generateThreatIntel(type: string, count: number) {
  const countries = [
    'Russia', 'China', 'North Korea', 'Iran', 'USA', 'Brazil', 
    'Germany', 'India', 'Nigeria', 'Ukraine'
  ];

  const attackTypes = [
    'DDoS', 'Brute Force', 'SQL Injection', 'Malware Distribution',
    'Phishing Campaign', 'Ransomware', 'Zero-Day Exploit',
    'Credential Stuffing', 'Botnet Activity', 'Port Scanning'
  ];

  const threats = [];
  
  for (let i = 0; i < count; i++) {
    const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    const country = countries[Math.floor(Math.random() * countries.length)];
    const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const severity = ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)];
    const confidence = 60 + Math.random() * 40; // 60-100%
    
    const lastSeen = new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000 // Last 7 days
    ).toISOString();

    threats.push({
      ip,
      country,
      attackType,
      severity,
      confidence: Math.round(confidence),
      lastSeen
    });
  }

  return threats;
}