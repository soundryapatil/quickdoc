import React from 'react';

import Hero from '../components/Hero';
import Speciality from '../components/Speciality';
import TopDoctors from '../components/TopDoctors';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <>
      <Hero />
      <Speciality />
      <TopDoctors />
      <CTA />
    </>
  );
};

export default Home;