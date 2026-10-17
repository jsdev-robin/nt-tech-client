import { redirect, RedirectType } from 'next/navigation';

const Home = () => {
  redirect('/sign-in', RedirectType.replace);
};

export default Home;
