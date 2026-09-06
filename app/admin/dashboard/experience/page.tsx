'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'experience',
  title: 'Experience',
  titleSingular: 'Experience',
  displayField: (item, locale) => item.position?.[locale] || item.position?.en || 'Untitled',
  subtitleField: (item) => item.company,
  fields: [
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'position', label: 'Position', type: 'bilingual' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'is_current', label: 'Current Position', type: 'switch', defaultValue: false },
    { key: 'description', label: 'Description', type: 'bilingual-textarea' },
    { key: 'responsibilities', label: 'Responsibilities', type: 'json-array' },
    { key: 'achievements', label: 'Achievements', type: 'json-array' },
    { key: 'technologies', label: 'Technologies', type: 'json-array' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'logo_url', label: 'Logo URL', type: 'image' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function ExperiencePage() {
  return <ResourceManager config={config} />;
}
