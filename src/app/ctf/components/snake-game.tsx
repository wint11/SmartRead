
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface Position {
  x: number
  y: number
}

// Global state to track modifications across game sessions but within page lifecycle
const modifiedElements = new Set<HTMLElement>();
const dynamicFlags = new Set<HTMLElement>();

// Global cleanup function to be called on route change
export const restoreGlobalState = () => {
    modifiedElements.forEach(el => {
        el.style.opacity = '';
        el.style.color = '';
        el.style.visibility = '';
        el.style.backgroundColor = '';
        el.style.textShadow = '';
        el.style.transition = '';
    });
    modifiedElements.clear();
    
    dynamicFlags.forEach(el => el.remove());
    dynamicFlags.clear();
    document.querySelectorAll('.snake-dynamic-flag').forEach(el => el.remove());
};

interface SnakeGameProps {
  active: boolean
  onExit: () => void
}

interface EdibleElement {
  id: string
  rect: DOMRect
  element: HTMLElement
  isVisible: boolean
}

const CELL_SIZE = 20 // px
const INITIAL_SPEED = 100 

export function SnakeGame({ active, onExit }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 2, y: 2 }])
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 })
  const [gameOver, setGameOver] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [edibleElements, setEdibleElements] = useState<EdibleElement[]>([])
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 })
  const [isExiting, setIsExiting] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Clean up on route change
  const pathname = usePathname();
  useEffect(() => {
      // If we navigate away from CTF page, restore everything
      return () => {
          // We can't easily detect "navigating away" vs "unmount" inside component
          // But CtfChallenge unmounts on route change.
          // However, here we just want to ensure if the component is unmounted due to active=false,
          // we ONLY restore if game was NOT completed (i.e. user aborted).
          // But wait, user wants to keep destruction even if active=false.
          // So we should NOT restore in cleanup if gameCompleted.
      };
  }, [pathname]);

  // Initialize game and scan elements
  useEffect(() => {
    if (active) {
      // Note: We DO NOT restore global state here. 
      // Destruction persists across restarts until page change.
      // restoreGlobalState(); 

      const cols = Math.ceil(window.innerWidth / CELL_SIZE)
      const rows = Math.ceil(window.innerHeight / CELL_SIZE)
      setGridSize({ cols, rows })
      
      setGameStarted(true)
      setSnake([{ x: 2, y: rows - 5 }]) 
      setDirection({ x: 1, y: 0 })
      setGameOver(false)
      setGameCompleted(false)
      setScore(0)
      setIsExiting(false)
      
      // Scan edible elements
      // We explicitly include header/nav elements and exclude terminal related ones
      const edibles: EdibleElement[] = []
      
      const processTextNode = (textNode: Node, parent: HTMLElement) => {
          const text = textNode.textContent || '';
          if (!text.trim()) return;
          
          const fragment = document.createDocumentFragment();
          const chars = text.split('');
          
          chars.forEach((char, i) => {
              const span = document.createElement('span');
              span.textContent = char;
              span.style.display = 'inline-block'; // Allow transform/opacity
              span.style.whiteSpace = 'pre'; // Preserve spaces
              span.className = 'snake-edible-char';
              fragment.appendChild(span);
          });
          
          // Replace text node with our spans
          parent.replaceChild(fragment, textNode);
      };

      const scanTargetIcons = (ediblesList: EdibleElement[]) => {
          const targets = [
              { id: 'ctf-book-icon', selector: '#ctf-book-icon' },
              { id: 'ctf-search-icon', selector: '#ctf-search-icon' }
          ];

          targets.forEach(target => {
              const el = document.querySelector(target.selector) as HTMLElement;
              if (el) {
                   const rect = el.getBoundingClientRect();
                   if (rect.width > 0 && rect.height > 0) {
                       ediblesList.push({
                           id: target.id, // Use specific ID for logic
                           rect,
                           element: el,
                           isVisible: true
                       });
                   }
              }
          });
      };

      const scanInputs = (ediblesList: EdibleElement[]) => {
          const inputs = document.querySelectorAll('input, textarea, button, [role="button"], [role="searchbox"], .search-input, [type="search"]');
          inputs.forEach((el, index) => {
              if (el.closest('.snake-game-container')) return;
              if (el.closest('#ctf-terminal-main')) return;
              
              const rect = el.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) return;
              const style = window.getComputedStyle(el);
              if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;
              
              ediblesList.push({
                  id: `edible-input-${index}`,
                  rect,
                  element: el as HTMLElement,
                  isVisible: true
              });
          });
      };

      const scanAndSplit = (root: HTMLElement) => {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
          const nodes: Node[] = [];
          
          while(walker.nextNode()) {
              nodes.push(walker.currentNode);
          }
          
          nodes.forEach(node => {
              const parent = node.parentElement;
              if (!parent) return;
              
              // Exclusions
              if (parent.closest('.snake-game-container')) return;
              if (parent.closest('#ctf-terminal-main')) return;
              if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return;
              if (parent.classList.contains('snake-edible-char')) return; // Don't split already split chars
              
              const style = window.getComputedStyle(parent);
              if (style.visibility === 'hidden') return;
              if (style.display === 'none') return;
              if (style.opacity === '0') return; // Don't split hidden elements
              
              processTextNode(node, parent);
          });
      };
      
      // Perform splitting on body (careful!)
      scanAndSplit(document.body);
      
      // Now collect all the spans we just created
      const charSpans = document.querySelectorAll('.snake-edible-char');
      charSpans.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          // Skip invisible chars (spaces usually have 0 width if not pre)
          if (rect.width === 0 || rect.height === 0) return;
          
          // Skip already eaten/hidden elements
          if (el instanceof HTMLElement && el.style.opacity === '0') return;

          edibles.push({
              id: `edible-${index}`,
              rect,
              element: el as HTMLElement,
              isVisible: true
          });
      });
      
      // Also scan inputs
      scanInputs(edibles);
      // Scan target icons (Book, Search)
      scanTargetIcons(edibles);

      
      setEdibleElements(edibles)
      
      // Focus the container
      if (containerRef.current) {
        containerRef.current.focus()
      }

      // Cleanup function to restore elements when game exits/unmounts
      return () => {
          // If game was completed successfully, we DO NOT restore elements immediately
          // They will be restored when a new game starts or when CtfChallenge unmounts (route change)
          
          // We need to check if game was completed. 
          // Since we can't access latest state in cleanup easily without ref,
          // let's assume if active becomes false, we check.
          
          // Actually, we can just rely on restoreGlobalState being called at start of next game
          // and at CtfChallenge unmount.
          // So here we only perform restoration if the user ABORTED (Esc).
          // But 'gameCompleted' state might be stale here.
          
          // Let's modify the logic: 
          // Always keep modifiedElements in the Set.
          // ONLY restore if we are NOT in a "completed" state?
          // To simplify: We NEVER restore here. 
          // We rely on:
          // 1. restoreGlobalState() at start of new game.
          // 2. restoreGlobalState() when CtfChallenge unmounts (we need to implement this).
          // 3. restoreGlobalState() if user hits Esc (manual abort).
          
          // So we remove the automatic restoration logic from here.
      };
    } else {
      setGameStarted(false)
      setEdibleElements([])
    }
  }, [active])

  // Handle Game Completion Exit
  useEffect(() => {
    if (gameCompleted && !isExiting) {
      setIsExiting(true)
      // Exit animation: Snake speeds up and moves off screen, then game closes
      setTimeout(() => {
         onExit()
      }, 2000)
    }
  }, [gameCompleted, isExiting, onExit])

  // Game Loop
  useEffect(() => {
    if (!active || gameOver || !gameStarted) return

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y
        }
        
        // If exiting, just keep moving (disable collisions)
        if (isExiting) {
           return [newHead, ...prevSnake.slice(0, prevSnake.length - 1)]
        }

        // Check Wall Collision
        if (
          newHead.x < 0 || 
          newHead.x >= gridSize.cols || 
          newHead.y < 0 || 
          newHead.y >= gridSize.rows
        ) {
          setGameOver(true)
          return prevSnake
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [newHead, ...prevSnake]
        
        // Check Food Collision (DOM Elements)
        const headRect = {
          left: newHead.x * CELL_SIZE,
          top: newHead.y * CELL_SIZE,
          right: (newHead.x + 1) * CELL_SIZE,
          bottom: (newHead.y + 1) * CELL_SIZE,
          width: CELL_SIZE,
          height: CELL_SIZE
        }

        let ateFood = false
        
        setEdibleElements(prevEdibles => {
            let hasEaten = false;
            let remainingCount = 0;
            
            const nextEdibles = prevEdibles.map(edible => {
                if (!edible.isVisible) return edible; 
                
                remainingCount++;
                
                // Simple AABB collision detection
                const isColliding = !(
                    headRect.right < edible.rect.left || 
                    headRect.left > edible.rect.right || 
                    headRect.bottom < edible.rect.top || 
                    headRect.top > edible.rect.bottom
                );
                
                if (isColliding) {
                    hasEaten = true;
                    remainingCount--; // One less
                    
                    // Special Logic for Book Icon (Flag Reveal)
                    if (edible.id === 'ctf-book-icon') {
                        // Create and animate flag
                        const flag = document.createElement('div');
                        flag.textContent = 'flag{snake_charmer_master_8822}';
                        flag.className = 'snake-dynamic-flag text-green-500 font-bold font-mono text-sm z-[10010] fixed';
                        flag.style.left = `${edible.rect.left}px`;
                        flag.style.top = `${edible.rect.top}px`;
                        flag.style.transition = 'transform 0.5s ease-out';
                        flag.style.pointerEvents = 'none';
                        document.body.appendChild(flag);
                        
                        // Trigger animation in next frame
                        requestAnimationFrame(() => {
                            // Horizontal move left only, stay fixed
                            flag.style.transform = 'translateX(120px)'; 
                            flag.style.opacity = '1';
                        });
                        
                        // Hide the icon
                        edible.element.style.opacity = '0';
                        edible.element.style.transition = 'opacity 0.2s';
                        
                        // Add to global modified elements
                        modifiedElements.add(edible.element);
                        
                        // Game Over / Win condition
                        setGameCompleted(true);
                        
                        return { ...edible, isVisible: false };
                    }

                    // Check if it has a hidden flag (Legacy text check, kept just in case)
                    const hiddenFlag = edible.element.querySelector('.snake-hidden-flag') as HTMLElement;
                    if (hiddenFlag) {
                        // Hide the character but show the flag
                        // We use color transparent so the element is still there (for positioning the child)
                        edible.element.style.color = 'transparent'; 
                        edible.element.style.textShadow = 'none';
                        edible.element.style.backgroundColor = 'transparent';
                        
                        hiddenFlag.style.opacity = '1';
                        hiddenFlag.style.visibility = 'visible';
                        hiddenFlag.style.pointerEvents = 'auto'; // Make it selectable if needed
                    } else {
                        // Standard hide
                        edible.element.style.opacity = '0';
                        edible.element.style.transition = 'opacity 0.2s';
                        
                        // Add to global modified elements
                        modifiedElements.add(edible.element);
                    }
                    
                    return { ...edible, isVisible: false };
                }
                return edible;
            });
            
            if (hasEaten) {
                ateFood = true;
                setScore(s => s + 10);
            }
            
            // Check win condition (all visible elements eaten, or reasonable threshold)
            if (remainingCount === 0 && prevEdibles.length > 0) {
                setGameCompleted(true);
            }
            
            return hasEaten ? nextEdibles : prevEdibles;
        });

        if (!ateFood) {
          newSnake.pop()
        }

        return newSnake
      })
    }

    // Speed up when exiting
    const speed = isExiting ? 50 : INITIAL_SPEED
    const gameLoop = setInterval(moveSnake, speed)
    return () => clearInterval(gameLoop)
  }, [active, direction, gameOver, gameStarted, gridSize, isExiting])

  // Input Handling
  useEffect(() => {
    if (!active || isExiting) return // Disable input during exit

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Restore elements before exiting (Abort) -> User requested NO restoration on manual exit
        // restoreGlobalState();
        onExit()
        return
      }

      if (gameOver && e.key === 'Enter') {
        // Restart
        // Restore elements -> User requested NO restoration on restart
        // restoreGlobalState();
        setEdibleElements(prev => prev.map(e => ({...e, isVisible: true})))
        
        setSnake([{ x: 2, y: gridSize.rows - 5 }])
        setDirection({ x: 1, y: 0 })
        setGameOver(false)
        setGameCompleted(false)
        setScore(0)
        return
      }

      if (gameOver) return

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, direction, gameOver, onExit, gridSize, edibleElements, isExiting])

  if (!active) return null

  // Use Portal to render outside of the parent stacking context
  if (typeof window === 'undefined') return null

  // Ensure document.body exists
  const target = typeof document !== 'undefined' ? document.body : null;
  if (!target) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] outline-none snake-game-container pointer-events-none" // High z-index, but let clicks pass through if needed (though we capture input)
      ref={containerRef}
      tabIndex={0}
      style={{ cursor: 'none', pointerEvents: 'auto' }} // Re-enable pointer events for focus
    >
      {/* Score HUD Removed */}
      
      {/* Target Counter Removed */}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 z-[10001] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
          <h2 className="text-6xl font-bold mb-6 text-red-500 glitch-text">SYSTEM CRASHED</h2>
          <p className="text-2xl text-green-500 mb-8 font-mono">Elements Consumed: {score / 10}</p>
          <div className="space-y-4 text-center font-mono">
            <p className="text-white animate-pulse">Press [ENTER] to Reboot System</p>
            <p className="text-gray-500">Press [ESC] to Abort Protocol</p>
          </div>
        </div>
      )}
      
      {/* Game Completed Message */}
      {gameCompleted && (
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10001] text-green-500 font-mono text-4xl font-bold animate-pulse">
            CLEANUP COMPLETE. SYSTEM PURGED.
         </div>
      )}

      {/* Snake */}
      {snake.map((segment, index) => (
        <div
          key={`${segment.x}-${segment.y}-${index}`}
          className={cn(
            "absolute shadow-lg",
            index === 0 ? "bg-white z-[10005]" : "bg-gray-200 z-[10004]"
          )}
          style={{
            left: segment.x * CELL_SIZE,
            top: segment.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            transition: 'all 0.05s linear',
            borderRadius: index === 0 ? '4px' : '2px',
            boxShadow: index === 0 ? '0 0 15px #ffffff' : 'none'
          }}
        />
      ))}
      
      {/* Instructions Overlay (fades out) */}
      {!gameStarted && !gameOver && (
          <div className="absolute bottom-10 left-10 text-green-500 font-mono text-lg animate-pulse z-[10000]">
              Initializing Snake Protocol...
          </div>
      )}
    </div>,
    document.body
  )
}
