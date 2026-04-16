/**
 * API client for interacting with the BluffBuster backend
 */

const API_BASE_URL = 'http://localhost:8000/api';

export interface AnalysisResponse {
  session_id: string;
  mode: string;
  filename: string;
  status: 'processing' | 'complete' | 'error';
  message: string;
}

export interface SessionResult {
  session_id: string;
  status: 'processing' | 'complete' | 'error';
  results: {
    claim_results: any[];
    heatmap: any[];
    debate: any[];
    overall_trust_score: number;
    first_impression?: any;
    financial_stress?: any;
    competitors?: any;
    red_flags?: any;
    domain_credibility?: any;
  } | null;
}

export const api = {
  /**
   * Upload a pitch deck PDF
   */
  analyzeDeck: async (file: File, mode: 'founder' | 'vc', persona: string = 'standard'): Promise<AnalysisResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    formData.append('persona', persona);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to start analysis: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Get the status and full results of a session
   */
  getSession: async (sessionId: string): Promise<SessionResult> => {
    const response = await fetch(`${API_BASE_URL}/session/${sessionId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Intervene in an adversarial debate
   */
  interveneDebate: async (sessionId: string, claim: string, message: string) => {
    const response = await fetch(`${API_BASE_URL}/debate/${sessionId}/intervene`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claim, message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to intervene in debate: ${response.statusText}`);
    }

    return response.json();
  }
};
