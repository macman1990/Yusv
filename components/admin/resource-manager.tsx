'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/admin-api';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Loader2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'switch' | 'select' | 'bilingual' | 'bilingual-textarea' | 'json-array' | 'date' | 'image';
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: any;
};

export type ResourceConfig = {
  table: string;
  title: string;
  titleSingular: string;
  fields: FieldDef[];
  displayField: (item: any, locale: Locale) => string;
  subtitleField?: (item: any, locale: Locale) => string;
  statusField?: string;
  supportsSorting?: boolean;
};

function emptyItem(config: ResourceConfig): any {
  const item: any = {};
  config.fields.forEach((f) => {
    if (f.type === 'switch') item[f.key] = f.defaultValue ?? false;
    else if (f.type === 'number') item[f.key] = f.defaultValue ?? 0;
    else if (f.type === 'bilingual' || f.type === 'bilingual-textarea') item[f.key] = { en: '', ar: '' };
    else if (f.type === 'json-array') item[f.key] = [];
    else item[f.key] = f.defaultValue ?? '';
  });
  item.sort_order = 0;
  return item;
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  const { locale } = useApp();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.list(config.table);
      setItems(data);
    } catch (err: any) {
      console.error(`Failed to load ${config.table}:`, err);
      toast.error('تعذر تحميل البيانات. تأكد من اتصال قاعدة البيانات ثم حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, [config.table]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async (item: any) => {
    setSaving(true);
    const loadingToast = toast.loading('جارٍ حفظ التغييرات...');
    try {
      if (creating) {
        await adminApi.create(config.table, item);
        toast.success('تم الحفظ بنجاح', { id: loadingToast });
      } else {
        const { id, created_at, ...updateData } = item;
        await adminApi.update(config.table, item.id, updateData);
        toast.success('تم تحديث البيانات بنجاح', { id: loadingToast });
      }
      setEditing(null);
      setCreating(false);
      fetchItems();
    } catch (err: any) {
      console.error(`Failed to save ${config.table}:`, err);
      toast.error('تعذر حفظ التغييرات. تأكد من صحة البيانات ثم حاول مرة أخرى.', { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.remove(config.table, deleteId);
      toast.success('تم الحذف بنجاح');
      fetchItems();
    } catch (err: any) {
      console.error(`Failed to delete from ${config.table}:`, err);
      toast.error('تعذر حذف العنصر. تأكد من اتصال قاعدة البيانات ثم حاول مرة أخرى.');
    } finally {
      setDeleteId(null);
    }
  };

  const handleMove = async (item: any, direction: 'up' | 'down') => {
    if (!config.supportsSorting) return;
    const sorted = [...items].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const idx = sorted.findIndex(i => i.id === item.id);
    if (idx < 0) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const current = sorted[idx];
    const target = sorted[swapIdx];
    try {
      await Promise.all([
        adminApi.update(config.table, current.id, { sort_order: target.sort_order }),
        adminApi.update(config.table, target.id, { sort_order: current.sort_order }),
      ]);
      fetchItems();
    } catch (err: any) {
      console.error(`Failed to reorder ${config.table}:`, err);
      toast.error('تعذر تحديث الترتيب. تأكد من اتصال قاعدة البيانات ثم حاول مرة أخرى.');
    }
  };

  const toggleVisible = async (item: any) => {
    try {
      await adminApi.update(config.table, item.id, { visible: !item.visible });
      fetchItems();
    } catch (err: any) {
      console.error(`Failed to toggle visibility for ${config.table}:`, err);
      toast.error('تعذر تحديث حالة الظهور. تأكد من اتصال قاعدة البيانات ثم حاول مرة أخرى.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 rounded-xl bg-secondary/30 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">{config.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} {config.titleSingular.toLowerCase()}s</p>
        </div>
        <Button onClick={() => { setEditing(emptyItem(config)); setCreating(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add {config.titleSingular}
        </Button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border/40 bg-card/20">
          <p className="text-muted-foreground mb-4">لا توجد عناصر حاليًا / No {config.titleSingular.toLowerCase()}s yet</p>
          <Button onClick={() => { setEditing(emptyItem(config)); setCreating(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            إضافة أول عنصر / Add your first {config.titleSingular.toLowerCase()}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/30 hover:bg-card/50 transition-colors"
            >
              {config.supportsSorting && (
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleMove(item, 'up')} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleMove(item, 'down')} disabled={i === items.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {config.displayField(item, locale)}
                </div>
                {config.subtitleField && (
                  <div className="text-xs text-muted-foreground truncate">
                    {config.subtitleField(item, locale)}
                  </div>
                )}
              </div>

              {config.statusField && (
                <span className={cn(
                  'text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border',
                  item[config.statusField] === 'published' ? 'border-accent/30 text-accent bg-accent/5' : 'border-border/40 text-muted-foreground'
                )}>
                  {item[config.statusField]}
                </span>
              )}

              <button onClick={() => toggleVisible(item)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>

              <button onClick={() => { setEditing(item); setCreating(false); }} className="p-1.5 text-muted-foreground hover:text-accent transition-colors">
                <Pencil className="h-4 w-4" />
              </button>

              <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create dialog */}
      {editing && (
        <ResourceEditor
          config={config}
          item={editing}
          creating={creating}
          saving={saving}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setCreating(false); }}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.titleSingular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the item.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ResourceEditor({
  config, item, creating, saving, onSave, onCancel,
}: {
  config: ResourceConfig;
  item: any;
  creating: boolean;
  saving: boolean;
  onSave: (item: any) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<any>({ ...item });

  const update = (key: string, value: any) => {
    setDraft({ ...draft, [key]: value });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{creating ? `Add ${config.titleSingular}` : `Edit ${config.titleSingular}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {config.fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={draft[field.key]}
              onChange={(v) => update(field.key, v)}
            />
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(draft)} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {creating ? 'Create' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  if (field.type === 'bilingual' || field.type === 'bilingual-textarea') {
    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <Tabs defaultValue="en">
          <TabsList className="mb-2">
            <TabsTrigger value="en" className="text-xs">English</TabsTrigger>
            <TabsTrigger value="ar" className="text-xs">Arabic</TabsTrigger>
          </TabsList>
          <TabsContent value="en">
            {field.type === 'bilingual' ? (
              <Input
                value={value?.en || ''}
                onChange={(e) => onChange({ ...value, en: e.target.value })}
                placeholder={field.placeholder}
              />
            ) : (
              <Textarea
                value={value?.en || ''}
                onChange={(e) => onChange({ ...value, en: e.target.value })}
                placeholder={field.placeholder}
                rows={4}
              />
            )}
          </TabsContent>
          <TabsContent value="ar">
            {field.type === 'bilingual' ? (
              <Input
                value={value?.ar || ''}
                onChange={(e) => onChange({ ...value, ar: e.target.value })}
                placeholder={field.placeholder}
                dir="rtl"
              />
            ) : (
              <Textarea
                value={value?.ar || ''}
                onChange={(e) => onChange({ ...value, ar: e.target.value })}
                placeholder={field.placeholder}
                dir="rtl"
                rows={4}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
        />
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <Input
          type="number"
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  }

  if (field.type === 'switch') {
    return (
      <div className="flex items-center justify-between">
        <Label>{field.label}</Label>
        <Switch checked={!!value} onCheckedChange={onChange} />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger><SelectValue placeholder={field.placeholder || 'Select...'} /></SelectTrigger>
          <SelectContent>
            {field.options?.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === 'date') {
    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <Input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <div>
        <Label className="mb-1.5 block">{field.label}</Label>
        <div className="flex gap-3">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL..."
          />
          {value && (
            <div className="w-12 h-12 rounded-lg border border-border/40 overflow-hidden flex-shrink-0">
              <img src={value} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (field.type === 'json-array') {
    return (
      <JsonArrayInput field={field} value={value || []} onChange={onChange} />
    );
  }

  return (
    <div>
      <Label className="mb-1.5 block">{field.label}</Label>
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    </div>
  );
}

function JsonArrayInput({ field, value, onChange }: { field: FieldDef; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join(', '));

  useEffect(() => {
    setText(value.join(', '));
  }, [value]);

  return (
    <div>
      <Label className="mb-1.5 block">{field.label}</Label>
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean));
        }}
        placeholder="Comma-separated values..."
        rows={2}
      />
      <p className="text-xs text-muted-foreground mt-1">Separate items with commas</p>
    </div>
  );
}
