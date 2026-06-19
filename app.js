const STORAGE_KEY = "cssf-reservations-v2";
const LEGACY_STORAGE_KEY = "cssf-reservations-v1";
const REVIEW_STORAGE_KEY = "cssf-reviews-v1";
const TRUCK_STORAGE_KEY = "cssf-trucks-v3";
const VOTE_STORAGE_KEY = "cssf-votes-v1";
const ANALYTICS_STORAGE_KEY = "cssf-analytics-v1";
const ANALYTICS_CONSENT_KEY = "cssf-analytics-consent-v1";
const PRIVACY_BANNER_SEEN_KEY = "cssf-privacy-banner-seen-v1";
const TABLE_COUNT = 15;
const SEATS_PER_TABLE = 8;
const DEFAULT_CAPACITY_PER_SLOT = TABLE_COUNT * SEATS_PER_TABLE;
const MAX_ANALYTICS_EVENTS = 2500;
const ADMIN_MOMENTS_PAGE_SIZE = 24;
const MAX_STAFF_RESERVATIONS = 150;
const REVIEW_FEED_BATCH_SIZE = 3;
const ACTIVE_PWA_CACHE_NAME = "cssf-pwa-v173";
const SERVICE_WORKER_VERSION = "20260618-staff-push-v173";
const PUSH_PUBLIC_KEY_ENDPOINT = "/api/push/public-key";
const PUSH_SUBSCRIBE_ENDPOINT = "/api/push/subscribe";
const PUSH_BROADCAST_ENDPOINT = "/api/push/broadcast";
const STAFF_PUSH_SCOPE = "staff";
const PUBLIC_PUSH_SCOPE = "public";
const STAFF_PUSH_STATUS_KEY = "cssf-push-staff-enabled";
const PUBLIC_PUSH_STATUS_KEY = "cssf-push-public-enabled";
const SUPABASE_URL = "https://rwbszwbsxdidhjaxozhn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3YnN6d2JzeGRpZGhqYXhvemhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MzcxNTYsImV4cCI6MjA5NjIxMzE1Nn0.a2lI6u4R15pHwJfABjzF0i30ZKXahavNujaC3BThKR8";
const SUPABASE_RESERVATIONS_TABLE = "reservations";
const SUPABASE_TRUCKS_TABLE = "trucks";
const SUPABASE_VOTES_TABLE = "votes";
const SUPABASE_REVIEWS_TABLE = "reviews";
const SUPABASE_ANALYTICS_TABLE = "analytics_events";
const SUPABASE_MOMENTS_TABLE = "moments";
const SUPABASE_MOMENTS_BUCKET = "cssf-moments";
const SUPABASE_VOTE_LEADERBOARD_VIEW = "vote_leaderboard";
const SUPABASE_RESERVATION_SLOT_USAGE_VIEW = "reservation_slot_usage";
const MAX_MOMENT_FILE_SIZE = 2 * 1024 * 1024;

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
    name: "Afterlife Cocktail",
    category: "cocktail",
    zone: "Area drink",
    menu: "Cocktail Zone - dove potrai gustare tutti i grandi classici della mixology preparati al momento, CAFFE' AIELLO",
    color: "#38bdf8",
    mapPositions: [{ x: 65.6, y: 12.9 }],
    status: "open",
    x: 65.6,
    y: 12.9,
  },
  {
    id: "stand-armonia-gusti",
    code: "S02",
    name: "Armonia dei gusti",
    category: "dolci",
    zone: "Passeggiata dolce",
    menu: "Frutta realistica, Gelati artigianali, Monoporzioni, Granite, Pancakes, Crepes",
    color: "#ec4899",
    mapPositions: [{ x: 44.5, y: 52.8 }],
    status: "open",
    x: 44.5,
    y: 52.8,
  },
  {
    id: "stand-birra-cala",
    code: "S03",
    name: "Birra Cala",
    category: "birra",
    zone: "Area drink",
    menu: "Birra artigianale - Birrificio ufficiale del CSSF26",
    color: "#f59e0b",
    mapPositions: [
      { x: 75.8, y: 13.4 },
      { x: 29.7, y: 78.2 },
    ],
    status: "open",
    x: 75.8,
    y: 13.4,
  },
  {
    id: "stand-caracas-bistro-25",
    code: "S04",
    name: "Caracas",
    category: "sudamericano",
    zone: "Area world food",
    menu: "Arepas, Burritos, Tequenos, Churros, Tutto #GlutenFree",
    color: "#facc15",
    mapPositions: [{ x: 18.4, y: 74.4 }],
    status: "open",
    x: 18.4,
    y: 74.4,
  },
  {
    id: "stand-che-gnocchi",
    code: "S05",
    name: "Bar Centrale",
    category: "tradizione",
    zone: "Via centrale",
    menu: "Cullurialli - Cuddruriaddri, Gnocco fritto con salumi e formaggi",
    color: "#3b82f6",
    mapPositions: [{ x: 18.2, y: 17.8 }],
    status: "open",
    x: 18.2,
    y: 17.8,
  },
  {
    id: "stand-chimi",
    code: "S06",
    name: "CHIMI",
    category: "carne",
    zone: "Area brace",
    menu: "Piatto Carne Argentina ASADO, Panini con Hamburger di carne argentina",
    color: "#facc15",
    mapPositions: [{ x: 88.7, y: 77.2 }],
    status: "open",
    x: 88.7,
    y: 77.2,
  },
  {
    id: "stand-gamro",
    code: "S07",
    name: "GamRo",
    category: "pesce",
    zone: "Area mare",
    menu: "Frittura cuoppo di calamari - #GlutenFree., Panino polpami (polipo), Panino squiddi (calamari), Panino Crusco (baccala)",
    color: "#9333ea",
    mapPositions: [{ x: 28.8, y: 15.8 }],
    status: "open",
    x: 28.8,
    y: 15.8,
  },
  {
    id: "stand-la-forneria",
    code: "S08",
    name: "La Forneria",
    category: "forno",
    zone: "Via centrale",
    menu: "Focaccia (Mortadella, Stracchino e pistacchio), Focaccia (Porchetta e crema ai 4 formaggi), Focaccia (Crudo e crema di noci), Arancini (Classici al ragu/ Bianco zafferano e mozzarella), Cuoppo Polpette (Melanzane e carne), Sua maesta \"A Grupariata\"",
    color: "#2563eb",
    mapPositions: [{ x: 84.2, y: 14.8 }],
    status: "open",
    x: 84.2,
    y: 14.8,
  },
  {
    id: "stand-la-verace",
    code: "S09",
    name: "La Verace",
    category: "fritti",
    zone: "Area novita",
    menu: "Cuzzitiello, Corn Dog, patatine fritte",
    color: "#2563eb",
    mapPositions: [{ x: 40.8, y: 75.8 }],
    status: "open",
    x: 40.8,
    y: 75.8,
  },
  {
    id: "stand-panzerotto-on-the-road",
    code: "S10",
    name: "Panzerotto on the road",
    category: "fritti",
    zone: "Via centrale",
    menu: "Panzerotti Caldi (Classico o Silano), Panzerotti Freddi (Primavera o Bolognese), Burrate fritte (Burrata Crudo o Burrata Mortadella)",
    color: "#2563eb",
    mapPositions: [{ x: 6.3, y: 20.7 }],
    status: "open",
    x: 6.3,
    y: 20.7,
  },
  {
    id: "stand-sams-food-truck",
    code: "S11",
    name: "Sam's Food Truck",
    category: "bbq",
    zone: "Area BBQ",
    menu: "Panino con Pulled Pork, Panino con Brisket",
    color: "#facc15",
    mapPositions: [{ x: 60.5, y: 74.9 }],
    status: "open",
    x: 60.5,
    y: 74.9,
  },
  {
    id: "stand-the-butchers",
    code: "S12",
    name: "The butchers",
    category: "carne",
    zone: "Area brace",
    menu: "Cipollotto (panino con hamburgher di scottona), Salsicciotto (panino con hamburgher di salsiccia), Porchetto ( panino con porchetta), Cuoppo The Butchers (misto carne), Cuoppo Ribs - {ESCLUSIVA CSSF26}, Cuoppo Alette di Pollo #LimitedEdition",
    color: "#facc15",
    mapPositions: [{ x: 44.5, y: 15.4 }],
    status: "open",
    x: 44.5,
    y: 15.4,
  },
  {
    id: "stand-trattoria-da-ciardullo",
    code: "S13",
    name: "Trattoria da Ciardullo",
    category: "tradizione",
    zone: "Area tradizione",
    menu: "Tagliatelle ai funghi Porcini, Maccarruni della nonna (costine carne e polpette al sugo), Scialatelli alla Silana (salsiccia, porcini, pomodorini e ricotta affumicata), Patate mbacchiuse con cipolla, Patate mbacchiuse con funghi porcini, Patate mbacchiuse con peperoni",
    color: "#facc15",
    mapPositions: [{ x: 54.8, y: 11.7 }],
    status: "open",
    x: 54.8,
    y: 11.7,
  },
  {
    id: "stand-willy-crak",
    code: "S14",
    name: "Willy Crak",
    category: "brace",
    zone: "Area brace",
    menu: "Arrosticini di pecora, Cacio cavallo impiccato, Patata Conzata (Pulled di pecora, crema di parmigiano e cipolla caramellata), Patate fritte e Pulled di pecora, Panino con pulled di pecora (verdure - cacio - cipolla e salsa sweet chilli)",
    color: "#facc15",
    mapPositions: [{ x: 6.1, y: 72.8 }],
    status: "open",
    x: 6.1,
    y: 72.8,
  },
  {
    id: "stand-zia-ne",
    code: "S15",
    name: "ZIA NE'",
    category: "pizza",
    zone: "Area pizza",
    menu: "Pizza a portafoglio (Margherita), Pizza Portafoglio Fredda (Pomodoro - Mozzarella e Pesto), Pizza Fritta (Margherita)",
    color: "#2563eb",
    mapPositions: [{ x: 74.2, y: 76.2 }],
    status: "open",
    x: 74.2,
    y: 76.2,
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

const truckLegendAccentColors = {
  carne: "#e2b11f",
  pesce: "#9a4ab7",
  dolci: "#d83f8d",
  frittiForno: "#2f57b8",
  birra: "#e68a1f",
  cocktail: "#1ca4d8",
};

const truckStatusLabels = {
  open: "Aperto",
};

const voteCategories = [
  { value: "sanizzo-award", label: "Street Chef piu' SANIZZO" },
  { value: "tradition-award", label: "Street Chef piu' TRADIZIONALE" },
  { value: "creative-award", label: "Street Chef piu' CREATIVO" },
];

const voteCategoryLabels = {
  "sanizzo-award": "Street Chef piu' SANIZZO",
  "tradition-award": "Street Chef piu' TRADIZIONALE",
  "creative-award": "Street Chef piu' CREATIVO",
};

const reviewLabels = {
  ageRange: {
    "under-18": "Meno di 18",
    "18-24": "18-24",
    "25-34": "25-34",
    "35-44": "35-44",
    "45-54": "45-54",
    "55-plus": "55+",
  },
  gender: {
    female: "Donna",
    male: "Uomo",
    "prefer-not": "Non specificato",
  },
  originArea: {
    luzzi: "Luzzi",
    "nearby-towns": "Paesi limitrofi",
    rende: "Rende",
    cosenza: "Cosenza",
    "over-25km": "+ di 25 km",
    "over-50km": "+ di 50 km",
  },
  favoriteAspect: {
    food: "Qualita' del cibo",
    "stand-variety": "Varieta' stand",
    atmosphere: "Atmosfera",
    music: "Musica",
    organization: "Organizzazione",
    location: "Location",
  },
  improvementArea: {
    queues: "Code",
    seating: "Posti a sedere",
    prices: "Prezzi",
    signage: "Segnaletica",
    payment: "Pagamenti",
    cleanliness: "Pulizia",
    "more-stands": "Piu' stand",
    nothing: "Nulla in particolare",
  },
  wouldReturn: {
    yes: "Si",
    maybe: "Forse",
    no: "No",
  },
};

const contestDistanceLabels = {
  luzzi: "Luzzi",
  "nearby-towns": "Paesi limitrofi",
  rende: "Rende",
  cosenza: "Cosenza",
  "over-25km": "+ di 25 km",
  "over-50km": "+ di 50 km",
  "province-cosenza": "Provincia di Cosenza",
  calabria: "Resto della Calabria",
  "outside-calabria": "Fuori Calabria",
};

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
const bookingSearchToggle = document.querySelector("#bookingSearchToggle");
const bookingSearchPanel = document.querySelector("#bookingSearchPanel");
const dayFilter = document.querySelector("#dayFilter");
const statusFilter = document.querySelector("#statusFilter");
const bookingQuickViews = document.querySelector("#bookingQuickViews");
const bookingPendingCount = document.querySelector("#bookingPendingCount");
const bookingTodayCount = document.querySelector("#bookingTodayCount");
const bookingAllCount = document.querySelector("#bookingAllCount");
const bookingTodayLabel = document.querySelector("#bookingTodayLabel");
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
const reviewsInsights = document.querySelector("#reviewsInsights");
const adminReviewAverage = document.querySelector("#adminReviewAverage");
const adminReviewCount = document.querySelector("#adminReviewCount");
const adminReviewsInsights = document.querySelector("#adminReviewsInsights");
const adminReviewsList = document.querySelector("#adminReviewsList");
const adminEmptyReviews = document.querySelector("#adminEmptyReviews");
const clearReviewsButton = document.querySelector("#clearReviewsButton");
const momentsForm = document.querySelector("#momentsForm");
const momentImageInput = document.querySelector("#momentImage");
const momentPreview = document.querySelector("#momentPreview");
const momentsFormStatus = document.querySelector("#momentsFormStatus");
const adminMomentsGrid = document.querySelector("#adminMomentsGrid");
const adminEmptyMoments = document.querySelector("#adminEmptyMoments");
const metricMoments = document.querySelector("#metricMoments");
const momentsLoadMoreWrap = document.querySelector("#momentsLoadMoreWrap");
const loadMoreMomentsButton = document.querySelector("#loadMoreMomentsButton");
const downloadAllMomentsButton = document.querySelector("#downloadAllMomentsButton");
const installButton = document.querySelector("#installButton");
const installHint = document.querySelector("#installHint");
const mobileMenuToggle = document.querySelector("#mobileMenuToggle");
const primaryNav = document.querySelector("#primaryNav");
const publicTopbar = document.querySelector(".topbar");
const tasteText = document.querySelector("#tasteText");
const tasteList = document.querySelector("#tasteList");
const truckSearchInput = document.querySelector("#truckSearchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const festivalMap = document.querySelector("#festivalMap");
const mapImageModal = document.querySelector("#mapImageModal");
const mapImageBackdrop = document.querySelector("#mapImageBackdrop");
const mapImageClose = document.querySelector("#mapImageClose");
const selectedTruckCard = document.querySelector("#selectedTruckCard");
const truckGrid = document.querySelector("#truckGrid");
const emptyTrucks = document.querySelector("#emptyTrucks");
const voteForm = document.querySelector("#voteForm");
const voteTruck = document.querySelector("#voteTruck");
const voteExtraFields = document.querySelector("#voteExtraFields");
const leaderboardTabs = document.querySelector("#leaderboardTabs");
const leaderboardList = document.querySelector("#leaderboardList");
const staffVoteTabs = document.querySelector("#staffVoteTabs");
const staffVoteLeaderboard = document.querySelector("#staffVoteLeaderboard");
const staffVoteDetailTitle = document.querySelector("#staffVoteDetailTitle");
const staffVoteDetailLabel = document.querySelector("#staffVoteDetailLabel");
const staffVoteDetailList = document.querySelector("#staffVoteDetailList");
const staffVoteMoreWrap = document.querySelector("#staffVoteMoreWrap");
const staffVoteMoreButton = document.querySelector("#staffVoteMoreButton");
const staffVotesTable = document.querySelector("#staffVotesTable");
const emptyStaffVotes = document.querySelector("#emptyStaffVotes");
const prizeEntriesTable = document.querySelector("#prizeEntriesTable");
const emptyPrizeEntries = document.querySelector("#emptyPrizeEntries");
const prizeSummary = document.querySelector("#prizeSummary");
const prizeEntriesCount = document.querySelector("#prizeEntriesCount");
const exportPrizeCsvButton = document.querySelector("#exportPrizeCsvButton");
const drawPrizeWinnerButton = document.querySelector("#drawPrizeWinnerButton");
const prizeWinnerName = document.querySelector("#prizeWinnerName");
const prizeWinnerMeta = document.querySelector("#prizeWinnerMeta");
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
const publicNotificationButton = document.querySelector("#publicNotificationButton");
const communicationForm = document.querySelector("#communicationForm");
const communicationStatus = document.querySelector("#communicationStatus");
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
  moments: "moments.html",
  partner: "partner.html",
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
  "#moments": "moments.html",
  "#partner": "partner.html",
  "#privacy": "privacy.html",
  "#staff": "gestione.html",
  "#gestione": "gestione.html",
};

let reservations = loadReservations();
let reviews = loadReviews();
let moments = loadMoments();
let visibleMomentsCount = ADMIN_MOMENTS_PAGE_SIZE;
let trucks = loadTrucks();
let votes = loadVotes();
let analyticsEvents = loadAnalyticsEvents();
let capacityPerSlot = DEFAULT_CAPACITY_PER_SLOT;
let deferredInstallPrompt = null;
let selectedTruckId = sessionStorage.getItem("cssf-selected-truck") || trucks[0]?.id || "";
let activeLeaderboardCategory = voteCategories[0].value;
let activeStaffVoteCategory = voteCategories[0].value;
let showAllStaffVoteRows = false;
let sessionId = sessionStorage.getItem("cssf-session-id") || createId("SESSION");
let supabaseClient = createSupabaseClient();
let reservationsRealtimeChannel = null;
let trucksRealtimeChannel = null;
let votesRealtimeChannel = null;
let reviewsRealtimeChannel = null;
let visiblePublicReviewsCount = REVIEW_FEED_BATCH_SIZE;
let visibleAdminReviewsCount = REVIEW_FEED_BATCH_SIZE;
let analyticsRealtimeChannel = null;
let momentsRealtimeChannel = null;
let staffSession = null;
let lastReservationRemoteError = "";
let lastTruckRemoteError = "";
let lastVoteRemoteError = "";
let lastReviewRemoteError = "";
let lastMomentRemoteError = "";
let voteLeaderboardRows = [];
let remoteVoteLeaderboardSynced = false;
let knownRemoteReservationIds = new Set(reservations.map((reservation) => reservation.id));
let remoteReservationsSynced = false;
let reservationSlotUsage = new Map();
let remoteReservationSlotUsageSynced = false;
let reservationSlotUsageRefreshTimer = null;
let serviceWorkerRegistrationPromise = null;
let staffPushSubscribed = false;
let activeBookingView = "pending";
let remoteMomentsTotal = 0;
let remoteMomentsHasMore = false;
sessionStorage.setItem("cssf-session-id", sessionId);

redirectLegacyHashRoute();

if (capacityInput) {
  capacityInput.value = capacityPerSlot;
}

bindEvent(bookingForm, "submit", handleBookingSubmit);
bindEvent(bookingForm?.day, "change", updateAvailabilityReadout);
bindEvent(bookingForm?.slot, "change", updateAvailabilityReadout);
bindEvent(bookingForm?.guests, "input", updateAvailabilityReadout);
bindEvent(bookingForm, "input", handleFieldValidationStateChange);
bindEvent(bookingForm, "change", handleFieldValidationStateChange);
bindEvent(searchInput, "input", renderReservations);
bindEvent(bookingSearchToggle, "click", toggleBookingSearchPanel);
bindEvent(dayFilter, "change", () => {
  activeBookingView = inferActiveBookingView();
  renderReservations();
});
bindEvent(statusFilter, "change", () => {
  activeBookingView = inferActiveBookingView();
  renderReservations();
});
bindEvent(bookingQuickViews, "click", handleBookingQuickViewClick);
bindEvent(capacityInput, "change", handleCapacityChange);
bindEvent(slotQuickForm, "submit", handleSlotQuickSubmit);
bindEvent(slotGuestsInput, "input", updateSlotModalAvailability);
bindEvent(exportCsvButton, "click", exportCsv);
bindEvent(copyReportButton, "click", copyReport);
bindEvent(reviewForm, "submit", handleReviewSubmit);
bindEvent(reviewForm, "input", handleFieldValidationStateChange);
bindEvent(reviewForm, "change", handleFieldValidationStateChange);
bindEvent(momentsForm, "submit", handleMomentSubmit);
bindEvent(momentImageInput, "change", handleMomentImagePreview);
bindEvent(loadMoreMomentsButton, "click", handleLoadMoreMoments);
bindEvent(downloadAllMomentsButton, "click", handleDownloadAllMoments);
bindEvent(installButton, "click", handleInstallClick);
bindEvent(staffVoteMoreButton, "click", () => {
  showAllStaffVoteRows = true;
  renderStaffVotes();
});
bindEvent(truckSearchInput, "input", renderFestival);
bindEvent(categoryFilter, "change", renderFestival);
bindEvent(voteForm, "submit", handleVoteSubmit);
bindEvent(voteForm, "input", handleFieldValidationStateChange);
bindEvent(voteForm, "change", handleFieldValidationStateChange);
bindEvent(truckForm, "submit", handleTruckFormSubmit);
bindEvent(resetTruckFormButton, "click", resetTruckForm);
bindEvent(adminLoginForm, "submit", handleAdminLogin);
bindEvent(adminLogoutButton, "click", handleAdminLogout);
bindEvent(notificationPermissionButton, "click", requestStaffNotifications);
bindEvent(publicNotificationButton, "click", requestPublicNotifications);
bindEvent(communicationForm, "submit", handleCommunicationSubmit);
bindEvent(exportAnalyticsButton, "click", exportAnalyticsCsv);
bindEvent(clearAnalyticsButton, "click", clearAnalyticsEvents);
bindEvent(clearReviewsButton, "click", clearReviewsRemote);
bindEvent(exportPrizeCsvButton, "click", exportPrizeEntriesCsv);
bindEvent(clearVotesButton, "click", clearVotesRemote);

if (isStaffPage() && dayFilter && statusFilter) {
  dayFilter.value = "all";
  statusFilter.value = "pending";
  activeBookingView = "pending";
}
bindEvent(acceptAnalyticsButton, "click", () => setAnalyticsConsent("accepted"));
bindEvent(rejectAnalyticsButton, "click", () => setAnalyticsConsent("rejected"));
bindEvent(privacyPreferencesButton, "click", resetPrivacyPreferences);
bindEvent(mobileMenuToggle, "click", toggleMobileMenu);
bindEvent(festivalMap, "click", openMapImageModal);
bindEvent(mapImageBackdrop, "click", closeMapImageModal);
bindEvent(mapImageClose, "click", closeMapImageModal);
bindEvent(window, "storage", handleSharedStorageUpdate);
bindEvent(window, "pageshow", handlePageShow);
bindEvent(window, "resize", handleViewportResize);

setupMoodButtons();
setupSlotModal();
setupInstallPrompt();
setupAnalytics();
setupReviewRating();
setupAppViews();
setupMobileMenu();
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
setupSupabaseReviews();
setupSupabaseAnalytics();
setupSupabaseMoments();

function bindEvent(element, eventName, handler) {
  element?.addEventListener(eventName, handler);
}

function getFormValidationFields(form) {
  if (!form) return [];
  return Array.from(form.querySelectorAll("input, select, textarea")).filter((field) => field.willValidate);
}

function updateFieldValidationState(field) {
  if (!field || !field.willValidate) return true;

  const isInvalid = !field.checkValidity();
  field.classList.toggle("is-invalid", isInvalid);
  field.setAttribute("aria-invalid", isInvalid ? "true" : "false");
  field.closest("label")?.classList.toggle("field-invalid", isInvalid);
  return !isInvalid;
}

function validateFormFields(form) {
  const fields = getFormValidationFields(form);
  let firstInvalidField = null;

  fields.forEach((field) => {
    const isValid = updateFieldValidationState(field);
    if (!isValid && !firstInvalidField) {
      firstInvalidField = field;
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus({ preventScroll: true });
    firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  return true;
}

function clearFormValidationState(form) {
  getFormValidationFields(form).forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    field.closest("label")?.classList.remove("field-invalid");
  });
}

function handleFieldValidationStateChange(event) {
  updateFieldValidationState(event.target);
}

function handlePageShow(event) {
  normalizeTruckFilters();
  render();
  renderReviews();
  renderMomentsAdmin();
  setupReviewRating();
  syncMobileMenuState(false);
  closeMapImageModal();

  if (!event.persisted) return;

  if (supabaseClient) {
    if (festivalMap || truckGrid || voteTruck || leaderboardList || staffVoteLeaderboard) {
      refreshTrucksFromRemote();
    }
    if (reviewsList) {
      refreshReviewsFromRemote();
    }
    if (leaderboardList) {
      refreshVoteLeaderboardFromRemote();
    }
    if (bookingForm || slotsGrid || availabilityReadout) {
      refreshReservationSlotUsageFromRemote();
    }
    if (isStaffPage() && staffSession) {
      refreshReservationsFromRemote();
      refreshVotesFromRemote();
      refreshAnalyticsFromRemote();
      refreshMomentsFromRemote();
    }
  }
}

function setupMobileMenu() {
  if (!mobileMenuToggle || !primaryNav || !publicTopbar) return;

  primaryNav.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 780) {
        syncMobileMenuState(false);
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!publicTopbar.classList.contains("is-mobile-menu-open")) return;
    if (publicTopbar.contains(event.target)) return;
    syncMobileMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      syncMobileMenuState(false);
      closeMapImageModal();
    }
  });

  syncMobileMenuState(false);
}

function toggleMobileMenu() {
  if (!mobileMenuToggle || !publicTopbar) return;
  const isOpen = publicTopbar.classList.contains("is-mobile-menu-open");
  syncMobileMenuState(!isOpen);
}

function syncMobileMenuState(isOpen) {
  if (!mobileMenuToggle || !publicTopbar) return;
  publicTopbar.classList.toggle("is-mobile-menu-open", isOpen);
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenuToggle.setAttribute("aria-label", isOpen ? "Chiudi il menu" : "Apri il menu");
}

function handleViewportResize() {
  if (window.innerWidth > 780) {
    syncMobileMenuState(false);
    closeMapImageModal();
  }
}

function openMapImageModal(event) {
  if (!festivalMap || !mapImageModal) return;
  if (window.innerWidth > 780) return;
  if (event?.target?.closest(".map-marker")) return;

  mapImageModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeMapImageModal() {
  if (!mapImageModal) return;

  mapImageModal.hidden = true;
  document.body.classList.remove("modal-open");
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

  if (!validateFormFields(bookingForm)) {
    showToast("Compila i campi obbligatori evidenziati in rosso.");
    return;
  }

  const formData = new FormData(bookingForm);
  const guests = clampNumber(Number(formData.get("guests")), 1, 30);
  const day = String(formData.get("day"));
  const slot = String(formData.get("slot"));
  const status = "pending";

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

  const remoteSaved = await saveReservationRemote(reservation);
  if (!remoteSaved) {
    showToast(`Prenotazione non inviata: ${lastReservationRemoteError || "Supabase non raggiungibile"}. Riprova.`);
    return;
  }

  reservations.unshift(reservation);
  saveReservations();
  bookingForm.reset();
  clearFormValidationState(bookingForm);
  bookingForm.guests.value = 4;
  render();
  trackEvent("conversion", "prenotazione inviata", { section: "prenota", code: reservation.id });
  showToast(`Richiesta registrata correttamente. Codice ${reservation.id}`);
}

async function handleReviewSubmit(event) {
  event.preventDefault();

  if (!validateFormFields(reviewForm)) {
    showToast("Compila i campi obbligatori evidenziati in rosso.");
    return;
  }

  const formData = new FormData(reviewForm);
  const reviewBody = cleanText(formData.get("body"));
  const review = {
    id: createId("REV"),
    createdAt: new Date().toISOString(),
    reviewer: "Ospite",
    rating: clampNumber(Number(formData.get("rating")), 1, 5),
    ageRange: cleanText(formData.get("ageRange")),
    gender: cleanText(formData.get("gender")),
    originArea: cleanText(formData.get("originArea")),
    favoriteAspect: cleanText(formData.get("favoriteAspect")),
    improvementArea: cleanText(formData.get("improvementArea")),
    title: createReviewTitle(reviewBody),
    body: reviewBody,
  };

  if (review.body.length < 10) {
    showToast("La recensione deve contenere almeno 10 caratteri.");
    return;
  }

  if (review.body.length > 800) {
    showToast("La recensione e' troppo lunga. Resta sotto 800 caratteri.");
    return;
  }

  if (review.title.length < 2 || review.title.length > 120) {
    showToast("Il testo inserito non genera un titolo valido per la recensione.");
    return;
  }

  const remoteSaved = await saveReviewRemote(review);
  if (!remoteSaved) {
    showToast(`Recensione non pubblicata: ${lastReviewRemoteError || "Supabase non raggiungibile"}.`);
    return;
  }

  reviews.unshift(review);
  saveReviews();
  reviewForm.reset();
  clearFormValidationState(reviewForm);
  setupReviewRating();
  renderReviews();
  trackEvent("conversion", "recensione pubblicata", { section: "recensioni", rating: review.rating });
  showToast("Recensione pubblicata.");
}

function handleMomentImagePreview() {
  const file = momentImageInput?.files?.[0] || null;
  updateMomentPreview(file);
}

async function handleMomentSubmit(event) {
  event.preventDefault();
  if (!momentsForm) return;

  const formData = new FormData(momentsForm);
  const uploaderName = cleanText(formData.get("uploaderName"));
  const caption = cleanText(formData.get("caption"));
  const file = momentImageInput?.files?.[0] || null;

  if (!uploaderName || uploaderName.length < 2) {
    showToast("Inserisci il tuo nome.");
    setMomentsFormStatus("Inserisci un nome valido prima dell'invio.");
    return;
  }

  if (!file) {
    showToast("Seleziona una foto da caricare.");
    setMomentsFormStatus("Seleziona una foto JPG, PNG o WEBP.");
    return;
  }

  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
    showToast("Formato non supportato.");
    setMomentsFormStatus("Usa solo file JPG, PNG o WEBP.");
    return;
  }

  if (file.size > MAX_MOMENT_FILE_SIZE) {
    showToast("La foto supera il limite di 2 MB.");
    setMomentsFormStatus("Riduci il file sotto i 2 MB e riprova.");
    return;
  }

  const momentId = createId("MOM");
  setMomentsFormStatus("Upload in corso...");

  const uploadedAsset = await uploadMomentAsset(momentId, file);
  if (!uploadedAsset) {
    showToast(`Foto non inviata: ${lastMomentRemoteError || "upload non riuscito"}.`);
    setMomentsFormStatus(lastMomentRemoteError || "Upload non riuscito.");
    return;
  }

  const moment = {
    id: momentId,
    createdAt: new Date().toISOString(),
    uploaderName,
    caption,
    imagePath: uploadedAsset.path,
    imageUrl: uploadedAsset.publicUrl,
    status: "pending",
  };

  const remoteSaved = await saveMomentRemote(moment);
  if (!remoteSaved) {
    await removeMomentAsset(uploadedAsset.path);
    showToast(`Foto non inviata: ${lastMomentRemoteError || "database non raggiungibile"}.`);
    setMomentsFormStatus(lastMomentRemoteError || "Database non raggiungibile.");
    return;
  }

  momentsForm.reset();
  updateMomentPreview(null);
  setMomentsFormStatus("Foto inviata correttamente allo staff CSSF Moments.");
  trackEvent("conversion", "moments foto caricata", { section: "moments" });
  showToast("Foto caricata.");
}

async function handleDownloadAllMoments() {
  if (!moments.length) {
    showToast("Non ci sono foto da scaricare.");
    return;
  }

  if (downloadAllMomentsButton) {
    downloadAllMomentsButton.disabled = true;
    downloadAllMomentsButton.textContent = "Download in corso...";
  }

  let downloaded = 0;

  for (const moment of moments) {
    try {
      const response = await fetch(moment.imageUrl, { mode: "cors" });
      if (!response.ok) continue;

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const extension = getMomentDownloadExtension(moment.imageUrl, blob.type);

      link.href = objectUrl;
      link.download = `${moment.id || `cssf-moment-${downloaded + 1}`}.${extension}`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      downloaded += 1;
      await wait(180);
    } catch {
    }
  }

  if (downloadAllMomentsButton) {
    downloadAllMomentsButton.disabled = false;
    downloadAllMomentsButton.textContent = "Scarica tutte le foto";
  }

  showToast(
    downloaded
      ? `${downloaded} ${downloaded === 1 ? "foto scaricata" : "foto scaricate"}.`
      : "Download non riuscito.",
  );
}

async function handleDeleteMoment(moment) {
  if (!moment?.id) return;

  const confirmed = window.confirm("Vuoi eliminare questa foto?");
  if (!confirmed) return;

  const deleted = await deleteMomentRemote(moment);
  if (!deleted) {
    showToast(`Eliminazione non riuscita: ${lastMomentRemoteError || "riprova"}.`);
    return;
  }

  moments = moments.filter((item) => item.id !== moment.id);
  if (!moments.length) {
    visibleMomentsCount = ADMIN_MOMENTS_PAGE_SIZE;
  }
  renderMomentsAdmin();
  showToast("Foto eliminata.");
}

async function handleVoteSubmit(event) {
  event.preventDefault();

  if (!validateFormFields(voteForm)) {
    showToast("Compila i campi obbligatori evidenziati in rosso.");
    return;
  }

  const formData = new FormData(voteForm);
  const truckId = String(formData.get("truckId"));
  const truck = trucks.find((item) => item.id === truckId);

  if (!truck) {
    showToast("Seleziona uno stand valido.");
    return;
  }

  const createdAt = new Date().toISOString();
  const voter = "Anonimo";
  const prizeOptIn = false;
  const email = cleanText(formData.get("email"));
  const gender = String(formData.get("gender") || "");
  const ageRange = String(formData.get("ageRange") || "");
  const distance = String(formData.get("distance") || "");
  const sanizzoScore = Number(formData.get("sanizzoScore"));
  const traditionalScore = Number(formData.get("traditionalScore"));
  const creativeScore = Number(formData.get("creativeScore"));

  const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (!email || !emailPattern.test(email)) {
    showToast("Inserisci un'email valida.");
    return;
  }

  if (!Number.isInteger(sanizzoScore) || sanizzoScore < 1 || sanizzoScore > 5) {
    showToast("Assegna un punteggio a Street Chef piu' SANIZZO.");
    return;
  }

  if (!Number.isInteger(traditionalScore) || traditionalScore < 1 || traditionalScore > 5) {
    showToast("Assegna un punteggio a Street Chef piu' TRADIZIONALE.");
    return;
  }

  if (!Number.isInteger(creativeScore) || creativeScore < 1 || creativeScore > 5) {
    showToast("Assegna un punteggio a Street Chef piu' CREATIVO.");
    return;
  }

  const submittedVotes = [
    {
      id: createId("VOTE"),
      createdAt,
      category: "sanizzo-award",
      truckId,
      voter,
      prizeOptIn,
      email,
      gender,
      ageRange,
      distance,
      score: sanizzoScore,
    },
    {
      id: createId("VOTE"),
      createdAt,
      category: "tradition-award",
      truckId,
      voter,
      prizeOptIn,
      email,
      gender,
      ageRange,
      distance,
      score: traditionalScore,
    },
    {
      id: createId("VOTE"),
      createdAt,
      category: "creative-award",
      truckId,
      voter,
      prizeOptIn,
      email,
      gender,
      ageRange,
      distance,
      score: creativeScore,
    },
  ];

  const remoteSaved = await Promise.all(submittedVotes.map((vote) => saveVoteRemote(vote)));
  if (remoteSaved.some((saved) => !saved)) {
    showToast(`Voto non inviato: ${lastVoteRemoteError || "Supabase non raggiungibile"}. Riprova.`);
    return;
  }

  votes.unshift(...submittedVotes);
  saveVotes();
  selectedTruckId = truckId;
  activeLeaderboardCategory = "sanizzo-award";
  remoteVoteLeaderboardSynced = false;
  voteForm.reset();
  clearFormValidationState(voteForm);
  toggleVoteExtraFields();
  render();
  trackEvent("conversion", "voto inviato", {
    section: "vota",
    category: "contest-triple-score",
    truckId,
    sanizzoScore,
    traditionalScore,
    creativeScore,
  });
  showToast(`Voti registrati per ${truck.name}.`);
}

function toggleVoteExtraFields() {
  if (!voteExtraFields) return;
  voteExtraFields.hidden = false;
  voteExtraFields.querySelectorAll("input, select").forEach((field) => {
    field.disabled = false;
  });
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

  const remoteSaved = await saveTruckRemote(truck);
  if (!remoteSaved) {
    showToast(`Stand non salvato: ${lastTruckRemoteError || "Supabase non raggiungibile"}.`);
    return;
  }

  if (existing) {
    trucks = trucks.map((item) => (item.id === existing.id ? truck : item));
  } else {
    trucks.push(truck);
  }
  selectedTruckId = id;
  saveTrucks();
  resetTruckForm();
  render();
  trackEvent("admin", "stand salvato", { truckId: id });
  showToast("Stand salvato e sincronizzato.");
}

function handleCapacityChange() {
  if (!capacityInput) return;

  capacityPerSlot = clampNumber(Number(capacityInput.value), SEATS_PER_TABLE, DEFAULT_CAPACITY_PER_SLOT);
  capacityInput.value = capacityPerSlot;
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
  renderPrizeEntries();
  renderAnalyticsDashboard();
  renderMomentsAdmin();
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

  if (!bookingForm && !availabilityReadout) return;
  updateAvailabilityReadout();
}

async function setupSupabaseTrucks() {
  if (!supabaseClient) return;
  if (!festivalMap && !selectedTruckCard && !truckGrid && !voteTruck && !leaderboardList && !staffVoteLeaderboard && !truckAdminTable) return;

  const synced = await refreshTrucksFromRemote();
  if (!synced) {
    trucks = cloneDefaultTrucks();
    if (!trucks.some((truck) => truck.id === selectedTruckId)) {
      selectedTruckId = trucks[0]?.id || "";
    }
    renderFestival();
    renderVoteOptions();
  }
  if (isStaffPage() && staffSession) {
    subscribeToTruckChanges();
  }
}

async function setupSupabaseVotes() {
  if (!supabaseClient) return;
  if (!voteForm && !leaderboardList && !staffVoteLeaderboard && !staffVotesTable && !clearVotesButton) return;

  if (staffSession) {
    await refreshVotesFromRemote();
  } else if (leaderboardList) {
    await refreshVoteLeaderboardFromRemote();
  }
  if (staffSession) {
    subscribeToVoteChanges();
  }
}

async function setupSupabaseReviews() {
  if (!supabaseClient) return;
  if (!reviewForm && !reviewsList && !adminReviewsList) return;

  if (reviewsList || adminReviewsList) {
    await refreshReviewsFromRemote();
  }
  if (isStaffPage() && staffSession) {
    subscribeToReviewChanges();
  }
}

async function setupSupabaseAnalytics() {
  if (!supabaseClient || !isStaffPage() || !staffSession) return;

  await refreshAnalyticsFromRemote();
  subscribeToAnalyticsChanges();
}

async function setupSupabaseMoments() {
  if (!supabaseClient) return;
  if (!momentsForm && !adminMomentsGrid) return;

  if (adminMomentsGrid) {
    if (!staffSession) return;
    await refreshMomentsFromRemote();
    subscribeToMomentChanges();
  }
}

async function refreshReservationsFromRemote() {
  if (!supabaseClient) return false;

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_RESERVATIONS_TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(MAX_STAFF_RESERVATIONS);

    if (error || !Array.isArray(data)) return false;

    const remoteReservations = data.map(mapReservationFromRemote);
    if (remoteReservationsSynced) {
      announceNewRemoteReservations(remoteReservations);
    }
    reservations = remoteReservations;
    syncReservationSlotUsageFromReservations(remoteReservations);
    knownRemoteReservationIds = new Set(reservations.map((reservation) => reservation.id));
    remoteReservationsSynced = true;
    saveReservations();
    render();
    renderAnalyticsDashboard();
    return true;
  } catch {
    return false;
  }
}

async function refreshReservationSlotUsageFromRemote() {
  if (!supabaseClient) return false;

  try {
    const { data, error } = await supabaseClient.from(SUPABASE_RESERVATION_SLOT_USAGE_VIEW).select("*");
    if (error || !Array.isArray(data)) return false;

    reservationSlotUsage = new Map(
      data.map((row) => [getSlotUsageKey(row.day, row.slot), Number(row.used_guests) || 0]),
    );
    remoteReservationSlotUsageSynced = true;
    render();
    return true;
  } catch {
    return false;
  }
}

function startReservationSlotUsagePolling() {
  if (reservationSlotUsageRefreshTimer || isStaffPage()) return;
  reservationSlotUsageRefreshTimer = window.setInterval(refreshReservationSlotUsageFromRemote, 45000);
}

function syncReservationSlotUsageFromReservations(rows) {
  const usage = new Map();
  rows
    .filter((reservation) => activeStatuses.has(reservation.status))
    .forEach((reservation) => {
      const key = getSlotUsageKey(reservation.day, reservation.slot);
      usage.set(key, (usage.get(key) || 0) + Number(reservation.guests || 0));
    });
  reservationSlotUsage = usage;
  remoteReservationSlotUsageSynced = true;
}

function incrementReservationSlotUsage(day, slot, guests) {
  if (!remoteReservationSlotUsageSynced) return;

  const key = getSlotUsageKey(day, slot);
  reservationSlotUsage.set(key, (reservationSlotUsage.get(key) || 0) + Number(guests || 0));
}

function getSlotUsageKey(day, slot) {
  return `${day}::${slot}`;
}

function subscribeToReservationChanges() {
  if (!supabaseClient || reservationsRealtimeChannel) return;

  reservationsRealtimeChannel = supabaseClient
    .channel("cssf-reservations-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: SUPABASE_RESERVATIONS_TABLE },
      () => (isStaffPage() && staffSession ? refreshReservationsFromRemote() : refreshReservationSlotUsageFromRemote()),
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
  if (!supabaseClient || trucksRealtimeChannel || !staffSession || !isStaffPage()) return;

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
    const [profilesResponse, leaderboardResponse] = await Promise.all([
      supabaseClient
        .from(SUPABASE_VOTES_TABLE)
        .select("*")
        .order("created_at", { ascending: false }),
      supabaseClient
        .from(SUPABASE_VOTE_LEADERBOARD_VIEW)
        .select("*")
        .order("avg_score", { ascending: false })
        .order("vote_count", { ascending: false }),
    ]);

    if (profilesResponse.error || !Array.isArray(profilesResponse.data)) return false;
    if (leaderboardResponse.error || !Array.isArray(leaderboardResponse.data)) return false;

    votes = profilesResponse.data.map(mapVoteFromRemote);
    showAllStaffVoteRows = false;
    voteLeaderboardRows = leaderboardResponse.data.map(mapVoteLeaderboardFromRemote);
    remoteVoteLeaderboardSynced = true;
    saveVotes();
    render();
    renderAnalyticsDashboard();
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
      .order("avg_score", { ascending: false })
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
  if (!supabaseClient || votesRealtimeChannel || !staffSession || !isStaffPage()) return;

  votesRealtimeChannel = supabaseClient
    .channel("cssf-votes-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: SUPABASE_VOTES_TABLE },
      () => (staffSession ? refreshVotesFromRemote() : refreshVoteLeaderboardFromRemote()),
    )
    .subscribe();
}

async function refreshReviewsFromRemote() {
  if (!supabaseClient) return false;

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_REVIEWS_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !Array.isArray(data)) return false;

    reviews = data.map(mapReviewFromRemote);
    saveReviews();
    renderReviews();
    renderAnalyticsDashboard();
    return true;
  } catch {
    return false;
  }
}

function subscribeToReviewChanges() {
  if (!supabaseClient || reviewsRealtimeChannel || !staffSession || !isStaffPage()) return;

  reviewsRealtimeChannel = supabaseClient
    .channel("cssf-reviews-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: SUPABASE_REVIEWS_TABLE }, () =>
      refreshReviewsFromRemote(),
    )
    .subscribe();
}

async function refreshAnalyticsFromRemote() {
  if (!supabaseClient || !staffSession) return false;

  try {
    const { data, error } = await supabaseClient
      .from(SUPABASE_ANALYTICS_TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(MAX_ANALYTICS_EVENTS);

    if (error || !Array.isArray(data)) return false;

    analyticsEvents = data.map(mapAnalyticsEventFromRemote);
    saveAnalyticsEvents();
    renderAnalyticsDashboard();
    return true;
  } catch {
    return false;
  }
}

function subscribeToAnalyticsChanges() {
  if (!supabaseClient || analyticsRealtimeChannel || !staffSession) return;

  analyticsRealtimeChannel = supabaseClient
    .channel("cssf-analytics-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: SUPABASE_ANALYTICS_TABLE }, () =>
      refreshAnalyticsFromRemote(),
    )
    .subscribe();
}

async function refreshMomentsFromRemote() {
  if (!supabaseClient || !staffSession) return false;

  try {
    const { data, error, count } = await supabaseClient
      .from(SUPABASE_MOMENTS_TABLE)
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(0, ADMIN_MOMENTS_PAGE_SIZE - 1);

    if (error || !Array.isArray(data)) return false;

    moments = data.map(mapMomentFromRemote);
    visibleMomentsCount = moments.length;
    remoteMomentsTotal = Number(count) || moments.length;
    remoteMomentsHasMore = moments.length < remoteMomentsTotal;
    saveMoments();
    renderMomentsAdmin();
    renderAnalyticsDashboard();
    return true;
  } catch {
    return false;
  }
}

async function loadMoreMomentsFromRemote() {
  if (!supabaseClient || !staffSession || !remoteMomentsHasMore) return false;

  try {
    const from = moments.length;
    const to = from + ADMIN_MOMENTS_PAGE_SIZE - 1;
    const { data, error } = await supabaseClient
      .from(SUPABASE_MOMENTS_TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error || !Array.isArray(data) || !data.length) return false;

    moments = [...moments, ...data.map(mapMomentFromRemote)];
    visibleMomentsCount = moments.length;
    remoteMomentsHasMore = moments.length < remoteMomentsTotal;
    saveMoments();
    renderMomentsAdmin();
    renderAnalyticsDashboard();
    return true;
  } catch {
    return false;
  }
}

function subscribeToMomentChanges() {
  if (!supabaseClient || momentsRealtimeChannel || !staffSession) return;

  momentsRealtimeChannel = supabaseClient
    .channel("cssf-moments-realtime")
    .on("postgres_changes", { event: "*", schema: "public", table: SUPABASE_MOMENTS_TABLE }, () =>
      refreshMomentsFromRemote(),
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
    setStaffAuthStatus("Supabase non disponibile: controlla connessione e script CDN.");
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
      refreshTrucksFromRemote();
      refreshReservationsFromRemote();
      refreshVotesFromRemote();
      refreshReviewsFromRemote();
      refreshAnalyticsFromRemote();
      refreshMomentsFromRemote();
      subscribeToTruckChanges();
      subscribeToReservationChanges();
      subscribeToVoteChanges();
      subscribeToReviewChanges();
      subscribeToAnalyticsChanges();
      subscribeToMomentChanges();
    }
  });

  renderAdminAccess();
  if (staffSession) {
    await refreshTrucksFromRemote();
    await refreshReservationsFromRemote();
    await refreshVotesFromRemote();
    await refreshReviewsFromRemote();
    await refreshAnalyticsFromRemote();
    await refreshMomentsFromRemote();
    subscribeToTruckChanges();
    subscribeToReservationChanges();
    subscribeToVoteChanges();
    subscribeToReviewChanges();
    subscribeToAnalyticsChanges();
    subscribeToMomentChanges();
  }
}

async function requestStaffNotifications() {
  await requestPushNotificationsForScope(STAFF_PUSH_SCOPE);
}

async function requestPublicNotifications() {
  await requestPushNotificationsForScope(PUBLIC_PUSH_SCOPE);
}

async function requestPushNotificationsForScope(scope) {
  dismissConsentBannerPermanently();

  const isStaffScope = scope === STAFF_PUSH_SCOPE;
  const successMessage = isStaffScope ? "Notifiche staff attive." : "Notifiche evento attive.";
  const existingMessage = isStaffScope ? "Notifiche staff gia attive." : "Notifiche evento gia attive.";

  if (isIosDevice() && !isStandaloneMode()) {
    await refreshPushUi();
    showToast("Su iPhone installa prima la web app con Aggiungi a Home, poi attiva le notifiche dall'app.");
    return;
  }

  if (!supportsPushNotifications()) {
    await refreshPushUi();
    showToast("Questo browser non supporta le notifiche.");
    return;
  }

  if (Notification.permission === "granted") {
    try {
      const result = await ensurePushSubscription(scope);
      await refreshPushUi();
      showToast(result === "existing" ? existingMessage : successMessage);
    } catch (error) {
      await refreshPushUi();
      showToast(error?.message || "Notifiche non attivabili ora.");
    }
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    setPushScopeState(scope, false);
    await refreshPushUi();
    showToast(
      permission === "denied"
        ? "Notifiche bloccate: riattivale dalle impostazioni del browser."
        : "Notifiche non abilitate.",
    );
    return;
  }

  try {
    await ensurePushSubscription(scope);
    await refreshPushUi();
    showToast(successMessage);
  } catch (error) {
    await refreshPushUi();
    showToast(error?.message || "Notifiche non attivabili ora.");
  }
}

function updateNotificationPermissionUi() {
  refreshPushUi();
}

async function refreshPushUi() {
  await refreshStaffPushUi();
  await refreshPublicPushUi();
}

async function refreshStaffPushUi() {
  if (!notificationPermissionButton) return;
  await updatePushButtonUi(notificationPermissionButton, STAFF_PUSH_SCOPE, {
    inactiveLabel: "Attiva notifiche staff",
    activeLabel: "Notifiche staff attive",
    pendingLabel: "Completa attivazione notifiche staff",
  });
}

async function refreshPublicPushUi() {
  if (!publicNotificationButton) return;
  await updatePushButtonUi(publicNotificationButton, PUBLIC_PUSH_SCOPE, {
    inactiveLabel: "Attiva notifiche evento",
    activeLabel: "Notifiche evento attive",
    pendingLabel: "Completa attivazione notifiche evento",
  });
}

async function updatePushButtonUi(button, scope, labels) {
  if (!button) return;
  const updatesVisibleText = button !== notificationPermissionButton;

  if (!supportsPushNotifications()) {
    button.classList.remove("is-active", "is-blocked");
    button.classList.add("is-unavailable");
    button.setAttribute("aria-label", "Notifiche non supportate");
    button.title = "Notifiche non supportate";
    if (updatesVisibleText) {
      button.textContent = "Notifiche non supportate";
    }
    button.disabled = true;
    return;
  }

  if (Notification.permission === "default") {
    setPushScopeState(scope, false);
    button.classList.remove("is-active", "is-blocked", "is-unavailable");
    button.setAttribute("aria-label", labels.inactiveLabel);
    button.setAttribute("aria-pressed", "false");
    button.title = labels.inactiveLabel;
    if (updatesVisibleText) {
      button.textContent = labels.inactiveLabel;
    }
    button.disabled = false;
    return;
  }

  const hasBrowserSubscription = Notification.permission === "granted"
    ? await hasAnyPushSubscription()
    : false;
  const isScopeEnabled = hasBrowserSubscription && getPushScopeState(scope);

  if (scope === STAFF_PUSH_SCOPE) {
    staffPushSubscribed = isScopeEnabled;
  }

  if (Notification.permission === "granted") {
    button.classList.toggle("is-active", isScopeEnabled);
    button.classList.remove("is-blocked", "is-unavailable");
    button.setAttribute("aria-label", isScopeEnabled ? labels.activeLabel : labels.pendingLabel);
    button.setAttribute("aria-pressed", String(isScopeEnabled));
    button.title = isScopeEnabled ? labels.activeLabel : labels.pendingLabel;
    if (updatesVisibleText) {
      button.textContent = isScopeEnabled ? labels.activeLabel : labels.inactiveLabel;
    }
    button.disabled = false;
  } else if (Notification.permission === "denied") {
    setPushScopeState(scope, false);
    button.classList.add("is-blocked");
    button.classList.remove("is-active", "is-unavailable");
    button.setAttribute("aria-label", "Notifiche bloccate dal browser");
    button.setAttribute("aria-pressed", "false");
    button.title = "Notifiche bloccate dal browser";
    if (updatesVisibleText) {
      button.textContent = "Notifiche bloccate";
    }
    button.disabled = false;
  } else {
    button.classList.remove("is-active", "is-blocked", "is-unavailable");
    button.setAttribute("aria-label", labels.inactiveLabel);
    button.setAttribute("aria-pressed", "false");
    button.title = labels.inactiveLabel;
    if (updatesVisibleText) {
      button.textContent = labels.inactiveLabel;
    }
    button.disabled = false;
  }
}

function supportsPushNotifications() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    isInstallSecureContext()
  );
}

async function hasAnyPushSubscription() {
  if (!supportsPushNotifications()) return false;

  try {
    const registration = await ensureServiceWorkerReady();
    return Boolean(await registration.pushManager.getSubscription());
  } catch {
    return false;
  }
}

async function ensureServiceWorkerReady() {
  if (!("serviceWorker" in navigator) || !isInstallSecureContext()) {
    throw new Error("Service worker non disponibile.");
  }

  if (!serviceWorkerRegistrationPromise) {
    serviceWorkerRegistrationPromise = navigator.serviceWorker.ready;
  }

  return serviceWorkerRegistrationPromise;
}

async function ensurePushSubscription(scope) {
  const registration = await ensureServiceWorkerReady();
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    await syncPushSubscription(scope, existingSubscription);
    setPushScopeState(scope, true);
    staffPushSubscribed = getPushScopeState(STAFF_PUSH_SCOPE);
    return "existing";
  }

  const publicKey = await fetchPushPublicKey();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await syncPushSubscription(scope, subscription);
  setPushScopeState(scope, true);
  staffPushSubscribed = getPushScopeState(STAFF_PUSH_SCOPE);
  return "subscribed";
}

async function fetchPushPublicKey() {
  const response = await fetch(PUSH_PUBLIC_KEY_ENDPOINT, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Config push non disponibile sul server.");
  }

  const payload = await response.json();
  const publicKey = String(payload?.publicKey || "").replace(/\s+/g, "").trim();
  if (!publicKey) {
    throw new Error("Chiave push non valida.");
  }

  return publicKey;
}

async function syncPushSubscription(scope, subscription) {
  const response = await fetch(PUSH_SUBSCRIBE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      scope,
      deviceLabel: getPushDeviceLabel(),
      userAgent: navigator.userAgent,
      subscription: subscription.toJSON(),
    }),
  });

  if (!response.ok) {
    throw new Error("Registrazione push non riuscita.");
  }
}

function getPushScopeState(scope) {
  return getPersistentPreference(getPushStatusKey(scope)) === "yes";
}

function setPushScopeState(scope, enabled) {
  setPersistentPreference(getPushStatusKey(scope), enabled ? "yes" : "no");
}

function getPushStatusKey(scope) {
  return scope === STAFF_PUSH_SCOPE ? STAFF_PUSH_STATUS_KEY : PUBLIC_PUSH_STATUS_KEY;
}

function getPushDeviceLabel() {
  if (isIosDevice()) return "iPhone o iPad";
  if (/Android/i.test(navigator.userAgent)) return "Android";
  if (/Windows/i.test(navigator.userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(navigator.userAgent)) return "Mac";
  return "Dispositivo staff";
}

function getPersistentPreference(key) {
  try {
    const localValue = localStorage.getItem(key);
    if (localValue !== null) return localValue;
  } catch {}

  const cookieMatch = document.cookie.match(
    new RegExp(`(?:^|; )${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );
  return cookieMatch ? decodeURIComponent(cookieMatch[1]) : "";
}

function setPersistentPreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}

  document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

function removePersistentPreference(key) {
  try {
    localStorage.removeItem(key);
  } catch {}

  document.cookie = `${key}=; path=/; max-age=0; samesite=lax`;
}

function dismissConsentBannerPermanently() {
  setPersistentPreference(PRIVACY_BANNER_SEEN_KEY, "yes");
  if (consentBanner) {
    consentBanner.hidden = true;
  }
}

function urlBase64ToUint8Array(base64String) {
  const normalizedBase64 = String(base64String || "").replace(/\s+/g, "").trim();
  const padding = "=".repeat((4 - (normalizedBase64.length % 4)) % 4);
  const base64 = (normalizedBase64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
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
  if (!("Notification" in window) || Notification.permission !== "granted" || staffPushSubscribed) return;

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

  normalizeTruckFilters();
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

function normalizeTruckFilters() {
  if (truckSearchInput && typeof truckSearchInput.value !== "string") {
    truckSearchInput.value = "";
  }

  if (!categoryFilter) return;

  const validCategories = new Set(["all", ...Object.keys(categoryLabels)]);
  if (!validCategories.has(categoryFilter.value)) {
    categoryFilter.value = "all";
  }
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
    marker.innerHTML = `
      <span class="map-marker-core" aria-hidden="true"></span>
      <span class="map-marker-badge" aria-hidden="true">${escapeHtml(truck.code)}</span>
    `;
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
    selectedTruckCard.style.removeProperty("--truck-accent");
    selectedTruckCard.innerHTML = "<p class=\"truck-menu\">Nessuno stand selezionato.</p>";
    return;
  }

  selectedTruckCard.style.setProperty("--truck-accent", getTruckLegendAccentColor(truck));
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
    card.style.setProperty("--truck-accent", getTruckLegendAccentColor(truck));
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
  const menuMarkup = formatTruckMenuAsList(truck.menu);

  return `
      <div class="truck-meta truck-meta-top">
        <span>${escapeHtml(categoryLabels[truck.category] || truck.category)}</span>
      </div>
    <h3>${escapeHtml(truck.name)}</h3>
    <div class="truck-menu">${menuMarkup}</div>
    <div class="truck-meta">
      <span class="status-live ${escapeHtml(truck.status)}">${escapeHtml(truckStatusLabels[truck.status] || truck.status)}</span>
    </div>
    <div class="truck-actions">
      ${voteButton}
      ${mapButton}
    </div>
  `;
}

function formatTruckMenuAsList(menu) {
  const normalized = String(menu || "").trim();
  if (!normalized) return "";

  const items = [];
  let current = "";
  let depth = 0;

  for (const char of normalized) {
    if (char === "(") depth += 1;
    if (char === ")" && depth > 0) depth -= 1;

    if (char === "," && depth === 0) {
      if (current.trim()) items.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    items.push(current.trim());
  }

  if (!items.length) {
    return `<ul class="truck-menu-list"><li>${escapeHtml(normalized)}</li></ul>`;
  }

  return `
    <ul class="truck-menu-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function getTruckLegendAccentColor(truck) {
  const explicitColor = String(truck?.color || "").trim();
  if (explicitColor) {
    return explicitColor;
  }

  const category = String(truck?.category || "").toLowerCase();
  const searchable = `${truck?.name || ""} ${truck?.menu || ""}`.toLowerCase();

  if (category === "cocktail" || searchable.includes("cocktail")) {
    return truckLegendAccentColors.cocktail;
  }

  if (category === "birra" || searchable.includes("birra")) {
    return truckLegendAccentColors.birra;
  }

  if (category === "dolci" || hasOneOf(searchable, ["gelat", "dolc", "churros", "pangocciol", "monoporzione"])) {
    return truckLegendAccentColors.dolci;
  }

  if (category === "pesce" || hasOneOf(searchable, ["pesce", "calamari", "polp", "mare", "frittura"])) {
    return truckLegendAccentColors.pesce;
  }

  if (["forno", "fritti", "pizza"].includes(category) || hasOneOf(searchable, ["fritt", "forno", "pizza", "focaccia", "arancin", "corn dog", "panzerott"])) {
    return truckLegendAccentColors.frittiForno;
  }

  if (["carne", "bbq", "brace"].includes(category) || hasOneOf(searchable, ["carne", "hamburger", "asado", "pulled", "brisket", "salsiccia", "costolette", "alette", "arrosticini", "pecora", "bistecca"])) {
    return truckLegendAccentColors.carne;
  }

  return truckLegendAccentColors.carne;
}

function hasOneOf(value, fragments) {
  return fragments.some((fragment) => value.includes(fragment));
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
  staffVoteTabs.hidden = true;
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
      <div class="vote-count">Media ${formatVoteScore(row.avgScore)} · ${row.count} voti</div>
    `;
    leaderboardList.append(item);
  });
}

function renderStaffVotes() {
  if (!staffVoteTabs || !staffVoteLeaderboard || !staffVoteDetailList || !staffVoteDetailTitle || !staffVoteDetailLabel) return;
  staffVoteLeaderboard.innerHTML = "";
  const awardGrid = document.createElement("div");
  awardGrid.className = "staff-vote-awards-grid";

  voteCategories.forEach((category) => {
    const rows = getLeaderboard(category.value);
    const winner = rows[0] || null;
    const runnerUp = rows[1] || null;
    const totalVotes = rows.reduce((sum, row) => sum + row.count, 0);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "staff-vote-award-card";
    if (activeStaffVoteCategory === category.value) {
      card.classList.add("is-active");
    }
    card.addEventListener("click", () => {
      activeStaffVoteCategory = category.value;
      showAllStaffVoteRows = false;
      renderStaffVotes();
    });

    card.innerHTML = `
      <span class="staff-vote-award-label">${escapeHtml(category.label)}</span>
      <strong>${escapeHtml(winner?.truck?.name || "Nessun voto")}</strong>
      <span class="staff-vote-award-meta">${winner ? `${escapeHtml(winner.truck.code)} - ${escapeHtml(categoryLabels[winner.truck.category] || winner.truck.category)}` : "In attesa di voti"}</span>
      <div class="staff-vote-award-count">
        <span>Media</span>
        <b>${winner ? formatVoteScore(winner.avgScore) : "0,0/5"}</b>
      </div>
      <div class="staff-vote-award-foot">
        <span>${runnerUp ? `Secondo: ${escapeHtml(runnerUp.truck.name)} (${formatVoteScore(runnerUp.avgScore)})` : "Secondo non disponibile"}</span>
        <em>${totalVotes} voti totali</em>
      </div>
    `;

    awardGrid.append(card);
  });

  staffVoteLeaderboard.append(awardGrid);

  const activeCategory = voteCategories.find((category) => category.value === activeStaffVoteCategory) || voteCategories[0];
  const detailRows = getLeaderboard(activeCategory.value);
  const visibleRows = showAllStaffVoteRows ? detailRows : detailRows.slice(0, 5);

  staffVoteDetailLabel.textContent = activeCategory.label;
  staffVoteDetailTitle.textContent = `Voti ${activeCategory.label}`;
  staffVoteDetailList.innerHTML = "";

  if (!detailRows.length) {
    staffVoteDetailList.innerHTML = `<div class="empty-state visible">Nessun voto registrato per questa categoria.</div>`;
  } else {
    visibleRows.forEach((row, index) => {
      const item = document.createElement("div");
      item.className = "staff-vote-detail-row";
        item.innerHTML = `
          <div class="leaderboard-rank">${index + 1}</div>
          <div class="staff-vote-detail-main">
            <strong>${escapeHtml(row.truck.name)}</strong>
            <span>${escapeHtml(row.truck.code)} - ${escapeHtml(categoryLabels[row.truck.category] || row.truck.category)} - ${escapeHtml(row.truck.zone)}</span>
          </div>
          <div class="vote-count">${formatVoteScore(row.avgScore)} · ${row.count} voti</div>
        `;
        staffVoteDetailList.append(item);
      });
  }

  if (staffVoteMoreWrap) {
    staffVoteMoreWrap.hidden = detailRows.length <= 5 || showAllStaffVoteRows;
  }
}

function renderPrizeEntries() {
  if (!prizeEntriesTable || !emptyPrizeEntries || !prizeSummary) return;

  const profiles = getVoterProfiles();
  prizeEntriesTable.innerHTML = "";
  emptyPrizeEntries.classList.toggle("visible", profiles.length === 0);
  if (prizeEntriesCount) {
    prizeEntriesCount.textContent = String(profiles.length);
  }
  renderPrizeSummary(profiles);
  if (!profiles.length) {
    resetPrizeWinnerCard();
  }

  renderPrizeWinnerCard(profiles);

  profiles.forEach((profile) => {
    const profileDetails = [
      getContestGenderLabel(profile.gender),
      getContestAgeLabel(profile.ageRange),
      getContestDistanceLabel(profile.distance),
    ]
      .filter((value) => value && value !== "-")
      .join(" · ");

    const activityDetails = [
      `${profile.voteCount} voti`,
      `${profile.truckNames.length} stand`,
      formatDateTime(profile.lastVoteAt),
    ].join(" · ");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Contatto">
        <div class="customer-cell">
          <strong>${escapeHtml(profile.email || "email non disponibile")}</strong>
          <span>${escapeHtml(profile.truckNames.slice(0, 2).join(" · ") || "Nessuno stand associato")}</span>
        </div>
      </td>
      <td data-label="Profilo">
        <div class="customer-cell compact">
          <span>${escapeHtml(profileDetails || "Solo email raccolta")}</span>
        </div>
      </td>
      <td data-label="Attivita">${escapeHtml(activityDetails)}</td>
    `;
    prizeEntriesTable.append(row);
  });
}

function renderPrizeSummary(profiles) {
  if (!prizeSummary) return;

  if (!profiles.length) {
    prizeSummary.innerHTML = `<div class="empty-state visible">Nessun dato utile di profilazione disponibile.</div>`;
    return;
  }

  const contactableProfiles = profiles.filter((profile) => profile.email);
  const completedProfiles = profiles.filter((profile) => profile.gender && profile.ageRange && profile.distance);
  const distanceStats = getTopCountLabel(profiles.map((profile) => getContestDistanceLabel(profile.distance)).filter((value) => value !== "-"));
  const ageStats = getTopCountLabel(profiles.map((profile) => getContestAgeLabel(profile.ageRange)).filter((value) => value !== "-"));
  const lastProfile = profiles[0];

  const summaryRows = [
    { label: "Profili unici", value: String(profiles.length) },
    { label: "Email contattabili", value: String(contactableProfiles.length) },
    { label: "Profili completi", value: String(completedProfiles.length) },
    { label: "Ultimo voto", value: lastProfile ? formatDateTime(lastProfile.lastVoteAt) : "Nessun dato" },
    { label: "Provenienza top", value: distanceStats ? `${distanceStats.label} (${distanceStats.count})` : "Nessun dato" },
    { label: "Fascia eta top", value: ageStats ? `${ageStats.label} (${ageStats.count})` : "Nessun dato" },
  ];

    prizeSummary.innerHTML = `
      <div class="prize-summary-grid">
        ${summaryRows
          .map(
            (row) => `
              <article class="prize-summary-card">
                <span>${escapeHtml(row.label)}</span>
                <strong>${escapeHtml(row.value)}</strong>
              </article>
            `,
          )
          .join("")}
      </div>
    `;
}

function renderPrizeWinnerCard(profiles) {
  const profile = profiles[0];

  if (!profile) {
    resetPrizeWinnerCard();
    return;
  }

  if (prizeWinnerName) {
    prizeWinnerName.textContent = profile.email || "email non disponibile";
  }

  if (prizeWinnerMeta) {
    const details = [
      getContestGenderLabel(profile.gender),
      getContestAgeLabel(profile.ageRange),
      getContestDistanceLabel(profile.distance),
      `${profile.voteCount} voti`,
    ].filter((value) => value && value !== "-");
    prizeWinnerMeta.textContent = details.join(" · ");
  }
}

function resetPrizeWinnerCard() {
  if (prizeWinnerName) {
    prizeWinnerName.textContent = "Nessun profilo disponibile";
  }

  if (prizeWinnerMeta) {
    prizeWinnerMeta.textContent = "";
  }

  document.querySelector("#prizeWinnerCard")?.classList.remove("is-highlighted");
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
  const query = truckSearchInput ? truckSearchInput.value.trim().toLowerCase() : "";
  const category = categoryFilter ? categoryFilter.value : "all";

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
        totalScore: row.totalScore,
        avgScore: row.avgScore,
      }))
      .filter((row) => row.truck)
      .sort((a, b) => b.avgScore - a.avgScore || b.count - a.count || a.truck.name.localeCompare(b.truck.name));
  }

  return getLeaderboardFromVotes(category);
}

function getLeaderboardFromVotes(category) {
  const counts = votes
    .filter((vote) => !category || vote.category === category)
    .reduce((acc, vote) => {
      const key = `${vote.category}::${vote.truckId}`;
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          totalScore: 0,
        };
      }
      acc[key].count += 1;
      acc[key].totalScore += Number(vote.score) || 0;
      return acc;
    }, {});

  return Object.entries(counts)
    .map(([key, stats]) => {
        const [voteCategory, truckId] = key.split("::");
        return {
          category: voteCategory,
          truckId,
          truck: trucks.find((truck) => truck.id === truckId),
          count: stats.count,
          totalScore: stats.totalScore,
          avgScore: stats.count ? stats.totalScore / stats.count : 0,
        };
      })
      .filter((row) => row.truck)
      .sort((a, b) => b.avgScore - a.avgScore || b.count - a.count || a.truck.name.localeCompare(b.truck.name));
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

  const remoteDeleted = await deleteTruckRemote(id);
  if (!remoteDeleted) {
    showToast("Stand non eliminato: Supabase non raggiungibile.");
    return;
  }

  trucks = trucks.filter((item) => item.id !== id);
  votes = votes.filter((vote) => vote.truckId !== id);
  selectedTruckId = trucks[0]?.id || "";
  saveTrucks();
  saveVotes();
  resetTruckForm();
  render();
  showToast("Stand eliminato e sincronizzato.");
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

  if (!email || !password) {
    showToast("Inserisci email e password staff.");
    setStaffAuthStatus("Sessione staff non attiva.");
    return;
  }

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
  adminLoginForm.reset();
  renderAdminAccess();
  await refreshTrucksFromRemote();
  await refreshReservationsFromRemote();
  await refreshVotesFromRemote();
  await refreshReviewsFromRemote();
  await refreshAnalyticsFromRemote();
  await refreshMomentsFromRemote();
  subscribeToTruckChanges();
  subscribeToReservationChanges();
  subscribeToVoteChanges();
  subscribeToReviewChanges();
  subscribeToAnalyticsChanges();
  subscribeToMomentChanges();
  showToast("Accesso staff effettuato.");
}

async function handleAdminLogout() {
  if (supabaseClient?.auth && staffSession) {
    await supabaseClient.auth.signOut();
  }

  staffSession = null;
  refreshVoteLeaderboardFromRemote();
  moments = [];
  visibleMomentsCount = ADMIN_MOMENTS_PAGE_SIZE;
  renderMomentsAdmin();
  renderAdminAccess();
  showToast("Sessione admin chiusa.");
}

function renderAdminAccess() {
  if (!adminLoginPanel || !staffWorkspace) return;

  const unlocked = isAdminAuthenticated();
  adminLoginPanel.hidden = unlocked;
  staffWorkspace.hidden = !unlocked;
  if (adminLogoutButton) {
    adminLogoutButton.hidden = !unlocked;
  }
  if (copyReportButton) {
    copyReportButton.disabled = !unlocked;
  }
  if (exportCsvButton) {
    exportCsvButton.disabled = !unlocked;
  }
  if (clearVotesButton) {
    clearVotesButton.disabled = !unlocked;
  }
  if (communicationForm) {
    const submitButton = communicationForm.querySelector("button[type='submit']");
    if (submitButton) {
      submitButton.disabled = !unlocked;
    }
  }
  updateNotificationPermissionUi();

  if (staffSession) {
    setStaffAuthStatus(`Sessione Supabase attiva: ${staffSession.user?.email || "staff"}.`);
  } else {
    setStaffAuthStatus("Sessione staff non attiva.");
  }
}

async function handleCommunicationSubmit(event) {
  event.preventDefault();

  if (!staffSession?.access_token) {
    showToast("Accedi come staff per inviare comunicazioni.");
    setCommunicationStatus("Sessione staff richiesta.");
    return;
  }

  const formData = new FormData(communicationForm);
  const title = cleanText(formData.get("title")).slice(0, 80);
  const message = cleanText(formData.get("message")).slice(0, 240);
  const targetUrl = String(formData.get("targetUrl") || "/index.html");

  if (!message) {
    showToast("Scrivi il testo della comunicazione.");
    setCommunicationStatus("Messaggio mancante.");
    return;
  }

  setCommunicationStatus("Invio in corso...");

  try {
    const response = await fetch(PUSH_BROADCAST_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${staffSession.access_token}`,
      },
      body: JSON.stringify({
        title: title || "Aggiornamento CSSF",
        message,
        targetUrl,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || "Invio comunicazione non riuscito.");
    }

    communicationForm.reset();
    if (communicationForm.elements.targetUrl) {
      communicationForm.elements.targetUrl.value = "/index.html";
    }
    setCommunicationStatus(`Comunicazione inviata a ${payload?.sent || 0} dispositivi.`);
    showToast(`Comunicazione inviata a ${payload?.sent || 0} dispositivi.`);
  } catch (error) {
    setCommunicationStatus(error?.message || "Invio comunicazione non riuscito.");
    showToast(error?.message || "Invio comunicazione non riuscito.");
  }
}

function setCommunicationStatus(message) {
  if (communicationStatus) {
    communicationStatus.textContent = message;
  }
}

function isAdminAuthenticated() {
  return Boolean(staffSession);
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
    consentBanner.hidden = Boolean(consent) || getPersistentPreference(PRIVACY_BANNER_SEEN_KEY) === "yes";
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
  setPersistentPreference(ANALYTICS_CONSENT_KEY, value);
  dismissConsentBannerPermanently();

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
  const value = getPersistentPreference(ANALYTICS_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : "";
}

function resetPrivacyPreferences() {
  removePersistentPreference(ANALYTICS_CONSENT_KEY);
  removePersistentPreference(PRIVACY_BANNER_SEEN_KEY);
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
  saveAnalyticsEventRemote(event);
  renderAnalyticsDashboard();
}

function renderAnalyticsDashboard() {
  if (!document.querySelector("#durationTrendChart") && !document.querySelector("#clickStatsList")) return;

  const sessions = new Set(analyticsEvents.map((event) => event.sessionId));
  const clicks = analyticsEvents.filter((event) => event.type === "click");
  const sectionViews = analyticsEvents.filter((event) => event.type === "section_view");
  const sectionStats = getTopStats(sectionViews, "label");
  const clickSectionStats = getTopStats(clicks, "section");
  const durationStats = getSessionDurationStats();
  setTextContent("#metricAvgDuration", formatDuration(durationStats.averageMs));
  setTextContent("#metricSessions", String(sessions.size));
  setTextContent("#metricSectionViews", String(sectionViews.length));
  setTextContent("#metricClicks", String(clicks.length));
  renderEventMix(sectionStats);
  renderDurationTrendChart(durationStats.rows);
  renderColumnChart("#sectionBarChart", sectionStats, "Nessuna sezione visitata.");

  renderStatsList(
    "#sectionStatsList",
    sectionStats,
    "Nessuna sezione tracciata.",
  );
  renderClickStatsList("#clickStatsList", clickSectionStats, "Nessun click tracciato.");
  renderAnalyticsSummary(sectionStats, clickSectionStats, durationStats, sessions.size, sectionViews.length, clicks.length);
  renderDatabaseHealthEstimate();
}

function renderDatabaseHealthEstimate() {
  const element = document.querySelector("#databaseHealthPanel");
  if (!element) return;

  const estimate = getDatabaseHealthEstimate();
  element.innerHTML = `
    <div class="db-health-header">
      <div>
        <span class="db-health-label">Carico stimato</span>
        <strong>${estimate.percentage}%</strong>
      </div>
      <span class="db-health-badge ${estimate.tone}">${escapeHtml(estimate.label)}</span>
    </div>
    <div class="stats-bar db-health-bar" aria-hidden="true"><i style="width: ${estimate.percentage}%"></i></div>
    <div class="db-health-meta">${escapeHtml(estimate.description)}</div>
    <div class="stats-list">
      ${estimate.rows
        .map(
          (row) => `
            <div class="stats-row">
              <div class="stats-row-main">
                <strong>${escapeHtml(row.label)}</strong>
                <span>${escapeHtml(String(row.value))}</span>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function getDatabaseHealthEstimate() {
  const recentWindowMs = 15 * 60 * 1000;
  const now = Date.now();
  const isRecent = (value) => {
    if (!value) return false;
    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) && now - timestamp <= recentWindowMs;
  };

  const recentAnalyticsCount = analyticsEvents.filter((event) => isRecent(event.createdAt)).length;
  const recentReservationsCount = reservations.filter((reservation) => isRecent(reservation.createdAt)).length;
  const recentReviewsCount = reviews.filter((review) => isRecent(review.createdAt)).length;
  const recentMomentsCount = moments.filter((moment) => isRecent(moment.createdAt)).length;
  const pendingReservationsCount = reservations.filter((reservation) =>
    reservation.status === "pending" || reservation.status === "waiting"
  ).length;
  const pendingMomentsCount = moments.filter((moment) => moment.status === "pending").length;

  const weightedLoad =
    recentAnalyticsCount * 1 +
    recentReservationsCount * 8 +
    recentReviewsCount * 5 +
    recentMomentsCount * 6 +
    pendingReservationsCount * 1 +
    pendingMomentsCount * 2;
  const percentage = Math.max(0, Math.min(100, Math.round((weightedLoad / 120) * 100)));

  let label = "Bassa";
  let tone = "low";
  if (percentage >= 85) {
    label = "Critica";
    tone = "critical";
  } else if (percentage >= 65) {
    label = "Alta";
    tone = "high";
  } else if (percentage >= 40) {
    label = "Attenzione";
    tone = "medium";
  }

  const drivers = [
    { label: "Eventi analytics", value: recentAnalyticsCount },
    { label: "Nuove prenotazioni", value: recentReservationsCount },
    { label: "Nuove recensioni", value: recentReviewsCount },
    { label: "Nuovi moments", value: recentMomentsCount },
  ].sort((left, right) => right.value - left.value);
  const topDriver = drivers[0];
  const description =
    topDriver && topDriver.value > 0
      ? `Picco guidato da ${topDriver.label.toLowerCase()} negli ultimi 15 minuti.`
      : "Nessun picco recente rilevato negli ultimi 15 minuti.";

  return {
    percentage,
    label,
    tone,
    description,
    rows: [
      { label: "Scritture stimate ultimi 15 min", value: weightedLoad },
      { label: "Analytics ultimi 15 min", value: recentAnalyticsCount },
      { label: "Prenotazioni pendenti/in attesa", value: pendingReservationsCount },
      { label: "Moments in revisione", value: pendingMomentsCount },
    ],
  };
}

function renderAnalyticsSummary(sectionStats, clickSectionStats, durationStats, sessionCount, sectionViewCount, clickCount) {
  const element = document.querySelector("#analyticsSummary");
  if (!element) return;

  const topSection = sectionStats[0];
  const topClick = clickSectionStats[0];
  const longestSession = durationStats.rows[0];

  const summaryRows = [
    {
      label: "Sezione guida",
      value: topSection ? `${topSection.label} (${topSection.count})` : "Nessun dato",
    },
    {
      label: "Click piu forte",
      value: topClick ? `${topClick.label} (${topClick.count})` : "Nessun dato",
    },
    {
      label: "Sessione piu lunga",
      value: longestSession ? formatDuration(longestSession.durationMs) : "Non misurabile",
    },
    {
      label: "Rapporto click/visite",
      value: sectionViewCount ? `${Math.round((clickCount / sectionViewCount) * 100)}%` : "0%",
    },
    {
      label: "Media eventi per sessione",
      value: sessionCount ? `${Math.max(1, Math.round(analyticsEvents.length / sessionCount))}` : "0",
    },
  ];

  element.innerHTML = `
    <div class="stats-list">
      ${summaryRows
        .map(
          (row) => `
            <div class="stats-row">
              <div class="stats-row-main">
                <strong>${escapeHtml(row.label)}</strong>
                <span>${escapeHtml(String(row.value))}</span>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
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
    element.classList.remove("single-point");
    element.innerHTML = `<div class="empty-state visible">Permanenza non ancora misurabile.</div>`;
    return;
  }

  const width = 820;
  const height = 360;
  const plotLeft = 54;
  const plotRight = width - 12;
  const chartTop = 18;
  const chartBottom = 290;
  const peakRow = chartRows.reduce((best, row) => (row.durationMs > best.durationMs ? row : best), chartRows[0]);
  const max = Math.max(...chartRows.map((row) => row.durationMs), 1);
  const averageMs = chartRows.length
    ? Math.round(chartRows.reduce((sum, row) => sum + row.durationMs, 0) / chartRows.length)
    : 0;
  const isSinglePoint = chartRows.length === 1;
  const points = chartRows.map((row, index) => {
    const x =
      isSinglePoint
        ? (plotLeft + plotRight) / 2
        : plotLeft + (index / (chartRows.length - 1)) * (plotRight - plotLeft);
    const y = chartBottom - (row.durationMs / max) * (chartBottom - chartTop);
    return { x, y, row };
  });
  const guides = [1, 0.66, 0.33, 0].map((ratio) => {
    const value = Math.round(max * ratio);
    const y = chartBottom - (value / max) * (chartBottom - chartTop);
    return { value, y, label: formatDuration(value) };
  });
  const pointList = points.map((point) => `${point.x},${point.y}`).join(" ");
  const areaList = isSinglePoint
    ? `${plotLeft},${chartBottom} ${plotLeft},${points[0].y} ${plotRight},${points[0].y} ${plotRight},${chartBottom}`
    : `${plotLeft},${chartBottom} ${pointList} ${plotRight},${chartBottom}`;
  const lineMarkup = isSinglePoint
    ? `<line x1="${plotLeft}" y1="${points[0].y}" x2="${plotRight}" y2="${points[0].y}" class="line-chart-line"></line>`
    : `<polyline points="${pointList}" class="line-chart-line"></polyline>`;

  element.classList.toggle("single-point", isSinglePoint);

  element.innerHTML = `
    <div class="line-chart-summary">
      <article class="line-chart-summary-item">
        <small>Picco</small>
        <strong>${escapeHtml(formatTimeLabel(peakRow.first))}</strong>
        <span>${escapeHtml(formatDuration(peakRow.durationMs))}</span>
      </article>
      <article class="line-chart-summary-item">
        <small>Permanenza media</small>
        <strong>${escapeHtml(formatDuration(averageMs))}</strong>
        <span>${chartRows.length} sessioni rilevate</span>
      </article>
    </div>
    <svg class="line-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Andamento permanenza sessioni per orario">
        ${guides
          .map(
            (guide) => `
              <line x1="${plotLeft}" y1="${guide.y}" x2="${plotRight}" y2="${guide.y}" class="line-chart-guide"></line>
              <text x="0" y="${guide.y + 4}" class="line-chart-guide-label">${escapeHtml(guide.label)}</text>
            `,
          )
          .join("")}
        <polygon points="${areaList}" class="line-chart-area"></polygon>
        ${lineMarkup}
      ${points
        .map(
          (point) =>
            `<circle cx="${point.x}" cy="${point.y}" r="4"><title>${escapeHtml(formatTimeLabel(point.row.first))} - ${formatDuration(point.row.durationMs)}</title></circle>`,
        )
        .join("")}
    </svg>
    <div class="chart-x-labels" style="grid-template-columns: repeat(${chartRows.length}, minmax(0, 1fr));">
        ${chartRows
          .map(
            (row) => `<span title="${escapeHtml(new Date(row.first).toLocaleString("it-IT"))}">${escapeHtml(formatTimeLabel(row.first))}</span>`,
          )
        .join("")}
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
  if (!element) return;
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

function renderClickStatsList(selector, rows, emptyText) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.innerHTML = "";

  if (!rows.length) {
    element.innerHTML = `<div class="empty-state visible">${emptyText}</div>`;
    return;
  }

  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const max = Math.max(...rows.map((row) => row.count), 1);

  rows.slice(0, 6).forEach((row, index) => {
    const percentage = Math.max(8, Math.round((row.count / max) * 100));
    const share = total ? Math.round((row.count / total) * 100) : 0;
    const item = document.createElement("article");
    item.className = "click-stat-card";
    item.innerHTML = `
      <div class="click-stat-rank">${String(index + 1).padStart(2, "0")}</div>
      <div class="click-stat-body">
        <div class="click-stat-topline">
          <strong title="${escapeHtml(row.label)}">${escapeHtml(row.label)}</strong>
          <span>${row.count}</span>
        </div>
        <div class="stats-bar" aria-hidden="true"><i style="width: ${percentage}%"></i></div>
        <small>${share}% del totale click</small>
      </div>
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

function formatTimeLabel(timestamp) {
  return new Date(timestamp).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
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

function exportPrizeEntriesCsv() {
  const profiles = getVoterProfiles();

  if (!profiles.length) {
    showToast("Nessun contatto da esportare.");
    return;
  }

  const headers = ["email", "sesso", "eta", "provenienza", "voti_totali", "stand_votati", "categorie_votate", "ultimo_voto"];
  const rows = profiles.map((profile) => {
    return [
      profile.email || "",
      getContestGenderLabel(profile.gender),
      getContestAgeLabel(profile.ageRange),
      getContestDistanceLabel(profile.distance),
      String(profile.voteCount),
      profile.truckNames.join(" | "),
      profile.categories.map(getVoteCategoryLabel).join(" | "),
      formatDateTime(profile.lastVoteAt),
    ];
  });

  const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cssf-profili-votanti-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Contatti esportati.");
}

async function clearAnalyticsEvents() {
  const confirmed = window.confirm("Svuotare tutti gli eventi analytics salvati su Supabase?");
  if (!confirmed) return;

  if (!supabaseClient || !staffSession) {
    showToast("Accedi con Supabase per svuotare gli analytics.");
    return;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_ANALYTICS_TABLE).delete().neq("id", "");
    if (error) {
      showToast(`Supabase non ha cancellato gli analytics: ${error.message || "policy non valida"}.`);
      return;
    }
  } catch {
    showToast("Supabase non raggiungibile: analytics non cancellati.");
    return;
  }

  analyticsEvents = [];
  saveAnalyticsEvents();
  trackedSections = new Set();
  sessionStorage.removeItem("cssf-tracked-sections");
  renderAnalyticsDashboard();
  showToast("Analytics svuotati.");
}

async function clearReviewsRemote() {
  const confirmed = window.confirm("Azzera tutti i feedback raccolti? Usa questa azione solo se vuoi cancellare tutte le recensioni.");
  if (!confirmed) return;

  if (!supabaseClient || !staffSession) {
    showToast("Accedi con Supabase per azzerare i feedback.");
    return;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_REVIEWS_TABLE).delete().neq("id", "");
    if (error) {
      showToast(`Supabase non ha cancellato i feedback: ${error.message || "policy non valida"}.`);
      return;
    }

    reviews = [];
    visiblePublicReviewsCount = REVIEW_FEED_BATCH_SIZE;
    visibleAdminReviewsCount = REVIEW_FEED_BATCH_SIZE;
    saveReviews();
    renderReviews();
    await refreshReviewsFromRemote();
    showToast("Feedback azzerati.");
  } catch {
    showToast("Supabase non raggiungibile: feedback non cancellati.");
  }
}

async function clearVotesRemote() {
  const confirmed = window.confirm("Svuotare tutti i voti registrati? Usa questa azione solo per cancellare test.");
  if (!confirmed) return;

  if (!supabaseClient || !staffSession) {
    showToast("Accedi con Supabase per svuotare i voti.");
    return;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_VOTES_TABLE).delete().neq("id", "");
    if (error) {
      showToast(`Supabase non ha cancellato i voti: ${error.message || "policy non valida"}.`);
      return;
    }

    votes = [];
    voteLeaderboardRows = [];
    remoteVoteLeaderboardSynced = false;
    saveVotes();
    render();
    await refreshVotesFromRemote();
    showToast("Voti svuotati.");
  } catch {
    showToast("Supabase non raggiungibile: voti non cancellati.");
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

function setTextContent(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function updateMetrics() {
  const metricBookings = document.querySelector("#metricBookings");
  const metricTrucks = document.querySelector("#metricTrucks");
  const metricVotes = document.querySelector("#metricVotes");
  const metricPrizeEntries = document.querySelector("#metricPrizeEntries");

  if (!metricBookings && !metricTrucks && !metricVotes && !metricPrizeEntries) {
    return;
  }

  const active = reservations.filter((item) => item.status !== "cancelled");

  if (metricBookings) metricBookings.textContent = String(active.length);
  if (metricTrucks) metricTrucks.textContent = String(trucks.length);
  if (metricVotes) metricVotes.textContent = String(getVoteTotal());
  if (metricPrizeEntries) metricPrizeEntries.textContent = String(getVoterProfiles().length);
}

function getVoteTotal() {
  if (remoteVoteLeaderboardSynced && voteLeaderboardRows.length) {
    return voteLeaderboardRows.reduce((sum, row) => sum + Number(row.count || 0), 0);
  }
  if (votes.length) return votes.length;
  return voteLeaderboardRows.reduce((sum, row) => sum + Number(row.count || 0), 0);
}

function getVoterProfiles() {
  const groupedProfiles = votes.reduce((acc, vote) => {
    const email = cleanText(vote.email || "").toLowerCase();
    const key = email || `vote:${vote.id}`;
    const truck = trucks.find((item) => item.id === vote.truckId);

    if (!acc[key]) {
      acc[key] = {
        email,
        gender: vote.gender || "",
        ageRange: vote.ageRange || "",
        distance: vote.distance || "",
        voteCount: 0,
        categories: [],
        truckIds: [],
        truckNames: [],
        lastVoteAt: vote.createdAt || new Date().toISOString(),
      };
    }

    acc[key].voteCount += 1;
    if (!acc[key].categories.includes(vote.category)) {
      acc[key].categories.push(vote.category);
    }
    if (vote.truckId && !acc[key].truckIds.includes(vote.truckId)) {
      acc[key].truckIds.push(vote.truckId);
      acc[key].truckNames.push(truck?.name || vote.truckId);
    }

    if (!acc[key].gender && vote.gender) acc[key].gender = vote.gender;
    if (!acc[key].ageRange && vote.ageRange) acc[key].ageRange = vote.ageRange;
    if (!acc[key].distance && vote.distance) acc[key].distance = vote.distance;

    if (new Date(vote.createdAt).getTime() > new Date(acc[key].lastVoteAt).getTime()) {
      acc[key].lastVoteAt = vote.createdAt;
      acc[key].email = email || acc[key].email;
      if (vote.gender) acc[key].gender = vote.gender;
      if (vote.ageRange) acc[key].ageRange = vote.ageRange;
      if (vote.distance) acc[key].distance = vote.distance;
    }

    return acc;
  }, {});

  return Object.values(groupedProfiles).sort((a, b) => new Date(b.lastVoteAt).getTime() - new Date(a.lastVoteAt).getTime());
}

function getTopCountLabel(values) {
  const counts = values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "it"))[0];
}

function getContestGenderLabel(value) {
  return getReviewLabel("gender", value) || "-";
}

function getContestAgeLabel(value) {
  return getReviewLabel("ageRange", value) || "-";
}

function getContestDistanceLabel(value) {
  return contestDistanceLabels[value] || "-";
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
  if (!reservationsTable || !emptyState) return;

  const filtered = getFilteredReservations();
  reservationsTable.innerHTML = "";
  emptyState.classList.toggle("visible", filtered.length === 0);
  updateBookingQuickViewSummary();

  filtered.forEach((reservation) => {
    const row = document.createElement("tr");
    row.dataset.status = reservation.status;
    row.dataset.priority = getReservationPriority(reservation);
    const dayCell = document.createElement("td");
    const customerCell = document.createElement("td");
    const guestsCell = document.createElement("td");
    const tablesCell = document.createElement("td");
    const statusCell = document.createElement("td");
    const actionsCell = document.createElement("td");

    dayCell.className = "reservation-day-cell";
    customerCell.className = "reservation-customer-cell";
    guestsCell.className = "reservation-guests-cell";
    tablesCell.className = "reservation-tables-cell";
    statusCell.className = "reservation-status-cell";
    actionsCell.className = "reservation-actions-cell";
    dayCell.dataset.label = "Giorno";
    customerCell.dataset.label = "Cliente";
    guestsCell.dataset.label = "Persone";
    tablesCell.dataset.label = "Tavoli";
    statusCell.dataset.label = "Stato";
    actionsCell.dataset.label = "Azioni";
    const infoTags = [
      reservation.area ? `Area: ${reservation.area}` : "",
      reservation.arrival ? `Arrivo: ${reservation.arrival}` : "",
    ]
      .filter(Boolean)
      .map((item) => `<span class="customer-tag">${escapeHtml(item)}</span>`)
      .join("");
    const noteMarkup = reservation.notes
        ? `<span class="note-line">${escapeHtml(reservation.notes)}</span>`
        : "";

    dayCell.innerHTML = `<div class="day-cell">${escapeHtml(formatReservationDayShort(reservation.day))}</div>`;
    customerCell.innerHTML = `
        <div class="customer-cell">
          <div class="customer-inline-row">
            <strong>${escapeHtml(reservation.name)}</strong>
            <span class="customer-inline-meta">
              / ${escapeHtml(reservation.phone || "-")}
              ${reservation.email ? ` / ${escapeHtml(reservation.email)}` : ""}
            </span>
          </div>
          ${infoTags ? `<div class="customer-tags">${infoTags}</div>` : ""}
          ${noteMarkup}
        </div>
      `;
    guestsCell.textContent = String(reservation.guests);
    tablesCell.textContent = formatReservationTablesShort(reservation.tables);
    statusCell.append(createStatusSelect(reservation));
    actionsCell.append(createActions(reservation));
    row.append(dayCell, customerCell, guestsCell, tablesCell, statusCell, actionsCell);

    reservationsTable.append(row);
  });
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getBookingFocusDay() {
  const today = getLocalDateKey();
  if (eventDays.some((item) => item.value === today)) return today;
  const upcoming = eventDays.find((item) => item.value >= today);
  return upcoming?.value || eventDays[0]?.value || "all";
}

function inferActiveBookingView() {
  const focusDay = getBookingFocusDay();
  if (statusFilter?.value === "pending" && dayFilter?.value === "all") return "pending";
  if (statusFilter?.value === "all" && dayFilter?.value === focusDay) return "today";
  if (statusFilter?.value === "all" && dayFilter?.value === "all") return "all";
  return "custom";
}

function applyBookingQuickView(view) {
  if (!dayFilter || !statusFilter) return;

  const focusDay = getBookingFocusDay();
  if (view === "pending") {
    statusFilter.value = "pending";
    dayFilter.value = "all";
  } else if (view === "today") {
    statusFilter.value = "all";
    dayFilter.value = focusDay;
  } else {
    statusFilter.value = "all";
    dayFilter.value = "all";
  }

  activeBookingView = view;
  renderReservations();
}

function handleBookingQuickViewClick(event) {
  const button = event.target.closest("[data-booking-view]");
  if (!button) return;
  applyBookingQuickView(button.dataset.bookingView || "all");
}

function handleLoadMoreMoments() {
  loadMoreMomentsFromRemote().catch(() => {
    showToast("Altre foto non disponibili al momento.");
  });
}

function toggleBookingSearchPanel() {
  if (!bookingSearchPanel || !bookingSearchToggle) return;
  const shouldOpen = bookingSearchPanel.hidden;
  bookingSearchPanel.hidden = !shouldOpen;
  bookingSearchToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  bookingSearchToggle.classList.toggle("is-active", shouldOpen);
  if (shouldOpen) {
    searchInput?.focus();
  }
}

function updateBookingQuickViewSummary() {
  const focusDay = getBookingFocusDay();
  const activeReservations = reservations.filter((item) => item.status !== "cancelled");
  const pendingReservations = reservations.filter((item) => item.status === "pending");
  const todayReservations = activeReservations.filter((item) => item.day === focusDay);

  if (bookingPendingCount) bookingPendingCount.textContent = String(pendingReservations.length);
  if (bookingTodayCount) bookingTodayCount.textContent = String(todayReservations.length);
  if (bookingAllCount) bookingAllCount.textContent = String(activeReservations.length);
  if (bookingTodayLabel) bookingTodayLabel.textContent = getDayLabel(focusDay, true);

  const currentView = inferActiveBookingView();
  activeBookingView = currentView;

  bookingQuickViews?.querySelectorAll("[data-booking-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.bookingView === activeBookingView);
  });
}

function renderReviews() {
  renderReviewSummaryPanels();
  renderReviewFeed(reviewsList, emptyReviews);
  renderReviewFeed(adminReviewsList, adminEmptyReviews, true);
}

function ensureReviewFeedControls(container, emptyState, isCompact) {
  if (!container || !emptyState || !emptyState.parentElement) return { wrap: null, button: null };

  const feedKey = isCompact ? "admin" : "public";
  let wrap = emptyState.parentElement.querySelector(`[data-review-more-wrap="${feedKey}"]`);

  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "reviews-more-wrap";
    wrap.dataset.reviewMoreWrap = feedKey;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost-link reviews-more-button";
    button.dataset.reviewMoreButton = feedKey;
    button.addEventListener("click", () => {
      if (isCompact) {
        visibleAdminReviewsCount += REVIEW_FEED_BATCH_SIZE;
      } else {
        visiblePublicReviewsCount += REVIEW_FEED_BATCH_SIZE;
      }
      renderReviews();
    });

    wrap.append(button);
    emptyState.insertAdjacentElement("afterend", wrap);
  }

  return {
    wrap,
    button: wrap.querySelector("[data-review-more-button]"),
  };
}

function renderMomentsAdmin() {
  if (!adminMomentsGrid || !adminEmptyMoments) return;

  adminMomentsGrid.innerHTML = "";
  adminEmptyMoments.classList.toggle("visible", moments.length === 0);
  const visibleMoments = moments.slice(0, visibleMomentsCount);
  const hasMoreMoments = remoteMomentsHasMore;
  if (metricMoments) {
    metricMoments.textContent = String(remoteMomentsTotal || moments.length);
  }
  if (downloadAllMomentsButton) {
    downloadAllMomentsButton.disabled = moments.length === 0;
  }
  if (momentsLoadMoreWrap) {
    momentsLoadMoreWrap.hidden = !hasMoreMoments;
  }

  visibleMoments.forEach((moment) => {
    const card = document.createElement("article");
    card.className = "moment-card";
    card.innerHTML = `
      <div class="moment-card-image-wrap">
        <button class="moment-card-delete" type="button" aria-label="Elimina foto" data-delete-moment="${escapeHtml(moment.id)}">x</button>
        <img src="${escapeHtml(moment.imageUrl)}" alt="Foto caricata da ${escapeHtml(moment.uploaderName)}" loading="lazy" />
      </div>
      <div class="moment-card-actions">
        <div class="moment-card-meta">
          <a href="${escapeHtml(moment.imageUrl)}" target="_blank" rel="noreferrer">Apri foto</a>
          <a href="${escapeHtml(moment.imageUrl)}" download rel="noreferrer">Scarica foto</a>
        </div>
      </div>
    `;
    card.querySelector("[data-delete-moment]")?.addEventListener("click", () => {
      handleDeleteMoment(moment);
    });
    adminMomentsGrid.append(card);
  });
}

function renderReviewSummaryPanels() {
  const averageText = reviews.length ? getAverageRating().toFixed(1) : "--";
  const countText = `${reviews.length} ${reviews.length === 1 ? "recensione" : "recensioni"}`;

  if (reviewAverage) reviewAverage.textContent = averageText;
  if (reviewCount) reviewCount.textContent = countText;
  if (adminReviewAverage) adminReviewAverage.textContent = averageText;
  if (adminReviewCount) adminReviewCount.textContent = countText;

  renderReviewInsights(reviewsInsights);
  renderReviewInsights(adminReviewsInsights);
}

function setupReviewRating() {
  const control = document.querySelector(".review-star-control");
  if (!control) return;

  const labels = Array.from(control.querySelectorAll("label"));
  const inputs = Array.from(control.querySelectorAll("input[name='rating']"));
  const caption = document.querySelector("#reviewRatingCaption");
  const ratingCaptions = {
    1: "Da rivedere",
    2: "Serata sotto tono",
    3: "Buona base",
    4: "Molto riuscita",
    5: "Esperienza ottima",
  };

  const applyRatingState = (value) => {
    const numericValue = clampNumber(Number(value) || 5, 1, 5);
    labels.forEach((label) => {
      label.classList.toggle("is-active", Number(label.dataset.value) <= numericValue);
    });
    if (caption) {
      caption.textContent = ratingCaptions[numericValue] || ratingCaptions[5];
    }
  };

  labels.forEach((label) => {
    if (label.dataset.bound === "yes") return;
    label.dataset.bound = "yes";

    label.addEventListener("mouseenter", () => applyRatingState(label.dataset.value));
    label.addEventListener("click", () => applyRatingState(label.dataset.value));
  });

  if (control.dataset.bound !== "yes") {
    control.dataset.bound = "yes";
    control.addEventListener("mouseleave", () => {
      const checkedValue = control.querySelector("input[name='rating']:checked")?.value || "5";
      applyRatingState(checkedValue);
    });
  }

  inputs.forEach((input) => {
    if (input.dataset.bound === "yes") return;
    input.dataset.bound = "yes";
    input.addEventListener("change", () => applyRatingState(input.value));
  });

  const checkedValue = control.querySelector("input[name='rating']:checked")?.value || "5";
  applyRatingState(checkedValue);
}

function renderReviewInsights(container) {
  if (!container) return;

  if (!reviews.length) {
    container.innerHTML = "";
    return;
  }

  const topImprovement = getTopReviewStat("improvementArea");
  const topFavorite = getTopReviewStat("favoriteAspect");
  const topAge = getTopReviewStat("ageRange");
  const topOrigin = getTopReviewStat("originArea");

  container.innerHTML = `
    <div class="review-insight-card main">
      <span>Media stelle</span>
      <strong>${getAverageRating().toFixed(1)}</strong>
      <small>${reviews.length} risposte raccolte</small>
    </div>
    <div class="review-insight-card">
      <span>Cosa piace</span>
      <strong>${escapeHtml(topFavorite?.label || "In raccolta")}</strong>
      <small>${topFavorite ? `${topFavorite.count} risposte` : "Ancora pochi dati"}</small>
    </div>
    <div class="review-insight-card">
      <span>Da migliorare</span>
      <strong>${escapeHtml(topImprovement?.label || "In raccolta")}</strong>
      <small>${topImprovement ? `${topImprovement.count} risposte` : "Ancora pochi dati"}</small>
    </div>
    <div class="review-insight-card">
      <span>Pubblico piu' presente</span>
      <strong>${escapeHtml(topAge?.label || "In raccolta")}</strong>
      <small>${topAge ? `${topAge.count} risposte` : "Ancora pochi dati"}</small>
    </div>
    <div class="review-insight-card">
      <span>Provenienza</span>
      <strong>${escapeHtml(topOrigin?.label || "In raccolta")}</strong>
      <small>${topOrigin ? `${topOrigin.count} risposte` : "Ancora pochi dati"}</small>
    </div>
  `;
}

function renderReviewFeed(container, emptyState, isCompact = false) {
  if (!container || !emptyState) return;

  container.innerHTML = "";
  emptyState.classList.toggle("visible", reviews.length === 0);
  const visibleCount = isCompact ? visibleAdminReviewsCount : visiblePublicReviewsCount;
  const visibleReviews = reviews.slice(0, visibleCount);
  const remainingReviews = Math.max(reviews.length - visibleReviews.length, 0);
  const reviewControls = ensureReviewFeedControls(container, emptyState, isCompact);

  if (reviewControls.wrap && reviewControls.button) {
    reviewControls.wrap.hidden = reviews.length === 0 || remainingReviews === 0;
    reviewControls.button.textContent = `Mostra altro (${remainingReviews})`;
  }

  visibleReviews.forEach((review) => {
    const stars = Array.from({ length: 5 }, (_, index) =>
      `<span class="${index < review.rating ? "is-filled" : ""}">&#9733;</span>`
    ).join("");
    const tags = [
      getReviewLabel("ageRange", review.ageRange),
      getReviewLabel("gender", review.gender),
      getReviewLabel("originArea", review.originArea),
      review.favoriteAspect ? `Top: ${getReviewLabel("favoriteAspect", review.favoriteAspect)}` : "",
      review.improvementArea ? `Migliorare: ${getReviewLabel("improvementArea", review.improvementArea)}` : "",
    ].filter(Boolean);
    const card = document.createElement("article");
    card.className = `review-card${isCompact ? " review-card-compact" : ""}`;
    card.innerHTML = `
      <header>
        <div>
          <strong>${escapeHtml(review.title)}</strong>
          <div class="review-meta">${formatDate(review.createdAt)}</div>
        </div>
        <div class="review-card-rating">
          <div class="review-stars" aria-label="${review.rating} stelle">${stars}</div>
          <div class="review-rating-chip">${review.rating}/5</div>
        </div>
      </header>
      ${tags.length ? `<div class="review-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <p>${escapeHtml(review.body)}</p>
    `;
    container.append(card);
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
    const previousStatus = reservation.status;
    const nextStatus = select.value;
    reservation.status = nextStatus;
    select.disabled = true;
    const remoteSaved = await updateReservationStatusRemote(reservation);
    select.disabled = false;

    if (!remoteSaved) {
      reservation.status = previousStatus;
      select.value = previousStatus;
      select.dataset.status = previousStatus;
      showToast("Stato non aggiornato: Supabase non raggiungibile.");
      return;
    }

    select.dataset.status = select.value;
    saveReservations();
    render();
    showToast("Stato aggiornato.");
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

  if (![ANALYTICS_CONSENT_KEY, PRIVACY_BANNER_SEEN_KEY].includes(event.key)) return;

  render();
  renderReviews();
  renderAdminAccess();
}

function createActions(reservation) {
  const wrapper = document.createElement("div");
  wrapper.className = "row-actions";

  const whatsapp = document.createElement("a");
  whatsapp.className = "small-button whatsapp";
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
    const remoteDeleted = await deleteReservationRemote(reservation.id);
    if (!remoteDeleted) {
      showToast("Prenotazione non eliminata: Supabase non raggiungibile.");
      return;
    }

    reservations = reservations.filter((item) => item.id !== reservation.id);
    saveReservations();
    render();
    showToast("Prenotazione eliminata.");
  });

  wrapper.append(whatsapp, copy, remove);
  return wrapper;
}

function getFilteredReservations() {
  if (!searchInput || !dayFilter || !statusFilter) {
    return reservations;
  }

  const query = searchInput.value.trim().toLowerCase();
  return reservations
    .filter((reservation) => {
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
    })
    .slice()
    .sort((left, right) => {
      const statusWeight = {
        pending: 0,
        waiting: 1,
        confirmed: 2,
        cancelled: 3,
      };
      const leftWeight = statusWeight[left.status] ?? 99;
      const rightWeight = statusWeight[right.status] ?? 99;
      if (leftWeight !== rightWeight) return leftWeight - rightWeight;
      if (left.day !== right.day) return left.day.localeCompare(right.day);
      if (left.slot !== right.slot) return left.slot.localeCompare(right.slot);
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
}

function updateAvailabilityReadout() {
  if (!bookingForm || !availabilityReadout) return;
  availabilityReadout.textContent = `${TABLE_COUNT} tavoli disponibili da ${SEATS_PER_TABLE} posti ciascuno`;
}

function getUsedSeats(day, slot) {
  const localUsedSeats = getLocalUsedSeats(day, slot);

  if (!staffSession && remoteReservationSlotUsageSynced) {
    return Math.max(reservationSlotUsage.get(getSlotUsageKey(day, slot)) || 0, localUsedSeats);
  }

  return localUsedSeats;
}

function getLocalUsedSeats(day, slot) {
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
  const message = [
    "Gentile,",
    "",
    "grazie per aver effettuato la richiesta di prenotazione del tuo tavolo per il Cosenza Super Street Food 2026!",
    "",
    "Ti ricordiamo che la prenotazione e soggetta a un contributo di 25 €, da corrispondere direttamente all'operatore che ti accompagnera al tavolo, a copertura dei costi di gestione del servizio.",
    "",
    "Il tavolo verra mantenuto riservato per un massimo di 20 minuti oltre l'orario indicato. Trascorso tale termine, la prenotazione potrebbe decadere e il tavolo essere riassegnato.",
    "",
    "Attenzione: per prenotazioni con orario successivo alle 21:00, non sara possibile garantire il mantenimento della prenotazione oltre l'orario concordato.",
    "",
    "Ti aspettiamo al CSSF26! 🍔🍺",
  ].join("\n");

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
    showToast("Per installarla apri il sito pubblicato in HTTPS.");
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
    refreshStaffPushUi();
    return;
  }

  const serviceWorkerUrl = `service-worker.js?v=${encodeURIComponent(SERVICE_WORKER_VERSION)}`;

  serviceWorkerRegistrationPromise = navigator.serviceWorker
    .register(serviceWorkerUrl, { updateViaCache: "none" })
    .then((registration) =>
      cleanupLegacyCaches().then(() => registration),
    )
    .then(() => {
      updateInstallUi();
      refreshStaffPushUi();
      return navigator.serviceWorker.ready;
    })
    .catch(() => {
      serviceWorkerRegistrationPromise = null;
      updateInstallUi();
      refreshStaffPushUi();
      });
}

function setInstallButtonContent(label = "Installa") {
  if (!installButton) return;

  installButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m8 11 4 4 4-4" />
      <path d="M8 21h8" />
    </svg>
    <span class="install-button-label">${escapeHtml(label)}</span>
  `;
  installButton.setAttribute("aria-label", label);
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
    setInstallButtonContent("Installa");
    setInstallHint("Per installarla usa il sito pubblicato in HTTPS.");
    return;
  }

  if (isIosDevice()) {
    installButton.hidden = false;
    setInstallButtonContent("Installa");
    setInstallHint(
      isSafariBrowser()
        ? "Su iPhone e iPad apri Condividi e scegli Aggiungi a Home."
        : "Su iPhone e iPad apri il sito in Safari per installarlo.",
    );
    return;
  }

  if (deferredInstallPrompt) {
    installButton.hidden = false;
    setInstallButtonContent("Installa");
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
  return window.location.protocol === "https:";
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
  return [];
}

function saveReservations() {
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
  return [];
}

function saveReviews() {
}

function loadMoments() {
  return [];
}

function saveMoments() {
}

async function saveReviewRemote(review) {
  lastReviewRemoteError = "";

  if (!supabaseClient) {
    lastReviewRemoteError = "Client Supabase non caricato";
    return false;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_REVIEWS_TABLE).insert(mapReviewToRemote(review));
    if (error) {
      lastReviewRemoteError = error.message || "Salvataggio recensione rifiutato";
      if (/row-level security policy/i.test(lastReviewRemoteError)) {
        lastReviewRemoteError = "controlla che il testo recensione abbia almeno 10 caratteri e che i campi selezionati siano validi";
      }
      console.warn("CSSF Supabase review insert failed:", error);
      return false;
    }
    return true;
  } catch (error) {
    lastReviewRemoteError = error?.message || "Supabase non raggiungibile";
    return false;
  }
}

function mapReviewToRemote(review) {
  return {
    id: review.id,
    created_at: review.createdAt,
    reviewer: review.reviewer,
    rating: review.rating,
    age_range: review.ageRange || null,
    gender: review.gender || null,
    origin_area: review.originArea || null,
    favorite_aspect: review.favoriteAspect || null,
    improvement_area: review.improvementArea || null,
    would_return: review.wouldReturn || null,
    title: review.title,
    body: review.body,
  };
}

function mapReviewFromRemote(row) {
  return {
    id: row.id,
    createdAt: row.created_at || new Date().toISOString(),
    reviewer: row.reviewer || "Ospite",
    rating: clampNumber(Number(row.rating), 1, 5),
    ageRange: row.age_range || row.ageRange || "",
    gender: row.gender || "",
    originArea: row.origin_area || row.originArea || "",
    favoriteAspect: row.favorite_aspect || row.favoriteAspect || "",
    improvementArea: row.improvement_area || row.improvementArea || "",
    wouldReturn: row.would_return || row.wouldReturn || "",
    title: row.title || "",
    body: row.body || "",
  };
}

async function uploadMomentAsset(momentId, file) {
  lastMomentRemoteError = "";

  if (!supabaseClient?.storage) {
    lastMomentRemoteError = "Storage Supabase non disponibile.";
    return null;
  }

  const extension = getFileExtension(file);
  const path = `public/${momentId}.${extension}`;

  try {
    const { error } = await supabaseClient.storage
      .from(SUPABASE_MOMENTS_BUCKET)
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (error) {
      lastMomentRemoteError = error.message || "Upload immagine rifiutato.";
      return null;
    }

    const { data } = supabaseClient.storage.from(SUPABASE_MOMENTS_BUCKET).getPublicUrl(path);
    return {
      path,
      publicUrl: data?.publicUrl || "",
    };
  } catch (error) {
    lastMomentRemoteError = error?.message || "Upload immagine non riuscito.";
    return null;
  }
}

async function removeMomentAsset(path) {
  if (!supabaseClient?.storage || !path) return;

  try {
    await supabaseClient.storage.from(SUPABASE_MOMENTS_BUCKET).remove([path]);
  } catch {
  }
}

async function deleteMomentRemote(moment) {
  lastMomentRemoteError = "";

  if (!supabaseClient) {
    lastMomentRemoteError = "Client Supabase non caricato.";
    return false;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_MOMENTS_TABLE).delete().eq("id", moment.id);
    if (error) {
      lastMomentRemoteError = error.message || "Cancellazione foto rifiutata.";
      return false;
    }

    await removeMomentAsset(moment.imagePath);
    return true;
  } catch (error) {
    lastMomentRemoteError = error?.message || "Supabase non raggiungibile.";
    return false;
  }
}

async function saveMomentRemote(moment) {
  lastMomentRemoteError = "";

  if (!supabaseClient) {
    lastMomentRemoteError = "Client Supabase non caricato.";
    return false;
  }

  try {
    const { error } = await supabaseClient.from(SUPABASE_MOMENTS_TABLE).insert(mapMomentToRemote(moment));
    if (error) {
      lastMomentRemoteError = error.message || "Salvataggio Moments rifiutato.";
      return false;
    }

    return true;
  } catch (error) {
    lastMomentRemoteError = error?.message || "Supabase non raggiungibile.";
    return false;
  }
}

function mapMomentToRemote(moment) {
  return {
    id: moment.id,
    created_at: moment.createdAt,
    uploader_name: moment.uploaderName,
    caption: moment.caption || null,
    image_path: moment.imagePath,
    image_url: moment.imageUrl,
    status: moment.status || "pending",
  };
}

function mapMomentFromRemote(row) {
  return {
    id: row.id,
    createdAt: row.created_at || new Date().toISOString(),
    uploaderName: row.uploader_name || row.uploaderName || "Ospite",
    caption: row.caption || "",
    imagePath: row.image_path || row.imagePath || "",
    imageUrl: row.image_url || row.imageUrl || "",
    status: row.status || "pending",
  };
}

function loadTrucks() {
  return cloneDefaultTrucks();
}

function saveTrucks() {
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
    x: normalizeCoordinate(truck.x, 24),
    y: normalizeCoordinate(truck.y, 36),
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
    x: normalizeCoordinate(row.x ?? fallback.x, 24),
    y: normalizeCoordinate(row.y ?? fallback.y, 36),
    mapPositions,
  };
}

function loadVotes() {
  return [];
}

function saveVotes() {
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
    prize_opt_in: Boolean(vote.prizeOptIn),
    email: vote.email || null,
    gender: vote.gender || null,
    age_range: vote.ageRange || null,
    distance: vote.distance || null,
    score: Number(vote.score) || 0,
  };
}

function mapVoteFromRemote(row) {
  return {
    id: row.id,
    createdAt: row.created_at || new Date().toISOString(),
    category: row.category || voteCategories[0].value,
    truckId: row.truck_id || row.truckId || "",
    voter: row.voter_name || row.voter || "",
    prizeOptIn: Boolean(row.prize_opt_in || row.prizeOptIn),
    email: row.email || "",
    gender: row.gender || "",
    ageRange: row.age_range || row.ageRange || "",
    distance: row.distance || "",
    score: Number(row.score) || 0,
  };
}

function mapVoteLeaderboardFromRemote(row) {
  return {
    category: row.category || voteCategories[0].value,
    truckId: row.truck_id || row.truckId || "",
    count: Number(row.vote_count || row.count) || 0,
    totalScore: Number(row.total_score) || 0,
    avgScore: Number(row.avg_score) || 0,
  };
}

function loadAnalyticsEvents() {
  return [];
}

function saveAnalyticsEvents() {
}

async function saveAnalyticsEventRemote(event) {
  if (!supabaseClient) return false;

  try {
    const { error } = await supabaseClient.from(SUPABASE_ANALYTICS_TABLE).insert(mapAnalyticsEventToRemote(event));
    return !error;
  } catch {
    return false;
  }
}

function mapAnalyticsEventToRemote(event) {
  return {
    id: event.id,
    created_at: event.createdAt,
    type: event.type,
    label: event.label,
    section: event.section || "app",
    session_id: event.sessionId,
    details: event.details || {},
  };
}

function mapAnalyticsEventFromRemote(row) {
  return {
    id: row.id,
    createdAt: row.created_at || new Date().toISOString(),
    type: row.type || "visit",
    label: row.label || "",
    section: row.section || "app",
    sessionId: row.session_id || row.sessionId || "",
    details: row.details || {},
  };
}

function getAverageRating() {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length;
}

function getReviewLabel(group, value) {
  return reviewLabels[group]?.[value] || "";
}

function getTopReviewStat(field) {
  const counts = reviews.reduce((acc, review) => {
    const value = review[field];
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({ value, label: getReviewLabel(field, value), count }))
    .filter((row) => row.label)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))[0];
}

function getReviewReturnStats() {
  const total = reviews.filter((review) => review.wouldReturn).length || 1;
  const count = (value) => reviews.filter((review) => review.wouldReturn === value).length;
  return {
    yes: Math.round((count("yes") / total) * 100),
    maybe: Math.round((count("maybe") / total) * 100),
    no: Math.round((count("no") / total) * 100),
  };
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
    .map(({ tags, ...truck }) => ({
      ...truck,
      x: normalizeCoordinate(truck.x, 24),
      y: normalizeCoordinate(truck.y, 36),
      status: "open",
    }));
  return [...officialTrucks, ...customTrucks];
}

function normalizeCoordinate(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? clampNumber(number, 0, 100) : fallback;
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

function formatReservationDayShort(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}`;
}

function formatReservationTablesShort(value) {
  const normalized = cleanText(value);
  if (!normalized) return "-";

  return normalized
    .replace(/^(\d+)\s+tavol[oi]\s+da\s+/i, "$1 da ")
    .replace(/^(\d+)\s+tav\.\s+da\s+/i, "$1 da ");
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("39")) return digits;
  return digits ? `39${digits}` : "";
}

function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function createReviewTitle(body) {
  const normalized = cleanText(body);
  if (!normalized) return "Recensione CSSF";
  if (normalized.length <= 72) return normalized;
  return `${normalized.slice(0, 69).trimEnd()}...`;
}

function getFileExtension(file) {
  const nameExtension = String(file?.name || "").split(".").pop()?.toLowerCase();
  if (nameExtension && ["jpg", "jpeg", "png", "webp"].includes(nameExtension)) {
    return nameExtension;
  }

  if (file?.type === "image/png") return "png";
  if (file?.type === "image/webp") return "webp";
  return "jpg";
}

function getMomentDownloadExtension(url, mimeType = "") {
  const cleanUrl = String(url || "").split("?")[0];
  const urlExtension = cleanUrl.split(".").pop()?.toLowerCase();
  if (urlExtension && ["jpg", "jpeg", "png", "webp"].includes(urlExtension)) {
    return urlExtension;
  }

  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

function updateMomentPreview(file) {
  if (!momentPreview) return;

  const previousUrl = momentPreview.dataset.objectUrl;
  if (previousUrl) {
    URL.revokeObjectURL(previousUrl);
    delete momentPreview.dataset.objectUrl;
  }

  if (!file) {
    momentPreview.innerHTML = "<p>Seleziona una foto per vedere qui l'anteprima prima dell'invio.</p>";
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  momentPreview.dataset.objectUrl = objectUrl;
  momentPreview.innerHTML = `<img src="${objectUrl}" alt="Anteprima foto selezionata" />`;
}

function setMomentsFormStatus(message) {
  if (momentsFormStatus) {
    momentsFormStatus.textContent = message;
  }
}

function getMomentStatusLabel(status) {
  return {
    pending: "Da verificare",
    approved: "Approvata",
    rejected: "Scartata",
  }[status] || "Da verificare";
}

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
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
  return voteCategoryLabels[value] || value;
}

function getVoteCategorySummary(entry) {
  const categories = Array.isArray(entry?.categories) && entry.categories.length ? entry.categories : [entry?.category].filter(Boolean);
  return categories
    .map((category) => {
      const score = Number(entry?.scores?.[category] ?? (entry?.category === category ? entry?.score : 0)) || 0;
      return `${getVoteCategoryLabel(category)}${score ? ` ${score}/5` : ""}`;
    })
    .join(" · ");
}

function formatVoteScore(value) {
  const numericValue = Number(value) || 0;
  return `${numericValue.toFixed(1).replace(".", ",")}/5`;
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
