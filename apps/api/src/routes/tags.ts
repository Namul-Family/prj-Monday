import { Router, type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { CreateTagSchema, UpdateTagSchema, TagQuerySchema } from '@monday-bookmark/types';

const router: Router = Router();  // <-- 명시적 타입
const prisma = new PrismaClient();

const DEFAULT_USER_ID = 'demo-user-123';

// GET /api/tags - List tags
router.get('/', async (req: Request, res: Response) => {   // <-- 타입
  try {
    const query = TagQuerySchema.parse({
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    });

    const tags = await prisma.tag.findMany({
      where: { userId: DEFAULT_USER_ID },
      include: { _count: { select: { bookmarks: true } } },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      skip: query.offset,
    });

    const total = await prisma.tag.count({ where: { userId: DEFAULT_USER_ID } });

    res.json({ tags, total, limit: query.limit, offset: query.offset });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// GET /api/tags/:id - Get single tag
router.get('/:id', async (req: Request, res: Response) => {   // <-- 타입
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findFirst({
      where: { id, userId: DEFAULT_USER_ID },
      include: {
        bookmarks: {
          include: {
            bookmark: {
              include: {
                tags: { include: { tag: true } },
              },
            },
          },
        },
        _count: { select: { bookmarks: true } },
      },
    });

    if (!tag) return res.status(404).json({ error: 'Tag not found' });

    res.json({
      ...tag,
      bookmarks: tag.bookmarks.map(bt => ({
        ...bt.bookmark,
        tags: bt.bookmark.tags.map(btt => btt.tag),
      })),
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

// POST /api/tags - Create tag
router.post('/', async (req: Request, res: Response) => {     // <-- 타입
  try {
    const data = CreateTagSchema.parse(req.body);

    const existingTag = await prisma.tag.findFirst({
      where: { name: data.name, userId: DEFAULT_USER_ID },
    });
    if (existingTag) return res.status(409).json({ error: 'Tag with this name already exists' });

    const tag = await prisma.tag.create({ data: { ...data, userId: DEFAULT_USER_ID } });
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// PATCH /api/tags/:id - Update tag
router.patch('/:id', async (req: Request, res: Response) => { // <-- 타입
  try {
    const { id } = req.params;
    const data = UpdateTagSchema.parse(req.body);

    const existingTag = await prisma.tag.findFirst({ where: { id, userId: DEFAULT_USER_ID } });
    if (!existingTag) return res.status(404).json({ error: 'Tag not found' });

    if (data.name && data.name !== existingTag.name) {
      const nameConflict = await prisma.tag.findFirst({
        where: { name: data.name, userId: DEFAULT_USER_ID, id: { not: id } },
      });
      if (nameConflict) return res.status(409).json({ error: 'Tag with this name already exists' });
    }

    const tag = await prisma.tag.update({ where: { id }, data });
    res.json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', async (req: Request, res: Response) => { // <-- 타입
  try {
    const { id } = req.params;

    const existingTag = await prisma.tag.findFirst({ where: { id, userId: DEFAULT_USER_ID } });
    if (!existingTag) return res.status(404).json({ error: 'Tag not found' });

    await prisma.bookmarkTag.deleteMany({ where: { tagId: id } });
    await prisma.tag.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

