import React, { useState, useRef, useEffect } from 'react';
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
    description?: string;
  }>;
  onCreateTag: (data: { name: string; description?: string; color: string }) => void;
  onUpdateTag: (id: string, data: { name: string; description?: string; color: string }) => void;
  onDeleteTag: (id: string) => void;
}

const TAG_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#ec4899',
  '#6366f1',
];

interface TagFormState {
  id?: string;
  name: string;
  description: string;
  color: string;
}

export const TagManagerSheet: React.FC<TagManagerSheetProps> = ({
  isOpen,
  onClose,
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}) => {
  const [editorState, setEditorState] = useState<TagFormState | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditorOpen) return;

  const timer = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 120);

    return () => {
      clearTimeout(timer);
    };
  }, [isEditorOpen]);

  const handleInputFocus = (element: HTMLElement | null) => {
    if (!element) return;
    scrollToInput(element);
  };

  const openEditor = (tag?: TagFormState) => {
    if (tag) {
      setEditorState({
        id: tag.id,
        name: tag.name,
        description: tag.description ?? '',
        color: tag.color || TAG_COLORS[0],
      });
    } else {
      setEditorState({
        name: '',
        description: '',
        color: TAG_COLORS[0],
      });
    }
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditorState(null);
  };

  const handleSave = () => {
    if (!editorState) return;

    const name = editorState.name.trim();
    if (!name) return;

    const payload = {
      name,
      description: editorState.description.trim() || undefined,
      color: editorState.color,
    };

    if (editorState.id) {
      onUpdateTag(editorState.id, payload);
    } else {
      onCreateTag(payload);
    }
    closeEditor();
  };

    const handleDelete = () => {
    if (!editorState?.id) return;
    onDeleteTag(editorState.id);
    closeEditor();
  };

  const isExistingTag = Boolean(editorState?.id);
  const canSave = Boolean(editorState?.name.trim());

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
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() =>
                  openEditor({
                    id: tag.id,
                    name: tag.name,
                    description: tag.description ?? '',
                    color: tag.color || TAG_COLORS[0],
                  })
                }
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white shadow"
                    style={{ backgroundColor: tag.color || TAG_COLORS[0] }}
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      {tag.name}
                    </span>
                    {tag.description && (
                      <span className="text-xs text-gray-500 line-clamp-2">
                        {tag.description}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteTag(tag.id);
                  }}
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
      <button
          onClick={() => openEditor()}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center space-x-2 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors btn-touch"
        >
          <Plus size={16} />
          <span>새 태그 추가</span>
        </button>
      </div>

      <BottomSheet
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={isExistingTag ? '태그 수정' : '새 태그 추가'}
      >
        {editorState && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                태그 이름
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={editorState.name}
                onChange={(e) =>
                  setEditorState((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev,
                  )
                }
                onFocus={() => handleInputFocus(nameInputRef.current)}
                placeholder="태그 이름을 입력하세요"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
                autoComplete="off"
                maxLength={20}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                설명
              </label>
              <textarea
                value={editorState.description}
                onChange={(e) =>
                  setEditorState((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev,
                  )
                }
                onFocus={(e) => handleInputFocus(e.currentTarget)}
                placeholder="태그에 대한 설명을 입력하세요"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base resize-none"
                rows={3}
                maxLength={100}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                색상
              </label>
              <div className="grid grid-cols-5 gap-3">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setEditorState((prev) =>
                        prev ? { ...prev, color } : prev,
                      )
                    }
                    className={clsx(
                      'w-10 h-10 rounded-full border-2 transition-transform btn-touch',
                      editorState.color === color
                        ? 'border-gray-900 scale-105'
                        : 'border-transparent hover:scale-105'
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`색상 ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={clsx(
                  'w-full py-3 px-4 rounded-lg font-medium transition-colors btn-touch',
                  canSave
                    ? 'bg-black text-white hover:bg-gray-900'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                )}
              >
                {isExistingTag ? '수정 완료' : '태그 추가'}
              </button>

              {isExistingTag && (
                <button
                  onClick={handleDelete}
                  className="w-full py-3 px-4 border border-red-200 text-red-500 rounded-lg font-medium transition-colors hover:bg-red-50 btn-touch"
                >
                  태그 삭제
                </button>
              )}
            </div>
          </div>
        )}
      </BottomSheet>
    </BottomSheet>
  );
};
