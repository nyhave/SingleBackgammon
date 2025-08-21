import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

console.log('MainLayout.jsx module loaded');

export default function MainLayout() {
  useEffect(() => {
    console.log('MainLayout component mounted');
  }, []);
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
