import React, { useState, useRef } from 'react';
import { FileText, Link, Image, Plus } from 'lucide-react';
import { BottomSheet } from './BottomSheet';
import { BookmarkType } from '@monday-bookmark/types';
import { scrollToInput } from '../../utils/mobile';
import { clsx } from 'clsx';

interface AddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: BookmarkType;
    title: string;
    content?: string;
    url?: string;
  }) => void;
}

export const AddSheet: React.FC<AddSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedType, setSelectedType] = useState<BookmarkType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (type: BookmarkType) => {
    setSelectedType(type);
    // 타입 변경 시 입력 필드 초기화
    setContent('');
    setUrl('');
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      titleInputRef.current?.focus();
      return;
    }

    const data = {
      type: selectedType,
      title: title.trim(),
      content: content.trim() || undefined,
      url: url.trim() || undefined,
    };

    onSubmit(data);
    
    // 폼 초기화
    setTitle('');
    setContent('');
    setUrl('');
    setSelectedType('text');
    
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'enter' | 'submit') => {
    if (e.key === 'Enter') {
      if (type === 'enter') {
        e.preventDefault();
        // 다음 필드로 포커스 또는 제출
        if (selectedType === 'text') {
          contentInputRef.current?.focus();
        } else if (selectedType === 'link') {
          handleSubmit();
        }
      } else {
        handleSubmit();
      }
    }
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case 'text':
        return '오늘의 메모를 입력하세요...';
      case 'link':
        return 'URL을 붙여넣기하세요...';
      case 'image':
        return '이미지 URL을 입력하세요...';
      default:
        return '';
    }
  };

  const getIcon = (type: BookmarkType) => {
    switch (type) {
      case 'text':
        return <FileText size={20} />;
      case 'link':
        return <Link size={20} />;
      case 'image':
        return <Image size={20} />;
    }
  };

  const handleInputFocus = (inputRef: React.RefObject<HTMLElement>) => {
    if (inputRef.current) {
      scrollToInput(inputRef.current);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="새 북마크 추가"
      className="max-h-[90dvh]"
    >
      {/* 타입 선택 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">타입 선택</h3>
        <div className="flex space-x-3">
          {(['text', 'link', 'image'] as BookmarkType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={clsx(
                'flex-1 flex flex-col items-center py-3 px-4 rounded-lg border-2 transition-colors btn-touch',
                selectedType === type
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-700'
              )}
            >
              {getIcon(type)}
              <span className="text-sm font-medium mt-1">
                {type === 'text' && '텍스트'}
                {type === 'link' && '링크'}
                {type === 'image' && '이미지'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 입력 필드들 */}
      <div className="space-y-4">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            제목 *
          </label>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => handleInputFocus(titleInputRef)}
            onKeyPress={(e) => handleKeyPress(e, 'enter')}
            placeholder="제목을 입력하세요"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
            autoComplete="off"
          />
        </div>

        {/* 내용/URL 입력 */}
        {selectedType === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              내용
            </label>
            <textarea
              ref={contentInputRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => handleInputFocus(contentInputRef)}
              placeholder={getPlaceholder()}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base resize-none"
              rows={4}
            />
          </div>
        )}

        {selectedType === 'link' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              URL *
            </label>
            <input
              ref={urlInputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => handleInputFocus(urlInputRef)}
              onKeyPress={(e) => handleKeyPress(e, 'enter')}
              placeholder={getPlaceholder()}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
              autoComplete="off"
            />
          </div>
        )}

        {selectedType === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              이미지 URL
            </label>
            <input
              ref={urlInputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => handleInputFocus(urlInputRef)}
              placeholder={getPlaceholder()}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
              autoComplete="off"
            />
          </div>
        )}
      </div>

      {/* 제출 버튼 */}
      <div className="mt-8">
        <button
          onClick={handleSubmit}
          onKeyPress={(e) => handleKeyPress(e, 'submit')}
          disabled={!title.trim()}
          className={clsx(
            'w-full py-4 rounded-lg font-medium text-base transition-colors btn-touch',
            title.trim()
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          )}
        >
          <Plus size={20} className="inline mr-2" />
          북마크 추가
        </button>
      </div>
    </BottomSheet>
  );
};
