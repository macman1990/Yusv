'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'sections',
  title: 'Sections',
  titleSingular: 'Section',
  displayField: (item, locale) => item.name?.[locale] || item.name?.en || 'Untitled',
  subtitleField: (item) => item.section_type,
  fields: [
    { key: 'name', label: 'Section Name', type: 'bilingual' },
    {
      key: 'section_type',
      label: 'Section Type',
      type: 'select',
      defaultValue: 'custom',
      options: [
        { value: 'custom', label: 'Custom' },
        { value: 'text', label: 'Text Block' },
        { value: 'gallery', label: 'Gallery' },
        { value: 'video', label: 'Video' },
        { value: 'stats', label: 'Statistics' },
        { value: 'cards', label: 'Cards' },
        { value: 'buttons', label: 'Buttons' },
        { value: 'embed', label: 'Embed' },
      ],
    },
    { key: 'background', label: 'Background', type: 'text', defaultValue: 'default' },
    { key: 'typography', label: 'Typography', type: 'text', defaultValue: 'default' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function SectionsPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-border/40 bg-card/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">الأقسام / Sections</p>
        <p dir="rtl" className="leading-7">
          القسم هو جزء من محتوى الصفحة مثل المشاريع أو الخبرات أو الخدمات. يمكنك تفعيله أو إخفاؤه، ويُستخدم لإعادة استخدام أنواع محتوى محددة داخل الموقع. لا تُخلط بين القسم والصفحة؛ فالصفحة مسار مستقل، بينما القسم جزء داخل محتوى الصفحة.
        </p>
      </div>
      <ResourceManager config={config} />
    </div>
  );
}
