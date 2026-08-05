import React, { useState, useRef } from 'react';
import { useCreateNote } from '../../entities/note/api';

export const CreateNoteForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: createNote, isPending } = useCreateNote();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createNote(
      { content, tags, files },
      {
        onSuccess: () => {
          setContent('');
          setTags('');
          setFiles([]);
          setIsFocused(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`bg-card/50 backdrop-blur-sm border rounded-xl transition-all duration-200 ${
          isFocused ? 'border-foreground/20 shadow-lg shadow-black/10' : 'border-border hover:border-border/80'
        }`}
      >
        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="What's on your mind?"
          className="w-full min-h-[80px] px-4 pt-4 pb-2 bg-transparent outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 leading-relaxed"
          required
        />

        {/* File preview chips */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {files.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 pl-2 pr-1 py-0.5 bg-muted/50 border border-border/50 rounded-md text-[11px] text-muted-foreground"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {f.name.length > 20 ? f.name.substring(0, 20) + '...' : f.name}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/30">
          <div className="flex items-center gap-2">
            {/* Attach button */}
            <label className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attach
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </label>

            {/* Tags input inline */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground/50 w-40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="px-3.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-md hover:opacity-90 outline-none active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 ease-out"
          >
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </form>
  );
};
