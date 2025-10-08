import React, { useState } from 'react';
import { Plus, X, Link, Type, Image } from 'lucide-react';

interface Bookmark {
  id: number;
  type: 'text' | 'link' | 'image';
  title: string;
  description: string;
  tags: string[];
  image?: string;
}

interface Tag {
  id: string;
  name: string;
}

const BookmarkService: React.FC = () => {
  const [tags] = useState<Tag[]>([
    { id: 'all', name: 'All' },
    { id: 'tag1', name: '맛집' },
    { id: 'tag2', name: '브랜딩' },
    { id: 'tag3', name: 'HR' },
    { id: 'tag4', name: '맛집' },
    { id: 'tag5', name: '운동' }
  ]);

  const [bookmarks] = useState<Bookmark[]>([
    {
      id: 1,
      type: 'link',
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description: 'Lorem ipsum dolor sit amet.Lorem ipsum dolor sit...',
      tags: ['브랜딩', 'UX'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      type: 'link',
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description: 'Lorem ipsum dolor sit amet.Lorem ipsum dolor sit...',
      tags: ['브랜딩', 'UX'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      type: 'link',
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description: 'Lorem ipsum dolor sit amet.Lorem ipsum dolor sit...',
      tags: ['브랜딩', 'UX'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      type: 'link',
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description: 'Lorem ipsum dolor sit amet.Lorem ipsum dolor sit...',
      tags: ['브랜딩', 'UX'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      type: 'link',
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description: 'Lorem ipsum dolor sit amet.Lorem ipsum dolor sit...',
      tags: ['브랜딩', 'UX'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      type: 'link',
      title: 'Lorem ipsum dolor sit amet consectetur.',
      description: 'Lorem ipsum dolor sit amet.Lorem ipsum dolor sit...',
      tags: ['브랜딩', 'UX'],
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
    }
  ]);

  const [selectedTags, setSelectedTags] = useState<string[]>(['all']);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [addType, setAddType] = useState<'text' | 'link' | 'image'>('text');
  const [showTagSheet, setShowTagSheet] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [untaggedCount, setUntaggedCount] = useState(3);
  const [showUntaggedList, setShowUntaggedList] = useState(false);

  const handleTagClick = (tagId: string) => {
    if (tagId === 'all') {
      if (selectedTags.includes('all') && selectedTags.length === 1) {
        setShowTagSheet(true);
      } else {
        setSelectedTags(['all']);
      }
    } else {
      const newSelectedTags = selectedTags.filter(t => t !== 'all');
      if (newSelectedTags.includes(tagId)) {
        const filtered = newSelectedTags.filter(t => t !== tagId);
        setSelectedTags(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedTags([...newSelectedTags, tagId]);
      }
    }
  };

  const filteredBookmarks = selectedTags.includes('all')
    ? bookmarks
    : bookmarks.filter(bookmark =>
        bookmark.tags.some(tag =>
          selectedTags.some(selectedTag =>
            tags.find(t => t.id === selectedTag)?.name === tag
          )
        )
      );

  const getPlaceholder = () => {
    if (addType === 'text') return '오늘의 메모 추가';
    if (addType === 'link') return 'Link를 입력하세요';
    return '';
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log('Added:', addType, inputValue);
      setInputValue('');
      setShowAddSheet(false);
      alert(`${addType} 추가됨: ${inputValue}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen relative">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 pt-3 pb-4">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex flex-col gap-0.5">
            <div className="w-0.5 h-1 bg-black"></div>
            <div className="w-0.5 h-1.5 bg-black"></div>
            <div className="w-0.5 h-2 bg-black"></div>
            <div className="w-0.5 h-2.5 bg-black"></div>
          </div>
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M4 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="black" strokeWidth="1.5"/>
          </svg>
          <div className="w-6 h-3 border-2 border-black rounded relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-black" style={{right: '-2px'}}></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-6 pb-4">
        <h1 className="text-2xl font-bold">Home</h1>
      </div>

      {/* Tags */}
      <div className="px-6 pb-4 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleTagClick(tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="px-6 pb-32 grid grid-cols-2 gap-4">
        {filteredBookmarks.map(bookmark => (
          <div key={bookmark.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-200 to-green-100">
              <img
                src={bookmark.image}
                alt={bookmark.title}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded">
                <svg className="w-4 h-4 text-purple-500" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2h12M2 14L14 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold mb-1 line-clamp-2">
                {bookmark.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {bookmark.description}
              </p>
              <div className="flex gap-1.5">
                {bookmark.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left - Untagged Button */}
          <button 
            onClick={() => setShowUntaggedList(true)}
            className="relative p-3 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {untaggedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {untaggedCount}
              </span>
            )}
          </button>

          {/* Center - Add Button */}
          <button
            onClick={() => setShowAddSheet(true)}
            className="relative"
          >
            <div className="w-14 h-14 bg-white border-2 border-gray-800 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
          </button>

          {/* Right - Profile Button */}
          <button className="p-3 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add Sheet Overlay */}
      {showAddSheet && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAddSheet(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input Area */}
            <div className="mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={getPlaceholder()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>

            {/* Type Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setAddType('text')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  addType === 'text'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Type className="w-5 h-5" />
                <span>Text</span>
              </button>
              <button
                onClick={() => setAddType('link')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  addType === 'link'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Link className="w-5 h-5" />
                <span>Link</span>
              </button>
              <button
                onClick={() => {
                  setAddType('image');
                  alert('이미지 선택 기능은 실제 환경에서 구현됩니다.');
                }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  addType === 'image'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Image className="w-5 h-5" />
                <span>Image</span>
              </button>
            </div>

            {/* Keyboard Preview */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">"The"</span>
                <span className="text-sm text-gray-600">the</span>
                <span className="text-sm text-gray-600">to</span>
              </div>
              <div className="text-center text-gray-400 text-sm">
                [ iOS 키보드 UI ]
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Management Sheet */}
      {showTagSheet && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowTagSheet(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">태그 관리</h2>
            <div className="space-y-2">
              {tags.filter(t => t.id !== 'all').map(tag => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{tag.name}</span>
                  <button className="text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-purple-500 text-white rounded-lg font-medium">
              새 태그 추가
            </button>
          </div>
        </div>
      )}

      {/* Untagged List Sheet */}
      {showUntaggedList && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowUntaggedList(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-w-md mx-auto max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">분류되지 않은 메모</h2>
              <button onClick={() => setShowUntaggedList(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-1">미분류 메모 1</h3>
                <p className="text-sm text-gray-600">태그가 지정되지 않은 메모입니다.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-1">미분류 링크</h3>
                <p className="text-sm text-gray-600">https://example.com</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-1">미분류 메모 2</h3>
                <p className="text-sm text-gray-600">카테고리를 지정해주세요.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookmarkService;