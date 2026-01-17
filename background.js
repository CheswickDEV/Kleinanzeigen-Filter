const LISTING_URL_PATTERN = /\/s-anzeige\//;
const PROFILE_URL_PATTERNS = [
  /\/s-anbieter\//,
  /\/s-profil\//,
  /\/s-mitglied\//
];
const MEMBER_SINCE_REGEX = /Mitglied\s*seit\s*(\d{2}\.\d{2}\.\d{4})/i;

async function getCache() {
  const { memberSinceCache = {} } = await browser.storage.local.get("memberSinceCache");
  return memberSinceCache;
}

async function setCache(cache) {
  await browser.storage.local.set({ memberSinceCache: cache });
}

function extractProfileUrl(document, baseUrl) {
  const links = Array.from(document.querySelectorAll("a[href]"));
  const match = links.find((link) => PROFILE_URL_PATTERNS.some((pattern) => pattern.test(link.getAttribute("href"))));
  if (!match) {
    return null;
  }
  return new URL(match.getAttribute("href"), baseUrl).toString();
}

function extractMemberSince(document) {
  const text = document.body ? document.body.innerText : "";
  const match = text.match(MEMBER_SINCE_REGEX);
  return match ? match[1] : null;
}

async function fetchDocument(url) {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Request failed for ${url} with ${response.status}`);
  }
  const html = await response.text();
  return new DOMParser().parseFromString(html, "text/html");
}

async function resolveMemberSince(listingUrl) {
  const cache = await getCache();
  const cached = cache[listingUrl];
  if (cached !== undefined) {
    return cached;
  }

  const listingDocument = await fetchDocument(listingUrl);
  const profileUrl = extractProfileUrl(listingDocument, listingUrl);
  if (!profileUrl) {
    cache[listingUrl] = null;
    await setCache(cache);
    return null;
  }

  const profileCache = cache[profileUrl];
  if (profileCache !== undefined) {
    cache[listingUrl] = profileCache;
    await setCache(cache);
    return profileCache;
  }

  const profileDocument = await fetchDocument(profileUrl);
  const memberSince = extractMemberSince(profileDocument);

  cache[profileUrl] = memberSince;
  cache[listingUrl] = memberSince;
  await setCache(cache);
  return memberSince;
}

browser.runtime.onMessage.addListener((message) => {
  if (!message || message.type !== "fetchMemberSince") {
    return undefined;
  }

  const { listingUrl } = message;
  if (!listingUrl || !LISTING_URL_PATTERN.test(listingUrl)) {
    return Promise.resolve({ memberSince: null });
  }

  return resolveMemberSince(listingUrl)
    .then((memberSince) => ({ memberSince }))
    .catch(() => ({ memberSince: null }));
});
