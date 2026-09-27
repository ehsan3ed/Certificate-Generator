(() => {
  const STORAGE_KEY = "certificate-studio-v10";
  const CERT_W = 1123;
  const CERT_H = 794;
  const QR_PLACEHOLDER = "./assets/qr-placeholder.png";
  const PANDENIK_HOME = "https://pandenik.ir";
  const SECRET_STATE_KEYS = ["siteAuthToken"];

  const defaultStyle = () => structuredClone(CERT_THEMES[0].style);

  const defaults = {
    themeId: "classic-navy",
    uiLang: "fa",
    language: "fa",
    direction: "rtl",
    fontPack: "persian-elegant",
    title: CERT_LANGUAGES.fa.texts.title,
    recipientName: "هنرجو یا کارآموز",
    recipientPhone: "",
    courseDate: "تاریخ دوره",
    courseName: "نام دوره",
    duration: CERT_LANGUAGES.fa.texts.duration,
    auditFooterDate: "",
    auditFooterNote: "",
    instructorName: "مدرس",
    institutionName: "آکادمی",
    introText: CERT_LANGUAGES.fa.texts.introText,
    descriptionOne: CERT_LANGUAGES.fa.texts.descriptionOne,
    descriptionTwo: CERT_LANGUAGES.fa.texts.descriptionTwo,
    qrNotice: CERT_LANGUAGES.fa.texts.qrNotice,
    signatureCaption: CERT_LANGUAGES.fa.texts.signatureCaption,
    qrLeftUrl: "",
    qrRightUrl: "",
    qrLeftFromPage: false,
    qrLeftFromSite: false,
    issuedCertCode: "",
    recipientSavedInDb: false,
    siteAuthToken: "",
    siteApiBase: "",
    siteOrigin: "",
    canIssue: true,
    requireBlueTick: true,
    canOverrideQr: false,
    lockQrUrls: true,
    logoDataUrl: "",
    logoVisible: false,
    qrLeftVisible: true,
    qrRightVisible: true,
    logo: { x: 516, y: 82, size: 90, zIndex: 10 },
    qrLeft: { x: 72, y: 620, size: 110, zIndex: 10 },
    qrRight: { x: 940, y: 620, size: 110, zIndex: 10 },
    siteWatermarkEnabled: true,
    themeFrameEnabled: true,
    watermarkEnabled: false,
    watermarkDataUrl: "",
    watermarkOpacity: 0.1,
    watermarkSize: 480,
    showFlourishes: false,
    studentPhotoEnabled: false,
    studentPhotoDataUrl: "",
    studentPhotoCaption: CERT_LANGUAGES.fa.texts.studentPhotoCaption,
    studentPhoto: { x: 160, y: 300, size: 110, zIndex: 12 },
    instructorPhotoEnabled: false,
    instructorPhotoDataUrl: "",
    instructorPhotoCaption: CERT_LANGUAGES.fa.texts.instructorPhotoCaption,
    instructorPhoto: { x: 850, y: 300, size: 110, zIndex: 12 },
    stackTop: 40,
    style: defaultStyle(),
    icons: []
  };

  const els = {
    form: document.getElementById("certificate-form"),
    status: document.getElementById("save-status"),
    stage: document.getElementById("certificate-stage"),
    canvas: document.getElementById("certificate-canvas"),
    frame: document.getElementById("cert-frame"),
    paper: document.getElementById("cert-paper"),
    innerBorder: document.getElementById("inner-border"),
    logoWrap: document.getElementById("logo-wrap"),
    logoImage: document.getElementById("logo-image"),
    watermark: document.getElementById("watermark-image"),
    siteWatermark: document.getElementById("site-watermark"),
    themeFrame: document.getElementById("theme-frame"),
    siteWatermarkEnabled: document.getElementById("site-watermark-enabled"),
    qrLeft: document.getElementById("qr-left"),
    qrRight: document.getElementById("qr-right"),
    iconsLayer: document.getElementById("icons-layer"),
    iconsList: document.getElementById("icons-list"),
    themeGallery: document.getElementById("theme-gallery"),
    offlineBadge: document.getElementById("offline-badge"),
    themeLabel: document.getElementById("active-theme-label"),
    divider: document.getElementById("divider"),
    dividerDiamond: document.getElementById("divider-diamond"),
    signatureLine: document.getElementById("signature-line"),
    studentWrap: document.getElementById("student-photo-wrap"),
    instructorWrap: document.getElementById("instructor-photo-wrap"),
    studentPhoto: document.getElementById("student-photo"),
    instructorPhoto: document.getElementById("instructor-photo"),
    studentCaptionPreview: document.getElementById("student-photo-caption-preview"),
    instructorCaptionPreview: document.getElementById("instructor-photo-caption-preview"),
    language: document.getElementById("language"),
    direction: document.getElementById("direction"),
    fontPack: document.getElementById("font-pack"),
    languageChips: document.getElementById("language-chips"),
    fontChips: document.getElementById("font-chips"),
    quickLanguage: document.getElementById("quick-language"),
    quickFont: document.getElementById("quick-font"),
    layerPresets: document.getElementById("layer-presets"),
    layersList: document.getElementById("layers-list"),
    bgPresets: document.getElementById("bg-presets"),
    editMode: document.getElementById("edit-mode"),
    stageDropOverlay: document.getElementById("stage-drop-overlay"),
    iconDropZone: document.getElementById("icon-drop-zone"),
    qrLeftSource: document.getElementById("qr-left-source"),
    qrLeftFromPage: document.getElementById("qr-left-from-page"),
    fields: {
      title: document.getElementById("title"),
      recipientName: document.getElementById("recipient-name"),
      recipientPhone: document.getElementById("recipient-phone"),
      courseDate: document.getElementById("course-date"),
      courseName: document.getElementById("course-name"),
      duration: document.getElementById("duration"),
      instructorName: document.getElementById("instructor-name"),
      institutionName: document.getElementById("institution-name"),
      introText: document.getElementById("intro-text"),
      descriptionOne: document.getElementById("description-one"),
      descriptionTwo: document.getElementById("description-two"),
      qrNotice: document.getElementById("qr-notice-input"),
      signatureCaption: document.getElementById("signature-caption-input"),
      qrLeftUrl: document.getElementById("qr-left-url"),
      qrRightUrl: document.getElementById("qr-right-url"),
      studentPhotoCaption: document.getElementById("student-photo-caption"),
      instructorPhotoCaption: document.getElementById("instructor-photo-caption")
    },
    auditFooter: document.getElementById("audit-footer"),
    auditFooterDate: document.getElementById("audit-footer-date"),
    auditFooterNote: document.getElementById("audit-footer-note"),
    layout: {
      logoX: document.getElementById("logo-x"),
      logoY: document.getElementById("logo-y"),
      logoSize: document.getElementById("logo-size"),
      qrLeftX: document.getElementById("qr-left-x"),
      qrLeftY: document.getElementById("qr-left-y"),
      qrLeftSize: document.getElementById("qr-left-size"),
      qrRightX: document.getElementById("qr-right-x"),
      qrRightY: document.getElementById("qr-right-y"),
      qrRightSize: document.getElementById("qr-right-size"),
      watermarkEnabled: document.getElementById("watermark-enabled"),
      watermarkOpacity: document.getElementById("watermark-opacity"),
      watermarkSize: document.getElementById("watermark-size"),
      outerPad: document.getElementById("outer-pad"),
      framePad: document.getElementById("frame-pad"),
      borderWidth: document.getElementById("border-width"),
      showFlourishes: document.getElementById("show-flourishes"),
      themeFrameEnabled: document.getElementById("theme-frame-enabled"),
      studentPhotoEnabled: document.getElementById("student-photo-enabled"),
      studentX: document.getElementById("student-x"),
      studentY: document.getElementById("student-y"),
      studentSize: document.getElementById("student-size"),
      instructorPhotoEnabled: document.getElementById("instructor-photo-enabled"),
      instructorPhotoX: document.getElementById("instructor-photo-x"),
      instructorPhotoY: document.getElementById("instructor-photo-y"),
      instructorPhotoSize: document.getElementById("instructor-photo-size")
    },
    colors: {
      outer: document.getElementById("color-outer"),
      frame: document.getElementById("color-frame"),
      border: document.getElementById("color-border"),
      title: document.getElementById("color-title"),
      ink: document.getElementById("color-ink"),
      flourish: document.getElementById("color-flourish"),
      paperStart: document.getElementById("color-paper-start"),
      paperMid: document.getElementById("color-paper-mid"),
      paperEnd: document.getElementById("color-paper-end")
    },
    vals: {
      logoX: document.getElementById("logo-x-val"),
      logoY: document.getElementById("logo-y-val"),
      logoSize: document.getElementById("logo-size-val"),
      qrLeftX: document.getElementById("qr-left-x-val"),
      qrLeftY: document.getElementById("qr-left-y-val"),
      qrLeftSize: document.getElementById("qr-left-size-val"),
      qrRightX: document.getElementById("qr-right-x-val"),
      qrRightY: document.getElementById("qr-right-y-val"),
      qrRightSize: document.getElementById("qr-right-size-val"),
      watermarkOpacity: document.getElementById("watermark-opacity-val"),
      watermarkSize: document.getElementById("watermark-size-val"),
      outerPad: document.getElementById("outer-pad-val"),
      framePad: document.getElementById("frame-pad-val"),
      borderWidth: document.getElementById("border-width-val"),
      studentX: document.getElementById("student-x-val"),
      studentY: document.getElementById("student-y-val"),
      studentSize: document.getElementById("student-size-val"),
      instructorPhotoX: document.getElementById("instructor-photo-x-val"),
      instructorPhotoY: document.getElementById("instructor-photo-y-val"),
      instructorPhotoSize: document.getElementById("instructor-photo-size-val")
    },
    previews: {
      title: document.getElementById("title-preview"),
      recipientName: document.getElementById("recipient-preview"),
      courseDate: document.getElementById("course-date-preview"),
      courseName: document.getElementById("course-name-preview"),
      duration: document.getElementById("duration-preview"),
      instructorName: document.getElementById("instructor-preview"),
      institutionName: document.getElementById("institution-preview"),
      introText: document.getElementById("intro-preview"),
      descriptionOne: document.getElementById("description-one-preview"),
      descriptionTwo: document.getElementById("description-two-preview"),
      qrNotice: document.getElementById("qr-notice-preview"),
      signatureCaption: document.getElementById("signature-caption-preview")
    }
  };

  let state = structuredClone(defaults);
  let dragState = null;
  let syncingControls = false;

  function setStatus(message) {
    els.status.textContent = message || "";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function initSelects() {
    els.language.innerHTML = Object.values(CERT_LANGUAGES)
      .map((lang) => `<option value="${lang.id}">${lang.label}</option>`)
      .join("");
    els.fontPack.innerHTML = CERT_FONTS.map((font) => `<option value="${font.id}">${font.label}</option>`).join("");
  }

  function renderLanguageChips() {
    const make = (container) => {
      container.innerHTML = "";
      Object.values(CERT_LANGUAGES).forEach((lang) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `chip-btn${state.language === lang.id ? " active" : ""}`;
        btn.textContent = lang.label;
        btn.addEventListener("click", () => {
          applyLanguage(lang.id, true);
          populateForm(state);
          renderAll().then(() => {
            saveLocal(false);
            setStatus(`زبان به ${lang.label} تغییر کرد.`);
          });
        });
        container.appendChild(btn);
      });
    };
    make(els.languageChips);
    make(els.quickLanguage);
  }

  function renderDirectionChips() {
    document.querySelectorAll("[data-dir]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.dir === state.direction);
    });
  }

  function renderFontChips() {
    const samples = {
      classic: "Certificate",
      "persian-elegant": "گواهینامه",
      playfair: "Appreciation",
      modern: "Modern Cert"
    };
    const fill = (container, compact) => {
      container.innerHTML = "";
      CERT_FONTS.forEach((font) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = compact
          ? `chip-btn${state.fontPack === font.id ? " active" : ""}`
          : `font-chip${state.fontPack === font.id ? " active" : ""}`;
        if (compact) {
          btn.textContent = font.label.split(" ")[0];
        } else {
          btn.innerHTML = `<strong>${font.label}</strong><span style="font-family:${font.title}">${samples[font.id] || "Aa"}</span>`;
        }
        btn.addEventListener("click", () => {
          state.fontPack = font.id;
          els.fontPack.value = font.id;
          applyFontsAndDirection();
          renderFontChips();
          saveLocal(false);
          setStatus(`فونت «${font.label}» اعمال شد.`);
        });
        container.appendChild(btn);
      });
    };
    fill(els.fontChips, false);
    fill(els.quickFont, true);
  }

  function renderLayerPresets() {
    els.layerPresets.innerHTML = "";
    LAYER_PRESETS.forEach((preset) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "layer-preset-btn";
      btn.innerHTML = `<strong>${preset.name}</strong><span>${preset.desc}</span>`;
      btn.addEventListener("click", () => {
        preset.apply(state);
        if (preset.id === "rtl-fa-ready") {
          applyLanguage("fa", true);
          state.direction = "rtl";
          state.fontPack = "persian-elegant";
        }
        populateForm(state);
        renderAll().then(() => {
          saveLocal(false);
          setStatus(`لایه آماده «${preset.name}» اعمال شد.`);
        });
      });
      els.layerPresets.appendChild(btn);
    });
  }

  function renderBgPresets() {
    els.bgPresets.innerHTML = "";
    CERT_THEMES.forEach((theme) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `chip-btn${state.themeId === theme.id ? " active" : ""}`;
      btn.textContent = theme.name;
      btn.title = theme.nameEn;
      btn.addEventListener("click", () => {
        applyTheme(theme.id);
      });
      els.bgPresets.appendChild(btn);
    });
  }

  function renderLayersList() {
    const items = [
      {
        key: "logo",
        label: state.logoDataUrl ? "لوگوی کاربر" : "نشان پیش‌فرض",
        box: state.logo,
        visible: state.logoVisible === true,
        logoRemovable: true
      },
      {
        key: "qrLeft",
        label: "QR تایید اصالت — صفحه گواهینامه (چپ)",
        box: state.qrLeft,
        visible: state.qrLeftVisible !== false,
        qrToggle: "qrLeftVisible"
      },
      {
        key: "qrRight",
        label: "QR پروفایل مدرس (راست)",
        box: state.qrRight,
        visible: state.qrRightVisible !== false,
        qrToggle: "qrRightVisible"
      },
      {
        key: "studentPhoto",
        label: "عکس هنرجو",
        box: state.studentPhoto,
        visible: state.studentPhotoEnabled,
        toggle: "studentPhotoEnabled",
        clearPhoto: "student"
      },
      {
        key: "instructorPhoto",
        label: "عکس مدرس",
        box: state.instructorPhoto,
        visible: state.instructorPhotoEnabled,
        toggle: "instructorPhotoEnabled",
        clearPhoto: "instructor"
      },
      ...state.icons.map((icon) => ({
        key: "icon",
        id: icon.id,
        label: icon.name || "آیکون",
        box: icon,
        visible: true,
        removable: true
      }))
    ];

    els.layersList.innerHTML = "";
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "layer-item";
      row.innerHTML = `
        <div class="row">
          <div>
            <strong>${item.label}${item.visible === false ? " (مخفی)" : ""}</strong>
            <div class="meta">${Math.round(item.box.x)}, ${Math.round(item.box.y)} · ${item.box.size}px</div>
          </div>
          <div class="layer-actions"></div>
        </div>
      `;
      const actions = row.querySelector(".layer-actions");
      if (item.logoRemovable) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "chip-btn";
        removeBtn.textContent = "حذف";
        removeBtn.addEventListener("click", () => hideLogoCompletely());
        actions.appendChild(removeBtn);
        if (state.logoVisible !== true) {
          const showBtn = document.createElement("button");
          showBtn.type = "button";
          showBtn.className = "chip-btn";
          showBtn.textContent = "نمایش نشان";
          showBtn.addEventListener("click", () => {
            state.logoVisible = true;
            state.logoDataUrl = "";
            renderLogo();
            renderLayersList();
            saveLocal(false);
          });
          actions.appendChild(showBtn);
        }
      }
      if (item.qrToggle) {
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "chip-btn";
        toggleBtn.textContent = item.visible ? "حذف/مخفی" : "نمایش";
        toggleBtn.addEventListener("click", () => {
          state[item.qrToggle] = !state[item.qrToggle];
          renderQrVisibility();
          renderLayersList();
          saveLocal(false);
          setStatus(state[item.qrToggle] ? "QR نمایش داده شد." : "QR حذف/مخفی شد.");
        });
        actions.appendChild(toggleBtn);
      }
      if (item.toggle) {
        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "chip-btn";
        toggleBtn.textContent = item.visible ? "مخفی" : "نمایش";
        toggleBtn.addEventListener("click", () => {
          state[item.toggle] = !state[item.toggle];
          renderPhotos();
          renderLayersList();
          syncControlsFromState();
          saveLocal(false);
        });
        actions.appendChild(toggleBtn);
      }
      if (item.clearPhoto) {
        const clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.className = "chip-btn";
        clearBtn.textContent = "حذف عکس";
        clearBtn.addEventListener("click", () => {
          if (item.clearPhoto === "student") {
            state.studentPhotoDataUrl = "";
            state.studentPhotoEnabled = false;
            const input = document.getElementById("student-photo-file");
            if (input) input.value = "";
          } else {
            state.instructorPhotoDataUrl = "";
            state.instructorPhotoEnabled = false;
            const input = document.getElementById("instructor-photo-file");
            if (input) input.value = "";
          }
          renderPhotos();
          renderLayersList();
          syncControlsFromState();
          saveLocal(false);
          setStatus("عکس حذف شد.");
        });
        actions.appendChild(clearBtn);
      }
      if (item.removable) {
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "chip-btn";
        removeBtn.textContent = "حذف";
        removeBtn.addEventListener("click", () => {
          state.icons = state.icons.filter((icon) => icon.id !== item.id);
          renderIconsOnCanvas();
          renderIconsList();
          renderLayersList();
          saveLocal(false);
          setStatus("آیکون حذف شد.");
        });
        actions.appendChild(removeBtn);
      }
      const size = document.createElement("input");
      size.type = "range";
      size.className = "range";
      size.min = item.key === "logo" ? "40" : "48";
      size.max = item.key.includes("Photo") ? "180" : item.key === "logo" ? "180" : "140";
      size.value = String(item.box.size);
      size.addEventListener("input", () => {
        item.box.size = Number(size.value);
        if (item.key === "logo") {
          renderLogo();
        } else if (item.key === "qrLeft") {
          placeBox(els.qrLeft, state.qrLeft);
          els.qrLeft.style.height = `${state.qrLeft.size}px`;
          drawQr(els.qrLeft, state.qrLeftUrl, state.qrLeft.size);
        } else if (item.key === "qrRight") {
          placeBox(els.qrRight, state.qrRight);
          els.qrRight.style.height = `${state.qrRight.size}px`;
          drawQr(els.qrRight, state.qrRightUrl, state.qrRight.size);
        } else if (item.key === "studentPhoto" || item.key === "instructorPhoto") {
          renderPhotos();
        } else {
          renderIconsOnCanvas();
        }
        syncControlsFromState();
        const meta = row.querySelector(".meta");
        if (meta) meta.textContent = `${Math.round(item.box.x)}, ${Math.round(item.box.y)} · ${item.box.size}px`;
      });
      size.addEventListener("change", () => saveLocal(false));
      row.appendChild(size);
      els.layersList.appendChild(row);
    });
  }

  function valuesFromForm() {
    return {
      ...state,
      language: els.language.value || state.language,
      direction: els.direction.value || state.direction,
      fontPack: els.fontPack.value || state.fontPack,
      title: els.fields.title.value.trim() || defaults.title,
      recipientName: els.fields.recipientName.value.trim() || defaults.recipientName,
      recipientPhone: (els.fields.recipientPhone?.value || "").trim(),
      courseDate: els.fields.courseDate.value.trim() || defaults.courseDate,
      courseName: els.fields.courseName.value.trim() || defaults.courseName,
      duration: els.fields.duration.value.trim() || defaults.duration,
      instructorName: els.fields.instructorName.value.trim() || defaults.instructorName,
      institutionName: els.fields.institutionName.value.trim() || defaults.institutionName,
      introText: els.fields.introText.value.trim() || defaults.introText,
      descriptionOne: els.fields.descriptionOne.value.trim() || defaults.descriptionOne,
      descriptionTwo: els.fields.descriptionTwo.value.trim() || defaults.descriptionTwo,
      qrNotice: els.fields.qrNotice.value.trim() || defaults.qrNotice,
      signatureCaption: els.fields.signatureCaption.value.trim() || defaults.signatureCaption,
      qrLeftUrl: els.fields.qrLeftUrl.value.trim() || defaults.qrLeftUrl,
      qrRightUrl: els.fields.qrRightUrl.value.trim() || defaults.qrRightUrl,
      studentPhotoCaption: els.fields.studentPhotoCaption.value.trim() || defaults.studentPhotoCaption,
      instructorPhotoCaption: els.fields.instructorPhotoCaption.value.trim() || defaults.instructorPhotoCaption
    };
  }

  function populateForm(data) {
    els.language.value = data.language || "en";
    els.direction.value = data.direction || "ltr";
    els.fontPack.value = data.fontPack || "classic";
    Object.keys(els.fields).forEach((key) => {
      if (els.fields[key]) els.fields[key].value = data[key] ?? defaults[key] ?? "";
    });
  }

  function syncControlsFromState() {
    syncingControls = true;
    const s = state.style;
    els.layout.logoX.value = state.logo.x;
    els.layout.logoY.value = state.logo.y;
    els.layout.logoSize.value = state.logo.size;
    els.layout.qrLeftX.value = state.qrLeft.x;
    els.layout.qrLeftY.value = state.qrLeft.y;
    els.layout.qrLeftSize.value = state.qrLeft.size;
    els.layout.qrRightX.value = state.qrRight.x;
    els.layout.qrRightY.value = state.qrRight.y;
    els.layout.qrRightSize.value = state.qrRight.size;
    els.layout.watermarkEnabled.checked = !!state.watermarkEnabled;
    els.layout.watermarkOpacity.value = state.watermarkOpacity;
    els.layout.watermarkSize.value = state.watermarkSize;
    if (els.siteWatermarkEnabled) els.siteWatermarkEnabled.checked = state.siteWatermarkEnabled !== false;
    els.layout.outerPad.value = s.outerPad;
    els.layout.framePad.value = s.framePad;
    els.layout.borderWidth.value = s.borderInnerWidth;
    els.layout.showFlourishes.checked = state.showFlourishes === true;
    if (els.layout.themeFrameEnabled) els.layout.themeFrameEnabled.checked = state.themeFrameEnabled !== false;
    els.layout.studentPhotoEnabled.checked = !!state.studentPhotoEnabled;
    els.layout.studentX.value = state.studentPhoto.x;
    els.layout.studentY.value = state.studentPhoto.y;
    els.layout.studentSize.value = state.studentPhoto.size;
    els.layout.instructorPhotoEnabled.checked = !!state.instructorPhotoEnabled;
    els.layout.instructorPhotoX.value = state.instructorPhoto.x;
    els.layout.instructorPhotoY.value = state.instructorPhoto.y;
    els.layout.instructorPhotoSize.value = state.instructorPhoto.size;

    els.colors.outer.value = s.outerBg;
    els.colors.frame.value = s.frameColor;
    els.colors.border.value = s.borderInnerColor;
    els.colors.title.value = s.titleColor;
    els.colors.ink.value = s.inkColor;
    els.colors.flourish.value = s.flourishColor;
    els.colors.paperStart.value = s.paperStart;
    els.colors.paperMid.value = s.paperMid;
    els.colors.paperEnd.value = s.paperEnd;

    const map = {
      logoX: state.logo.x,
      logoY: state.logo.y,
      logoSize: state.logo.size,
      qrLeftX: state.qrLeft.x,
      qrLeftY: state.qrLeft.y,
      qrLeftSize: state.qrLeft.size,
      qrRightX: state.qrRight.x,
      qrRightY: state.qrRight.y,
      qrRightSize: state.qrRight.size,
      watermarkOpacity: `${Math.round(state.watermarkOpacity * 100)}%`,
      watermarkSize: `${state.watermarkSize}px`,
      outerPad: `${s.outerPad}px`,
      framePad: `${s.framePad}px`,
      borderWidth: `${s.borderInnerWidth}px`,
      studentX: state.studentPhoto.x,
      studentY: state.studentPhoto.y,
      studentSize: state.studentPhoto.size,
      instructorPhotoX: state.instructorPhoto.x,
      instructorPhotoY: state.instructorPhoto.y,
      instructorPhotoSize: state.instructorPhoto.size
    };
    Object.keys(els.vals).forEach((key) => {
      const value = map[key];
      els.vals[key].textContent = typeof value === "number" ? `${Math.round(value)}px` : value;
    });
    syncingControls = false;
  }

  function readStyleFromControls() {
    state.style.outerBg = els.colors.outer.value;
    state.style.frameColor = els.colors.frame.value;
    state.style.borderInnerColor = els.colors.border.value;
    state.style.titleColor = els.colors.title.value;
    state.style.inkColor = els.colors.ink.value;
    state.style.flourishColor = els.colors.flourish.value;
    state.style.paperStart = els.colors.paperStart.value;
    state.style.paperMid = els.colors.paperMid.value;
    state.style.paperEnd = els.colors.paperEnd.value;
    state.style.outerPad = Number(els.layout.outerPad.value);
    state.style.framePad = Number(els.layout.framePad.value);
    state.style.borderInnerWidth = Number(els.layout.borderWidth.value);
    state.style.accent = state.style.frameColor;
    state.style.qrBorderColor = state.style.frameColor;
    state.style.signatureColor = state.style.titleColor;
    state.style.courseDateColor = state.style.frameColor;
    state.style.mutedColor = state.style.inkColor;
  }

  function readLayoutFromControls() {
    state.logo.x = Number(els.layout.logoX.value);
    state.logo.y = Number(els.layout.logoY.value);
    state.logo.size = Number(els.layout.logoSize.value);
    state.qrLeft.x = Number(els.layout.qrLeftX.value);
    state.qrLeft.y = Number(els.layout.qrLeftY.value);
    state.qrLeft.size = Number(els.layout.qrLeftSize.value);
    state.qrRight.x = Number(els.layout.qrRightX.value);
    state.qrRight.y = Number(els.layout.qrRightY.value);
    state.qrRight.size = Number(els.layout.qrRightSize.value);
    state.watermarkEnabled = els.layout.watermarkEnabled.checked;
    state.watermarkOpacity = Number(els.layout.watermarkOpacity.value);
    state.watermarkSize = Number(els.layout.watermarkSize.value);
    if (els.siteWatermarkEnabled) state.siteWatermarkEnabled = els.siteWatermarkEnabled.checked;
    state.showFlourishes = els.layout.showFlourishes.checked;
    if (els.layout.themeFrameEnabled) state.themeFrameEnabled = els.layout.themeFrameEnabled.checked;
    state.studentPhotoEnabled = els.layout.studentPhotoEnabled.checked;
    state.studentPhoto.x = Number(els.layout.studentX.value);
    state.studentPhoto.y = Number(els.layout.studentY.value);
    state.studentPhoto.size = Number(els.layout.studentSize.value);
    state.instructorPhotoEnabled = els.layout.instructorPhotoEnabled.checked;
    state.instructorPhoto.x = Number(els.layout.instructorPhotoX.value);
    state.instructorPhoto.y = Number(els.layout.instructorPhotoY.value);
    state.instructorPhoto.size = Number(els.layout.instructorPhotoSize.value);
  }

  function fitCertificate() {
    const scale = Math.min(els.stage.clientWidth / CERT_W, 1);
    els.canvas.style.setProperty("--certificate-scale", String(scale));
    els.stage.style.height = `${CERT_H * scale}px`;
  }

  function t(key) {
    return typeof uiT === "function" ? uiT(state.uiLang || "fa", key) : key;
  }

  function isStandaloneMode() {
    return !String(state.siteAuthToken || "").trim();
  }

  function applyUiLanguage() {
    const lang = state.uiLang === "en" ? "en" : "fa";
    state.uiLang = lang;
    const pack = UI_I18N[lang] || UI_I18N.fa;
    document.documentElement.lang = pack.htmlLang || lang;
    document.documentElement.dir = pack.dir || (lang === "fa" ? "rtl" : "ltr");
    document.title = t("meta.title");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (!key) return;
      const value = t(key);
      if (node.tagName === "INPUT" || node.tagName === "TEXTAREA") {
        if (node.hasAttribute("placeholder")) node.placeholder = value;
      } else {
        node.textContent = value;
      }
    });
    document.querySelectorAll("[data-i18n-html]").forEach((node) => {
      const key = node.getAttribute("data-i18n-html");
      if (key) node.innerHTML = t(key);
    });

    const uiSelect = document.getElementById("ui-lang");
    if (uiSelect) uiSelect.value = lang;
    document.querySelectorAll("[data-ui-lang]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-ui-lang") === lang);
    });
    updateStandaloneFinalCard();
    updateOnlineBadge();
  }

  function updateStandaloneFinalCard() {
    const card = document.getElementById("final-issue-card");
    const linked = document.getElementById("final-linked-actions");
    const solo = document.getElementById("final-standalone-actions");
    if (!card) return;
    const standalone = isStandaloneMode();
    if (linked) linked.hidden = standalone;
    if (solo) solo.hidden = !standalone;
  }

  function showPlaceholderQr(target) {
    const img = document.createElement("img");
    img.src = QR_PLACEHOLDER;
    img.alt = "QR sample";
    img.width = 200;
    img.height = 200;
    img.style.cssText = "width:100%;height:100%;object-fit:contain;display:block;background:#fff;";
    target.appendChild(img);
  }

  async function drawQr(target, text, size) {
    target.innerHTML = "";
    const value = (text || "").trim();
    if (!value) {
      showPlaceholderQr(target);
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      const px = Math.max(220, Math.round(size * 3));
      await QRCode.toCanvas(canvas, value, {
        width: px,
        margin: 2,
        errorCorrectionLevel: "H",
        color: { dark: "#111111", light: "#ffffff" }
      });
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.imageRendering = "pixelated";
      target.appendChild(canvas);
    } catch (error) {
      showPlaceholderQr(target);
      console.error(error);
    }
  }

  function applyFontsAndDirection() {
    const font = CERT_FONTS.find((item) => item.id === state.fontPack) || CERT_FONTS[0];
    els.canvas.style.setProperty("--cert-title-font", font.title);
    els.canvas.style.setProperty("--cert-script-font", font.script);
    els.canvas.style.setProperty("--cert-body-font", font.body);
    els.canvas.setAttribute("dir", state.direction);
    els.canvas.classList.toggle("is-rtl", state.direction === "rtl");
    els.canvas.classList.toggle("is-ltr", state.direction === "ltr");
  }

  function applyThemeVisuals() {
    const s = state.style;
    const pad = s.outerPad;
    const frame = s.framePad;
    const paperLeft = pad + frame;
    const paperTop = pad + frame;
    const paperW = CERT_W - paperLeft * 2;
    const paperH = CERT_H - paperTop * 2;
    const innerInset = 28;

    els.canvas.style.background = s.outerBg;
    els.frame.style.left = `${pad}px`;
    els.frame.style.top = `${pad}px`;
    els.frame.style.width = `${CERT_W - pad * 2}px`;
    els.frame.style.height = `${CERT_H - pad * 2}px`;
    els.frame.style.background = s.frameColor;

    els.paper.style.left = `${paperLeft}px`;
    els.paper.style.top = `${paperTop}px`;
    els.paper.style.width = `${paperW}px`;
    els.paper.style.height = `${paperH}px`;
    els.paper.style.background = `radial-gradient(circle at 50% 34%, ${s.paperStart} 0%, ${s.paperMid} 58%, ${s.paperEnd} 100%)`;

    els.innerBorder.style.left = `${paperLeft + innerInset}px`;
    els.innerBorder.style.top = `${paperTop + innerInset}px`;
    els.innerBorder.style.width = `${paperW - innerInset * 2}px`;
    els.innerBorder.style.height = `${paperH - innerInset * 2}px`;
    els.innerBorder.style.border = `${Math.max(1, s.borderInnerWidth)}px solid ${s.borderInnerColor}`;
    els.innerBorder.style.boxShadow = `inset 0 0 0 1px ${s.borderInnerColor}55`;

    // قاب طلایی پایدارتر و نزدیک‌تر به پیش‌نمایش تم
    els.frame.style.boxShadow = `inset 0 0 0 ${Math.max(2, s.framePad)}px ${s.frameColor}`;

    document.querySelectorAll(".flourish").forEach((node) => {
      node.style.color = s.flourishColor;
    });

    els.canvas.classList.toggle(
      "hide-flourishes",
      state.showFlourishes !== true || state.themeFrameEnabled !== false
    );
    els.previews.title.style.color = s.titleColor;
    els.previews.recipientName.style.color = s.titleColor;
    els.previews.courseName.style.color = s.titleColor;
    els.previews.institutionName.style.color = s.titleColor;
    els.previews.instructorName.style.color = s.titleColor;
    els.previews.introText.style.color = s.inkColor;
    els.previews.descriptionOne.style.color = s.inkColor;
    els.previews.descriptionTwo.style.color = s.inkColor;
    els.previews.duration.style.color = s.mutedColor;
    els.previews.qrNotice.style.color = s.mutedColor;
    els.previews.courseDate.style.color = s.courseDateColor || s.frameColor;
    els.divider.style.background = s.accent;
    els.dividerDiamond.style.background = s.accent;
    els.signatureLine.style.background = s.signatureColor || s.titleColor;
    els.qrLeft.style.borderColor = s.qrBorderColor || s.frameColor;
    els.qrRight.style.borderColor = s.qrBorderColor || s.frameColor;

    const theme = CERT_THEMES.find((item) => item.id === state.themeId);
    const lang = CERT_LANGUAGES[state.language]?.label || state.language;
    els.themeLabel.textContent = theme
      ? `${theme.name} · ${lang} · ${state.direction.toUpperCase()}`
      : "Certificate Studio";
  }

  function placeBox(node, box) {
    node.style.left = `${box.x}px`;
    node.style.top = `${box.y}px`;
    node.style.width = `${box.size}px`;
    if (box.zIndex != null) node.style.zIndex = String(box.zIndex);
  }

  function nextStackZ() {
    state.stackTop = Math.max(40, Number(state.stackTop) || 40) + 1;
    return state.stackTop;
  }

  function bringToFront(box, node) {
    if (!box) return;
    box.zIndex = nextStackZ();
    if (node) node.style.zIndex = String(box.zIndex);
  }

  function placePhoto(wrap, img, box, enabled, dataUrl, caption, captionEl) {
    placeBox(wrap, box);
    wrap.style.height = "auto";
    const show = enabled && !!dataUrl;
    wrap.classList.toggle("visible", show);
    if (show) {
      img.src = dataUrl;
      captionEl.textContent = caption || "";
      img.style.borderColor = state.style.frameColor;
    } else {
      img.removeAttribute("src");
      captionEl.textContent = "";
    }
  }

  function hideLogoCompletely() {
    state.logoDataUrl = "";
    state.logoVisible = false;
    const input = document.getElementById("logo-file");
    if (input) input.value = "";
    renderLogo();
    renderLayersList();
    saveLocal(false);
    setStatus("لوگو/نشان پیش‌فرض کاملاً حذف شد و دیگر روی طرح‌ها نمی‌ماند.");
  }

  function renderLogo() {
    const visible = state.logoVisible === true;
    els.logoWrap.classList.toggle("is-hidden", !visible);
    els.logoWrap.hidden = !visible;
    els.logoWrap.style.setProperty("display", visible ? "grid" : "none", "important");
    if (!visible) {
      els.logoImage.removeAttribute("src");
      els.logoWrap.classList.remove("has-logo");
      return;
    }
    placeBox(els.logoWrap, state.logo);
    els.logoWrap.style.height = `${state.logo.size}px`;
    els.logoWrap.style.setProperty("--logo-scale", String(state.logo.size / 90));
    if (state.logoDataUrl) {
      els.logoImage.src = state.logoDataUrl;
      els.logoWrap.classList.add("has-logo");
    } else {
      els.logoImage.removeAttribute("src");
      els.logoWrap.classList.remove("has-logo");
    }
  }

  function renderQrVisibility() {
    const leftOn = state.qrLeftVisible !== false;
    const rightOn = state.qrRightVisible !== false;
    els.qrLeft.classList.toggle("is-hidden", !leftOn);
    els.qrRight.classList.toggle("is-hidden", !rightOn);
    els.qrLeft.hidden = !leftOn;
    els.qrRight.hidden = !rightOn;
    els.qrLeft.style.setProperty("display", leftOn ? "block" : "none", "important");
    els.qrRight.style.setProperty("display", rightOn ? "block" : "none", "important");
    if (leftOn) {
      placeBox(els.qrLeft, state.qrLeft);
      els.qrLeft.style.height = `${state.qrLeft.size}px`;
    }
    if (rightOn) {
      placeBox(els.qrRight, state.qrRight);
      els.qrRight.style.height = `${state.qrRight.size}px`;
    }
  }

  function renderThemeFrame() {
    if (!els.themeFrame) return;
    const theme = CERT_THEMES.find((item) => item.id === state.themeId);
    const src = theme?.frame || "";
    const on = state.themeFrameEnabled !== false && !!src;
    els.themeFrame.classList.toggle("is-off", !on);
    if (!on) {
      els.themeFrame.removeAttribute("src");
      els.themeFrame.style.display = "none";
      return;
    }
    if (els.themeFrame.getAttribute("src") !== src) els.themeFrame.src = src;
    els.themeFrame.style.display = "block";
  }

  function renderWatermarks() {
    renderThemeFrame();
    if (els.siteWatermark) {
      els.siteWatermark.src = SITE_LOGO;
      const on = state.siteWatermarkEnabled !== false;
      els.siteWatermark.classList.toggle("hidden", !on);
      els.siteWatermark.style.opacity = on ? "0.06" : "0";
      els.siteWatermark.style.display = on ? "block" : "none";
    }

    const hasCustom = state.watermarkEnabled && !!state.watermarkDataUrl;
    els.watermark.classList.toggle("visible", hasCustom);
    if (hasCustom) {
      els.watermark.src = state.watermarkDataUrl;
      els.watermark.style.opacity = String(state.watermarkOpacity);
      els.watermark.style.width = `${state.watermarkSize}px`;
      els.watermark.style.height = `${state.watermarkSize}px`;
      els.watermark.style.display = "block";
    } else {
      els.watermark.removeAttribute("src");
      els.watermark.style.opacity = "0";
      els.watermark.style.display = "none";
      els.watermark.classList.remove("visible");
    }
  }

  function renderPhotos() {
    placePhoto(
      els.studentWrap,
      els.studentPhoto,
      state.studentPhoto,
      state.studentPhotoEnabled,
      state.studentPhotoDataUrl,
      state.studentPhotoCaption,
      els.studentCaptionPreview
    );
    placePhoto(
      els.instructorWrap,
      els.instructorPhoto,
      state.instructorPhoto,
      state.instructorPhotoEnabled,
      state.instructorPhotoDataUrl,
      state.instructorPhotoCaption,
      els.instructorCaptionPreview
    );
  }

  function renderIconsOnCanvas() {
    els.iconsLayer.innerHTML = "";
    const ordered = [...state.icons].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    ordered.forEach((icon) => {
      const wrap = document.createElement("div");
      wrap.className = "extra-icon-wrap";
      wrap.style.left = `${icon.x}px`;
      wrap.style.top = `${icon.y}px`;
      wrap.style.width = `${icon.size}px`;
      wrap.style.height = `${icon.size}px`;
      wrap.style.zIndex = String(icon.zIndex || 50);
      wrap.dataset.id = icon.id;

      const img = document.createElement("img");
      img.src = icon.dataUrl;
      img.alt = icon.name || "icon";
      img.className = "extra-icon";
      img.dataset.id = icon.id;
      img.draggable = false;
      img.style.width = "100%";
      img.style.height = "100%";

      const del = document.createElement("button");
      del.type = "button";
      del.className = "layer-delete-btn no-print";
      del.title = "حذف آیکون";
      del.textContent = "×";
      del.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        state.icons = state.icons.filter((item) => item.id !== icon.id);
        renderIconsOnCanvas();
        renderIconsList();
        renderLayersList();
        saveLocal(false);
        setStatus("آیکون حذف شد.");
      });

      wrap.appendChild(del);
      wrap.appendChild(img);
      els.iconsLayer.appendChild(wrap);
    });
  }

  function renderIconsList() {
    els.iconsList.innerHTML = "";
    if (!state.icons.length) {
      const empty = document.createElement("p");
      empty.className = "empty-icons";
      empty.textContent = "هنوز آیکونی اضافه نشده است.";
      els.iconsList.appendChild(empty);
      return;
    }
    state.icons.forEach((icon) => {
      const row = document.createElement("div");
      row.className = "icon-item";
      row.innerHTML = `
        <img src="${icon.dataUrl}" alt="">
        <div class="meta"><div>${icon.name || "آیکون"}</div><div>${icon.size}px</div></div>
        <button type="button" data-remove="${icon.id}">حذف</button>
      `;
      const sizeInput = document.createElement("input");
      sizeInput.type = "range";
      sizeInput.min = "24";
      sizeInput.max = "120";
      sizeInput.value = String(icon.size);
      sizeInput.className = "range";
      sizeInput.style.gridColumn = "1 / -1";
      sizeInput.addEventListener("input", () => {
        icon.size = Number(sizeInput.value);
        renderIconsOnCanvas();
        renderIconsList();
        saveLocal(false);
      });
      row.appendChild(sizeInput);
      els.iconsList.appendChild(row);
    });
  }

  function renderPreview(data) {
    Object.keys(els.previews).forEach((key) => {
      els.previews[key].textContent = data[key] || defaults[key] || "";
    });
    renderAuditFooter(data);
  }

  function renderAuditFooter(data) {
    const dateEl = els.auditFooterDate;
    const noteEl = els.auditFooterNote;
    const wrap = els.auditFooter;
    if (!wrap || !dateEl || !noteEl) return;
    const dateText = (data.auditFooterDate || state.auditFooterDate || "").trim();
    const noteText = (data.auditFooterNote || state.auditFooterNote || "").trim();
    if (!dateText && !noteText) {
      wrap.hidden = true;
      dateEl.textContent = "";
      noteEl.textContent = "";
      return;
    }
    wrap.hidden = false;
    dateEl.textContent = dateText;
    noteEl.textContent = noteText;
  }

  function applyAuditFromServer(data) {
    const summary = Array.isArray(data?.auditSummary) ? data.auditSummary.filter(Boolean) : [];
    const last = summary.length ? summary[summary.length - 1] : "";
    const issuedAt = (data?.updatedAt || data?.issuedAt || "").toString().trim();
    const editor =
      (Array.isArray(data?.editLog) && data.editLog.length
        ? data.editLog[data.editLog.length - 1]?.byName
        : "") ||
      state.instructorName ||
      "مدرس";
    state.auditFooterDate = last
      ? `تاریخ ثبت/ویرایش: ${last.split(" — ")[0] || issuedAt}`
      : issuedAt
        ? `تاریخ ثبت: ${issuedAt}`
        : `تاریخ ثبت: ${new Date().toLocaleString("fa-IR")}`;
    state.auditFooterNote = last
      ? `ویرایش‌کننده: ${editor} — ${last.includes("(") ? last.slice(last.indexOf("(")) : "صدور/به‌روزرسانی گواهینامه"}`
      : `ویرایش‌کننده: ${editor} — صدور اولیه گواهینامه`;
    renderAuditFooter(state);
  }

  function renderThemeGallery() {
    els.themeGallery.innerHTML = "";
    CERT_THEMES.forEach((theme) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `theme-card${state.themeId === theme.id ? " active" : ""}`;
      btn.innerHTML = `
        <img src="${theme.preview}" alt="${theme.nameEn}" loading="lazy">
        <div>
          <strong>${theme.name}</strong>
          <span>${theme.nameEn} · ${theme.preferredDir.toUpperCase()} · ${CERT_LANGUAGES[theme.preferredLang]?.label || ""}</span>
        </div>
      `;
      btn.addEventListener("click", () => applyTheme(theme.id));
      els.themeGallery.appendChild(btn);
    });
  }

  function renderPresetLogos() {
    /* removed: only Pandenik site watermark + user logo upload remain */
  }

  async function renderAll() {
    renderPreview(state);
    applyFontsAndDirection();
    applyThemeVisuals();
    renderLogo();
    renderQrVisibility();
    renderWatermarks();
    renderPhotos();
    renderIconsOnCanvas();
    renderIconsList();
    renderThemeGallery();
    renderLanguageChips();
    renderDirectionChips();
    renderFontChips();
    renderLayerPresets();
    renderBgPresets();
    renderLayersList();
    syncControlsFromState();
    els.canvas.classList.toggle("edit-mode", els.editMode?.checked !== false);
    const tasks = [];
    if (state.qrLeftVisible !== false) {
      tasks.push(drawQr(els.qrLeft, state.qrLeftUrl, state.qrLeft.size));
    }
    if (state.qrRightVisible !== false) {
      tasks.push(drawQr(els.qrRight, state.qrRightUrl, state.qrRight.size));
    }
    await Promise.all(tasks);
  }

  function saveLocal(showMessage = true) {
    const toSave = structuredClone(state);
    SECRET_STATE_KEYS.forEach((key) => {
      toSave[key] = "";
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    if (showMessage) setStatus(t("status.ready"));
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const merged = {
        ...structuredClone(defaults),
        ...parsed,
        logo: { ...defaults.logo, ...(parsed.logo || {}) },
        qrLeft: { ...defaults.qrLeft, ...(parsed.qrLeft || {}) },
        qrRight: { ...defaults.qrRight, ...(parsed.qrRight || {}) },
        studentPhoto: { ...defaults.studentPhoto, ...(parsed.studentPhoto || {}) },
        instructorPhoto: { ...defaults.instructorPhoto, ...(parsed.instructorPhoto || {}) },
        style: { ...defaultStyle(), ...(parsed.style || {}) },
        icons: Array.isArray(parsed.icons) ? parsed.icons : []
      };
      SECRET_STATE_KEYS.forEach((key) => {
        merged[key] = "";
      });
      // پاک‌سازی لینک‌های خطرناک ذخیره‌شده (استودیو به‌جای /c/...)
      if (!isPublicCertUrl(merged.qrLeftUrl)) {
        merged.qrLeftUrl = "";
        merged.qrLeftFromPage = false;
        merged.qrLeftFromSite = false;
      }
      const banned = [/maryam/i, /taghipour/i, /yousefi/i, /sara\s+yousefi/i, /تقی\s*پور/, /یوسفی\s*پور/];
      if (banned.some((re) => re.test(String(merged.recipientName || "")))) {
        merged.recipientName = defaults.recipientName;
      }
      if (banned.some((re) => re.test(String(merged.instructorName || "")))) {
        merged.instructorName = defaults.instructorName;
      }
      if (merged.issuedCertCode && normalizePhoneClient(merged.recipientPhone || "")) {
        merged.recipientSavedInDb = true;
      }
      return merged;
    } catch {
      return null;
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function updateOnlineBadge() {
    const online = navigator.onLine;
    els.offlineBadge.textContent = online ? t("status.online") : t("status.offline");
    els.offlineBadge.classList.toggle("is-offline", !online);
  }

  function updateQrLockUi() {
    const locked = state.lockQrUrls !== false && !state.canOverrideQr;
    if (els.fields.qrLeftUrl) {
      els.fields.qrLeftUrl.readOnly = locked || !!state.qrLeftFromSite || !!state.qrLeftFromPage;
      els.fields.qrLeftUrl.title = locked
        ? "لینک QR چپ فقط پس از تولید اعتبار تنظیم می‌شود"
        : "";
    }
    if (els.fields.qrRightUrl) {
      els.fields.qrRightUrl.readOnly = locked;
      els.fields.qrRightUrl.title = locked
        ? "لینک QR راست از هویت شماست و قابل تغییر نیست"
        : "ادمین می‌تواند لینک را تغییر دهد";
    }
    document.querySelectorAll(".admin-only-qr").forEach((el) => {
      el.hidden = locked;
    });
    updateQrLeftSourceHint();
  }

  function setRightIdentityUrl(url, force = false) {
    const value = (url || "").trim();
    if (!value) return;
    if (!force && state.lockQrUrls !== false && !state.canOverrideQr && state.qrRightUrl) {
      return;
    }
    state.qrRightUrl = value;
    if (els.fields.qrRightUrl) els.fields.qrRightUrl.value = value;
    state.qrRightVisible = true;
    updateQrLockUi();
    drawQr(els.qrRight, state.qrRightUrl, state.qrRight.size);
  }

  function updateQrLeftSourceHint() {
    if (!els.qrLeftSource) return;
    if (state.qrLeftFromSite) {
      els.qrLeftSource.textContent = "منبع: صفحه اختصاصی گواهینامه در پندنیک (قفل‌شده).";
    } else if (state.qrLeftFromPage) {
      els.qrLeftSource.textContent = "منبع: آدرس همین صفحه (فقط ادمین).";
    } else if (state.lockQrUrls !== false && !state.canOverrideQr) {
      els.qrLeftSource.textContent = "هنوز صادر نشده — بعد از «تولید QR اعتبار» اینجا پر می‌شود.";
    } else {
      els.qrLeftSource.textContent = "منبع: ورود دستی / ادمین.";
    }
    if (els.qrLeftFromPage) els.qrLeftFromPage.checked = !!state.qrLeftFromPage;
  }

  function normalizePhoneClient(raw) {
    const map = {
      "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
      "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
      "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
      "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
    };
    let s = String(raw || "").trim().replace(/[۰-۹٠-٩]/g, (ch) => map[ch] || ch);
    s = s.replace(/\D+/g, "");
    if (s.startsWith("0098")) s = s.slice(2);
    if (s.startsWith("98") && s.length === 12) return s;
    if (s.startsWith("0") && s.length === 11 && s[1] === "9") return `98${s.slice(1)}`;
    if (s.startsWith("9") && s.length === 10) return `98${s}`;
    if (s.length >= 10 && s.length <= 15) return s;
    return "";
  }

  function displayPhoneClient(normalized) {
    const s = String(normalized || "");
    if (s.startsWith("98") && s.length === 12) return `0${s.slice(2)}`;
    return s;
  }

  function buildCertificatePayload() {
    state = valuesFromForm();
    const phoneNorm = normalizePhoneClient(state.recipientPhone);
    return {
      code: state.issuedCertCode || undefined,
      recipientName: state.recipientName,
      recipientPhone: phoneNorm || state.recipientPhone,
      instructorName: state.instructorName,
      institutionName: state.institutionName,
      courseName: state.courseName,
      courseDate: state.courseDate,
      title: state.title,
      duration: state.duration,
      introText: state.introText,
      descriptionOne: state.descriptionOne,
      descriptionTwo: state.descriptionTwo,
      signatureCaption: state.signatureCaption,
      qrNotice: state.qrNotice,
      instructorProfileUrl: state.canOverrideQr ? state.qrRightUrl : undefined,
      instructorUrl: state.canOverrideQr ? state.qrRightUrl : undefined
    };
  }

  function validateRecipientForSave() {
    state = valuesFromForm();
    if (!String(state.recipientName || "").trim()) {
      window.alert("نام هنرجو را وارد کنید.");
      els.fields.recipientName?.focus();
      return null;
    }
    const phoneNorm = normalizePhoneClient(state.recipientPhone);
    if (!phoneNorm) {
      window.alert("شماره تماس معتبر وارد کنید.\nمثال: 09121234567\n(ارقام فارسی هم قبول است)");
      els.fields.recipientPhone?.focus();
      return null;
    }
    state.recipientPhone = displayPhoneClient(phoneNorm);
    if (els.fields.recipientPhone) els.fields.recipientPhone.value = state.recipientPhone;
    return phoneNorm;
  }

  async function saveRecipientInfo() {
    const phoneNorm = validateRecipientForSave();
    if (!phoneNorm) return;

    const token = resolveAuthToken();
    if (!token) {
      try {
        window.parent?.postMessage({ type: "certificate-studio:need-login" }, "*");
      } catch {
        /* ignore */
      }
      window.alert("برای ذخیره اطلاعات هنرجو وارد حساب پندنیک شوید.");
      return;
    }
    if (state.requireBlueTick && state.canIssue === false) {
      try {
        window.parent?.postMessage({ type: "certificate-studio:need-blue-tick" }, "*");
      } catch {
        /* ignore */
      }
      window.alert("برای ذخیره و صدور به تیک آبی نیاز است.");
      return;
    }

    const btn = document.getElementById("save-recipient-button");
    const statusEl = document.getElementById("recipient-save-status");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "در حال ذخیره…";
    }
    setStatus("در حال ذخیره اطلاعات هنرجو در سامانه…");
    if (statusEl) statusEl.textContent = "در حال ارسال…";

    try {
      const apiBase = resolveApiBase();
      const payload = buildCertificatePayload();
      payload.recipientPhone = phoneNorm;
      const res = await fetch(`${apiBase}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Auth-Token": token
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || `خطای سرور (${res.status})`);
      }
      state.issuedCertCode = data.code || state.issuedCertCode || "";
      state.recipientSavedInDb = true;
      state.recipientPhone = displayPhoneClient(phoneNorm);
      if (els.fields.recipientPhone) els.fields.recipientPhone.value = state.recipientPhone;
      applyAuditFromServer(data);
      saveLocal(false);
      updateIssueButtonState();
      const msg = `اطلاعات هنرجو ذخیره شد — کد ${state.issuedCertCode}. حالا می‌توانید QR اعتبار را تولید کنید.`;
      setStatus(msg);
      if (statusEl) {
        statusEl.textContent = msg;
        statusEl.style.color = "#047857";
      }
      try {
        window.parent?.postMessage({ type: "certificate-studio:issued", code: data.code }, "*");
      } catch {
        /* ignore */
      }
    } catch (err) {
      console.error(err);
      state.recipientSavedInDb = false;
      updateIssueButtonState();
      setStatus(`خطا در ذخیره: ${err.message || err}`);
      if (statusEl) {
        statusEl.textContent = err.message || "ذخیره ناموفق";
        statusEl.style.color = "#b91c1c";
      }
      window.alert(err.message || "ذخیره اطلاعات هنرجو ناموفق بود");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "ذخیره اطلاعات هنرجو";
      }
    }
  }

  function updateIssueButtonState() {
    const btn = document.getElementById("issue-left-qr-button");
    const note = document.getElementById("issue-blue-tick-note");
    const needRec = document.getElementById("issue-need-recipient-note");
    const blockedTick = state.requireBlueTick && state.canIssue === false;
    const needSave = !state.recipientSavedInDb || !state.issuedCertCode;
    updateStandaloneFinalCard();
    if (btn) {
      if (isStandaloneMode()) {
        btn.disabled = true;
        btn.classList.add("is-locked");
        btn.title = t("alert.needPandenik");
        if (!btn.dataset.busy) btn.textContent = t("final.cta");
      } else {
        btn.disabled = blockedTick || needSave;
        btn.classList.toggle("is-locked", blockedTick || needSave);
        btn.title = blockedTick
          ? "برای صدور به تیک آبی نیاز است"
          : needSave
            ? "ابتدا اطلاعات هنرجو را ذخیره کنید"
            : "صفحه اختصاصی + QR چپ + ذخیره تصویر نهایی";
        if (!btn.dataset.busy) {
          btn.textContent = "تولید QR اعتبار و ثبت گواهینامه";
        }
      }
    }
    if (note) note.hidden = isStandaloneMode() || !blockedTick;
    if (needRec) needRec.hidden = isStandaloneMode() || blockedTick || !needSave;
    updateQrLockUi();
  }

  async function captureCertificatePngDataUrl() {
    const scale = Number(getComputedStyle(els.canvas).getPropertyValue("--certificate-scale")) || 1;
    const shot = await html2canvas(els.canvas, {
      backgroundColor: null,
      scale: 2 / scale,
      useCORS: true,
      logging: false
    });
    return shot.toDataURL("image/png");
  }

  async function issueAuthenticityQr() {
    if (state.requireBlueTick && state.canIssue === false) {
      setStatus("برای ایجاد گواهینامه به تیک آبی نیاز است.");
      try {
        window.parent?.postMessage({ type: "certificate-studio:need-blue-tick" }, "*");
      } catch {
        /* ignore */
      }
      window.alert(
        "مشاهده سازنده برای همه آزاد است.\n\nبرای ایجاد گواهینامه باید تیک آبی داشته باشید."
      );
      return;
    }

    if (!state.qrRightUrl && !state.canOverrideQr) {
      window.alert("لینک هویت مدرس (QR راست) هنوز از پروفایل/کارت شما دریافت نشده. وارد حساب پندنیک شوید و صفحه را تازه کنید.");
      try {
        window.parent?.postMessage({ type: "certificate-studio:need-login" }, "*");
      } catch {
        /* ignore */
      }
      return;
    }

    const confirmed = window.confirm(
      "گواهینامه ثبت می‌شود:\n" +
        "• QR چپ = فقط آدرس اختصاصی همین گواهینامه\n" +
        "• QR راست = هویت شما (پروفایل/کارت) — بدون تغییر لینک\n" +
        "• تصویر نهایی روی صفحه اختصاصی ذخیره می‌شود (دانلود فقط برای مالک)\n\nادامه؟"
    );
    if (!confirmed) {
      setStatus("تولید لغو شد.");
      return;
    }

    const token = resolveAuthToken();
    if (!token) {
      setStatus("برای صدور وارد حساب پندنیک شوید.");
      try {
        window.parent?.postMessage({ type: "certificate-studio:need-login" }, "*");
      } catch {
        /* ignore */
      }
      window.alert("لطفاً ابتدا وارد حساب پندنیک شوید.");
      return;
    }

    state = valuesFromForm();
    if (!state.recipientSavedInDb || !state.issuedCertCode) {
      setStatus("ابتدا اطلاعات هنرجو را ذخیره کنید.");
      window.alert("ابتدا دکمه «ذخیره اطلاعات هنرجو» را بزنید.");
      document.getElementById("save-recipient-button")?.focus();
      return;
    }
    const phoneNorm = normalizePhoneClient(state.recipientPhone);
    if (!phoneNorm) {
      setStatus("شماره تماس هنرجو نامعتبر است.");
      window.alert("شماره تماس معتبر وارد کنید (مثال: 09121234567).");
      els.fields.recipientPhone?.focus();
      return;
    }
    // کاربر عادی نتواند از فرم لینک راست را عوض کند
    if (state.lockQrUrls !== false && !state.canOverrideQr) {
      /* keep state.qrRightUrl as already set from site */
    }

    const btn = document.getElementById("issue-left-qr-button");
    if (btn) {
      btn.disabled = true;
      btn.dataset.busy = "1";
      btn.textContent = "در حال صدور…";
    }
    setStatus("در حال ساخت صفحه اختصاصی…");

    try {
      const apiBase = resolveApiBase();
      const payload = buildCertificatePayload();
      payload.recipientPhone = phoneNorm;
      payload.code = state.issuedCertCode;
      const res = await fetch(`${apiBase}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Auth-Token": token
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || `خطای سرور (${res.status})`);
      }

      const verifyUrl = data.verifyUrl || data.qrLeftUrl;
      if (!verifyUrl || !isPublicCertUrl(verifyUrl)) {
        throw new Error("لینک تأیید نامعتبر است (باید فقط /c/PN-... باشد، نه استودیو)");
      }

      state.issuedCertCode = data.code || state.issuedCertCode || "";
      state.qrLeftVisible = true;
      state.qrRightVisible = true;
      applyAuditFromServer(data);

      if (data.qrRightUrl) {
        setRightIdentityUrl(data.qrRightUrl, true);
      }

      if (!setAuthenticityUrl(verifyUrl, "site")) {
        throw new Error("ثبت QR اصالت ناموفق بود");
      }
      // اطمینان از رندر کامل QR قبل از ذخیره تصویر
      await drawQr(els.qrLeft, state.qrLeftUrl, state.qrLeft.size);
      if (state.qrRightUrl) {
        await drawQr(els.qrRight, state.qrRightUrl, state.qrRight.size);
      }
      await new Promise((r) => setTimeout(r, 120));

      setStatus("در حال ذخیره تصویر نهایی روی صفحه اختصاصی…");
      const png = await captureCertificatePngDataUrl();
      const imgRes = await fetch(`${apiBase}/certificates/${encodeURIComponent(state.issuedCertCode)}/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Auth-Token": token
        },
        body: JSON.stringify({ image: png })
      });
      const imgData = await imgRes.json().catch(() => ({}));
      if (!imgRes.ok) {
        throw new Error(imgData.error || imgData.message || "ذخیره تصویر نهایی ناموفق بود");
      }

      saveLocal(false);
      const linkEl = document.getElementById("issued-cert-link");
      if (linkEl) {
        linkEl.hidden = false;
        linkEl.innerHTML = `صفحه اختصاصی تصویر نهایی: <a href="${verifyUrl}" target="_blank" rel="noopener">${verifyUrl}</a>`;
      }
      try {
        window.parent?.postMessage({ type: "certificate-studio:issued", code: data.code, verifyUrl }, "*");
      } catch {
        /* ignore */
      }
      setStatus(`آماده شد — کد ${data.code}. QR چپ فقط به صفحه تصویر نهایی وصل است.`);
    } catch (err) {
      console.error(err);
      setStatus(`خطا: ${err.message || err}`);
      window.alert(err.message || "صدور ناموفق بود");
    } finally {
      if (btn) {
        btn.disabled = false;
        delete btn.dataset.busy;
        btn.textContent = "تولید QR اعتبار و ثبت گواهینامه";
      }
      updateIssueButtonState();
    }
  }

  function resolveApiBase() {
    const cfg = window.CertificateStudioConfig || {};
    if (state.siteApiBase) return String(state.siteApiBase).replace(/\/$/, "");
    if (cfg.apiBase) return String(cfg.apiBase).replace(/\/$/, "");
    if (/pandenik\.ir$/i.test(window.location.hostname) || window.location.pathname.includes("/certificate-studio")) {
      return `${window.location.origin}/api`;
    }
    return `${window.location.origin}/api`;
  }

  function resolveAuthToken() {
    const cfg = window.CertificateStudioConfig || {};
    if (state.siteAuthToken) return state.siteAuthToken;
    if (cfg.authToken) return String(cfg.authToken);
    try {
      const t = window.parent?.localStorage?.getItem("auth_token");
      if (t) return t;
    } catch {
      /* ignore cross-origin */
    }
    try {
      return localStorage.getItem("auth_token") || "";
    } catch {
      return "";
    }
  }

  function isPublicCertUrl(url) {
    const u = String(url || "").trim();
    if (/^https?:\/\/[^/]+\/c\/PN-[A-Z0-9]{6,16}\/?$/i.test(u)) return true;
    if (/^https?:\/\/[^/]+\/card\/[^/]+\/c\/\d+\/?$/i.test(u)) return true;
    if (/^https?:\/\/[^/]+\/u\/[^/]+\/c\/\d+\/?$/i.test(u)) return true;
    if (/^https?:\/\/[^/]+\/card\/[^/]+\/[a-z0-9]{3,8}\/?$/i.test(u)) return true;
    if (/^https?:\/\/[^/]+\/u\/[^/]+\/[a-z0-9]{3,8}\/?$/i.test(u)) return true;
    return false;
  }

  function isStudioOrCertificatesUrl(url) {
    const u = String(url || "").toLowerCase();
    return u.includes("/certificate-studio") || /\/certificates\/?(\?|$)/.test(u);
  }

  function setAuthenticityUrl(url, source = "manual") {
    const value = (url || "").trim();
    // هرگز آدرس استودیو/سازنده را در QR چپ نگذار
    if (!value || isStudioOrCertificatesUrl(value) || !isPublicCertUrl(value)) {
      if (value) console.warn("rejected authenticity URL", value);
      if (!isPublicCertUrl(state.qrLeftUrl)) {
        state.qrLeftUrl = "";
        state.qrLeftFromSite = false;
        state.qrLeftFromPage = false;
        if (els.fields.qrLeftUrl) els.fields.qrLeftUrl.value = "";
        drawQr(els.qrLeft, "", state.qrLeft.size);
      }
      updateQrLockUi();
      return false;
    }
    state.qrLeftUrl = value;
    state.qrLeftFromSite = source === "site" || source === "page";
    state.qrLeftFromPage = false;
    if (els.fields.qrLeftUrl) els.fields.qrLeftUrl.value = value;
    updateQrLockUi();
    drawQr(els.qrLeft, state.qrLeftUrl, state.qrLeft.size);
    return true;
  }

  function readSiteIntegration() {
    const params = new URLSearchParams(window.location.search);
    const cfg = window.CertificateStudioConfig || {};

    if (params.has("canIssue")) {
      state.canIssue = params.get("canIssue") === "1" || params.get("canIssue") === "true";
    } else if (typeof cfg.canIssue === "boolean") {
      state.canIssue = cfg.canIssue;
    }
    if (typeof cfg.requireBlueTick === "boolean") state.requireBlueTick = cfg.requireBlueTick;
    if (params.has("canOverrideQr")) {
      state.canOverrideQr = params.get("canOverrideQr") === "1" || params.get("canOverrideQr") === "true";
    } else if (typeof cfg.canOverrideQr === "boolean") {
      state.canOverrideQr = cfg.canOverrideQr;
    }
    if (params.has("lockQrUrls")) {
      state.lockQrUrls = params.get("lockQrUrls") !== "0" && params.get("lockQrUrls") !== "false";
    } else if (typeof cfg.lockQrUrls === "boolean") {
      state.lockQrUrls = cfg.lockQrUrls;
    }

    const authenticityUrl =
      params.get("certUrl") ||
      params.get("verifyUrl") ||
      params.get("certificateUrl") ||
      params.get("authenticityUrl") ||
      cfg.authenticityUrl ||
      cfg.certUrl ||
      cfg.verifyUrl ||
      "";

    const rightUrl =
      params.get("rightQrUrl") ||
      params.get("instructorUrl") ||
      cfg.rightQrUrl ||
      cfg.instructorUrl ||
      "";

    // برای کاربر عادی فقط اگر از قبل صادر نشده، QR چپ خالی بماند
    if (authenticityUrl && (state.canOverrideQr || state.issuedCertCode)) {
      setAuthenticityUrl(authenticityUrl, "site");
    }

    if (rightUrl) {
      setRightIdentityUrl(rightUrl, true);
    }

    if (cfg.instructorName && els.fields.instructorName && !els.fields.instructorName.value) {
      state.instructorName = cfg.instructorName;
      els.fields.instructorName.value = cfg.instructorName;
    }

    const map = {
      recipientName: ["recipient", "name", "studentName"],
      instructorName: ["instructor", "teacher"],
      institutionName: ["institution", "academy"],
      courseName: ["course", "courseName"],
      courseDate: ["date", "courseDate"],
      title: ["title"]
    };
    Object.keys(map).forEach((field) => {
      for (const key of map[field]) {
        const value = params.get(key) || cfg[key];
        if (value) {
          state[field] = value;
          if (els.fields[field]) els.fields[field].value = value;
          break;
        }
      }
    });

    const editCode = (params.get("edit") || params.get("code") || "").trim().toUpperCase();
    if (editCode && /^PN-[A-Z0-9]{6,16}$/.test(editCode)) {
      loadCertificateForEdit(editCode).catch(console.error);
    } else {
      updateIssueButtonState();
    }
  }

  async function loadCertificateForEdit(code) {
    const token = resolveAuthToken();
    if (!token) {
      updateIssueButtonState();
      return;
    }
    setStatus(`بارگذاری گواهی ${code} برای ویرایش…`);
    try {
      const apiBase = resolveApiBase();
      const res = await fetch(`${apiBase}/certificates/${encodeURIComponent(code)}`, {
        headers: { Authorization: `Bearer ${token}`, "X-Auth-Token": token }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || "بارگذاری ناموفق");
      state.issuedCertCode = data.code || code;
      state.recipientSavedInDb = true;
      if (data.recipientName && els.fields.recipientName) {
        state.recipientName = data.recipientName;
        els.fields.recipientName.value = data.recipientName;
      }
      if (data.recipientPhone && els.fields.recipientPhone) {
        const disp = displayPhoneClient(data.recipientPhone);
        state.recipientPhone = disp;
        els.fields.recipientPhone.value = disp;
      }
      if (data.instructorName && els.fields.instructorName) {
        state.instructorName = data.instructorName;
        els.fields.instructorName.value = data.instructorName;
      }
      if (data.institutionName && els.fields.institutionName) {
        state.institutionName = data.institutionName;
        els.fields.institutionName.value = data.institutionName;
      }
      if (data.courseName && els.fields.courseName) {
        state.courseName = data.courseName;
        els.fields.courseName.value = data.courseName;
      }
      if (data.courseDate && els.fields.courseDate) {
        state.courseDate = data.courseDate;
        els.fields.courseDate.value = data.courseDate;
      }
      if (data.title && els.fields.title) {
        state.title = data.title;
        els.fields.title.value = data.title;
      }
      if (data.duration && els.fields.duration) {
        state.duration = data.duration;
        els.fields.duration.value = data.duration;
      }
      if (data.verifyUrl) setAuthenticityUrl(data.verifyUrl, "site");
      applyAuditFromServer(data);
      saveLocal(false);
      setStatus(`آماده ویرایش — شماره گواهی ${data.seqNo || data.code}`);
    } catch (err) {
      console.error(err);
      setStatus(`خطا در بارگذاری ویرایش: ${err.message || err}`);
    }
    updateIssueButtonState();
  }

  function setupSiteQrBridge() {
    window.addEventListener("message", (event) => {
      const data = event.data;
      if (!data || data.type !== "certificate-studio:set") return;
      const payload = data.payload || {};
      if (payload.apiBase) state.siteApiBase = String(payload.apiBase);
      if (payload.authToken) state.siteAuthToken = String(payload.authToken);
      if (payload.siteOrigin) state.siteOrigin = String(payload.siteOrigin);
      if (typeof payload.canIssue === "boolean") state.canIssue = payload.canIssue;
      if (typeof payload.requireBlueTick === "boolean") state.requireBlueTick = payload.requireBlueTick;
      if (typeof payload.canOverrideQr === "boolean") state.canOverrideQr = payload.canOverrideQr;
      if (typeof payload.lockQrUrls === "boolean") state.lockQrUrls = payload.lockQrUrls;

      if (payload.rightQrUrl || payload.instructorUrl) {
        setRightIdentityUrl(payload.rightQrUrl || payload.instructorUrl, true);
      }
      if (payload.instructorName && els.fields.instructorName) {
        state.instructorName = String(payload.instructorName);
        els.fields.instructorName.value = state.instructorName;
      }
      // QR چپ فقط اگر ادمین override کند یا قبلاً صادر شده
      if ((payload.authenticityUrl || payload.certUrl || payload.verifyUrl) && state.canOverrideQr) {
        setAuthenticityUrl(payload.authenticityUrl || payload.certUrl || payload.verifyUrl, "site");
      }

      updateIssueButtonState();
      saveLocal(false);
      setStatus(
        payload.authToken
          ? "هویت مدرس از پروفایل/کارت شما روی QR راست قرار گرفت."
          : "برای صدور گواهینامه وارد حساب پندنیک شوید."
      );
    });

    try {
      window.parent?.postMessage({ type: "certificate-studio:ready" }, "*");
    } catch {
      /* ignore */
    }
  }

  function applyLanguage(langId, keepNames = true) {
    const pack = CERT_LANGUAGES[langId];
    if (!pack) return;
    state.language = pack.id;
    state.direction = pack.dir;
    const genericRecipients = new Set([
      defaults.recipientName,
      "هنرجو",
      "هنرجو یا کارآموز",
      "Trainee / Apprentice",
      "Trainee",
      "المتدرب",
      "متدرب / متدرب مهني"
    ]);
    const genericInstructors = new Set([
      defaults.instructorName,
      "مدرس",
      "Instructor",
      "المدرب"
    ]);
    const names = keepNames
      ? {
          recipientName: genericRecipients.has(state.recipientName)
            ? uiT(state.uiLang || "fa", "default.recipient")
            : state.recipientName,
          instructorName: genericInstructors.has(state.instructorName)
            ? uiT(state.uiLang || "fa", "default.instructor")
            : state.instructorName,
          institutionName: state.institutionName,
          courseDate: state.courseDate,
          courseName: state.courseName
        }
      : {
          recipientName: uiT(state.uiLang || "fa", "default.recipient"),
          instructorName: uiT(state.uiLang || "fa", "default.instructor"),
          institutionName: uiT(state.uiLang || "fa", "default.institution"),
          courseDate: uiT(state.uiLang || "fa", "default.courseDate"),
          courseName: uiT(state.uiLang || "fa", "default.course")
        };
    Object.assign(state, pack.texts, names);
    populateForm(state);
  }

  function applyTheme(themeId) {
    const theme = CERT_THEMES.find((item) => item.id === themeId);
    if (!theme) return;
    const keepLogoVisible = state.logoVisible === true;
    const keepLogoData = state.logoDataUrl;
    const keepQrLeft = state.qrLeftVisible;
    const keepQrRight = state.qrRightVisible;
    state.themeId = theme.id;
    state.style = structuredClone(theme.style);
    // ظاهر تم عوض می‌شود؛ وضعیت حذف‌شده‌ی لوگو/QR حفظ می‌ماند
    state.logoVisible = keepLogoVisible;
    state.logoDataUrl = keepLogoData;
    state.qrLeftVisible = keepQrLeft;
    state.qrRightVisible = keepQrRight;
    populateForm(state);
    renderAll().then(() => {
      saveLocal(false);
      setStatus(`طرح «${theme.name}» اعمال شد (لایه‌های حذف‌شده برنگشتند).`);
    });
  }

  function applyFromForm(showMessage = true) {
    state = valuesFromForm();
    renderAll().then(() => {
      saveLocal(showMessage);
      if (showMessage) setStatus("پیش‌نمایش به‌روز شد.");
    });
  }

  function setupTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
        panels.forEach((panel) => panel.classList.toggle("active", panel.id === `tab-${tab}`));
      });
    });
  }

  function pointerToCanvas(clientX, clientY) {
    const rect = els.canvas.getBoundingClientRect();
    const scale = Number(getComputedStyle(els.canvas).getPropertyValue("--certificate-scale")) || 1;
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale
    };
  }

  function getBoxByType(type, id) {
    if (type === "logo") return state.logo;
    if (type === "qrLeft") return state.qrLeft;
    if (type === "qrRight") return state.qrRight;
    if (type === "studentPhoto") return state.studentPhoto;
    if (type === "instructorPhoto") return state.instructorPhoto;
    return state.icons.find((item) => item.id === id);
  }

  function setupDragging() {
    const begin = (event, type, id, node) => {
      if (event.button != null && event.button !== 0) return;
      event.preventDefault();
      const box = getBoxByType(type, id);
      if (!box) return;
      bringToFront(box, node);
      const point = pointerToCanvas(event.clientX, event.clientY);
      dragState = { type, id, offsetX: point.x - box.x, offsetY: point.y - box.y, node };
      node.classList.add("dragging");
      try {
        node.setPointerCapture(event.pointerId);
      } catch {
        /* ignore */
      }
    };

    els.logoWrap.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".layer-delete-btn")) return;
      begin(e, "logo", null, els.logoWrap);
    });
    els.qrLeft.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".layer-delete-btn")) return;
      begin(e, "qrLeft", null, els.qrLeft);
    });
    els.qrRight.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".layer-delete-btn")) return;
      begin(e, "qrRight", null, els.qrRight);
    });
    els.studentWrap.addEventListener("pointerdown", (e) => begin(e, "studentPhoto", null, els.studentWrap));
    els.instructorWrap.addEventListener("pointerdown", (e) => begin(e, "instructorPhoto", null, els.instructorWrap));
    els.iconsLayer.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".layer-delete-btn")) return;
      const target = event.target.closest(".extra-icon-wrap, .extra-icon");
      if (!target) return;
      const wrap = target.classList.contains("extra-icon-wrap") ? target : target.closest(".extra-icon-wrap");
      if (!wrap) return;
      begin(event, "icon", wrap.dataset.id, wrap);
    });

    document.addEventListener("pointermove", (event) => {
      if (!dragState) return;
      event.preventDefault();
      const point = pointerToCanvas(event.clientX, event.clientY);
      const box = getBoxByType(dragState.type, dragState.id);
      if (!box) return;
      box.x = clamp(point.x - dragState.offsetX, 20, CERT_W - box.size - 20);
      box.y = clamp(point.y - dragState.offsetY, 20, CERT_H - box.size - 40);
      if (dragState.type === "icon") {
        dragState.node.style.left = `${box.x}px`;
        dragState.node.style.top = `${box.y}px`;
        dragState.node.style.width = `${box.size}px`;
        dragState.node.style.height = `${box.size}px`;
      } else if (dragState.type === "logo") {
        placeBox(els.logoWrap, box);
        els.logoWrap.style.height = `${box.size}px`;
      } else if (dragState.type === "qrLeft") {
        placeBox(els.qrLeft, box);
        els.qrLeft.style.height = `${box.size}px`;
      } else if (dragState.type === "qrRight") {
        placeBox(els.qrRight, box);
        els.qrRight.style.height = `${box.size}px`;
      } else if (dragState.type === "studentPhoto") placeBox(els.studentWrap, box);
      else if (dragState.type === "instructorPhoto") placeBox(els.instructorWrap, box);
      syncControlsFromState();
    });

    const endDrag = (event) => {
      if (!dragState) return;
      dragState.node?.classList.remove("dragging");
      if (dragState.type === "icon") renderIconsList();
      renderLayersList();
      saveLocal(false);
      setStatus("موقعیت با درگ ذخیره شد.");
      try {
        dragState.node?.releasePointerCapture?.(event.pointerId);
      } catch {
        /* ignore */
      }
      dragState = null;
    };
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);
  }

  async function handleDroppedImage(file, preferred = "auto") {
    if (!file || !file.type.startsWith("image/")) {
      setStatus("فقط فایل تصویر قابل رها کردن است.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    if (preferred === "bg") {
      state.watermarkDataUrl = dataUrl;
      state.watermarkEnabled = true;
      renderWatermarks();
      setStatus("تصویر محو پس‌زمینه اضافه شد.");
    } else if (preferred === "logo") {
      state.logoDataUrl = dataUrl;
      state.logoVisible = true;
      state.logo.zIndex = nextStackZ();
      renderLogo();
      setStatus("لوگو با درگ‌اند‌دراپ اعمال شد.");
    } else if (preferred === "auto" && state.logoVisible === true && !state.logoDataUrl) {
      state.logoDataUrl = dataUrl;
      state.logo.zIndex = nextStackZ();
      renderLogo();
      setStatus("لوگو با درگ‌اند‌دراپ اعمال شد.");
    } else if (preferred === "student") {
      state.studentPhotoDataUrl = dataUrl;
      state.studentPhotoEnabled = true;
      renderPhotos();
      setStatus("عکس هنرجو اضافه شد.");
    } else if (preferred === "instructor") {
      state.instructorPhotoDataUrl = dataUrl;
      state.instructorPhotoEnabled = true;
      renderPhotos();
      setStatus("عکس مدرس اضافه شد.");
    } else {
      state.icons.push({
        id: `icon-${Date.now()}`,
        name: file.name,
        dataUrl,
        x: 520,
        y: 520,
        size: 64,
        zIndex: nextStackZ()
      });
      renderIconsOnCanvas();
      renderIconsList();
      setStatus("آیکون با درگ‌اند‌دراپ اضافه شد.");
    }
    renderLayersList();
    syncControlsFromState();
    saveLocal(false);
  }

  function setupFileDrop() {
    const stage = els.stage;
    const overlay = els.stageDropOverlay;
    let dragDepth = 0;

    const prevent = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const showOverlay = () => {
      if (!overlay) return;
      overlay.hidden = false;
      overlay.classList.add("is-visible");
    };

    const hideOverlay = () => {
      dragDepth = 0;
      if (!overlay) return;
      overlay.hidden = true;
      overlay.classList.remove("is-visible");
    };

    // همیشه در شروع مخفی باشد
    hideOverlay();

    stage.addEventListener("dragenter", (event) => {
      prevent(event);
      dragDepth += 1;
      showOverlay();
    });

    stage.addEventListener("dragover", (event) => {
      prevent(event);
      showOverlay();
    });

    stage.addEventListener("dragleave", (event) => {
      prevent(event);
      dragDepth = Math.max(0, dragDepth - 1);
      if (dragDepth === 0) hideOverlay();
    });

    stage.addEventListener("drop", async (event) => {
      prevent(event);
      hideOverlay();
      const file = event.dataTransfer?.files?.[0];
      await handleDroppedImage(file, "auto");
    });

    // اگر درگ خارج از پنجره تمام شد، لایه نماند
    window.addEventListener("dragend", hideOverlay);
    document.addEventListener("drop", hideOverlay);
    document.addEventListener("dragleave", (event) => {
      if (event.clientX <= 0 || event.clientY <= 0 ||
          event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
        hideOverlay();
      }
    });

    const bindZone = (zone, preferred) => {
      if (!zone) return;
      zone.addEventListener("dragenter", (event) => {
        prevent(event);
        zone.classList.add("dragover");
      });
      zone.addEventListener("dragover", (event) => {
        prevent(event);
        zone.classList.add("dragover");
      });
      zone.addEventListener("dragleave", (event) => {
        prevent(event);
        zone.classList.remove("dragover");
      });
      zone.addEventListener("drop", async (event) => {
        prevent(event);
        zone.classList.remove("dragover");
        hideOverlay();
        const file = event.dataTransfer?.files?.[0];
        await handleDroppedImage(file, preferred);
      });
    };

    bindZone(els.iconDropZone, "icon");
    bindZone(document.getElementById("logo-drop-zone"), "logo");
    bindZone(document.getElementById("bg-image-drop-zone"), "bg");

    document.addEventListener("paste", async (event) => {
      const file = [...(event.clipboardData?.files || [])].find((item) => item.type.startsWith("image/"));
      if (!file) return;
      await handleDroppedImage(file, "auto");
    });
  }

  function assertIssuedAuthenticityQr() {
    if (isPublicCertUrl(state.qrLeftUrl) && state.issuedCertCode) return true;
    if (isStandaloneMode()) {
      // نسخه مستقل گیت‌هاب: خروجی با QR نمونه مجاز است + راهنمای پندنیک
      setStatus(t("status.placeholderExport"));
      return true;
    }
    window.alert(t("alert.needPandenik"));
    return false;
  }

  async function exportPng() {
    if (!assertIssuedAuthenticityQr()) return;
    setStatus("…");
    const scale = Number(getComputedStyle(els.canvas).getPropertyValue("--certificate-scale")) || 1;
    const shot = await html2canvas(els.canvas, {
      backgroundColor: null,
      scale: 2 / scale,
      useCORS: true,
      logging: false
    });
    const link = document.createElement("a");
    const baseName = (state.recipientName || "certificate").replace(/\s+/g, "-");
    link.download = `${baseName}.png`;
    link.href = shot.toDataURL("image/png");
    link.click();
    setStatus(isStandaloneMode() && !isPublicCertUrl(state.qrLeftUrl) ? t("status.placeholderExport") : t("status.exportedPng"));
  }

  async function exportPdf() {
    if (!assertIssuedAuthenticityQr()) return;
    setStatus("…");
    const scale = Number(getComputedStyle(els.canvas).getPropertyValue("--certificate-scale")) || 1;
    const shot = await html2canvas(els.canvas, {
      backgroundColor: state.style.outerBg,
      scale: 2 / scale,
      useCORS: true,
      logging: false
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [CERT_W, CERT_H],
      hotfixes: ["px_scaling"]
    });
    pdf.addImage(shot.toDataURL("image/png"), "PNG", 0, 0, CERT_W, CERT_H);
    pdf.save(`${(state.recipientName || "certificate").replace(/\s+/g, "-")}.pdf`);
    setStatus(isStandaloneMode() && !isPublicCertUrl(state.qrLeftUrl) ? t("status.placeholderExport") : t("status.exportedPdf"));
  }

  function resetAll() {
    if (!confirm("همه تنظیمات به حالت پیش‌فرض برگردد؟")) return;
    state = structuredClone(defaults);
    populateForm(state);
    renderAll().then(() => {
      saveLocal(false);
      setStatus("به پیش‌فرض بازگشت.");
    });
  }

  function onControlChange() {
    if (syncingControls) return;
    const prevLeft = state.qrLeft.size;
    const prevRight = state.qrRight.size;
    readLayoutFromControls();
    readStyleFromControls();
    applyThemeVisuals();
    renderLogo();
    renderQrVisibility();
    renderWatermarks();
    renderPhotos();
    syncControlsFromState();
    if (prevLeft !== state.qrLeft.size || prevRight !== state.qrRight.size) {
      const tasks = [];
      if (state.qrLeftVisible !== false) tasks.push(drawQr(els.qrLeft, state.qrLeftUrl, state.qrLeft.size));
      if (state.qrRightVisible !== false) tasks.push(drawQr(els.qrRight, state.qrRightUrl, state.qrRight.size));
      Promise.all(tasks);
    }
    saveLocal(false);
  }

  document.getElementById("logo-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.logoDataUrl = await readFileAsDataUrl(file);
    state.logoVisible = true;
    state.logo.zIndex = nextStackZ();
    renderLogo();
    renderLayersList();
    saveLocal(false);
    setStatus("لوگوی کاربر اعمال شد. برای حذف، دکمه قرمز × روی لوگو یا «حذف لوگوی انتخاب‌شده» را بزنید.");
  });

  document.getElementById("remove-logo").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    hideLogoCompletely();
  });

  document.getElementById("hide-logo-seal")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    hideLogoCompletely();
  });

  document.getElementById("show-logo-seal")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    state.logoVisible = true;
    state.logoDataUrl = "";
    renderLogo();
    renderLayersList();
    saveLocal(false);
    setStatus("نشان پیش‌فرض دوباره نمایش داده شد.");
  });

  document.getElementById("logo-delete-btn")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    hideLogoCompletely();
  });

  els.canvas.addEventListener("click", (event) => {
    const hideQr = event.target.closest("[data-hide-qr]");
    if (!hideQr) return;
    event.preventDefault();
    event.stopPropagation();
    const side = hideQr.getAttribute("data-hide-qr");
    if (side === "left") state.qrLeftVisible = false;
    if (side === "right") state.qrRightVisible = false;
    renderQrVisibility();
    renderLayersList();
    saveLocal(false);
    setStatus("QR مخفی/حذف شد.");
  });
  document.getElementById("bg-image-file")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.watermarkDataUrl = await readFileAsDataUrl(file);
    state.watermarkEnabled = true;
    renderWatermarks();
    syncControlsFromState();
    saveLocal(false);
    setStatus("تصویر محو پس‌زمینه اضافه شد.");
  });

  document.getElementById("remove-bg-image")?.addEventListener("click", () => {
    state.watermarkDataUrl = "";
    state.watermarkEnabled = false;
    const input = document.getElementById("bg-image-file");
    if (input) input.value = "";
    renderWatermarks();
    syncControlsFromState();
    saveLocal(false);
    setStatus("تصویر پس‌زمینه حذف شد.");
  });

  els.siteWatermarkEnabled?.addEventListener("change", () => {
    state.siteWatermarkEnabled = els.siteWatermarkEnabled.checked;
    renderWatermarks();
    saveLocal(false);
    setStatus(state.siteWatermarkEnabled ? "لوگوی محو پندنیک روشن شد." : "لوگوی محو پندنیک خاموش شد.");
  });

  document.getElementById("student-photo-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.studentPhotoDataUrl = await readFileAsDataUrl(file);
    state.studentPhotoEnabled = true;
    renderPhotos();
    syncControlsFromState();
    saveLocal(false);
    setStatus("عکس هنرجو اضافه شد.");
  });

  document.getElementById("instructor-photo-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.instructorPhotoDataUrl = await readFileAsDataUrl(file);
    state.instructorPhotoEnabled = true;
    renderPhotos();
    syncControlsFromState();
    saveLocal(false);
    setStatus("عکس مدرس اضافه شد.");
  });

  document.getElementById("icon-file").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    state.icons.push({
      id: `icon-${Date.now()}`,
      name: file.name,
      dataUrl: await readFileAsDataUrl(file),
      x: 520,
      y: 620,
      size: 48,
      zIndex: nextStackZ()
    });
    event.target.value = "";
    renderIconsOnCanvas();
    renderIconsList();
    renderLayersList();
    saveLocal(false);
    setStatus("آیکون جدید بالاتر از لایه‌های قبلی قرار گرفت.");
    saveLocal(false);
  });

  els.iconsList.addEventListener("click", (event) => {
    const id = event.target.getAttribute("data-remove");
    if (!id) return;
    state.icons = state.icons.filter((icon) => icon.id !== id);
    renderIconsOnCanvas();
    renderIconsList();
    saveLocal(false);
  });

  els.language.addEventListener("change", () => {
    applyLanguage(els.language.value, true);
    renderAll().then(() => {
      saveLocal(false);
      setStatus("زبان گواهینامه تغییر کرد.");
    });
  });

  document.querySelectorAll("[data-dir]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.direction = btn.dataset.dir;
      els.direction.value = state.direction;
      applyFontsAndDirection();
      renderDirectionChips();
      saveLocal(false);
      setStatus(state.direction === "rtl" ? "راست‌چین فعال شد." : "چپ‌چین فعال شد.");
    });
  });

  els.direction.addEventListener("change", () => {
    state.direction = els.direction.value;
    applyFontsAndDirection();
    renderDirectionChips();
    saveLocal(false);
    setStatus(state.direction === "rtl" ? "راست‌چین فعال شد." : "چپ‌چین فعال شد.");
  });

  els.fontPack.addEventListener("change", () => {
    state.fontPack = els.fontPack.value;
    applyFontsAndDirection();
    renderFontChips();
    saveLocal(false);
    setStatus("فونت گواهینامه تغییر کرد.");
  });

  els.editMode?.addEventListener("change", () => {
    els.canvas.classList.toggle("edit-mode", els.editMode.checked);
    setStatus(els.editMode.checked ? "حالت ویرایش فعال شد." : "حالت ویرایش خاموش شد.");
  });

  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFromForm(true);
  });

  Object.values(els.fields).forEach((input) => {
    input.addEventListener("input", () => {
      state = valuesFromForm();
      renderPreview(state);
      els.studentCaptionPreview.textContent = state.studentPhotoCaption;
      els.instructorCaptionPreview.textContent = state.instructorPhotoCaption;
    });
  });

  Object.values(els.layout).forEach((input) => input.addEventListener("input", onControlChange));
  Object.values(els.colors).forEach((input) => input.addEventListener("input", onControlChange));

  document.getElementById("print-button").addEventListener("click", () => {
    if (!assertIssuedAuthenticityQr()) return;
    window.print();
  });
  document.getElementById("png-button").addEventListener("click", () => exportPng().catch(console.error));
  document.getElementById("pdf-button").addEventListener("click", () => exportPdf().catch(console.error));
  document.getElementById("reset-button").addEventListener("click", resetAll);
  document.getElementById("issue-left-qr-button")?.addEventListener("click", () => {
    issueAuthenticityQr().catch(console.error);
  });
  document.getElementById("save-recipient-button")?.addEventListener("click", () => {
    saveRecipientInfo().catch(console.error);
  });
  ["recipient-name", "recipient-phone"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", () => {
      if (state.recipientSavedInDb) {
        state.recipientSavedInDb = false;
        updateIssueButtonState();
        const statusEl = document.getElementById("recipient-save-status");
        if (statusEl) {
          statusEl.textContent = "اطلاعات تغییر کرد — دوباره «ذخیره اطلاعات هنرجو» را بزنید.";
          statusEl.style.color = "#b45309";
        }
      }
    });
  });
  els.qrLeftFromPage?.addEventListener("change", () => {
    // این گزینه عمداً غیرفعال است — باعث باز شدن استودیو برای مهمان می‌شد
    els.qrLeftFromPage.checked = false;
    window.alert("QR اصالت فقط از طریق «تولید QR اعتبار» و لینک /c/... ساخته می‌شود.");
    updateQrLeftSourceHint();
  });

  els.fields.qrLeftUrl?.addEventListener("input", () => {
    if (state.lockQrUrls !== false && !state.canOverrideQr) {
      if (els.fields.qrLeftUrl) els.fields.qrLeftUrl.value = state.qrLeftUrl || "";
      return;
    }
    state.qrLeftFromPage = false;
    state.qrLeftFromSite = false;
    if (els.qrLeftFromPage) els.qrLeftFromPage.checked = false;
    updateQrLeftSourceHint();
  });

  els.fields.qrRightUrl?.addEventListener("input", () => {
    if (state.lockQrUrls !== false && !state.canOverrideQr) {
      if (els.fields.qrRightUrl) els.fields.qrRightUrl.value = state.qrRightUrl || "";
      return;
    }
  });

  document.getElementById("refresh-qr").addEventListener("click", () => {
    Promise.all([
      drawQr(els.qrLeft, state.qrLeftUrl, state.qrLeft.size),
      drawQr(els.qrRight, state.qrRightUrl, state.qrRight.size)
    ]).then(() => {
      saveLocal(false);
      setStatus(t("status.ready"));
    });
  });

  document.getElementById("open-pandenik-cta")?.addEventListener("click", () => {
    window.open(PANDENIK_HOME, "_blank", "noopener,noreferrer");
  });

  document.querySelectorAll("[data-ui-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.uiLang = btn.getAttribute("data-ui-lang") === "en" ? "en" : "fa";
      applyUiLanguage();
      saveLocal(false);
    });
  });
  document.getElementById("ui-lang")?.addEventListener("change", (event) => {
    state.uiLang = event.target.value === "en" ? "en" : "fa";
    applyUiLanguage();
    saveLocal(false);
  });

  window.addEventListener("online", updateOnlineBadge);
  window.addEventListener("offline", updateOnlineBadge);
  new ResizeObserver(fitCertificate).observe(els.stage);

  initSelects();
  setupTabs();
  setupDragging();
  setupFileDrop();
  setupSiteQrBridge();

  const saved = loadLocal();
  state = saved || structuredClone(defaults);
  if (!state.uiLang) state.uiLang = "fa";
  populateForm(state);
  applyUiLanguage();
  updateOnlineBadge();
  fitCertificate();
  renderAll().then(() => {
    readSiteIntegration();
    updateQrLeftSourceHint();
    updateIssueButtonState();
    applyUiLanguage();
    populateForm(state);
    renderPreview(state);
    setStatus(saved ? t("status.loaded") : t("status.ready"));
  });

  // SW disabled on pandenik host
})();
