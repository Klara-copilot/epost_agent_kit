'use client';

import type { Package, Agent, Skill, Command } from '@/lib/types/entities';
import ItemPicker from './ItemPicker';

interface ProvidesEditorProps {
  provides: Package['provides'];
  allAgents: Agent[];
  allSkills: Skill[];
  allCommands: Command[];
  onProvidesChange: (provides: Package['provides']) => void;
}

export default function ProvidesEditor({
  provides,
  allAgents,
  allSkills,
  allCommands,
  onProvidesChange,
}: ProvidesEditorProps) {
  const availableAgents = allAgents
    .map((a) => a.id)
    .filter((id) => !provides.agents.includes(id));

  const availableSkills = allSkills
    .map((s) => s.id)
    .filter((id) => !provides.skills.includes(id));

  const availableCommands = allCommands
    .map((c) => c.id)
    .filter((id) => !provides.commands.includes(id));

  const handleAddAgent = (id: string) => {
    onProvidesChange({
      ...provides,
      agents: [...provides.agents, id],
    });
  };

  const handleRemoveAgent = (id: string) => {
    onProvidesChange({
      ...provides,
      agents: provides.agents.filter((a) => a !== id),
    });
  };

  const handleAddSkill = (id: string) => {
    onProvidesChange({
      ...provides,
      skills: [...provides.skills, id],
    });
  };

  const handleRemoveSkill = (id: string) => {
    onProvidesChange({
      ...provides,
      skills: provides.skills.filter((s) => s !== id),
    });
  };

  const handleAddCommand = (id: string) => {
    onProvidesChange({
      ...provides,
      commands: [...provides.commands, id],
    });
  };

  const handleRemoveCommand = (id: string) => {
    onProvidesChange({
      ...provides,
      commands: provides.commands.filter((c) => c !== id),
    });
  };

  return (
    <div className="space-y-3">
      <h3
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: 'var(--text-secondary)' }}
      >
        Provides
      </h3>
      <ItemPicker
        title="Agents"
        included={provides.agents}
        available={availableAgents}
        onAdd={handleAddAgent}
        onRemove={handleRemoveAgent}
        color="var(--accent-blue)"
      />
      <ItemPicker
        title="Skills"
        included={provides.skills}
        available={availableSkills}
        onAdd={handleAddSkill}
        onRemove={handleRemoveSkill}
        color="var(--accent-green)"
      />
      <ItemPicker
        title="Commands"
        included={provides.commands}
        available={availableCommands}
        onAdd={handleAddCommand}
        onRemove={handleRemoveCommand}
        color="var(--accent-orange)"
      />
    </div>
  );
}
