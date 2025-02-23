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