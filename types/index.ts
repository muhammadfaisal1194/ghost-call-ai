export type CallStatus = "pending" | "in_progress" | "completed" | "failed";
export type CallTone = "friendly" | "firm" | "aggressive";

export interface Call {
  id: string;
  caller_name: string;
  mission: string;
  phone_number: string;
  tone: CallTone;
  status: CallStatus;
  transcript: string | null;
  outcome_summary: string | null;
  vapi_call_id?: string | null;
  created_at: string;
}

export interface StartCallPayload {
  caller_name: string;
  mission: string;
  phone_number: string;
  tone: CallTone;
}

export interface StartCallResponse {
  callId: string;
}

export interface VapiMessage {
  type: string;
  call?: {
    id: string;
  };
  artifact?: {
    transcript?: string;
    messages?: VapiTranscriptMessage[];
  };
  endedReason?: string;
}

export interface VapiTranscriptMessage {
  role: "user" | "assistant" | "system";
  message: string;
  time?: number;
}
