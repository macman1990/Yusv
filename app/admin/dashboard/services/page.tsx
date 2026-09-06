'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'services',
  title: 'Services',
  titleSingular: 'Service',
  displayField: (item, locale) => item.title?.[locale] || item.title?.en || 'Untitled',
  subtitleField: (item) => item.icon || '',
  fields: [
    { key: 'title', label: 'Title', type: 'bilingual' },
    { key: 'description', label: 'Description', type: 'bilingual-textarea' },
    { key: 'icon', label: 'Icon (Lucide name)', type: 'text', placeholder: 'e.g. Video, Palette, Film' },
    { key: 'image_url', label: 'Image URL', type: 'image' },
    { key: 'tags', label: 'Tags', type: 'json-array' },
    { key: 'cta_text', label: 'CTA Text', type: 'bilingual' },
    { key: 'cta_link', label: 'CTA Link', type: 'text', placeholder: '#contact' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function ServicesPage() {
  return <ResourceManager config={config} />;
}
