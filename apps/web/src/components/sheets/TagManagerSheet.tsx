import React, { useState, useRef } from 'react';
import { Plus, X, Tag } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { scrollToInput } from '../../utils/mobile';
import { clsx } from 'clsx';

interface TagManagerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  onCreateTag: (name: string) => void;
  onDeleteTag: (id: string) => void;
}

export const TagManagerSheet: React.FC<TagManagerSheetProps> = ({
  isOpen,
  onClose,
  tags,
  onCreateTag,
  onDeleteTag,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    
    onCreateTag(newTagName.trim());
    setNewTagName('');
    setIsCreating(false);
  };

  const handleStartCreating = () => {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleCancelCreating = () => {
    setIsCreating(false);
    setNewTagName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateTag();
    } else if (e.key === 'Escape') {
      handleCancelCreating();
    }
  };

  const handleInputFocus = () => {
    if (inputRef.current) {
      scrollToInput(inputRef.current);
    }
  };

  const getRandomColor = () => {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="태그 관리"
    >
      {/* 태그 목록 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">기존 태그</h3>
          <span className="text-sm text-gray-500">{tags.length}개</span>
        </div>

        {tags.length === 0 ? (
          <div className="text-center py-8">
            <Tag size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">아직 태그가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color || getRandomColor() }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {tag.name}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteTag(tag.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors btn-touch"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 새 태그 생성 */}
      <div>
        {!isCreating ? (
          <button
            onClick={handleStartCreating}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center space-x-2 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors btn-touch"
          >
            <Plus size={16} />
            <span>새 태그 추가</span>
          </button>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                태그 이름
              </label>
              <input
                ref={inputRef}
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyPress}
                placeholder="태그 이름을 입력하세요"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                autoComplete="off"
                maxLength={20}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelCreating}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors btn-touch"
              >
                취소
              </button>
              <button
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
                className={clsx(
                  'flex-1 py-3 px-4 rounded-lg font-medium transition-colors btn-touch',
                  newTagName.trim()
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                )}
              >
                추가
              </button>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
