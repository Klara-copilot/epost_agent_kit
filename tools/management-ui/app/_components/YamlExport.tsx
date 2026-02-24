'use client';

import { useState } from 'react';

interface YamlExportProps {
  yamlContent: string;
  filename: string;
}

export default function YamlExport({ yamlContent, filename }: YamlExportProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs rounded cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--accent-blue)',
            color: '#fff',
          }}
        >
          {copied ? 'Copied!' : 'Copy YAML'}
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 text-xs rounded cursor-pointer transition-colors"
          style={{
            backgroundColor: 'var(--accent-blue)',
            color: '#fff',
          }}
        >
          Download
        </button>
      </div>
      <pre
        className="text-xs font-mono p-3 rounded max-h-96 overflow-auto"
        style={{ backgroundColor: 'var(--bg-main)' }}
      >
        {yamlContent}
      </pre>
    </div>
  );
}
