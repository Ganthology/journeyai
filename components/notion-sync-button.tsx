import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle, Loader2, Share } from "lucide-react";
import { useState } from "react";

interface NotionSyncButtonProps {
  noteId: string;
  notionUrl?: string | null;
}

export function NotionSyncButton({ noteId, notionUrl }: NotionSyncButtonProps) {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/notes/${noteId}/sync`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (notionUrl) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => window.open(notionUrl, "_blank")}
      >
        <CheckCircle className="h-4 w-4 text-green-500" />
        {isHovered ? "Open in Notion" : "Synced"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => syncMutation.mutate()}
      disabled={syncMutation.isPending}
    >
      {syncMutation.isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Share className="h-4 w-4" />
      )}
      Sync to Notion
    </Button>
  );
} 