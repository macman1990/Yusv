'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'categories',
  title: 'Categories',
  titleSingular: 'Category',
  displayField: (item, locale) => item.name?.[locale] || item.name?.en || 'Untitled',
  subtitleField: (item) => `/${item.slug}`,
  fields: [
    { key: 'name', label: 'Name', type: 'bilingual' },
    { key: 'slug', label: 'Slug', type: 'text', placeholder: 'url-friendly-name' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function CategoriesPage() {
  return <ResourceManager config={config} />;
}
