import NotFound from '@/app/not-found';
import ConfirmEmailChange from '@/components/site/panel/pages/settings/email/confirm';
import { Jwt } from '@/lib/JwtService';

const ConfirmEmailChangePage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  const decoded = await Jwt.decrypt(token, process.env.ACTIVATION_SECRET);

  return !decoded ? <NotFound /> : <ConfirmEmailChange token={token} />;
};

export default ConfirmEmailChangePage;
