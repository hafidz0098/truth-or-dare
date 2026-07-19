import type { Category, DareCard, Difficulty, GameMode, TruthCard } from "@/types";

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
  couple: ["romance"],
  family: ["family", "funny", "friends", "school", "random"],
  extreme: ["deep", "adult", "romance", "friends", "funny", "random"],
  chaos: null, // campur semua (kecuali adult tanpa flag)
};

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

  // Romance / Couple — personal: perasaan, diri sendiri, sisi soft
  ["Apa yang bikin kamu merasa paling dicintai?", "romance", COUPLE_MODES, 2],
  ["Love language kamu yang paling kuat apa?", "romance", COUPLE_MODES, 1],
  ["Satu sifat di dirimu yang paling kamu banggakan?", "romance", COUPLE_MODES, 1],
  ["Insecurity yang jarang kamu akui ke orang?", "romance", COUPLE_MODES, 3],
  ["Kalau lagi down, apa yang kamu butuhkan dari diri sendiri dulu?", "romance", COUPLE_MODES, 2],
  ["Momen masa kecil yang bikin kamu jadi orang seperti sekarang?", "romance", COUPLE_MODES, 2],
  ["Apa yang kamu takutkan soal membuka hati ke orang?", "romance", COUPLE_MODES, 3],
  ["Bagaimana kamu biasanya nunjukin sayang tanpa bilang 'sayang'?", "romance", COUPLE_MODES, 1],
  ["Hal kecil yang bikin harimu langsung lebih baik?", "romance", COUPLE_MODES, 1],
  ["Kalau sendirian seharian, idealnya kamu ngapain?", "romance", COUPLE_MODES, 1],
  ["Comfort food yang paling 'healing' buat kamu apa?", "romance", COUPLE_MODES, 1],
  ["Lagu yang selalu relate sama perasaanmu sekarang?", "romance", COUPLE_MODES, 1],
  ["Apa yang kamu pelajari tentang dirimu dalam 1 tahun terakhir?", "romance", COUPLE_MODES, 2],
  ["Batas pribadi (boundary) yang paling penting buatmu?", "romance", COUPLE_MODES, 3],
  ["Cara kamu minta maaf kalau salah — jujur kayak apa?", "romance", COUPLE_MODES, 2],
  ["Kalau capek, kamu lebih butuh diam, pelukan, atau curhat?", "romance", COUPLE_MODES, 2],
  ["Satu kebiasaan buruk yang lagi kamu coba perbaiki?", "romance", COUPLE_MODES, 2],
  ["Apa yang bikin kamu merasa 'aman' secara emosional?", "romance", COUPLE_MODES, 2],
  ["Pujian yang paling kamu butuhkan tapi jarang dengar?", "romance", COUPLE_MODES, 2],
  ["Green flag di dirimu sendiri yang jarang orang sadari?", "romance", COUPLE_MODES, 1],
  ["Red flag di dirimu yang lagi kamu sadari?", "romance", COUPLE_MODES, 3],
  ["Mimpi pribadi yang pengen kamu wujudin dalam 5 tahun?", "romance", COUPLE_MODES, 2],
  ["Kalau bisa kirim pesan ke dirimu 5 tahun lalu, isinya apa?", "romance", COUPLE_MODES, 2],
  ["Hal yang paling bikin kamu grogi di awal kenal orang?", "romance", COUPLE_MODES, 1],
  ["Bagaimana kamu biasanya nunjukin kalau lagi ngambek?", "romance", COUPLE_MODES, 1],
  ["Apa yang bikin kamu merasa dihargai sebagai individu?", "romance", COUPLE_MODES, 2],
  ["Hobi atau interest yang bikin kamu 'hidup' lagi?", "romance", COUPLE_MODES, 1],
  ["Foto di galeri yang paling berarti buatmu — kenapa?", "romance", COUPLE_MODES, 2],
  ["Kalau lagi overthinking, isi kepalamu biasanya tentang apa?", "romance", COUPLE_MODES, 3],
  ["Cara kamu merayakan diri sendiri pas ada achievement kecil?", "romance", COUPLE_MODES, 1],
  ["Apa yang paling kamu syukuri tentang kepribadianmu?", "romance", COUPLE_MODES, 1],
  ["Kapan terakhir kamu ngerasa bangga sama keputusanmu sendiri?", "romance", COUPLE_MODES, 2],
  ["Fear of missing out atau takut ditinggal — mana yang lebih nempel?", "romance", COUPLE_MODES, 3],
  ["Bagaimana kamu jaga energi sosialmu (introvert/ekstrovert style)?", "romance", COUPLE_MODES, 1],
  ["Satu hal di tubuh / penampilan yang kamu suka banget?", "romance", COUPLE_MODES, 2],
  ["Satu hal di penampilan yang masih bikin kurang percaya diri?", "romance", COUPLE_MODES, 3],
  ["Ritual pagi yang bikin kamu lebih 'jadi diri sendiri'?", "romance", COUPLE_MODES, 1],
  ["Kalau butuh healing, kamu pilih jalan sendiri atau nonton film?", "romance", COUPLE_MODES, 1],
  ["Apa arti 'rumah' bagimu — bukan tempat, tapi perasaan?", "romance", COUPLE_MODES, 3],
  ["Kenangan romantis pertama yang masih kamu ingat jernih?", "romance", COUPLE_MODES, 2],
  ["Bagaimana kamu mendefinisikan 'dekat' secara emosional?", "romance", COUPLE_MODES, 3],
  ["Hal yang bikin kamu langsung lose interest sama orang?", "romance", COUPLE_MODES, 2],
  ["Hal yang bikin kamu langsung lebih tertarik sama orang?", "romance", COUPLE_MODES, 2],
  ["Kalau lagi marah, kamu tipe meledak, diem, atau nulis dulu?", "romance", COUPLE_MODES, 2],
  ["Apa yang kamu butuhkan biar merasa didengar?", "romance", COUPLE_MODES, 2],
  ["Rahasia kecil tentang dirimu yang jarang dibuka?", "romance", COUPLE_MODES, 3],
  ["Kalau sendirian di cafe, kamu orang seperti apa?", "romance", COUPLE_MODES, 1],
  ["Playlist 'mood aku' isinya genre apa, jujur?", "romance", COUPLE_MODES, 1],
  ["Buku / film / series yang rasanya 'ini gue banget'?", "romance", COUPLE_MODES, 1],
  ["Apa yang kamu pelajari dari patah hati / kecewa dulu?", "romance", COUPLE_MODES, 3],
  ["Cara kamu bilang 'aku butuh space' tanpa nyakitin?", "romance", COUPLE_MODES, 2],
  ["Satu skill soft yang kamu punya tapi jarang dipamerin?", "romance", COUPLE_MODES, 1],
  ["Kalau bisa ubah 1 kebiasaan emosional, apa yang diubah?", "romance", COUPLE_MODES, 3],
  ["Apa yang bikin kamu merasa 'cukup' sebagai manusia?", "romance", COUPLE_MODES, 3],
  ["Bagaimana kamu nunjukin support ke orang yang kamu sayang?", "romance", COUPLE_MODES, 1],
  ["Mimpi konyol masa kecil yang masih sempet kepikiran?", "romance", COUPLE_MODES, 1],
  ["Apa yang paling bikin kamu merasa sexy / confident?", "romance", COUPLE_MODES, 2],
  ["Kalau lagi insecure, self-talk-mu biasanya kayak gimana?", "romance", COUPLE_MODES, 3],
  ["Tempat favorit buat mikir / recharge sendirian?", "romance", COUPLE_MODES, 1],
  ["Apa yang kamu mau orang pahami tentang caramu mencintai?", "romance", COUPLE_MODES, 3],
  ["Hal remeh yang bikin kamu langsung senyum tanpa sadar?", "romance", COUPLE_MODES, 1],
  ["Kalau duit & waktu free, kamu belanjain buat pengalaman apa?", "romance", COUPLE_MODES, 1],
  ["Satu title yang kamu kasih ke dirimu sendiri (bukan pekerjaan)?", "romance", COUPLE_MODES, 1],
  ["Bagaimana kamu normally recover setelah malu di depan orang?", "romance", COUPLE_MODES, 2],
  ["Apa yang kamu takut orang salah paham tentangmu?", "romance", COUPLE_MODES, 3],
  ["Versi terbaik dirimu itu kayak apa, menurutmu?", "romance", COUPLE_MODES, 2],
  ["Satu janji ke diri sendiri yang lagi kamu pegang?", "romance", COUPLE_MODES, 2],
  ["Kalau hati lagi full, cara kamu 'kosongin' apa?", "romance", COUPLE_MODES, 2],
  ["Apa yang bikin kamu merasa diinginkan (bukan cuma dibutuhkan)?", "romance", COUPLE_MODES, 3],
  ["Warna / bau / suara yang paling ngena di memori emosimu?", "romance", COUPLE_MODES, 1],
  ["Lebih nyaman di-chat duluan atau yang nge-chat duluan?", "romance", COUPLE_AND_CLASSIC, 1],
  ["Satu kata yang paling describe dirimu minggu ini?", "romance", COUPLE_MODES, 1],
  ["Apa yang kamu syukuri tentang caramu tumbuh sebagai orang?", "romance", COUPLE_MODES, 2],
  ["Kalau bisa kasih hug ke dirimu sendiri, kapan paling butuh?", "romance", COUPLE_MODES, 2],
  ["Boundary soal HP / personal space yang penting buatmu?", "romance", COUPLE_MODES, 2],
  ["Snack rahasia yang 'haram' dibagi tapi kamu pelit?", "romance", COUPLE_MODES, 1],

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
  ["Sebut 3 hal remeh yang bikin kamu merasa dicintai.", "romance", COUPLE_MODES, "easy"],
  ["Deskripsikan versi softest dirimu dalam 20 detik.", "romance", COUPLE_MODES, "easy"],
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
  ["Sebut 5 cara kamu ngerawat diri sendiri pas lagi lelah.", "romance", COUPLE_MODES, "medium"],
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
  ["Buka 3 perasaan jujur tentang dirimu minggu ini, tanpa filter.", "romance", COUPLE_MODES, "impossible"],
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

  // Couple dares — personal: ekspresikan diri, vulnerability, self-share
  ["Sebut 3 hal yang kamu suka dari dirimu sendiri, keras-keras.", "romance", COUPLE_MODES, "easy"],
  ["Ceritakan 30 detik tentang versi terbaik dirimu.", "romance", COUPLE_MODES, "easy"],
  ["Tulis (atau bilang) 1 janji ke diri sendiri mulai besok.", "romance", COUPLE_MODES, "easy"],
  ["Share 1 insecurity ringan, lalu 1 cara kamu mengatasinya.", "romance", COUPLE_MODES, "medium"],
  ["Deskripsikan love language-mu pakai contoh konkret 20 detik.", "romance", COUPLE_MODES, "easy"],
  ["Nyanyikan / hum 10 detik lagu yang paling 'mood kamu'.", "romance", COUPLE_MODES, "easy"],
  ["Pose 'confident kamu' dan tahan 10 detik sambil senyum.", "romance", COUPLE_MODES, "easy"],
  ["Ceritakan momen bangga pribadi terbaru tanpa gengsi.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 5 item di tas / dompet / meja yang 'ini banget aku'.", "romance", COUPLE_MODES, "easy"],
  ["Bikin self-talk positif 15 detik seolah nasehatin diri sendiri.", "romance", COUPLE_MODES, "medium"],
  ["Akuin 1 kebiasaan jelekmu, terus sebut rencana perbaikinya.", "romance", COUPLE_MODES, "easy"],
  ["Roleplay cara kamu minta maaf yang tulus (monolog 20 dtk).", "romance", COUPLE_MODES, "medium"],
  ["Sebut comfort food + alasan kenapa itu healing buatmu.", "romance", COUPLE_MODES, "easy"],
  ["Buat playlist mental 5 lagu 'ini aku' — sebut judul/artis.", "romance", COUPLE_MODES, "medium"],
  ["Ceritakan tempat favoritmu buat sendirian / recharge.", "romance", COUPLE_MODES, "easy"],
  ["Dalam 3 kata, deskripsikan perasaanmu minggu ini — jelasin 1.", "romance", COUPLE_MODES, "easy"],
  ["Tunjukkan (atau deskripsikan) foto di HP yang paling berarti.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 1 boundary yang kamu jaga, dan kenapa penting.", "romance", COUPLE_MODES, "medium"],
  ["Imitasi cara kamu kalau lagi overthinking (komedi 15 dtk).", "romance", COUPLE_MODES, "easy"],
  ["Puji dirimu seperti memuji orang yang kamu kagumi, 20 detik.", "romance", COUPLE_MODES, "medium"],
  ["Sebut mimpi pribadi 1 tahun ke depan + 1 langkah kecil.", "romance", COUPLE_MODES, "medium"],
  ["Ceritakan kenangan romantis / soft dari sudut pandangmu saja.", "romance", COUPLE_MODES, "medium"],
  ["Tulis pesan singkat ke 'future you' 1 tahun lagi (baca keras).", "romance", COUPLE_MODES, "hard"],
  ["Sebut 2 green flag di dirimu yang jarang dipamerin.", "romance", COUPLE_MODES, "easy"],
  ["Akuin 1 red flag di dirimu — tanpa membela diri dulu.", "romance", COUPLE_MODES, "hard"],
  ["Deskripsikan 'rumah emosional' bagimu dalam 30 detik.", "romance", COUPLE_MODES, "medium"],
  ["Sebut cara kamu bilang 'aku butuh space' yang sehat.", "romance", COUPLE_MODES, "medium"],
  ["Share 1 skill soft yang kamu banggakan, kasih contoh.", "romance", COUPLE_MODES, "easy"],
  ["Buat 'title' konyol + manis buat dirimu (bukan pekerjaan).", "romance", COUPLE_MODES, "easy"],
  ["Ceritakan ritual pagi yang bikin kamu feel like yourself.", "romance", COUPLE_MODES, "easy"],
  ["Sebut apa yang bikin kamu feel confident / attractive.", "romance", COUPLE_MODES, "medium"],
  ["Monolog 20 detik: 'yang orang sering salah paham tentangku…'", "romance", COUPLE_MODES, "hard"],
  ["Sebut 3 hal remeh yang bikin kamu senyum tanpa sadar.", "romance", COUPLE_MODES, "easy"],
  ["Tunjukkan gerak / gesture khasmu pas lagi happy.", "romance", COUPLE_MODES, "easy"],
  ["Share 1 pelajaran dari kecewa lama yang bikin kamu tumbuh.", "romance", COUPLE_MODES, "hard"],
  ["Sebut warna/bau/suara yang nempel di memori emosimu + kenapa.", "romance", COUPLE_MODES, "medium"],
  ["Bikin mini-speech: 'aku cukup karena…' (15–20 detik).", "romance", COUPLE_MODES, "hard"],
  ["Pilih 1 kata untuk dirimu minggu ini, jelasin dengan jujur.", "romance", COUPLE_MODES, "easy"],
  ["Ceritakan cara kamu recover setelah malu di depan orang.", "romance", COUPLE_MODES, "medium"],
  ["Sebut 1 hal di penampilan yang kamu suka, puji keras-keras.", "romance", COUPLE_MODES, "easy"],

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

/** Generator Couple Mode — personal / self-focused */
const COUPLE_TRUTH_TEMPLATES = [
  "Jujur: apa perasaanmu soal {x} akhir-akhir ini?",
  "Bagaimana {x} memengaruhi caramu mencintai dirimu sendiri?",
  "Satu hal tentang {x} yang jarang orang tahu dari dirimu?",
  "Kalau soal {x}, apa yang paling kamu butuhkan dari diri sendiri?",
  "Apa yang kamu pelajari tentang dirimu lewat {x}?",
  "Insecurity kamu terkait {x} — seberapa sering muncul?",
  "Green flag di dirimu saat menghadapi {x} apa?",
  "Kalau {x} lagi berat, self-care-mu biasanya apa?",
  "Ceritakan momen {x} yang bikin kamu bangga sama diri sendiri.",
  "Apa yang ingin kamu ubah dari caramu handle {x}?",
];

const COUPLE_TRUTH_TOPICS = [
  "percaya diri",
  "membuka hati",
  "kecemburuan",
  "kebutuhan dihargai",
  "butuh space",
  "overthinking",
  "minta maaf",
  "bilang sayang",
  "takut ditinggal",
  "menjaga boundary",
  "curhat",
  "marah",
  "ngambek",
  "merasa cukup",
  "self-love",
  "masa lalu",
  "mimpi pribadi",
  "insecurity penampilan",
  "energi sosial",
  "kesepian",
  "healing",
  "pujian",
  "vulnerability",
  "ritual harian",
  "mood swing",
  "comfort zone",
  "keputusan besar",
  "rasa aman",
  "identitas diri",
  "tumbuh sebagai orang",
];

const COUPLE_DARE_TEMPLATES: Array<[string, Difficulty]> = [
  ["Sebut 3 perasaan jujurmu soal {x}, keras-keras.", "easy"],
  ["Ceritakan 20 detik tentang dirimu dan {x}.", "easy"],
  ["Akuin 1 kelemahanmu soal {x}, lalu 1 cara perbaikinya.", "medium"],
  ["Buat self-talk positif 15 detik tentang {x}.", "easy"],
  ["Share 1 momen bangga terkait {x} tanpa gengsi.", "medium"],
  ["Deskripsikan versi terbaikmu saat handle {x}.", "medium"],
  ["Tulis/bilang janji ke diri sendiri soal {x} mulai besok.", "easy"],
  ["Monolog 25 detik: 'yang aku butuhkan soal {x} adalah…'", "hard"],
];

function expandTruths(): TruthCard[] {
  const cards: TruthCard[] = [];
  TRUTH_SEEDS.forEach((seed, i) => {
    cards.push(t(`truth_seed_${i}`, seed[0], seed[1], seed[2], seed[3]));
  });

  // Couple-only bulk
  let cIdx = 0;
  for (const tmpl of COUPLE_TRUTH_TEMPLATES) {
    for (const topic of COUPLE_TRUTH_TOPICS) {
      const text = tmpl.replace("{x}", topic);
      const intensity = ((cIdx % 4) + 1) as 1 | 2 | 3 | 4 | 5;
      cards.push(t(`truth_couple_${cIdx}`, text, "romance", COUPLE_MODES, intensity));
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
    cards.push(d(`dare_seed_${i}`, seed[0], seed[1], seed[2], seed[3]));
  });

  let cIdx = 0;
  for (const [tmpl, diff] of COUPLE_DARE_TEMPLATES) {
    for (const topic of COUPLE_TRUTH_TOPICS) {
      const text = tmpl.replace("{x}", topic);
      cards.push(d(`dare_couple_${cIdx}`, text, "romance", COUPLE_MODES, diff));
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
  // Couple Mode: konten personal (romance) — tidak tercampur sekolah/kantor/dll
  if (mode === "couple") return category === "romance";

  // Filter kategori custom room (kecuali couple di atas)
  if (userCategories.length > 0) {
    return userCategories.includes(category) || category === "random";
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
      `${playerName}, apa yang bikin kamu merasa paling dicintai?`,
      `${playerName}, satu sifat di dirimu yang paling kamu banggakan?`,
      `${playerName}, insecurity yang jarang kamu akui ke orang?`,
      `${playerName}, love language-mu yang paling kuat apa?`,
      `${playerName}, apa yang kamu butuhkan biar merasa aman secara emosional?`,
      `${playerName}, satu janji ke diri sendiri yang lagi kamu pegang?`,
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
    mode === "couple" ? "romance" : mode === "family" ? "family" : "random";
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
      `${playerName}, sebut 3 hal yang kamu suka dari dirimu sendiri!`,
      `${playerName}, deskripsikan love language-mu dengan contoh!`,
      `${playerName}, puji dirimu 15 detik tanpa malu!`,
    ],
    medium: [
      `${playerName}, share 1 insecurity + cara kamu mengatasinya!`,
      `${playerName}, ceritakan momen bangga pribadi terbaru!`,
      `${playerName}, sebut 1 boundary penting + kenapa kamu jaga!`,
    ],
    hard: [
      `${playerName}, monolog: 'yang orang sering salah paham tentangku…'!`,
      `${playerName}, baca keras pesan singkat ke future-you 1 tahun lagi!`,
      `${playerName}, akuin 1 red flag di dirimu tanpa membela diri!`,
    ],
    impossible: [
      `${playerName}, speech 30 dtk: 'aku cukup karena…' — jujur total!`,
      `${playerName}, deskripsikan versi terbaik dirimu + 3 langkah ke sana!`,
      `${playerName}, buka 2 rahasia ringan tentang perasaanmu minggu ini!`,
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
    mode === "couple" ? "romance" : mode === "family" ? "family" : "random";
  return d(
    `ai_dare_${Date.now()}`,
    list[Math.floor(Math.random() * list.length)],
    category,
    [mode],
    difficulty
  );
}
