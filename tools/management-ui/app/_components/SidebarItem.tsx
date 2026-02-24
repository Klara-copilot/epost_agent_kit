'use client';

interface SidebarItemProps {
  label: string;
  subtitle?: string;
  selected: boolean;
  onClick: () => void;
  color: { bg: string; text: string; border: string };
}

export default function SidebarItem({ label, subtitle, selected, onClick, color }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 rounded text-sm border transition-all cursor-pointer"
      style={{
        backgroundColor: selected ? 'var(--accent-blue-select)' : color.bg,
        color: selected ? 'var(--text-primary)' : color.text,
        borderColor: selected ? 'var(--accent-blue)' : color.border,
        transition: 'var(--transition-fast)',
      }}
    >
      <div className="font-medium truncate">{label}</div>
      {subtitle && (
        <div className="text-xs opacity-70 truncate font-mono mt-0.5">{subtitle}</div>
      )}
    </button>
  );
}
