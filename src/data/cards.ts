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

  // Romance / Couple — untuk yang mau couplean: crush, dating, first vibe
  ["Tipe orang yang biasanya bikin kamu naksir itu kayak gimana?", "romance", COUPLE_MODES, 1],
  ["Green flag nomor satu yang kamu cari di calon pasangan?", "romance", COUPLE_MODES, 1],
  ["Red flag yang bikin kamu langsung mundur dari crush?", "romance", COUPLE_MODES, 2],
  ["First date ideal kamu: cafe, jalan, makan, atau nonton?", "romance", COUPLE_MODES, 1],
  ["Lebih suka dikejar pelan-pelan atau yang clear dari awal?", "romance", COUPLE_MODES, 2],
  ["Chat dulu lama atau langsung ajak ketemu — mana yang lebih oke?", "romance", COUPLE_AND_CLASSIC, 1],
  ["Pernah naksir diam-diam berapa lama paling lama?", "romance", COUPLE_MODES, 1],
  ["Cara kamu nunjukin ketertarikan tanpa bilang 'suka'?", "romance", COUPLE_MODES, 2],
  ["Lagu yang selalu kepikiran pas lagi naksir siapa / apa?", "romance", COUPLE_MODES, 1],
  ["Kalau crush bales chat 1 hari sekali, kamu oke atau lelah?", "romance", COUPLE_MODES, 2],
  ["Ide kencan murah yang menurutmu tetap romantis?", "romance", COUPLE_MODES, 1],
  ["Lebih tergoda orang lucu, pinter, atau yang caring?", "romance", COUPLE_MODES, 1],
  ["Pernah ditolak atau nolak orang? Ceritain singkat (tanpa nama).", "romance", COUPLE_MODES, 2],
  ["Dealbreaker di dating yang gak bisa kamu kompromi?", "romance", COUPLE_MODES, 3],
  ["Kalau lagi PDKT, seberapa sering idealnya chat per hari?", "romance", COUPLE_MODES, 1],
  ["Momen 'wah, gue suka banget' biasanya muncul pas ngapain?", "romance", COUPLE_MODES, 2],
  ["Lebih suka pasangan yang sehobi atau yang beda banget?", "romance", COUPLE_MODES, 1],
  ["Fantasy first kiss / first date setting favoritmu (halal & sopan)?", "romance", COUPLE_MODES, 2],
  ["App dating pernah kamu coba? Kesannya gimana?", "romance", COUPLE_MODES, 2],
  ["Pujian dari crush yang paling bikin kamu meleleh?", "romance", COUPLE_MODES, 1],
  ["Kalau orang yang kamu suka main bareng di room ini, siapa kira-kira?", "romance", COUPLE_MODES, 3],
  ["Tanda orang naksir kamu yang paling gampang kamu baca?", "romance", COUPLE_MODES, 2],
  ["Tanda kamu lagi naksir yang paling susah disembunyiin?", "romance", COUPLE_MODES, 2],
  ["Lebih takut friendzone atau takut kecewa habis jadian?", "romance", COUPLE_MODES, 2],
  ["Love language yang kamu harap dari calon pasangan?", "romance", COUPLE_MODES, 1],
  ["Kencan pertama gagal = no second chance, atau kasih kesempatan 2?", "romance", COUPLE_MODES, 2],
  ["Genre film buat nonton bareng crush: romcom, action, atau horror?", "romance", COUPLE_MODES, 1],
  ["Kalau dia ajak video call mendadak, kamu panik atau excited?", "romance", COUPLE_MODES, 1],
  ["Outfit 'mau keliatan menarik' kamu biasanya style apa?", "romance", COUPLE_MODES, 1],
  ["Pernah simpan chat crush lama banget cuma buat dibaca ulang?", "romance", COUPLE_MODES, 2],
  ["Yang bikin kamu yakin 'ini orangnya' itu biasanya apa?", "romance", COUPLE_MODES, 3],
  ["Lebih suka LDR dulu atau harus deket dari awal?", "romance", COUPLE_MODES, 2],
  ["Umur berapa kamu idealnya mulai serius couple?", "romance", COUPLE_MODES, 2],
  ["Kalau temen deket naksir orang yang sama, kamu mundur atau rival?", "romance", COUPLE_MODES, 3],
  ["Cara paling manis buat minta nomor / IG seseorang?", "romance", COUPLE_MODES, 1],
  ["Crush fiksi (aktor/karakter) yang paling 'tipe' kamu?", "romance", COUPLE_MODES, 1],
  ["Kalau dia lagi bad mood, instinct pertama kamu ngapain?", "romance", COUPLE_MODES, 2],
  ["Lebih suka surprise kencan atau plan yang jelas dari awal?", "romance", COUPLE_MODES, 1],
  ["Pernah pure-pure gak suka padahal aslinya naksir? Kenapa?", "romance", COUPLE_MODES, 2],
  ["Hal sepele di orang yang bikin kamu auto naksir?", "romance", COUPLE_MODES, 1],
  ["Hal sepele yang bikin ketertarikan langsung hilang?", "romance", COUPLE_MODES, 2],
  ["Kalau harus pilih: ganteng/cantik atau sikap 10/10?", "romance", COUPLE_MODES, 1],
  ["Timeline ideal: kenal → PDKT → jadian, kira-kira berapa lama?", "romance", COUPLE_MODES, 2],
  ["Pernah nulis chat panjang ke crush terus dihapus? Jujur.", "romance", COUPLE_MODES, 1],
  ["Di kencan, kamu lebih sering yang bayar, split, atau 'terserah'?", "romance", COUPLE_MODES, 2],
  ["Tempat favorit buat first hangout yang gak awkward?", "romance", COUPLE_MODES, 1],
  ["Kalau dia follow story terus, kamu anggap flirting atau kebetulan?", "romance", COUPLE_MODES, 1],
  ["Satu pertanyaan yang selalu kamu tanyain di early dating?", "romance", COUPLE_MODES, 2],
  ["Lebih suka slow burn atau kilat jatuh cinta?", "romance", COUPLE_MODES, 1],
  ["Pelajaran dari crush / dating sebelumnya yang masih kamu bawa?", "romance", COUPLE_MODES, 3],
  ["Kalau dia ajak ketemu keluarga terlalu cepet, kamu gimana?", "romance", COUPLE_MODES, 2],
  ["Emoji / sticker yang paling sering kamu kirim pas lagi flirting?", "romance", COUPLE_MODES, 1],
  ["Siapa di room ini yang paling cocok jadi wingman/wingwoman-mu?", "romance", COUPLE_MODES, 1],
  ["Kalau ditembak di depan umum vs private chat — mana yang lebih kamu suka?", "romance", COUPLE_MODES, 2],
  ["Mimpi kencan impian (boleh gila) yang belum pernah dicoba?", "romance", COUPLE_MODES, 2],
  ["Lebih tergoda orang yang jago masak, jago dengerin, atau jago bikin ketawa?", "romance", COUPLE_MODES, 1],
  ["Pernah salah paham status 'temenan aja' padahal naksir? Ceritain.", "romance", COUPLE_MODES, 2],
  ["Boundary di dating yang kamu jaga dari awal (chat malam, ex, dll.)?", "romance", COUPLE_MODES, 2],
  ["Kalau crush-mu main game ini, truth apa yang paling kamu takut dijawab?", "romance", COUPLE_MODES, 3],
  ["Tipe 'good morning text' yang bikin kamu senyum seharian?", "romance", COUPLE_MODES, 1],
  ["Lebih suka pasangan yang ambitious atau yang santai flow?", "romance", COUPLE_MODES, 1],
  ["Kalau dia ghosting 3 hari, kamu chat duluan atau tunggu?", "romance", COUPLE_MODES, 2],
  ["Satu kebohongan kecil yang sering orang pakai di dating — kamu pernah?", "romance", COUPLE_MODES, 3],
  ["Playlist 'mood naksir' kamu isinya genre apa?", "romance", COUPLE_MODES, 1],
  ["Kalau harus confess malam ini ke seseorang di room, berani gak?", "romance", COUPLE_MODES, 3],
  ["Definisi 'serius' buat kamu di hubungan itu apa?", "romance", COUPLE_MODES, 2],
  ["Lebih suka dijemput first date atau ketemu di lokasi?", "romance", COUPLE_MODES, 1],
  ["Ciri orang 'husband/wife material' menurut standarmu?", "romance", COUPLE_MODES, 2],
  ["Kalau dia minta spoiler perasaan ('kamu suka gak?') terlalu cepet, kamu…?", "romance", COUPLE_MODES, 2],
  ["Snack / minuman order favorit buat sharing di kencan?", "romance", COUPLE_MODES, 1],
  ["Pernah crush sama teman deket? Endingnya gimana (umum aja)?", "romance", COUPLE_MODES, 2],
  ["Yang bikin kamu feel special di awal kenal orang?", "romance", COUPLE_MODES, 2],

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
  ["Sebut 3 green flag yang kamu cari di calon pasangan.", "romance", COUPLE_MODES, "easy"],
  ["Deskripsikan first date idealmu dalam 20 detik.", "romance", COUPLE_MODES, "easy"],
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
  ["Sebut 5 tempat bagus buat first hangout / kencan murah.", "romance", COUPLE_MODES, "medium"],
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
  ["Confess (sopan) tipe crush idealmu + 1 orang di room yang paling deket tipenya.", "romance", COUPLE_MODES, "impossible"],
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

  // Couple dares — dating / crush energy (bukan selfcare berat)
  ["Sebut 3 green flag wajib di calon pasangan, keras-keras.", "romance", COUPLE_MODES, "easy"],
  ["Rancang first date ideal 30 detik: tempat, menu, aktivitas.", "romance", COUPLE_MODES, "easy"],
  ["Deskripsikan tipe crush-mu tanpa bilang nama orang sungguhan.", "romance", COUPLE_MODES, "easy"],
  ["Roleplay minta IG / nomor ke 'crush' (pilih pemain) — 15 dtk.", "romance", COUPLE_MODES, "medium"],
  ["Nyanyikan / hum 10 detik lagu romantis favoritmu.", "romance", COUPLE_MODES, "easy"],
  ["Sebut 5 tempat kencan murah di kotamu (atau ideal).", "romance", COUPLE_MODES, "easy"],
  ["Puji 1 orang di room seolah kamu lagi naksir (sopan).", "romance", COUPLE_MODES, "medium"],
  ["Tulis opening chat ke crush yang gak cringe — bacakan.", "romance", COUPLE_MODES, "medium"],
  ["List 3 red flag yang bikin kamu ghosting.", "romance", COUPLE_MODES, "easy"],
  ["Imitasi cara kamu chat pas lagi naksir (ketawa boleh).", "romance", COUPLE_MODES, "easy"],
  ["Sebut love language yang kamu harap dari pasangan + contoh.", "romance", COUPLE_MODES, "easy"],
  ["Roleplay ditolak baik-baik — 15 detik, tanpa sakit hati.", "romance", COUPLE_MODES, "medium"],
  ["Buat plan 'kencan rainy day' budget di bawah 100rb.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 4 genre film buat nonton bareng crush, ranking 1–4.", "romance", COUPLE_MODES, "easy"],
  ["Pilih pemain: sebut 1 alasan dia 'dateable' (sopan & lucu).", "romance", COUPLE_MODES, "medium"],
  ["Confess tipe pasangan ideal dalam 3 kata, lalu jelasin 1.", "romance", COUPLE_MODES, "easy"],
  ["Roleplay ajak first hangout lewat chat — bacakan keras.", "romance", COUPLE_MODES, "medium"],
  ["Sebut playlist 5 lagu 'mood naksir' (judul/artis).", "romance", COUPLE_MODES, "medium"],
  ["Tunjukkan pose foto 'keliatan menarik di kencan' 5 detik.", "romance", COUPLE_MODES, "easy"],
  ["Jawab kilat: ganteng/cantik vs sikap — pilih + alesan 10 dtk.", "romance", COUPLE_MODES, "easy"],
  ["Buat pickup line konyol (boleh cringe) untuk group.", "romance", COUPLE_MODES, "medium"],
  ["Sebut timeline ideal kenal→jadian, plus 1 alasan.", "romance", COUPLE_MODES, "medium"],
  ["Roleplay good morning text paling manis — bacakan.", "romance", COUPLE_MODES, "easy"],
  ["Akuin 1 kebiasaan dating-mu yang agak toxic (ringan), jujur.", "romance", COUPLE_MODES, "hard"],
  ["Pilih wingman di room + jelasin kenapa dia jago bantu nembak.", "romance", COUPLE_MODES, "easy"],
  ["Rancang surprise kecil buat crush (bukan mahal) 20 detik.", "romance", COUPLE_MODES, "medium"],
  ["Monolog 20 dtk: 'yang bikin gue auto naksir itu…'", "romance", COUPLE_MODES, "medium"],
  ["Sebut 2 dealbreaker + 2 nice-to-have di calon pasangan.", "romance", COUPLE_MODES, "medium"],
  ["Roleplay tembak seseorang (fiktif/di room) dengan gayamu.", "romance", COUPLE_MODES, "hard"],
  ["Ceritakan first crush masa sekolah 20 detik (tanpa full name).", "romance", COUPLE_MODES, "easy"],
  ["Sebut cara paling elegan minta maaf di early dating.", "romance", COUPLE_MODES, "medium"],
  ["Buat bio dating app palsu tentang dirimu — 2 kalimat.", "romance", COUPLE_MODES, "hard"],
  ["Tebak: siapa di room paling sering di-crush orang? Alasan 1.", "romance", COUPLE_MODES, "easy"],
  ["List 3 pertanyaan first date yang gak awkward.", "romance", COUPLE_MODES, "easy"],
  ["Roleplay balas 'kamu lagi apa?' biar chemistry naik — 15 dtk.", "romance", COUPLE_MODES, "medium"],
  ["Sebut snack/minuman sharing favorit buat kencan.", "romance", COUPLE_MODES, "easy"],
  ["Jujur 20 dtk: slow burn atau kilat jatuh cinta — kenapa?", "romance", COUPLE_MODES, "easy"],
  ["Buat rencana kencan 1 hari full (pagi–malam) singkat.", "romance", COUPLE_MODES, "hard"],
  ["Pilih 1 orang: kasih compliment 'date energy' yang tulus.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 1 pelajaran dari patah hati yang bikin kamu lebih jago dating.", "romance", COUPLE_MODES, "hard"],

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

/** Generator Couple Mode — dating / mau couplean */
const COUPLE_TRUTH_TEMPLATES = [
  "Jujur: standarmu soal {x} di dating itu ketat atau santai?",
  "Kalau PDKT, {x} seberapa penting buat kamu?",
  "Pernah kecewa karena {x} di crush / calon? Ceritain singkat.",
  "Green flag soal {x} yang bikin kamu makin naksir?",
  "Red flag soal {x} yang bikin kamu mundur?",
  "Di first date, kamu biasanya bahas {x} atau hindari dulu?",
  "Preferensi kamu soal {x} di calon pasangan kayak gimana?",
  "Satu hal tentang {x} yang jarang kamu akui pas naksir?",
  "Kalau crush-mu bagus di {x}, otomatis naik level gak?",
  "Advice buat orang yang lagi galau soal {x} di dating?",
];

const COUPLE_TRUTH_TOPICS = [
  "chat harian",
  "balas chat cepat",
  "first date",
  "ajak ketemu",
  "nembak",
  "friendzone",
  "jealousy",
  "ex",
  "medsos",
  "story views",
  "flirting",
  "compliment",
  "kencan murah",
  "split bill",
  "jemput-anter",
  "video call",
  "voice note",
  "good morning text",
  "slow burn",
  "love bombing",
  "ghosting",
  "situationship",
  "status formal",
  "kenalan keluarga",
  "LDR",
  "hobi bareng",
  "musik bareng",
  "nonton bareng",
  "tipe penampilan",
  "sense of humor",
];

const COUPLE_DARE_TEMPLATES: Array<[string, Difficulty]> = [
  ["Sebut 3 preferensimu soal {x} di dating, keras-keras.", "easy"],
  ["Rancang skenario ideal soal {x} dalam 20 detik.", "easy"],
  ["Akuin 1 blunder-mu soal {x} pas naksir orang.", "medium"],
  ["Roleplay chat soal {x} ke crush — bacakan 15 detik.", "medium"],
  ["Kasih tips kilat biar jago soal {x} di PDKT.", "easy"],
  ["Deskripsikan red flag vs green flag soal {x}.", "medium"],
  ["Buat opening line keren terkait {x}.", "easy"],
  ["Monolog 25 detik: 'buat gue, {x} di dating itu…'", "hard"],
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

  // Couple-only bulk — sub-kategori couple
  let cIdx = 0;
  for (const tmpl of COUPLE_TRUTH_TEMPLATES) {
    for (const topic of COUPLE_TRUTH_TOPICS) {
      const text = tmpl.replace("{x}", topic);
      const intensity = ((cIdx % 4) + 1) as 1 | 2 | 3 | 4 | 5;
      const category = assignCoupleCategory(text, cIdx);
      cards.push(t(`truth_couple_${cIdx}`, text, category, COUPLE_MODES, intensity));
      cIdx++;
    }
  }

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

  let cIdx = 0;
  for (const [tmpl, diff] of COUPLE_DARE_TEMPLATES) {
    for (const topic of COUPLE_TRUTH_TOPICS) {
      const text = tmpl.replace("{x}", topic);
      const category = assignCoupleCategory(text, cIdx);
      cards.push(d(`dare_couple_${cIdx}`, text, category, COUPLE_MODES, diff));
      cIdx++;
    }
  }

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
      `${playerName}, tipe orang yang bikin kamu naksir itu kayak gimana?`,
      `${playerName}, green flag nomor satu yang kamu cari di calon?`,
      `${playerName}, first date ideal kamu kayak apa?`,
      `${playerName}, red flag yang bikin kamu langsung mundur?`,
      `${playerName}, lebih suka dikejar pelan atau clear dari awal?`,
      `${playerName}, dealbreaker di dating yang gak bisa dikompromi?`,
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
      `${playerName}, sebut 3 green flag wajib di calon pasangan!`,
      `${playerName}, rancang first date ideal 20 detik!`,
      `${playerName}, deskripsikan tipe crush-mu tanpa sebut nama!`,
    ],
    medium: [
      `${playerName}, tulis opening chat ke crush yang gak cringe!`,
      `${playerName}, sebut 5 tempat kencan murah!`,
      `${playerName}, roleplay minta IG ke 'crush' (pilih pemain)!`,
    ],
    hard: [
      `${playerName}, monolog: 'yang bikin gue auto naksir itu…'!`,
      `${playerName}, buat bio dating app palsu 2 kalimat!`,
      `${playerName}, roleplay nembak dengan gayamu sendiri!`,
    ],
    impossible: [
      `${playerName}, confess tipe ideal + siapa di room paling deket tipenya!`,
      `${playerName}, rancang kencan 1 hari full (pagi–malam)!`,
      `${playerName}, sebut 2 dealbreaker + 2 pelajaran dari crush lama!`,
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
