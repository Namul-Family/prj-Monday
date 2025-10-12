import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Bookmark, CreateBookmark, UpdateBookmark, BookmarkQuery } from '@monday-bookmark/types';

export const useBookmarks = (query?: BookmarkQuery) => {
  return useQuery({
    queryKey: ['bookmarks', query],
    queryFn: () => apiService.getBookmarks(query),
  });
};

export const useBookmark = (id: string) => {
  return useQuery({
    queryKey: ['bookmark', id],
    queryFn: () => apiService.getBookmark(id),
    enabled: !!id,
  });
};

export const useCreateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookmark) => apiService.createBookmark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};

export const useUpdateBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookmark }) =>
      apiService.updateBookmark(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark', id] });
    },
  });
};

export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
};

export const useAddTagToBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookmarkId, tagId }: { bookmarkId: string; tagId: string }) =>
      apiService.addTagToBookmark(bookmarkId, tagId),
    onSuccess: (_, { bookmarkId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark', bookmarkId] });
    },
  });
};

export const useRemoveTagFromBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookmarkId, tagId }: { bookmarkId: string; tagId: string }) =>
      apiService.removeTagFromBookmark(bookmarkId, tagId),
    onSuccess: (_, { bookmarkId }) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['bookmark', bookmarkId] });
    },
  });
};
