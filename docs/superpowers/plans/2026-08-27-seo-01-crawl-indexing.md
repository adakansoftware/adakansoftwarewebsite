# SEO 01 — Tarama ve İndeksleme Planı

**Amaç:** Yalnızca herkese açık, canonical sayfaların taranmasını sağlamak.

- [ ] `app/robots.ts` içinde `/admin/`, `/api/` ve doğrulama gerektiren rotaları engelle.
- [ ] Yönetim sayfalarına `noindex, nofollow` metadata ekle.
- [ ] `app/sitemap.ts` rotalarını uygulamadaki herkese açık sayfalarla karşılaştır.
- [ ] Sitemap ve robots çıktılarını smoke testte doğrula.
- [ ] Build ve lint çalıştır; değişikliği ayrı commit yap.
