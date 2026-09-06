'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'media',
  title: 'Media Library',
  titleSingular: 'Media Item',
  displayField: (item) => item.name || 'Untitled',
  subtitleField: (item) => `${item.file_type} · ${item.alt_text || ''}`,
  fields: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'url', label: 'URL', type: 'image' },
    {
      key: 'file_type',
      label: 'File Type',
      type: 'select',
      defaultValue: 'image',
      options: [
        { value: 'image', label: 'Image' },
        { value: 'video', label: 'Video' },
        { value: 'pdf', label: 'PDF' },
        { value: 'document', label: 'Document' },
        { value: 'logo', label: 'Logo' },
        { value: 'thumbnail', label: 'Thumbnail' },
      ],
    },
    { key: 'alt_text', label: 'Alt Text', type: 'text' },
    { key: 'file_size', label: 'File Size (bytes)', type: 'number', defaultValue: 0 },
    { key: 'width', label: 'Width (px)', type: 'number', defaultValue: 0 },
    { key: 'height', label: 'Height (px)', type: 'number', defaultValue: 0 },
  ],
};

export default function MediaPage() {
  return <ResourceManager config={config} />;
}
