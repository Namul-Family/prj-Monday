import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { CreateBookmarkSchema, UpdateBookmarkSchema, BookmarkQuerySchema } from '@monday-bookmark/types';

const router: Router = Router();  // <-- 명시적 타입
const prisma = new PrismaClient();

const DEFAULT_USER_ID = 'demo-user-123';

// GET /api/bookmarks - List bookmarks
router.get('/', async (req: Request, res: Response) => {   // <-- req/res 타입
  try {
    const query = BookmarkQuerySchema.parse({
      status: req.query.status,
      isFavorite: req.query.isFavorite === 'true' ? true : req.query.isFavorite === 'false' ? false : undefined,
      tagId: req.query.tagId,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    });

    const where: any = {
      userId: DEFAULT_USER_ID,
      deletedAt: null,
    };

    if (query.status) where.status = query.status;
    if (query.isFavorite !== undefined) where.isFavorite = query.isFavorite;
    if (query.tagId) {
      where.tags = { some: { tagId: query.tagId } };
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        tags: { include: { tag: true } },
        notes: true,
        _count: { select: { notes: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    });

    const total = await prisma.bookmark.count({ where });

    res.json({
      bookmarks: bookmarks.map(b => ({ ...b, tags: b.tags.map(bt => bt.tag) })),
      total,
      limit: query.limit,
      offset: query.offset,
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
});

// GET /api/bookmarks/:id - Get single bookmark
router.get('/:id', async (req: Request, res: Response) => {   // <-- 타입
  try {
    const { id } = req.params;
    const bookmark = await prisma.bookmark.findFirst({
      where: { id, userId: DEFAULT_USER_ID, deletedAt: null },
      include: {
        tags: { include: { tag: true } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

    res.json({ ...bookmark, tags: bookmark.tags.map(bt => bt.tag) });
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    res.status(500).json({ error: 'Failed to fetch bookmark' });
  }
});

// POST /api/bookmarks - Create bookmark
router.post('/', async (req: Request, res: Response) => {     // <-- 타입
  try {
    const data = CreateBookmarkSchema.parse(req.body);
    const bookmark = await prisma.bookmark.create({
      data: { ...data, userId: DEFAULT_USER_ID },
      include: { tags: { include: { tag: true } } },
    });
    res.status(201).json({ ...bookmark, tags: bookmark.tags.map(bt => bt.tag) });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
});

// PATCH /api/bookmarks/:id - Update bookmark
router.patch('/:id', async (req: Request, res: Response) => { // <-- 타입
  try {
    const { id } = req.params;
    const data = UpdateBookmarkSchema.parse(req.body);

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { id, userId: DEFAULT_USER_ID, deletedAt: null },
    });
    if (!existingBookmark) return res.status(404).json({ error: 'Bookmark not found' });

    const bookmark = await prisma.bookmark.update({
      where: { id },
      data,
      include: { tags: { include: { tag: true } } },
    });

    res.json({ ...bookmark, tags: bookmark.tags.map(bt => bt.tag) });
  } catch (error) {
    console.error('Error updating bookmark:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// DELETE /api/bookmarks/:id - Soft delete
router.delete('/:id', async (req: Request, res: Response) => { // <-- 타입
  try {
    const { id } = req.params;

    const existingBookmark = await prisma.bookmark.findFirst({
      where: { id, userId: DEFAULT_USER_ID, deletedAt: null },
    });
    if (!existingBookmark) return res.status(404).json({ error: 'Bookmark not found' });

    await prisma.bookmark.update({ where: { id }, data: { deletedAt: new Date() } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

// POST /api/bookmarks/:id/tags - Add tag to bookmark
router.post('/:id/tags', async (req: Request, res: Response) => { // <-- 타입
  try {
    const { id: bookmarkId } = req.params;
    const { tagId } = req.body as { tagId?: string };

    if (!tagId) return res.status(400).json({ error: 'Tag ID is required' });

    const bookmark = await prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId: DEFAULT_USER_ID, deletedAt: null },
    });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

    const tag = await prisma.tag.findFirst({ where: { id: tagId, userId: DEFAULT_USER_ID } });
    if (!tag) return res.status(404).json({ error: 'Tag not found' });

    const existingAssociation = await prisma.bookmarkTag.findUnique({
      where: { bookmarkId_tagId: { bookmarkId, tagId } },
    });
    if (existingAssociation) {
      return res.status(400).json({ error: 'Tag already associated with bookmark' });
    }

    await prisma.bookmarkTag.create({ data: { bookmarkId, tagId } });
    res.status(201).json({ message: 'Tag added to bookmark' });
  } catch (error) {
    console.error('Error adding tag to bookmark:', error);
    res.status(500).json({ error: 'Failed to add tag to bookmark' });
  }
});

// DELETE /api/bookmarks/:id/tags/:tagId - Remove tag
router.delete('/:id/tags/:tagId', async (req: Request, res: Response) => { // <-- 타입
  try {
    const { id: bookmarkId, tagId } = req.params;
    await prisma.bookmarkTag.delete({
      where: { bookmarkId_tagId: { bookmarkId, tagId } },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error removing tag from bookmark:', error);
    res.status(500).json({ error: 'Failed to remove tag from bookmark' });
  }
});

export const bookmarksRouter = router;
