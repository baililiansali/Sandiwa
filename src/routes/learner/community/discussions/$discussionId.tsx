import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { useDiscussions } from "@/hooks/useDiscussions";
import { useAuth } from "@/hooks/useAuth";
import { formatDiscussionDate, Reply } from "@/data/mockDiscussions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Heart, User, Reply as ReplyIcon, Star, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/learner/community/discussions/$discussionId")({
  loader: ({ params }) => {
    return { discussionId: params.discussionId };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Discussion — Sandiwa` },
    ],
  }),
  notFoundComponent: NotFoundComponent,
  component: DiscussionDetailPage,
});

function NotFoundComponent() {
  const navigate = useNavigate();

  const handleGoBack = (): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/learner/community/discussions" });
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Discussion not found</h1>
        <p className="mt-2 text-muted-foreground">
          The discussion you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={handleGoBack}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-gold-foreground transition hover:bg-gold/90"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
      </div>
    </SiteLayout>
  );
}

// Component for individual comment/reply
function CommentItem({ 
  reply, 
  onLike, 
  onAddReply,
  depth = 0,
}: { 
  reply: Reply; 
  onLike: (replyId: string) => void;
  onAddReply: (parentId: string | null, content: string, parentAuthor?: string) => void;
  depth: number;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(reply.isLiked || false);
  const [likesCount, setLikesCount] = useState(reply.likes);

  const handleLike = () => {
    const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1;
    setLikesCount(newLikesCount);
    setIsLiked(!isLiked);
    onLike(reply.id);
  };

  const handleSubmitReply = () => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    onAddReply(reply.id, replyContent, reply.author);
    setReplyContent("");
    setShowReplyForm(false);
  };

  // Get initial for avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Get random color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const hasReplies = reply.replies && reply.replies.length > 0;

  return (
    <div className={`relative ${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarColor(reply.author)} flex items-center justify-center text-white font-semibold text-sm`}>
          {getInitial(reply.author)}
        </div>
        
        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-muted/30 rounded-lg p-4">
            {/* Author and metadata */}
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span className="font-semibold text-navy">{reply.author}</span>
              {reply.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  <CheckCircle className="h-3 w-3" /> Verified
                </span>
              )}
              {reply.isInstructor && (
                <span className="inline-flex items-center gap-1 text-xs text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                  <Star className="h-3 w-3" /> Instructor
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDiscussionDate(reply.createdAt)}
              </span>
            </div>
            
            {/* Comment text */}
            <p className="text-sm text-foreground mt-1">{reply.content}</p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-4 mt-1 ml-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition py-1"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition py-1"
            >
              <ReplyIcon className="h-4 w-4" />
              Reply
            </button>
          </div>
          
          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3 ml-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder={`Reply to ${reply.author}...`}
                autoFocus
              />
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={handleSubmitReply}
                  className="bg-gold text-gold-foreground hover:bg-gold/90"
                  size="sm"
                >
                  Post Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReplyForm(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Nested replies */}
          {hasReplies && (
            <div className="mt-3">
              {reply.replies!.map((childReply) => (
                <CommentItem
                  key={childReply.id}
                  reply={childReply}
                  onLike={onLike}
                  onAddReply={onAddReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DiscussionDetailPage() {
  const { discussionId } = Route.useLoaderData();
  const navigate = useNavigate();
  const { getDiscussionById, updateDiscussion } = useDiscussions();
  const { user } = useAuth();
  const discussion = getDiscussionById(discussionId);
  
  const [replyText, setReplyText] = useState<string>("");
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(discussion?.likes || 0);
  const [replies, setReplies] = useState<Reply[]>(discussion?.repliesContent || []);

  if (!discussion) {
    throw notFound();
  }

  // Handle like on main post
  const handleLike = (): void => {
    const newLikesCount = liked ? likesCount - 1 : likesCount + 1;
    setLikesCount(newLikesCount);
    setLiked(!liked);
    updateDiscussion(discussion.id, { likes: newLikesCount });
  };

  // Handle like on replies
  const handleReplyLike = (replyId: string): void => {
    const updateReplies = (replyList: Reply[]): Reply[] => {
      return replyList.map(reply => {
        if (reply.id === replyId) {
          const isLiked = !reply.isLiked;
          const newLikes = isLiked ? (reply.likes || 0) + 1 : (reply.likes || 0) - 1;
          return { ...reply, likes: newLikes, isLiked };
        }
        if (reply.replies && reply.replies.length > 0) {
          return { ...reply, replies: updateReplies(reply.replies) };
        }
        return reply;
      });
    };
    
    const updatedReplies = updateReplies(replies);
    setReplies(updatedReplies);
    updateDiscussion(discussion.id, { repliesContent: updatedReplies });
  };

  // Add a new reply to a parent (either main post or another reply)
  const addReplyToParent = (replyList: Reply[], parentId: string | null, newReply: Reply): Reply[] => {
    if (parentId === null) {
      return [...replyList, newReply];
    }
    
    return replyList.map(reply => {
      if (reply.id === parentId) {
        const updatedReplies = [...(reply.replies || []), newReply];
        return { ...reply, replies: updatedReplies };
      }
      if (reply.replies && reply.replies.length > 0) {
        return { ...reply, replies: addReplyToParent(reply.replies, parentId, newReply) };
      }
      return reply;
    });
  };

  // Count all replies including nested
  const countAllReplies = (replyList: Reply[]): number => {
    let count = replyList.length;
    replyList.forEach(reply => {
      if (reply.replies && reply.replies.length > 0) {
        count += countAllReplies(reply.replies);
      }
    });
    return count;
  };

  // Handle reply to main post
  const handleSubmitReply = (): void => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      author: user?.name || "Anonymous",
      content: replyText,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      isVerified: user?.isVerified || false,
      isInstructor: user?.role === "mentor",
      replies: [],
    };
    
    const updatedReplies = addReplyToParent(replies, null, newReply);
    setReplies(updatedReplies);
    setReplyText("");
    
    updateDiscussion(discussion.id, { 
      repliesContent: updatedReplies,
      replies: countAllReplies(updatedReplies)
    });
    toast.success("Reply posted!");
  };

  // Handle reply to a specific comment
  const handleReplyToComment = (parentId: string | null, content: string, parentAuthor?: string): void => {
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      author: user?.name || "Anonymous",
      content: content,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      isVerified: user?.isVerified || false,
      isInstructor: user?.role === "mentor",
      replies: [],
    };
    
    const updatedReplies = addReplyToParent(replies, parentId, newReply);
    setReplies(updatedReplies);
    
    updateDiscussion(discussion.id, { 
      repliesContent: updatedReplies,
      replies: countAllReplies(updatedReplies)
    });
    toast.success("Reply posted!");
  };

  const handleGoBack = (): void => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/learner/community/discussions" });
    }
  };

  const totalReplies = countAllReplies(replies);
  
  // Get initial for main post author
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-orange-500"
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <AuthGuard>
      <SiteLayout>
        <section className="bg-cream pb-10 pt-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {/* Main Discussion Post - styled like a comment */}
            <div className="flex gap-3 mb-8">
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarColor(discussion.author)} flex items-center justify-center text-white font-semibold text-sm`}>
                {getInitial(discussion.author)}
              </div>
              
              {/* Post Content */}
              <div className="flex-1">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="font-semibold text-navy">{discussion.author}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                      <Star className="h-3 w-3" /> Discussion
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDiscussionDate(discussion.createdAt)}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-navy mt-2">{discussion.title}</h1>
                  <p className="text-sm text-foreground mt-2">{discussion.content}</p>
                </div>
                
                <div className="flex items-center gap-4 mt-1 ml-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 text-xs transition py-1 ${
                      liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
                    {likesCount > 0 && <span>{likesCount}</span>}
                  </button>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {totalReplies} replies
                  </span>
                </div>
              </div>
            </div>

            {/* Replies Section Header */}
            <div className="mt-8 mb-4">
              <h2 className="font-semibold text-navy text-lg">
                {totalReplies} Comments
              </h2>
            </div>

            {/* All Comments/Replies */}
            <div className="space-y-5">
              {replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  reply={reply}
                  onLike={handleReplyLike}
                  onAddReply={handleReplyToComment}
                  depth={0}
                />
              ))}

              {replies.length === 0 && (
                <div className="text-center py-12 bg-muted/20 rounded-lg">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>

            {/* Add a Comment Form - at the bottom */}
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-medium text-navy mb-3">Add a comment</h3>
              <div className="flex gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarColor(user?.name || "Anonymous")} flex items-center justify-center text-white font-semibold text-sm`}>
                  {getInitial(user?.name || "Anonymous")}
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReplyText(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Write a comment..."
                  />
                  <div className="mt-2 flex justify-end">
                    <Button onClick={handleSubmitReply} className="bg-gold text-gold-foreground hover:bg-gold/90">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SiteLayout>
    </AuthGuard>
  );
}