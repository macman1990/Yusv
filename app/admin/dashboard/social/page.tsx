'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'social_links',
  title: 'Social Links',
  titleSingular: 'Social Link',
  displayField: (item) => item.platform || 'Untitled',
  subtitleField: (item) => item.url,
  fields: [
    { key: 'platform', label: 'Platform', type: 'text', placeholder: 'YouTube, Instagram, etc.' },
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'url', label: 'URL', type: 'text' },
    { key: 'icon', label: 'Icon (Lucide name)', type: 'text', placeholder: 'Youtube, Instagram, Music2, etc.' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function SocialPage() {
  return <ResourceManager config={config} />;
}
