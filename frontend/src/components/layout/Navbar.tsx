import { LogOut, CheckSquare, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';

export function Navbar() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-text-primary">
          <CheckSquare className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight text-text-primary">TaskFlow</span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 rounded-full bg-surface-raised px-3 py-1.5 border border-border">
            <UserIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-text-secondary">{user.username}</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-text-secondary hover:text-danger hover:bg-danger/10 gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
