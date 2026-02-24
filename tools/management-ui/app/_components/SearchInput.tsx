'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded transition-colors"
      style={{
        backgroundColor: 'var(--bg-main)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        transition: 'var(--transition-fast)',
      }}
    />
  );
}
