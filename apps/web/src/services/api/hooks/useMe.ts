import { useSelector } from 'react-redux';
import { RootState } from '../store';

const useMe = () => {
  return useSelector((store: RootState) => store.auth.user);
};

export default useMe;
