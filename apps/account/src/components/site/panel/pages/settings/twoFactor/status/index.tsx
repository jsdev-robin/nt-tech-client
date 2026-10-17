'use client';

import useMe from '@/lib/redux/hooks/useMe';
import TwoFaGuide from './TwoFaStatus';
import TwoFaView from './TwoFaView';

const TwoFaStatus = () => {
  const me = useMe();

  return me?.auth.twoFa.isEnabled ? <TwoFaView /> : <TwoFaGuide />;
};

export default TwoFaStatus;
