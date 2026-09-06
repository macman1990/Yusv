'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'education',
  title: 'Education',
  titleSingular: 'Education',
  displayField: (item, locale) => item.degree?.[locale] || item.degree?.en || 'Untitled',
  subtitleField: (item) => item.institution,
  fields: [
    { key: 'institution', label: 'Institution', type: 'text' },
    { key: 'degree', label: 'Degree', type: 'bilingual' },
    { key: 'field', label: 'Field of Study', type: 'bilingual' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'description', label: 'Description', type: 'bilingual-textarea' },
    { key: 'certificate_url', label: 'Certificate URL', type: 'text' },
    { key: 'logo_url', label: 'Logo URL', type: 'image' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function EducationPage() {
  return <ResourceManager config={config} />;
}
