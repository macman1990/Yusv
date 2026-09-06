'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'projects',
  title: 'Projects',
  titleSingular: 'Project',
  statusField: 'status',
  displayField: (item, locale) => item.title?.[locale] || item.title?.en || 'Untitled',
  subtitleField: (item, locale) => item.subtitle?.[locale] || item.subtitle?.en || '',
  fields: [
    { key: 'title', label: 'Title', type: 'bilingual' },
    { key: 'subtitle', label: 'Subtitle', type: 'bilingual' },
    { key: 'description', label: 'Description', type: 'bilingual-textarea' },
    { key: 'client', label: 'Client', type: 'text' },
    { key: 'project_date', label: 'Project Date', type: 'date' },
    { key: 'thumbnail_url', label: 'Thumbnail URL', type: 'image' },
    { key: 'preview_video_url', label: 'Preview Video URL', type: 'text', placeholder: 'MP4/WebM URL for hover preview' },
    { key: 'full_video_url', label: 'Full Video URL', type: 'text', placeholder: 'YouTube/Vimeo/direct URL' },
    { key: 'external_video_url', label: 'External Video URL', type: 'text' },
    {
      key: 'platform',
      label: 'Platform',
      type: 'select',
      defaultValue: 'youtube',
      options: [
        { value: 'youtube', label: 'YouTube' },
        { value: 'vimeo', label: 'Vimeo' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'direct', label: 'Direct Video' },
        { value: 'custom', label: 'Custom Embed' },
      ],
    },
    { key: 'video_id', label: 'Video ID', type: 'text', placeholder: 'Auto-extracted or manual' },
    {
      key: 'aspect_ratio',
      label: 'Aspect Ratio',
      type: 'select',
      defaultValue: '16:9',
      options: [
        { value: '16:9', label: '16:9 (Landscape)' },
        { value: '9:16', label: '9:16 (Vertical/Shorts)' },
        { value: '1:1', label: '1:1 (Square)' },
        { value: '21:9', label: '21:9 (Cinematic)' },
      ],
    },
    { key: 'tools_used', label: 'Tools Used', type: 'json-array' },
    { key: 'skills', label: 'Skills', type: 'json-array' },
    { key: 'results', label: 'Results', type: 'json-array' },
    { key: 'tags', label: 'Tags', type: 'json-array' },
    { key: 'credits', label: 'Credits', type: 'json-array' },
    { key: 'featured', label: 'Featured', type: 'switch', defaultValue: false },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' },
        { value: 'hidden', label: 'Hidden' },
      ],
    },
    { key: 'has_case_study', label: 'Has Case Study', type: 'switch', defaultValue: false },
  ],
};

export default function ProjectsPage() {
  return <ResourceManager config={config} />;
}
