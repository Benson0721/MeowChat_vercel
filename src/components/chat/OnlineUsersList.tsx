
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const onlineUsers = [
  {
    id: '1',
    username: 'Alice Whiskers',
    avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=faces',
    status: 'online'
  },
  {
    id: '2',
    username: 'Bob Mittens',
    avatar: '',
    status: 'online'
  },
  {
    id: '3',
    username: 'Charlie Paws',
    avatar: '',
    status: 'online'
  },
  {
    id: '4',
    username: 'Diana Fluff',
    avatar: '',
    status: 'away'
  },
  {
    id: '5',
    username: 'Echo Purr',
    avatar: '',
    status: 'online'
  }
];

interface OnlineUsersListProps {
  onStartPrivateChat: (userId: string, username: string) => void;
}

export function OnlineUsersList({ onStartPrivateChat }: OnlineUsersListProps) {
  const onlineCount = onlineUsers.filter(user => user.status === 'online').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-fredoka font-semibold text-purple-900">Online Users</h3>
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          {onlineCount} online
        </Badge>
      </div>
      
      <div className="space-y-2">
        {onlineUsers.map((user) => (
          <div 
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-meow-purple/20 transition-colors group"
          >
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                  {user.username.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div 
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                  user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-purple-900 truncate">
                {user.username}
              </p>
              <p className={`text-xs ${
                user.status === 'online' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {user.status}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-meow-purple/50 rounded-lg"
              onClick={() => onStartPrivateChat(user.id, user.username)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
