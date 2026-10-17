export const COOKIES = {
  ACCESS: 'xsa1fe7',
  REFRESH: 'xsa2be3',
  PENDING_2FA: 'xsa3cd5',
  AUTH_STATUS: 'xsa4d2x',
  REQUIRE_STORE_SETUP: 'rss',
  REAUTH: 'xsa4de9',
};

export const COOKIES_OPTIONS = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  path: '/',
  domain: 'devtunnels.ms',
} as const;
