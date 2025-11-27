import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { ViewType } from '../App';
import * as userApi from '../api/user';
import * as authApi from '../api/auth';

interface HeaderProps {
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

export function Header({ onViewChange, onLogout }: HeaderProps) {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await userApi.getProfile(); 
        setFullName(data.user.fullname || 'User'); 
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        setFullName('User');
      }
    }
    fetchUser();
  }, []);

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleLogoutClick = async () => {
    try {
      await authApi.logout(); 
    } catch {}
    onLogout();
  };

  return (
    <header className="border-b bg-card px-6 py-3 flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="flex items-center gap-3 hover:bg-accent px-3 py-2 rounded-lg transition-colors cursor-pointer">
            <div className="text-right">
              <p className="text-sm text-[16px]">{fullName}</p>
            </div>
            <Avatar>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewChange('profile')}>
            <User className="mr-2 size-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogoutClick} className="text-destructive">
            <LogOut className="mr-2 size-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
