import 'server-only';

import Reauth from '@/components/site/panel/pages/session/reauth';

type Props = {
  params: Promise<{ slug: string[] }>;
};

const ReauthPage = async ({ params }: Props) => {
  const { slug } = await params;

  return <Reauth url={`/${slug.join('/')}`} />;
};

export default ReauthPage;
