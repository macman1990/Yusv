'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'stats',
  title: 'Stats',
  titleSingular: 'Stat',
  displayField: (item, locale) => item.label?.[locale] || item.label?.en || 'Untitled',
  subtitleField: (item) => `${item.prefix}${item.number}${item.suffix}`,
  fields: [
    { key: 'number', label: 'Number', type: 'number', defaultValue: 0 },
    { key: 'label', label: 'Label', type: 'bilingual' },
    { key: 'icon', label: 'Icon (Lucide name)', type: 'text', placeholder: 'FolderKanban, Eye, Users, Award' },
    { key: 'prefix', label: 'Prefix', type: 'text', placeholder: '' },
    { key: 'suffix', label: 'Suffix', type: 'text', placeholder: '+, M+, K+' },
    { key: 'animate', label: 'Animate Count Up', type: 'switch', defaultValue: true },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function StatsPage() {
  return <ResourceManager config={config} />;
}
