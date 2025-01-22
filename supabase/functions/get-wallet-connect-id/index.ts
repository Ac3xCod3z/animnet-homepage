// Follow Deno runtime standard
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching WalletConnect project ID from environment...');
    const projectId = Deno.env.get('WALLET_CONNECT_PROJECT_ID');
    
    if (!projectId) {
      console.error('WALLET_CONNECT_PROJECT_ID not found in environment');
      throw new Error('WALLET_CONNECT_PROJECT_ID not found in environment');
    }

    console.log('Successfully retrieved WalletConnect project ID');
    return new Response(
      JSON.stringify({
        projectId
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in get-wallet-connect-id function:', error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});