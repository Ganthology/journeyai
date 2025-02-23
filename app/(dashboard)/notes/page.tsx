"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

type NoteContent = {
  gratitude?: string;
  tension?: string;
  win?: string;
} | string;

type Note = {
  id: string;
  content: NoteContent;
  createdAt: string;
  conversation: {
    title: string;
    type: string;
  };
};

function NoteContent({ content }: { content: NoteContent }) {
  if (typeof content === 'string') {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  return (
    <div className="space-y-4">
      {content.gratitude && (
        <div>
          <h4 className="font-medium text-sm">Gratitude</h4>
          <p className="text-muted-foreground">{content.gratitude}</p>
        </div>
      )}
      {content.tension && (
        <div>
          <h4 className="font-medium text-sm">Tension</h4>
          <p className="text-muted-foreground">{content.tension}</p>
        </div>
      )}
      {content.win && (
        <div>
          <h4 className="font-medium text-sm">Win</h4>
          <p className="text-muted-foreground">{content.win}</p>
        </div>
      )}
    </div>
  );
}

export default function NotesPage() {
  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await axios.get("/api/notes");
      return response.data as Note[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Notes</h2>
        <div className="text-muted-foreground">Loading notes...</div>
      </div>
    );
  }

  if (!notes?.length) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Notes</h2>
        <div className="text-muted-foreground">
          Start a conversation to create notes.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Notes</h2>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="flex flex-col gap-4 pr-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{note.conversation.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {note.conversation.type}
                    </p>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(note.createdAt), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
              </CardHeader>
              <CardContent>
                <NoteContent content={note.content} />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
