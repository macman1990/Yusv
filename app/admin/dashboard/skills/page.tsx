'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'skills',
  title: 'Skills',
  titleSingular: 'Skill',
  displayField: (item, locale) => item.name?.[locale] || item.name?.en || 'Untitled',
  subtitleField: (item) => `${item.category} · ${item.level}%`,
  fields: [
    { key: 'name', label: 'Skill Name', type: 'bilingual' },
    { key: 'level', label: 'Level (0-100)', type: 'number', defaultValue: 80 },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Core, Creative, Social Media' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function SkillsPage() {
  return <ResourceManager config={config} />;
}
