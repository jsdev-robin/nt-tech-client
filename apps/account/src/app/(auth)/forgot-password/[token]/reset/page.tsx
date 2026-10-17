import ResetPassword from '@/components/site/auth/pages/resetPassword';
import 'server-only';

const ResetPasswordPage = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;

  return <ResetPassword token={token} />;
};

export default ResetPasswordPage;
