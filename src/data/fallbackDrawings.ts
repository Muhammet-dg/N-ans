import { DailyCardPayload } from '../types';
import { FALLBACK_WORDS } from './fallbackWords';

export const FALLBACK_DRAWINGS: DailyCardPayload[] = [
  {
    tur: 'CIZIM',
    baslik: 'Kontur Tarama (Cross-Contour Hatching)',
    alt_baslik: 'Hacim ve Topografya • Kurşun Kalem Tekniği',
    ozet: 'Düz çizgiler yerine nesnenin üç boyutlu yüzey kıvrımlarını saran eğrisel tarama çizgileriyle kağıt üzerinde heykelsi bir derinlik yaratma tekniği.',
    detay: 'Klasik paralel tarama yalnızca ton (ışık-gölge) verirken, kontur tarama izleyiciye nesnenin kesitini ve kütle yönünü hissettirir. Albrecht Dürer ve Rönesans ustalarının gravürlerinde kullandığı bu yöntem, çizginin kavisiyle formun şişkinliğini veya çukurluğunu doğrudan anlatır.',
    gunluk_gorev: 'Masanın üzerindeki bir kupayı, elmayı veya kendi başparmağını seç. Dış hatlarını hafifçe çizdikten sonra, gölgeleme için düz çizgiler kullanmadan sadece yüzeyin etrafını saran enine ve boyuna yaylarla 12 dakikalık bir hacim eskizi yap.',
    ipucu: 'Kalemi kağıda bastırma şiddetini (çizgi ağırlığını) gölgeye girerken artırıp ışığa çıkarken tüy gibi hafifleterek geçişi yumuşat.'
  },
  {
    tur: 'CIZIM',
    baslik: 'Negatif Alan İllüzyonu (Negative Space)',
    alt_baslik: 'Algısal Çizim & Kompozisyon • Göz-Zihin Egzersizi',
    ozet: 'Çizilecek nesnenin kendisini değil, nesnenin etrafında ve boşluklarında kalan havayı/arka plan formlarını çizerek doğru oran yakalama yöntemi.',
    detay: 'Sol beyin bir "sandalye" veya "el" gördüğünde gerçekte olanı değil, hafızasındaki sembolik şablonu çizmeye çalışır. Nesnenin içini bırakıp kolların arasındaki üçgen boşlukları veya bacakların arasındaki yamuk alanları çizdiğinde, zihin sembolleri unutur ve saf geometrik oranları kusursuz kopyalar.',
    gunluk_gorev: 'Bir makas, gözlük veya bitki yaprağını önüne koy. Nesnenin kendisine tek bir çizgi bile atmadan, yalnızca içindeki ve etrafındaki boşlukları koyu kurşun kalemle tarayarak nesnenin beyaz silüetini 10 dakikada ortaya çıkar.',
    ipucu: 'Bir gözünü hafifçe kısarak bakmak, nesnenin detaylarını silikleştirip pozitif-negatif alan kontrastını netleştirir.'
  },
  {
    tur: 'CIZIM',
    baslik: 'Chiaroscuro & Kayıp Kenarlar (Lost Edges)',
    alt_baslik: 'Işık-Gölge Dramaturjisi • Değer (Value) Çalışması',
    ozet: 'Güçlü ışık ve derin gölge kontrastı kurarken, nesnenin gölgede kalan dış sınırlarını arka planla kaynaştırarak atmosferik derinlik üretme sanatı.',
    detay: 'Acemi çizimlerde nesnenin her yeri keskin bir dış çizgiyle (outline) çevrilidir. Oysa gerçek dünyada ışık bir yönden vurduğunda bazı kenarlar keskinleşir (bulunan kenar), gölge tarafındaki sınırlar ise ortam karanlığı içinde eriyip kaybolur (kayıp kenar). Leonardo da Vinci ve Caravaggio’nun sırrı bu geçiştedir.',
    gunluk_gorev: 'Tek bir ışık kaynağı altında duran basit bir nesneyi (ör. anahtarlık, şişe veya katlanmış kumaş) 15 dakikada çiz. Işık alan sınırı jilet gibi net bırakırken, gölge düşen kenarı parmağınla veya yumuşak taramayla arka plan gölgesine tamamen karıştır.',
    ipucu: 'En koyu tonunu (2B/4B kalemle) sadece nesnenin zemine temas ettiği "oklüzyon gölgesi" noktasına sakla.'
  },
  {
    tur: 'CIZIM',
    baslik: 'Kör Kontur (Blind Contour) Akışı',
    alt_baslik: 'Göz-El Koordinasyonu • Ekspresif Çizgi',
    ozet: 'Kağıda hiç bakmadan ve kalemi kağıttan hiç kaldırmadan, gözün nesne üzerindeki gezintisini kesintisiz tek bir çizgiyle kaydetme disiplini.',
    detay: 'Kimon Nicolaides’in "The Natural Way to Draw" eserinde temel taş olarak sunduğu bu pratik, sonuç odaklı mükemmelliyetçiliği yıkar. Göz nesnenin kenarında milim milim ilerlerken, el aynı hızda hareket eder; ortaya çıkan hafif çarpık ama son derece canlı çizgiler gerçek görme duyusunu açar.',
    gunluk_gorev: 'Sol elini (veya masadaki karmaşık bir objeyi) model olarak al. Kağıda bakmamak üzere kendine söz ver ve 8 dakika boyunca kalemi hiç kaldırmadan tüm kıvrımları, kırışıklıkları tek bir sürekli çizgiyle takip et.',
    ipucu: 'Hızlı çizme; gözün nesnenin kenarında bir karınca hızıyla ilerlesin, kalemin de tam o ritme eşlik etsin.'
  },
  {
    tur: 'CIZIM',
    baslik: 'Geometrik Form Basitleştirme (Constructive Anatomy)',
    alt_baslik: 'Yapısal Eskiz • Perspektif ve Kütle',
    ozet: 'En karmaşık organik veya mekanik nesneleri küp, silindir, küre ve koni gibi temel 3B yapı taşlarına indirgeyerek sağlam bir iskelet kurma tekniği.',
    detay: 'Detaylar (doku, gölge, kıvrım) ancak doğru bir perspektif kutusunun üzerine oturduğunda inandırıcı olur. Endüstriyel tasarımcılar ve klasik figür çizerleri, nesneyi önce şeffaf bir tel kafes (wireframe) gibi görerek görünmeyen arka köşelerini bile hafifçe inşa eder.',
    gunluk_gorev: 'Oda içindeki bir koltuğu, ayakkabıyı veya masa lambasını seç. Hiçbir süsleme veya gölge yapmadan, sadece birbirinin içine geçen şeffaf kutular, silindirler ve merkez eksen çizgileriyle 12 dakikalık bir "röntgen" inşası çiz.',
    ipucu: 'İlk aşamada kalemi çok geriden (ortasından) tutarak bilekten değil omuzdan gelen hafif, hayaletimsi çizgiler kullan.'
  }
];

export const ALL_FALLBACK_CARDS: DailyCardPayload[] = [
  ...FALLBACK_WORDS,
  ...FALLBACK_DRAWINGS
];
