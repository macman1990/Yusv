'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'nav_items',
  title: 'Navigation',
  titleSingular: 'Nav Item',
  displayField: (item, locale) => item.label?.[locale] || item.label?.en || 'Untitled',
  subtitleField: (item) => `${item.link_type}: ${item.link_value}`,
  fields: [
    { key: 'label', label: 'Label', type: 'bilingual' },
    {
      key: 'link_type',
      label: 'Link Type',
      type: 'select',
      defaultValue: 'section',
      options: [
        { value: 'section', label: 'Section (anchor)' },
        { value: 'page', label: 'Page' },
        { value: 'external', label: 'External URL' },
      ],
    },
    { key: 'link_value', label: 'Link Value', type: 'text', placeholder: '#work, /about, https://...' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function NavigationPage() {
  return <ResourceManager config={config} />;
}
