'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'content_items',
  title: 'Content',
  titleSingular: 'Content Item',
  statusField: 'status',
  displayField: (item, locale) => item.title?.[locale] || item.title?.en || 'Untitled',
  subtitleField: (item) => `${item.content_type} · ${item.platform}`,
  fields: [
    { key: 'title', label: 'Title', type: 'bilingual' },
    { key: 'description', label: 'Description', type: 'bilingual-textarea' },
    {
      key: 'content_type',
      label: 'Content Type',
      type: 'select',
      defaultValue: 'video',
      options: [
        { value: 'video', label: 'Video' },
        { value: 'article', label: 'Article' },
        { value: 'script', label: 'Script' },
        { value: 'creative', label: 'Creative Project' },
      ],
    },
    {
      key: 'platform',
      label: 'Platform',
      type: 'select',
      defaultValue: 'youtube',
      options: [
        { value: 'youtube', label: 'YouTube' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'vimeo', label: 'Vimeo' },
        { value: 'custom', label: 'Custom' },
      ],
    },
    { key: 'video_url', label: 'Video URL', type: 'text' },
    { key: 'video_id', label: 'Video ID', type: 'text' },
    { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'image' },
    { key: 'external_url', label: 'External URL', type: 'text' },
    { key: 'tags', label: 'Tags', type: 'json-array' },
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

export default function ContentPage() {
  return <ResourceManager config={config} />;
}
