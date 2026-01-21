import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVoteEvent } from "@/hooks/useEvents";

interface VoteButtonsProps {
  eventId: string;
  verificationScore: number;
  onDownvote: () => void;
}

const VoteButtons = ({ eventId, verificationScore, onDownvote }: VoteButtonsProps) => {
  const [hasVoted, setHasVoted] = useState<"up" | "down" | null>(null);
  const voteEvent = useVoteEvent();

  const handleUpvote = () => {
    if (hasVoted) return;
    
    voteEvent.mutate(
      { eventId, voteType: "up" },
      {
        onSuccess: () => setHasVoted("up"),
      }
    );
  };

  const handleDownvote = () => {
    if (hasVoted) return;
    setHasVoted("down");
    onDownvote();
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUpvote}
        disabled={hasVoted !== null || voteEvent.isPending}
        className={cn(
          "h-7 w-7 p-0 rounded-full transition-colors",
          hasVoted === "up"
            ? "bg-success/20 text-success hover:bg-success/20"
            : "hover:bg-success/10 hover:text-success"
        )}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      
      <span className="text-xs font-medium text-muted-foreground min-w-[20px] text-center">
        {verificationScore}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownvote}
        disabled={hasVoted !== null}
        className={cn(
          "h-7 w-7 p-0 rounded-full transition-colors",
          hasVoted === "down"
            ? "bg-destructive/20 text-destructive hover:bg-destructive/20"
            : "hover:bg-destructive/10 hover:text-destructive"
        )}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VoteButtons;
