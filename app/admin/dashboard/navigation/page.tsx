'use client';

import { ResourceManager, type ResourceConfig } from '@/components/admin/resource-manager';

const config: ResourceConfig = {
  table: 'nav_items',
  title: 'Navigation',
  titleSingular: 'Nav Item',
  displayField: (item, locale) => item.label?.[locale] || item.label?.en || 'Untitled',
  subtitleField: (item) => `${item.link_type}: ${item.link_value}`,
  fields: [
    { key: 'label', label: 'Label', type: 'bilingual' },
    {
      key: 'link_type',
      label: 'Link Type',
      type: 'select',
      defaultValue: 'section',
      options: [
        { value: 'section', label: 'Section (anchor)' },
        { value: 'page', label: 'Page' },
        { value: 'external', label: 'External URL' },
      ],
    },
    { key: 'link_value', label: 'Link Value', type: 'text', placeholder: '#work, /about, https://...' },
    { key: 'visible', label: 'Visible', type: 'switch', defaultValue: true },
  ],
};

export default function NavigationPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-border/40 bg-card/30 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">التنقل / Navigation</p>
        <p dir="rtl" className="leading-7">
          من هنا تتحكم في عناصر القائمة الظاهرة في شريط التنقل العام للموقع. كل عنصر يحتوي على تسمية ووصف أو رابط، ويمكن إظهاره أو إخفاءه. تعتمد القائمة على الروابط والحقول الحالية في قاعدة البيانات، لذلك تأكد من الربط الصحيح بين قيمة الرابط والنص باللغة العربية أو الإنجليزية.
        </p>
      </div>
      <ResourceManager config={config} />
    </div>
  );
}
