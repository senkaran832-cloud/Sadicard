/**
 * ====================================================================
 * शुभ विवाह निमंत्रण - मुख्य स्क्रिप्ट (JavaScript)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // १. कॉन्फ़िगरेशन से डेटा लोड करें
  initDataFromConfig();

  // २. पर्दा खोलने की कार्यप्रणाली
  initCurtainMechanism();

  // ३. URL से अतिथि का नाम पढ़ना
  initGuestPersonalization();

  // ४. अतिथि लिंक जनरेटर टूल
  initGuestLinkGenerator();

  // ५. लाइव काउंटडाउन टाइमर (Asia/Kolkata 20 नवम्बर 2026)
  initCountdownTimer();

  // ६. संगीत नियंत्रण (Web Audio API पारंपरिक शहनाई मेलोडी)
  initAudioSystem();

  // ७. गूगल कैलेंडर लिंक
  initCalendarAction();
});

/**
 * १. कॉन्फ़िगरेशन से डेटा पृष्ठ पर स्थापित करें
 */
function initDataFromConfig() {
  if (typeof WEDDING_CONFIG === "undefined") {
    console.error("WEDDING_CONFIG नहीं मिला। कृपया config.js की जाँच करें।");
    return;
  }

  const cfg = WEDDING_CONFIG;

  // दस्तावेज़ शीर्षक
  if (cfg.siteTitle) document.title = cfg.siteTitle;

  // पर्दा कवर विवरण
  setElementText("curtainShloka", cfg.shlokas.ganesh);
  setElementText("curtainCoupleName", cfg.coupleDisplay);
  setElementText("curtainDate", cfg.mainWeddingDateHindi);

  // स्वागत पृष्ठ
  setElementText("heroGaneshShloka", cfg.shlokas.ganesh);
  setElementText("heroVakratundaShloka", cfg.shlokas.mangal);
  setElementText("brideDisplayName", cfg.bride.shortName);
  setElementText("groomDisplayName", cfg.groom.shortName);
  setElementText("familyWelcomeMsg", cfg.shlokas.blessing);

  // पक्ष परिचय
  setElementText("brideSideTag", cfg.bride.sideLabel);
  setElementText("brideFullName", cfg.bride.fullName);
  setElementText("brideRelationLabel", cfg.bride.relation + ":");
  setElementText("brideParents", cfg.bride.parents);
  setElementText("brideGrandParents", cfg.bride.grandParents);
  setElementText("brideAddress", cfg.bride.residence);

  setElementText("groomSideTag", cfg.groom.sideLabel);
  setElementText("groomFullName", cfg.groom.fullName);
  setElementText("groomRelationLabel", cfg.groom.relation + ":");
  setElementText("groomParents", cfg.groom.parents);
  setElementText("groomGrandParents", cfg.groom.grandParents);
  setElementText("groomAddress", cfg.groom.residence);

  // काउंटडाउन हेडर
  setElementText("countdownDateTitle", cfg.mainWeddingDateHindi);

  // कार्यक्रम सूची रेंडर करें
  renderEventsTimeline(cfg.events);

  // रात्रिभोज (प्रीतिभोज)
  setElementText("dinnerTitle", cfg.dinner.title);
  setElementText("dinnerTimeText", cfg.dinner.timeHindi);
  setElementText("dinnerDateText", cfg.dinner.dateHindi);
  setElementText("dinnerVenueName", cfg.venue.name);
  setElementText("dinnerVenueAddress", cfg.venue.address);

  // कार्यक्रम स्थल
  setElementText("mainVenueName", cfg.venue.name);
  setElementText("mainVenueAddress", cfg.venue.address);
  setElementText("baraatNoticeText", cfg.venue.baraatNote);

  const mapsBtn = document.getElementById("googleMapsDirectionsBtn");
  if (mapsBtn && cfg.venue.mapsUrl) {
    mapsBtn.href = cfg.venue.mapsUrl;
  }

  const mapIframe = document.getElementById("googleMapIframe");
  if (mapIframe && cfg.venue.embedMapUrl) {
    mapIframe.src = cfg.venue.embedMapUrl;
  }

  // परिवार एवं स्नेही
  renderFamilyDetails(cfg.family);

  // पादलेख
  setElementText("footerCoupleName", cfg.coupleDisplay);
  renderFooterPhones(cfg.family.contactPhones);
}

/**
 * सुरक्षित रूप से टेक्स्ट सेट करने का हेल्पर
 */
function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined && text !== null) {
    el.textContent = text;
  }
}

/**
 * २. पर्दा खोलने की कार्यप्रणाली
 */
function initCurtainMechanism() {
  const curtainOverlay = document.getElementById("curtainOverlay");
  const openCurtainBtn = document.getElementById("openCurtainBtn");

  if (!curtainOverlay || !openCurtainBtn) return;

  openCurtainBtn.addEventListener("click", () => {
    // पर्दे पर .opened क्लास जोड़ें जिससे एनीमेशन शुरू हो
    curtainOverlay.classList.add("opened");

    // शुभ पंखुड़ी वर्षा शुरू करें
    triggerPetalRain();

    // संगीत स्वचालित शुरू करने का प्रयास (यदि अनुमति हो)
    startAudioIfEnabled();

    // सुगमता (Accessibility)
    setTimeout(() => {
      const welcomeSection = document.getElementById("welcomeSection");
      if (welcomeSection) {
        welcomeSection.setAttribute("tabindex", "-1");
        welcomeSection.focus();
      }
    }, 1200);
  });
}

/**
 * पंखुड़ी वर्षा (Petal Shower Animation)
 */
function triggerPetalRain() {
  const container = document.getElementById("petalsContainer");
  if (!container) return;

  const petalSymbols = ["🌸", "💮", "🌺", "🌼", "✨"];
  const count = window.innerWidth < 600 ? 18 : 30;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("div");
    petal.className = "petal";
    petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
    
    const left = Math.random() * 100;
    const duration = 2.5 + Math.random() * 2.5;
    const delay = Math.random() * 1.5;
    const size = 16 + Math.random() * 18;

    petal.style.left = `${left}vw`;
    petal.style.fontSize = `${size}px`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    container.appendChild(petal);

    // एनीमेशन समाप्त होने पर हटाएं
    setTimeout(() => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    }, (duration + delay + 0.5) * 1000);
  }
}

/**
 * ३. URL से अतिथि का नाम पढ़ना व स्वागत पृष्ठ पर दिखाना
 */
function initGuestPersonalization() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get("to") || urlParams.get("name") || urlParams.get("guest");

  const badge = document.getElementById("personalizedGuestBadge");
  const nameEl = document.getElementById("personalizedGuestName");

  if (guestParam && guestParam.trim() !== "") {
    try {
      // सुरक्षित रूप से decode करें
      const decodedName = decodeURIComponent(guestParam.trim());
      
      if (badge && nameEl) {
        nameEl.textContent = decodedName;
        badge.style.display = "block";
      }
      
      // इनपुट बॉक्स में भी पहले से भर दें ताकि वे समझ सकें
      const guestInput = document.getElementById("guestInputBox");
      if (guestInput) {
        guestInput.value = decodedName;
      }
    } catch (e) {
      console.warn("अतिथि नाम डिकोड करने में त्रुटि:", e);
    }
  }
}

/**
 * ४. अतिथि निमंत्रण लिंक जनरेटर टूल
 */
function initGuestLinkGenerator() {
  const guestInput = document.getElementById("guestInputBox");
  const generateBtn = document.getElementById("generateLinkBtn");
  const linkBox = document.getElementById("generatedLinkContainer");
  const urlText = document.getElementById("generatedUrlText");
  const copyBtn = document.getElementById("copyLinkBtn");
  const copyBtnLabel = document.getElementById("copyBtnLabel");
  const whatsAppBtn = document.getElementById("shareWhatsAppBtn");
  const toast = document.getElementById("copySuccessToast");

  if (!generateBtn || !guestInput) return;

  function createLink() {
    const rawName = guestInput.value.trim();
    if (!rawName) {
      alert("कृपया अतिथि का नाम लिखें (उदा. शर्मा परिवार / बनदानी परिवार)।");
      guestInput.focus();
      return;
    }

    // वर्तमान पृष्ठ का शुद्ध URL प्राप्त करें (बिना पुराने query params के)
    let baseUrl = (typeof WEDDING_CONFIG !== "undefined" && WEDDING_CONFIG.productionWebsiteUrl)
      ? WEDDING_CONFIG.productionWebsiteUrl
      : (window.location.origin + window.location.pathname);

    if (window.location.protocol === "file:" || baseUrl.startsWith("file:")) {
      if (typeof WEDDING_CONFIG === "undefined" || !WEDDING_CONFIG.productionWebsiteUrl) {
        baseUrl = "https://your-wedding-website.com/";
      }
    }
    // सुनिश्चित करें कि अंत में स्लैश या ठीक से जुड़े
    if (!baseUrl.endsWith("/") && !baseUrl.includes("?")) {
      baseUrl += "/";
    }
    const finalUrl = `${baseUrl}?to=${encodeURIComponent(rawName)}`;

    urlText.textContent = finalUrl;
    linkBox.classList.add("active");

    // WhatsApp शेयर संदेश तैयार करें
    const whatsappMsg = `॥ श्री गणेशाय नमः ॥\n\nआदरणीय *${rawName}* जी,\n\nपरमपिता परमेश्वर की असीम अनुकम्पा से कृष्णा संग आशीष के शुभ विवाह की पावन वेला पर आप सभी सपरिवार सादर आमंत्रित हैं।\n\nकृपया अपना विशेष निमंत्रण पत्र देखने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n${finalUrl}\n\nविवाह तिथि: शुक्रवार, 20 नवम्बर 2026\nरात्रिभोज: सायं 5:00 बजे से\nस्थान: मीरा बाई सामुदायिक भवन, कोटा (राज.)\n\n- सेन परिवार`;

    whatsAppBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`;

    if (toast) toast.style.display = "none";
    if (copyBtnLabel) copyBtnLabel.textContent = "लिंक कॉपी करें";
  }

  generateBtn.addEventListener("click", createLink);
  
  guestInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      createLink();
    }
  });

  // लिंक कॉपी करने की कार्यप्रणाली
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const textToCopy = urlText.textContent;
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showCopiedState();
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showCopiedState();
    } catch (err) {
      alert("लिंक कॉपी नहीं हो सका, कृपया इसे मैन्युअली कॉपी करें।");
    }
    document.body.removeChild(textarea);
  }

  function showCopiedState() {
    if (copyBtnLabel) copyBtnLabel.textContent = "✓ लिंक कॉपी हो गया";
    if (toast) {
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 4000);
    }
  }
}

/**
 * ५. लाइव काउंटडाउन टाइमर (Asia/Kolkata)
 */
function initCountdownTimer() {
  const cdDays = document.getElementById("cdDays");
  const cdHours = document.getElementById("cdHours");
  const cdMinutes = document.getElementById("cdMinutes");
  const cdSeconds = document.getElementById("cdSeconds");
  const timerGrid = document.getElementById("timerGrid");
  const expiredMsg = document.getElementById("countdownExpiredMessage");
  const leadText = document.getElementById("countdownLeadText");

  // शादी की तारीख (ISO 8601 with +05:30 offset for India Standard Time)
  const targetISO = (typeof WEDDING_CONFIG !== "undefined" && WEDDING_CONFIG.targetDateISO) 
    ? WEDDING_CONFIG.targetDateISO 
    : "2026-11-20T17:00:00+05:30";

  const targetTimestamp = new Date(targetISO).getTime();

  function updateTimer() {
    const now = Date.now();
    const diff = targetTimestamp - now;

    if (diff <= 0) {
      // विवाह की तारीख बीत चुकी है
      if (timerGrid) timerGrid.style.display = "none";
      if (expiredMsg) expiredMsg.style.display = "block";
      if (leadText) leadText.textContent = "शुभ विवाह सम्पन्न";
      return;
    }

    const oneSec = 1000;
    const oneMin = 60 * oneSec;
    const oneHour = 60 * oneMin;
    const oneDay = 24 * oneHour;

    const days = Math.floor(diff / oneDay);
    const hours = Math.floor((diff % oneDay) / oneHour);
    const minutes = Math.floor((diff % oneHour) / oneMin);
    const seconds = Math.floor((diff % oneMin) / oneSec);

    if (cdDays) cdDays.textContent = days < 10 ? "0" + days : days;
    if (cdHours) cdHours.textContent = hours < 10 ? "0" + hours : hours;
    if (cdMinutes) cdMinutes.textContent = minutes < 10 ? "0" + minutes : minutes;
    if (cdSeconds) cdSeconds.textContent = seconds < 10 ? "0" + seconds : seconds;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * कार्यक्रम सूची रेंडर करने का फंक्शन
 */
function renderEventsTimeline(events) {
  const container = document.getElementById("eventsTimelineContainer");
  if (!container || !events || !events.length) return;

  container.innerHTML = "";

  // कार्यक्रमों को दिन के अनुसार समूहित करें
  const groups = {};
  events.forEach(ev => {
    const key = `${ev.dayHindi}, ${ev.dateHindi}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(ev);
  });

  Object.keys(groups).forEach(dayKey => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "event-day-group";

    const header = document.createElement("div");
    header.className = "event-day-header";
    header.innerHTML = `<span aria-hidden="true">❖</span><span>${dayKey}</span>`;
    groupDiv.appendChild(header);

    const cardsGrid = document.createElement("div");
    cardsGrid.className = "event-cards-container";

    groups[dayKey].forEach(ev => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
        <div class="event-card-icon" aria-hidden="true">${ev.icon || "🪔"}</div>
        <div class="event-card-body">
          <h3 class="event-card-title">${ev.title}</h3>
          <div class="event-card-time">
            <span aria-hidden="true">⏰</span>
            <span>${ev.timeHindi}</span>
          </div>
          <div class="event-card-venue">
            <span aria-hidden="true">📍</span>
            <span>स्थल: ${ev.venue}</span>
          </div>
          ${ev.description ? `<p class="event-card-desc">${ev.description}</p>` : ""}
        </div>
      `;
      cardsGrid.appendChild(card);
    });

    groupDiv.appendChild(cardsGrid);
    container.appendChild(groupDiv);
  });
}

/**
 * परिवार व निवेदक सूची रेंडर करें
 */
function renderFamilyDetails(family) {
  if (!family) return;

  // विनीत
  const vineetEl = document.getElementById("vineetList");
  if (vineetEl && family.vineet) {
    vineetEl.innerHTML = family.vineet.map(name => `<li>${name}</li>`).join("");
  }

  // स्वागतातुर
  const swagatEl = document.getElementById("swagataturList");
  if (swagatEl && family.swagatatur) {
    swagatEl.innerHTML = family.swagatatur.map(name => `<li>${name}</li>`).join("");
  }

  // विशेष आग्रह
  const visheshEl = document.getElementById("visheshAagrahList");
  if (visheshEl && family.visheshAagrah) {
    visheshEl.innerHTML = family.visheshAagrah.map(name => `<li>${name}</li>`).join("");
  }

  // स्नेहाकांक्षी
  const snehEl = document.getElementById("snehakankshiTags");
  if (snehEl && family.snehakankshi) {
    snehEl.innerHTML = family.snehakankshi.map(name => `<span class="sneh-tag">${name}</span>`).join("");
  }

  // ननिहाल
  setElementText("nanihalText", family.nanihal);

  // बाल मनुहार
  setElementText("balManuharPoem", family.balManuhar);
}

/**
 * पादलेख फोन नंबर रेंडर करें
 */
function renderFooterPhones(phones) {
  const container = document.getElementById("footerPhones");
  if (!container || !phones) return;

  container.innerHTML = phones.map((p, idx) => {
    return `<a href="tel:${p.number}">📞 ${p.label}: ${p.number}</a>${idx < phones.length - 1 ? " | " : ""}`;
  }).join("");
}

/**
 * ६. संगीत प्रणाली (Web Audio API पारंपरिक शहनाई/बांसुरी मेलोडी)
 * यह बिना किसी बाहरी MP3 डाउनलोड के किसी भी कंप्यूटर या फोन पर तुरंत काम करता है!
 */
let audioCtx = null;
let isPlaying = false;
let melodyInterval = null;

function initAudioSystem() {
  const toggleBtn = document.getElementById("musicToggleBtn");
  const icon = document.getElementById("musicIcon");
  const text = document.getElementById("musicStatusText");

  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      stopTraditionalMelody();
      isPlaying = false;
      if (icon) icon.textContent = "🎵";
      if (text) text.textContent = "संगीत: चालू करें";
    } else {
      startTraditionalMelody();
      isPlaying = true;
      if (icon) icon.textContent = "🔊";
      if (text) text.textContent = "संगीत: बंद करें";
    }
  });
}

function startAudioIfEnabled() {
  // उपयोगकर्ता के पहले इंटरैक्शन पर स्वचालित प्रारंभ
  if (!isPlaying) {
    startTraditionalMelody();
    isPlaying = true;
    const icon = document.getElementById("musicIcon");
    const text = document.getElementById("musicStatusText");
    if (icon) icon.textContent = "🔊";
    if (text) text.textContent = "संगीत: बंद करें";
  }
}

/**
 * पारंपरिक मांगलिक राग बिलावल / यमन की मधुर ध्वनि (Synthesized Festive Melody)
 */
function startTraditionalMelody() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // शहनाई व तानपूरा की स्वर रचना (Frequencies in Hz: Sa Re Ga Ma Pa Dha Ni Sa')
    // Sa = 261.63 (C4), Re = 293.66, Ga = 329.63, Ma = 349.23, Pa = 392.00, Dha = 440.00, Ni = 493.88, Sa' = 523.25
    const notes = [
      { f: 261.63, d: 0.6 }, // Sa
      { f: 293.66, d: 0.4 }, // Re
      { f: 329.63, d: 0.6 }, // Ga
      { f: 392.00, d: 0.8 }, // Pa
      { f: 440.00, d: 0.5 }, // Dha
      { f: 523.25, d: 1.2 }, // Sa'
      { f: 440.00, d: 0.6 }, // Dha
      { f: 392.00, d: 0.7 }, // Pa
      { f: 329.63, d: 0.9 }, // Ga
      { f: 293.66, d: 0.5 }, // Re
      { f: 261.63, d: 1.4 }  // Sa
    ];

    let currentStep = 0;

    function playNote(freq, dur) {
      if (!audioCtx || audioCtx.state !== "running") return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // मधुर बांसुरी/शहनाई जैसी हार्मोनिक्स ध्वनि के लिए
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // सूक्ष्म कंपन्न (Vibrato)
      const vibrato = audioCtx.createOscillator();
      const vibratoGain = audioCtx.createGain();
      vibrato.frequency.value = 5.5; // 5.5Hz vibrato
      vibratoGain.gain.value = 4;
      vibrato.connect(osc.frequency);
      vibrato.start();

      // कोमल फेड-इन और फेड-आउट
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + dur);
      vibrato.stop(now + dur);
    }

    // निरंतर मधुर धुन चक्र
    function step() {
      if (!isPlaying) return;
      const n = notes[currentStep];
      playNote(n.f, n.d);
      currentStep = (currentStep + 1) % notes.length;
      melodyInterval = setTimeout(step, n.d * 1000 + 120);
    }

    step();
  } catch (err) {
    console.log("Audio not allowed or supported:", err);
  }
}

function stopTraditionalMelody() {
  if (melodyInterval) {
    clearTimeout(melodyInterval);
    melodyInterval = null;
  }
  if (audioCtx && audioCtx.state === "running") {
    audioCtx.suspend();
  }
}

/**
 * ७. गूगल कैलेंडर में जोड़ें
 */
function initCalendarAction() {
  const btn = document.getElementById("addToCalendarBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const title = encodeURIComponent("कृष्णा संग आशीष - शुभ विवाह समारोह");
    const details = encodeURIComponent("कृष्णा एवं आशीष के शुभ विवाह व रात्रिभोज में आप सभी सपरिवार सादर आमंत्रित हैं।\n\nरात्रिभोज: सायं 5:00 बजे से\nकार्यक्रम स्थल: मीरा बाई सामुदायिक भवन, कोटा\nGoogle Maps: https://maps.app.goo.gl/TqL9FSjMvaf4qETZ8");
    const location = encodeURIComponent("मीरा बाई सामुदायिक भवन, नया नोहरा रोड़, बोरखेड़ा, कोटा (राजस्थान)");
    
    // 20 नवम्बर 2026 17:00 IST -> 11:30 UTC
    // समाप्त: 20 नवम्बर 2026 23:59 IST -> 18:29 UTC
    const dates = "20261120T113000Z/20261120T183000Z";

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

    window.open(gcalUrl, "_blank", "noopener,noreferrer");
  });
}
