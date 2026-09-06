'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'testimonials',
  title: 'Testimonials',
  titleSingular: 'Testimonial',
  displayField: (item) => item.client_name || 'Untitled',
  subtitleField: (item) => `${item.position}${item.company ? ', ' + item.company : ''}`,
  fields: [
    { key: 'client_name', label: 'Client Name', type: 'text' },
    { key: 'position', label: 'Position', type: 'text' },
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'photo_url', label: 'Photo URL', type: 'image' },
    { key: 'testimonial', label: 'Testimonial', type: 'bilingual-textarea' },
    { key: 'rating', label: 'Rating (1-5)', type: 'number', defaultValue: 5 },
    { key: 'project', label: 'Project', type: 'text' },
    { key: 'testimonial_date', label: 'Date', type: 'date' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function TestimonialsPage() {
  return <ResourceManager config={config} />;
}
