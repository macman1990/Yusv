'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'certifications',
  title: 'Certifications',
  titleSingular: 'Certification',
  displayField: (item, locale) => item.name?.[locale] || item.name?.en || 'Untitled',
  subtitleField: (item) => item.issuing_organization,
  fields: [
    { key: 'name', label: 'Certificate Name', type: 'bilingual' },
    { key: 'issuing_organization', label: 'Issuing Organization', type: 'text' },
    { key: 'issue_date', label: 'Issue Date', type: 'date' },
    { key: 'credential_id', label: 'Credential ID', type: 'text' },
    { key: 'credential_url', label: 'Credential URL', type: 'text' },
    { key: 'certificate_image_url', label: 'Certificate Image', type: 'image' },
    { key: 'description', label: 'Description', type: 'bilingual-textarea' },
    { key: 'logo_url', label: 'Logo URL', type: 'image' },
    { key: 'featured', label: 'Featured', type: 'switch', defaultValue: false },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function CertificationsPage() {
  return <ResourceManager config={config} />;
}
