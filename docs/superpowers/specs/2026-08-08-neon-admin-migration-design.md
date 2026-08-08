# Neon yönetim paneli geçişi

## Amaç

Yönetim panelinin Supabase Auth, PostgREST ve Storage bağımlılıklarını kaldırmak. Yayındaki içerikler ve yönetim işlemleri yalnızca Neon PostgreSQL ile uygulamanın kendi yönetici oturumunu kullanacak.

## Kapsam

- Yönetici girişi `ADMIN_EMAIL`, `ADMIN_PASSWORD` ve imzalı HTTP-only çerez üzerinden çalışacak.
- İstemci, Supabase istemcisi yerine `/api/admin` uçlarına istek yapacak.
- Sunucu uçları Neon üzerinde proje ve logo kayıtlarını listeleyecek, oluşturacak, güncelleyecek, arşivleyecek ve silecek.
- Görseller dosya olarak yüklenmeyecek; yönetici panelinde doğrudan görsel URL'si girilecek.
- Herkese açık sayfalar Neon’dan yalnızca yayımlanmış ve arşivlenmemiş içerikleri okumaya devam edecek. Neon ulaşılamadığında statik içerik yedeği korunacak.
- Neon şeması iki içerik tablosunu oluşturacak; eski Supabase şeması, istemcisi ve paketi kaldırılacak.

## Tasarım

`/admin/login` e-posta ve şifreyi `POST /api/admin/login` uç noktasına gönderir. Uç nokta doğrulama yapar ve imzalı çerezi ayarlar. Yönetim sayfası oturum bilgisini `GET /api/admin/session` üzerinden denetler; çıkışta `POST /api/admin/logout` çerezi siler.

İçerik yöneticisi, seçili türü `GET /api/admin/content?type=...` ile yükler. Kayıtlar JSON gövdeli `POST`, `PATCH` ve `DELETE` istekleriyle aynı kaynak üzerinden değiştirilir. Sunucu, tür değerini izinli iki tabloyla sınırlar ve sorgu değerlerini parametreli Neon sorgularına geçirir.

Görsel URL alanı `cover_image` veya `logo_image` sütununa yazılır. URL boşsa bu alan temizlenebilir. Uygulama görsel barındırma hizmeti kurmaz; mevcut CDN, Vercel veya başka bir barındırıcıdaki mutlak HTTPS URL’leri kullanılabilir.

## Hata ve güvenlik davranışı

- Tüm admin içerik istekleri imzalı çerez doğrulaması ister; başarısız istekler 401 döner.
- Hatalı tür veya doğrulama hataları 400 döner; veritabanı hataları sunucu ayrıntılarını ifşa etmeden 500 döner.
- İstemci API hatasını kullanıcıya kısa mesaj olarak gösterir.
- Giriş çerezi yalnızca HTTP üzerinden, `sameSite=lax` ile; üretimde `secure` olarak ayarlanır.

## Doğrulama

- API yardımcılarının oturum ve içerik türü doğrulaması için küçük birim testleri eklenir.
- Testler önce başarısız hâlde çalıştırılır, sonra uygulama kodu eklenir.
- Ardından lint, TypeScript derlemesi ve üretim derlemesi çalıştırılır.

## Gerekli ortam değişkenleri

- `DATABASE_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Bu geçiş Supabase ortam değişkenlerine ihtiyaç duymaz.
