import { DailyCardPayload } from '../types';

export const FALLBACK_SOFTWARE: DailyCardPayload[] = [
  {
    tur: 'YAZILIM',
    baslik: 'CAP Teoremi (Consistency, Availability, Partition Tolerance)',
    alt_baslik: 'Dağıtık Sistemler & Veritabanı Mimarisi',
    ozet: 'Dağıtık bir veri sisteminin ağ bölünmesi (Partition) anında aynı anda hem tam Tutarlılık (Consistency) hem de %100 Erişilebilirlik (Availability) sunamayacağını kanıtlayan temel yasa.',
    detay: 'Eric Brewer tarafından ortaya konan teoreme göre, sunucular arasındaki ağ koptuğunda (P) mimar iki keskin tercihten birini yapmalıdır: Ya güncel olmayan veriyi dönme pahasına her isteğe yanıt verir (AP - ör. Cassandra, DynamoDB) ya da veri tutarsızlığını önlemek için düğümler senkronize olana dek yazma/okuma isteğini reddeder (CP - ör. geleneksel bankacılık sistemleri, etcd).',
    gunluk_gorev: '15 dakikalık odak süresinde bir e-ticaret uygulamasının "Sepete Ekle" servisi ile "Kredi Kartı Ödeme" servisini kağıt üzerinde karşılaştır: Hangisi AP, hangisi CP olmalı? Nedenleriyle 4 maddelik bir mimari şema çiz.',
    ipucu: 'Gerçek dünyada ağ bölünmesi (P) kaçınılmazdır; bu yüzden tasarım kararı aslında "CA" arasında değil, ağ koptuğu saniyede "CP mi yoksa AP mi?" sorusu arasındadır.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Idempotency (Eşkuvvetlilik İlkesi)',
    alt_baslik: 'API Tasarımı & Dağıtık Sistem Güvenilirliği',
    ozet: 'Bir işlemin veya API isteğinin bir kez yapılması ile arka arkaya defalarca tekrarlanması arasında sistemin son durumu açısından hiçbir fark olmaması özelliği.',
    detay: 'Mobil ağlarda kullanıcı "Ödeme Yap" butonuna bastığında yanıt yolda koparsa istemci isteği tekrar gönderir (retry). Eğer uç nokta idempotent değilse müşterinin kartından iki kez para çekilir. İstemcinin ürettiği benzersiz bir "Idempotency-Key" başlığı (header) sunucu tarafında Redis veya veritabanında kontrol edilerek mükerrer işlem engellenir.',
    gunluk_gorev: 'Kendi projelerinde kullandığın bir POST uç noktasını düşün. İstemci aynı isteği 3 saniye içinde 5 kez gönderirse ne olacağını analiz et ve "Idempotency-Key" ile çalışan 15 satırlık bir sözde-kod (pseudocode) tasarla.',
    ipucu: 'HTTP metodlarından GET, PUT ve DELETE doğası gereği idempotent iken; POST varsayılan olarak idempotent değildir ve özel koruma gerektirir.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Cache Locality (Bellek Yerelliği) & CPU Cache Lines',
    alt_baslik: 'Bilgisayar Mimarisi & Yüksek Performanslı Mühendislik',
    ozet: 'İşlemcinin RAM’den veri çekerken tek bir değişkeni değil, 64 byte’lık ardışık bir bellek bloğunu (Cache Line) L1/L2 önbelleğe taşıma prensibi.',
    detay: 'Modern işlemciler RAM’den çok daha hızlıdır; asıl darboğaz hesaplama değil verinin RAM’den CPU’ya gelmesidir. Verileri bellekte dağınık bağlı listeler (Linked List) yerine bitişik diziler (Array / Contiguous Memory) halinde tutmak, "Spatial Locality" (Mekansal Yerellik) sayesinde CPU’nun bir sonraki elemanı sıfır gecikmeyle L1 önbellekte hazır bulmasını sağlar.',
    gunluk_gorev: '15 dakika içinde "Row-major" (satır bazlı) ve "Column-major" (sütun bazlı) iki boyutlu bir matris taramasının CPU önbelleğinde neden 10 kata kadar hız farkı yarattığını kağıt üzerinde 64-byte bloklar çizerek görselleştir.',
    ipucu: 'Algoritmik olarak ikisi de O(N) olan iki koddan, bellekte ardışık (sequential) okuma yapan her zaman rastgele (pointer-chasing) okuma yapandan katbekat hızlıdır.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Bloom Filter (Olasılıksal Veri Yapısı)',
    alt_baslik: 'Algoritmalar & Büyük Veri Mühendisliği',
    ozet: 'Bir elemanın devasa bir kümede "kesinlikle olmadığını" veya "büyük ihtimalle olduğunu" çok küçük bir bit dizisi ve k adet hash fonksiyonuyla O(1) sürede söyleyen veri yapısı.',
    detay: 'Milyarlarca kayıtlık bir veritabanına pahalı bir disk sorgusu atmadan önce, sadece birkaç megabaytlık bir Bloom Filter’a sorulur. Eğer bitlerden biri bile 0 ise eleman kümede %100 yoktur (False Negative imkansızdır). Tüm bitler 1 ise eleman büyük ihtimalle vardır (küçük bir False Positive payı). Google Chrome zararlı URL kontrolünde ve veritabanı motorları (LSM-Tree) disk okumasını önlemekte bunu kullanır.',
    gunluk_gorev: 'Kağıda 10 kutucuklu bir bit dizisi (hepsi 0) çiz. İki hayali hash fonksiyonu belirleyip "nuans" ve "atelier" kelimelerini diziye ekle, ardından başka bir kelimenin kümede olup olmadığını bitlere bakarak test et.',
    ipucu: 'Standart bir Bloom Filter’dan eleman silemezsin; çünkü sıfırlayacağın bit başka bir elemanın da biti olabilir (bunun için Counting Bloom Filter kullanılır).'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Event Loop & Non-Blocking I/O Mimarisi',
    alt_baslik: 'Çalışma Zamanı (Runtime) & Eşzamanlılık',
    ozet: 'Tek iş parçacıklı (single-threaded) bir çalışma ortamının, ağ veya disk gibi yavaş G/Ç işlemlerini işletim sistemi çekirdeğine (epoll/kqueue) devrederek binlerce bağlantıyı kilitlenmeden yönetmesi.',
    detay: 'Her bağlantı için yeni bir işletim sistemi thread’i açmak (Thread-per-request) bellek ve bağlam değiştirme (Context Switch) maliyeti yaratır. Node.js, Nginx ve Redis gibi sistemler bunun yerine tek bir Event Loop döndürür: Call Stack boşaldıkça önce Microtask kuyruğunu (Promise), ardından Macrotask/Callback kuyruğunu (setTimeout, I/O) işler.',
    gunluk_gorev: 'Call Stack, Web/OS APIs, Microtask Queue ve Macrotask Queue kutularını kağıda çiz. İçinde hem setTimeout(..., 0) hem de Promise.resolve().then(...) bulunan bir kodun hangi sırayla ekrana çıktı vereceğini adım adım izle.',
    ipucu: 'Event Loop’un altın kuralı: Ana thread üzerinde asla uzun süren senkron bir CPU döngüsü çalıştırma; aksi halde tüm kuyruk (ve arayüz) donar.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Consistent Hashing (Tutarlı Özetleme)',
    alt_baslik: 'Yük Dengeleme & Dağıtık Önbellek Sistemleri',
    ozet: 'Sunucu sayısı değiştiğinde tüm önbellek anahtarlarının yeniden dağıtılmasını (re-hashing) önleyen, verileri ve sunucuları 0 ile 2^32-1 arasında sanal bir çember üzerine yerleştiren algoritma.',
    detay: 'Klasik `hash(key) % N` yönteminde N (sunucu sayısı) 4’ten 5’e çıktığında anahtarların %80’inin yeri değişir ve önbellek fırtınası (cache stampede) yaşanır. Consistent Hashing ise hem sunucuları hem verileri bir halka (Hash Ring) üzerine koyar; bir sunucu eklendiğinde veya çöktüğünde yalnızca komşusu olan `1/N` oranındaki veri yer değiştirir.',
    gunluk_gorev: 'Kağıda bir çember çizip üzerine S1, S2, S3 adlı üç sunucu yerleştir. Saat yönünde ilerleme kuralına göre 5 farklı kullanıcı verisinin hangi sunucuya düşeceğini ve S2 çöktüğünde sadece hangi verilerin S3’e kayacağını işaretle.',
    ipucu: 'Verilerin tek bir sunucuda yığılmasını önlemek için her fiziksel sunucu çember üzerinde birden fazla "Sanal Düğüm (Virtual Node)" ile temsil edilir.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Deadlock (Ölümcül Kilitlenme) & 4 Coffman Koşulu',
    alt_baslik: 'İşletim Sistemleri & Eşzamanlı Programlama',
    ozet: 'İki veya daha fazla iş parçacığının (thread/transaction) birbirinin elindeki kaynağı bırakmasını sonsuza dek beklemesi sonucu sistemin tamamen durması durumu.',
    detay: 'Edward G. Coffman’a göre bir Deadlock oluşması için şu 4 koşulun aynı anda gerçekleşmesi şarttır: 1) Karşılıklı Dışlama (Mutual Exclusion), 2) Tut ve Bekle (Hold and Wait), 3) Kesintiye Uğratılamama (No Preemption), 4) Döngüsel Bekleme (Circular Wait). Bu 4 direkten yalnızca birini mimari olarak yıkarsanız sistemde Deadlock oluşması matematiksel olarak imkansız hale gelir.',
    gunluk_gorev: 'İki banka hesabı (Hesap A ve Hesap B) arasında aynı anda karşılıklı havale yapan iki thread’in nasıl Deadlock’a gireceğini çiz ve "Kaynak Sıralaması (Lock Ordering)" yöntemiyle 4. koşulu (Circular Wait) nasıl kıracağını yaz.',
    ipucu: 'Tüm kilitleri (lock) her zaman küresel bir ID sırasına göre (ör. önce küçük ID’li hesap, sonra büyük ID’li hesap) almak döngüsel beklemeyi tamamen yok eder.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Zero-Copy & Bellek Haritalama (mmap / sendfile)',
    alt_baslik: 'Sistem Programlama & İşletim Sistemi Çekirdeği',
    ozet: 'Diskteki bir veriyi ağ soketine gönderirken veriyi çekirdek (Kernel) alanından kullanıcı (User Space) alanına gereksiz yere kopyalamadan doğrudan DMA üzerinden aktarma tekniği.',
    detay: 'Geleneksel `read()` ve `write()` çağrılarında veri diskten Kernel tamponuna, oradan uygulama belleğine (User Space), oradan tekrar Kernel soket tamponuna ve son olarak ağ kartına (NIC) kopyalanır (4 bağlam değişimi + 4 kopya). Kafka ve Nginx gibi ultra hızlı sistemler `sendfile` sistem çağrısıyla CPU’yu hiç yormadan veriyi doğrudan Kernel’dan ağ kartına aktarır.',
    gunluk_gorev: '15 dakikalık etütte kağıdı ortadan ikiye bölerek üst tarafa "User Space", alt tarafa "Kernel Space" yaz. Geleneksel dosya okuma/gönderme ile Zero-Copy arasındaki veri kopyalama oklarını çizerek karşılaştır.',
    ipucu: 'Yüksek hacimli veri akışlarında (streaming) veriyi uygulama katmanında değiştirmeyeceksen, onu User Space’e hiç çıkarma.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Dependency Inversion (Bağımlılıkların Tersine Çevrilmesi)',
    alt_baslik: 'Yazılım Mimarisi • SOLID Prensipleri & Clean Architecture',
    ozet: 'Üst seviye iş mantığı modüllerinin alt seviye altyapı detaylarına (veritabanı, dış API) doğrudan bağımlı olmaması; her ikisinin de soyutlamalara (Interface) bağlı olması ilkesi.',
    detay: 'Robert C. Martin’in tanımladığı bu prensip, mimarideki bağımlılık oklarının yönünü tersine çevirir. İş kuralları "Benim bir BildirimServisi arayüzüm var" der; bunun e-posta mı, SMS mi yoksa push bildirimi mi olduğu en dış katmanda (Runtime/DI Container) enjekte edilir. Böylece veritabanı veya üçüncü parti servis değiştiğinde çekirdek iş kodu tek satır bile değişmez.',
    gunluk_gorev: 'Bir sınıfta doğrudan `new GeminiService()` veya `fetch()` çağırmak yerine, araya bir `AIProvider` arayüzü (interface) koyarak bağımlılığı dışarıdan (Constructor Injection) alan temiz bir TypeScript yapısı kurgula.',
    ipucu: 'Bir sınıfın içinde somut bir altyapı sınıfını `new` anahtar kelimesiyle oluşturuyorsan, o sınıfı test etmek ve değiştirmek zorlaşacaktır.'
  },
  {
    tur: 'YAZILIM',
    baslik: 'Amortized Analysis (Amortize Karmaşıklık Analizi)',
    alt_baslik: 'Veri Yapıları & Algoritma Analizi',
    ozet: 'Dinamik diziler (Vector/ArrayList) gibi arada sırada pahalı O(N) işlem yapan veri yapılarının, uzun bir işlem dizisi boyunca ortalama maliyetinin aslında O(1) olduğunu gösteren analiz yöntemi.',
    detay: 'Bir dinamik dizi dolduğunda kapasitesini 2 katına çıkarır ve mevcut N elemanı yeni belleğe kopyalar. Tekil olarak bakıldığında bu adım O(N) sürer; ancak bu kopyalama yalnızca N eklemede bir gerçekleştiği için toplam maliyet N adıma bölündüğünde (amortize edildiğinde) ekleme başına sabit O(1) maliyet düşer.',
    gunluk_gorev: 'Kapasitesi 1’den başlayan ve her dolduğunda boyutunu 2’ye katlayan (1 -> 2 -> 4 -> 8) bir diziye 1’den 9’a kadar sayı eklerken kaç kez normal yazma, kaç kez kopyalama yapıldığını kağıt üzerinde topla.',
    ipucu: 'Kapasiteyi sabit bir sayı (+10) kadar artırmak O(N) ortalamaya yol açar; geometrik olarak (x2) artırmak ise O(1) amortize hızı garanti eder.'
  }
];

