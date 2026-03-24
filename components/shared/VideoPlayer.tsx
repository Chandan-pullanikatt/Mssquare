"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Play, Pause, Maximize, AlertCircle, RefreshCw } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initAttemptedRef = useRef(false);

  const addLog = (msg: string) => {
    console.log(`[VideoPlayer] ${msg}`);
    setDebugLog(prev => [...prev.slice(-4), msg]); // Keep last 5 logs
  };

  useEffect(() => {
    addLog(`Mounting for video: ${videoId}`);
    setIsReady(false);
    setIsPlaying(false);
    setError(null);
    initAttemptedRef.current = false;

    const loadAPI = () => {
      if (!window.YT) {
        addLog("Loading YouTube API script...");
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = () => {
          addLog("API Ready Callback Fired");
          checkAndInit();
        };
      } else if (window.YT.Player) {
        addLog("API Already Loaded, initializing...");
        checkAndInit();
      } else {
        addLog("API script exists but window.YT.Player not found yet...");
        setTimeout(loadAPI, 200);
      }
    };

    const checkAndInit = () => {
      if (initAttemptedRef.current) return;
      
      const playerId = `yt-player-${videoId}`;
      const element = document.getElementById(playerId);
      
      if (element && window.YT && window.YT.Player) {
        addLog("Element found! Starting player creation...");
        initAttemptedRef.current = true;
        initPlayer(playerId);
      } else {
        addLog(`Waiting for element ${playerId}...`);
        setTimeout(checkAndInit, 200);
      }
    };

    const initPlayer = (playerId: string) => {
      try {
        if (playerRef.current) {
          addLog("Destroying old player instance...");
          playerRef.current.destroy();
        }

        addLog("Creating new YT.Player...");
        playerRef.current = new window.YT.Player(playerId, {
          videoId: videoId,
          playerVars: {
            autoplay: 1, // Try to autoplay on init if possible
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            disablekb: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              addLog("Player event: onReady");
              setIsReady(true);
              setDuration(event.target.getDuration());
            },
            onStateChange: (event: any) => {
              addLog(`Player state: ${event.data}`);
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressInterval();
              } else {
                setIsPlaying(false);
                stopProgressInterval();
              }
            },
            onError: (event: any) => {
              addLog(`Player ERROR: ${event.data}`);
              setError(`Streaming Error (${event.data}). The video might have domain restrictions.`);
              setIsReady(true);
            }
          }
        });
      } catch (err) {
        addLog(`FATAL ERROR: ${err}`);
        setError("Technical stall. Please check if your browser allows YouTube embeds.");
      }
    };

    loadAPI();

    return () => {
      addLog("Unmounting component");
      stopProgressInterval();
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const startProgressInterval = () => {
    stopProgressInterval();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);
  };

  const stopProgressInterval = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current.seekTo(time, true);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group select-none shadow-2xl ring-1 ring-white/10"
    >
      {/* Loading State */}
      {!isReady && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20 space-y-4">
          <Loader2 className="animate-spin text-[#8b5cf6]" size={40} />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Establishing Connection...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20 p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
             <AlertCircle size={32} />
          </div>
          <div>
            <p className="text-white font-bold tracking-tight mb-2">{error}</p>
            <p className="text-gray-500 text-xs">Verify your internet or try an incognito window.</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold transition-all border border-white/10"
          >
            <RefreshCw size={14} />
            Hard Refresh
          </button>
        </div>
      )}

      {/* The Actual Video Container */}
      <div id={`yt-player-${videoId}`} className="w-full h-full" />

      {/* interaction Layer */}
      <div 
        className="absolute inset-0 z-10 bg-transparent cursor-pointer"
        onContextMenu={(e) => e.preventDefault()}
        onClick={togglePlay}
      />

      {/* Protection Badge */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]" />
          <p className="text-[10px] font-black text-white uppercase tracking-widest">
            Protected Stream
          </p>
        </div>
      </div>

      {/* Custom Controls Bar */}
      <div className={`absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-3 transition-all duration-500 ${isReady ? "opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0" : "opacity-0 pointer-events-none"}`}>
        
        {/* Progress Bar Container */}
        <div className="w-full bg-black/70 backdrop-blur-2xl rounded-2xl px-5 py-3.5 flex items-center gap-4 border border-white/10 shadow-3xl">
          <span className="text-[10px] font-black text-white min-w-[40px] tabular-nums">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group/progress flex items-center">
             <input 
              type="range" 
              min="0" 
              max={duration || 0} 
              step="0.1"
              value={currentTime} 
              onChange={handleSeek}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#8b5cf6] hover:accent-purple-400 z-20"
             />
             <div 
               className="absolute top-[calc(50%-3px)] left-0 h-1.5 bg-gradient-to-r from-[#8b5cf6] to-purple-400 rounded-full pointer-events-none z-10 shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
               style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
             />
          </div>
          <span className="text-[10px] font-black text-gray-400 min-w-[40px] tabular-nums">{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 bg-black/70 backdrop-blur-2xl p-2.5 rounded-[22px] border border-white/10 shadow-2xl">
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="w-12 h-12 flex items-center justify-center rounded-[16px] bg-[#8b5cf6] text-white hover:bg-[#9d7cf7] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20"
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
            </button>
            
            <div className="h-8 w-px bg-white/10 mx-1" />
            
            <div className="px-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1.5">Chapter</p>
              <p className="text-sm font-black text-white leading-none truncate max-w-[200px]">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-2xl p-2.5 rounded-[22px] border border-white/10 shadow-2xl">
            <button 
              onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
              className="w-12 h-12 flex items-center justify-center rounded-[16px] text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              <Maximize size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Large Central Play Button (When paused) */}
      {!isPlaying && isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-24 h-24 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 shadow-3xl animate-in zoom-in-50 duration-500">
             <div className="w-16 h-16 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white shadow-2xl shadow-purple-500/40">
                <Play size={32} fill="currentColor" className="ml-1" />
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
