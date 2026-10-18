import { COOKIES, COOKIES_OPTIONS } from '@repo/ui/constants/cookie';
import { Role } from '@repo/ui/constants/role';
import { NextRequest, NextResponse } from 'next/server';
import { Jwt } from './libs/JwtService';

const ROUTES = {
  private: {
    base: ['/dashboard'],
  },
};

export default async function middleware(req: NextRequest) {
  const needsAuth = ROUTES.private.base.some((p) =>
    req.nextUrl.pathname.startsWith(p),
  );

  const refreshToken = req.cookies.get(COOKIES.REFRESH)?.value;
  const session = await Jwt.decrypt(refreshToken, process.env.REFRESH_TOKEN);
  const role = session?.role as Role[];
  const hasRole = role?.includes(Role.CUSTOMER);

  if (needsAuth && (!session || !hasRole)) {
    const response = NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_ACCOUNT_ORIGIN}/sign-in`, req.nextUrl),
    );
    Object.values(COOKIES).forEach((cookie) => {
      response.cookies.delete({
        name: cookie,
        ...COOKIES_OPTIONS,
      });
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
