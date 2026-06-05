const STORAGE_KEY = "cssf-reservations-v2";
const LEGACY_STORAGE_KEY = "cssf-reservations-v1";
const REVIEW_STORAGE_KEY = "cssf-reviews-v1";
const TRUCK_STORAGE_KEY = "cssf-trucks-v3";
const VOTE_STORAGE_KEY = "cssf-votes-v1";
const ANALYTICS_STORAGE_KEY = "cssf-analytics-v1";
const ANALYTICS_CONSENT_KEY = "cssf-analytics-consent-v1";
const PRIVACY_BANNER_SEEN_KEY = "cssf-privacy-banner-seen-v1";
const ADMIN_SESSION_KEY = "cssf-admin-session-v1";
const SERVICE_WORKER_ACTIVE_VERSION_KEY = "cssf-service-worker-active-version";
const CAPACITY_KEY = "cssf-capacity-v2";
const TABLE_COUNT = 10;
const SEATS_PER_TABLE = 8;
const DEFAULT_CAPACITY_PER_SLOT = TABLE_COUNT * SEATS_PER_TABLE;
const ADMIN_FALLBACK_PIN = "2606";
const MAX_ANALYTICS_EVENTS = 2500;
const ACTIVE_PWA_CACHE_NAME = "cssf-pwa-v146";
const SERVICE_WORKER_VERSION = "20260605-pwa-v146";
const SERVICE_WORKER_URL = `./service-worker.js?v=${SERVICE_WORKER_VERSION}`;
const SUPABASE_URL = "https://rwbszwbsxdidhjaxozhn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnN6d2JzeGRpZGhqYXhvemhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MzcxNTYsImV4cCI6MjA5NjIxMzE1Nn0.a2lI6u4R15pHwJfABjzF0i30ZKXahavNujaC3BThKR8";
const SUPABASE_RESERVATIONS_TABLE = "reservations";
const SUPABASE_TRUCKS_TABLE = "trucks";
const SUPABASE_VOTES_TABLE = "votes";
const SUPABASE_VOTE_LEADERBOARD_VIEW = "vote_leaderboard";

const eventStart = new Date("2026-06-26T19:00:00+02:00");
const countdownStart = new Date("2026-05-29T00:00:00+02:00");
const eventDays = [
  { value: "2026-06-26", label: "Ven 26 giugno", longLabel: "Venerdi 26 giugno 2026" },
  { value: "2026-06-27", label: "Sab 27 giugno", longLabel: "Sabato 27 giugno 2026" },
  { value: "2026-06-28", label: "Dom 28 giugno", longLabel: "Domenica 28 giugno 2026" },
];

const slots = ["20:30"];
const activeStatuses = new Set(["confirmed", "pending"]);
const statusLabels = {
  confirmed: "Confermata",
  pending: "Da confermare",
  waiting: "Lista attesa",
  cancelled: "Annullata",
};

const defaultTrucks = [
  {
    id: "stand-afterlife",
    code: "S01",
    name: "Afterlife",
    category: "cocktail",
    zone: "Area drink",
    menu: "Cocktail freschi e gustosi per accompagnare le serate.",
    color: "#7c3aed",
    status: "open",
    x: 52.3,
    y: 16.1,
  },
  {
    id: "stand-armonia-gusti",
    code: "S02",
    name: "Armonia dei Gusti",
    category: "dolci",
    zone: "Passeggiata dolce",
    menu: "Gelati, monoporzioni e pangoccioli.",
    color: "#db2777",
    status: "open",
    x: 47.1,
    y: 29.5,
  },
  {
    id: "stand-birra-cala",
    code: "S03",
    name: "Birra Cala",
    category: "birra",
    zone: "Area drink",
    menu: "Birra per rinfrescare la serata.",
    color: "#d97706",
    mapPositions: [
      { x: 58.9, y: 16.9 },
      { x: 26.3, y: 36.4 },
    ],
    status: "open",
    x: 58.9,
    y: 16.9,
  },
  {
    id: "stand-caracas-bistro-25",
    code: "S04",
    name: "Caracas Bistro 25",
    category: "sudamericano",
    zone: "Area world food",
    menu: "Burrito, arepas e churros per un salto in Sud America.",
    color: "#059669",
    status: "open",
    x: 19.1,
    y: 34.5,
  },
  {
    id: "stand-che-gnocchi",
    code: "S05",
    name: "Che Gnocchi",
    category: "primi",
    zone: "Via centrale",
    menu: "Gnocchi alla carbonara, gnocchi all'amatriciana e gustose lasagne.",
    color: "#2563eb",
    status: "open",
    x: 16.7,
    y: 15.5,
  },
  {
    id: "stand-chimi",
    code: "S06",
    name: "Chimi",
    category: "carne",
    zone: "Area brace",
    menu: "Asado argentino tradizionale e hamburger.",
    color: "#dc2626",
    status: "open",
    x: 64.4,
    y: 67.8,
  },
  {
    id: "stand-gamro",
    code: "S07",
    name: "GamRo",
    category: "pesce",
    zone: "Area mare",
    menu: "Panini con il pesce e frittura.",
    color: "#0891b2",
    status: "open",
    x: 25.3,
    y: 16.8,
  },
  {
    id: "stand-la-forneria",
    code: "S08",
    name: "La Forneria",
    category: "forno",
    zone: "Via centrale",
    menu: "Focacce gustose e cuoppo di polpette.",
    color: "#ca8a04",
    status: "open",
    x: 65.7,
    y: 16.8,
  },
  {
    id: "stand-la-verace",
    code: "S09",
    name: "La Verace",
    category: "fritti",
    zone: "Area novita",
    menu: "Cuzzitiello e corn dog.",
    color: "#ea580c",
    status: "open",
    x: 34.4,
    y: 38.7,
  },
  {
    id: "stand-panzerotto-on-the-road",
    code: "S10",
    name: "Panzerotto on the Road",
    category: "fritti",
    zone: "Via centrale",
    menu: "Panzerotti e burrata fritta.",
    color: "#16a34a",
    status: "open",
    x: 8.8,
    y: 16.7,
  },
  {
    id: "stand-sams-food-truck",
    code: "S11",
    name: "Sam's Food Truck",
    category: "bbq",
    zone: "Area BBQ",
    menu: "Brisket e panini con pulled pork.",
    color: "#be123c",
    status: "open",
    x: 49.4,
    y: 53.4,
  },
  {
    id: "stand-the-butchers",
    code: "S12",
    name: "The Butchers",
    category: "carne",
    zone: "Area brace",
    menu: "Cuoppo di carne, hamburger, salsiccia e alette di pollo.",
    color: "#9333ea",
    status: "open",
    x: 37.4,
    y: 20.1,
  },
  {
    id: "stand-trattoria-da-ciardullo",
    code: "S13",
    name: "Trattoria da Ciardullo",
    category: "tradizione",
    zone: "Area tradizione",
    menu: "Patate mbacchiuse e pasta casereccia.",
    color: "#4d7c0f",
    status: "open",
    x: 43.5,
    y: 15.3,
  },
  {
    id: "stand-willy-crak",
    code: "S14",
    name: "Willy Crak",
    category: "brace",
    zone: "Area brace",
    menu: "Arrosticini, caciocavallo impiccato e novita con bistecca di pecora.",
    color: "#b45309",
    status: "open",
    x: 10.7,
    y: 30.6,
  },
  {
    id: "stand-zia-ne",
    code: "S15",
    name: "Zia Ne",
    category: "pizza",
    zone: "Area pizza",
    menu: "Pizza a portafoglio e gustose frittatine di pasta.",
    color: "#e11d48",
    status: "open",
    x: 56.3,
    y: 61,
  },
];

const categoryLabels = {
  cocktail: "Cocktail",
  dolci: "Dolci e gelati",
  birra: "Birra",
  sudamericano: "Sudamericano",
  primi: "Primi piatti",
  carne: "Carne",
  pesce: "Pesce",
  forno: "Forno",
  fritti: "Fritti",
  bbq: "BBQ",
  tradizione: "Tradizione",
  brace: "Brace",
  pizza: "Pizza",
};

const truckStatusLabels = {
  open: "Aperto",
};

const voteCategories = [
  { value: "top-street-food", label: "Top Street Food" },
  { value: "top-panino", label: "Miglior Panino" },
  { value: "top-tradizione", label: "Miglior Tradizione" },
  { value: "top-dessert", label: "Miglior Dolce" },
  { value: "top-drink", label: "Miglior Drink" },
];

const tasteRoutes = {
  tradizione: {
    text: "Un percorso pensato per chi cerca sapori locali, street food caldo e prodotti del territorio.",
    items: ["Pizza a portafoglio", "Arrosticini", "Caciocavallo e fritti"],
  },
  mare: {
    text: "Ideale per chi vuole una serata fresca, veloce e piena di profumi di mare.",
    items: ["Panini di pesce", "Cuoppo di pesce", "Birre artigianali"],
  },
  mondo: {
    text: "Per chi vuole girare tra stand e cucine diverse, con sapori internazionali e contaminazioni.",
    items: ["Arepas e churros", "Asado argentino", "Smash burger"],
  },
  dolce: {
    text: "La chiusura perfetta dopo il giro food: gelati, dolci e passeggiata in piazza.",
    items: ["Gelato artigianale", "Churros", "Maritozzi"],
  },
};

const bookingForm = document.querySelector("#bookingForm");
const reservationsTable = document.querySelector("#reservationsTable");
const rowTemplate = document.querySelector("#reservationRowTemplate");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const dayFilter = document.querySelector("#dayFilter");
const statusFilter = document.querySelector("#statusFilter");
const capacityInput = document.querySelector("#capacityInput");
const availabilityReadout = document.querySelector("#availabilityReadout");
const slotsGrid = document.querySelector("#slotsGrid");
const bookingSlotModal = document.querySelector("#bookingSlotModal");
const slotQuickForm = document.querySelector("#slotQuickForm");
const slotModalTitle = document.querySelector("#slotModalTitle");
const slotModalMeta = document.querySelector("#slotModalMeta");
const slotGuestsInput = document.querySelector("#slotGuestsInput");
const slotModalAvailability = document.querySelector("#slotModalAvailability");
const exportCsvButton = document.querySelector("#exportCsvButton");
const copyReportButton = document.querySelector("#copyReportButton");
const reviewForm = document.querySelector("#reviewForm");
const reviewsList = document.querySelector("#reviewsList");
const emptyReviews = document.querySelector("#emptyReviews");
const reviewAverage = document.querySelector("#reviewAverage");
const reviewCount = document.querySelector("#reviewCount");
const installButton = document.querySelector("#installButton");
const installHint = document.querySelector("#installHint");
const tasteText = document.querySelector("#tasteText");
const tasteList = document.querySelector("#tasteList");
const truckSearchInput = document.querySelector("#truckSearchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const festivalMap = document.querySelector("#festivalMap");
const selectedTruckCard = document.querySelector("#selectedTruckCard");
const truckGrid = document.querySelector("#truckGrid");
const emptyTrucks = document.querySelector("#emptyTrucks");
const voteForm = document.querySelector("#voteForm");
const voteCategory = document.querySelector("#voteCategory");
const voteTruck = document.querySelector("#voteTruck");
const leaderboardTabs = document.querySelector("#leaderboardTabs");
const leaderboardList = document.querySelector("#leaderboardList");
const staffVoteTabs = document.querySelector("#staffVoteTabs");
const staffVoteLeaderboard = document.querySelector("#staffVoteLeaderboard");
const staffVotesTable = document.querySelector("#staffVotesTable");
const emptyStaffVotes = document.querySelector("#emptyStaffVotes");
const clearVotesButton = document.querySelector("#clearVotesButton");
const truckForm = document.querySelector("#truckForm");
const truckAdminTable = document.querySelector("#truckAdminTable");
const resetTruckFormButton = document.querySelector("#resetTruckFormButton");
const adminLoginPanel = document.querySelector("#adminLoginPanel");
const adminLoginForm = document.querySelector("#adminLoginForm");
const staffWorkspace = document.querySelector("#staffWorkspace");
const adminLogoutButton = document.querySelector("#adminLogoutButton");
const staffAuthStatus = document.querySelector("#staffAuthStatus");
const notificationPermissionButton = document.querySelector("#notificationPermissionButton");
const exportAnalyticsButton = document.querySelector("#exportAnalyticsButton");
const clearAnalyticsButton = document.querySelector("#clearAnalyticsButton");
const consentBanner = document.querySelector("#consentBanner");
const acceptAnalyticsButton = document.querySelector("#acceptAnalyticsButton");
const rejectAnalyticsButton = document.querySelector("#rejectAnalyticsButton");
const privacyPreferencesButton = document.querySelector("#privacyPreferencesButton");
const PAGE_ROUTES = {
  home: "index.html",
  mappa: "mappa.html",
  truck: "truck.html",
  vota: "vota.html",
  prenota: "prenota.html",
  programma: "programma.html",
  recensioni: "recensioni.html",
  privacy: "privacy.html",
  gestione: "gestione.html",
  staff: "gestione.html",
};
const LEGACY_HASH_ROUTES = {
  "#home": "index.html",
  "#mappa": "mappa.html",
  "#truck": "truck.html",
  "#vota": "vota.html",
  "#prenota": "prenota.html",
  "#programma": "programma.html",
  "#recensioni": "recensioni.html",
  "#privacy": "privacy.html",
  "#staff": "gestione.html",
  "#gestione": "gestione.html",
};

let reservations = loadReservations();
let reviews = loadReviews();
let trucks = loadTrucks();
let votes = loadVotes();
let analyticsEvents = loadAnalyticsEvents();
let capacityPerSlot = Number(localStorage.getItem(CAPACITY_KEY)) || DEFAULT_CAPACITY_PER_SLOT;
let deferredInstallPrompt = null;
let selectedTruckId = sessionStorage.getItem("cssf-selected-truck") || trucks[0]?.id || "";
let activeLeaderboardCategory = voteCategories[0].value;
let activeStaffVoteCategory = voteCategories[0].value;
let sessionId = sessionStorage.getItem("cssf-session-id") || createId("SESSION");
let supabaseClient = createSupabaseClient();
let reservationsRealtimeChannel = null;
let trucksRealtimeChannel = null;
let votesRealtimeChannel = null;
let staffSession = null;
let lastReservationRemoteError = "";
let lastTruckRemoteError = "";
let lastVoteRemoteError = "";
let voteLeaderboardRows = [];
let remoteVoteLeaderboardSynced = false;
let knownRemoteReservationIds = new Set(reservations.map((reservation) => reservation.id));
let remoteReservationsSynced = false;
let serviceWorkerReloading = false;
sessionStorage.setItem("cssf-session-id", sessionId);

redirectLegacyHashRoute();

if (capacityInput) {
  capacityInput.value = capacityPerSlot;
}

bindEvent(bookingForm, "submit", handleBookingSubmit);
bindEvent(bookingForm?.day, "change", updateAvailabilityReadout);
bindEvent(bookingForm?.slot, "change", updateAvailabilityReadout);
bindEvent(bookingForm?.guests, "input", updateAvailabilityReadout);
bindEvent(searchInput, "input", renderReservations);
bindEvent(dayFilter, "change", renderReservations);
bindEvent(statusFilter, "change", renderReservations);
bindEvent(capacityInput, "change", handleCapacityChange);
bindEvent(slotQuickForm, "submit", handleSlotQuickSubmit);
bindEvent(slotGuestsInput, "input", updateSlotModalAvailability);
bindEvent(exportCsvButton, "click", exportCsv);
bindEvent(copyReportButton, "click", copyReport);
bindEvent(reviewForm, "submit", handleReviewSubmit);
bindEvent(installButton, "click", handleInstallClick);
bindEvent(truckSearchInput, "input", renderFestival);
bindEvent(categoryFilter, "change", renderFestival);
bindEvent(voteForm, "submit", handleVoteSubmit);
bindEvent(voteCategory, "change", renderVoteOptions);
bindEvent(truckForm, "submit", handleTruckFormSubmit);
bindEvent(resetTruckFormButton, "click", resetTruckForm);
bindEvent(adminLoginForm, "submit", handleAdminLogin);
bindEvent(adminLogoutButton, "click", handleAdminLogout);
bindEvent(notificationPermissionButton, "click", requestStaffNotifications);
bindEvent(exportAnalyticsButton, "click", exportAnalyticsCsv);
bindEvent(clearAnalyticsButton, "click", clearAnalyticsEvents);
bindEvent(clearVotesButton, "click", clearVotesRemote);
bindEvent(acceptAnalyticsButton, "click", () => setAnalyticsConsent("accepted"));
bindEvent(rejectAnalyticsButton, "click", () => setAnalyticsConsent("rejected"));
bindEvent(privacyPreferencesButton, "click", resetPrivacyPreferences);
bindEvent(window, "storage", handleSharedStorageUpdate);

setupMoodButtons();
setupSlotModal();
setupInstallPrompt();
setupAnalytics();
setupAppViews();
initializeStaffAuth();
registerServiceWorker();
updateCountdown();
window.setInterval(updateCountdown, 1000);
renderLeaderboardTabs();
renderStaffVoteTabs();
render();
renderReviews();
cleanupLegacyCaches();
setupSupabaseReservations();
setupSupabaseTrucks();
setupSupabaseVotes();

function bindEvent(element, eventName, handler) {
  element?.addEventListener(eventName, handler);
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("Timeout Supabase")), timeoutMs);
    }),
  ]);
}

async function cleanupLegacyCaches() {
  if (!("caches" in window)) return;

  try {
    const keys = await caches.keys();
    const legacyKeys = keys.filter((key) => key.startsWith("cssf-pwa-") && key !== ACTIVE_PWA_CACHE_NAME);
    await Promise.all(legacyKeys.map((key) => caches.delete(key)));
  } catch {}
}

function redirectLegacyHashRoute() {
  const target = LEGACY_HASH_ROUTES[window.location.hash];
  if (!target) return;

  const pathname = window.location.pathname.toLowerCase();
  if (pathname.endsWith(`/${target}`) || pathname.endsWith(target)) {
    history.replaceState(null, "", target);
    return;
  }

  window.location.replace(target);
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const guests = clampNumber(Number(formData.get("guests")), 1, 30);
  const day = String(formData.get("day"));
  const slot = String(formData.get("slot"));
  const available = getAvailableSeats(day, slot);
  const status = guests > available ? "waiting" : "pending";

  const reservation = {
    id: createReservationId(),
    createdAt: new Date().toISOString(),
    name: cleanText(formData.get("name")),
    phone: cleanText(formData.get("phone")),
    email: cleanText(formData.get("email")),
    day,
    slot,
    guests,
    area: cleanText(formData.get("area")),
    arrival: cleanText(formData.get("arrival")),
    notes: cleanText(formData.get("notes")),
    status,
    tables: suggestTables(guests),
  };

  reservations.unshift(reservation);
  saveReservations();
  const remoteSaved = await saveReservationRemote(reservation);
  bookingForm.reset();
  bookingForm.guests.value = 4;
  render();
  trackEvent("conversion", "prenotazione inviata", { section: "prenota", code: reservation.id });

  const remainingSeats = status === "waiting" ? available : Math.max(0, available - guests);
  const message =
    status === "waiting"
      ? "Turno pieno: richiesta inserita in lista attesa."
      : `Richiesta registrata: restano ${remainingSeats} posti disponibili.`;
  showToast(
    remoteSaved
      ? `${message} Codice ${reservation.id}`
      : `${message} Codice ${reservation.id}. Backend non collegato: ${lastReservationRemoteError || "salvata solo localmente"}`,
  );
}

function handleReviewSubmit(event) {
  event.preventDefault();

  const formData = new FormData(reviewForm);
  const review = {
    id: createId("REV"),
    createdAt: new Date().toISOString(),
    reviewer: cleanText(formData.get("reviewer")),
    rating: clampNumber(Number(formData.get("rating")), 1, 5),
    title: cleanText(formData.get("title")),
    body: cleanText(formData.get("body")),
  };

  reviews.unshift(review);
  saveReviews();
  reviewForm.reset();
  renderReviews();
  trackEvent("conversion", "recensione pubblicata", { section: "recensioni", rating: review.rating });
  showToast("Recensione pubblicata localmente.");
}

async function handleVoteSubmit(event) {
  event.preventDefault();

  const formData = new FormData(voteForm);
  const truckId = String(formData.get("truckId"));
  const truck = trucks.find((item) => item.id === truckId);

  if (!truck) {
    showToast("Seleziona uno stand valido.");
    return;
  }

  const vote = {
    id: createId("VOTE"),
    createdAt: new Date().toISOString(),
    category: String(formData.get("category")),
    truckId,
    voter: cleanText(formData.get("voter")),
  };

  votes.unshift(vote);
  saveVotes();
  selectedTruckId = truckId;
  activeLeaderboardCategory = String(formData.get("category"));
  voteForm.reset();
  render();
  const remoteSaved = await saveVoteRemote(vote);
  trackEvent("conversion", "voto inviato", {
    section: "vota",
    category: String(formData.get("category")),
    truckId,
  });
  showToast(
    remoteSaved
      ? `Voto registrato per ${truck.name}.`
      : `Voto registrato localmente: ${lastVoteRemoteError || "backend non disponibile"}.`,
  );
}

async function handleTruckFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(truckForm);
  const existingId = String(formData.get("id") || "");
  const existing = trucks.find((item) => item.id === existingId);
  const id = existing?.id || createId("TRUCK").toLowerCase();
  const code = existing?.code || createTruckCode();
  const truck = {
    id,
    code,
    name: cleanText(formData.get("name")),
    category: String(formData.get("category")),
    zone: cleanText(formData.get("zone")),
    menu: cleanText(formData.get("menu")),
    status: "open",
    x: clampNumber(Number(formData.get("x")), 8, 92),
    y: clampNumber(Number(formData.get("y")), 12, 88),
  };

  if (existing) {
    trucks = trucks.map((item) => (item.id === existing.id ? truck : item));
  } else {
    trucks.push(truck);
  }

  selectedTruckId = id;
  saveTrucks();
  resetTruckForm();
  render();
  const remoteSaved = await saveTruckRemote(truck);
  trackEvent("admin", "stand salvato", { truckId: id });
  showToast(
    remoteSaved
      ? "Stand salvato e sincronizzato."
      : `Stand salvato localmente: ${lastTruckRemoteError || "backend non disponibile"}.`,
  );
}

function handleCapacityChange() {
  if (!capacityInput) return;

  capacityPerSlot = clampNumber(Number(capacityInput.value), SEATS_PER_TABLE, DEFAULT_CAPACITY_PER_SLOT);
  capacityInput.value = capacityPerSlot;
  localStorage.setItem(CAPACITY_KEY, String(capacityPerSlot));
  render();
}

function setupSlotModal() {
  if (!bookingSlotModal) return;

  document.querySelectorAll("[data-close-slot-modal]").forEach((button) => {
    button.addEventListener("click", closeSlotModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !bookingSlotModal.hidden) {
      closeSlotModal();
    }
  });
}

function render() {
  updateMetrics();
  renderFestival();
  renderSlots();
  renderReservations();
  renderStaffVotes();
  renderAnalyticsDashboard();
  updateAvailabilityReadout();
}

function createSupabaseClient() {
  if (!window.supabase?.createClient || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

async function setupSupabaseReservations() {
  if (!supabaseClient) return;

  if (isStaffPage()) {
    if (!staffSession) return;
    await refreshReservationsFromRemote();
    subscribeToReservationChanges();
    return;
  }

  await refreshReservationsFromRemote();
}

async function setupSupabaseTrucks() {
  if (!supabaseClient) return;

  await refreshTrucksFromRemote();
  subscribeToTruckChanges();
}

async function setupSupabaseVotes() {
  if (!supabaseClient) return;

  if (staffSession) {
    await refreshVotesFromRemote();
  } else {
    await refreshVoteLeaderboardFromRemote();
  }
  subscribeToVoteChanges();
}

async function refreshReservationsFromRemote() {
  if (!supabaseClient) return false;

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_RESERVATIONS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !Array.isArray(data)) return false;

    const remoteReservations = data.map(mapReservationFromRemote);
    if (remoteReservationsSynced) {
      announceNewRemoteReservations(remoteReservations);
    }
    reservations = remoteReservations;
    knownRemoteReservationIds = new Set(reservations.map((reservation) => reservation.id));
    remoteReservationsSynced = true;
    saveReservations();
    render();
    return true;
  } catch {
    return false;
  }
}

function subscribeToReservationChanges() {
  if (!supabaseClient || reservationsRealtimeChannel) return;

  reservationsRealtimeChannel = supabaseClient
    .channel("cssf-reservations-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: SUPABASE_RESERVATIONS_TABLE },
      () => refreshReservationsFromRemote(),
    )
    .subscribe();
}

async function refreshTrucksFromRemote() {
  if (!supabaseClient) return false;

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_TRUCKS_TABLE)
      .select("*")
      .order("code", { ascending: true });

    if (error || !Array.isArray(data) || !data.length) return false;

    trucks = data.map(mapTruckFromRemote);
    if (!trucks.some((truck) => truck.id === selectedTruckId)) {
      selectedTruckId = trucks[0]?.id || "";
    }
    saveTrucks();
    render();
    renderLeaderboardTabs();
    return true;
  } catch {
    return false;
  }
}

function subscribeToTruckChanges() {
  if (!supabaseClient || trucksRealtimeChannel) return;

  trucksRealtimeChannel = supabaseClient
    .channel("cssf-trucks-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: SUPABASE_TRUCKS_TABLE },
      () => refreshTrucksFromRemote(),
    )
    .subscribe();
}

async function refreshVotesFromRemote() {
  if (!supabaseClient) return false;

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_VOTES_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !Array.isArray(data)) return false;

    votes = data.map(mapVoteFromRemote);
    voteLeaderboardRows = getLeaderboardFromVotes();
    remoteVoteLeaderboardSynced = true;
    saveVotes();
    render();
    return true;
  } catch {
    return false;
  }
}

async function refreshVoteLeaderboardFromRemote() {
  if (!supabaseClient) return false;

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_VOTE_LEADERBOARD_VIEW)
      .select("*")
      .order("vote_count", { ascending: false });

    if (error || !Array.isArray(data)) return false;

    voteLeaderboardRows = data.map(mapVoteLeaderboardFromRemote);
    remoteVoteLeaderboardSynced = true;
    render();
    return true;
  } catch {
    return false;
  }
}

function subscribeToVoteChanges() {
  if (!supabaseClient || votesRealtimeChannel) return;

  votesRealtimeChannel = supabaseClient
    .channel("cssf-votes-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: SUPABASE_VOTES_TABLE },
      () => (staffSession ? refreshVotesFromRemote() : refreshVoteLeaderboardFromRemote()),
    )
    .subscribe();
}

async function initializeStaffAuth() {
  if (!isStaffPage()) {
    renderAdminAccess();
    return;
  }

  if (!supabaseClient?.auth) {
    renderAdminAccess();
    setStaffAuthStatus("Supabase non disponibile: usa solo il fallback locale.");
    return;
  }

  try {
    const { data } = await supabaseClient.auth.getSession();
    staffSession = data?.session || null;
  } catch {
    staffSession = null;
  }

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    staffSession = session || null;
    renderAdminAccess();
    if (staffSession) {
      refreshReservationsFromRemote();
      refreshVotesFromRemote();
      subscribeToReservationChanges();
      subscribeToVoteChanges();
    }
  });

  renderAdminAccess();
  if (staffSession) {
    await refreshReservationsFromRemote();
    await refreshVotesFromRemote();
    subscribeToReservationChanges();
    subscribeToVoteChanges();
  }
}

async function requestStaffNotifications() {
  if (!("Notification" in window)) {
    updateNotificationPermissionUi();
    showToast("Questo browser non supporta le notifiche.");
    return;
  }

  if (Notification.permission === "granted") {
    updateNotificationPermissionUi();
    showToast("Notifiche staff gia attive.");
    return;
  }

  const permission = await Notification.requestPermission();
  updateNotificationPermissionUi();
  showToast(
    permission === "granted"
      ? "Notifiche staff attive."
      : permission === "denied"
        ? "Notifiche bloccate: riattivale dalle impostazioni del browser."
        : "Notifiche non abilitate.",
  );
}

function updateNotificationPermissionUi() {
  if (!notificationPermissionButton) return;

  if (!("Notification" in window)) {
    notificationPermissionButton.classList.remove("is-active", "is-blocked");
    notificationPermissionButton.classList.add("is-unavailable");
    notificationPermissionButton.setAttribute("aria-label", "Notifiche non supportate");
    notificationPermissionButton.title = "Notifiche non supportate";
    notificationPermissionButton.disabled = true;
    return;
  }

  if (Notification.permission === "granted") {
    notificationPermissionButton.classList.add("is-active");
    notificationPermissionButton.classList.remove("is-blocked", "is-unavailable");
    notificationPermissionButton.setAttribute("aria-label", "Notifiche staff attive");
    notificationPermissionButton.setAttribute("aria-pressed", "true");
    notificationPermissionButton.title = "Notifiche staff attive";
    notificationPermissionButton.disabled = false;
  } else if (Notification.permission === "denied") {
    notificationPermissionButton.classList.add("is-blocked");
    notificationPermissionButton.classList.remove("is-active", "is-unavailable");
    notificationPermissionButton.setAttribute("aria-label", "Notifiche bloccate dal browser");
    notificationPermissionButton.setAttribute("aria-pressed", "false");
    notificationPermissionButton.title = "Notifiche bloccate dal browser";
    notificationPermissionButton.disabled = false;
  } else {
    notificationPermissionButton.classList.remove("is-active", "is-blocked", "is-unavailable");
    notificationPermissionButton.setAttribute("aria-label", "Attiva notifiche staff");
    notificationPermissionButton.setAttribute("aria-pressed", "false");
    notificationPermissionButton.title = "Attiva notifiche staff";
    notificationPermissionButton.disabled = false;
  }
}

function announceNewRemoteReservations(remoteReservations) {
  if (!isStaffPage() || !isAdminAuthenticated()) return;

  const newReservations = remoteReservations.filter((reservation) => !knownRemoteReservationIds.has(reservation.id));
  if (!newReservations.length) return;

  newReservations.forEach((reservation) => {
    const message = `${reservation.name} - ${reservation.guests} persone, ${getDayLabel(reservation.day, true)} ore ${reservation.slot}`;
    showToast(`Nuova prenotazione: ${message}`);
    showStaffBrowserNotification(reservation, message);
  });
}

function showStaffBrowserNotification(reservation, message) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const notification = new Notification("Nuova prenotazione CSSF", {
    body: message,
    tag: reservation.id,
    icon: "icons/app-icon-192.png",
    badge: "icons/app-icon-192.png",
  });

  notification.onclick = () => {
    window.focus();
    document.querySelector("#prenotazioni")?.scrollIntoView({ behavior: "smooth", block: "start" });
    notification.close();
  };
}

function setupMoodButtons() {
  if (!tasteText || !tasteList) return;

  document.querySelectorAll(".mood-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".mood-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderTasteRoute(button.dataset.mood);
    });
  });

  renderTasteRoute("tradizione");
}

function renderTasteRoute(mood) {
  const route = tasteRoutes[mood] || tasteRoutes.tradizione;
  tasteText.textContent = route.text;
  tasteList.innerHTML = "";
  route.items.forEach((item) => {
    const pill = document.createElement("span");
    pill.textContent = item;
    tasteList.append(pill);
  });
}

function renderFestival() {
  if (!festivalMap && !selectedTruckCard && !truckGrid && !voteTruck && !truckAdminTable) return;

  const filtered = getFilteredTrucks();

  if (!filtered.length) {
    selectedTruckId = "";
  } else if (!filtered.some((truck) => truck.id === selectedTruckId)) {
    selectedTruckId = filtered[0].id;
  }

  renderTruckMap(filtered);
  renderSelectedTruck();
  renderTruckGrid(filtered);
  renderVoteOptions();
  renderLeaderboard();
  renderTruckAdminTable();
}

function renderTruckMap(filtered) {
  if (!festivalMap) return;

  festivalMap.querySelectorAll(".map-marker").forEach((marker) => marker.remove());

  filtered.flatMap(getTruckMapMarkers).forEach(({ truck, position, index, total }) => {
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "map-marker";
    marker.dataset.category = truck.category;
    marker.style.setProperty("--marker-color", truck.color || "#e84b2a");
    marker.style.left = `${position.x}%`;
    marker.style.top = `${position.y}%`;
    marker.textContent = truck.code;
    marker.setAttribute(
      "aria-label",
      total > 1
        ? `${truck.name}, postazione ${index + 1} di ${total}, ${truckStatusLabels[truck.status]}`
        : `${truck.name}, ${truckStatusLabels[truck.status]}`,
    );
    marker.classList.toggle("is-active", truck.id === selectedTruckId);
    marker.addEventListener("click", () => {
      selectedTruckId = truck.id;
      renderFestival();
    });
    festivalMap.append(marker);
  });
}

function getTruckMapMarkers(truck) {
  const positions = Array.isArray(truck.mapPositions) && truck.mapPositions.length
    ? truck.mapPositions
    : [{ x: truck.x, y: truck.y }];

  return positions.map((position, index) => ({
    truck,
    position,
    index,
    total: positions.length,
  }));
}

function renderSelectedTruck() {
  if (!selectedTruckCard) return;

  const truck = trucks.find((item) => item.id === selectedTruckId);

  if (!truck) {
    selectedTruckCard.innerHTML = "<p class=\"truck-menu\">Nessuno stand selezionato.</p>";
    return;
  }

  selectedTruckCard.innerHTML = createTruckCardMarkup(truck, true);
  selectedTruckCard.querySelector("[data-vote-truck]")?.addEventListener("click", () => {
    sessionStorage.setItem("cssf-selected-truck", truck.id);
    navigateToPage("vota");
  });
}

function renderTruckGrid(filtered) {
  if (!truckGrid || !emptyTrucks) return;

  truckGrid.innerHTML = "";
  emptyTrucks.classList.toggle("visible", filtered.length === 0);

  filtered.forEach((truck) => {
    const card = document.createElement("article");
    card.className = "truck-card";
    card.innerHTML = createTruckCardMarkup(truck, false);
    card.querySelector("[data-map-truck]")?.addEventListener("click", () => {
      selectedTruckId = truck.id;
      sessionStorage.setItem("cssf-selected-truck", truck.id);
      renderFestival();
      navigateToPage("mappa");
    });
    card.querySelector("[data-vote-truck]")?.addEventListener("click", () => {
      sessionStorage.setItem("cssf-selected-truck", truck.id);
      navigateToPage("vota");
    });
    truckGrid.append(card);
  });
}

function createTruckCardMarkup(truck, selected) {
  const voteButton = `<button class="small-button" type="button" data-vote-truck="${escapeHtml(truck.id)}">Vota</button>`;
  const mapButton = selected
    ? ""
    : `<button class="small-button" type="button" data-map-truck="${escapeHtml(truck.id)}">Mappa</button>`;

  return `
    <div class="truck-meta">
      <span>${escapeHtml(truck.code)}</span>
      <span>${escapeHtml(categoryLabels[truck.category] || truck.category)}</span>
      <span>${escapeHtml(truck.zone)}</span>
    </div>
    <h3>${escapeHtml(truck.name)}</h3>
    <p class="truck-menu">${escapeHtml(truck.menu)}</p>
    <div class="truck-meta">
      <span class="status-live ${escapeHtml(truck.status)}">${escapeHtml(truckStatusLabels[truck.status] || truck.status)}</span>
    </div>
    <div class="truck-actions">
      ${voteButton}
      ${mapButton}
    </div>
  `;
}

function renderVoteOptions() {
  if (!voteTruck) return;

  const currentValue = voteTruck.value || selectedTruckId;
  voteTruck.innerHTML = "";

  trucks.forEach((truck) => {
    const option = document.createElement("option");
    option.value = truck.id;
    option.textContent = `${truck.code} - ${truck.name}`;
    option.selected = truck.id === currentValue;
    voteTruck.append(option);
  });
}

function renderLeaderboardTabs() {
  if (!leaderboardTabs) return;

  leaderboardTabs.innerHTML = "";
  voteCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "leaderboard-tab";
    button.textContent = category.label;
    button.dataset.category = category.value;
    button.addEventListener("click", () => {
      activeLeaderboardCategory = category.value;
      renderLeaderboard();
    });
    leaderboardTabs.append(button);
  });
}

function renderStaffVoteTabs() {
  if (!staffVoteTabs) return;

  staffVoteTabs.innerHTML = "";
  voteCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "leaderboard-tab";
    button.textContent = category.label;
    button.dataset.category = category.value;
    button.addEventListener("click", () => {
      activeStaffVoteCategory = category.value;
      renderStaffVotes();
    });
    staffVoteTabs.append(button);
  });
}

function renderLeaderboard() {
  if (!leaderboardTabs || !leaderboardList) return;

  leaderboardTabs.querySelectorAll(".leaderboard-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === activeLeaderboardCategory);
  });

  const rows = getLeaderboard(activeLeaderboardCategory);
  leaderboardList.innerHTML = "";

  if (!rows.length) {
    leaderboardList.innerHTML = "<div class=\"empty-state visible\">Nessun voto registrato per questa categoria.</div>";
    return;
  }

  rows.forEach((row, index) => {
    const item = document.createElement("div");
    item.className = "leaderboard-row";
    item.innerHTML = `
      <div class="leaderboard-rank">${index + 1}</div>
      <div>
        <strong>${escapeHtml(row.truck.name)}</strong>
        <span>${escapeHtml(categoryLabels[row.truck.category] || row.truck.category)} - ${escapeHtml(row.truck.zone)}</span>
      </div>
      <div class="vote-count">${row.count} voti</div>
    `;
    leaderboardList.append(item);
  });
}

function renderStaffVotes() {
  if (!staffVoteTabs || !staffVoteLeaderboard || !staffVotesTable || !emptyStaffVotes) return;

  staffVoteTabs.querySelectorAll(".leaderboard-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === activeStaffVoteCategory);
  });

  const rows = getLeaderboard(activeStaffVoteCategory);
  staffVoteLeaderboard.innerHTML = "";

  if (!rows.length) {
    staffVoteLeaderboard.innerHTML = "<div class=\"empty-state visible\">Nessun voto in questa categoria.</div>";
  } else {
    rows.forEach((row, index) => {
      const item = document.createElement("div");
      item.className = "leaderboard-row";
      item.innerHTML = `
        <div class="leaderboard-rank">${index + 1}</div>
        <div>
          <strong>${escapeHtml(row.truck.name)}</strong>
          <span>${escapeHtml(row.truck.code)} - ${escapeHtml(categoryLabels[row.truck.category] || row.truck.category)}</span>
        </div>
        <div class="vote-count">${row.count} voti</div>
      `;
      staffVoteLeaderboard.append(item);
    });
  }

  const filteredVotes = votes.filter((vote) => vote.category === activeStaffVoteCategory);
  staffVotesTable.innerHTML = "";
  emptyStaffVotes.classList.toggle("visible", filteredVotes.length === 0);

  filteredVotes.forEach((vote) => {
    const truck = trucks.find((item) => item.id === vote.truckId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Ora">${escapeHtml(formatDateTime(vote.createdAt))}</td>
      <td data-label="Nome"><strong>${escapeHtml(vote.voter || "Anonimo")}</strong></td>
      <td data-label="Categoria">${escapeHtml(getVoteCategoryLabel(vote.category))}</td>
      <td data-label="Stand">${escapeHtml(truck ? `${truck.code} - ${truck.name}` : vote.truckId)}</td>
    `;
    staffVotesTable.append(row);
  });
}

function renderTruckAdminTable() {
  if (!truckAdminTable) return;

  truckAdminTable.innerHTML = "";

  trucks.forEach((truck) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Stand">
        <div class="customer-cell">
          <strong>${escapeHtml(truck.name)}</strong>
          <span>${escapeHtml(truck.code)} - ${escapeHtml(truck.zone)}</span>
        </div>
      </td>
      <td data-label="Categoria">${escapeHtml(categoryLabels[truck.category] || truck.category)}</td>
      <td data-label="Stato">
        <span class="status-live ${escapeHtml(truck.status)}">${escapeHtml(truckStatusLabels[truck.status] || truck.status)}</span>
      </td>
      <td data-label="Azioni">
        <div class="row-actions">
          <button class="small-button" type="button" data-edit-truck="${escapeHtml(truck.id)}">Modifica</button>
          <button class="small-button danger" type="button" data-delete-truck="${escapeHtml(truck.id)}">Elimina</button>
        </div>
      </td>
    `;

    row.querySelector("[data-edit-truck]").addEventListener("click", () => editTruck(truck.id));
    row.querySelector("[data-delete-truck]").addEventListener("click", () => deleteTruck(truck.id));
    truckAdminTable.append(row);
  });
}

function getFilteredTrucks() {
  if (!truckSearchInput || !categoryFilter) {
    return trucks;
  }

  const query = truckSearchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return trucks.filter((truck) => {
    const haystack = [truck.name, truck.code, truck.category, truck.zone, truck.menu]
      .join(" ")
      .toLowerCase();
    const matchesQuery = haystack.includes(query);
    const matchesCategory = category === "all" || truck.category === category;
    return matchesQuery && matchesCategory;
  });
}

function getLeaderboard(category) {
  if (remoteVoteLeaderboardSynced && voteLeaderboardRows.length) {
    return voteLeaderboardRows
      .filter((row) => row.category === category)
      .map((row) => ({
        truck: trucks.find((truck) => truck.id === row.truckId),
        count: row.count,
      }))
      .filter((row) => row.truck)
      .sort((a, b) => b.count - a.count || a.truck.name.localeCompare(b.truck.name));
  }

  return getLeaderboardFromVotes(category);
}

function getLeaderboardFromVotes(category) {
  const counts = votes
    .filter((vote) => !category || vote.category === category)
    .reduce((acc, vote) => {
      const key = `${vote.category}::${vote.truckId}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  return Object.entries(counts)
    .map(([key, count]) => {
      const [voteCategory, truckId] = key.split("::");
      return {
        category: voteCategory,
        truckId,
        truck: trucks.find((truck) => truck.id === truckId),
        count,
      };
    })
    .filter((row) => row.truck)
    .sort((a, b) => b.count - a.count || a.truck.name.localeCompare(b.truck.name));
}

function editTruck(id) {
  const truck = trucks.find((item) => item.id === id);
  if (!truck) return;

  truckForm.elements.id.value = truck.id;
  truckForm.elements.name.value = truck.name;
  truckForm.elements.category.value = truck.category;
  truckForm.elements.zone.value = truck.zone;
  truckForm.elements.x.value = truck.x;
  truckForm.elements.y.value = truck.y;
  truckForm.elements.menu.value = truck.menu;
  selectedTruckId = truck.id;
  renderFestival();
  document.querySelector("#truck-admin-title")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteTruck(id) {
  const truck = trucks.find((item) => item.id === id);
  if (!truck) return;

  const confirmed = window.confirm(`Eliminare ${truck.name}? Verranno rimossi anche i voti associati.`);
  if (!confirmed) return;

  trucks = trucks.filter((item) => item.id !== id);
  votes = votes.filter((vote) => vote.truckId !== id);
  selectedTruckId = trucks[0]?.id || "";
  saveTrucks();
  saveVotes();
  resetTruckForm();
  render();
  const remoteDeleted = await deleteTruckRemote(id);
  showToast(remoteDeleted ? "Stand eliminato e sincronizzato." : "Stand eliminato localmente.");
}

function resetTruckForm() {
  if (!truckForm) return;

  truckForm.reset();
  truckForm.elements.id.value = "";
  truckForm.elements.x.value = 24;
  truckForm.elements.y.value = 36;
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const email = cleanText(formData.get("email"));
  const password = String(formData.get("password") || "");
  const pin = String(formData.get("pin") || "").trim();

  if (email && password) {
    if (!supabaseClient?.auth) {
      showToast("Supabase Auth non disponibile.");
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error || !data?.session) {
      showToast("Credenziali staff non corrette.");
      setStaffAuthStatus("Accesso non riuscito: controlla email e password.");
      return;
    }

    staffSession = data.session;
    sessionStorage.setItem(ADMIN_SESSION_KEY, "supabase");
    adminLoginForm.reset();
    renderAdminAccess();
    await refreshReservationsFromRemote();
    await refreshVotesFromRemote();
    subscribeToReservationChanges();
    subscribeToVoteChanges();
    showToast("Accesso staff effettuato.");
    return;
  }

  if (pin !== ADMIN_FALLBACK_PIN) {
    showToast("Inserisci email/password staff oppure il PIN locale corretto.");
    setStaffAuthStatus("Sessione staff non attiva.");
    return;
  }

  sessionStorage.setItem(ADMIN_SESSION_KEY, "fallback");
  adminLoginForm.reset();
  renderAdminAccess();
  renderAnalyticsDashboard();
  showToast("Accesso locale effettuato. Le prenotazioni Supabase richiedono login staff.");
}

async function handleAdminLogout() {
  if (supabaseClient?.auth && staffSession) {
    await supabaseClient.auth.signOut();
  }

  staffSession = null;
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  refreshVoteLeaderboardFromRemote();
  renderAdminAccess();
  showToast("Sessione admin chiusa.");
}

function renderAdminAccess() {
  if (!adminLoginPanel || !staffWorkspace || !copyReportButton || !exportCsvButton) return;

  const unlocked = isAdminAuthenticated();
  adminLoginPanel.hidden = unlocked;
  staffWorkspace.hidden = !unlocked;
  copyReportButton.disabled = !unlocked;
  exportCsvButton.disabled = !unlocked;
  if (clearVotesButton) {
    clearVotesButton.disabled = !unlocked;
  }
  updateNotificationPermissionUi();

  if (staffSession) {
    setStaffAuthStatus(`Sessione Supabase attiva: ${staffSession.user?.email || "staff"}.`);
  } else if (sessionStorage.getItem(ADMIN_SESSION_KEY) === "fallback") {
    setStaffAuthStatus("Accesso locale attivo: dati Supabase non leggibili senza login staff.");
  } else {
    setStaffAuthStatus("Sessione staff non attiva.");
  }
}

function isAdminAuthenticated() {
  return Boolean(staffSession) || sessionStorage.getItem(ADMIN_SESSION_KEY) === "fallback";
}

function isStaffPage() {
  return document.body.dataset.page === "gestione";
}

function setStaffAuthStatus(message) {
  if (staffAuthStatus) {
    staffAuthStatus.textContent = message;
  }
}

function setupAppViews() {
  const currentPage = getCurrentPageId();

  document.querySelectorAll("[data-view-link]").forEach((link) => {
    const id = getViewId(link);
    const active = id === currentPage;
    link.classList.toggle("is-active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }

    link.addEventListener("click", (event) => {
      const id = getViewId(link);
      if (!id) return;
      event.preventDefault();
      navigateToPage(id);
    });
  });
}

function getViewId(element) {
  if (!element) return "";

  const dataView = element.getAttribute("data-view-link");
  if (dataView) return dataView;

  const href = element.getAttribute("href");
  if (!href) return "";

  return Object.entries(PAGE_ROUTES).find(([, route]) => href.endsWith(route))?.[0] || "";
}

function navigateToPage(id) {
  const page = PAGE_ROUTES[id] || PAGE_ROUTES.home;
  const currentPage = getCurrentPageId();

  if (currentPage === id) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  window.location.href = page;
}

function getCurrentPageId() {
  const page = document.body.dataset.page;
  if (page) return page;

  const pathname = window.location.pathname.toLowerCase();
  return Object.entries(PAGE_ROUTES).find(([, route]) => pathname.endsWith(`/${route}`) || pathname.endsWith(route))?.[0] || "home";
}

let sectionObserverStarted = false;
let trackedSections = new Set(JSON.parse(sessionStorage.getItem("cssf-tracked-sections") || "[]"));

function setupAnalytics() {
  const consent = getAnalyticsConsent();
  if (consentBanner) {
    consentBanner.hidden = Boolean(consent) || localStorage.getItem(PRIVACY_BANNER_SEEN_KEY) === "yes";
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target.closest("button, a, input[type='button'], input[type='submit']");
      if (!target) return;
      trackEvent("click", getElementLabel(target), { section: getSectionId(target) });
    },
    true,
  );

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target.closest("form");
      if (!form) return;
      trackEvent("form_submit", form.id || "form", { section: getSectionId(form) });
    },
    true,
  );

  if (consent === "accepted") {
    startSectionAnalytics();
    trackEvent("visit", "page loaded", { section: getCurrentSectionId() });
  }
}

function setAnalyticsConsent(value) {
  localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  localStorage.setItem(PRIVACY_BANNER_SEEN_KEY, "yes");
  if (consentBanner) {
    consentBanner.hidden = true;
  }

  if (value === "accepted") {
    startSectionAnalytics();
    trackEvent("consent", "accepted", { section: getCurrentSectionId() });
    showToast("Statistiche anonime attive.");
  } else {
    showToast("Statistiche disattivate.");
  }

  renderAnalyticsDashboard();
}

function getAnalyticsConsent() {
  const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : "";
}

function resetPrivacyPreferences() {
  localStorage.removeItem(ANALYTICS_CONSENT_KEY);
  localStorage.removeItem(PRIVACY_BANNER_SEEN_KEY);
  if (consentBanner) {
    consentBanner.hidden = false;
  }
  renderAnalyticsDashboard();
  showToast("Preferenze privacy riaperte.");
}

function startSectionAnalytics() {
  if (sectionObserverStarted || !("IntersectionObserver" in window)) return;
  sectionObserverStarted = true;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.42) return;
        const id = entry.target.id;
        if (!id || trackedSections.has(id)) return;
        trackedSections.add(id);
        sessionStorage.setItem("cssf-tracked-sections", JSON.stringify([...trackedSections]));
        trackEvent("section_view", id, { section: id });
      });
    },
    { threshold: [0.42, 0.7] },
  );

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

function trackEvent(type, label, details = {}) {
  if (getAnalyticsConsent() !== "accepted") return;

  const event = {
    id: createId("EVT"),
    type,
    label: cleanText(label),
    section: details.section || getCurrentSectionId(),
    sessionId,
    createdAt: new Date().toISOString(),
    details,
  };

  analyticsEvents.unshift(event);
  analyticsEvents = analyticsEvents.slice(0, MAX_ANALYTICS_EVENTS);
  saveAnalyticsEvents();
  renderAnalyticsDashboard();
}

function renderAnalyticsDashboard() {
  if (!document.querySelector("#metricAvgDuration")) return;

  const sessions = new Set(analyticsEvents.map((event) => event.sessionId));
  const clicks = analyticsEvents.filter((event) => event.type === "click");
  const sectionViews = analyticsEvents.filter((event) => event.type === "section_view");
  const sectionStats = getTopStats(sectionViews, "label");
  const clickSectionStats = getTopStats(clicks, "section");
  const durationStats = getSessionDurationStats();
  document.querySelector("#metricAvgDuration").textContent = formatDuration(durationStats.averageMs);
  document.querySelector("#metricSessions").textContent = String(sessions.size);
  document.querySelector("#metricSectionViews").textContent = String(sectionViews.length);
  document.querySelector("#metricClicks").textContent = String(clicks.length);
  renderEventMix(sectionStats);
  renderDurationTrendChart(durationStats.rows);
  renderColumnChart("#sectionBarChart", sectionStats, "Nessuna sezione visitata.");
  renderHorizontalChart("#clickBarChart", clickSectionStats, "Nessun click registrato.");

  renderStatsList(
    "#sectionStatsList",
    sectionStats,
    "Nessuna sezione tracciata.",
  );
  renderStatsList("#clickStatsList", clickSectionStats, "Nessun click tracciato.");
  renderDurationList("#durationStatsList", durationStats.rows, "Non ci sono ancora sessioni misurabili.");
}

function renderEventMix(rows) {
  const element = document.querySelector("#eventMixBars");
  if (!element) return;

  if (!rows.length) {
    element.innerHTML = `<div class="empty-state visible">Nessuna sezione tracciata.</div>`;
    return;
  }

  const max = Math.max(...rows.slice(0, 3).map((row) => row.count), 1);

  element.innerHTML = rows
    .slice(0, 3)
    .map((row) => {
      const percentage = Math.max(8, Math.round((row.count / max) * 100));
      return `
        <div class="analytics-mix-row">
          <span>${escapeHtml(row.label)}</span>
          <div class="analytics-bar"><i style="width: ${percentage}%"></i></div>
          <strong>${row.count}</strong>
        </div>
      `;
    })
    .join("");
}

function renderDurationTrendChart(rows) {
  const element = document.querySelector("#durationTrendChart");
  if (!element) return;

  const chartRows = rows
    .slice()
    .sort((a, b) => a.first - b.first)
    .slice(-8);

  if (!chartRows.length) {
    element.innerHTML = `<div class="empty-state visible">Permanenza non ancora misurabile.</div>`;
    return;
  }

  const width = 320;
  const height = 132;
  const max = Math.max(...chartRows.map((row) => row.durationMs), 1);
  const points = chartRows.map((row, index) => {
    const x = chartRows.length === 1 ? width / 2 : (index / (chartRows.length - 1)) * width;
    const y = height - (row.durationMs / max) * (height - 18) - 9;
    return { x, y, row };
  });
  const pointList = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaList = `0,${height} ${pointList} ${width},${height}`;

  element.innerHTML = `
    <svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Andamento permanenza sessioni">
      <polygon points="${areaList}" class="line-chart-area"></polygon>
      <polyline points="${pointList}" class="line-chart-line"></polyline>
      ${points
        .map(
          (point) =>
            `<circle cx="${point.x}" cy="${point.y}" r="4"><title>${escapeHtml(point.row.label)} - ${formatDuration(point.row.durationMs)}</title></circle>`,
        )
        .join("")}
    </svg>
    <div class="chart-caption">
      <span>${formatDuration(chartRows[0].durationMs)}</span>
      <span>${formatDuration(chartRows[chartRows.length - 1].durationMs)}</span>
    </div>
  `;
}

function renderColumnChart(selector, rows, emptyText) {
  const element = document.querySelector(selector);
  if (!element) return;

  if (!rows.length) {
    element.innerHTML = `<div class="empty-state visible">${emptyText}</div>`;
    return;
  }

  const chartRows = rows.slice(0, 6);
  const max = Math.max(...chartRows.map((row) => row.count), 1);
  element.innerHTML = chartRows
    .map((row) => {
      const percentage = Math.max(8, Math.round((row.count / max) * 100));
      return `
        <div class="column-chart-item">
          <div class="column-chart-bar" title="${escapeHtml(row.label)}: ${row.count}">
            <i style="height: ${percentage}%"></i>
          </div>
          <span title="${escapeHtml(row.label)}">${escapeHtml(row.label)}</span>
        </div>
      `;
    })
    .join("");
}

function renderHorizontalChart(selector, rows, emptyText) {
  const element = document.querySelector(selector);
  if (!element) return;

  if (!rows.length) {
    element.innerHTML = `<div class="empty-state visible">${emptyText}</div>`;
    return;
  }

  const chartRows = rows.slice(0, 5);
  const max = Math.max(...chartRows.map((row) => row.count), 1);
  element.innerHTML = chartRows
    .map((row) => {
      const percentage = Math.max(8, Math.round((row.count / max) * 100));
      return `
        <div class="horizontal-chart-row">
          <span title="${escapeHtml(row.label)}">${escapeHtml(row.label)}</span>
          <div class="horizontal-chart-track"><i style="width: ${percentage}%"></i></div>
          <strong>${row.count}</strong>
        </div>
      `;
    })
    .join("");
}

function renderStatsList(selector, rows, emptyText) {
  const element = document.querySelector(selector);
  element.innerHTML = "";

  if (!rows.length) {
    element.innerHTML = `<div class="empty-state visible">${emptyText}</div>`;
    return;
  }

  const max = Math.max(...rows.map((row) => row.count), 1);

  rows.slice(0, 8).forEach((row) => {
    const percentage = Math.max(6, Math.round((row.count / max) * 100));
    const item = document.createElement("div");
    item.className = "stats-row";
    item.innerHTML = `
      <div class="stats-row-main">
        <strong title="${escapeHtml(row.label)}">${escapeHtml(row.label)}</strong>
        <span>${row.count}</span>
      </div>
      <div class="stats-bar" aria-hidden="true"><i style="width: ${percentage}%"></i></div>
    `;
    element.append(item);
  });
}

function renderDurationList(selector, rows, emptyText) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.innerHTML = "";

  if (!rows.length) {
    element.innerHTML = `<div class="empty-state visible">${emptyText}</div>`;
    return;
  }

  const max = Math.max(...rows.map((row) => row.durationMs), 1);

  rows.slice(0, 8).forEach((row) => {
    const percentage = Math.max(6, Math.round((row.durationMs / max) * 100));
    const item = document.createElement("div");
    item.className = "stats-row";
    item.innerHTML = `
      <div class="stats-row-main">
        <strong title="${escapeHtml(row.label)}">${escapeHtml(row.label)}</strong>
        <span>${formatDuration(row.durationMs)}</span>
      </div>
      <div class="stats-bar" aria-hidden="true"><i style="width: ${percentage}%"></i></div>
    `;
    element.append(item);
  });
}

function getSessionDurationStats() {
  const groups = new Map();

  analyticsEvents.forEach((event) => {
    if (!event.sessionId || !event.createdAt) return;
    const timestamp = new Date(event.createdAt).getTime();
    if (!Number.isFinite(timestamp)) return;

    const current = groups.get(event.sessionId) || {
      id: event.sessionId,
      first: timestamp,
      last: timestamp,
      events: 0,
    };
    current.first = Math.min(current.first, timestamp);
    current.last = Math.max(current.last, timestamp);
    current.events += 1;
    groups.set(event.sessionId, current);
  });

  const now = Date.now();
  const rows = [...groups.values()]
    .map((group) => {
      const last = group.id === sessionId ? Math.max(group.last, now) : group.last;
      return {
        label: `Sessione ${String(group.id).slice(-6)}`,
        durationMs: Math.max(0, last - group.first),
        first: group.first,
        events: group.events,
      };
    })
    .filter((row) => row.durationMs > 0)
    .sort((a, b) => b.durationMs - a.durationMs || b.events - a.events);

  const averageMs = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.durationMs, 0) / rows.length)
    : 0;

  return { rows, averageMs };
}

function formatDuration(durationMs) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function getTopStats(events, key) {
  const counts = events.reduce((acc, event) => {
    const label = event[key] || "n/d";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function getElementLabel(element) {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.textContent ||
    element.value ||
    element.id ||
    element.href ||
    element.tagName
  );
}

function getSectionId(element) {
  return element.closest("section[id]")?.id || getCurrentSectionId();
}

function getCurrentSectionId() {
  return getCurrentPageId();
}

function exportAnalyticsCsv() {
  const headers = ["id", "creato_il", "sessione", "tipo", "etichetta", "sezione", "dettagli"];
  const rows = analyticsEvents.map((event) => [
    event.id,
    event.createdAt,
    event.sessionId,
    event.type,
    event.label,
    event.section,
    JSON.stringify(event.details || {}),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `analytics-cosenza-super-street-food-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Analytics esportati.");
}

function clearAnalyticsEvents() {
  const confirmed = window.confirm("Svuotare tutti gli eventi analytics salvati in questo browser?");
  if (!confirmed) return;

  analyticsEvents = [];
  saveAnalyticsEvents();
  trackedSections = new Set();
  sessionStorage.removeItem("cssf-tracked-sections");
  renderAnalyticsDashboard();
  showToast("Analytics svuotati.");
}

async function clearVotesRemote() {
  const confirmed = window.confirm("Svuotare tutti i voti registrati? Usa questa azione solo per cancellare test.");
  if (!confirmed) return;

  votes = [];
  voteLeaderboardRows = [];
  remoteVoteLeaderboardSynced = false;
  saveVotes();
  render();

  if (!supabaseClient || !staffSession) {
    showToast("Voti svuotati localmente. Per Supabase serve login staff.");
    return;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_VOTES_TABLE).delete().neq("id", "");
    if (error) {
      showToast(`Supabase non ha cancellato i voti: ${error.message || "policy non valida"}.`);
      return;
    }

    await refreshVotesFromRemote();
    showToast("Voti svuotati.");
  } catch {
    showToast("Supabase non raggiungibile: voti svuotati solo localmente.");
  }
}

function updateCountdown() {
  const now = new Date();
  const distance = eventStart.getTime() - now.getTime();
  const safeDistance = Math.max(0, distance);
  const totalSeconds = Math.floor(safeDistance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const totalWindow = eventStart.getTime() - countdownStart.getTime();
  const elapsed = now.getTime() - countdownStart.getTime();
  const progress = clampNumber((elapsed / totalWindow) * 100, 0, 100);

  setCountdownValue("#countdownDays", String(days));
  setCountdownValue("#countdownHours", String(hours).padStart(2, "0"));
  setCountdownValue("#countdownMinutes", String(minutes).padStart(2, "0"));
  setCountdownValue("#countdownSeconds", String(seconds).padStart(2, "0"));
  setCountdownProgress(progress);
}

function setCountdownProgress(progress) {
  const fill = document.querySelector("#countdownProgressFill");
  const burger = document.querySelector("#countdownBurger");
  const flag = document.querySelector("#countdownFlag");
  if (!fill || !burger) return;

  const value = `${progress.toFixed(3)}%`;
  const ratio = String(progress / 100);
  const progressWrap = fill.parentElement;
  const computedProgress = progressWrap ? window.getComputedStyle(progressWrap) : null;
  const trackLeft = Number.parseFloat(computedProgress?.getPropertyValue("--progress-track-left")) || 28;
  const trackRight = Number.parseFloat(computedProgress?.getPropertyValue("--progress-track-right")) || 76;
  const progressWidth = progressWrap?.clientWidth || 0;
  const trackWidth = Math.max(0, progressWidth - trackLeft - trackRight);
  const progressFillWidth = trackWidth * (progress / 100);
  const progressLeft = progressWidth ? trackLeft + progressFillWidth : 0;

  progressWrap?.style.setProperty("--burger-progress", value);
  progressWrap?.style.setProperty("--burger-progress-ratio", ratio);
  if (progressWrap && progressWidth) {
    progressWrap.style.setProperty("--burger-progress-width", `${progressFillWidth.toFixed(2)}px`);
    const left = `${progressLeft.toFixed(2)}px`;
    progressWrap.style.setProperty("--burger-firefly-left", left);
    burger.style.left = left;
  } else {
    burger.style.left = `clamp(28px, ${value}, calc(100% - 76px))`;
  }

  if (flag) {
    flag.style.opacity = "1";
  }
}

function setCountdownValue(selector, value) {
  const element = document.querySelector(selector);
  if (!element || element.textContent === value) return;

  element.textContent = value;
  element.classList.remove("rolling");
  void element.offsetWidth;
  element.classList.add("rolling");
}

function updateMetrics() {
  const metricBookings = document.querySelector("#metricBookings");
  const metricTrucks = document.querySelector("#metricTrucks");
  const metricVotes = document.querySelector("#metricVotes");

  if (!metricBookings && !metricTrucks && !metricVotes) {
    return;
  }

  const active = reservations.filter((item) => item.status !== "cancelled");

  if (metricBookings) metricBookings.textContent = String(active.length);
  if (metricTrucks) metricTrucks.textContent = String(trucks.length);
  if (metricVotes) metricVotes.textContent = String(getVoteTotal());
}

function getVoteTotal() {
  if (votes.length) return votes.length;
  return voteLeaderboardRows.reduce((sum, row) => sum + Number(row.count || 0), 0);
}

function renderSlots() {
  if (!slotsGrid) return;

  slotsGrid.innerHTML = "";

  eventDays.forEach((day) => {
    slots.forEach((slot) => {
      const used = getUsedSeats(day.value, slot);
      const percentage = Math.min(100, Math.round((used / capacityPerSlot) * 100));
      const free = Math.max(0, capacityPerSlot - used);
      const card = document.createElement("article");
      card.className = "slot-card";
      card.setAttribute("aria-label", `${day.label} ${slot}: ${free} posti disponibili su ${capacityPerSlot}`);
      if (percentage >= 90) card.classList.add("full");
      else if (percentage >= 70) card.classList.add("warning");

      card.innerHTML = `
        <header>
          <strong>${day.label}</strong>
          <span>${slot}</span>
        </header>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <div class="slot-numbers">
          <span>${used} prenotati</span>
          <span>${free} disponibili</span>
        </div>
        <span class="slot-capacity">${TABLE_COUNT} tavoli da ${SEATS_PER_TABLE} posti</span>
      `;
      slotsGrid.append(card);
    });
  });
}

function openSlotModal(day, slot) {
  if (!bookingSlotModal || !slotQuickForm || !slotGuestsInput) return;

  const available = getAvailableSeats(day, slot);
  const currentGuests = Number(bookingForm?.guests?.value) || 4;
  bookingSlotModal.dataset.day = day;
  bookingSlotModal.dataset.slot = slot;
  slotGuestsInput.value = clampNumber(currentGuests, 1, 30);

  if (slotModalTitle) {
    slotModalTitle.textContent = `${getDayLabel(day, true)} - ${slot}`;
  }

  if (slotModalMeta) {
    slotModalMeta.textContent = `${available} posti disponibili su ${capacityPerSlot}.`;
  }

  updateSlotModalAvailability();
  bookingSlotModal.hidden = false;
  document.body.classList.add("modal-open");
  slotGuestsInput.focus();
  slotGuestsInput.select();
}

function closeSlotModal() {
  if (!bookingSlotModal) return;

  bookingSlotModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function updateSlotModalAvailability() {
  if (!bookingSlotModal || !slotGuestsInput || !slotModalAvailability) return;

  const day = bookingSlotModal.dataset.day;
  const slot = bookingSlotModal.dataset.slot;
  const guests = clampNumber(Number(slotGuestsInput.value), 1, 30);
  const available = getAvailableSeats(day, slot);
  const tableCount = Math.ceil(guests / SEATS_PER_TABLE);
  const status = guests > available ? "andrà in lista attesa" : "prenotazione disponibile";
  const tableLabel = tableCount === 1 ? "tavolo" : "tavoli";
  slotModalAvailability.textContent = `${guests} posti, ${tableCount} ${tableLabel} da ${SEATS_PER_TABLE}: ${status}.`;
}

function handleSlotQuickSubmit(event) {
  event.preventDefault();
  if (!bookingForm || !bookingSlotModal || !slotGuestsInput) return;

  bookingForm.day.value = bookingSlotModal.dataset.day;
  bookingForm.slot.value = bookingSlotModal.dataset.slot;
  bookingForm.guests.value = clampNumber(Number(slotGuestsInput.value), 1, 30);
  updateAvailabilityReadout();
  closeSlotModal();
  bookingForm.scrollIntoView({ behavior: "smooth", block: "start" });
  bookingForm.elements.name?.focus();
}

function renderReservations() {
  if (!reservationsTable || !emptyState || !rowTemplate) return;

  const filtered = getFilteredReservations();
  reservationsTable.innerHTML = "";
  emptyState.classList.toggle("visible", filtered.length === 0);

  filtered.forEach((reservation) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    row.dataset.status = reservation.status;
    row.dataset.priority = getReservationPriority(reservation);
    const cells = row.querySelectorAll("td");
    const noteMarkup = reservation.notes
      ? `<span class="note-line">${escapeHtml(reservation.notes)}</span>`
      : "";

    cells[0].innerHTML = `
      <div class="customer-cell">
        <strong>${escapeHtml(reservation.name)}</strong>
        <span>${escapeHtml(reservation.phone || "-")}</span>
        ${reservation.email ? `<span>${escapeHtml(reservation.email)}</span>` : ""}
        ${reservation.arrival ? `<span>${escapeHtml(reservation.arrival)}</span>` : ""}
        ${noteMarkup}
      </div>
    `;
    cells[1].textContent = getDayLabel(reservation.day, true);
    cells[2].textContent = reservation.slot;
    cells[3].textContent = String(reservation.guests);
    cells[4].textContent = reservation.tables;
    cells[5].append(createStatusSelect(reservation));
    cells[6].append(createActions(reservation));

    reservationsTable.append(row);
  });
}

function renderReviews() {
  if (!reviewsList || !emptyReviews || !reviewAverage || !reviewCount) return;

  reviewsList.innerHTML = "";
  emptyReviews.classList.toggle("visible", reviews.length === 0);
  reviewAverage.textContent = reviews.length ? getAverageRating().toFixed(1) : "--";
  reviewCount.textContent = `${reviews.length} ${reviews.length === 1 ? "recensione" : "recensioni"}`;

  reviews.forEach((review) => {
    const stars = Array.from({ length: review.rating }, () => "&#9733;").join("");
    const card = document.createElement("article");
    card.className = "review-card";
    card.innerHTML = `
      <header>
        <div>
          <strong>${escapeHtml(review.title)}</strong>
          <div class="review-meta">${escapeHtml(review.reviewer)} - ${formatDate(review.createdAt)}</div>
        </div>
        <span aria-label="${review.rating} stelle">${stars}</span>
      </header>
      <p>${escapeHtml(review.body)}</p>
    `;
    reviewsList.append(card);
  });
}

function createStatusSelect(reservation) {
  const select = document.createElement("select");
  select.className = "status-select";
  select.dataset.status = reservation.status;
  Object.entries(statusLabels).forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = reservation.status === value;
    select.append(option);
  });

  select.addEventListener("change", async () => {
    reservation.status = select.value;
    select.dataset.status = select.value;
    saveReservations();
    render();
    const remoteSaved = await updateReservationStatusRemote(reservation);
    if (!remoteSaved) {
      showToast("Stato aggiornato localmente: backend non disponibile.");
    }
  });

  return select;
}

function getReservationPriority(reservation) {
  if (reservation.status === "waiting") return "high";
  if (reservation.status === "pending") return "medium";
  if (reservation.status === "confirmed") return "low";
  return "muted";
}

function handleSharedStorageUpdate(event) {
  if (!event.key) return;

  const watchedKeys = new Set([
    STORAGE_KEY,
    LEGACY_STORAGE_KEY,
    REVIEW_STORAGE_KEY,
    TRUCK_STORAGE_KEY,
    VOTE_STORAGE_KEY,
    ANALYTICS_STORAGE_KEY,
    ANALYTICS_CONSENT_KEY,
    CAPACITY_KEY,
  ]);

  if (!watchedKeys.has(event.key)) return;

  reservations = loadReservations();
  reviews = loadReviews();
  trucks = loadTrucks();
  votes = loadVotes();
  analyticsEvents = loadAnalyticsEvents();
  capacityPerSlot = Number(localStorage.getItem(CAPACITY_KEY)) || DEFAULT_CAPACITY_PER_SLOT;

  if (capacityInput) {
    capacityInput.value = capacityPerSlot;
  }

  render();
  renderReviews();
  renderLeaderboardTabs();
  renderAdminAccess();
}

function createActions(reservation) {
  const wrapper = document.createElement("div");
  wrapper.className = "row-actions";

  const whatsapp = document.createElement("a");
  whatsapp.className = "small-button";
  whatsapp.href = createWhatsAppUrl(reservation);
  whatsapp.target = "_blank";
  whatsapp.rel = "noreferrer";
  whatsapp.textContent = "WhatsApp";

  const copy = document.createElement("button");
  copy.type = "button";
  copy.className = "small-button";
  copy.textContent = "Copia";
  copy.addEventListener("click", () => copyReservation(reservation));

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "small-button danger";
  remove.textContent = "Elimina";
  remove.addEventListener("click", async () => {
    reservations = reservations.filter((item) => item.id !== reservation.id);
    saveReservations();
    render();
    const remoteDeleted = await deleteReservationRemote(reservation.id);
    showToast(remoteDeleted ? "Prenotazione eliminata." : "Prenotazione eliminata localmente.");
  });

  wrapper.append(whatsapp, copy, remove);
  return wrapper;
}

function getFilteredReservations() {
  if (!searchInput || !dayFilter || !statusFilter) {
    return reservations;
  }

  const query = searchInput.value.trim().toLowerCase();
  return reservations.filter((reservation) => {
    const matchesQuery = [
      reservation.name,
      reservation.phone,
      reservation.email,
      reservation.notes,
      reservation.area,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
    const matchesDay = dayFilter.value === "all" || reservation.day === dayFilter.value;
    const matchesStatus = statusFilter.value === "all" || reservation.status === statusFilter.value;
    return matchesQuery && matchesDay && matchesStatus;
  });
}

function updateAvailabilityReadout() {
  if (!bookingForm || !availabilityReadout) return;

  const day = bookingForm.day.value;
  const slot = bookingForm.slot.value;
  const guests = Number(bookingForm.guests.value) || 0;
  const available = getAvailableSeats(day, slot);
  const status = guests > available ? "lista attesa" : "richiesta disponibile";
  availabilityReadout.textContent = `Posti disponibili: ${available} - ${status}`;
}

function getUsedSeats(day, slot) {
  return reservations
    .filter((item) => item.day === day && item.slot === slot && activeStatuses.has(item.status))
    .reduce((sum, item) => sum + Number(item.guests), 0);
}

function getAvailableSeats(day, slot) {
  return Math.max(0, capacityPerSlot - getUsedSeats(day, slot));
}

function suggestTables(guests) {
  const tableCount = Math.ceil(guests / SEATS_PER_TABLE);
  const label = tableCount === 1 ? "tavolo" : "tavoli";
  return `${tableCount} ${label} da ${SEATS_PER_TABLE}`;
}

function exportCsv() {
  const headers = [
    "codice",
    "creata_il",
    "nome",
    "telefono",
    "email",
    "giorno",
    "turno",
    "persone",
    "area",
    "arrivo",
    "tavoli",
    "stato",
    "note",
  ];
  const rows = reservations.map((item) => [
    item.id,
    item.createdAt,
    item.name,
    item.phone,
    item.email,
    getDayLabel(item.day, true),
    item.slot,
    item.guests,
    item.area,
    item.arrival,
    item.tables,
    statusLabels[item.status],
    item.notes,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `prenotazioni-cosenza-super-street-food-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("CSV esportato.");
}

async function copyReport() {
  const report = [
    "Cosenza Super Street Food - riepilogo prenotazioni",
    `Aggiornato: ${new Date().toLocaleString("it-IT")}`,
    `Capienza per turno: ${capacityPerSlot} posti (${TABLE_COUNT} tavoli da ${SEATS_PER_TABLE})`,
    "",
    ...eventDays.flatMap((day) =>
      slots.map((slot) => {
        const used = getUsedSeats(day.value, slot);
        return `${day.label} ${slot}: ${used}/${capacityPerSlot} posti`;
      }),
    ),
    "",
    `Totale richieste: ${reservations.length}`,
    `Food truck: ${trucks.length}`,
    `Voti raccolti: ${votes.length}`,
    `Recensioni raccolte: ${reviews.length}`,
    `Eventi analytics locali: ${analyticsEvents.length}`,
  ].join("\n");

  await copyText(report);
  showToast("Riepilogo copiato.");
}

async function copyReservation(reservation) {
  await copyText(formatReservationMessage(reservation));
  showToast(`Prenotazione ${reservation.id} copiata.`);
}

function formatReservationMessage(reservation) {
  return [
    `Cosenza Super Street Food - prenotazione ${reservation.id}`,
    reservation.name,
    `${getDayLabel(reservation.day, true)} alle ${reservation.slot}`,
    `${reservation.guests} persone - ${reservation.tables}`,
    `Area: ${reservation.area || "Indifferente"}`,
    `Arrivo: ${reservation.arrival || "Non indicato"}`,
    `Stato: ${statusLabels[reservation.status]}`,
  ].join("\n");
}

function createWhatsAppUrl(reservation) {
  const phone = normalizePhone(reservation.phone);
  const message =
    `Ciao ${reservation.name}, abbiamo ricevuto la tua richiesta tavolo per Cosenza Super Street Food ` +
    `(${getDayLabel(reservation.day, true)} ore ${reservation.slot}, ${reservation.guests} persone). ` +
    `Stato: ${statusLabels[reservation.status]}. Codice ${reservation.id}.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function setupInstallPrompt() {
  if (!installButton) return;

  updateInstallUi();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    updateInstallUi();
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    updateInstallUi();
    showToast("App installata.");
  });

  const displayModeMedia = window.matchMedia?.("(display-mode: standalone)");
  if (displayModeMedia?.addEventListener) {
    displayModeMedia.addEventListener("change", updateInstallUi);
  } else if (displayModeMedia?.addListener) {
    displayModeMedia.addListener(updateInstallUi);
  }
}

async function handleInstallClick() {
  if (isStandaloneMode()) {
    showToast("App gia installata su questo dispositivo.");
    return;
  }

  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    updateInstallUi();
    return;
  }

  if (!isInstallSecureContext()) {
    showToast("Per installarla apri il sito da HTTPS o localhost.");
    return;
  }

  if (isIosDevice()) {
    showToast(
      isSafariBrowser()
        ? "Su iPhone usa Condividi e poi Aggiungi a Home."
        : "Apri il sito in Safari, poi usa Condividi e Aggiungi a Home.",
    );
    return;
  }

  showToast("Apri il menu del browser e scegli Installa app.");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !isInstallSecureContext()) {
    updateInstallUi();
    return;
  }

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (serviceWorkerReloading) return;
    const activeVersion = sessionStorage.getItem(SERVICE_WORKER_ACTIVE_VERSION_KEY);
    sessionStorage.setItem(SERVICE_WORKER_ACTIVE_VERSION_KEY, SERVICE_WORKER_VERSION);
    if (activeVersion === SERVICE_WORKER_VERSION) return;
    serviceWorkerReloading = true;
    window.location.reload();
  });

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(SERVICE_WORKER_URL);
      registration.update().catch(() => {});
      updateInstallUi();
    } catch {
      setInstallHint("Offline non attivo in questa modalita.");
      showToast("Offline non attivo in questa modalita.");
    }
  });
}

function updateInstallUi() {
  if (!installButton) return;

  if (isStandaloneMode()) {
    installButton.hidden = true;
    setInstallHint("App gia installata: aprila dalla schermata Home o dal desktop.");
    return;
  }

  if (!isInstallSecureContext()) {
    installButton.hidden = false;
    installButton.textContent = "Come installare";
    setInstallHint("Per installarla usa il sito da HTTPS o localhost.");
    return;
  }

  if (isIosDevice()) {
    installButton.hidden = false;
    installButton.textContent = isSafariBrowser() ? "Aggiungi a Home" : "Apri in Safari";
    setInstallHint(
      isSafariBrowser()
        ? "Su iPhone e iPad apri Condividi e scegli Aggiungi a Home."
        : "Su iPhone e iPad apri il sito in Safari per installarlo.",
    );
    return;
  }

  if (deferredInstallPrompt) {
    installButton.hidden = false;
    installButton.textContent = "Installa app";
    setInstallHint("Su PC e Android puoi installarla come app con un tap.");
    return;
  }

  installButton.hidden = true;
  setInstallHint("Su Chrome ed Edge il pulsante compare quando il browser rileva l'app come pronta.");
}

function setInstallHint(message) {
  if (installHint) {
    installHint.textContent = message;
  }
}

function isInstallSecureContext() {
  return (
    window.isSecureContext ||
    window.location.protocol === "https:" ||
    ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
  );
}

function isStandaloneMode() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

function isIosDevice() {
  return /iPad|iPhone|iPod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
}

function isSafariBrowser() {
  const agent = window.navigator.userAgent;
  return /Safari/i.test(agent) && !/Chrome|CriOS|EdgiOS|FxiOS|OPiOS|Android/i.test(agent);
}

function loadReservations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || "[]";
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReservations() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

async function saveReservationRemote(reservation) {
  lastReservationRemoteError = "";

  if (!supabaseClient) {
    lastReservationRemoteError = "Client Supabase non caricato.";
    return false;
  }

  try {
    const { error } = await withTimeout(
      supabaseClient.from(SUPABASE_RESERVATIONS_TABLE).insert(mapReservationToRemote(reservation)),
      8000,
    );
    if (error) {
      lastReservationRemoteError = error.message || "Inserimento Supabase rifiutato.";
      console.warn("CSSF Supabase reservation insert failed:", error);
      return false;
    }

    return !error;
  } catch (error) {
    lastReservationRemoteError = error?.message || "Supabase non raggiungibile.";
    console.warn("CSSF Supabase reservation insert failed:", error);
    return false;
  }
}

async function updateReservationStatusRemote(reservation) {
  if (!supabaseClient) return false;

  try {
    const { error } = await supabaseClient
      .from(SUPABASE_RESERVATIONS_TABLE)
      .update({ status: reservation.status, updated_at: new Date().toISOString() })
      .eq("id", reservation.id);
    return !error;
  } catch {
    return false;
  }
}

async function deleteReservationRemote(id) {
  if (!supabaseClient) return false;

  try {
    const { error } = await supabaseClient.from(SUPABASE_RESERVATIONS_TABLE).delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

function mapReservationToRemote(reservation) {
  return {
    id: reservation.id,
    created_at: reservation.createdAt,
    updated_at: new Date().toISOString(),
    name: reservation.name,
    phone: reservation.phone,
    email: reservation.email,
    day: reservation.day,
    slot: reservation.slot,
    guests: reservation.guests,
    area: reservation.area,
    arrival: reservation.arrival,
    notes: reservation.notes,
    status: reservation.status,
    tables: reservation.tables,
  };
}

function mapReservationFromRemote(row) {
  return {
    id: row.id,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    name: row.name || "",
    phone: row.phone || "",
    email: row.email || "",
    day: row.day || eventDays[0].value,
    slot: row.slot || slots[0],
    guests: Number(row.guests) || 1,
    area: row.area || "",
    arrival: row.arrival || "",
    notes: row.notes || "",
    status: row.status || "pending",
    tables: row.tables || suggestTables(Number(row.guests) || 1),
  };
}

function loadReviews() {
  try {
    const parsed = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReviews() {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
}

function loadTrucks() {
  try {
    const stored = localStorage.getItem(TRUCK_STORAGE_KEY);
    if (!stored) return cloneDefaultTrucks();
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? mergeWithDefaultTrucks(parsed) : cloneDefaultTrucks();
  } catch {
    return cloneDefaultTrucks();
  }
}

function saveTrucks() {
  localStorage.setItem(TRUCK_STORAGE_KEY, JSON.stringify(trucks));
}

async function saveTruckRemote(truck) {
  lastTruckRemoteError = "";

  if (!supabaseClient) {
    lastTruckRemoteError = "Client Supabase non caricato";
    return false;
  }

  try {
    const { error } = await supabaseClient
      .from(SUPABASE_TRUCKS_TABLE)
      .upsert(mapTruckToRemote(truck), { onConflict: "id" });

    if (error) {
      lastTruckRemoteError = error.message || "Salvataggio Supabase rifiutato";
      console.warn("CSSF Supabase truck upsert failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    lastTruckRemoteError = error?.message || "Supabase non raggiungibile";
    console.warn("CSSF Supabase truck upsert failed:", error);
    return false;
  }
}

async function deleteTruckRemote(id) {
  lastTruckRemoteError = "";

  if (!supabaseClient) {
    lastTruckRemoteError = "Client Supabase non caricato";
    return false;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_TRUCKS_TABLE).delete().eq("id", id);
    if (error) {
      lastTruckRemoteError = error.message || "Eliminazione Supabase rifiutata";
      console.warn("CSSF Supabase truck delete failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    lastTruckRemoteError = error?.message || "Supabase non raggiungibile";
    console.warn("CSSF Supabase truck delete failed:", error);
    return false;
  }
}

function mapTruckToRemote(truck) {
  return {
    id: truck.id,
    code: truck.code,
    name: truck.name,
    category: truck.category,
    zone: truck.zone,
    menu: truck.menu,
    color: truck.color || "#e84b2a",
    status: truck.status || "open",
    x: Number(truck.x) || 24,
    y: Number(truck.y) || 36,
    map_positions: Array.isArray(truck.mapPositions) ? truck.mapPositions : null,
  };
}

function mapTruckFromRemote(row) {
  const fallback = defaultTrucks.find((truck) => truck.id === row.id) || {};
  const mapPositions = Array.isArray(row.map_positions) && row.map_positions.length
    ? row.map_positions
    : fallback.mapPositions;

  return {
    ...fallback,
    id: row.id,
    code: row.code || fallback.code || "",
    name: row.name || fallback.name || "",
    category: row.category || fallback.category || "tradizione",
    zone: row.zone || fallback.zone || "",
    menu: row.menu || fallback.menu || "",
    color: row.color || fallback.color || "#e84b2a",
    status: row.status || fallback.status || "open",
    x: Number(row.x ?? fallback.x ?? 24),
    y: Number(row.y ?? fallback.y ?? 36),
    mapPositions,
  };
}

function loadVotes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(VOTE_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveVotes() {
  localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(votes));
}

async function saveVoteRemote(vote) {
  lastVoteRemoteError = "";

  if (!supabaseClient) {
    lastVoteRemoteError = "Client Supabase non caricato";
    return false;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_VOTES_TABLE).insert(mapVoteToRemote(vote));
    if (error) {
      lastVoteRemoteError = error.message || "Inserimento Supabase rifiutato";
      console.warn("CSSF Supabase vote insert failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    lastVoteRemoteError = error?.message || "Supabase non raggiungibile";
    console.warn("CSSF Supabase vote insert failed:", error);
    return false;
  }
}

function mapVoteToRemote(vote) {
  return {
    id: vote.id,
    created_at: vote.createdAt,
    category: vote.category,
    truck_id: vote.truckId,
    voter_name: vote.voter,
  };
}

function mapVoteFromRemote(row) {
  return {
    id: row.id,
    createdAt: row.created_at || new Date().toISOString(),
    category: row.category || voteCategories[0].value,
    truckId: row.truck_id || row.truckId || "",
    voter: row.voter_name || row.voter || "",
  };
}

function mapVoteLeaderboardFromRemote(row) {
  return {
    category: row.category || voteCategories[0].value,
    truckId: row.truck_id || row.truckId || "",
    count: Number(row.vote_count || row.count) || 0,
  };
}

function loadAnalyticsEvents() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAnalyticsEvents() {
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analyticsEvents));
}

function getAverageRating() {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length;
}

function cloneDefaultTrucks() {
  return JSON.parse(JSON.stringify(defaultTrucks));
}

function mergeWithDefaultTrucks(storedTrucks) {
  const storedById = new Map(storedTrucks.map((truck) => [truck.id, truck]));
  const officialIds = new Set(defaultTrucks.map((truck) => truck.id));
  const officialTrucks = defaultTrucks.map((truck) => {
    const { tags, ...storedTruck } = storedById.get(truck.id) || {};
    return {
      ...truck,
      ...storedTruck,
      color: truck.color,
      mapPositions: truck.mapPositions,
      x: truck.x,
      y: truck.y,
      status: "open",
    };
  });
  const customTrucks = storedTrucks
    .filter((truck) => !officialIds.has(truck.id))
    .map(({ tags, ...truck }) => ({ ...truck, status: "open" }));
  return [...officialTrucks, ...customTrucks];
}

function createReservationId() {
  return createId("CSSF");
}

function createId(prefix) {
  const number = String(Date.now()).slice(-6);
  const suffix = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}-${number}-${suffix}`;
}

function createTruckCode() {
  const used = new Set(trucks.map((truck) => truck.code));
  let index = trucks.length + 1;
  let code = `S${String(index).padStart(2, "0")}`;

  while (used.has(code)) {
    index += 1;
    code = `S${String(index).padStart(2, "0")}`;
  }

  return code;
}

function getDayLabel(value, long = false) {
  const day = eventDays.find((item) => item.value === value);
  return day ? (long ? day.longLabel : day.label) : value;
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("39")) return digits;
  return digits ? `39${digits}` : "";
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function toCsvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getVoteCategoryLabel(value) {
  return voteCategories.find((category) => category.value === value)?.label || value;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  window.setTimeout(() => {
    toast.classList.remove("visible");
    window.setTimeout(() => toast.remove(), 220);
  }, 2800);
}




































