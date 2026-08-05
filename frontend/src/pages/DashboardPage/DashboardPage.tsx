import { useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLadder } from './useLadder';
import { useNotes } from '../../entities/note/api';
import { useTasks } from '../../entities/task/api';
import { useGetIdeas } from '../../entities/idea/api';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const activeSectionRef = useRef(-1);

  const { data: notes = [], isLoading: isNotesLoading } = useNotes();
  const { data: tasks = [], isLoading: isTasksLoading } = useTasks();
  const { data: ideas = [], isLoading: isIdeasLoading } = useGetIdeas();

  const { setProgress } = useLadder(canvasRef, stickyRef);

  const setBlockRef = useCallback((el: HTMLDivElement | null, idx: number) => {
    blockRefs.current[idx] = el;
  }, []);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    const progressEl = progressRef.current;
    if (!scrollEl || !progressEl) return;

    // 5 sections mapping to 0.1, 0.3, 0.5, 0.7, 0.9
    const secPoints = [0.1, 0.3, 0.5, 0.7, 0.9];

    function onScroll() {
      if (!scrollEl || !progressEl) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollEl;
      const p = scrollTop / (scrollHeight - clientHeight);

      // Progress bar
      progressEl.style.height = `${p * 100}%`;

      // Feed scroll progress to Three.js ladder
      setProgress(p);

      // Fade out intro (disappears within first 5% of scroll)
      if (introRef.current) {
        const introOpacity = Math.max(0, 1 - p * 20);
        introRef.current.style.opacity = String(introOpacity);
      }

      // Find active section
      let newActive = -1;
      secPoints.forEach((sp, i) => {
        const dist = Math.abs(p - sp);
        if (dist < 0.12) newActive = i;
      });

      if (newActive !== activeSectionRef.current) {
        // Hide old
        if (activeSectionRef.current >= 0) {
          const el = blockRefs.current[activeSectionRef.current];
          if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-50%) translateX(-30px)';
          }
        }
        // Show new
        if (newActive >= 0) {
          const el = blockRefs.current[newActive];
          if (el) {
            el.style.transition = 'none';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-50%) translateX(-30px)';
            requestAnimationFrame(() => {
              el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              el.style.opacity = '1';
              el.style.transform = 'translateY(-50%) translateX(0)';
            });
          }
        }
        activeSectionRef.current = newActive;
      }
    }

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [setProgress]);

  return (
    <div className="dash-scroll-root">
      <div className="dash-scroll-area" ref={scrollRef}>
        <div className="dash-scroll-inner">
          <div className="dash-sticky" ref={stickyRef}>
            {/* Three.js helix canvas */}
            <canvas ref={canvasRef} className="dash-canvas" />

            {/* Widget Blocks on the Left */}
            
            {/* Block 0: Stats & Overview */}
            <div
              ref={(el) => setBlockRef(el, 0)}
              className="dash-text-block"
              style={{ opacity: 0 }}
            >
              <div className="dash-text-eyebrow">01 / Workspace Stats</div>
              <h2 className="dash-text-title">Your Brain</h2>
              <p className="dash-text-body mb-4">Envie personal database is live and synchronized.</p>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {isNotesLoading ? '...' : notes.length}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Notes</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {isTasksLoading ? '...' : tasks.length}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Tasks</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {isIdeasLoading ? '...' : ideas.length}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Ideas</div>
                </div>
              </div>
            </div>

            {/* Block 1: Notes Quick Feed */}
            <div
              ref={(el) => setBlockRef(el, 1)}
              className="dash-text-block"
              style={{ opacity: 0 }}
            >
              <div className="dash-text-eyebrow">02 / Capture Feed</div>
              <h2 className="dash-text-title">Recent Notes</h2>
              <div className="flex flex-col gap-2 mb-4">
                {isNotesLoading ? (
                  <div className="text-xs text-muted-foreground">Loading recent notes...</div>
                ) : notes.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic">No captured notes yet.</div>
                ) : (
                  notes.slice(0, 2).map(n => (
                    <div key={n.id} className="p-3 bg-white/5 border border-white/5 rounded-lg text-left">
                      <p className="text-xs text-foreground line-clamp-2 leading-relaxed">
                        {n.content || 'Untitled Note'}
                      </p>
                      <span className="text-[9px] text-muted-foreground mt-1.5 block">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <Link to="/notes" className="dash-action-btn">
                Open Notes Feed →
              </Link>
            </div>

            {/* Block 2: Kanban Tasks */}
            <div
              ref={(el) => setBlockRef(el, 2)}
              className="dash-text-block"
              style={{ opacity: 0 }}
            >
              <div className="dash-text-eyebrow">03 / Action Board</div>
              <h2 className="dash-text-title">Active Tasks</h2>
              <div className="flex flex-col gap-2 mb-4">
                {isTasksLoading ? (
                  <div className="text-xs text-muted-foreground">Loading active tasks...</div>
                ) : tasks.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic">All caught up! No tasks left.</div>
                ) : (
                  tasks.slice(0, 3).map(t => (
                    <div key={t.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                      <span className="text-xs text-foreground truncate max-w-[200px]">
                        {t.title}
                      </span>
                      {t.subtasks && t.subtasks.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {t.subtasks.filter(s => s.done).length}/{t.subtasks.length} subtasks
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
              <Link to="/board" className="dash-action-btn">
                Open Kanban Board →
              </Link>
            </div>

            {/* Block 3: Ideas Canvas */}
            <div
              ref={(el) => setBlockRef(el, 3)}
              className="dash-text-block"
              style={{ opacity: 0 }}
            >
              <div className="dash-text-eyebrow">04 / Product Canvas</div>
              <h2 className="dash-text-title">Recent Ideas</h2>
              <div className="flex flex-col gap-2 mb-4">
                {isIdeasLoading ? (
                  <div className="text-xs text-muted-foreground">Loading ideas...</div>
                ) : ideas.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic">No ideas structured yet.</div>
                ) : (
                  ideas.slice(0, 2).map(id => (
                    <div key={id.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground truncate">{id.title}</span>
                        <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground uppercase font-bold tracking-wider">
                          {id.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">{id.summary}</p>
                    </div>
                  ))
                )}
              </div>
              <Link to="/ideas" className="dash-action-btn">
                Open Ideas Space →
              </Link>
            </div>

            {/* Block 4: System Configurations */}
            <div
              ref={(el) => setBlockRef(el, 4)}
              className="dash-text-block"
              style={{ opacity: 0 }}
            >
              <div className="dash-text-eyebrow">05 / System Core</div>
              <h2 className="dash-text-title">Control Panel</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Configure your system templates or update workspace appearance.
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/templates" className="p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between text-xs text-foreground font-medium pointer-events-auto">
                  <span>Markdown Templates</span>
                  <span className="text-muted-foreground">→</span>
                </Link>
                <Link to="/wallpaper" className="p-3 bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between text-xs text-foreground font-medium pointer-events-auto">
                  <span>Workspace Wallpapers</span>
                  <span className="text-muted-foreground">→</span>
                </Link>
              </div>
            </div>

            {/* Intro block -- visible at scroll=0 */}
            <div className="dash-intro" ref={introRef}>
              <div className="dash-intro-eyebrow">Welcome to</div>
              <div className="dash-intro-title">Envie</div>
              <div className="dash-intro-sub">Your personal headquarters.<br />Scroll down to explore.</div>
              <div className="dash-intro-chevron">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Progress bar */}
            <div className="dash-progress-bar">
              <div className="dash-progress-fill" ref={progressRef} />
            </div>

            {/* Scroll hint */}
            <div className="dash-scroll-hint">scroll</div>

            {/* Final CTA at bottom-center */}
            <div className="dash-bottom-nav">
              <Link to="/notes" className="dash-nav-link">Notes</Link>
              <Link to="/board" className="dash-nav-link">Board</Link>
              <Link to="/ideas" className="dash-nav-link">Ideas</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

