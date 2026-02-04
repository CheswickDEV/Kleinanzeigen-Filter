const STORAGE_KEY = "memberSinceFilterDate";

// Nur auf Seiten mit echten Suchergebnissen aktiv
function isSearchResultsPage() {
  const url = window.location.pathname;
  // Suchergebnisse: /s-*, aber NICHT die reine Hauptseite /
  return url.startsWith("/s-") || url.includes("/s-suchanfrage") || document.querySelector("#srchrslt-adtable") !== null;
}

function normalizeDate(value) {
  if (!value) return null;
  const parts = value.split("-");
  return parts.length === 3 ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])) : null;
}

function parseMemberSince(value) {
  if (!value) return null;
  const parts = value.split(".");
  return parts.length === 3 ? new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])) : null;
}

function formatMemberSince(value) {
  return value ? value : "unbekannt";
}

function markListing(listingElement, memberSince) {
  let targetContainer = listingElement.querySelector(".aditem-main--top--left");
  
  if (!targetContainer) {
      targetContainer = listingElement.querySelector(".aditem-details");
  }

  if (!targetContainer) return;

  let badgeContainer = listingElement.querySelector(".ka-badge-inline");
  
  if (!badgeContainer) {
    badgeContainer = document.createElement("div");
    badgeContainer.className = "ka-badge-inline";
    
    const badge = document.createElement("div");
    badge.className = "ka-member-since-badge";
    
    badgeContainer.appendChild(badge);
    targetContainer.appendChild(badgeContainer);
  }
  
  const badge = badgeContainer.querySelector(".ka-member-since-badge");
  const iconChar = memberSince ? "👤" : "⚠️";
  
  // SICHERHEITS-FIX: DOM-Elemente statt innerHTML
  badge.textContent = ""; // Inhalt leeren
  
  const iconSpan = document.createElement("span");
  iconSpan.className = "ka-badge-icon";
  iconSpan.textContent = iconChar;
  
  const textSpan = document.createElement("span");
  textSpan.textContent = ` Seit: ${formatMemberSince(memberSince)}`;
  
  badge.appendChild(iconSpan);
  badge.appendChild(textSpan);
  
  listingElement.dataset.memberSince = memberSince || "";
  listingElement.classList.toggle("ka-member-since-unknown", !memberSince);
}

function applyFilterToListing(listingElement, filterDate) {
  const memberSince = listingElement.dataset.memberSince;
  listingElement.classList.remove("ka-member-since-hidden");

  if (!filterDate || !memberSince) return;
  
  const memberSinceDate = parseMemberSince(memberSince);
  if (!memberSinceDate) return;

  if (memberSinceDate > filterDate) {
    listingElement.classList.add("ka-member-since-hidden");
  }
}

async function fetchMemberSince(listingUrl) {
  try {
    const response = await browser.runtime.sendMessage({
      type: "fetchMemberSince",
      listingUrl
    });
    return response ? response.memberSince : null;
  } catch (e) {
    return null;
  }
}

async function loadFilterDate() {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || "";
}

async function saveFilterDate(value) {
  await browser.storage.local.set({ [STORAGE_KEY]: value });
}

function buildPanel(initialValue) {
  const panel = document.createElement("div");
  panel.className = "ka-filter-banner";
  
  panel.innerHTML = `
    <div class="ka-banner-header">
      <div class="ka-banner-title">
        <span style="color: var(--ka-accent); margin-right: 8px;">//</span> 
        Kleinanzeigen Filter
        <span class="ka-logo-cursor"></span>
      </div>
      <div style="font-size: 10px; font-family: var(--ka-font-mono); color: var(--ka-accent); border: 1px solid var(--ka-accent); padding: 2px 6px; border-radius: 4px; font-weight: 600;">v1.1</div>
    </div>
    
    <div class="ka-banner-content">
      <div class="ka-module">
        <label class="ka-module-label">Beitrittsdatum Limit</label>
        
        <div class="ka-controls-row">
            <div class="ka-input-wrapper">
              <input class="ka-filter-input" type="text" placeholder="Datum wählen..." />
              <span class="ka-input-icon">📅</span>
            </div>
            <button class="ka-apply-btn">
                <span class="ka-btn-text">Anwenden</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
        </div>

        <p class="ka-module-hint">
          Filtert alle Anbieter heraus, die <strong>nach</strong> diesem Datum beigetreten sind.
        </p>
      </div>
    </div>
    
    <div class="ka-banner-footer">
      <span class="ka-footer-text">powered by <a href="https://cheswick.dev" target="_blank" class="ka-footer-link">cheswick.dev</a></span>
    </div>
  `;

  // Wert sicher setzen
  const input = panel.querySelector(".ka-filter-input");
  input.value = initialValue;
  // Event-Handler für Input-Typ (Date/Text toggle)
  input.onfocus = function() { this.type = 'date'; };
  input.onblur = function() { this.value ? this.type = 'date' : this.type = 'text'; };

  return panel;
}

async function initializePanel() {
  // Prüfen ob Panel bereits existiert
  if (document.querySelector(".ka-filter-banner")) {
    return normalizeDate(await loadFilterDate());
  }

  const storedValue = await loadFilterDate();
  const panel = buildPanel(storedValue);
  
  // Suchergebnisse-Container finden
  const resultsTable = document.querySelector("#srchrslt-adtable");
  
  if (resultsTable && resultsTable.parentNode) {
    // Vor den Suchergebnissen einfügen
    resultsTable.parentNode.insertBefore(panel, resultsTable);
  } else {
    // Fallback: Am Anfang des main-Bereichs einfügen
    const mainContent = document.querySelector("main") || document.querySelector("#site-content") || document.body;
    mainContent.prepend(panel);
  }

  const input = panel.querySelector(".ka-filter-input");
  const applyBtn = panel.querySelector(".ka-apply-btn");
  const btnText = panel.querySelector(".ka-btn-text");

  if (input.value) { input.type = 'date'; }

  const applyFilter = async () => {
    if (!input.value) { input.type = 'text'; }
    await saveFilterDate(input.value);
    
    const originalText = btnText.textContent;
    btnText.textContent = "Lädt...";
    applyBtn.style.opacity = "0.7";
    
    const filterDate = normalizeDate(input.value);
    const listings = document.querySelectorAll(".ka-listing");
    
    listings.forEach((listing) => {
      applyFilterToListing(listing, filterDate);
    });

    setTimeout(() => {
        btnText.textContent = originalText;
        applyBtn.style.opacity = "1";
    }, 300);
  };

  applyBtn.addEventListener("click", applyFilter);
  input.addEventListener("keypress", (e) => {
      if (e.key === 'Enter') {
          applyFilter();
      }
  });

  return normalizeDate(storedValue);
}

async function processListing(element, filterDate) {
  if (element.classList.contains("ka-listing")) return;
  
  const anchor = element.querySelector("a[href*='/s-anzeige/']");
  if (!anchor) return;

  element.classList.add("ka-listing");
  const listingUrl = new URL(anchor.getAttribute("href"), window.location.origin).toString();
  
  const memberSince = await fetchMemberSince(listingUrl);
  
  markListing(element, memberSince);
  applyFilterToListing(element, filterDate);
}

async function processAllListings(filterDate) {
  const listings = Array.from(document.querySelectorAll("article.aditem, li.ad-listitem"));
  for (const listing of listings) {
    await processListing(listing, filterDate);
  }
}

async function init() {
  if (!document.body) return;
  
  // NUR auf Suchergebnisseiten aktiv, nicht auf der Hauptseite
  if (!isSearchResultsPage()) {
    return;
  }

  const filterDate = await initializePanel();
  await processAllListings(filterDate);

  const observer = new MutationObserver(async (mutations) => {
    const currentFilterDate = normalizeDate((await loadFilterDate()) || "");
    let shouldUpdate = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }
    if (shouldUpdate) {
      await processAllListings(currentFilterDate);
    }
  });

  const observerTarget = document.querySelector("#srchrslt-adtable") || document.body;
  observer.observe(observerTarget, { childList: true, subtree: true });
}

if (window.location.hostname.includes("kleinanzeigen.de")) {
  // Warten bis DOM bereit ist
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
