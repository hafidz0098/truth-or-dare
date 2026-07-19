import type { Category, DareCard, Difficulty, GameMode, TruthCard } from "@/types";
import { COUPLE_CATEGORIES } from "@/types";

/** Generic modes — tidak termasuk couple/family agar konten spesifik mode tidak "bocor" */
const ALL_MODES: GameMode[] = ["classic", "party", "extreme", "chaos"];
const PARTY_MODES: GameMode[] = ["classic", "party", "chaos", "extreme"];
const COUPLE_MODES: GameMode[] = ["couple"];
const COUPLE_AND_CLASSIC: GameMode[] = ["couple", "classic", "chaos"];
const FAMILY_MODES: GameMode[] = ["family", "classic", "party"];
const EXTREME_MODES: GameMode[] = ["extreme", "chaos", "party"];

/** Kategori yang diizinkan per mode (null = semua non-restricted) */
const MODE_CATEGORIES: Record<GameMode, Category[] | null> = {
  classic: ["funny", "friends", "school", "office", "deep", "romance", "random", "family"],
  party: ["funny", "friends", "school", "office", "random", "romance"],
  // Couple: sub-kategori sendiri — tidak pakai school/office/dll
  couple: [...COUPLE_CATEGORIES],
  family: ["family", "funny", "friends", "school", "random"],
  extreme: ["deep", "adult", "romance", "friends", "funny", "random"],
  chaos: null, // campur semua (kecuali adult tanpa flag)
};

function coupleCategoryFor(index: number): Category {
  return COUPLE_CATEGORIES[index % COUPLE_CATEGORIES.length];
}

/** Map legacy "romance" couple seeds → sub-kategori couple */
function assignCoupleCategory(text: string, fallbackIndex: number): Category {
  const t = text.toLowerCase();
  if (
    /saling kenal|berdua|orang di seberang|partner bicara|dua orang|kalian berdua|tukar cerita|buka diri|saling buka|saling percaya|kenalan lebih|lebih dekat|siapa kamu sebenarnya|cerita bareng|tanya balik|giliran dia|orang di depanmu|yang lagi kamu ajak bicara/.test(
      t
    )
  ) {
    return "bond";
  }
  if (
    /mengenal|lebih dalam|nilai hidup|masa kecil|keluarga|mimpi|takut|rahasia|percaya|masa depan|siapa dia|dalam hatimu|emotional|luka|trauma|tumbuh|prioritas hidup|arti cinta|kenangan|impian|kecewa|bahagia|sendiri|kesepian|jati diri|karakter|kepribadian|paling penting|paling rindu|paling bangga|paling takut|apa yang dia|kalau dia tahu|yang jarang orang tahu|soft spot|luka lama|healing|keamanan|rentan|vulnerable/.test(
      t
    )
  ) {
    return "know";
  }
  if (
    /green flag|red flag|dealbreaker|ghosting|mundur|toxic|boundary|serius|husband|wife material/.test(
      t
    )
  ) {
    return "flags";
  }
  if (
    /kencan|first date|date|hangout|nonton bareng|split|bayar|jemput|cafe|restoran|outfit|film|budget|plan.*kencan|menu/.test(
      t
    )
  ) {
    return "date";
  }
  if (
    /chat|flirt|ig|nomor|sticker|emoji|good morning|opening|pickup|bales|voice|story|text|pujian|compliment|wingman/.test(
      t
    )
  ) {
    return "flirt";
  }
  if (
    /crush|naksir|friendzone|suka|ketertarikan|tembak|confess|pdkt|tanda|pure-pure|simpan chat|ditolak|nolak/.test(
      t
    )
  ) {
    return "crush";
  }
  return coupleCategoryFor(fallbackIndex);
}

function t(
  id: string,
  text: string,
  category: Category,
  modes: GameMode[],
  intensity: 1 | 2 | 3 | 4 | 5 = 2
): TruthCard {
  return { id, text, category, modes, intensity };
}

function d(
  id: string,
  text: string,
  category: Category,
  modes: GameMode[],
  difficulty: Difficulty,
  xp = 20,
  coins = 10
): DareCard {
  const mult =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : difficulty === "hard" ? 2.5 : 4;
  return {
    id,
    text,
    category,
    modes,
    difficulty,
    xpReward: Math.round(xp * mult),
    coinReward: Math.round(coins * mult),
  };
}

// ─── Seed templates expanded programmatically to 1000+ each ───

const TRUTH_SEEDS: Array<[string, Category, GameMode[], 1 | 2 | 3 | 4 | 5]> = [
  // Funny
  ["Apa kebiasaan teraneh yang kamu lakukan saat sendirian?", "funny", ALL_MODES, 1],
  ["Kapan terakhir kali kamu tertawa sampai nangis, dan kenapa?", "funny", ALL_MODES, 1],
  ["Apa meme favoritmu saat ini?", "funny", PARTY_MODES, 1],
  ["Kalau jadi hewan, kamu jadi apa dan kenapa?", "funny", FAMILY_MODES, 1],
  ["Apa tarian paling konyol yang pernah kamu lakukan?", "funny", PARTY_MODES, 1],
  ["Ceritakan momen paling awkward di toilet umum.", "funny", PARTY_MODES, 2],
  ["Apa lagu yang selalu bikin kamu cringe tapi diam-diam suka?", "funny", ALL_MODES, 1],
  ["Pernah ngomong sendiri di depan orang? Ceritakan!", "funny", ALL_MODES, 1],
  ["Apa filter Instagram/TikTok paling memalukan yang pernah kamu pakai?", "funny", PARTY_MODES, 1],
  ["Kalau hidupmu jadi film komedi, judulnya apa?", "funny", ALL_MODES, 1],
  ["Siapa di sini yang paling mirip karakter kartun? Kenapa?", "funny", PARTY_MODES, 1],
  ["Apa makanan yang kamu pura-pura suka biar kelihatan keren?", "funny", ALL_MODES, 2],
  ["Pernah salah kirim chat? Ke siapa dan isinya apa?", "funny", PARTY_MODES, 2],
  ["Apa julukan paling aneh yang pernah kamu dapat?", "funny", ALL_MODES, 1],
  ["Ceritakan mimpi paling absurd yang pernah kamu alami.", "funny", ALL_MODES, 1],
  ["Kalau bisa ganti nama seharian, mau nama apa?", "funny", FAMILY_MODES, 1],
  ["Apa suara yang selalu bikin kamu ketawa?", "funny", FAMILY_MODES, 1],
  ["Pernah ketiduran di tempat aneh? Di mana?", "funny", PARTY_MODES, 1],
  ["Apa hal paling random yang ada di tas/saku kamu sekarang?", "funny", ALL_MODES, 1],
  ["Kalau jadi superhero, power-mu apa yang konyol?", "funny", FAMILY_MODES, 1],

  // Romance / Couple — bahasa gampang / simple
  ["Orang kayak apa yang bikin kamu suka?", "romance", COUPLE_MODES, 1],
  ["Sifat baik apa yang kamu cari di pacar?", "romance", COUPLE_MODES, 1],
  ["Sifat jelek apa yang bikin kamu kabur dari crush?", "romance", COUPLE_MODES, 2],
  ["Kencan pertama enak di mana? Cafe, jalan, makan, atau nonton?", "romance", COUPLE_MODES, 1],
  ["Kamu suka dikejar pelan, atau yang langsung jujur suka?", "romance", COUPLE_MODES, 2],
  ["Lebih suka chat dulu lama, atau langsung ketemu?", "romance", COUPLE_AND_CLASSIC, 1],
  ["Pernah suka diam-diam berapa lama?", "romance", COUPLE_MODES, 1],
  ["Gimana cara kamu nunjukin suka tanpa bilang 'suka'?", "romance", COUPLE_MODES, 2],
  ["Lagu apa yang kepikiran pas lagi naksir?", "romance", COUPLE_MODES, 1],
  ["Kalau crush bales chat 1 hari sekali, kamu oke atau males?", "romance", COUPLE_MODES, 2],
  ["Ide kencan murah tapi enak apa?", "romance", COUPLE_MODES, 1],
  ["Kamu lebih suka orang lucu, pinter, atau yang perhatian?", "romance", COUPLE_MODES, 1],
  ["Pernah ditolak atau nolak orang? Cerita dikit (tanpa nama).", "romance", COUPLE_MODES, 2],
  ["Hal apa yang bikin kamu gak mau pacaran sama orang itu?", "romance", COUPLE_MODES, 3],
  ["Pas lagi deketin orang, chat berapa kali sehari yang enak?", "romance", COUPLE_MODES, 1],
  ["Kapan kamu ngerasa 'wah, aku suka banget'?", "romance", COUPLE_MODES, 2],
  ["Lebih suka pacar sehobi, atau beda hobi?", "romance", COUPLE_MODES, 1],
  ["Tempat kencan pertama impianmu di mana? (yang sopan ya)", "romance", COUPLE_MODES, 2],
  ["Pernah pakai app cari jodoh? Seru gak?", "romance", COUPLE_MODES, 2],
  ["Pujian crush yang bikin kamu senyum-senyum apa?", "romance", COUPLE_MODES, 1],
  ["Di room ini, kira-kira kamu suka siapa? (boleh tebak aja)", "romance", COUPLE_MODES, 3],
  ["Tanda orang suka kamu, yang gampang kamu lihat apa?", "romance", COUPLE_MODES, 2],
  ["Tanda kamu lagi naksir, yang susah disembunyiin apa?", "romance", COUPLE_MODES, 2],
  ["Lebih takut jadi temenan aja, atau takut kecewa habis jadian?", "romance", COUPLE_MODES, 2],
  ["Kamu lebih suka dipuji, di-chat, dipegang tangan, atau dikasih hadiah?", "romance", COUPLE_MODES, 1],
  ["Kencan pertama jelek — masih mau ketemu lagi gak?", "romance", COUPLE_MODES, 2],
  ["Film bareng crush: lucu, action, atau horor?", "romance", COUPLE_MODES, 1],
  ["Dia tiba-tiba video call — kamu panik atau senang?", "romance", COUPLE_MODES, 1],
  ["Baju yang bikin kamu pede ketemu crush style apa?", "romance", COUPLE_MODES, 1],
  ["Pernah simpan chat crush lama biar dibaca lagi?", "romance", COUPLE_MODES, 2],
  ["Apa yang bikin kamu yakin 'ini orangnya'?", "romance", COUPLE_MODES, 3],
  ["Lebih oke jauh dulu, atau harus deket dari awal?", "romance", COUPLE_MODES, 2],
  ["Umur berapa kamu mau pacaran serius?", "romance", COUPLE_MODES, 2],
  ["Temen deket suka orang yang sama — mundur atau saingan?", "romance", COUPLE_MODES, 3],
  ["Cara manis minta nomor / IG orang gimana?", "romance", COUPLE_MODES, 1],
  ["Artis atau karakter film yang tipe kamu siapa?", "romance", COUPLE_MODES, 1],
  ["Crush lagi sedih — kamu ngapain dulu?", "romance", COUPLE_MODES, 2],
  ["Lebih suka kencan kejutan, atau yang udah direncana?", "romance", COUPLE_MODES, 1],
  ["Pernah pura-pura gak suka padahal suka? Kenapa?", "romance", COUPLE_MODES, 2],
  ["Hal kecil apa yang bikin kamu tiba-tiba suka orang?", "romance", COUPLE_MODES, 1],
  ["Hal kecil apa yang bikin rasa suka hilang?", "romance", COUPLE_MODES, 2],
  ["Pilih: ganteng/cantik, atau sikap bagus?", "romance", COUPLE_MODES, 1],
  ["Dari kenal sampe jadian, biasanya berapa lama?", "romance", COUPLE_MODES, 2],
  ["Pernah nulis chat panjang ke crush terus dihapus?", "romance", COUPLE_MODES, 1],
  ["Pas kencan, kamu yang bayar, patungan, atau terserah?", "romance", COUPLE_MODES, 2],
  ["Tempat ketemu pertama yang gak canggung di mana?", "romance", COUPLE_MODES, 1],
  ["Dia sering liat story kamu — lagi gombal atau kebetulan?", "romance", COUPLE_MODES, 1],
  ["Satu pertanyaan yang selalu kamu tanya pas baru kenal orang?", "romance", COUPLE_MODES, 2],
  ["Suka pelan-pelan, atau cepat jatuh cinta?", "romance", COUPLE_MODES, 1],
  ["Pelajaran dari crush dulu yang masih kamu ingat?", "romance", COUPLE_MODES, 3],
  ["Dia ajak ketemu keluarga cepet banget — kamu gimana?", "romance", COUPLE_MODES, 2],
  ["Emoji / stiker yang sering kamu kirim pas lagi gombal?", "romance", COUPLE_MODES, 1],
  ["Siapa di sini yang jago bantu nembak?", "romance", COUPLE_MODES, 1],
  ["Mau ditembak di depan orang, atau di chat aja?", "romance", COUPLE_MODES, 2],
  ["Mimpi kencan gila yang belum pernah dicoba?", "romance", COUPLE_MODES, 2],
  ["Lebih suka orang jago masak, jago dengerin, atau jago bikin ketawa?", "romance", COUPLE_MODES, 1],
  ["Pernah dikira cuma temen padahal kamu suka? Cerita dikit.", "romance", COUPLE_MODES, 2],
  ["Aturan kamu di dating: misal chat malam, ex, dll — apa?", "romance", COUPLE_MODES, 2],
  ["Kalau crush main game ini, pertanyaan apa yang kamu takut jawab?", "romance", COUPLE_MODES, 3],
  ["Chat 'selamat pagi' yang bikin kamu senyum seharian kayak apa?", "romance", COUPLE_MODES, 1],
  ["Lebih suka pacar yang ambisius, atau yang santai?", "romance", COUPLE_MODES, 1],
  ["Dia hilang 3 hari — kamu chat duluan atau nunggu?", "romance", COUPLE_MODES, 2],
  ["Bohong kecil di dating — pernah gak?", "romance", COUPLE_MODES, 3],
  ["Lagu-lagu pas lagi naksir genre apa?", "romance", COUPLE_MODES, 1],
  ["Kalau harus bilang suka ke orang di room malam ini, berani gak?", "romance", COUPLE_MODES, 3],
  ["Buat kamu, pacaran 'serius' artinya apa?", "romance", COUPLE_MODES, 2],
  ["Kencan pertama: dijemput, atau ketemu di tempat?", "romance", COUPLE_MODES, 1],
  ["Orang yang cocok buat jadi pasangan seumur hidup itu kayak apa?", "romance", COUPLE_MODES, 2],
  ["Dia nanya 'kamu suka gak?' terlalu cepet — kamu gimana?", "romance", COUPLE_MODES, 2],
  ["Camilan / minuman enak buat bareng kencan apa?", "romance", COUPLE_MODES, 1],
  ["Pernah suka sama temen deket? Habis itu gimana?", "romance", COUPLE_MODES, 2],
  ["Hal apa yang bikin kamu ngerasa spesial pas baru kenal orang?", "romance", COUPLE_MODES, 2],

  // Couple — Kenal Crush (Deep) — bahasa gampang
  ["Apa yang paling ingin kamu tanya ke crush, tapi belum berani?", "know", COUPLE_MODES, 3],
  ["Kalau crush bisa baca pikiranmu, apa yang paling malu?", "know", COUPLE_MODES, 3],
  ["Hal penting apa yang harus sama antara kamu dan crush?", "know", COUPLE_MODES, 3],
  ["Takut apa kalau pacaran sama crush?", "know", COUPLE_MODES, 4],
  ["5 tahun lagi, kamu mau crush ada di mana di hidupmu?", "know", COUPLE_MODES, 3],
  ["Cerita 1 sedih dulu yang bikin kamu hati-hati suka orang.", "know", COUPLE_MODES, 4],
  ["Apa yang bikin kamu tenang di deket orang yang kamu suka?", "know", COUPLE_MODES, 3],
  ["Kalau crush nanya 'kenapa kamu suka aku?', kamu jawab apa?", "know", COUPLE_MODES, 3],
  ["Sifat crush mana yang ingin kamu kenal lebih dalam?", "know", COUPLE_MODES, 2],
  ["Cara kamu suka orang — apa yang jarang orang tahu?", "know", COUPLE_MODES, 3],
  ["Kapan terakhir kamu ngerasa ada yang ngerti kamu banget?", "know", COUPLE_MODES, 3],
  ["Crush lagi sedih — cara bantu yang paling tulus menurutmu?", "know", COUPLE_MODES, 2],
  ["1 rahasia kecil tentang kamu yang mau dibuka ke crush.", "know", COUPLE_MODES, 4],
  ["Setia buat kamu artinya apa? (bukan cuma gak selingkuh)", "know", COUPLE_MODES, 3],
  ["Keluarga / masa kecil bikin standar crush-mu jadi kayak gimana?", "know", COUPLE_MODES, 3],
  ["Hal di dirimu yang kamu takut crush gak suka kalau dia tahu?", "know", COUPLE_MODES, 4],
  ["Jujur: kamu suka orangnya, atau cuma takut sendirian?", "know", COUPLE_MODES, 4],
  ["Kenapa crush ini terasa beda dari crush dulu?", "know", COUPLE_MODES, 3],
  ["Hal penting di hidupmu yang gak boleh dikorbankan demi pacaran?", "know", COUPLE_MODES, 3],
  ["Gimana kamu nunjukin peduli yang beneran, bukan cuma gombal?", "know", COUPLE_MODES, 2],
  ["Crush bilang butuh space — di hati kamu ngerasa apa?", "know", COUPLE_MODES, 3],
  ["1 pertanyaan serius yang ingin kamu tanya ke crush.", "know", COUPLE_MODES, 2],
  ["Dari naksir crush ini, kamu belajar apa tentang dirimu?", "know", COUPLE_MODES, 3],
  ["Titik lemah hatimu yang cuma orang deket boleh tahu?", "know", COUPLE_MODES, 3],
  ["Kalau gak jadi sama crush, apa yang tetap kamu syukuri?", "know", COUPLE_MODES, 3],
  ["'Kenal banget' itu butuh berapa lama? Tandanya apa?", "know", COUPLE_MODES, 2],
  ["Cerita momen crush bikin kamu ngerasa benar-benar dilihat.", "know", COUPLE_MODES, 3],
  ["Apa yang kamu butuh biar berani lebih jujur ke crush?", "know", COUPLE_MODES, 3],
  ["Crush nanya mimpi terbesar kamu — jawab jujur apa?", "know", COUPLE_MODES, 2],
  ["Yang paling bikin kangen (bukan fisik) dari crush apa?", "know", COUPLE_MODES, 3],
  ["Agama / aturan keluarga cocok — seberapa penting buat kamu?", "know", COUPLE_MODES, 3],
  ["Pernah ngebayangin crush lebih bagus dari aslinya? Di bagian mana?", "know", COUPLE_MODES, 4],
  ["Crush punya masa lalu berat — kamu siap dengerin gak?", "know", COUPLE_MODES, 3],
  ["Apa yang bikin kamu ngerasa dicintai beneran, bukan cuma di-chat?", "know", COUPLE_MODES, 3],
  ["1 kebiasaan kamu yang ingin crush ngerti.", "know", COUPLE_MODES, 3],
  ["Pilih: kenal dulu dalam, atau jadian dulu baru kenal dalam?", "know", COUPLE_MODES, 2],
  ["Apa yang kamu takut disalah-pahamin tentang niatmu ke crush?", "know", COUPLE_MODES, 3],
  ["Versi terbaik kamu yang ingin crush lihat kayak apa?", "know", COUPLE_MODES, 2],
  ["Crush nanya 'kamu takut apa di pacaran?' — jawab apa?", "know", COUPLE_MODES, 4],
  ["1 kenangan kecil yang bikin kamu yakin suka dia.", "know", COUPLE_MODES, 2],
  ["Gimana kamu tetep jadi diri sendiri pas lagi naksir?", "know", COUPLE_MODES, 3],
  ["'Rumah' di hati buat kamu artinya apa?", "know", COUPLE_MODES, 4],
  ["Crush jadi sibuk / dingin — sabar kamu sampe mana?", "know", COUPLE_MODES, 3],
  ["1 pertanyaan biar kalian berdua lebih kenal malam ini.", "know", COUPLE_MODES, 2],
  ["Jujur: apa yang masih kamu sembunyiin dari crush?", "know", COUPLE_MODES, 4],
  ["Crush bilang 'belum siap' — cara baik kamu jawab gimana?", "know", COUPLE_MODES, 3],
  ["Versi dirimu yang bikin bangga kalau crush kenal versi itu?", "know", COUPLE_MODES, 2],
  ["Doa / harapan diam-diam soal crush apa?", "know", COUPLE_MODES, 3],
  ["Lebih penting tenang bareng, atau rasa kupu-kupu di perut?", "know", COUPLE_MODES, 3],
  ["Cuma boleh tahu 3 hal dalam tentang crush — pilih apa aja?", "know", COUPLE_MODES, 2],

  // Couple — Saling Kenal (2 orang) — bahasa gampang
  ["1 hal tentang kamu yang jarang dicerita pas baru kenal.", "bond", COUPLE_MODES, 2],
  ["Apa yang bikin kamu nyaman cerita ke orang?", "bond", COUPLE_MODES, 2],
  ["Orang di depanmu boleh tanya apa aja (yang sopan). Topik apa yang siap kamu jawab jujur?", "bond", COUPLE_MODES, 2],
  ["Cerita 1 momen kecil pas kecil yang masih nempel sampe sekarang.", "bond", COUPLE_MODES, 3],
  ["Orang sering salah sangka apa tentang kamu pas baru kenal?", "bond", COUPLE_MODES, 2],
  ["Aturan hidup apa yang paling kamu pegang?", "bond", COUPLE_MODES, 3],
  ["Kapan terakhir ada yang beneran dengerin kamu?", "bond", COUPLE_MODES, 3],
  ["Kamu itu siapa, dalam 3 kata? Lalu jelasin 1 kata.", "bond", COUPLE_MODES, 2],
  ["Takut apa pas mau buka diri ke orang baru?", "bond", COUPLE_MODES, 3],
  ["Mimpi yang jarang dicerita ke orang — boleh bilang di sini.", "bond", COUPLE_MODES, 3],
  ["Tanda orang layak dideketin lebih dalam, buat kamu apa?", "bond", COUPLE_MODES, 3],
  ["Cerita 1 hari yang bikin cara pikir kamu berubah (singkat aja).", "bond", COUPLE_MODES, 3],
  ["Lagi susah: butuh solusi, pelukan, atau cuma didengerin?", "bond", COUPLE_MODES, 2],
  ["1 kebiasaan kecil yang nunjukin kamu orangnya kayak apa?", "bond", COUPLE_MODES, 1],
  ["Bedanya 'temen deket' sama 'orang spesial' buat kamu apa?", "bond", COUPLE_MODES, 2],
  ["Hal baik di dirimu tahun ini yang kamu syukuri?", "bond", COUPLE_MODES, 2],
  ["Kalau orang di depanmu ingat 1 hal tentang kamu, mau diingat yang mana?", "bond", COUPLE_MODES, 2],
  ["Pernah menjauh padahal ingin deket? Kenapa?", "bond", COUPLE_MODES, 3],
  ["Topik serius favorit buat dibahas bareng orang yang lagi kamu kenalin?", "bond", COUPLE_MODES, 2],
  ["Apa yang bikin ngobrol berdua ngerasa aman?", "bond", COUPLE_MODES, 2],
  ["1 luka kecil yang bikin kamu hati-hati percaya orang.", "bond", COUPLE_MODES, 4],
  ["Kalau hidup diulang, bagian dirimu mana yang tetap kamu bawa?", "bond", COUPLE_MODES, 3],
  ["Gimana bilang 'aku butuh waktu' tanpa nutup chat total?", "bond", COUPLE_MODES, 3],
  ["Siapa yang paling ngajarin kamu cara jaga hubungan baik?", "bond", COUPLE_MODES, 3],
  ["1 tahun terakhir, kamu belajar apa tentang dirimu?", "bond", COUPLE_MODES, 2],
  ["Tukar 1 rahasia ringan sama orang di depanmu — berani seberapa (1–10)?", "bond", COUPLE_MODES, 2],
  ["'Kenal lebih dalam' buat kamu butuh apa aja?", "bond", COUPLE_MODES, 2],
  ["Sisi kamu yang baru muncul kalau udah nyaman sama orang?", "bond", COUPLE_MODES, 2],
  ["Apa yang bikin kamu langsung ngerasa cocok sama orang?", "bond", COUPLE_MODES, 1],
  ["Hal kecil apa yang bikin kamu males kenalan lebih jauh?", "bond", COUPLE_MODES, 2],
  ["Orang di depanmu nanya mimpi terbesar — jawab jujur apa?", "bond", COUPLE_MODES, 2],
  ["Gimana nunjukin mau kenal lebih, tanpa maksa?", "bond", COUPLE_MODES, 2],
  ["1 pertanyaan yang ingin kamu tanya ke orang di seberangmu malam ini.", "bond", COUPLE_MODES, 2],
  ["Apa yang bikin kamu berani lebih jujur pas ngobrol berdua?", "bond", COUPLE_MODES, 3],
  ["Cerita momen ada orang yang beneran 'ngeliat' kamu.", "bond", COUPLE_MODES, 3],
  ["3 hal paling penting di hidupmu sekarang apa?", "bond", COUPLE_MODES, 2],
  ["Kalau gak deket lagi, apa yang tetap kamu hargai dari proses kenalan?", "bond", COUPLE_MODES, 3],
  ["Titik lemah hati yang jarang dibuka di chat pertama?", "bond", COUPLE_MODES, 3],
  ["Habis canggung ngobrol dalam, kamu biasanya ngapain?", "bond", COUPLE_MODES, 2],
  ["1 hal yang ingin orang ngerti soal caramu jaga kedekatan.", "bond", COUPLE_MODES, 3],
  ["Malam ini cuma boleh buka 3 hal dalam tentang kamu — pilih apa?", "bond", COUPLE_MODES, 3],
  ["Ngobrol seperti apa yang terasa berharga, bukan basa-basi?", "bond", COUPLE_MODES, 2],
  ["Pernah salah baca niat orang yang lagi kenalan? Lalu gimana?", "bond", COUPLE_MODES, 2],
  ["Batas pribadi yang tetap kamu jaga meski ingin lebih deket?", "bond", COUPLE_MODES, 3],
  ["Orang di depanmu bilang mau kenal lebih dalam — jawaban baikmu apa?", "bond", COUPLE_MODES, 2],
  ["1 hal kecil yang bikin kamu bangga, tapi jarang dicerita.", "bond", COUPLE_MODES, 1],
  ["Nyaman berdua: diem bareng oke, atau harus ngobrol terus?", "bond", COUPLE_MODES, 1],
  ["1 topik yang masih susah dicerita, tapi suatu hari ingin bisa.", "bond", COUPLE_MODES, 4],
  ["Gimana tetap hormat sambil tetap jujur di obrolan dalam?", "bond", COUPLE_MODES, 2],
  ["Malam ini cuma 1 pertanyaan paling dalam — kamu pilih tanya apa?", "bond", COUPLE_MODES, 3],

  // Friends
  ["Siapa di sini yang paling bisa dipercaya rahasia?", "friends", PARTY_MODES, 2],
  ["Siapa yang paling sering bikin drama?", "friends", PARTY_MODES, 2],
  ["Teman mana yang paling mirip kamu?", "friends", ALL_MODES, 1],
  ["Pernah berbohong ke teman biar gak sakiti perasaan? Apa?", "friends", PARTY_MODES, 3],
  ["Siapa yang paling sering telat?", "friends", PARTY_MODES, 1],
  ["Kalau butuh pinjam uang, ke siapa dulu?", "friends", PARTY_MODES, 2],
  ["Siapa yang paling cocok jadi influencer?", "friends", PARTY_MODES, 1],
  ["Rahasia group chat yang belum diungkap?", "friends", PARTY_MODES, 3],
  ["Siapa yang paling gampang marah?", "friends", PARTY_MODES, 2],
  ["Teman mana yang paling mengubah hidupmu?", "friends", ALL_MODES, 2],
  ["Pernah cemburu sama teman? Kenapa?", "friends", PARTY_MODES, 3],
  ["Siapa yang paling jago masak di antara kalian?", "friends", FAMILY_MODES, 1],
  ["Kalau liburan bareng, siapa yang bawa mood?", "friends", PARTY_MODES, 1],
  ["Siapa yang paling sering hilang di chat?", "friends", PARTY_MODES, 1],
  ["Ceritakan petualangan terlucu bareng teman.", "friends", ALL_MODES, 1],

  // School
  ["Pelajaran apa yang paling kamu benci dulu?", "school", FAMILY_MODES, 1],
  ["Pernah nyontek? Bagaimana ceritanya?", "school", ["classic", "party", "chaos"], 2],
  ["Guru favorit sepanjang masa?", "school", FAMILY_MODES, 1],
  ["Momen paling memalukan di sekolah?", "school", PARTY_MODES, 2],
  ["Pernah bolos? Kemana?", "school", PARTY_MODES, 2],
  ["Crush guru? Admit!", "school", ["party", "chaos", "extreme"], 3],
  ["Nilai terburuk yang pernah kamu dapat?", "school", ALL_MODES, 1],
  ["Organisasi/ekskul paling berkesan?", "school", FAMILY_MODES, 1],
  ["Pernah dihukum di depan kelas?", "school", PARTY_MODES, 2],
  ["Teman sebangku favorit?", "school", FAMILY_MODES, 1],
  ["PR yang paling bikin trauma?", "school", ALL_MODES, 1],
  ["Pernah presentasi gagal total?", "school", PARTY_MODES, 2],
  ["Jurusan yang kamu sesali atau syukuri?", "school", ALL_MODES, 2],
  ["Ujian apa yang paling ngeri?", "school", ALL_MODES, 1],
  ["Kenangan wisuda favorit?", "school", FAMILY_MODES, 1],

  // Office
  ["Kebiasaan rekan kerja yang paling mengesalkan?", "office", ["classic", "party", "chaos"], 2],
  ["Pernah pura-pura sibuk di kantor?", "office", ["classic", "party", "chaos"], 2],
  ["Meeting paling membosankan yang pernah diikuti?", "office", ["classic", "party"], 1],
  ["Kalau resign besok, alasan dramatis apa yang kamu bilang?", "office", PARTY_MODES, 2],
  ["Siapa boss idealmu (karakter fiksi boleh)?", "office", ALL_MODES, 1],
  ["Pernah salah kirim email ke atasan?", "office", ["classic", "party", "chaos"], 2],
  ["Work from home hack favoritmu?", "office", ALL_MODES, 1],
  ["Pekerjaan impian kalau gaji bukan masalah?", "office", ALL_MODES, 2],
  ["Coffee atau tea untuk survive kerjaan?", "office", ALL_MODES, 1],
  ["Pernah ketiduran di meeting online?", "office", PARTY_MODES, 2],
  ["Skill kerja yang pura-pura kamu jagoin?", "office", PARTY_MODES, 3],
  ["Monday mood dalam satu kata?", "office", ALL_MODES, 1],
  ["Colleague yang paling supportive?", "office", ALL_MODES, 1],
  ["Deadline paling gila yang pernah kamu kejar?", "office", ALL_MODES, 2],
  ["Kalau jadi CEO seharian, aturan aneh apa yang kamu buat?", "office", PARTY_MODES, 1],

  // Deep Talk
  ["Apa ketakutan terbesar dalam hidupmu?", "deep", ["classic", "couple", "extreme", "chaos"], 4],
  ["Apa yang ingin kamu ubah dari masa lalu?", "deep", ["classic", "couple", "extreme"], 4],
  ["Kapan terakhir kali kamu benar-benar bahagia?", "deep", ALL_MODES, 3],
  ["Apa arti sukses bagimu?", "deep", ALL_MODES, 3],
  ["Siapa yang paling berpengaruh dalam hidupmu?", "deep", ALL_MODES, 3],
  ["Apa yang membuatmu bangga pada dirimu sendiri?", "deep", ALL_MODES, 3],
  ["Pernah merasa sendirian meski di keramaian?", "deep", ["classic", "couple", "extreme"], 4],
  ["Apa mimpi yang belum sempat kamu kejar?", "deep", ALL_MODES, 3],
  ["Kalau hanya punya 1 tahun, apa yang kamu lakukan?", "deep", ["classic", "couple", "extreme"], 4],
  ["Apa pelajaran hidup terpenting yang kamu pelajari?", "deep", ALL_MODES, 3],
  ["Bagaimana kamu mendefinisikan cinta?", "deep", COUPLE_MODES, 3],
  ["Apa yang ingin orang pahami tentangmu?", "deep", ["classic", "couple", "extreme"], 4],
  ["Kapan kamu merasa paling rentan?", "deep", ["couple", "extreme"], 5],
  ["Apa yang membuatmu tetap bertahan di masa sulit?", "deep", ALL_MODES, 4],
  ["Kalau bisa bilang sesuatu ke dirimu 10 tahun lalu, apa?", "deep", ALL_MODES, 3],

  // Adult (18+)
  ["Pernah naksir pacar teman? Jujur.", "adult", EXTREME_MODES, 4],
  ["Fantasi kencan yang belum pernah dicoba?", "adult", ["extreme", "couple", "chaos"], 4],
  ["Apa yang paling sexy menurutmu dari seseorang?", "adult", ["extreme", "couple", "chaos"], 3],
  ["Pernah ghosting setelah kencan? Kenapa?", "adult", EXTREME_MODES, 3],
  ["Chat paling spicy yang pernah kamu kirim?", "adult", EXTREME_MODES, 4],
  ["Lokasi ciuman paling berani?", "adult", ["extreme", "couple", "chaos"], 4],
  ["Pernah jatuh cinta sama orang yang reserved?", "adult", ["extreme", "couple"], 3],
  ["Turn-on yang paling unexpected?", "adult", ["extreme", "couple", "chaos"], 4],
  ["Rahasia dating yang belum pernah diceritakan?", "adult", EXTREME_MODES, 5],
  ["App dating terakhir yang kamu buka?", "adult", EXTREME_MODES, 2],

  // Family
  ["Siapa anggota keluarga yang paling mirip kamu?", "family", FAMILY_MODES, 1],
  ["Tradisi keluarga favorit?", "family", FAMILY_MODES, 1],
  ["Masakan rumah yang paling kamu kangenin?", "family", FAMILY_MODES, 1],
  ["Nasihat orang tua yang paling diingat?", "family", FAMILY_MODES, 2],
  ["Liburan keluarga paling seru?", "family", FAMILY_MODES, 1],
  ["Pernah ketahuan bohong sama orang tua?", "family", FAMILY_MODES, 2],
  ["Siapa yang paling galak di rumah?", "family", FAMILY_MODES, 1],
  ["Hewan peliharaan favorit keluarga?", "family", FAMILY_MODES, 1],
  ["Film yang selalu ditonton bareng keluarga?", "family", FAMILY_MODES, 1],
  ["Panggilan sayang di keluarga?", "family", FAMILY_MODES, 1],
  ["Siapa yang jago masak di rumah?", "family", FAMILY_MODES, 1],
  ["Cerita lucu saat makan bareng keluarga?", "family", FAMILY_MODES, 1],
  ["Hadiah ulang tahun terbaik dari keluarga?", "family", FAMILY_MODES, 1],
  ["Aturan rumah yang paling aneh?", "family", FAMILY_MODES, 1],
  ["Kalau keluarga jadi superhero team, role kamu apa?", "family", FAMILY_MODES, 1],
];

const DARE_SEEDS: Array<[string, Category, GameMode[], Difficulty]> = [
  // Easy
  ["Tersenyum lebar ke kamera selama 10 detik.", "funny", ALL_MODES, "easy"],
  ["Tepuk tangan 20 kali sambil bilang 'aku keren!'.", "funny", ALL_MODES, "easy"],
  ["Tirukan suara hewan favoritmu.", "funny", FAMILY_MODES, "easy"],
  ["Kirim emoji random ke 3 kontak terakhir.", "funny", PARTY_MODES, "easy"],
  ["Nyanyikan 10 detik lagu favoritmu.", "funny", ALL_MODES, "easy"],
  ["Lakukan 5 jumping jacks.", "funny", FAMILY_MODES, "easy"],
  ["Bilang 3 pujian ke pemain di sebelahmu.", "friends", ALL_MODES, "easy"],
  ["Tunjukkan pose superhero terbaikmu.", "funny", FAMILY_MODES, "easy"],
  ["Ceritakan lelucon dalam 15 detik.", "funny", ALL_MODES, "easy"],
  ["Ganti avatar/foto profil sementara (kalau online).", "funny", PARTY_MODES, "easy"],
  ["Minum air dengan tangan non-dominan.", "funny", ALL_MODES, "easy"],
  ["Buat jabat tangan rahasia dengan pemain lain.", "friends", ALL_MODES, "easy"],
  ["Sebutkan 5 warna yang kamu lihat sekarang secepat mungkin.", "funny", FAMILY_MODES, "easy"],
  ["Tertawa palsu selama 10 detik sampai beneran ketawa.", "funny", PARTY_MODES, "easy"],
  ["Puji dirimu sendiri di depan cermin/kamera.", "funny", ALL_MODES, "easy"],

  // Medium
  ["Tari tiktok/dance random selama 30 detik.", "funny", PARTY_MODES, "medium"],
  ["Bicara dengan aksen lain selama 1 menit.", "funny", PARTY_MODES, "medium"],
  ["Biarkan pemain lain mengatur pose fotomu.", "friends", PARTY_MODES, "medium"],
  ["Telepon seseorang dan nyanyikan 'Happy Birthday'.", "funny", PARTY_MODES, "medium"],
  ["Post status konyol di medsos selama 10 menit.", "funny", PARTY_MODES, "medium"],
  ["Lakukan catwalk di ruangan.", "funny", PARTY_MODES, "medium"],
  ["Makan sesuatu tanpa pakai tangan.", "funny", PARTY_MODES, "medium"],
  ["Tirukan pemain lain sampai ada yang tebak.", "friends", PARTY_MODES, "medium"],
  ["Sebut 3 sifat baik yang kamu cari di pacar.", "romance", COUPLE_MODES, "easy"],
  ["Cerita kencan pertama impianmu 20 detik.", "romance", COUPLE_MODES, "easy"],
  ["Push-up 15 kali.", "funny", PARTY_MODES, "medium"],
  ["Ceritakan cerita horor singkat dengan lampu dim.", "funny", PARTY_MODES, "medium"],
  ["Gunakan filter aneh di video call selama 2 ronde.", "funny", PARTY_MODES, "medium"],
  ["Baca chat terakhir dengan suara drama.", "funny", PARTY_MODES, "medium"],
  ["Buat slogan iklan untuk pemain di sebelahmu.", "friends", ALL_MODES, "medium"],

  // Hard
  ["Biarkan group pilih challenge berikutnya untukmu.", "funny", EXTREME_MODES, "hard"],
  ["Nyanyikan lagu sambil jongkok jalan keliling ruangan.", "funny", PARTY_MODES, "hard"],
  ["Telepon crush/mantan dan bilang sesuatu baik (opsional).", "romance", EXTREME_MODES, "hard"],
  ["Makan makanan pedas/campuran aneh yang disiapkan teman.", "funny", EXTREME_MODES, "hard"],
  ["Lakukan stand-up comedy 1 menit tentang harimu.", "funny", PARTY_MODES, "hard"],
  ["Post story 'siapa yang rindu aku?' dan biarkan 5 menit.", "funny", EXTREME_MODES, "hard"],
  ["Bicara hanya dengan pertanyaan selama 3 ronde.", "funny", PARTY_MODES, "hard"],
  ["Biarkan seseorang scroll HP-mu 30 detik (dengan izin).", "friends", EXTREME_MODES, "hard"],
  ["Lakukan 30 squat sambil bilang nama semua pemain.", "funny", PARTY_MODES, "hard"],
  ["Sebut 5 tempat enak buat kencan murah.", "romance", COUPLE_MODES, "medium"],
  ["Ganti outfit dengan gaya paling absurd yang ada.", "funny", PARTY_MODES, "hard"],
  ["Rekam video 'confession' palsu yang dramatis.", "funny", PARTY_MODES, "hard"],
  ["Ajari semua orang tarian konyol buatanku.", "friends", PARTY_MODES, "hard"],
  ["Jawab semua pertanyaan 3 ronde ke depan dengan lagu.", "funny", PARTY_MODES, "hard"],
  ["Lakukan handstand atau attempt lucu selama 10 detik.", "funny", EXTREME_MODES, "hard"],

  // Impossible
  ["Selesaikan 3 dare beruntun pilihan group tanpa skip.", "funny", EXTREME_MODES, "impossible"],
  ["Hubungi 3 orang dan minta mereka bilang kamu keren di call.", "friends", EXTREME_MODES, "impossible"],
  ["Makan 'mystery mix' yang dibuat semua pemain.", "funny", EXTREME_MODES, "impossible"],
  ["Live di medsos dan main truth or dare 2 menit.", "funny", EXTREME_MODES, "impossible"],
  ["Biarkan group kontrol harimu via chat selama 1 jam (honor system).", "friends", EXTREME_MODES, "impossible"],
  ["Bilang tipe crush idealmu + 1 orang di room yang mirip tipenya (sopan).", "romance", COUPLE_MODES, "impossible"],
  ["Lakukan planking sampai group bilang stop (max 2 menit).", "funny", EXTREME_MODES, "impossible"],
  ["Nyanyikan full chorus lagu yang group pilih di tempat umum (atau keras di call).", "funny", EXTREME_MODES, "impossible"],
  ["Buat video dance dan post ke story 1 jam.", "funny", EXTREME_MODES, "impossible"],
  ["Jawab truth paling dalam dari setiap pemain (1 per orang).", "deep", EXTREME_MODES, "impossible"],

  // Family safe dares
  ["Gambar hewan favoritmu dalam 30 detik, yang lain tebak.", "family", FAMILY_MODES, "easy"],
  ["Nyanyikan lagu anak-anak dengan gaya opera.", "family", FAMILY_MODES, "easy"],
  ["Lakukan robot dance.", "family", FAMILY_MODES, "easy"],
  ["Sebutkan 10 buah secepat mungkin.", "family", FAMILY_MODES, "easy"],
  ["Buat wajah paling lucu dan tahan 15 detik.", "family", FAMILY_MODES, "easy"],
  ["Ceritakan dongeng singkat 30 detik.", "family", FAMILY_MODES, "medium"],
  ["Ajarkan gerakan senam ke semua orang.", "family", FAMILY_MODES, "medium"],
  ["Main tebak kata hanya dengan gerak tubuh.", "family", FAMILY_MODES, "medium"],
  ["Susun menara dari barang di sekitar dalam 60 detik.", "family", FAMILY_MODES, "medium"],
  ["Pimpin yel-yel keluarga dadakan.", "family", FAMILY_MODES, "easy"],

  // Couple dares — bahasa gampang
  ["Sebut 3 sifat baik yang wajib ada di pacar. Keras-keras.", "romance", COUPLE_MODES, "easy"],
  ["Rencana kencan pertama 30 detik: di mana, makan apa, ngapain.", "romance", COUPLE_MODES, "easy"],
  ["Cerita tipe crush-mu tanpa sebut nama orang beneran.", "romance", COUPLE_MODES, "easy"],
  ["Pura-pura minta IG / nomor ke 'crush' (pilih pemain) — 15 detik.", "romance", COUPLE_MODES, "medium"],
  ["Nyanyi / hum 10 detik lagu cinta favoritmu.", "romance", COUPLE_MODES, "easy"],
  ["Sebut 5 tempat kencan murah.", "romance", COUPLE_MODES, "easy"],
  ["Puji 1 orang di room seolah kamu lagi naksir (sopan).", "romance", COUPLE_MODES, "medium"],
  ["Buat chat pertama ke crush yang gak cringe — baca keras.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 3 sifat jelek yang bikin kamu hilang sepihak.", "romance", COUPLE_MODES, "easy"],
  ["Tiru cara kamu chat pas lagi naksir (boleh ketawa).", "romance", COUPLE_MODES, "easy"],
  ["Kamu lebih suka dipuji, di-chat, dipegang, atau dikasih hadiah? + contoh.", "romance", COUPLE_MODES, "easy"],
  ["Pura-pura ditolak baik-baik — 15 detik.", "romance", COUPLE_MODES, "medium"],
  ["Rencana kencan hujan di bawah 100rb — 20 detik.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 4 jenis film buat nonton bareng crush, urut 1–4.", "romance", COUPLE_MODES, "easy"],
  ["Pilih 1 orang: bilang 1 alasan dia cocok diajak kencan (sopan).", "romance", COUPLE_MODES, "medium"],
  ["Tipe pacar ideal dalam 3 kata, lalu jelasin 1.", "romance", COUPLE_MODES, "easy"],
  ["Pura-pura chat ajak ketemu pertama kali — baca keras.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 5 lagu pas lagi naksir.", "romance", COUPLE_MODES, "medium"],
  ["Pose foto biar keliatan pede di kencan — 5 detik.", "romance", COUPLE_MODES, "easy"],
  ["Pilih cepat: ganteng/cantik atau sikap? + alasan 10 detik.", "romance", COUPLE_MODES, "easy"],
  ["Buat gombalan konyol buat group (boleh cringe).", "romance", COUPLE_MODES, "medium"],
  ["Dari kenal sampe jadian biasanya berapa lama? + 1 alasan.", "romance", COUPLE_MODES, "medium"],
  ["Baca chat 'selamat pagi' yang paling manis.", "romance", COUPLE_MODES, "easy"],
  ["Akuin 1 kebiasaan jelek kamu pas deketin orang.", "romance", COUPLE_MODES, "hard"],
  ["Pilih orang yang jago bantu nembak + kenapa.", "romance", COUPLE_MODES, "easy"],
  ["Rencana kejutan kecil buat crush (murah) 20 detik.", "romance", COUPLE_MODES, "medium"],
  ["Bicara 20 detik: 'yang bikin aku tiba-tiba naksir itu…'", "romance", COUPLE_MODES, "medium"],
  ["Sebut 2 hal yang bikin mundur + 2 hal yang bikin makin suka.", "romance", COUPLE_MODES, "medium"],
  ["Pura-pura nembak orang (boleh fiktif / di room) dengan gayamu.", "romance", COUPLE_MODES, "hard"],
  ["Cerita crush pertama pas sekolah 20 detik (tanpa nama full).", "romance", COUPLE_MODES, "easy"],
  ["Cara minta maaf yang baik di awal pacaran / PDKT.", "romance", COUPLE_MODES, "medium"],
  ["Buat bio app jodoh palsu tentang kamu — 2 kalimat.", "romance", COUPLE_MODES, "hard"],
  ["Tebak: siapa di room paling sering disuka orang? + 1 alasan.", "romance", COUPLE_MODES, "easy"],
  ["Sebut 3 pertanyaan kencan pertama yang gak canggung.", "romance", COUPLE_MODES, "easy"],
  ["Pura-pura balas 'lagi apa?' biar obrolan enak — 15 detik.", "romance", COUPLE_MODES, "medium"],
  ["Sebut camilan / minuman enak buat bareng kencan.", "romance", COUPLE_MODES, "easy"],
  ["Jujur 20 detik: suka pelan-pelan atau cepat jatuh cinta? Kenapa?", "romance", COUPLE_MODES, "easy"],
  ["Rencana kencan 1 hari (pagi–malam) singkat.", "romance", COUPLE_MODES, "hard"],
  ["Pilih 1 orang: kasih pujian tulus yang bikin dia senyum.", "romance", COUPLE_MODES, "medium"],
  ["1 pelajaran dari patah hati yang bikin kamu lebih pinter dating.", "romance", COUPLE_MODES, "hard"],

  // Couple dares — Kenal Crush (Deep) — bahasa gampang
  ["Sebut 3 hal yang ingin kamu tahu tentang crush.", "know", COUPLE_MODES, "easy"],
  ["Cerita 30 detik: kenapa kamu suka dia (yang beneran).", "know", COUPLE_MODES, "medium"],
  ["Tulis 1 pertanyaan dalam buat crush, lalu baca ke group.", "know", COUPLE_MODES, "easy"],
  ["Cerita 1 luka / pelajaran cinta yang bikin kamu hati-hati sekarang.", "know", COUPLE_MODES, "hard"],
  ["Sebut 1 hal penting yang harus sama sama crush.", "know", COUPLE_MODES, "medium"],
  ["Bicara 20 detik: 'yang jarang orang tahu soal caraku suka orang…'", "know", COUPLE_MODES, "medium"],
  ["Jujur: 1 takut terbesar kalau jadian sama crush.", "know", COUPLE_MODES, "hard"],
  ["Sebut 3 tanda 'udah kenal banget' menurutmu.", "know", COUPLE_MODES, "easy"],
  ["Mimpi 5 tahunmu + di mana tempat crush idealnya.", "know", COUPLE_MODES, "medium"],
  ["Cerita titik lemah hatimu yang cuma orang deket boleh tahu.", "know", COUPLE_MODES, "hard"],
  ["Pilih 1 orang: tanya 1 pertanyaan dalam (sopan) ke dia.", "know", COUPLE_MODES, "medium"],
  ["Jawab seolah crush nanya: 'kenapa kamu suka aku?'", "know", COUPLE_MODES, "medium"],
  ["Sebut 2 hal penting yang gak boleh dikorbankan demi pacaran.", "know", COUPLE_MODES, "easy"],
  ["Cerita momen kamu ngerasa dilihat beneran sama crush / orang.", "know", COUPLE_MODES, "medium"],
  ["Akuin 1 hal yang masih kamu bayangin terlalu bagus tentang crush.", "know", COUPLE_MODES, "hard"],
  ["Sebut 3 hal dalam yang ingin ditukar cerita bareng crush.", "know", COUPLE_MODES, "easy"],
  ["Pura-pura tanya serius pertama ke crush — 15 detik.", "know", COUPLE_MODES, "medium"],
  ["Crush bilang 'belum siap' — cara baik jawab gimana?", "know", COUPLE_MODES, "medium"],
  ["20 detik: setia buat kamu artinya apa?", "know", COUPLE_MODES, "hard"],
  ["Cerita 1 doa / harapan diam-diam soal crush (boleh tanpa nama).", "know", COUPLE_MODES, "hard"],

  // Couple dares — Saling Kenal (2 orang) — bahasa gampang
  ["Sebut 3 hal tentang kamu yang jarang dicerita pas baru kenal.", "bond", COUPLE_MODES, "easy"],
  ["Pilih 1 orang: saling tanya 1 pertanyaan dalam (giliran 20 detik).", "bond", COUPLE_MODES, "medium"],
  ["Cerita 30 detik momen kecil pas kecil yang nempel di hati.", "bond", COUPLE_MODES, "medium"],
  ["Tulis 1 pertanyaan dalam buat orang di seberangmu — baca.", "bond", COUPLE_MODES, "easy"],
  ["Sebut 1 hal yang orang sering salah sangka tentang kamu.", "bond", COUPLE_MODES, "easy"],
  ["Bicara 20 detik: 'biar kenal aku, ketahui dulu…'", "bond", COUPLE_MODES, "medium"],
  ["Sebut 3 tanda kamu udah nyaman cerita ke orang.", "bond", COUPLE_MODES, "easy"],
  ["Jujur: 1 takut pas mau buka diri ke orang baru.", "bond", COUPLE_MODES, "medium"],
  ["'Cocok' sama orang itu dalam 3 kata + jelasin 1.", "bond", COUPLE_MODES, "easy"],
  ["Cerita 1 mimpi yang jarang dicerita ke orang random.", "bond", COUPLE_MODES, "medium"],
  ["Sebut 3 hal paling penting di hidupmu sekarang. Keras-keras.", "bond", COUPLE_MODES, "easy"],
  ["Pura-pura ajak orang di depanmu kenalan lebih dalam — 15 detik (sopan).", "bond", COUPLE_MODES, "medium"],
  ["Cerita 1 titik lemah hati (ringan) yang jarang di chat pertama.", "bond", COUPLE_MODES, "hard"],
  ["Sebut 3 topik dalam yang oke dibahas berdua malam ini.", "bond", COUPLE_MODES, "easy"],
  ["Cerita momen kamu beneran didengerin orang.", "bond", COUPLE_MODES, "medium"],
  ["Akuin 1 batas pribadi yang tetap kamu jaga meski ingin deket.", "bond", COUPLE_MODES, "medium"],
  ["Pilih 1 orang: bilang 1 hal tulus yang ingin kamu tahu tentang dia.", "bond", COUPLE_MODES, "medium"],
  ["20 detik: nyaman berdua buat kamu artinya apa?", "bond", COUPLE_MODES, "easy"],
  ["Cerita 1 hal kecil yang bikin bangga tapi jarang dicerita.", "bond", COUPLE_MODES, "easy"],
  ["Baca 1 pertanyaan paling dalam yang ingin kamu tanya ke orang di seberangmu.", "bond", COUPLE_MODES, "hard"],

  // Office / school
  ["Presentasikan 'ide bisnis' absurd selama 30 detik.", "office", PARTY_MODES, "medium"],
  ["Buat email formal palsu yang konyol dan bacakan.", "office", PARTY_MODES, "medium"],
  ["Tirukan guru/atasan favorit (tanpa menyinggung).", "school", PARTY_MODES, "medium"],
  ["Hafalkan dan ucapkan tongue twister 3x cepat.", "school", FAMILY_MODES, "easy"],
  ["Buat jadwal 'meeting fiktif' yang kacau.", "office", PARTY_MODES, "easy"],
];

const SUBJECTS = [
  "kamu",
  "temanmu",
  "crush-mu",
  "keluarga",
  "masa kecilmu",
  "medsos",
  "sekolah",
  "kantor",
  "liburan",
  "mimpimu",
];

const ADJECTIVES = [
  "paling lucu",
  "paling memalukan",
  "paling berani",
  "paling random",
  "paling berkesan",
  "paling konyol",
  "paling epik",
  "paling awkward",
  "paling manis",
  "paling gila",
];

const TRUTH_TEMPLATES = [
  "Apa {adj} tentang {subj} yang jarang orang tahu?",
  "Ceritakan momen {adj} terkait {subj}.",
  "Kalau harus rank {subj}, apa nomor 1-mu?",
  "Pernah bohong soal {subj}? Jujur dong.",
  "Apa opini kontroversialmu tentang {subj}?",
  "Siapa yang paling relate dengan {subj}-mu di room ini?",
  "Dalam 3 kata, deskripsikan {subj} {adj}.",
  "Kalau {subj} jadi film, genrenya apa?",
  "Hal {adj} apa yang kamu simpan soal {subj}?",
  "Apa advice-mu buat orang soal {subj}?",
];

const DARE_TEMPLATES: Array<[string, Difficulty]> = [
  ["Sebutkan 5 hal {adj} tentang {subj} dalam 20 detik.", "easy"],
  ["Buat sketsa/pantomim tentang {subj} selama 15 detik.", "easy"],
  ["Nyanyikan jingle iklan tentang {subj}.", "medium"],
  ["Buat pidato dramatis 30 detik soal {subj}.", "medium"],
  ["Ajari group 'gerak rahasia' bertema {subj}.", "medium"],
  ["Roleplay jadi expert {subj} selama 1 menit.", "hard"],
  ["Biarkan group kasih tugas tambahan bertema {subj}.", "hard"],
  ["Selesaikan mini challenge {subj} pilihan pemain lain.", "hard"],
  ["Lakukan monolog film tentang {subj} dengan penuh emosi.", "impossible"],
  ["Buat challenge berantai: setiap orang +1 detail soal {subj}.", "impossible"],
];

/**
 * Pertanyaan couple utuh (bukan template+topik).
 * Template "soal {x}, ketat/santai" bikin kalimat aneh kayak "soal musik bareng".
 */
const COUPLE_BULK_TRUTHS: Array<[string, Category, 1 | 2 | 3 | 4 | 5]> = [
  // crush / dating simple
  ["Kamu lebih suka chat tiap hari, atau chat pas ada perlu aja?", "flirt", 1],
  ["Kalau orang bales chat lama, kamu nunggu atau chat lagi?", "flirt", 1],
  ["Kencan pertama: kamu yang ajak, atau nunggu diajak?", "date", 1],
  ["Lebih suka ketemu di cafe, taman, atau makan aja?", "date", 1],
  ["Pernah takut nembak orang? Kenapa?", "crush", 2],
  ["Pernah cuma dianggap temen padahal kamu suka?", "crush", 2],
  ["Kamu gampang cemburu gak?", "flags", 2],
  ["Boleh ngomongin mantan di kencan, atau gak boleh?", "flags", 2],
  ["Sering cek medsos crush, atau males?", "flirt", 1],
  ["Dia sering liat story kamu — seneng atau biasa aja?", "flirt", 1],
  ["Gombalan manis atau yang lucu — mana yang kamu suka?", "flirt", 1],
  ["Pujian yang bikin kamu senyum seharian kayak apa?", "flirt", 1],
  ["Kencan murah tapi enak: ide kamu apa?", "date", 1],
  ["Pas kencan, lebih suka patungan atau yang bayar satu orang?", "date", 2],
  ["Mau dijemput, atau ketemu di tempat?", "date", 1],
  ["Video call tiba-tiba: panik atau senang?", "flirt", 1],
  ["Lebih suka voice note atau chat biasa?", "flirt", 1],
  ["Chat 'selamat pagi' tiap hari: suka atau males?", "flirt", 1],
  ["Suka deketin orang pelan-pelan, atau langsung jujur?", "crush", 1],
  ["Orang yang terlalu manis di awal — waspada atau senang?", "flags", 2],
  ["Dia hilang berhari-hari tanpa kabar — kamu ngapain?", "flags", 2],
  ["Status 'temenan aja' tapi sering chat: oke atau bingung?", "flags", 2],
  ["Kapan kamu mau bilang 'kita pacaran' secara resmi?", "flags", 2],
  ["Dia ajak kenalan keluarga cepet — senang atau kaget?", "date", 2],
  ["Pacaran jauh: bisa, atau harus deket?", "date", 2],
  ["Hobi bareng penting gak buat kamu?", "date", 1],
  ["Dengerin musik bareng: kamu yang pilih lagu, atau terserah dia?", "date", 1],
  ["Nonton bareng: film lucu, sedih, atau horor?", "date", 1],
  ["Penampilan orang seberapa penting buat kamu?", "flags", 1],
  ["Orang yang bisa bikin ketawa — naik poin gak?", "crush", 1],
  // know / deep simple
  ["Aturan hidup apa yang gak boleh dilanggar pacar / crush?", "know", 3],
  ["Cerita 1 hal dari masa kecil yang masih nempel.", "know", 2],
  ["Mimpi besar kamu 5 tahun lagi apa?", "know", 2],
  ["Takut apa kalau mulai pacaran serius?", "know", 3],
  ["Pernah sakit hati parah? Pelajaran buat kamu apa?", "know", 3],
  ["Setia buat kamu artinya apa, dengan kata gampang?", "know", 3],
  ["Gampang percaya orang baru, atau perlu waktu lama?", "know", 2],
  ["Ada rahasia kecil yang jarang kamu ceritain ke orang?", "know", 3],
  ["Pas lagi naksir, kamu masih jadi diri sendiri gak?", "know", 2],
  ["Kenangan kecil yang bikin kamu yakin suka seseorang?", "know", 2],
  // bond / saling kenal simple
  ["Apa yang bikin kamu mau kenalan lebih dalam sama orang?", "bond", 2],
  ["Gampang cerita hal pribadi, atau susah?", "bond", 2],
  ["Orang baru: kamu percaya dulu, atau hati-hati dulu?", "bond", 2],
  ["Nyaman berdua: diem bareng oke, atau harus ngobrol terus?", "bond", 1],
  ["Topik apa yang enak dibahas pas baru kenal orang?", "bond", 1],
  ["1 hal tentang kamu yang jarang dicerita di awal kenalan?", "bond", 2],
  ["Kalau orang di depanmu tanya mimpi kamu, jawab jujur apa?", "bond", 2],
  ["Tanda kamu udah nyaman sama seseorang apa aja?", "bond", 2],
  ["Pernah salah sangka niat orang? Cerita dikit.", "bond", 2],
  ["1 pertanyaan yang ingin kamu tanya ke orang di seberangmu sekarang?", "bond", 2],
  ["Lagi sedih: butuh dinasehatin, dipeluk, atau didengerin aja?", "bond", 2],
  ["Hal kecil apa yang bikin kamu ngerasa cocok sama orang?", "bond", 1],
  ["Hal kecil apa yang bikin kamu males kenalan lebih jauh?", "bond", 2],
  ["Batas pribadi yang tetap kamu jaga meski ingin deket?", "bond", 3],
  ["Chat dulu lama, atau ketemu lebih enak?", "flirt", 1],
  ["Pernah nulis chat panjang terus dihapus? Ke siapa (boleh rahasia)?", "crush", 1],
  ["Ide kejutan kecil buat orang yang kamu suka apa?", "date", 1],
  ["Lebih suka orang ambisius, atau yang santai?", "flags", 1],
  ["Pelajaran dari crush dulu yang masih kamu bawa?", "know", 3],
  ["Kalau harus pilih: ganteng/cantik atau sikap bagus?", "flags", 1],
  ["Orang di room ini kira-kira cocok jadi temen curhat kamu siapa?", "bond", 1],
  ["Apa yang bikin kamu ngerasa spesial pas diajak ngobrol seseorang?", "bond", 2],
  ["Pernah pura-pura gak suka padahal suka? Kenapa?", "crush", 2],
  ["Kamu lebih takut ditolak, atau takut nyakitin orang?", "know", 3],
  ["Kalau dia bilang 'butuh space', kamu ngerasa apa dulu?", "know", 3],
  ["3 kata yang jelasin kamu sebagai orang.", "bond", 1],
  ["Makanan / minuman bareng yang paling enak buat kencan?", "date", 1],
  ["Pernah simpan foto / chat crush lama banget?", "crush", 2],
  ["Saran buat temen yang lagi galau naksir orang?", "crush", 1],
];

const COUPLE_BULK_DARES: Array<[string, Category, Difficulty]> = [
  ["Sebut 3 sifat baik yang kamu cari di pacar. Keras-keras.", "flags", "easy"],
  ["Cerita 20 detik kencan pertama impianmu.", "date", "easy"],
  ["Cerita tipe crush tanpa sebut nama orang beneran.", "crush", "easy"],
  ["Pura-pura minta IG ke 'crush' (pilih pemain) — 15 detik.", "flirt", "medium"],
  ["Nyanyi / hum 10 detik lagu yang kepikiran pas naksir.", "crush", "easy"],
  ["Sebut 5 tempat kencan murah.", "date", "easy"],
  ["Puji 1 orang di room seolah kamu lagi naksir (sopan).", "flirt", "medium"],
  ["Buat chat pertama ke crush yang gak cringe — baca keras.", "flirt", "medium"],
  ["Sebut 3 sifat yang bikin kamu kabur dari orang.", "flags", "easy"],
  ["Tiru cara kamu chat pas lagi naksir.", "flirt", "easy"],
  ["Pilih: dipuji, di-chat, dipegang tangan, atau dikasih hadiah? + alasan.", "flags", "easy"],
  ["Pura-pura ditolak baik-baik — 15 detik.", "crush", "medium"],
  ["Rencana kencan hujan murah — 20 detik.", "date", "medium"],
  ["Sebut 4 film enak nonton bareng, urut 1–4.", "date", "easy"],
  ["Pilih 1 orang: bilang 1 alasan dia cocok diajak jalan (sopan).", "date", "medium"],
  ["Tipe pacar ideal dalam 3 kata, lalu jelasin 1.", "crush", "easy"],
  ["Pura-pura chat ajak ketemu — baca keras.", "flirt", "medium"],
  ["Sebut 5 lagu pas lagi naksir.", "crush", "medium"],
  ["Pose biar keliatan pede di kencan — 5 detik.", "date", "easy"],
  ["Pilih cepat: ganteng/cantik atau sikap? + alasan 10 detik.", "flags", "easy"],
  ["Buat gombalan konyol buat group.", "flirt", "medium"],
  ["Bicara 20 detik: 'yang bikin aku tiba-tiba naksir itu…'", "crush", "medium"],
  ["Sebut 3 hal yang ingin kamu tahu tentang crush.", "know", "easy"],
  ["Cerita 30 detik kenapa kamu suka seseorang (boleh tanpa nama).", "know", "medium"],
  ["Tulis 1 pertanyaan buat crush, lalu baca ke group.", "know", "easy"],
  ["Cerita 1 pelajaran dari sakit hati dulu.", "know", "hard"],
  ["Jujur 20 detik: takut apa kalau jadian sama crush?", "know", "hard"],
  ["Sebut 3 tanda 'udah kenal banget' menurutmu.", "know", "easy"],
  ["Jawab seolah crush nanya: 'kenapa kamu suka aku?'", "know", "medium"],
  ["Sebut 2 hal di hidup yang gak boleh dikorbankan demi pacaran.", "know", "easy"],
  ["Sebut 3 hal tentang kamu yang jarang dicerita pas baru kenal.", "bond", "easy"],
  ["Pilih 1 orang: saling tanya 1 pertanyaan (giliran 20 detik).", "bond", "medium"],
  ["Cerita 30 detik momen kecil pas kecil yang nempel.", "bond", "medium"],
  ["Tulis 1 pertanyaan buat orang di seberangmu — baca.", "bond", "easy"],
  ["Sebut 1 hal yang orang sering salah sangka tentang kamu.", "bond", "easy"],
  ["Bicara 20 detik: 'biar kenal aku, ketahui dulu…'", "bond", "medium"],
  ["Sebut 3 tanda kamu udah nyaman cerita ke orang.", "bond", "easy"],
  ["Jujur: 1 takut pas mau buka diri ke orang baru.", "bond", "medium"],
  ["Sebut 3 topik enak dibahas berdua malam ini.", "bond", "easy"],
  ["Cerita momen kamu beneran didengerin orang.", "bond", "medium"],
  ["Akuin 1 batas yang tetap kamu jaga meski ingin deket.", "bond", "medium"],
  ["Pilih 1 orang: bilang 1 hal tulus yang ingin kamu tahu tentang dia.", "bond", "medium"],
  ["20 detik: nyaman berdua buat kamu artinya apa?", "bond", "easy"],
  ["Baca 1 pertanyaan paling ingin kamu tanya ke orang di seberangmu.", "bond", "hard"],
  ["Rencana kencan 1 hari (pagi–malam) singkat.", "date", "hard"],
  ["Pura-pura nembak dengan gayamu sendiri — 15 detik.", "crush", "hard"],
];

function expandTruths(): TruthCard[] {
  const cards: TruthCard[] = [];
  TRUTH_SEEDS.forEach((seed, i) => {
    let category = seed[1];
    const modes = seed[2];
    // Pure couple-only seeds → sub-kategori couple (jaga "romance" multi-mode biar classic tetap jalan)
    if (modes.length === 1 && modes[0] === "couple" && category === "romance") {
      category = assignCoupleCategory(seed[0], i);
    }
    cards.push(t(`truth_seed_${i}`, seed[0], category, modes, seed[3]));
  });

  // Couple bulk: pertanyaan utuh yang gampang dibaca
  COUPLE_BULK_TRUTHS.forEach(([text, category, intensity], cIdx) => {
    cards.push(t(`truth_couple_${cIdx}`, text, category, COUPLE_MODES, intensity));
  });

  let idx = 0;
  for (const tmpl of TRUTH_TEMPLATES) {
    for (const subj of SUBJECTS) {
      for (const adj of ADJECTIVES) {
        const text = tmpl.replace("{subj}", subj).replace("{adj}", adj);
        const catCycle: Category[] = [
          "funny",
          "friends",
          "random",
          "deep",
          "school",
          "office",
          "family",
        ];
        const category = catCycle[idx % catCycle.length];
        const intensity = ((idx % 5) + 1) as 1 | 2 | 3 | 4 | 5;
        // romance tidak di-cycle di sini — sudah diisi bulk couple di atas
        const modes =
          category === "family"
            ? FAMILY_MODES
            : category === "adult"
              ? EXTREME_MODES
              : ALL_MODES;
        cards.push(t(`truth_gen_${idx}`, text, category, modes, intensity));
        idx++;
        if (cards.length >= 1400) return cards;
      }
    }
  }
  return cards;
}

function expandDares(): DareCard[] {
  const cards: DareCard[] = [];
  DARE_SEEDS.forEach((seed, i) => {
    let category = seed[1];
    const modes = seed[2];
    if (modes.length === 1 && modes[0] === "couple" && category === "romance") {
      category = assignCoupleCategory(seed[0], i);
    }
    cards.push(d(`dare_seed_${i}`, seed[0], category, modes, seed[3]));
  });

  COUPLE_BULK_DARES.forEach(([text, category, diff], cIdx) => {
    cards.push(d(`dare_couple_${cIdx}`, text, category, COUPLE_MODES, diff));
  });

  let idx = 0;
  for (const [tmpl, diff] of DARE_TEMPLATES) {
    for (const subj of SUBJECTS) {
      for (const adj of ADJECTIVES) {
        const text = tmpl.replace("{subj}", subj).replace("{adj}", adj);
        const catCycle: Category[] = [
          "funny",
          "friends",
          "random",
          "family",
          "school",
          "office",
        ];
        const category = catCycle[idx % catCycle.length];
        const modes =
          category === "family"
            ? FAMILY_MODES
            : diff === "impossible"
              ? EXTREME_MODES
              : ALL_MODES;
        cards.push(d(`dare_gen_${idx}`, text, category, modes, diff));
        idx++;
        if (cards.length >= 1400) return cards;
      }
    }
  }
  return cards;
}

export const ALL_TRUTHS: TruthCard[] = expandTruths();
export const ALL_DARES: DareCard[] = expandDares();

function matchesModeCategories(
  category: Category,
  mode: GameMode,
  userCategories: Category[]
): boolean {
  // Couple Mode: hanya sub-kategori couple (pisah dari funny/school/office/dll)
  if (mode === "couple") {
    const isCoupleCat =
      COUPLE_CATEGORIES.includes(category) || category === "romance"; // romance = fallback legacy
    if (!isCoupleCat) return false;
    // User filter hanya berlaku untuk sub-kategori couple yang dipilih
    const coupleSelected = userCategories.filter((c) =>
      COUPLE_CATEGORIES.includes(c)
    );
    if (coupleSelected.length > 0) {
      return coupleSelected.includes(category);
    }
    return true; // semua sub-kategori couple
  }

  // Mode lain: jangan campur sub-kategori couple
  if (COUPLE_CATEGORIES.includes(category)) return false;

  // Filter kategori custom room
  if (userCategories.length > 0) {
    const generalSelected = userCategories.filter(
      (c) => !COUPLE_CATEGORIES.includes(c)
    );
    if (generalSelected.length === 0) return true;
    return generalSelected.includes(category) || category === "random";
  }

  const allowed = MODE_CATEGORIES[mode];
  if (!allowed) return true;
  return allowed.includes(category);
}

export function filterTruths(
  mode: GameMode,
  categories: Category[],
  adultContent: boolean,
  usedIds: string[]
): TruthCard[] {
  return ALL_TRUTHS.filter(
    (c) =>
      c.modes.includes(mode) &&
      matchesModeCategories(c.category, mode, categories) &&
      (adultContent || c.category !== "adult") &&
      (mode !== "family" || c.intensity <= 2) &&
      !usedIds.includes(c.id)
  );
}

export function filterDares(
  mode: GameMode,
  categories: Category[],
  difficulty: Difficulty | "mixed",
  adultContent: boolean,
  usedIds: string[]
): DareCard[] {
  return ALL_DARES.filter(
    (c) =>
      c.modes.includes(mode) &&
      matchesModeCategories(c.category, mode, categories) &&
      (difficulty === "mixed" || c.difficulty === difficulty) &&
      (adultContent || c.category !== "adult") &&
      (mode !== "family" || c.difficulty === "easy" || c.difficulty === "medium") &&
      !usedIds.includes(c.id)
  );
}

export function generateAITruth(mode: GameMode, playerName: string): TruthCard {
  const byMode: Record<GameMode, string[]> = {
    couple: [
      `${playerName}, orang kayak apa yang bikin kamu suka?`,
      `${playerName}, apa yang paling ingin kamu tanya ke crush?`,
      `${playerName}, apa yang bikin kamu nyaman cerita ke orang?`,
      `${playerName}, 1 hal tentang kamu yang jarang dicerita pas baru kenal?`,
      `${playerName}, 'kenal lebih dalam' buat kamu artinya apa?`,
      `${playerName}, orang di depanmu boleh tanya apa aja — topik apa yang siap dijawab jujur?`,
    ],
    family: [
      `${playerName}, tradisi keluarga favoritmu apa?`,
      `${playerName}, masakan rumah yang paling kamu kangenin?`,
      `${playerName}, cerita lucu bareng keluarga dong!`,
    ],
    party: [
      `${playerName}, rahasia paling konyol di group ini?`,
      `${playerName}, siapa di sini yang paling drama?`,
      `${playerName}, momen awkward terparah minggu ini?`,
    ],
    extreme: [
      `${playerName}, ketakutan terbesar yang jarang kamu akui?`,
      `${playerName}, keputusan hidup yang hampir kamu sesali?`,
      `${playerName}, jujur — apa yang paling kamu sembunyiin dari orang di sini?`,
    ],
    classic: [
      `${playerName}, apa rahasia kecil yang belum pernah kamu ceritakan di sini?`,
      `${playerName}, satu fakta random yang bikin semua kaget?`,
      `${playerName}, kalau hidup di-reboot, apa yang diubah dulu?`,
    ],
    chaos: [
      `${playerName}, plot twist hidupmu yang paling gila?`,
      `${playerName}, pandang siapa di sini — bilang satu rahasia random!`,
      `${playerName}, truth chaos: pilih orang, tanya apa saja (sopan).`,
    ],
  };
  const prompts = byMode[mode] ?? byMode.classic;
  const category: Category =
    mode === "couple"
      ? coupleCategoryFor(Math.floor(Math.random() * 10))
      : mode === "family"
        ? "family"
        : "random";
  return t(
    `ai_truth_${Date.now()}`,
    prompts[Math.floor(Math.random() * prompts.length)],
    category,
    [mode],
    2
  );
}

export function generateAIDare(
  mode: GameMode,
  playerName: string,
  difficulty: Difficulty
): DareCard {
  const couple: Record<Difficulty, string[]> = {
    easy: [
      `${playerName}, sebut 3 sifat baik yang wajib di pacar!`,
      `${playerName}, rencana kencan pertama 20 detik!`,
      `${playerName}, cerita tipe crush tanpa sebut nama!`,
    ],
    medium: [
      `${playerName}, buat chat pertama ke crush yang gak cringe!`,
      `${playerName}, sebut 5 tempat kencan murah!`,
      `${playerName}, pura-pura minta IG ke 'crush' (pilih pemain)!`,
    ],
    hard: [
      `${playerName}, bicara: 'yang bikin aku tiba-tiba naksir itu…'!`,
      `${playerName}, buat bio app jodoh palsu 2 kalimat!`,
      `${playerName}, pura-pura nembak dengan gayamu sendiri!`,
    ],
    impossible: [
      `${playerName}, bilang tipe ideal + siapa di room mirip tipenya!`,
      `${playerName}, rencana kencan 1 hari (pagi–malam)!`,
      `${playerName}, sebut 2 hal yang bikin mundur + 2 pelajaran dari crush dulu!`,
    ],
  };

  const generic: Record<Difficulty, string[]> = {
    easy: [
      `${playerName}, bilang compliment tulus ke setiap pemain!`,
      `${playerName}, buat pose kemenangan dan tahan 10 detik!`,
      `${playerName}, tirukan emoji favoritmu dengan wajah!`,
    ],
    medium: [
      `${playerName}, buat rap 4 baris tentang group ini!`,
      `${playerName}, tebak warna baju semua orang dari deskripsi!`,
      `${playerName}, pimpin ice breaking konyol 20 detik!`,
    ],
    hard: [
      `${playerName}, improvisasi iklan produk absurd pilihan group!`,
      `${playerName}, challenge fisik ringan yang group setujui!`,
      `${playerName}, jawab 3 pertanyaan kilat dari 3 pemain!`,
    ],
    impossible: [
      `${playerName}, DOUBLE DARE: 2 challenge medium beruntun!`,
      `${playerName}, biarkan group desain dare custom — lalu kerjakan!`,
      `${playerName}, jadi host 1 ronde penuh dengan gaya berlebihan!`,
    ],
  };

  const family: Record<Difficulty, string[]> = {
    easy: [
      `${playerName}, buat wajah paling lucu 10 detik!`,
      `${playerName}, sebut 8 hewan secepat mungkin!`,
      `${playerName}, robot dance singkat!`,
    ],
    medium: [
      `${playerName}, ceritakan dongeng 30 detik!`,
      `${playerName}, pimpin yel-yel keluarga!`,
      `${playerName}, tebak kata cuma dengan gerak tubuh!`,
    ],
    hard: [
      `${playerName}, ajarin semua orang tarian konyol buatmu!`,
      `${playerName}, susun menara barang dalam 45 detik!`,
      `${playerName}, nyanyi lagu anak dengan gaya opera!`,
    ],
    impossible: [
      `${playerName}, jadi MC family games 1 menit penuh!`,
      `${playerName}, buat kuis keluarga 3 soal buat semua orang!`,
      `${playerName}, pimpin challenge ketawa 15 detik bareng!`,
    ],
  };

  const prompts =
    mode === "couple" ? couple : mode === "family" ? family : generic;
  const list = prompts[difficulty];
  const category: Category =
    mode === "couple"
      ? coupleCategoryFor(Math.floor(Math.random() * 10))
      : mode === "family"
        ? "family"
        : "random";
  return d(
    `ai_dare_${Date.now()}`,
    list[Math.floor(Math.random() * list.length)],
    category,
    [mode],
    difficulty
  );
}
