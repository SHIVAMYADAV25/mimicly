import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Shell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleSidebar = () => setDrawerOpen((v) => !v);

  return (
    <div className="h-full flex items-stretch justify-center bg-subtle p-0 md:p-5">
      <div className="w-full max-w-9xl h-full md:h-[94vh] flex rounded-none md:rounded-2xl overflow-hidden border border-border shadow-panel bg-surface relative">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            <div className="w-72 h-full">
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setDrawerOpen(false)}
              className="flex-1 bg-black/30 backdrop-blur-sm"
            />
          </div>
        )}

        <Outlet context={{ toggleSidebar }} />
      </div>
    </div>
  );
}
