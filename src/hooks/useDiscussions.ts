import { useState, useEffect } from 'react';
import { Discussion, discussions as initialDiscussions, Reply } from '@/data/mockDiscussions';

type DiscussionInput = Omit<Discussion, 'id' | 'createdAt' | 'replies' | 'likes' | 'repliesContent'>;

// Helper function to recursively parse dates in replies
const parseRepliesDates = (replies: Reply[]): Reply[] => {
  if (!replies) return [];
  return replies.map(reply => ({
    ...reply,
    createdAt: new Date(reply.createdAt),
    replies: reply.replies ? parseRepliesDates(reply.replies) : []
  }));
};

// Type for the parsed discussion from localStorage
interface ParsedDiscussion {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: Discussion['category'];
  createdAt: string;
  replies: number;
  likes: number;
  repliesContent?: Reply[];
}

export function useDiscussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const saved = localStorage.getItem('sandiwa.discussions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ParsedDiscussion[];
        // Parse dates back to Date objects for each discussion and their replies
        return parsed.map((d: ParsedDiscussion) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          repliesContent: d.repliesContent ? parseRepliesDates(d.repliesContent) : []
        }));
      } catch (error) {
        console.error('Failed to parse discussions from localStorage:', error);
        return initialDiscussions;
      }
    }
    return initialDiscussions;
  });

  useEffect(() => {
    localStorage.setItem('sandiwa.discussions', JSON.stringify(discussions));
  }, [discussions]);

  const addDiscussion = (newDiscussion: DiscussionInput): Discussion => {
    const discussion: Discussion = {
      ...newDiscussion,
      id: `discussion-${Date.now()}`,
      createdAt: new Date(),
      replies: 0,
      likes: 0,
      repliesContent: [],
    };
    setDiscussions(prev => [discussion, ...prev]);
    return discussion;
  };

  const updateDiscussion = (id: string, updatedDiscussion: Partial<Discussion>): void => {
    setDiscussions(prev =>
      prev.map(discussion =>
        discussion.id === id ? { ...discussion, ...updatedDiscussion } : discussion
      )
    );
  };

  const deleteDiscussion = (id: string): void => {
    setDiscussions(prev => prev.filter(discussion => discussion.id !== id));
  };

  const getDiscussionById = (id: string): Discussion | undefined => {
    return discussions.find(discussion => discussion.id === id);
  };

  return { 
    discussions, 
    addDiscussion, 
    updateDiscussion, 
    deleteDiscussion,
    getDiscussionById 
  };
}