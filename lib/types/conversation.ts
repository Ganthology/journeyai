export type Conversation = {
  id: string;
  type: "ideation" | "reflection";
  title: string;
  createdAt: string;
};

export type ConversationWithNote = Conversation & {
  Note: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ReflectionContent = {
  gratitude: string;
  tension: string;
  win: string;
};

export type IdeationContent = {
  summary: string;
  resources: string[];
  todos: string[];
};

export type ConversationContent = ReflectionContent | IdeationContent; 