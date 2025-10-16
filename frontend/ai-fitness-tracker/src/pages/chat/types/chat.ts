export interface Chat {
  id: number;
  title: string;
}


export interface ConversationItemType {
  type: "user" | "assistant" | "reasoning" | "function_call";
  content: string | FunctionCallContent | ReasoningEvent;
  call_id?: string;
  id?: string;
}


export interface Message {
  type: 'message' | 'reasoning' | 'function_call'
  role?: 'user' | 'assistant'
  message: {
    id?: string
    call_id?: string
    content?: string | { text: string }[];
    name?: string;
  };
  duration_secs?: number;
}


export interface FunctionCallContent {
  action?: string;
  doneAction: string;
}


export interface ReasoningEvent {
  active: boolean;
  startTime: number;
  durationSecs: number;
}
