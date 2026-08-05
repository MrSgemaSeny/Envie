import React, { useState, useRef } from 'react';
import { useCreateNote } from '../../entities/note/api';

export const CreateNoteForm: React.FC = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: createNote, isPending } = useCreateNote();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      }
    );
  };

  const hasContent = content.trim().length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg border border-border/40 bg-card/30 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
          rows={3}
          className="w-full px-3 pt-3 pb-1 bg-transparent outline-none resize-none text-[13px] text-foreground placeholder:text-muted-foreground/40 leading-relaxed"
          required
        />

        {/* File chips */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1 px-3 pb-1.5">
            {files.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1 pl-1.5 pr-0.5 py-0.5 bg-muted/40 rounded text-[10px] text-muted-foreground">
                {f.name.length > 18 ? f.name.substring(0, 18) + '...' : f.name}
                <button type="button" onClick={() => removeFile(i)} className="p-0.5 rounded hover:bg-muted/60 transition-opacity duration-150">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tags inline */}
        <div className="px-3 pb-2">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags, comma separated"
            className="w-full bg-transparent outline-none text-[11px] text-muted-foreground placeholder:text-muted-foreground/30"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/20 bg-muted/5">
          <label className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-muted-foreground cursor-pointer transition-colors duration-150">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            Attach
            <input type="file" multiple onChange={handleFileChange} ref={fileInputRef} className="hidden" />
          </label>

          <button
            type="submit"
            disabled={isPending || !hasContent}
            className="px-3 py-1 bg-foreground text-background text-[11px] font-medium rounded hover:opacity-90 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-opacity duration-150 ease-out"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};
