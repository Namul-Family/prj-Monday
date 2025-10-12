import { z } from 'zod';

// String literals for SQLite compatibility (since SQLite doesn't support enums)
export const BookmarkType = z.enum(['text', 'link', 'image']);
export const BookmarkStatus = z.enum(['inbox', 'active', 'archived']);

// User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  isAnonymous: z.boolean().default(true),
  createdAt: z.date(),
});

// Tag Schema
export const TagSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(50),
  color: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Bookmark Schema
export const BookmarkSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: BookmarkType,
  status: BookmarkStatus.default('inbox'),
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  memo: z.string().max(5000).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImageUrl: z.string().url().optional(),
  isFavorite: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

// BookmarkTag Schema
export const BookmarkTagSchema = z.object({
  bookmarkId: z.string().uuid(),
  tagId: z.string().uuid(),
});

// Note Schema
export const NoteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  bookmarkId: z.string().uuid(),
  body: z.string().min(1).max(1000),
  createdAt: z.date(),
});

// Create/Update Schemas
export const CreateBookmarkSchema = BookmarkSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const UpdateBookmarkSchema = CreateBookmarkSchema.partial();

export const CreateTagSchema = TagSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTagSchema = CreateTagSchema.partial();

export const CreateNoteSchema = NoteSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

// Query Schemas
export const BookmarkQuerySchema = z.object({
  status: BookmarkStatus.optional(),
  isFavorite: z.boolean().optional(),
  tagId: z.string().uuid().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const TagQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

// Type exports
export type BookmarkType = z.infer<typeof BookmarkType>;
export type BookmarkStatus = z.infer<typeof BookmarkStatus>;
export type User = z.infer<typeof UserSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type Bookmark = z.infer<typeof BookmarkSchema>;
export type BookmarkTag = z.infer<typeof BookmarkTagSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type CreateBookmark = z.infer<typeof CreateBookmarkSchema>;
export type UpdateBookmark = z.infer<typeof UpdateBookmarkSchema>;
export type CreateTag = z.infer<typeof CreateTagSchema>;
export type UpdateTag = z.infer<typeof UpdateTagSchema>;
export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type BookmarkQuery = z.infer<typeof BookmarkQuerySchema>;
export type TagQuery = z.infer<typeof TagQuerySchema>;
