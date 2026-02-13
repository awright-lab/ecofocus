'use client';

function DataWaves({
  colors = ['#213F97', '#10B981', '#EF9601'],
  bars = 14,
  maxWidth = 480,
  gutter = 10,
  spacing = 22,
  barWidth = 9,
  barHeight = 56,
  duration = 6.0,
  delayStep = 0.24,
  offsetX = 4,
  reflectionOpacity = 0.42,
  reflectionBlurPx = 2,
  speedMultiplier = 1.0,
}: {
  colors?: string[];
  bars?: number;
  maxWidth?: number;
  gutter?: number;
  spacing?: number;
  barWidth?: number;
  barHeight?: number;
  duration?: number;
  delayStep?: number;
  offsetX?: number;
  reflectionOpacity?: number;
  reflectionBlurPx?: number;
  speedMultiplier?: number;
}) {
  const colorAt = (i: number) => colors[i % colors.length];

  const effectiveDuration = duration * speedMultiplier;

  return (
    <div
      className="waves mx-auto"
      aria-hidden
      style={{
        maxWidth,
        transform: `translateX(${offsetX}px)`,
        ['--gutter' as never]: `${gutter}px`,
        ['--spacing' as never]: `${spacing}px`,
        ['--barW' as never]: `${barWidth}px`,
        ['--barH' as never]: `${barHeight}px`,
        ['--reflOpacity' as never]: reflectionOpacity,
        ['--reflBlur' as never]: `${reflectionBlurPx}px`,
      }}
    >
      <div className="row top">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={`t-${i}`}
            className="bar"
            style={{
              left: `calc(var(--gutter) + ${(i + 1)} * var(--spacing))`,
              animationDelay: `${(i + 1) * delayStep}s`,
              animationDuration: `${effectiveDuration}s`,
              background: `linear-gradient(180deg, ${colorAt(i)} 0%, ${colorAt(i)} 70%, rgba(255,255,255,0.18) 100%)`,
              boxShadow: `0 6px 18px -8px ${colorAt(i)}33`,
            }}
          />
        ))}
      </div>

      <div className="axis" />

      <div className="row bottom">
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={`b-${i}`}
            className="bar"
            style={{
              left: `calc(var(--gutter) + ${(i + 1)} * var(--spacing))`,
              animationDelay: `${(i + 1) * delayStep}s`,
              animationDuration: `${effectiveDuration}s`,
              background: `linear-gradient(180deg, ${colorAt(i)} 0%, ${colorAt(i)} 70%, rgba(255,255,255,0.18) 100%)`,
              boxShadow: `0 6px 18px -8px ${colorAt(i)}33`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .waves {
          width: 100%;
          position: relative;
        }
        .row {
          position: relative;
          height: calc(var(--barH) + 24px);
          width: 100%;
        }
        .row.bottom {
          transform: rotate(180deg);
          opacity: var(--reflOpacity);
          filter: blur(var(--reflBlur));
        }
        .axis {
          height: 2px;
          width: 100%;
          background: #213f97;
          opacity: 0.85;
        }

        .bar {
          position: absolute;
          bottom: 20px;
          width: var(--barW);
          height: var(--barH);
          border-radius: 999px;
          transform-origin: bottom;
          transform: translateX(0) translateY(2px) scaleY(0);
          animation-name: waveMotion;
          animation-timing-function: cubic-bezier(0.33, 0, 0.23, 1);
          animation-iteration-count: infinite;
          will-change: transform;
          backface-visibility: hidden;
        }

        @keyframes waveMotion {
          0% {
            transform: translateX(0) translateY(2px) scaleY(0.02);
          }
          45% {
            transform: translateX(0) translateY(0) scaleY(1);
          }
          100% {
            transform: translateX(var(--spacing)) translateY(2px) scaleY(0.02);
          }
        }

        @media (max-width: 480px) {
          .row {
            height: calc(var(--barH) + 16px);
          }
        }
      `}</style>
    </div>
  );
}

export default function WhyNowWaves() {
  return (
    <div className="mt-4 md:mt-5">
      <DataWaves speedMultiplier={1.0} />
    </div>
  );
}
