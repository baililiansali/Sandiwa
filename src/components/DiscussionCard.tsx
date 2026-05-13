import { Link } from "@tanstack/react-router";
import { MessageCircle, Heart } from "lucide-react";
import { Discussion, formatDiscussionDate } from "@/data/mockDiscussions";

interface DiscussionCardProps {
  discussion: Discussion;
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  const categoryColors: Record<string, string> = {
    "Filipino Language": "bg-blue-100 text-blue-700",
    Heritage: "bg-amber-100 text-amber-700",
    Cuisine: "bg-orange-100 text-orange-700",
    "Music & Dance": "bg-purple-100 text-purple-700",
    History: "bg-rose-100 text-rose-700",
    "Arts & Crafts": "bg-emerald-100 text-emerald-700",
  };

  return (
    <Link
      to="/community/discussions/$discussionId"
      params={{ discussionId: discussion.id }}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                categoryColors[discussion.category] || "bg-gray-100 text-gray-700"
              }`}
            >
              {discussion.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDiscussionDate(discussion.createdAt)}
            </span>
          </div>
          <h3 className="mt-2 font-serif text-lg font-semibold text-navy group-hover:text-gold transition-colors">
            {discussion.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {discussion.content}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {discussion.replies} replies
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {discussion.likes} likes
            </span>
            <span className="text-xs">by {discussion.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}