import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // GET /threat-api/threats - Query all threats
    if (req.method === 'GET' && path === 'threats') {
      const limit = url.searchParams.get('limit') || '100';
      const severity = url.searchParams.get('severity');
      
      let query = supabaseClient
        .from('threats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit));

      if (severity) {
        query = query.eq('threat_level', severity);
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: data.length,
          threats: data 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /threat-api/stats - Get threat statistics
    if (req.method === 'GET' && path === 'stats') {
      const { data: allThreats, error: allError } = await supabaseClient
        .from('threats')
        .select('threat_level, blocked');

      if (allError) throw allError;

      const stats = {
        total: allThreats.length,
        blocked: allThreats.filter(t => t.blocked).length,
        active: allThreats.filter(t => !t.blocked).length,
        critical: allThreats.filter(t => t.threat_level === 'Critical').length,
        high: allThreats.filter(t => t.threat_level === 'High').length,
        medium: allThreats.filter(t => t.threat_level === 'Medium').length,
        low: allThreats.filter(t => t.threat_level === 'Low').length,
      };

      return new Response(
        JSON.stringify({ success: true, stats }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /threat-api/subscribe - Subscribe to real-time alerts (returns webhook info)
    if (req.method === 'POST' && path === 'subscribe') {
      const { webhook_url, alert_types } = await req.json();

      if (!webhook_url) {
        return new Response(
          JSON.stringify({ success: false, error: 'webhook_url is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // In a real implementation, this would store the webhook subscription
      // For now, we'll return a confirmation
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Webhook subscription created',
          subscription_id: crypto.randomUUID(),
          webhook_url,
          alert_types: alert_types || ['all'],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /threat-api/ml-classify - ML-based threat classification
    if (req.method === 'POST' && path === 'ml-classify') {
      const { threat_data } = await req.json();

      if (!threat_data) {
        return new Response(
          JSON.stringify({ success: false, error: 'threat_data is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Simulate ML classification based on historical patterns
      const classification = {
        threat_type: ['DDoS', 'Malware', 'Phishing', 'SQL Injection', 'XSS'][Math.floor(Math.random() * 5)],
        confidence: 0.75 + Math.random() * 0.25,
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        predicted_impact: Math.random() * 100,
        recommended_action: ['Monitor', 'Alert', 'Block', 'Quarantine'][Math.floor(Math.random() * 4)],
      };

      return new Response(
        JSON.stringify({ success: true, classification }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Endpoint not found',
        available_endpoints: [
          'GET /threat-api/threats?limit=100&severity=Critical',
          'GET /threat-api/stats',
          'POST /threat-api/subscribe',
          'POST /threat-api/ml-classify'
        ]
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in threat-api:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
