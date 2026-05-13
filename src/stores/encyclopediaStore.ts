// src/stores/encyclopediaStore.ts
import { EncyclopediaArticle, encyclopediaArticles as initialArticles } from "@/data/mockEncyclopedia";
import { useEffect, useState } from "react";

// In-memory store that persists across the session
let articlesStore = [...initialArticles];

// Helper functions
export const getArticles = () => articlesStore;

export const getArticleById = (id: string) => articlesStore.find(a => a.id === id);

export const addArticle = (article: EncyclopediaArticle) => {
  articlesStore = [article, ...articlesStore];
  // Dispatch event to notify components of the change
  window.dispatchEvent(new CustomEvent('articlesUpdated', { detail: { articles: articlesStore } }));
  return article;
};

export const updateArticle = (updatedArticle: EncyclopediaArticle) => {
  articlesStore = articlesStore.map(article => 
    article.id === updatedArticle.id ? updatedArticle : article
  );
  window.dispatchEvent(new CustomEvent('articlesUpdated', { detail: { articles: articlesStore } }));
  return updatedArticle;
};

export const deleteArticle = (articleId: string) => {
  articlesStore = articlesStore.filter(article => article.id !== articleId);
  window.dispatchEvent(new CustomEvent('articlesUpdated', { detail: { articles: articlesStore } }));
  return articleId;
};

// Hook to use the store in components
export const useEncyclopediaStore = () => {
  const [articles, setArticles] = useState(articlesStore);

  useEffect(() => {
    const handleUpdate = (event: CustomEvent) => {
      setArticles(event.detail.articles);
    };

    window.addEventListener('articlesUpdated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('articlesUpdated', handleUpdate as EventListener);
    };
  }, []);

  return {
    articles,
    getArticleById: (id: string) => articles.find(a => a.id === id),
    getArticlesByCategory: (category: string) => 
      category === "All" ? articles : articles.filter(a => a.category === category && a.status === "published"),
    getArticlesByMentor: (mentorId: string) => articles.filter(a => a.authorId === mentorId),
    getPublishedArticles: () => articles.filter(a => a.status === "published"),
    getFeaturedArticles: (limit: number = 3) => 
      [...articles].filter(a => a.status === "published").sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit),
  };
};