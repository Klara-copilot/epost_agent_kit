'use client';

import { useEffect, useState } from 'react';
import { LoadedData, ParseError } from '@/lib/types/entities';
import Link from 'next/link';

interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: string;
  message: string;
  data?: Record<string, unknown> | string | number | boolean | null;
}

interface ApiResponse {
  success: boolean;
  data?: LoadedData;
  parseErrors?: ParseError[];
  stats?: {
    totalNodes: number;
    totalEdges: number;
    nodesByType: Record<string, number>;
    edgesByType: Record<string, number>;
  };
  logs?: LogEntry[];
  error?: string;
}

export default function Home() {
  const [data, setData] = useState<LoadedData | null>(null);
  const [stats, setStats] = useState<ApiResponse['stats'] | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [showParseErrors, setShowParseErrors] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/data');
        const result: ApiResponse = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to load data');
        }

        setData(result.data || null);
        setStats(result.stats || null);
        setLogs(result.logs || []);
        const errors = result.parseErrors || result.data?.parseErrors || [];
        setParseErrors(errors);
        setShowParseErrors(errors.some(e => e.level === 'error'));

        console.log('Graph Statistics:', result.stats);
        console.log('Logs:', result.logs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-300">Loading agent system data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center max-w-4xl p-8">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Error Loading Data</h1>
          <p className="text-gray-300 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Make sure the epost_agent_kit repository exists at:
            <br />
            <code className="bg-gray-800 px-2 py-1 rounded mt-2 inline-block">
              ~/Projects/epost_agent_kit
            </code>
          </p>

          {/* Error Logs */}
          {logs.length > 0 && (
            <div className="mt-8 text-left">
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded mb-4 text-sm"
              >
                {showLogs ? 'Hide' : 'Show'} Diagnostic Logs ({logs.length})
              </button>

              {showLogs && (
                <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="font-mono text-xs space-y-2">
                    {logs.map((log, idx) => (
                      <div key={idx} className={`p-2 rounded ${
                        log.level === 'error' ? 'bg-red-900/20 text-red-300' :
                        log.level === 'warn' ? 'bg-yellow-900/20 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <span className="font-semibold">[{log.category}]</span>
                          <span className="flex-1">{log.message}</span>
                        </div>
                        {log.data && (
                          <pre className="mt-1 ml-4 text-xs text-gray-400">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ePost Agents Management
          </h1>
          <p className="text-xl text-gray-400">
            Visual management interface for the ePost Agent Kit system
          </p>
        </header>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <StatCard
            title="Agents"
            count={data?.agents.length || 0}
            color="blue"
          />
          <StatCard
            title="Skills"
            count={data?.skills.length || 0}
            color="green"
          />
          <StatCard
            title="Commands"
            count={data?.commands.length || 0}
            color="orange"
          />
          <StatCard
            title="Packages"
            count={data?.packages.length || 0}
            color="purple"
          />
          <StatCard
            title="Profiles"
            count={data?.profiles.length || 0}
            color="pink"
          />
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-400 mb-2">Agent Models</h3>
              <ul className="space-y-1">
                <li>Haiku: {data?.agents.filter(a => a.model === 'haiku').length || 0}</li>
                <li>Sonnet: {data?.agents.filter(a => a.model === 'sonnet').length || 0}</li>
                <li>Opus: {data?.agents.filter(a => a.model === 'opus').length || 0}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-400 mb-2">Package Layers</h3>
              <ul className="space-y-1">
                <li>Layer 0: {data?.packages.filter(p => p.layer === 0).length || 0}</li>
                <li>Layer 1: {data?.packages.filter(p => p.layer === 1).length || 0}</li>
                <li>Layer 2+: {data?.packages.filter(p => p.layer >= 2).length || 0}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-400 mb-2">Total Capabilities</h3>
              <ul className="space-y-1">
                <li>Skills per agent: {((data?.agents.reduce((sum, a) => sum + a.skills.length, 0) || 0) / (data?.agents.length || 1)).toFixed(1)}</li>
                <li>Commands mapped: {data?.commands.filter(c => c.agent).length || 0}</li>
                <li>Skill references: {data?.skills.reduce((sum, s) => sum + s.references.length, 0) || 0}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NavCard
            title="Canvas View"
            description="Interactive graph visualization of the entire agent system"
            href="/canvas"
            icon="🎨"
          />
          <NavCard
            title="Package Designer"
            description="Create and edit package compositions"
            href="/packages"
            icon="📦"
          />
          <NavCard
            title="Profile Composer"
            description="Design team profiles and package combinations"
            href="/profiles"
            icon="👥"
          />
        </div>

        {/* Parse Issues Panel */}
        {parseErrors.length > 0 && (
          <ParseIssuesPanel
            errors={parseErrors}
            expanded={showParseErrors}
            onToggle={() => setShowParseErrors(v => !v)}
          />
        )}

        {/* Debug Info */}
        <details className="mt-12">
          <summary className="cursor-pointer text-gray-500 hover:text-gray-300">
            Debug Info (click to expand)
          </summary>
          <pre className="mt-4 bg-gray-800 p-4 rounded overflow-auto text-xs">
            {JSON.stringify(
              {
                agentCount: data?.agents.length,
                skillCount: data?.skills.length,
                commandCount: data?.commands.length,
                packageCount: data?.packages.length,
                profileCount: data?.profiles.length,
                sampleAgent: data?.agents[0],
                sampleSkill: data?.skills[0],
              },
              null,
              2
            )}
          </pre>
        </details>

        {/* Diagnostic Logs Section */}
        {logs.length > 0 && (
          <div className="mt-12 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Diagnostic Logs</h2>
              <button
                onClick={() => setShowLogs(!showLogs)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
              >
                {showLogs ? 'Hide' : 'Show'} Logs ({logs.length})
              </button>
            </div>

            {showLogs && (
              <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="font-mono text-xs space-y-2">
                  {logs.map((log, idx) => (
                    <div key={idx} className={`p-2 rounded ${
                      log.level === 'error' ? 'bg-red-900/20 text-red-300' :
                      log.level === 'warn' ? 'bg-yellow-900/20 text-yellow-300' :
                      'bg-gray-800 text-gray-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className="font-semibold">[{log.category}]</span>
                        <span className="flex-1">{log.message}</span>
                      </div>
                      {log.data && (
                        <pre className="mt-1 ml-4 text-xs text-gray-400 overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ParseIssuesPanel({
  errors,
  expanded,
  onToggle,
}: {
  errors: ParseError[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const errorCount = errors.filter(e => e.level === 'error').length;
  const warningCount = errors.filter(e => e.level === 'warning').length;

  const groups: Record<string, ParseError[]> = {};
  for (const e of errors) {
    if (!groups[e.entityType]) groups[e.entityType] = [];
    groups[e.entityType].push(e);
  }

  const title = [
    errorCount > 0 && `${errorCount} error${errorCount !== 1 ? 's' : ''}`,
    warningCount > 0 && `${warningCount} warning${warningCount !== 1 ? 's' : ''}`,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className={`mt-8 rounded-lg border ${errorCount > 0 ? 'border-red-700 bg-red-950/20' : 'border-yellow-700 bg-yellow-950/10'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`text-lg font-semibold ${errorCount > 0 ? 'text-red-400' : 'text-yellow-400'}`}>
            Parse Issues
          </span>
          <span className={`text-sm px-2 py-0.5 rounded-full font-mono ${errorCount > 0 ? 'bg-red-900/50 text-red-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
            {title}
          </span>
        </div>
        <span className="text-gray-500 text-sm">{expanded ? '▲ hide' : '▼ show'}</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {Object.entries(groups).map(([entityType, items]) => (
            <div key={entityType}>
              <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-semibold">
                {entityType}s ({items.length})
              </h3>
              <div className="space-y-1 font-mono text-xs">
                {items.map((e, idx) => {
                  const shortPath = e.filePath.replace(/.*\/(packages|\.claude)\//, '$1/');
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 items-start p-2 rounded ${
                        e.level === 'error' ? 'bg-red-900/20 text-red-300' : 'bg-yellow-900/10 text-yellow-200'
                      }`}
                    >
                      <span className={`shrink-0 uppercase font-bold text-[10px] mt-0.5 px-1.5 py-0.5 rounded ${
                        e.level === 'error' ? 'bg-red-700 text-white' : 'bg-yellow-700 text-white'
                      }`}>
                        {e.level === 'error' ? 'ERR' : 'WARN'}
                      </span>
                      <span className="shrink-0 text-gray-400 max-w-[260px] truncate" title={e.filePath}>
                        {shortPath}
                      </span>
                      {e.field && (
                        <span className="shrink-0 text-gray-500">
                          <span className="text-gray-600">field:</span> <span className="text-cyan-400">{e.field}</span>
                          {e.value !== undefined && (
                            <span className="text-gray-500"> = <span className="text-orange-300">"{String(e.value)}"</span></span>
                          )}
                        </span>
                      )}
                      <span className="text-gray-300 flex-1">{e.message}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, count, color }: { title: string; count: number; color: string }) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} rounded-lg p-6 text-center`}>
      <div className="text-4xl font-bold mb-2">{count}</div>
      <div className="text-sm opacity-90">{title}</div>
    </div>
  );
}

function NavCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: string }) {
  return (
    <Link
      href={href}
      className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </Link>
  );
}
