import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import MobileSearchModal from './MobileSearchModal';

export default function Layout() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-600 selection:text-white">
      <Navbar onOpenMobileSearch={() => setMobileSearchOpen(true)} />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav onOpenSearch={() => setMobileSearchOpen(true)} />
      <MobileSearchModal
        isOpen={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
      />
    </div>
  );
}
