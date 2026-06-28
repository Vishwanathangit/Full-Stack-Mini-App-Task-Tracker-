import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { CheckSquare, LayoutDashboard, FolderKanban } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function PageWrapper() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-surface items-center justify-around px-4 z-40 shadow-lg">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-all ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-all ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
            }`
          }
        >
          <CheckSquare className="h-5 w-5" />
          <span>Tasks</span>
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-medium transition-all ${
              isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
            }`
          }
        >
          <FolderKanban className="h-5 w-5" />
          <span>Projects</span>
        </NavLink>
      </nav>
    </div>
  );
}
