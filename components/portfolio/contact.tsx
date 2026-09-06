'use client';

import { useState } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll';
import { useApp } from '@/components/providers/app-provider';
import { getLocalizedValue } from '@/lib/i18n';
import { Mail, MessageCircle, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { SocialLink, SiteSettings } from '@/lib/supabase';
import * as Icons from 'lucide-react';

export function ContactSection({ settings, socialLinks }: { settings: SiteSettings; socialLinks: SocialLink[] }) {
  const { locale } = useApp();
  const { ref, revealed } = useScrollReveal<HTMLDivElement>();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', project_type: '', budget: '', message: '' });

  const contact = settings.contact;
  const visibleSocial = socialLinks.filter(s => s.visible);

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? <IconComp className="h-4 w-4" /> : <Icons.Globe className="h-4 w-4" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(locale === 'ar' ? 'يرجى ملء الحقول المطلوبة' : 'Please fill in required fields');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: form.name,
        email: form.email,
        project_type: form.project_type,
        budget: form.budget,
        message: form.message,
      });
      if (error) throw error;
      toast.success(getLocalizedValue(contact?.success_message, locale) || 'Message sent!');
      setForm({ name: '', email: '', project_type: '', budget: '', message: '' });
    } catch (err) {
      toast.error(locale === 'ar' ? 'فشل الإرسال، حاول مرة أخرى' : 'Failed to send, try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 border-t border-border/30">
      <div ref={ref} className={`max-w-5xl mx-auto ${revealed ? 'revealed' : ''} reveal`}>
        <div className="mb-16 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-accent mb-3 block">
            {locale === 'ar' ? 'تواصل' : 'Contact'}
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {locale === 'ar' ? 'دعنا نصنع شيئًا استثنائيًا' : "Let's Create Something Exceptional"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {locale === 'ar'
              ? 'هل لديك مشروع في ذهنك؟ دعنا نناقشه. أرد عادة خلال 24 ساعة.'
              : "Got a project in mind? Let's talk about it. I usually respond within 24 hours."}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-accent/40 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Email</div>
                  <div className="text-sm font-medium group-hover:text-accent transition-colors">{contact.email}</div>
                </div>
              </a>
            )}
            {contact?.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl border border-border/40 hover:border-accent/40 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">WhatsApp</div>
                  <div className="text-sm font-medium group-hover:text-accent transition-colors">{contact.whatsapp}</div>
                </div>
              </a>
            )}

            {/* Social links */}
            {visibleSocial.length > 0 && (
              <div className="pt-2">
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-3">
                  {locale === 'ar' ? 'تابعني' : 'Follow Me'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleSocial.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg border border-border/40 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
                      aria-label={s.label}
                    >
                      {getIcon(s.icon)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={locale === 'ar' ? 'الاسم *' : 'Name *'}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-border/40 text-sm focus:border-accent focus:outline-none transition-colors"
              />
              <input
                type="email"
                placeholder={locale === 'ar' ? 'البريد الإلكتروني *' : 'Email *'}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                dir="ltr"
                className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-border/40 text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <select
                value={form.project_type}
                onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-border/40 text-sm focus:border-accent focus:outline-none transition-colors"
              >
                <option value="">{locale === 'ar' ? 'نوع المشروع' : 'Project Type'}</option>
                <option>{locale === 'ar' ? 'مونتاج فيديو' : 'Video Editing'}</option>
                <option>{locale === 'ar' ? 'محتوى قصير' : 'Short-form Content'}</option>
                <option>{locale === 'ar' ? 'موشن جرافيك' : 'Motion Graphics'}</option>
                <option>{locale === 'ar' ? 'كتابة سيناريو' : 'Script Writing'}</option>
                <option>{locale === 'ar' ? 'أخرى' : 'Other'}</option>
              </select>
              <select
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-border/40 text-sm focus:border-accent focus:outline-none transition-colors"
              >
                <option value="">{locale === 'ar' ? 'الميزانية' : 'Budget'}</option>
                <option>&lt; $500</option>
                <option>$500 - $1,000</option>
                <option>$1,000 - $5,000</option>
                <option>$5,000+</option>
              </select>
            </div>
            <textarea
              placeholder={locale === 'ar' ? 'رسالتك *' : 'Your message *'}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-secondary/40 border border-border/40 text-sm focus:border-accent focus:outline-none transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-medium text-sm hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {locale === 'ar' ? 'إرسال' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
