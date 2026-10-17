import { cookies } from 'next/headers';
import 'server-only';
import { Jwt } from './JwtService';

interface SessionProps {
  cookieName: string;
  key: string | undefined;
}

const session = async ({ cookieName, key }: SessionProps) => {
  const cookie = (await cookies()).get(cookieName)?.value;
  return Jwt.decrypt(cookie, key);
};

export default session;
