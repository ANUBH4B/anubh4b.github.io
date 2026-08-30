/**
 * ==========================================================================
 * PORTFOLIO CENTRALIZED CONFIGURATION & DYNAMIC LINK ENGINE
 * Single Source of Truth for URLs, Profiles, IDs, and Router
 * ==========================================================================
 */

const PORTFOLIO_CONFIG = {
  profile: {
    name: 'ANUBHAB',
    tagline: 'Fullstack Developer',
    description: 'Self-taught developer who loves tech, gaming, building things, and turning ideas into real projects.',
    canonicalBase: 'https://anubh4b.github.io',
    avatarFallback: 'https://avatars.githubusercontent.com/u/74665803?v=4',
  },

  discord: {
    userId: '765917032281276426',
    username: 'anubh4b',
    serverInvite: 'https://discord.gg/4CnVUmfatR',
    get dmUrl() {
      return `https://discord.com/users/${this.userId}`;
    },
  },

  links: {
    github: 'https://github.com/ANUBH4B',
    steam: 'https://steamcommunity.com/id/anubh4b',
    xbox: 'https://account.xbox.com/en-us/profile?gamertag=ANUBHAB2004',
    twitter: 'https://x.com/ANUBH4B',
    x: 'https://x.com/ANUBH4B',
    youtube: 'https://www.youtube.com/@anubhabgg',
    email: 'mailto:contactanubhab@gmail.com',
    discord: 'https://discord.gg/4CnVUmfatR',
    server: 'https://discord.gg/4CnVUmfatR',
    dm: 'https://discord.com/users/765917032281276426',
    home: 'https://anubh4b.github.io/',
  },

  socialLabels: {
    github: 'GitHub: @ANUBH4B',
    steam: 'Steam: ANUBH4B',
    xbox: 'Xbox: ANUBHAB2004',
    twitter: 'X: @ANUBH4B',
    x: 'X: @ANUBH4B',
    youtube: 'YouTube: AnubhabGG',
    email: 'Email: contactanubhab@gmail.com',
  },
};

// Make accessible globally
window.PORTFOLIO_CONFIG = PORTFOLIO_CONFIG;

/**
 * Dynamic URL & Canonical Sync
 */
(function initDynamicLinks() {
  // Sync canonical and og:url dynamically to current origin
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const currentUrl = `${origin}${path}`;

    const canonicalEl = document.querySelector("link[rel='canonical']");
    if (canonicalEl) {
      canonicalEl.setAttribute('href', currentUrl);
    }

    const ogUrlEl = document.querySelector("meta[property='og:url']");
    if (ogUrlEl) {
      ogUrlEl.setAttribute('content', currentUrl);
    }

    const twUrlEl = document.querySelector("meta[name='twitter:url']");
    if (twUrlEl) {
      twUrlEl.setAttribute('content', currentUrl);
    }
  }
})();

/**
 * Client-Side Vanity Path Shortlink Router (for 404.html and SPA paths)
 */
(function handleDynamicRouter() {
  if (typeof window === 'undefined') return;

  const pathname = window.location.pathname.replace(/^\/|\/$/g, '').toLowerCase();
  const segments = pathname.split('/');
  const route = segments[segments.length - 1];

  // If this route matches any of our dynamic vanity shortcuts
  if (route && PORTFOLIO_CONFIG.links[route]) {
    const targetUrl = PORTFOLIO_CONFIG.links[route];
    console.log(`[Router] Redirecting vanity link /${route} -> ${targetUrl}`);
    window.location.replace(targetUrl);
  }
})();
