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
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl border border-border mb-8">
      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[100px] p-4 bg-input border border-transparent rounded-xl focus:bg-background focus:border-border outline-none transition-opacity duration-300 ease-out resize-none text-foreground placeholder:text-muted-foreground"
          required
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated, e.g. work, idea)"
            className="w-full p-3 bg-input border border-transparent rounded-xl focus:bg-background focus:border-border outline-none transition-opacity duration-300 ease-out text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex-1">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full p-2 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 transition-opacity duration-300 ease-out"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 outline-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-300 ease-out"
        >
          {isPending ? 'Posting...' : 'Post Note'}
        </button>
      </div>
    </form>
  );
};
