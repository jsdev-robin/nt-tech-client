import { RootState } from '@/lib/redux/store';
import { useSelector } from 'react-redux';

const useMe = () => {
  return useSelector((store: RootState) => store.auth.user);
};

export default useMe;
