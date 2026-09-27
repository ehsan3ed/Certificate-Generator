const CERT_FONTS = [
  {
    id: "classic",
    label: "کلاسیک لاتین",
    title: '"Cormorant Garamond", Georgia, serif',
    script: '"Great Vibes", "Segoe Script", cursive',
    body: '"Lato", "Segoe UI", Tahoma, sans-serif'
  },
  {
    id: "persian-elegant",
    label: "فارسی رسمی",
    title: '"Vazirmatn", Tahoma, sans-serif',
    script: '"Vazirmatn", Tahoma, sans-serif',
    body: '"Vazirmatn", Tahoma, sans-serif'
  },
  {
    id: "playfair",
    label: "Playfair لوکس",
    title: '"Playfair Display", Georgia, serif',
    script: '"Great Vibes", cursive',
    body: '"Lato", sans-serif'
  },
  {
    id: "modern",
    label: "مدرن Sans",
    title: '"Montserrat", "Segoe UI", sans-serif',
    script: '"Montserrat", "Segoe UI", sans-serif',
    body: '"Montserrat", "Segoe UI", sans-serif'
  }
];

const CERT_LANGUAGES = {
  en: {
    id: "en",
    label: "English",
    dir: "ltr",
    align: "center",
    texts: {
      title: "CERTIFICATE OF APPRECIATION",
      introText: "who has attended and successfully completed the following training course:",
      duration: "Duration: 24 Hours",
      descriptionOne:
        "This certificate confirms that the holder has successfully completed the above-mentioned training course and has acquired the necessary knowledge, skills, and competencies in the relevant field.",
      descriptionTwo:
        "This certificate is valid and has been issued at the request of the holder for educational purposes and has been approved by the relevant instructor.",
      qrNotice: "The left QR verifies authenticity (dedicated certificate page). The right QR links to the instructor profile.",
      signatureCaption: "INSTRUCTOR'S SIGNATURE",
      studentPhotoCaption: "Trainee / Apprentice",
      instructorPhotoCaption: "Instructor"
    }
  },
  fa: {
    id: "fa",
    label: "فارسی",
    dir: "rtl",
    align: "center",
    texts: {
      title: "گواهینامه تقدیر",
      introText: "که در دوره آموزشی زیر شرکت کرده و با موفقیت آن را به پایان رسانده است:",
      duration: "مدت دوره: ۲۴ ساعت",
      descriptionOne:
        "این گواهینامه تأیید می‌کند که دارنده آن دوره آموزشی فوق را با موفقیت گذرانده و دانش، مهارت و شایستگی‌های لازم را کسب کرده است.",
      descriptionTwo:
        "این گواهینامه معتبر بوده و بنا به درخواست دارنده برای اهداف آموزشی صادر و به تأیید مدرس مربوطه رسیده است.",
      qrNotice: "اصالت گواهینامه با QR سمت چپ (صفحه اختصاصی تأیید در سایت پندنیک) بررسی می‌شود. QR سمت راست مربوط به پروفایل مدرس است.",
      signatureCaption: "امضای مدرس",
      studentPhotoCaption: "هنرجو یا کارآموز",
      instructorPhotoCaption: "مدرس"
    }
  },
  ar: {
    id: "ar",
    label: "العربية",
    dir: "rtl",
    align: "center",
    texts: {
      title: "شهادة تقدير",
      introText: "الذي حضر وأكمل بنجاح الدورة التدريبية التالية:",
      duration: "المدة: ٢٤ ساعة",
      descriptionOne:
        "تؤكد هذه الشهادة أن حاملها قد أكمل الدورة التدريبية المذكورة بنجاح واكتسب المعرفة والمهارات والكفاءات اللازمة.",
      descriptionTwo:
        "هذه الشهادة سارية وقد صدرت بناءً على طلب حاملها لأغراض تعليمية ووافق عليها المدرب المختص.",
      qrNotice: "يتم التحقق من أصالة الشهادة عبر رمز QR الأيسر (صفحة الشهادة على بندنيك). رمز QR الأيمن لملف المدرب.",
      signatureCaption: "توقيع المدرب",
      studentPhotoCaption: "متدرب / متدرب مهني",
      instructorPhotoCaption: "المدرب"
    }
  }
};

const SITE_LOGO = "./assets/pandenik-logo-transparent.png";

const LAYER_PRESETS = [
  {
    id: "classic-layout",
    name: "چیدمان کلاسیک",
    desc: "لوگو بالا، QR گوشه‌ها، بدون عکس",
    apply(state) {
      state.logo = { x: 516, y: 82, size: 90 };
      state.qrLeft = { x: 90, y: 655, size: 78 };
      state.qrRight = { x: 955, y: 655, size: 78 };
      state.studentPhotoEnabled = false;
      state.instructorPhotoEnabled = false;
      state.watermarkEnabled = false;
      state.showFlourishes = true;
    }
  },
  {
    id: "photos-sides",
    name: "عکس‌های کناری",
    desc: "عکس هنرجو چپ و مدرس راست",
    apply(state) {
      state.studentPhotoEnabled = true;
      state.instructorPhotoEnabled = true;
      state.studentPhoto = { x: 120, y: 290, size: 120 };
      state.instructorPhoto = { x: 880, y: 290, size: 120 };
      state.showFlourishes = true;
    }
  },
  {
    id: "custom-bg-fade",
    name: "پس‌زمینه محو سفارشی",
    desc: "فعال‌سازی تصویر محو بزرگ کاربر",
    apply(state) {
      state.watermarkEnabled = true;
      state.watermarkOpacity = 0.1;
      state.watermarkSize = 520;
    }
  },
  {
    id: "minimal-modern",
    name: "مینیمال مدرن",
    desc: "بدون تزئین گوشه، حاشیه نازک",
    apply(state) {
      state.showFlourishes = false;
      state.style.outerPad = 14;
      state.style.framePad = 3;
      state.style.borderInnerWidth = 1;
      state.logo = { x: 516, y: 70, size: 78 };
    }
  },
  {
    id: "qr-top",
    name: "QR بالا",
    desc: "کیوآرکدها در بالای گواهینامه",
    apply(state) {
      state.qrLeft = { x: 90, y: 90, size: 70 };
      state.qrRight = { x: 960, y: 90, size: 70 };
    }
  },
  {
    id: "rtl-fa-ready",
    name: "آماده فارسی RTL",
    desc: "زبان فارسی + راست‌چین + فونت رسمی",
    apply(state) {
      state.language = "fa";
      state.direction = "rtl";
      state.fontPack = "persian-elegant";
    }
  }
];

const CERT_THEMES = [
  {
    id: "classic-navy",
    name: "کلاسیک نیروی دریایی",
    nameEn: "Classic Navy & Gold",
    preview: "./assets/theme-classic-navy.png",
    frame: "./assets/theme-frame-classic-navy.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#1c2b4a",
      frameColor: "#c9a24b",
      paperStart: "#fffdf4",
      paperMid: "#f8f0d9",
      paperEnd: "#ead9ae",
      accent: "#c9a24b",
      titleColor: "#1c2b4a",
      inkColor: "#4a4a4a",
      mutedColor: "#7a6a3c",
      courseDateColor: "#b8923c",
      borderInnerColor: "#c9a24b",
      borderInnerWidth: 1.5,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#c9a24b",
      signatureColor: "#1c2b4a",
      flourishColor: "#c9a24b"
    }
  },
  {
    id: "emerald-gold",
    name: "زمردی سلطنتی",
    nameEn: "Emerald & Champagne",
    preview: "./assets/theme-emerald-gold.png",
    frame: "./assets/theme-frame-emerald-gold.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#0f3d2e",
      frameColor: "#d4b56a",
      paperStart: "#fbfaf4",
      paperMid: "#f1ead4",
      paperEnd: "#e0d3aa",
      accent: "#d4b56a",
      titleColor: "#0f3d2e",
      inkColor: "#3d4a3f",
      mutedColor: "#6f7a55",
      courseDateColor: "#a88b3a",
      borderInnerColor: "#d4b56a",
      borderInnerWidth: 1.5,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#d4b56a",
      signatureColor: "#0f3d2e",
      flourishColor: "#d4b56a"
    }
  },
  {
    id: "burgundy-rose",
    name: "بورگاندی رزگلد",
    nameEn: "Burgundy & Rose Gold",
    preview: "./assets/theme-burgundy-rose.png",
    frame: "./assets/theme-frame-burgundy-rose.png",
    preferredLang: "en",
    preferredFont: "playfair",
    preferredDir: "ltr",
    style: {
      outerBg: "#5c1a2e",
      frameColor: "#c9a088",
      paperStart: "#fff8f4",
      paperMid: "#f7e8e0",
      paperEnd: "#ebcfc2",
      accent: "#c9a088",
      titleColor: "#5c1a2e",
      inkColor: "#5a3f3f",
      mutedColor: "#8a6a62",
      courseDateColor: "#b07a6a",
      borderInnerColor: "#c9a088",
      borderInnerWidth: 1.8,
      outerPad: 20,
      framePad: 6,
      qrBorderColor: "#c9a088",
      signatureColor: "#5c1a2e",
      flourishColor: "#c9a088"
    }
  },
  {
    id: "midnight-silver",
    name: "نیمه‌شب نقره‌ای",
    nameEn: "Midnight Silver",
    preview: "./assets/theme-midnight-silver.png",
    frame: "./assets/theme-frame-midnight-silver.png",
    preferredLang: "en",
    preferredFont: "modern",
    preferredDir: "ltr",
    style: {
      outerBg: "#1a1d24",
      frameColor: "#b8c0cc",
      paperStart: "#f7f8fa",
      paperMid: "#e8ecf1",
      paperEnd: "#d5dbe3",
      accent: "#b8c0cc",
      titleColor: "#1a1d24",
      inkColor: "#3a404a",
      mutedColor: "#6b7380",
      courseDateColor: "#7a8494",
      borderInnerColor: "#b8c0cc",
      borderInnerWidth: 1.2,
      outerPad: 16,
      framePad: 4,
      qrBorderColor: "#8a94a3",
      signatureColor: "#1a1d24",
      flourishColor: "#9aa3b0"
    }
  },
  {
    id: "sand-copper",
    name: "شن و مس",
    nameEn: "Sand & Copper",
    preview: "./assets/theme-sand-copper.png",
    frame: "./assets/theme-frame-sand-copper.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#4a2f1c",
      frameColor: "#c47a3a",
      paperStart: "#fbf6ec",
      paperMid: "#f0e2c8",
      paperEnd: "#e0c9a0",
      accent: "#c47a3a",
      titleColor: "#4a2f1c",
      inkColor: "#5a4330",
      mutedColor: "#8a6b45",
      courseDateColor: "#b06a2e",
      borderInnerColor: "#c47a3a",
      borderInnerWidth: 2,
      outerPad: 22,
      framePad: 7,
      qrBorderColor: "#c47a3a",
      signatureColor: "#4a2f1c",
      flourishColor: "#c47a3a"
    }
  },
  {
    id: "ocean-teal",
    name: "اقیانوس تیل",
    nameEn: "Ocean Teal",
    preview: "./assets/theme-ocean-teal.png",
    frame: "./assets/theme-frame-ocean-teal.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#0d3d48",
      frameColor: "#d7c39a",
      paperStart: "#f5fbfb",
      paperMid: "#e4f0ef",
      paperEnd: "#c9dedc",
      accent: "#d7c39a",
      titleColor: "#0d3d48",
      inkColor: "#355055",
      mutedColor: "#5f7a78",
      courseDateColor: "#3f8a8a",
      borderInnerColor: "#d7c39a",
      borderInnerWidth: 1.5,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#d7c39a",
      signatureColor: "#0d3d48",
      flourishColor: "#d7c39a"
    }
  },
  {
    id: "indigo-ivory",
    name: "نیلی و عاجی",
    nameEn: "Indigo Ivory",
    preview: "./assets/theme-indigo-ivory.png",
    frame: "./assets/theme-frame-indigo-ivory.png",
    preferredLang: "en",
    preferredFont: "playfair",
    preferredDir: "ltr",
    style: {
      outerBg: "#24305e",
      frameColor: "#c6a65a",
      paperStart: "#fffcf5",
      paperMid: "#f4ecda",
      paperEnd: "#e5d7b5",
      accent: "#c6a65a",
      titleColor: "#24305e",
      inkColor: "#444b63",
      mutedColor: "#7a734f",
      courseDateColor: "#a88d3d",
      borderInnerColor: "#c6a65a",
      borderInnerWidth: 1.5,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#c6a65a",
      signatureColor: "#24305e",
      flourishColor: "#c6a65a"
    }
  },
  {
    id: "forest-brass",
    name: "جنگلی برنجی",
    nameEn: "Forest Brass",
    preview: "./assets/theme-forest-brass.png",
    frame: "./assets/theme-frame-forest-brass.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#1f3a28",
      frameColor: "#b08d4f",
      paperStart: "#faf6ea",
      paperMid: "#ebe1c6",
      paperEnd: "#d8c6a0",
      accent: "#b08d4f",
      titleColor: "#1f3a28",
      inkColor: "#425044",
      mutedColor: "#6f7a55",
      courseDateColor: "#8f7340",
      borderInnerColor: "#b08d4f",
      borderInnerWidth: 1.6,
      outerPad: 19,
      framePad: 6,
      qrBorderColor: "#b08d4f",
      signatureColor: "#1f3a28",
      flourishColor: "#b08d4f"
    }
  },
  {
    id: "royal-purple",
    name: "بنفش سلطنتی",
    nameEn: "Royal Purple",
    preview: "./assets/theme-royal-purple.png",
    frame: "./assets/theme-frame-royal-purple.png",
    preferredLang: "en",
    preferredFont: "playfair",
    preferredDir: "ltr",
    style: {
      outerBg: "#3b1f55",
      frameColor: "#d4b98a",
      paperStart: "#fbf7ff",
      paperMid: "#f0e6f7",
      paperEnd: "#dbcfe8",
      accent: "#d4b98a",
      titleColor: "#3b1f55",
      inkColor: "#4f4460",
      mutedColor: "#7a6d88",
      courseDateColor: "#9a7d4f",
      borderInnerColor: "#d4b98a",
      borderInnerWidth: 1.7,
      outerPad: 20,
      framePad: 6,
      qrBorderColor: "#d4b98a",
      signatureColor: "#3b1f55",
      flourishColor: "#d4b98a"
    }
  },
  {
    id: "persian-turquoise",
    name: "فیروزه ایرانی",
    nameEn: "Persian Turquoise",
    preview: "./assets/theme-persian-turquoise.png",
    frame: "./assets/theme-frame-persian-turquoise.png",
    preferredLang: "fa",
    preferredFont: "persian-elegant",
    preferredDir: "rtl",
    style: {
      outerBg: "#0d5c63",
      frameColor: "#d4af37",
      paperStart: "#fffaf0",
      paperMid: "#f3e8d0",
      paperEnd: "#e2d0a8",
      accent: "#d4af37",
      titleColor: "#0d5c63",
      inkColor: "#3f4a45",
      mutedColor: "#6d7a55",
      courseDateColor: "#b08d2e",
      borderInnerColor: "#d4af37",
      borderInnerWidth: 2,
      outerPad: 22,
      framePad: 7,
      qrBorderColor: "#d4af37",
      signatureColor: "#0d5c63",
      flourishColor: "#d4af37"
    }
  },
  {
    id: "modern-slate",
    name: "مدرن اسلیت",
    nameEn: "Modern Slate",
    preview: "./assets/theme-modern-slate.png",
    frame: "./assets/theme-frame-modern-slate.png",
    preferredLang: "en",
    preferredFont: "modern",
    preferredDir: "ltr",
    style: {
      outerBg: "#4a5d73",
      frameColor: "#c9b27a",
      paperStart: "#ffffff",
      paperMid: "#f3f5f8",
      paperEnd: "#e4e9ef",
      accent: "#c9b27a",
      titleColor: "#2f3c4c",
      inkColor: "#445263",
      mutedColor: "#6b7a8a",
      courseDateColor: "#8a7a4f",
      borderInnerColor: "#c9b27a",
      borderInnerWidth: 1,
      outerPad: 14,
      framePad: 3,
      qrBorderColor: "#8a97a8",
      signatureColor: "#2f3c4c",
      flourishColor: "#c9b27a"
    }
  },
  {
    id: "coral-cream",
    name: "مرجانی کرمی",
    nameEn: "Coral Cream",
    preview: "./assets/theme-coral-cream.png",
    frame: "./assets/theme-frame-coral-cream.png",
    preferredLang: "fa",
    preferredFont: "persian-elegant",
    preferredDir: "rtl",
    style: {
      outerBg: "#b85c48",
      frameColor: "#e0b089",
      paperStart: "#fff9f3",
      paperMid: "#f7e8da",
      paperEnd: "#ebcfc0",
      accent: "#e0b089",
      titleColor: "#8a3d2e",
      inkColor: "#5a4338",
      mutedColor: "#8a6a58",
      courseDateColor: "#c07850",
      borderInnerColor: "#e0b089",
      borderInnerWidth: 1.6,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#e0b089",
      signatureColor: "#8a3d2e",
      flourishColor: "#e0b089"
    }
  },
  {
    id: "ivory-bronze",
    name: "عاج و برنز",
    nameEn: "Ivory & Bronze",
    preview: "./assets/theme-ivory-bronze.png",
    frame: "./assets/theme-frame-ivory-bronze.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#3b2a1a",
      frameColor: "#b08d57",
      paperStart: "#fffaf2",
      paperMid: "#f4e6cf",
      paperEnd: "#e5d0a8",
      accent: "#b08d57",
      titleColor: "#3b2a1a",
      inkColor: "#4a3b2c",
      mutedColor: "#7a6548",
      courseDateColor: "#9a7540",
      borderInnerColor: "#b08d57",
      borderInnerWidth: 1.5,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#b08d57",
      signatureColor: "#3b2a1a",
      flourishColor: "#b08d57",
    }
  },
  {
    id: "charcoal-copper",
    name: "ذغالی و مس",
    nameEn: "Charcoal & Copper",
    preview: "./assets/theme-charcoal-copper.png",
    frame: "./assets/theme-frame-charcoal-copper.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#1f2428",
      frameColor: "#c47a4a",
      paperStart: "#f7f4ef",
      paperMid: "#ebe4da",
      paperEnd: "#d9cfc0",
      accent: "#c47a4a",
      titleColor: "#1f2428",
      inkColor: "#3d4348",
      mutedColor: "#6b7278",
      courseDateColor: "#a8643a",
      borderInnerColor: "#c47a4a",
      borderInnerWidth: 1.5,
      outerPad: 16,
      framePad: 4,
      qrBorderColor: "#c47a4a",
      signatureColor: "#1f2428",
      flourishColor: "#c47a4a",
    }
  },
  {
    id: "sage-linen",
    name: "سبز مریم‌گلی",
    nameEn: "Sage & Linen",
    preview: "./assets/theme-sage-linen.png",
    frame: "./assets/theme-frame-sage-linen.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#4f5d4a",
      frameColor: "#c4b48a",
      paperStart: "#fcfbf7",
      paperMid: "#f0eee4",
      paperEnd: "#ddd8c6",
      accent: "#c4b48a",
      titleColor: "#3d4a38",
      inkColor: "#445043",
      mutedColor: "#6d7568",
      courseDateColor: "#8f8458",
      borderInnerColor: "#c4b48a",
      borderInnerWidth: 1.8,
      outerPad: 20,
      framePad: 6,
      qrBorderColor: "#c4b48a",
      signatureColor: "#3d4a38",
      flourishColor: "#c4b48a",
    }
  },
  {
    id: "wine-champagne",
    name: "شرابی و شامپاین",
    nameEn: "Wine & Champagne",
    preview: "./assets/theme-wine-champagne.png",
    frame: "./assets/theme-frame-wine-champagne.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#5a1f2e",
      frameColor: "#d2b48c",
      paperStart: "#fff8f5",
      paperMid: "#f6e6df",
      paperEnd: "#e8cfc4",
      accent: "#d2b48c",
      titleColor: "#5a1f2e",
      inkColor: "#5a3f3f",
      mutedColor: "#8a6a62",
      courseDateColor: "#b07a6a",
      borderInnerColor: "#d2b48c",
      borderInnerWidth: 1.8,
      outerPad: 20,
      framePad: 6,
      qrBorderColor: "#d2b48c",
      signatureColor: "#5a1f2e",
      flourishColor: "#d2b48c",
    }
  },
  {
    id: "arctic-platinum",
    name: "قطبی پلاتینیوم",
    nameEn: "Arctic Platinum",
    preview: "./assets/theme-arctic-platinum.png",
    frame: "./assets/theme-frame-arctic-platinum.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#2a3440",
      frameColor: "#a8b4c0",
      paperStart: "#f8fafc",
      paperMid: "#e8eef4",
      paperEnd: "#d3dbe4",
      accent: "#a8b4c0",
      titleColor: "#2a3440",
      inkColor: "#3a4450",
      mutedColor: "#6b7580",
      courseDateColor: "#7a8490",
      borderInnerColor: "#a8b4c0",
      borderInnerWidth: 1.2,
      outerPad: 16,
      framePad: 4,
      qrBorderColor: "#8a94a0",
      signatureColor: "#2a3440",
      flourishColor: "#9aa3b0",
    }
  },
  {
    id: "terracotta-sand",
    name: "سفالی و شن",
    nameEn: "Terracotta & Sand",
    preview: "./assets/theme-terracotta-sand.png",
    frame: "./assets/theme-frame-terracotta-sand.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#8a4b32",
      frameColor: "#d9b27c",
      paperStart: "#fff9f0",
      paperMid: "#f3e4cb",
      paperEnd: "#e2cb9f",
      accent: "#d9b27c",
      titleColor: "#6e3a26",
      inkColor: "#5a4332",
      mutedColor: "#8a6d4a",
      courseDateColor: "#b88848",
      borderInnerColor: "#d9b27c",
      borderInnerWidth: 2,
      outerPad: 22,
      framePad: 6,
      qrBorderColor: "#d9b27c",
      signatureColor: "#6e3a26",
      flourishColor: "#d9b27c",
    }
  },
  {
    id: "teal-pearl",
    name: "سبزآبی مرواریدی",
    nameEn: "Teal & Pearl",
    preview: "./assets/theme-teal-pearl.png",
    frame: "./assets/theme-frame-teal-pearl.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#0f4c5c",
      frameColor: "#d6c39a",
      paperStart: "#f9fcfb",
      paperMid: "#e7f0ee",
      paperEnd: "#cfe0dc",
      accent: "#d6c39a",
      titleColor: "#0f4c5c",
      inkColor: "#2f4a4f",
      mutedColor: "#5d7370",
      courseDateColor: "#9a8860",
      borderInnerColor: "#d6c39a",
      borderInnerWidth: 1.6,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#d6c39a",
      signatureColor: "#0f4c5c",
      flourishColor: "#d6c39a",
    }
  },
  {
    id: "espresso-gold",
    name: "اسپرسو طلایی",
    nameEn: "Espresso Gold",
    preview: "./assets/theme-espresso-gold.png",
    frame: "./assets/theme-frame-espresso-gold.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#2c2118",
      frameColor: "#c9a24b",
      paperStart: "#fffdf6",
      paperMid: "#f5ebd2",
      paperEnd: "#e4d2a4",
      accent: "#c9a24b",
      titleColor: "#2c2118",
      inkColor: "#4a3d2c",
      mutedColor: "#7a6a3c",
      courseDateColor: "#b8923c",
      borderInnerColor: "#c9a24b",
      borderInnerWidth: 2,
      outerPad: 22,
      framePad: 7,
      qrBorderColor: "#c9a24b",
      signatureColor: "#2c2118",
      flourishColor: "#c9a24b",
    }
  },
  {
    id: "navy-filigree",
    name: "نیروی دریایی فیلگری",
    nameEn: "Navy Filigree Art",
    preview: "./assets/theme-navy-filigree.png",
    frame: "./assets/theme-frame-navy-filigree.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#1a2744",
      frameColor: "#c9a24b",
      paperStart: "#fffdf6",
      paperMid: "#f4ebd2",
      paperEnd: "#e4d2a6",
      accent: "#c9a24b",
      titleColor: "#1a2744",
      inkColor: "#4a4a4a",
      mutedColor: "#7a6a3c",
      courseDateColor: "#b8923c",
      borderInnerColor: "#c9a24b",
      borderInnerWidth: 1.5,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#c9a24b",
      signatureColor: "#1a2744",
      flourishColor: "#c9a24b",
    }
  },
  {
    id: "emerald-atelier",
    name: "زمردی آتلیه",
    nameEn: "Emerald Atelier",
    preview: "./assets/theme-emerald-atelier.png",
    frame: "./assets/theme-frame-emerald-atelier.png",
    preferredLang: "en",
    preferredFont: "classic",
    preferredDir: "ltr",
    style: {
      outerBg: "#0f3d2e",
      frameColor: "#d4b56a",
      paperStart: "#fbfaf4",
      paperMid: "#f1ead4",
      paperEnd: "#e0d3aa",
      accent: "#d4b56a",
      titleColor: "#0f3d2e",
      inkColor: "#3d4a3f",
      mutedColor: "#6f7a55",
      courseDateColor: "#a88b3a",
      borderInnerColor: "#d4b56a",
      borderInnerWidth: 1.5,
      outerPad: 18,
      framePad: 5,
      qrBorderColor: "#d4b56a",
      signatureColor: "#0f3d2e",
      flourishColor: "#d4b56a",
    }
  },
  {
    id: "burgundy-atelier",
    name: "بورگاندی آتلیه",
    nameEn: "Burgundy Atelier",
    preview: "./assets/theme-burgundy-atelier.png",
    frame: "./assets/theme-frame-burgundy-atelier.png",
    preferredLang: "en",
    preferredFont: "playfair",
    preferredDir: "ltr",
    style: {
      outerBg: "#5c1a2e",
      frameColor: "#c9a088",
      paperStart: "#fff8f4",
      paperMid: "#f7e8e0",
      paperEnd: "#ebcfc2",
      accent: "#c9a088",
      titleColor: "#5c1a2e",
      inkColor: "#5a3f3f",
      mutedColor: "#8a6a62",
      courseDateColor: "#b07a6a",
      borderInnerColor: "#c9a088",
      borderInnerWidth: 1.8,
      outerPad: 20,
      framePad: 6,
      qrBorderColor: "#c9a088",
      signatureColor: "#5c1a2e",
      flourishColor: "#c9a088",
    }
  }
];
