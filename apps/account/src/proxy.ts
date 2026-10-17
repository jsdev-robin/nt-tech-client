import { COOKIES, COOKIES_OPTIONS } from '@repo/ui/constants/cookie';
import { Role } from '@repo/ui/constants/role';
import { NextRequest, NextResponse } from 'next/server';
import { Jwt } from './lib/JwtService';

// Paths that require auth, and paths only for guests
const ROUTES = {
  private: {
    base: ['/settings', '/sessions'], // needs a valid session
    sudo: {
      passkey: ['/settings/passkeys/devices'],
      twoFa: [
        '/settings/two-factor/disable',
        '/settings/two-factor/backup',
        '/settings/two-factor/authenticator',
      ],
    }, // needs a valid sudo session too
    setup: {
      twoFa: '/settings/two-factor/setup', // blocked if 2FA already enabled
      passkey: '/settings/passkeys/devices', // blocked if passkey already enabled
    },
  },
  guest: [
    '/sign-in',
    '/sign-up',
    '/verify',
    '/forgot-password',
    '/reset-password',
    '/two-factor/verify/app',
    '/two-factor/verify/backup',
  ], // guest-only paths
};

// Prefix for the reauth version of a sudo path
const REAUTH_PREFIX = '/sessions/reauth';

// Removes '/reauth' and everything before it from a path
function stripReauthPrefix(pathname: string) {
  const index = pathname.indexOf('/reauth');
  return index !== -1
    ? pathname.slice(index + '/reauth'.length) || '/'
    : pathname;
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // needs session
  const needsAuth = ROUTES.private.base.some((p) => pathname.startsWith(p));

  // guest only
  const isGuestOnly = ROUTES.guest.includes(pathname);

  // refresh token
  const refreshToken = req.cookies.get(COOKIES.REFRESH)?.value;
  const session = await Jwt.decrypt(refreshToken, process.env.REFRESH_TOKEN);

  const role = session?.role as Role[];
  //  const hasRole = role?.some((r) => Object.values(Role).includes(r));
  const hasRole = role?.some((r) => [Role.ADMIN].includes(r));

  // no session, protected route -> sign-in
  if (needsAuth && (!session || !hasRole)) {
    const response = NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    Object.values(COOKIES).forEach((cookie) => {
      response.cookies.delete({
        name: cookie,
        ...COOKIES_OPTIONS,
      });
    });
    return response;
  }

  // has session, guest route -> settings
  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL('/settings', req.nextUrl));
  }

  // ===== Security status =====
  // check if 2FA / passkey already enabled
  const secCookie = req.cookies.get(COOKIES.AUTH_STATUS)?.value;
  const secStatus = await Jwt.decrypt(secCookie, process.env.CRYPTO_SECRET);

  // if session exists but doesn't match the security-status cookie -> sign-in
  if (session?.id !== secStatus?.id) {
    const response = NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    Object.values(COOKIES).forEach((cookie) => {
      response.cookies.delete({
        name: cookie,
        ...COOKIES_OPTIONS,
      });
    });
    return response;
  }

  const has2FA = secStatus?.isTwoFa === true;

  // 2FA already on, block setup page
  if (pathname.startsWith(ROUTES.private.setup.twoFa) && has2FA) {
    return NextResponse.redirect(new URL('/settings/two-factor', req.nextUrl));
  }

  // ===== Sudo =====
  // is this already the reauth-prefixed url?
  const isReauth = pathname.startsWith(REAUTH_PREFIX);

  // clean version of the path, used for matching against sudo paths
  const cleanPath = isReauth ? stripReauthPrefix(pathname) : pathname;

  // is this a sudo-protected path? (check twoFa and passkey sudo groups separately)
  const needsSudoTwoFa = ROUTES.private.sudo.twoFa.some((p) =>
    cleanPath.startsWith(p),
  );
  const needsSudoPasskey = ROUTES.private.sudo.passkey.some((p) =>
    cleanPath.startsWith(p),
  );
  const needsSudoTwoFaSetup = cleanPath.startsWith(ROUTES.private.setup.twoFa);

  const needsSudo = needsSudoTwoFa || needsSudoPasskey || needsSudoTwoFaSetup;

  // twoFa sudo routes (backup/authenticator) require 2FA already enabled -> if not, send to 2FA setup
  if (needsSudoTwoFa && !has2FA) {
    return NextResponse.redirect(
      new URL(ROUTES.private.setup.twoFa, req.nextUrl),
    );
  }

  // get and check sudo session
  const reauthCookie = req.cookies.get(COOKIES.REAUTH)?.value;
  const sudoAuth = await Jwt.decrypt(
    reauthCookie,
    process.env.ACTIVATION_SECRET,
  );

  // already has a valid sudo session -> block access to the reauth route itself, send to clean path
  if (isReauth && sudoAuth) {
    return NextResponse.redirect(new URL(cleanPath, req.nextUrl));
  }

  // on clean path without sudo session -> send to reauth first
  if (needsSudo && !isReauth && !sudoAuth) {
    return NextResponse.redirect(
      new URL(`${REAUTH_PREFIX}${cleanPath}`, req.nextUrl),
    );
  }

  // otherwise, continue
  return NextResponse.next();
}

// run on all routes except api, static/image assets, and png files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
