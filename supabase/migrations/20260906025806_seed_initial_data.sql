/*
# Seed Initial Data: Admin Password + Sample Content

Seeds admin password, settings, categories, projects, services, skills, tools,
experience, education, certifications, testimonials, stats, content items,
social links, and nav items with realistic bilingual content.
*/

-- ============ ADMIN PASSWORD ============
-- Password: 2512y, using bcrypt via pgcrypto
INSERT INTO admin_config (id, password_hash, password_salt)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  crypt('2512y', gen_salt('bf')),
  'bf'
) ON CONFLICT (id) DO UPDATE
SET password_hash = crypt('2512y', gen_salt('bf')),
    password_salt = 'bf',
    updated_at = now();

-- ============ SETTINGS ============
INSERT INTO settings (key, value) VALUES
('profile', '{"name":"Kareem Al-Rashid","title":{"en":"Video Editor • Script Writer • Content Creator","ar":"مونتير فيديو • كاتب سيناريو • صانع محتوى"},"positioning":{"en":"I craft cinematic stories that captivate audiences and drive results. From concept to final cut, I bring visions to life through motion, color, and sound.","ar":"أصنع قصصًا سينمائية تأسر الجمهور وتحقق النتائج. من الفكرة إلى المونتاج النهائي، أحيي الرؤى عبر الحركة واللون والصوت."},"profile_photo":"","cv_url":""}'::jsonb),
('contact', '{"email":"hello@kareemcreative.com","whatsapp":"+1234567890","cta_text":{"en":"Lets Work Together","ar":"لنعمل معًا"},"success_message":{"en":"Thank you for reaching out! I will get back to you within 24 hours.","ar":"شكرا لتواصلك! سأرد عليك خلال 24 ساعة."}}'::jsonb),
('theme', '{"default_theme":"dark","accent_color":"#e8b339","animation_enabled":true,"cursor_enabled":true,"parallax_enabled":true,"animation_intensity":"medium","transition_speed":0.6}'::jsonb),
('seo', '{"site_title":"Kareem Al-Rashid | Video Editor & Content Creator","meta_description":"Professional video editor, script writer, and content creator specializing in cinematic storytelling, motion graphics, and social media content.","keywords":"video editor, script writer, content creator, motion graphics, color grading, youtube editing","og_image":"","favicon":"","author":"Kareem Al-Rashid","canonical_url":""}'::jsonb),
('about', '{"short_bio":{"en":"Cinematic storyteller with 8+ years crafting compelling video content for brands, creators, and filmmakers worldwide.","ar":"راوي قصص سينمائية بخبرة تزيد عن 8 سنوات في صناعة محتوى فيديو مقنع للعلامات التجارية والمبدعين وصناع الأفلام حول العالم."},"long_bio":{"en":"I am a video editor and content creator driven by the belief that every frame tells a story. With over 8 years of professional experience, I have edited hundreds of videos ranging from cinematic documentaries to viral short-form content that has generated millions of views. My approach combines technical precision with creative vision. I specialize in YouTube long-form editing, short-form content for TikTok and Instagram, motion graphics, color grading in DaVinci Resolve, and sound design that elevates the emotional impact of every scene.","ar":"أنا مونتير فيديو وصانع محتوى أؤمن بأن كل لقطة تروي قصة. بخبرة مهنية تزيد عن 8 سنوات، قمت بمونتاج مئات الفيديوهات التي تتراوح بين الأفلام الوثائقية السينمائية والمحتوى القصير الذي حقق ملايين المشاهدات. يجمع منهجي بين الدقة التقنية والرؤية الإبداعية. أتخصص في مونتاج يوتيوب طويل المدى، والمحتوى القصير لتيك توك وإنستغرام، والموشن جرافيك، وتدرج اللون في دافينشي ريسولف، وتصميم الصوت الذي يرفع التأثير العاطفي لكل مشهد."},"philosophy":{"en":"Every frame is a word, every cut is a sentence, every sequence is a paragraph in the story you are telling.","ar":"كل لقطة كلمة، وكل قاطع جملة، وكل تسلسل فقرة في القصة التي ترويها."},"years_experience":8,"industries":["Technology","Fashion","Education","Entertainment","Food & Beverage","Fitness"],"tools_list":["DaVinci Resolve","Adobe Premiere Pro","After Effects","Photoshop","Audition","CapCut"]}'::jsonb),
('footer', '{"statement":{"en":"Crafting stories that move people.","ar":"أصنع قصصًا تحرك الناس."},"copyright":"© 2026 Kareem Al-Rashid. All rights reserved."}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- ============ CATEGORIES ============
INSERT INTO categories (id, name, slug, sort_order, visible) VALUES
('a1000000-0000-0000-0000-000000000001', '{"en":"Video Editing","ar":"مونتاج الفيديو"}', 'video-editing', 1, true),
('a1000000-0000-0000-0000-000000000002', '{"en":"Short Form","ar":"محتوى قصير"}', 'short-form', 2, true),
('a1000000-0000-0000-0000-000000000003', '{"en":"YouTube","ar":"يوتيوب"}', 'youtube', 3, true),
('a1000000-0000-0000-0000-000000000004', '{"en":"Motion Graphics","ar":"موشن جرافيك"}', 'motion-graphics', 4, true),
('a1000000-0000-0000-0000-000000000005', '{"en":"Color Grading","ar":"تدرج اللون"}', 'color-grading', 5, true),
('a1000000-0000-0000-0000-000000000006', '{"en":"Script Writing","ar":"كتابة السيناريو"}', 'script-writing', 6, true),
('a1000000-0000-0000-0000-000000000007', '{"en":"Content Creation","ar":"صناعة المحتوى"}', 'content-creation', 7, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ PROJECTS ============
INSERT INTO projects (id, title, subtitle, description, category_id, client, project_date, thumbnail_url, preview_video_url, full_video_url, platform, video_id, aspect_ratio, tools_used, skills, results, tags, credits, featured, visible, status, sort_order, has_case_study) VALUES
('a2000000-0000-0000-0000-000000000001',
  '{"en":"Echoes of the City","ar":"أصداء المدينة"}',
  '{"en":"Cinematic Documentary","ar":"فيلم وثائقي سينمائي"}',
  '{"en":"A 12-minute cinematic documentary exploring the hidden soundscape of urban life. Edited from 4 hours of raw footage into a meditation on noise, silence, and the rhythm of the city.","ar":"فيلم وثائقي سينمائي مدته 12 دقيقة يستكشف المشهد الصوتي الخفي للحياة الحضرية. تم مونتاجه من 4 ساعات من اللقطات الخام إلى تأمل في الضجيج والصمت وإيقاع المدينة."}',
  'a1000000-0000-0000-0000-000000000001',
  'Urban Stories Productions',
  '2025-08-15',
  'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 'dQw4w9WgXcQ', '16:9',
  '["DaVinci Resolve","After Effects","Audition"]'::jsonb,
  '["Color Grading","Sound Design","Narrative Editing"]'::jsonb,
  '["350K+ views","Best Documentary Award 2025","Featured on Vimeo Staff Picks"]'::jsonb,
  '["documentary","cinematic","urban","sound design"]'::jsonb,
  '["Director: Sarah Chen","Sound: Mike Ross","Color: Kareem Al-Rashid"]'::jsonb,
  true, true, 'published', 1, true),
('a2000000-0000-0000-0000-000000000002',
  '{"en":"Neon Dreams","ar":"أحلام النيون"}',
  '{"en":"YouTube Long-form Edit","ar":"مونتاج يوتيوب طويل"}',
  '{"en":"A 22-minute deep-dive video essay on the aesthetics of cyberpunk cinema. Crafted with dynamic pacing, motion graphics overlays, and a custom sound design palette.","ar":"مقال فيديو مدته 22 دقيقة يتعمق في جماليات السينما السيبرانية. صُنع بإيقاع ديناميكي وطبقات موشن جرافيك وتصميم صوتي مخصص."}',
  'a1000000-0000-0000-0000-000000000003',
  'CinemaScope Channel',
  '2025-07-20',
  'https://images.pexels.com/photos/2693208/pexels-photo-2693208.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', 'dQw4w9WgXcQ', '16:9',
  '["Premiere Pro","After Effects","DaVinci Resolve"]'::jsonb,
  '["Motion Graphics","Narrative Editing","Sound Design"]'::jsonb,
  '["1.2M views","85% like ratio","15K new subscribers"]'::jsonb,
  '["youtube","video essay","cyberpunk","motion graphics"]'::jsonb,
  '["Research: Alex Park","Voice: Jordan Lee"]'::jsonb,
  true, true, 'published', 2, false),
('a2000000-0000-0000-0000-000000000003',
  '{"en":"Viral in 60 Seconds","ar":"فيروسي في 60 ثانية"}',
  '{"en":"TikTok Short-form Series","ar":"سلسلة تيك توك قصيرة"}',
  '{"en":"A series of 12 short-form videos for a fitness brand, optimized for TikTok and Instagram Reels. Each video under 60 seconds with punchy edits, trend-aware transitions, and high-retention pacing.","ar":"سلسلة من 12 فيديو قصير لعلامة تجارية للياقة البدنية، محسّنة لتيك توك وريلز إنستغرام. كل فيديو أقل من 60 ثانية مع مونتاج قوي وانتقالات عصرية وإيقاع عالي الاحتفاظ."}',
  'a1000000-0000-0000-0000-000000000002',
  'PulseFit',
  '2025-09-01',
  'https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '', '', 'tiktok', '', '9:16',
  '["CapCut","Premiere Pro"]'::jsonb,
  '["Short-form Editing","Social Media Content","Trend Awareness"]'::jsonb,
  '["8M+ total views","420K new followers","3.2% engagement rate"]'::jsonb,
  '["tiktok","short form","fitness","viral"]'::jsonb,
  '["Creative: PulseFit Team","Edit: Kareem Al-Rashid"]'::jsonb,
  true, true, 'published', 3, false),
('a2000000-0000-0000-0000-000000000004',
  '{"en":"The Art of Color","ar":"فن اللون"}',
  '{"en":"Color Grading Showcase","ar":"عرض تدرج اللون"}',
  '{"en":"A showcase reel demonstrating advanced color grading techniques across multiple formats. Graded entirely in DaVinci Resolve.","ar":"عرض يستعرض تقنيات تدرج اللون المتقدمة عبر صيغ متعددة. تم تدرجه بالكامل في دافينشي ريسولف."}',
  'a1000000-0000-0000-0000-000000000005',
  'Personal Project',
  '2025-06-10',
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '', '', 'vimeo', '', '16:9',
  '["DaVinci Resolve"]'::jsonb,
  '["Color Grading","Cinematic Look"]'::jsonb,
  '["200K+ views","Featured on ShotCut","5 client inquiries"]'::jsonb,
  '["color grading","showreel","cinematic","davinci"]'::jsonb,
  '["All work: Kareem Al-Rashid"]'::jsonb,
  false, true, 'published', 4, false),
('a2000000-0000-0000-0000-000000000005',
  '{"en":"Brand in Motion","ar":"العلامة في حركة"}',
  '{"en":"Motion Graphics Campaign","ar":"حملة موشن جرافيك"}',
  '{"en":"A complete motion graphics package for a tech startup launch including logo animation, product reveal, and a 90-second explainer video.","ar":"حزمة موشن جرافيك كاملة لإطلاق شركة ناشئة تقنية بما في ذلك أنيميشن شعار وكشف المنتج وفيديو توضيحي مدته 90 ثانية."}',
  'a1000000-0000-0000-0000-000000000004',
  'NexaTech',
  '2025-05-15',
  'https://images.pexels.com/photos/7988079/pexels-photo-7988079.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '', '', 'custom', '', '16:9',
  '["After Effects","Illustrator","Premiere Pro"]'::jsonb,
  '["Motion Graphics","Brand Identity","Animation"]'::jsonb,
  '["500K+ views across platforms","45% increase in brand recall","Successful product launch"]'::jsonb,
  '["motion graphics","branding","tech","after effects"]'::jsonb,
  '["Design: Lisa Wang","Animation: Kareem Al-Rashid"]'::jsonb,
  true, true, 'published', 5, false),
('a2000000-0000-0000-0000-000000000006',
  '{"en":"The Unwritten Script","ar":"السيناريو غير المكتوب"}',
  '{"en":"Script Writing Project","ar":"مشروع كتابة سيناريو"}',
  '{"en":"A complete video script for a 15-minute educational documentary on sustainable architecture. From research to final draft, including shot list and editing notes.","ar":"سيناريو فيديو كامل لفيلم وثائقي تعليمي مدته 15 دقيقة عن العمارة المستدامة. من البحث إلى المسودة النهائية، بما في ذلك قائمة اللقطات وملاحظات المونتاج."}',
  'a1000000-0000-0000-0000-000000000006',
  'GreenBuild Initiative',
  '2025-04-20',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '', '', 'custom', '', '16:9',
  '["Google Docs","Final Draft"]'::jsonb,
  '["Script Writing","Research","Storytelling"]'::jsonb,
  '["180K views on YouTube","Used in 3 university curricula"]'::jsonb,
  '["script writing","education","sustainability"]'::jsonb,
  '["Writer: Kareem Al-Rashid"]'::jsonb,
  false, true, 'published', 6, false)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, description = EXCLUDED.description,
  category_id = EXCLUDED.category_id, client = EXCLUDED.client, project_date = EXCLUDED.project_date,
  thumbnail_url = EXCLUDED.thumbnail_url, platform = EXCLUDED.platform, featured = EXCLUDED.featured,
  visible = EXCLUDED.visible, status = EXCLUDED.status, sort_order = EXCLUDED.sort_order,
  has_case_study = EXCLUDED.has_case_study;

-- ============ SERVICES ============
INSERT INTO services (id, title, description, icon, image_url, tags, cta_text, cta_link, sort_order, visible) VALUES
('a3000000-0000-0000-0000-000000000001', '{"en":"Video Editing","ar":"مونتاج الفيديو"}', '{"en":"Professional editing for documentaries, branded content, and narrative films. Cinematic pacing, seamless transitions, and story-first approach.","ar":"مونتاج احترافي للأفلام الوثائقية والمحتوى التجاري وأفلام السرد. إيقاع سينمائي وانتقالات سلسة ومنهج يضع القصة أولاً."}', 'Video', '', '["Cinematic","Documentary","Branded"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 1, true),
('a3000000-0000-0000-0000-000000000002', '{"en":"Short-form Content","ar":"المحتوى القصير"}', '{"en":"Scroll-stopping short-form videos for TikTok, Instagram Reels, and YouTube Shorts. Optimized for retention and engagement.","ar":"فيديوهات قصيرة توقف التمرير لتيك توك وريلز وショートs يوتيوب. محسّنة للاحتفاظ والتفاعل."}', 'Smartphone', '', '["TikTok","Reels","Shorts"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 2, true),
('a3000000-0000-0000-0000-000000000003', '{"en":"YouTube Editing","ar":"مونتاج يوتيوب"}', '{"en":"Long-form YouTube editing that keeps viewers watching. Dynamic pacing, motion graphics, and retention-focused storytelling.","ar":"مونتاج يوتيوب طويل يحافظ على المشاهدين. إيقاع ديناميكي وموشن جرافيك وسرد يركز على الاحتفاظ."}', 'Youtube', '', '["Long-form","Video Essays","Vlogs"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 3, true),
('a3000000-0000-0000-0000-000000000004', '{"en":"Motion Graphics","ar":"موشن جرافيك"}', '{"en":"Custom motion graphics, logo animations, and visual effects. Hand-crafted in After Effects for a unique, premium look.","ar":"موشن جرافيك مخصص وأنيميشن شعار ومؤثرات بصرية. مصنوعة يدويًا في أفتر إفكتس لمظهر فريد وراقي."}', 'Sparkles', '', '["After Effects","Logo Animation","VFX"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 4, true),
('a3000000-0000-0000-0000-000000000005', '{"en":"Color Grading","ar":"تدرج اللون"}', '{"en":"Cinematic color grading in DaVinci Resolve. From subtle natural looks to bold creative grades that define your visual identity.","ar":"تدرج لون سينمائي في دافينشي ريسولف. من المظهر الطبيعي الدقيق إلى التدرجات الإبداعية الجريئة التي تحدد هويتك البصرية."}', 'Palette', '', '["DaVinci Resolve","Cinematic","LUTs"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 5, true),
('a3000000-0000-0000-0000-000000000006', '{"en":"Sound Design","ar":"تصميم الصوت"}', '{"en":"Professional sound design and audio mixing. Music selection, SFX, and clean dialogue mixing that elevates your video.","ar":"تصميم صوتي ومزج صوتي احترافي. اختيار الموسيقى والمؤثرات الصوتية ومزج الحوار النظيف الذي يرفع مستوى فيديوك."}', 'Volume2', '', '["Mixing","SFX","Music"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 6, true),
('a3000000-0000-0000-0000-000000000007', '{"en":"Script Writing","ar":"كتابة السيناريو"}', '{"en":"Compelling video scripts from concept to final draft. Research, structure, and storytelling that hooks viewers from frame one.","ar":"سيناريوهات فيديو مقنعة من الفكرة إلى المسودة النهائية. بحث وبنية وسرد يخطف المشاهدين من أول لقطة."}', 'FileText', '', '["Research","Storytelling","Structure"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 7, true),
('a3000000-0000-0000-0000-000000000008', '{"en":"Content Strategy","ar":"استراتيجية المحتوى"}', '{"en":"End-to-end content strategy for creators and brands. Content calendars, platform optimization, and growth planning.","ar":"استراتيجية محتوى شاملة للمبدعين والعلامات التجارية. تقويم المحتوى وتحسين المنصات وتخطيط النمو."}', 'Target', '', '["Strategy","Growth","Optimization"]'::jsonb, '{"en":"Get Started","ar":"ابدأ الآن"}', '#contact', 8, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, icon = EXCLUDED.icon,
  tags = EXCLUDED.tags, sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ SKILLS ============
INSERT INTO skills (id, name, level, category, sort_order, visible) VALUES
('a4000000-0000-0000-0000-000000000001', '{"en":"Video Editing","ar":"مونتاج الفيديو"}', 95, 'Core', 1, true),
('a4000000-0000-0000-0000-000000000002', '{"en":"Color Grading","ar":"تدرج اللون"}', 90, 'Core', 2, true),
('a4000000-0000-0000-0000-000000000003', '{"en":"Motion Graphics","ar":"موشن جرافيك"}', 85, 'Core', 3, true),
('a4000000-0000-0000-0000-000000000004', '{"en":"Sound Design","ar":"تصميم الصوت"}', 80, 'Core', 4, true),
('a4000000-0000-0000-0000-000000000005', '{"en":"Script Writing","ar":"كتابة السيناريو"}', 88, 'Creative', 5, true),
('a4000000-0000-0000-0000-000000000006', '{"en":"Storytelling","ar":"فن السرد"}', 92, 'Creative', 6, true),
('a4000000-0000-0000-0000-000000000007', '{"en":"Content Strategy","ar":"استراتيجية المحتوى"}', 82, 'Creative', 7, true),
('a4000000-0000-0000-0000-000000000008', '{"en":"Short-form Editing","ar":"مونتاج قصير"}', 90, 'Social Media', 8, true),
('a4000000-0000-0000-0000-000000000009', '{"en":"Social Media Content","ar":"محتوى التواصل الاجتماعي"}', 85, 'Social Media', 9, true),
('a4000000-0000-0000-0000-00000000000a', '{"en":"Visual Effects","ar":"المؤثرات البصرية"}', 75, 'Core', 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, level = EXCLUDED.level, category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ TOOLS ============
INSERT INTO tools (id, name, icon, skill_level, years_used, description, category, sort_order, visible) VALUES
('a5000000-0000-0000-0000-000000000001', 'DaVinci Resolve', '', 'Expert', 6, '{"en":"Professional color grading and editing.","ar":"تدرج لون ومونتاج احترافي."}', 'Editing', 1, true),
('a5000000-0000-0000-0000-000000000002', 'Adobe Premiere Pro', '', 'Expert', 8, '{"en":"Industry-standard video editing.","ar":"مونتاج فيديو معياري في الصناعة."}', 'Editing', 2, true),
('a5000000-0000-0000-0000-000000000003', 'After Effects', '', 'Advanced', 6, '{"en":"Motion graphics and visual effects.","ar":"موشن جرافيك ومؤثرات بصرية."}', 'Motion', 3, true),
('a5000000-0000-0000-0000-000000000004', 'Adobe Photoshop', '', 'Advanced', 8, '{"en":"Image editing and graphic design.","ar":"تحرير الصور وتصميم الجرافيك."}', 'Design', 4, true),
('a5000000-0000-0000-0000-000000000005', 'Adobe Audition', '', 'Intermediate', 5, '{"en":"Audio editing and sound design.","ar":"تحرير الصوت وتصميم الصوت."}', 'Audio', 5, true),
('a5000000-0000-0000-0000-000000000006', 'CapCut', '', 'Expert', 3, '{"en":"Fast short-form video editing.","ar":"مونتاج سريع للمحتوى القصير."}', 'Editing', 6, true),
('a5000000-0000-0000-0000-000000000007', 'Blender', '', 'Intermediate', 2, '{"en":"3D modeling and animation.","ar":"نمذجة وأنيميشن ثلاثي الأبعاد."}', '3D', 7, true),
('a5000000-0000-0000-0000-000000000008', 'Figma', '', 'Advanced', 4, '{"en":"UI design and storyboarding.","ar":"تصميم واجهات ولوحات القصة."}', 'Design', 8, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, skill_level = EXCLUDED.skill_level, years_used = EXCLUDED.years_used,
  description = EXCLUDED.description, category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ EXPERIENCE ============
INSERT INTO experience (id, company, position, start_date, end_date, is_current, description, responsibilities, achievements, technologies, logo_url, location, sort_order, visible) VALUES
('a6000000-0000-0000-0000-000000000001',
  'Creative Studio Pro',
  '{"en":"Senior Video Editor","ar":"مونتير فيديو أول"}',
  '2022-01-01', null, true,
  '{"en":"Leading video production for high-profile clients including tech startups, fashion brands, and educational platforms.","ar":"قيادة إنتاج الفيديو لعملاء بارزين بما في ذلك الشركات التقنية الناشئة وعلامات الأزياء والمنصات التعليمية."}',
  '["Lead editor on 50+ projects","Manage team of 3 junior editors","Client consultation and creative direction","Color grading and sound design oversight"]'::jsonb,
  '["Increased client retention by 60%","Delivered 200+ videos totaling 50M+ views","Won Best Edit Award 2024"]'::jsonb,
  '["DaVinci Resolve","Premiere Pro","After Effects","Audition"]'::jsonb,
  '', 'Dubai, UAE', 1, true),
('a6000000-0000-0000-0000-000000000002',
  'Digital Wave Media',
  '{"en":"Video Editor & Content Creator","ar":"مونتير فيديو وصانع محتوى"}',
  '2019-03-01', '2021-12-31', false,
  '{"en":"Edited YouTube content and social media campaigns for creators with combined 5M+ subscribers.","ar":"مونتاج محتوى يوتيوب وحملات وسائل التواصل لصناع محتوى بمجموع يزيد عن 5 مليون مشترك."}',
  '["Edit 10+ videos per week","Develop content strategies","Create motion graphics packages","Manage social media content pipeline"]'::jsonb,
  '["Helped 3 channels reach 100K+ subscribers","Average video retention rate of 65%","Produced 500+ videos"]'::jsonb,
  '["Premiere Pro","After Effects","Photoshop","CapCut"]'::jsonb,
  '', 'Remote', 2, true),
('a6000000-0000-0000-0000-000000000003',
  'Freelance',
  '{"en":"Freelance Video Editor","ar":"مونتير فيديو مستقل"}',
  '2017-01-01', '2019-02-28', false,
  '{"en":"Worked with independent creators, small businesses, and non-profits to produce compelling video content.","ar":"عملت مع مبدعين مستقلين وأعمال صغيرة ومنظمات غير ربحية لإنتاج محتوى فيديو مقنع."}',
  '["Client acquisition and project management","End-to-end video production","Script writing and storyboarding","Color grading and sound design"]'::jsonb,
  '["Built portfolio of 100+ projects","98% client satisfaction rate","Established ongoing relationships with 15+ clients"]'::jsonb,
  '["Premiere Pro","DaVinci Resolve","After Effects"]'::jsonb,
  '', 'Various', 3, true)
ON CONFLICT (id) DO UPDATE SET
  company = EXCLUDED.company, position = EXCLUDED.position, start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date, is_current = EXCLUDED.is_current, description = EXCLUDED.description,
  responsibilities = EXCLUDED.responsibilities, achievements = EXCLUDED.achievements,
  technologies = EXCLUDED.technologies, sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ EDUCATION ============
INSERT INTO education (id, institution, degree, field, start_date, end_date, description, certificate_url, logo_url, visible, sort_order) VALUES
('a7000000-0000-0000-0000-000000000001',
  'New York Film Academy',
  '{"en":"Diploma in Filmmaking","ar":"دبلوم في صناعة الأفلام"}',
  '{"en":"Film & Video Production","ar":"إنتاج الأفلام والفيديو"}',
  '2015-09-01', '2017-06-30',
  '{"en":"Comprehensive filmmaking program covering directing, editing, cinematography, and post-production.","ar":"برنامج شامل لصناعة الأفلام يغطي الإخراج والمونتاج والتصوير وما بعد الإنتاج."}',
  '', '', true, 1),
('a7000000-0000-0000-0000-000000000002',
  'Coursera / Google',
  '{"en":"Professional Certificate","ar":"شهادة مهنية"}',
  '{"en":"Digital Marketing & Content Strategy","ar":"التسويق الرقمي واستراتيجية المحتوى"}',
  '2020-01-01', '2020-06-30',
  '{"en":"Specialization in digital marketing, content strategy, and social media growth.","ar":"تخصص في التسويق الرقمي واستراتيجية المحتوى ونمو وسائل التواصل الاجتماعي."}',
  '', '', true, 2)
ON CONFLICT (id) DO UPDATE SET
  institution = EXCLUDED.institution, degree = EXCLUDED.degree, field = EXCLUDED.field,
  start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- ============ CERTIFICATIONS ============
INSERT INTO certifications (id, name, issuing_organization, issue_date, credential_id, credential_url, certificate_image_url, description, logo_url, featured, visible, sort_order) VALUES
('a8000000-0000-0000-0000-000000000001',
  '{"en":"DaVinci Resolve Certified Colorist","ar":"مدرج لون معتمد في دافينشي ريسولف"}',
  'Blackmagic Design', '2023-06-15', 'BMD-CC-2023-7892', '', '',
  '{"en":"Professional certification in advanced color grading using DaVinci Resolve Studio.","ar":"شهادة مهنية في تدرج اللون المتقدم باستخدام دافينشي ريسولف ستوديو."}',
  '', true, true, 1),
('a8000000-0000-0000-0000-000000000002',
  '{"en":"Adobe Certified Professional in Video Editing","ar":"محترف معتمد من أدوبي في مونتاج الفيديو"}',
  'Adobe', '2022-03-10', 'ACP-VE-2022-4521', '', '',
  '{"en":"Official Adobe certification in Premiere Pro and After Effects proficiency.","ar":"شهادة أدوبي رسمية في إتقان بريمير برو وأفتر إفكتس."}',
  '', true, true, 2),
('a8000000-0000-0000-0000-000000000003',
  '{"en":"YouTube Creator Certification","ar":"شهادة صانع محتوى يوتيوب"}',
  'YouTube', '2021-09-05', 'YT-CC-2021-1147', '', '',
  '{"en":"Certification in YouTube content best practices, audience growth, and platform optimization.","ar":"شهادة في أفضل ممارسات محتوى يوتيوب ونمو الجمهور وتحسين المنصة."}',
  '', false, true, 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, issuing_organization = EXCLUDED.issuing_organization,
  issue_date = EXCLUDED.issue_date, credential_id = EXCLUDED.credential_id,
  description = EXCLUDED.description, featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ TESTIMONIALS ============
INSERT INTO testimonials (id, client_name, position, company, photo_url, testimonial, rating, project, testimonial_date, visible, sort_order) VALUES
('a9000000-0000-0000-0000-000000000001',
  'Sarah Chen', 'Creative Director', 'Urban Stories Productions',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"en":"Kareem transformed 4 hours of raw footage into a cinematic masterpiece. His understanding of storytelling goes beyond technical skills. The documentary we made together won Best Documentary at our festival.","ar":"كريم حوّل 4 ساعات من اللقطات الخام إلى تحفة سينمائية. فهمه للسرد يتجاوز المهارات التقنية. الفيلم الوثائقي الذي صنعناه معًا فاز بجائزة أفضل فيلم وثائقي في مهرجاننا."}',
  5, 'Echoes of the City', '2025-09-01', true, 1),
('a9000000-0000-0000-0000-000000000002',
  'Mike Torres', 'Founder', 'PulseFit',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"en":"Our TikTok went from 2K to 420K followers in 3 months. Kareem understands short-form content at a level I have not seen anywhere else. Every video he edits is a masterclass in retention.","ar":"تيك توك الخاص بنا قفز من 2 ألف إلى 420 ألف متابع في 3 أشهر. كريم يفهم المحتوى القصير بمستوى لم أره في أي مكان آخر. كل فيديو يونتجه هو درس متقن في الاحتفاظ."}',
  5, 'Viral in 60 Seconds', '2025-09-10', true, 2),
('a9000000-0000-0000-0000-000000000003',
  'Lisa Wang', 'Marketing Lead', 'NexaTech',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  '{"en":"The motion graphics package Kareem created for our product launch was exceptional. Our launch video hit 500K views and directly drove sign-ups.","ar":"حزمة الموشن جرافيك التي أنشأها كريم لإطلاق منتجنا كانت استثنائية. فيديو الإطلاق حقق 500 ألف مشاهدة وأدى مباشرة إلى التسجيلات."}',
  5, 'Brand in Motion', '2025-06-01', true, 3)
ON CONFLICT (id) DO UPDATE SET
  client_name = EXCLUDED.client_name, position = EXCLUDED.position, company = EXCLUDED.company,
  photo_url = EXCLUDED.photo_url, testimonial = EXCLUDED.testimonial, rating = EXCLUDED.rating,
  project = EXCLUDED.project, testimonial_date = EXCLUDED.testimonial_date,
  sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ STATS ============
INSERT INTO stats (id, number, label, icon, prefix, suffix, animate, visible, sort_order) VALUES
('aa000000-0000-0000-0000-000000000001', 750, '{"en":"Projects Completed","ar":"مشروع مكتمل"}', 'FolderKanban', '', '+', true, true, 1),
('aa000000-0000-0000-0000-000000000002', 50, '{"en":"Million Views Generated","ar":"مليون مشاهدة"}', 'Eye', '', 'M+', true, true, 2),
('aa000000-0000-0000-0000-000000000003', 120, '{"en":"Happy Clients","ar":"عميل سعيد"}', 'Users', '', '+', true, true, 3),
('aa000000-0000-0000-0000-000000000004', 8, '{"en":"Years Experience","ar":"سنوات خبرة"}', 'Award', '', '+', true, true, 4)
ON CONFLICT (id) DO UPDATE SET
  number = EXCLUDED.number, label = EXCLUDED.label, icon = EXCLUDED.icon,
  prefix = EXCLUDED.prefix, suffix = EXCLUDED.suffix, sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ CONTENT ITEMS ============
INSERT INTO content_items (id, title, description, content_type, platform, video_url, video_id, thumbnail_url, tags, visible, status, sort_order) VALUES
('ab000000-0000-0000-0000-000000000001',
  '{"en":"How I Edit Cinematic Videos","ar":"كيف أونتاج الفيديوهات السينمائية"}',
  '{"en":"A behind-the-scenes look at my editing process for cinematic documentary content.","ar":"نظرة من وراء الكواليس على عملية المونتاج للمحتوى الوثائقي السينمائي."}',
  'video', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ',
  'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '["tutorial","editing","cinematic"]'::jsonb, true, 'published', 1),
('ab000000-0000-0000-0000-000000000002',
  '{"en":"5 Script Writing Tips That Changed My Career","ar":"5 نصائح لكتابة السيناريو غيرت مسيرتي"}',
  '{"en":"Practical script writing tips for video creators based on 8 years of experience.","ar":"نصائح عملية لكتابة السيناريو لصناع الفيديو بناءً على 8 سنوات من الخبرة."}',
  'video', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ',
  'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '["script writing","tips","creator"]'::jsonb, true, 'published', 2),
('ab000000-0000-0000-0000-000000000003',
  '{"en":"Color Grading Breakdown","ar":"تحليل تدرج اللون"}',
  '{"en":"Step-by-step color grading breakdown of a recent project in DaVinci Resolve.","ar":"تحليل خطوة بخطوة لتدرج اللون لمشروع حديث في دافينشي ريسولف."}',
  'video', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ',
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1280',
  '["color grading","davinci","tutorial"]'::jsonb, true, 'published', 3)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, content_type = EXCLUDED.content_type,
  platform = EXCLUDED.platform, video_url = EXCLUDED.video_url, video_id = EXCLUDED.video_id,
  thumbnail_url = EXCLUDED.thumbnail_url, tags = EXCLUDED.tags, sort_order = EXCLUDED.sort_order,
  visible = EXCLUDED.visible, status = EXCLUDED.status;

-- ============ SOCIAL LINKS ============
INSERT INTO social_links (id, platform, label, url, icon, sort_order, visible) VALUES
('ac000000-0000-0000-0000-000000000001', 'YouTube', 'YouTube', 'https://youtube.com/@kareemcreative', 'Youtube', 1, true),
('ac000000-0000-0000-0000-000000000002', 'Instagram', 'Instagram', 'https://instagram.com/kareemcreative', 'Instagram', 2, true),
('ac000000-0000-0000-0000-000000000003', 'TikTok', 'TikTok', 'https://tiktok.com/@kareemcreative', 'Music2', 3, true),
('ac000000-0000-0000-0000-000000000004', 'LinkedIn', 'LinkedIn', 'https://linkedin.com/in/kareemcreative', 'Linkedin', 4, true),
('ac000000-0000-0000-0000-000000000005', 'Behance', 'Behance', 'https://behance.net/kareemcreative', 'Palette', 5, true),
('ac000000-0000-0000-0000-000000000006', 'Email', 'Email', 'mailto:hello@kareemcreative.com', 'Mail', 6, true)
ON CONFLICT (id) DO UPDATE SET
  platform = EXCLUDED.platform, label = EXCLUDED.label, url = EXCLUDED.url, icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;

-- ============ NAV ITEMS ============
INSERT INTO nav_items (id, label, link_type, link_value, sort_order, visible) VALUES
('ad000000-0000-0000-0000-000000000001', '{"en":"Work","ar":"الأعمال"}', 'section', '#work', 1, true),
('ad000000-0000-0000-0000-000000000002', '{"en":"About","ar":"عني"}', 'section', '#about', 2, true),
('ad000000-0000-0000-0000-000000000003', '{"en":"Services","ar":"الخدمات"}', 'section', '#services', 3, true),
('ad000000-0000-0000-0000-000000000004', '{"en":"Experience","ar":"الخبرة"}', 'section', '#experience', 4, true),
('ad000000-0000-0000-0000-000000000005', '{"en":"Contact","ar":"تواصل"}', 'section', '#contact', 5, true)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label, link_type = EXCLUDED.link_type, link_value = EXCLUDED.link_value,
  sort_order = EXCLUDED.sort_order, visible = EXCLUDED.visible;