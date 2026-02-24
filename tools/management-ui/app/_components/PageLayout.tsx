'use client';

import Link from 'next/link';

interface PageLayoutProps {
  title: string;
  backHref: string;
  headerRight?: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
  inspector?: React.ReactNode;
}

export default function PageLayout({
  title,
  backHref,
  headerRight,
  sidebar,
  main,
  inspector,
}: PageLayoutProps) {
  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}
    >
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-darker)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="transition-colors"
            style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }}
          >
            &larr; Back
          </Link>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {headerRight && <div>{headerRight}</div>}
      </header>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Sidebar */}
        <div
          className="overflow-y-auto"
          style={{
            width: '250px',
            backgroundColor: 'var(--bg-panel)',
            borderRight: '1px solid var(--border)',
          }}
        >
          {sidebar}
        </div>

        {/* Center: Main */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: 'var(--bg-main)' }}
        >
          {main}
        </div>

        {/* Right: Inspector (optional) */}
        {inspector && (
          <div
            className="overflow-y-auto"
            style={{
              width: '300px',
              backgroundColor: 'var(--bg-panel)',
              borderLeft: '1px solid var(--border)',
            }}
          >
            {inspector}
          </div>
        )}
      </div>
    </div>
  );
}
