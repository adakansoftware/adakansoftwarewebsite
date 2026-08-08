# Supabase kurulumu

1. Supabase projesinde **SQL Editor** açın.
2. `schema.sql` dosyasının tamamını çalıştırın.
3. **Authentication → Users** bölümünden yönetici e-posta/şifre kullanıcısını oluşturun.
4. Siteyi yeniden başlattıktan sonra `/admin/login` üzerinden bu kullanıcıyla giriş yapın.

Şema; `projects`, `logo_works` tablolarını, `portfolio-assets` görsel alanını ve yayınlanmış içerikler için herkese açık okuma kurallarını oluşturur. Yazma ve görsel yükleme işlemleri yalnızca oturum açmış kullanıcılar içindir.
