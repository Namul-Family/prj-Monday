import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Trash2, Clock, Save } from 'lucide-react';
import { Bookmark, Tag } from '@monday-bookmark/types';
import { useMobileBookmarks, useMobileTags } from '../hooks/useMobileBookmarks';
import { clsx } from 'clsx';

export const Sort: React.FC = () => {
  const navigate = useNavigate();
  const [currentBookmarkIndex, setCurrentBookmarkIndex] = useState(0);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [showMemoInput, setShowMemoInput] = useState(false);

  const { bookmarks: inboxBookmarks, updateBookmark, deleteBookmark } = useMobileBookmarks({
    status: 'inbox',
  });
  const { tags } = useMobileTags();

  const currentBookmark = inboxBookmarks[currentBookmarkIndex];

  const handleTagSelect = (tagId: string) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleSave = () => {
    if (currentBookmark) {
      // 태그와 메모 저장
      updateBookmark(currentBookmark.id, {
        status: 'active',
        memo: memo.trim() || undefined,
      });
      
      // 다음 북마크로 이동
      nextBookmark();
    }
  };

  const handleSkip = () => {
    nextBookmark();
  };

  const handleDelete = () => {
    if (currentBookmark) {
      deleteBookmark(currentBookmark.id);
      nextBookmark();
    }
  };

  const nextBookmark = () => {
    setSelectedTagIds([]);
    setMemo('');
    setShowMemoInput(false);
    
    if (currentBookmarkIndex < inboxBookmarks.length - 1) {
      setCurrentBookmarkIndex(prev => prev + 1);
    } else {
      // 모든 북마크 정리 완료
      navigate('/');
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleMemoAdd = () => {
    setShowMemoInput(true);
  };

  // 북마크가 없을 때
  if (!currentBookmark) {
    return (
      <div className="h-screen-mobile flex flex-col bg-gray-50">
        <div className="safe-top bg-white"></div>
        
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">정리하기</h1>
          <button
            onClick={handleBackToHome}
            className="btn-touch"
          >
            <ArrowRight size={20} className="text-gray-600" />
          </button>
        </div>

        {/* 빈 상태 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">정리할 북마크가 없습니다</h2>
            <p className="text-gray-500">모든 북마크가 정리되었습니다!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen-mobile flex flex-col bg-gray-50">
      {/* Safe Area Top */}
      <div className="safe-top bg-white"></div>

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">정리하기</h1>
          <span className="bg-gray-800 text-white text-sm px-2 py-1 rounded-full">
            {inboxBookmarks.length}
          </span>
        </div>
        <button
          onClick={handleBackToHome}
          className="btn-touch"
        >
          <ArrowRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* 현재 북마크 카드 */}
      <div className="px-4 pt-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* 이미지 */}
          <div className="aspect-[16/9] bg-gray-100 relative">
            <img
              src={currentBookmark.metaImageUrl || `https://via.placeholder.com/400x225/6b7280/ffffff?text=${encodeURIComponent(currentBookmark.title.slice(0, 10))}`}
              alt={currentBookmark.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          
          {/* 콘텐츠 */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {currentBookmark.title}
            </h3>
            {currentBookmark.content && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {currentBookmark.content}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 태그 선택 영역 */}
      <div className="px-4 py-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">태그 선택</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagSelect(tag.id)}
              className={clsx(
                'tag-chip btn-touch',
                selectedTagIds.includes(tag.id)
                  ? 'tag-chip-selected'
                  : 'tag-chip-unselected'
              )}
              style={{ backgroundColor: selectedTagIds.includes(tag.id) ? tag.color : undefined }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* 메모 추가 버튼 */}
      {!showMemoInput && (
        <div className="px-4 pb-4">
          <button
            onClick={handleMemoAdd}
            className="w-full py-3 rounded-md bg-gray-100 flex justify-center items-center gap-2 btn-touch"
          >
            <FileText size={16} className="text-gray-600" />
            <span className="text-gray-700">노트 추가</span>
          </button>
        </div>
      )}

      {/* 메모 입력 영역 */}
      {showMemoInput && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요..."
              className="w-full h-24 resize-none border-none outline-none text-sm"
              maxLength={5000}
            />
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
              <span>{memo.length}/5000</span>
              <button
                onClick={() => setShowMemoInput(false)}
                className="text-gray-400"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 액션 버튼들 */}
      <div className="mt-auto px-4 py-4 safe-bottom">
        <div className="flex space-x-3">
          {/* 삭제 버튼 */}
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-3 rounded-md flex justify-center items-center gap-2 btn-touch"
          >
            <Trash2 size={16} />
            <span>삭제</span>
          </button>

          {/* 나중에 버튼 */}
          <button
            onClick={handleSkip}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-md flex justify-center items-center gap-2 btn-touch"
          >
            <Clock size={16} />
            <span>나중에</span>
          </button>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            className="flex-1 bg-black text-white py-3 rounded-md flex justify-center items-center gap-2 btn-touch"
          >
            <Save size={16} />
            <span>저장</span>
          </button>
        </div>
      </div>
    </div>
  );
};
