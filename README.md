# موقع BLACKWING ENGINE الرسمي

موقع ثابت (HTML5 + CSS3 + JavaScript ES Modules) بلا إطار عمل وبلا عملية بناء، ثنائي اللغة (عربي RTL / إنجليزي LTR)، جاهز للنشر على Cloudflare Pages. هذا المستودع **مستقل** عن مستودع المحرك.

## متطلبات التشغيل المحلي
- Node.js 18+ (للفحوصات فقط) وPython 3 أو أي خادم ملفات ثابتة. المتصفح يحتاج خادماً لأن `fetch` لا يعمل من `file://`.

## التشغيل والاختبار
```bash
python3 -m http.server 8000      # ثم افتح http://localhost:8000
node scripts/validate.mjs        # يفحص البيانات والترجمات والروابط والـ sitemap
```
الفحص يتأكد من: صحة JSON، تطابق مفاتيح العربية والإنجليزية، تطابق النص العربي المكتوب في HTML مع `ar.js`، عدم وجود روابط داخلية مكسورة، ووجود title/description لكل صفحة.

## بنية الملفات
- `index.html`, `downloads/`, `docs/`, `releases/`, `about/`, `404.html` — الصفحات (العربية مكتوبة فيها افتراضياً فتظهر حتى دون JavaScript).
- `assets/i18n/ar.js`, `en.js` — الترجمات (مصدر الحقيقة عند التبديل).
- `assets/js/` — `i18n.js` (اللغة والاتجاه)، `render.js` (عرض التنزيلات والإصدارات)، `data-check.js` (التحقق من البيانات).
- `data/downloads.json`, `data/releases.json` — بيانات التنزيلات والإصدارات.
- `scripts/` — `validate.mjs` و`gen-sitemap.mjs`. `_headers` — رؤوس الأمان لـ Cloudflare.

## إضافة لغة جديدة
1. انسخ `assets/i18n/en.js` إلى `xx.js` وترجم القيم.
2. سجّلها في `LANGS` داخل `assets/js/i18n.js` (مع `dir`).
3. عدّل زر اللغة ليتنقل بين أكثر من لغتين (حالياً يبدّل بين اثنتين).

## إضافة إصدار جديد
أضف كائناً إلى `releases` في `data/releases.json`: `version`, `channel` (`stable`|`preview`), `date` (`YYYY-MM-DD` أو `null`), `notes: {ar:[], en:[]}`, `downloadIds`. أضفه **بعد** نشر الإصدار فعلاً، ثم شغّل `validate.mjs`.

## إضافة/تعديل ملف تنزيل أو قالب تصدير
عدّل العنصر في `data/downloads.json`. الحالات: `available` | `in_development` | `unavailable`. الزر لا يظهر إلا مع `available` ورابط `https` حقيقي وإصدار. قيّم `sizeBytes` و`sha256` (حساب: `sha256sum file`) عند توفرهما. لا تضع رابطاً لملف غير منشور؛ المدقق سيرفض ذلك.

## النشر على Cloudflare Pages (Git integration)
1. ارفع المستودع إلى GitHub/GitLab.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git، واختر المستودع.
3. Framework preset: `None`، Build command: **اتركه فارغاً**، Output directory: `/` (جذر المستودع).
4. بعد النشر تحصل على نطاق `اسم-المشروع.pages.dev`.
- **معاينة:** كل فرع غير الإنتاجي يحصل على رابط معاينة تلقائي قبل الدمج.
- **التراجع:** من Deployments اختر نشراً سابقاً سليماً ثم Rollback.
- **نطاق خاص:** من تبويب Custom domains في المشروع.
- **Direct Upload:** رفع مجلد يدوياً دون Git؛ المشروع المنشأ به **لا يمكن تحويله لاحقاً إلى Git integration**، لذلك لا نستخدمه للإنتاج.

## بعد معرفة النطاق
```bash
SITE_URL=https://your-site.pages.dev node scripts/gen-sitemap.mjs
```
ثم أضف `canonical` و`og:url` و`og:image` بالنطاق الحقيقي.

## Google Search Console
أضف الموقع (Domain أو URL prefix)، تحقّق من الملكية (وسم HTML أو DNS)، ثم Sitemaps ← أدخل `sitemap.xml`.

## قيود ومهام غير مكتملة
- لم تُوثَّق أقسام التوثيق ولم تُدرج ميزات؛ تنتظر تأكيد حالة المحرك.
- لم يُنشر محرك ولا قوالب تصدير؛ كل البطاقات "غير متاح بعد".
- لا `hreflang`: اللغتان على نفس الرابط (تبديل بالواجهة). يلزم مسارات منفصلة (`/en/`) لو أردته.
- النطاق في sitemap.xml/robots.txt مؤقت (`CHANGE-ME`).
- لم تُختبر الصفحات في متصفح حقيقي أو على جهاز.
