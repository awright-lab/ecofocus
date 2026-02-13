'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type VideoChapter = {
  label: string;
  time: number;
};

type AgencyVideoPlayerProps = {
  src: string;
  poster?: string;
  chapters: VideoChapter[];
};

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function parseTimeParam(value: string | null): number | null {
  if (!value) return null;
  const trimmed = value.trim();

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  const mmssMatch = trimmed.match(/^(\d+):(\d{1,2})$/);
  if (mmssMatch) {
    const minutes = Number.parseInt(mmssMatch[1], 10);
    const seconds = Number.parseInt(mmssMatch[2], 10);
    if (seconds > 59) return null;
    return minutes * 60 + seconds;
  }

  const mAndSMatch = trimmed.match(/^(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (mAndSMatch && (mAndSMatch[1] || mAndSMatch[2])) {
    const minutes = mAndSMatch[1] ? Number.parseInt(mAndSMatch[1], 10) : 0;
    const seconds = mAndSMatch[2] ? Number.parseInt(mAndSMatch[2], 10) : 0;
    return minutes * 60 + seconds;
  }

  return null;
}

function buildUrlWithTime(seconds: number) {
  const url = new URL(window.location.href);
  url.searchParams.set('t', `${seconds}`);
  return url.toString();
}

export default function AgencyVideoPlayer({ src, poster, chapters }: AgencyVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const [copyState, setCopyState] = useState<string>('');

  const activeChapter = useMemo(() => {
    let index = 0;
    chapters.forEach((chapter, i) => {
      if (currentTime >= chapter.time) index = i;
    });
    return chapters[index]?.label;
  }, [chapters, currentTime]);

  useEffect(() => {
    const parsed = parseTimeParam(new URLSearchParams(window.location.search).get('t'));
    if (parsed !== null) setPendingSeek(parsed);
  }, []);

  useEffect(() => {
    if (!copyState) return;
    const timeout = window.setTimeout(() => setCopyState(''), 1400);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  const trySeek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) {
      setPendingSeek(seconds);
      return;
    }

    const bounded = Math.max(0, Math.min(seconds, Number.isFinite(video.duration) ? video.duration : seconds));
    video.currentTime = bounded;
    setCurrentTime(bounded);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setIsMuted(video.muted);

    if (pendingSeek !== null) {
      trySeek(pendingSeek);
      setPendingSeek(null);
    }
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video || videoUnavailable) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video || videoUnavailable) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleChapterSeek = (seconds: number) => {
    if (!videoUnavailable) {
      trySeek(seconds);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('t', `${seconds}`);
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const copyChapterLink = async (seconds: number) => {
    const target = buildUrlWithTime(seconds);
    try {
      await navigator.clipboard.writeText(target);
      setCopyState(`Copied ${formatTime(seconds)}`);
    } catch {
      setCopyState('Copy failed');
    }
  };

  return (
    <div className="grid gap-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm lg:grid-cols-5">
      <div className="lg:col-span-3">
        {videoUnavailable ? (
          <div className="flex aspect-video items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/60 p-6 text-center">
            <div>
              {poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster} alt="Video poster" className="mx-auto mb-4 max-h-56 rounded-lg object-cover" />
              ) : null}
              <p className="text-sm font-semibold text-gray-900">Video placeholder (coming soon)</p>
            </div>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            preload="metadata"
            className="aspect-video w-full rounded-xl bg-black"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={() => {
              const video = videoRef.current;
              if (!video) return;
              setCurrentTime(video.currentTime);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setVideoUnavailable(true)}
          />
        )}

        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              disabled={videoUnavailable}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              disabled={videoUnavailable}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 disabled:cursor-not-allowed disabled:text-gray-400"
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <p className="text-sm text-gray-700" aria-live="polite">
              {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>

          <label htmlFor="agency-video-progress" className="sr-only">
            Video progress
          </label>
          <input
            id="agency-video-progress"
            type="range"
            min={0}
            max={duration > 0 ? duration : 1}
            step={1}
            value={Math.min(currentTime, duration || 1)}
            onChange={(event) => trySeek(Number(event.target.value))}
            disabled={videoUnavailable}
            className="w-full accent-emerald-600"
          />
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Video Chapters</h3>
          <span className="text-xs text-emerald-700" aria-live="polite">
            {copyState || (activeChapter ? `Now: ${activeChapter}` : '')}
          </span>
        </div>

        <ul className="space-y-2">
          {chapters.map((chapter) => {
            const selected = activeChapter === chapter.label;
            return (
              <li
                key={chapter.label}
                className={`rounded-lg border p-3 ${
                  selected ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleChapterSeek(chapter.time)}
                    className="text-left"
                  >
                    <p className="text-xs font-semibold text-emerald-700">{formatTime(chapter.time)}</p>
                    <p className="text-sm font-medium text-gray-900">{chapter.label}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyChapterLink(chapter.time)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Copy link
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
