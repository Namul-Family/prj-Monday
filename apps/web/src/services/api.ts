import { Bookmark, Tag, CreateBookmark, UpdateBookmark, CreateTag, UpdateTag, BookmarkQuery, TagQuery } from '@monday-bookmark/types';

const API_BASE_URL = '/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Bookmarks
  async getBookmarks(query?: BookmarkQuery): Promise<{ bookmarks: Bookmark[]; total: number; limit: number; offset: number }> {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.isFavorite !== undefined) params.append('isFavorite', query.isFavorite.toString());
    if (query?.tagId) params.append('tagId', query.tagId);
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());

    const endpoint = `/bookmarks${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getBookmark(id: string): Promise<Bookmark> {
    return this.request(`/bookmarks/${id}`);
  }

  async createBookmark(data: CreateBookmark): Promise<Bookmark> {
    return this.request('/bookmarks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBookmark(id: string, data: UpdateBookmark): Promise<Bookmark> {
    return this.request(`/bookmarks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBookmark(id: string): Promise<void> {
    return this.request(`/bookmarks/${id}`, {
      method: 'DELETE',
    });
  }

  async addTagToBookmark(bookmarkId: string, tagId: string): Promise<void> {
    return this.request(`/bookmarks/${bookmarkId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tagId }),
    });
  }

  async removeTagFromBookmark(bookmarkId: string, tagId: string): Promise<void> {
    return this.request(`/bookmarks/${bookmarkId}/tags/${tagId}`, {
      method: 'DELETE',
    });
  }

  // Tags
  async getTags(query?: TagQuery): Promise<{ tags: Tag[]; total: number; limit: number; offset: number }> {
    const params = new URLSearchParams();
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.offset) params.append('offset', query.offset.toString());

    const endpoint = `/tags${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getTag(id: string): Promise<Tag & { bookmarks: Bookmark[] }> {
    return this.request(`/tags/${id}`);
  }

  async createTag(data: CreateTag): Promise<Tag> {
    return this.request('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTag(id: string, data: UpdateTag): Promise<Tag> {
    return this.request(`/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTag(id: string): Promise<void> {
    return this.request(`/tags/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
