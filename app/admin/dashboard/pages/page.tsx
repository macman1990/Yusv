'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'pages',
  title: 'Pages',
  titleSingular: 'Page',
  statusField: 'status',
  displayField: (item, locale) => item.title?.[locale] || item.title?.en || 'Untitled',
  subtitleField: (item) => `/${item.slug}`,
  fields: [
    { key: 'title', label: 'Title', type: 'bilingual' },
    { key: 'slug', label: 'Slug', type: 'text', placeholder: 'about, services, etc.' },
    { key: 'seo_title', label: 'SEO Title', type: 'bilingual' },
    { key: 'seo_description', label: 'SEO Description', type: 'bilingual-textarea' },
    { key: 'featured_image_url', label: 'Featured Image', type: 'image' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' },
      ],
    },
  ],
};

export default function PagesPage() {
  return <ResourceManager config={config} />;
}
