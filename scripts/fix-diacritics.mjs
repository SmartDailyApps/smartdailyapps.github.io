import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const replacements = {
  de: [
    [/fuer/g, 'für'],
    [/loesen/g, 'lösen'],
    [/staerken/g, 'stärken'],
    [/Zuverlaessigkeit/g, 'Zuverlässigkeit'],
    [/Ueber uns/g, 'Über uns'],
    [/standardmaessig/g, 'standardmäßig'],
    [/Maerkte/g, 'Märkte'],
    [/Laendern/g, 'Ländern'],
    [/Regelmaessige/g, 'Regelmäßige'],
    [/Schaeden/g, 'Schäden'],
    [/zulaessig/g, 'zulässig'],
    [/missbraeuchlich/g, 'missbräuchlich'],
    [/persoenlichen/g, 'persönlichen'],
    [/Gewaehrleistung/g, 'Gewährleistung'],
    [/gewaehren/g, 'gewähren'],
    [/kuenftigen/g, 'künftigen'],
    [/koennen/g, 'können'],
    [/oeffnen/g, 'öffnen'],
    [/Produktivitaets/g, 'Produktivitäts']
  ],
  fr: [
    [/\bConcu\b/g, 'Conçu'],
    [/\bConcue\b/g, 'Conçue'],
    [/\bconcues\b/g, 'conçues'],
    [/\bDecouvrez\b/g, 'Découvrez'],
    [/\bcreons\b/g, 'créons'],
    [/\belegantes\b/g, 'élégantes'],
    [/\bresolvent\b/g, 'résolvent'],
    [/\bproblemes\b/g, 'problèmes']
  ],
  tr: [
    [/Gunluk hayatin/g, 'Günlük hayatın'],
    [/akilli uygulamalar/g, 'akıllı uygulamalar'],
    [/kolaylastiran/g, 'kolaylaştıran'],
    [/gelistirir/g, 'geliştirir'],
    [/Hakkimizda/g, 'Hakkımızda'],
    [/Iletisim/g, 'İletişim'],
    [/Ilham/g, 'İlham'],
    [/gelistiriyoruz/g, 'geliştiriyoruz'],
    [/gizliligi onceliklendiren/g, 'gizliliği önceliklendiren'],
    [/akilli mobil urunler/g, 'akıllı mobil ürünler'],
    [/kesfet/g, 'keşfet'],
    [/Uygulamalarimizi gor/g, 'Uygulamalarımızı gör'],
    [/bolumune kaydir/g, 'bölümüne kaydır'],
    [/Gizlilik Once/g, 'Gizlilik Önce'],
    [/cihaz-ici/g, 'cihaz-içi'],
    [/Cok Dilli/g, 'Çok Dilli'],
    [/Kuresel/g, 'Küresel'],
    [/kullanicilar icin/g, 'kullanıcılar için'],
    [/tasarlandi/g, 'tasarlandı'],
    [/Kullanici/g, 'Kullanıcı'],
    [/Gercek/g, 'Gerçek'],
    [/gelisir/g, 'gelişir'],
    [/portfoyumuz/g, 'portföyümüz'],
    [/Ozenle/g, 'Özenle'],
    [/tasarlanmis/g, 'tasarlanmış'],
    [/One Cikan Uygulama/g, 'Öne Çıkan Uygulama'],
    [/Canli fiyatlar/g, 'Canlı fiyatlar'],
    [/Guvenli ve ozel/g, 'Güvenli ve özel'],
    [/Akilli alarmlar/g, 'Akıllı alarmlar'],
    [/Yakinda/g, 'Yakında'],
    [/Gunluk rutinleri/g, 'Günlük rutinleri'],
    [/araclari/g, 'araçları'],
    [/Tutarlilik/g, 'Tutarlılık'],
    [/netlige/g, 'netliğe'],
    [/urunu/g, 'ürünü'],
    [/amacla/g, 'amaçla'],
    [/gelistirildi/g, 'geliştirildi'],
    [/insanlari/g, 'insanları'],
    [/guclendirmesi/g, 'güçlendirmesi'],
    [/gerektigine inaniyoruz/g, 'gerektiğine inanıyoruz'],
    [/cozen/g, 'çözen'],
    [/gunluk deger/g, 'günlük değer'],
    [/ureten/g, 'üreten'],
    [/ozellik/g, 'özellik'],
    [/guvenilirlik/g, 'güvenilirlik'],
    [/kullanici/g, 'kullanıcı'],
    [/odagiyla/g, 'odağıyla'],
    [/odakli/g, 'odaklı'],
    [/Almanyada/g, 'Almanya\'da'],
    [/ac<\/a>/g, 'aç</a>'],
    [/Gizlilik once/g, 'Gizlilik önce'],
    [/cihazinda kalir/g, 'cihazında kalır'],
    [/Hizli ve guvenilir/g, 'Hızlı ve güvenilir'],
    [/veri akisiyla/g, 'veri akışıyla'],
    [/erisim/g, 'erişim'],
    [/ulkede/g, 'ülkede'],
    [/kullanilan/g, 'kullanılan'],
    [/urunler/g, 'ürünler'],
    [/Surekli gelisiyor/g, 'Sürekli gelişiyor'],
    [/dayali duzenli guncellemeler/g, 'dayalı düzenli güncellemeler'],
    [/Hizli Baglantilar/g, 'Hızlı Bağlantılar'],
    [/Uygulamalarimiz/g, 'Uygulamalarımız'],
    [/Kullanim sartlari/g, 'Kullanım şartları'],
    [/Cerez Politikasi/g, 'Çerez Politikası']
  ]
};

// Also apply a few general es/it/pt if needed, but let's stick to the obvious ones for now.

function processDirectory(dir, loc) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath, loc);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      const rules = replacements[loc] || [];
      for (const [regex, replacement] of rules) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath.replace(repoRoot, '')}`);
      }
    }
  }
}

for (const loc of Object.keys(replacements)) {
  const locDir = path.join(repoRoot, loc);
  if (fs.existsSync(locDir)) {
    processDirectory(locDir, loc);
  }
}
