# İnci Boya Tadilat

Üyeliksiz, mobil uyumlu boya fiyat hesaplama ve WhatsApp iletişim sitesi. Tamamen statik HTML/CSS/JavaScript; backend veya ücretli servis gerekmez.

## GitHub Pages ile yayınlama

1. GitHub'da `inci-boya-tadilat` isimli **Public** repository açın.
2. ZIP'i açıp `index.html`, `style.css`, `script.js`, `assets` klasörünü repository'nin **köküne** yükleyin. (ZIP dosyasını tek başına yüklemeyin.)
3. Repository > **Settings > Pages** bölümünde **Deploy from a branch**, `main` ve `/(root)` seçip **Save**'e tıklayın.
4. Yayın adresi genellikle `https://KULLANICI_ADINIZ.github.io/inci-boya-tadilat/` olur.

## Özelleştirme

`script.js` dosyasının başındaki `CONFIG` bölümünden:
- WhatsApp numarası (`905435475855`)
- Instagram adı (`inciboyatadilat` — henüz oluşturulmamış hesap için planlanan adres)
- 70 m² baz fiyat (`15000`)
- Tavan, renk değişimi, eşya ve tamirat ek bedelleri

değiştirilebilir. WhatsApp ve telefon numarası `index.html` içinde de yer alır; numara değişirse oradaki `tel:` ve `wa.me/` bağlantılarını da güncelleyin.

## Mevcut varsayımlar

- 70 m², 2+1, **boş**, **duvarlar iyi**, **benzer renk**, **tavan hariç**, **malzeme + işçilik** = **15.000 TL**.
- Ek kalemler demo amaçlı işletme tahminidir; gerçek maliyet ve kârlılık temelinde gözden geçirilmelidir.
- Fiyat, gerçek teklif değil otomatik tahmindir. Ağır onarım ve küf/rutubet işleri otomatik hesaba katılmaz, ayrıca keşif gerektirir.
- **Veri toplamaz, depolamaz.** Hesaplama tarayıcıda yapılır. WhatsApp'a tıklanınca özet dış uygulamaya aktarılır; mesajı kullanıcı onaylayarak gönderir.
- Instagram hesabı açılmadan link bulunamayan profil sayfasına gidebilir. Hesabı açınca kullanıcı adını doğrulayın.

## Yerel çalıştırma

`index.html` dosyasını çift tıklayarak açmanız yeterli. Alternatif: `python -m http.server 8000`.

## Dosyalar

- `index.html`: Site bölümleri ve 3 adımlı form
- `style.css`: Mobil uyumlu tasarım
- `script.js`: Fiyat hesaplaması ve WhatsApp mesajı
- `assets/favicon.svg`: Basit logo ikonu

Bu proje GitHub Pages üzerinden çalışır; otomatik e-posta/WhatsApp göndermez, ödeme almaz ve müşteri kaydı tutmaz.
