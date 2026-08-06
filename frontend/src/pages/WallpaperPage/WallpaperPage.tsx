import React from 'react';
import { 
  useWallpapers, 
  useUploadWallpaper, 
  useActivateWallpaper, 
  useDeleteWallpaper,
  useDeactivateWallpaper
} from '../../entities/wallpaper/api';
import { apiClient } from '../../shared/api/client';
import { toast } from 'sonner';

export function WallpaperPage() {
  const { data: wallpapers = [], isLoading } = useWallpapers();
  const upload = useUploadWallpaper();
  const activate = useActivateWallpaper();
  const deactivate = useDeactivateWallpaper();
  const deleteWallpaper = useDeleteWallpaper();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      toast.promise(upload.mutateAsync(file), {
        loading: 'Uploading wallpaper...',
        success: 'Wallpaper uploaded!',
        error: 'Failed to upload wallpaper'
      });
    }
    // reset input value so the same file can be uploaded again if needed
    e.target.value = '';
  };

  if (isLoading) {
    return <div className="text-muted-foreground p-6">Loading wallpapers...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Wallpapers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your background images</p>
        </div>
        <div className="flex items-center gap-3">
          {wallpapers.some(w => w.isActive) && (
            <button 
              onClick={() => deactivate.mutate(undefined)}
              disabled={deactivate.isPending}
              className="bg-muted text-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-muted/80 transition-all duration-200 ease-out active:scale-[0.98] shadow-sm"
            >
              Deactivate All
            </button>
          )}
          <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-all duration-200 ease-out active:scale-[0.98] shadow-sm">
            Upload Wallpaper
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleUpload} 
              disabled={upload.isPending}
            />
          </label>
        </div>
      </div>

      {wallpapers.length === 0 ? (
        <div className="text-muted-foreground text-center py-16 bg-card rounded-xl border border-border flex flex-col items-center justify-center">
          <p className="mb-2">No wallpapers found.</p>
          <p className="text-sm">Upload an image or video to personalize your workspace.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wallpapers.map(wp => {
            const isVideo = /\.(mp4|webm|mov)$/i.test(wp.filename);
            return (
              <div 
                key={wp.id} 
                className={`relative group rounded-xl overflow-hidden border-[3px] transition-all duration-300 ease-out bg-card ${wp.isActive ? 'border-primary shadow-glow' : 'border-transparent hover:border-border'}`}
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                  {isVideo ? (
                    <video 
                      src={`${apiClient.defaults.baseURL}/media/${wp.filename}`} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img 
                      src={`${apiClient.defaults.baseURL}/media/${wp.filename}`} 
                      alt={wp.originalName} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center gap-3 backdrop-blur-[2px]">
                {!wp.isActive && (
                  <button 
                    onClick={() => activate.mutate(wp.id)}
                    disabled={activate.isPending}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 active:scale-95 transition-transform duration-200 ease-out"
                  >
                    Activate
                  </button>
                )}
                {wp.isActive && (
                  <button 
                    onClick={() => deactivate.mutate(wp.id)}
                    disabled={deactivate.isPending}
                    className="bg-muted text-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-muted/80 active:scale-95 transition-transform duration-200 ease-out"
                  >
                    Deactivate
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this wallpaper?')) {
                      deleteWallpaper.mutate(wp.id);
                    }
                  }}
                  disabled={deleteWallpaper.isPending}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 active:scale-95 transition-transform duration-200 ease-out"
                >
                  Delete
                </button>
              </div>
              {wp.isActive && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-md shadow-md font-semibold tracking-wide uppercase">
                  Active
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs truncate" title={wp.originalName}>
                  {wp.originalName}
                </p>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
