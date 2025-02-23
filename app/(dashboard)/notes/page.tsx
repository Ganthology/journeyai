"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { NotionSyncButton } from "@/components/notion-sync-button";

type Todo = {
  id: string;
  task: string;
  completed: boolean;
};

type Resource = {
  id: string;
  title: string;
};

type Note = {
  id: string;
  content: string | IdeationContent;
  createdAt: string;
  notionUrl: string | null;
  resources: Resource[];
  todos: Todo[];
  conversation: {
    title: string;
    type: string;
  };
};

function NoteContent({ note }: { note: Note }) {
  const queryClient = useQueryClient();
  const toggleTodo = useMutation({
    mutationFn: async (todoId: string) => {
      await axios.patch(`/api/todos/${todoId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (typeof note.content === 'string') {
    return <p className="whitespace-pre-wrap">{note.content}</p>;
  }

  const content = note.content as IdeationContent;

  return (
    <div className="space-y-6">
      <div>
        <p className="whitespace-pre-wrap">{content.summary}</p>
      </div>

      {note.resources.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Resources</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {note.resources.map((resource) => (
              <li key={resource.id}>{resource.title}</li>
            ))}
          </ul>
        </div>
      )}

      {note.todos.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Todos</h4>
          <div className="space-y-2">
            {note.todos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo.mutate(todo.id)}
                />
                <span className={todo.completed ? "line-through" : ""}>
                  {todo.task}
                </span>
              </div>
            ))}
          </div>
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
                  <div className="flex items-center gap-2">
                    <NotionSyncButton noteId={note.id} notionUrl={note.notionUrl} />
                    <time className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(note.createdAt), {
                        addSuffix: true,
                      })}
                    </time>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <NoteContent note={note} />
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
