'use client';

import useMe from '@/services/api/hooks/useMe';

const HelpCenterHero = () => {
  const me = useMe();

  return (
    <section className="py-10">
      <div className="container">
        <div className="bg-muted p-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Hi {me?.profile?.givenName} 👋 How can we help?
          </h1>
          <p className="text-muted-foreground">
            Search our help center or send a request to our support team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HelpCenterHero;
