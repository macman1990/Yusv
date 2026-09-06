'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'tools',
  title: 'Tools',
  titleSingular: 'Tool',
  displayField: (item) => item.name || 'Untitled',
  subtitleField: (item) => `${item.skill_level} · ${item.years_used} years · ${item.category}`,
  fields: [
    { key: 'name', label: 'Tool Name', type: 'text' },
    { key: 'skill_level', label: 'Skill Level', type: 'select', defaultValue: 'Intermediate', options: [
      { value: 'Expert', label: 'Expert' },
      { value: 'Advanced', label: 'Advanced' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Beginner', label: 'Beginner' },
    ]},
    { key: 'years_used', label: 'Years Used', type: 'number', defaultValue: 1 },
    { key: 'description', label: 'Description', type: 'bilingual-textarea' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Editing, Motion, Audio, Design' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function ToolsPage() {
  return <ResourceManager config={config} />;
}
