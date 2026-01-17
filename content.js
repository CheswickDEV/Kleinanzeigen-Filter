const STORAGE_KEY = "memberSinceFilterDate";
const LISTING_SELECTOR = "a[href*='/s-anzeige/']";

function normalizeDate(value) {
  if (!value) {
    return null;
  }
  const parts = value.split("-");
  if (parts.length !== 3) {
    return null;
  }
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function parseMemberSince(value) {
  if (!value) {
    return null;
  }
  const parts = value.split(".");
  if (parts.length !== 3) {
    return null;
  }
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

function formatMemberSince(value) {
  return value ? `Mitglied seit ${value}` : "Mitglied seit: unbekannt";
}

function getListingElement(anchor) {
  return anchor.closest("article, li, div") || anchor;
}

function markListing(listingElement, memberSince) {
  let badge = listingElement.querySelector(".ka-member-since-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.className = "ka-member-since-badge";
    listingElement.appendChild(badge);
  }
  badge.textContent = formatMemberSince(memberSince);
  listingElement.dataset.memberSince = memberSince || "";
  listingElement.classList.toggle("ka-member-since-unknown", !memberSince);
}

function applyFilterToListing(listingElement, filterDate) {
  const memberSince = listingElement.dataset.memberSince;
  if (!filterDate) {
    listingElement.classList.remove("ka-member-since-hidden");
    return;
  }
  if (!memberSince) {
    listingElement.classList.remove("ka-member-since-hidden");
    return;
  }
  const memberSinceDate = parseMemberSince(memberSince);
  if (!memberSinceDate) {
    listingElement.classList.remove("ka-member-since-hidden");
    return;
  }
  const shouldHide = memberSinceDate > filterDate;
  listingElement.classList.toggle("ka-member-since-hidden", shouldHide);
}

async function fetchMemberSince(listingUrl) {
  const response = await browser.runtime.sendMessage({
    type: "fetchMemberSince",
    listingUrl
  });
  return response ? response.memberSince : null;
}

async function loadFilterDate() {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || "";
}

async function saveFilterDate(value) {
  await browser.storage.local.set({ [STORAGE_KEY]: value });
}

function buildPanel(initialValue) {
  const panel = document.createElement("section");
  panel.className = "ka-filter-panel";
  panel.innerHTML = `
    <label class="ka-filter-label">
      Anbieter-Mitgliedschaft vor Datum anzeigen
      <input class="ka-filter-input" type="date" value="${initialValue}" />
    </label>
    <p class="ka-filter-hint">
      Anzeigen ohne Datum bleiben sichtbar und werden markiert.
    </p>
  `;
  return panel;
}

async function initializePanel() {
  const storedValue = await loadFilterDate();
  const panel = buildPanel(storedValue);
  const container = document.querySelector("main") || document.body;
  container.prepend(panel);

  const input = panel.querySelector(".ka-filter-input");
  input.addEventListener("change", async () => {
    await saveFilterDate(input.value);
    const filterDate = normalizeDate(input.value);
    document.querySelectorAll(".ka-listing").forEach((listing) => {
      applyFilterToListing(listing, filterDate);
    });
  });

  return normalizeDate(storedValue);
}

async function processListing(anchor, filterDate) {
  const listingElement = getListingElement(anchor);
  if (!listingElement || listingElement.classList.contains("ka-listing")) {
    return;
  }

  listingElement.classList.add("ka-listing");
  const listingUrl = new URL(anchor.getAttribute("href"), window.location.origin).toString();
  const memberSince = await fetchMemberSince(listingUrl);
  markListing(listingElement, memberSince);
  applyFilterToListing(listingElement, filterDate);
}

async function processAllListings(filterDate) {
  const anchors = Array.from(document.querySelectorAll(LISTING_SELECTOR));
  for (const anchor of anchors) {
    await processListing(anchor, filterDate);
  }
}

async function init() {
  const filterDate = await initializePanel();
  await processAllListings(filterDate);

  const observer = new MutationObserver(async () => {
    const currentFilterDate = normalizeDate((await loadFilterDate()) || "");
    await processAllListings(currentFilterDate);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (window.location.hostname === "www.kleinanzeigen.de") {
  init();
}
