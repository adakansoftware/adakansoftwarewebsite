# Yönetici İletişim Merkezi İyileştirmeleri

## Amaç

Yönetici iletişim merkezini, gelen talepleri inceleme ve takip etme açısından daha anlaşılır hâle getirmek; ziyaretçi iletişim formunun teslimat sonucunu da daha net bildirmek.

## Kapsam

Beş bağımsız ve geriye dönük uyumlu değişiklik uygulanacaktır:

1. İletişim-talep API'si yalnızca arayüzün kullandığı alanları döndürür ve yanıtı kararlı bir sıralamayla sunar.
2. Yönetici gelen kutusuna ad, e-posta ve mesaj üzerinden istemci taraflı arama eklenir.
3. Talep durumları erişilebilir, yerelleştirilmiş rozetlerle gösterilir.
4. Gelen kutusu için yükleniyor, boş sonuç ve hata durumları açıkça gösterilir.
5. Ziyaretçi iletişim formu kuyrukta bekleyen teslimatlar ile kesin teslimat sonuçlarını ayırt eder.

## Mimari

Sunucu tarafında route handler, SQL satırlarını açık bir DTO'ya dönüştürür; böylece veritabanı şemasındaki dahili alanlar istemciye sızmaz. Yönetici ekranındaki mevcut istemci bileşeni, bu DTO'ları bir kez yükler ve türetilmiş filtrelenmiş listeyi görüntüler. Form, mevcut `/api/contact` sözleşmesindeki `deliveryPending` alanını kullanıcı dostu mesajlara dönüştürür; yeni endpoint ya da tablo gerekmez.

## Hata ve Erişilebilirlik

Arama alanı etiketli olur. Dinamik sonuç sayısı ve gönderim sonucu `aria-live` ile duyurulur. Ağ hatası, önceki kayıtları silmeden yeniden deneme eylemi sunar. API, yetkilendirme ve aynı-origin kontrollerini değiştirmez.

## Test Stratejisi

DTO dönüşümü ve filtreleme saf fonksiyonlar olarak test edilir. Mevcut Node test düzenine yeni test dosyaları eklenir; testler önce başarısız olacak, sonra en küçük uygulama ile yeşile dönecektir. Son doğrulamada yönetici güvenlik testleri, linter ve üretim derlemesi çalıştırılır.
