
import { Home, Hash, MessageCircle, Settings, User, Users, Heart, Coffee, ChevronLeft, ChevronRight, Plus, Globe } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

interface ChatSidebarProps {
  currentChat: string;
  onChatSelect: (chatId: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onCreateGroup: () => void;
  privateChats: Array<{
    id: string;
    name: string;
    avatar: string;
    status: string;
    unread: number;
  }>;
  customGroups: Array<{
    id: string;
    name: string;
    icon: string;
    unread: number;
  }>;
}

const defaultChatGroups = [
  {
    id: 'cat-lovers',
    name: 'Cat Lovers',
    icon: Heart,
    unread: 3,
    color: 'text-red-500'
  },
  {
    id: 'dev-cats',
    name: 'Dev Cats',
    icon: Coffee,
    unread: 0,
    color: 'text-blue-500'
  },
  {
    id: 'kitten-pics',
    name: 'Kitten Pics',
    icon: Hash,
    unread: 12,
    color: 'text-pink-500'
  },
  {
    id: 'cat-care',
    name: 'Cat Care Tips',
    icon: Users,
    unread: 1,
    color: 'text-green-500'
  }
];

export function ChatSidebar({ currentChat, onChatSelect, collapsed, onToggleCollapsed, onCreateGroup, privateChats, customGroups }: ChatSidebarProps) {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div className={`relative transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-80'} bg-white/90 backdrop-blur-sm border-r border-meow-purple/20`}>
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapsed}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white border border-meow-purple/20 shadow-sm hover:bg-meow-purple/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-meow-purple/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🐱</span>
              </div>
              {!collapsed && (
                <div className="transition-opacity duration-200">
                  <h1 className="font-fredoka font-bold text-purple-900 text-lg">MeowChat</h1>
                  <p className="text-sm text-purple-600">Cozy conversations</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Global Chat */}
            <div>
              {!collapsed && (
                <h3 className="text-purple-700 font-fredoka font-medium uppercase tracking-wide text-xs mb-3">
                  Global
                </h3>
              )}
              <div className="space-y-1">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onChatSelect('global')}
                        className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                          currentChat === 'global' ? 'bg-meow-purple text-purple-800' : ''
                        }`}
                      >
                        <Globe className="w-5 h-5 text-blue-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Global Chatroom</TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => onChatSelect('global')}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                      currentChat === 'global' ? 'bg-meow-purple text-purple-800' : ''
                    }`}
                  >
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Global Chatroom</span>
                  </button>
                )}
              </div>
            </div>

            {!collapsed && <Separator className="bg-meow-purple/20" />}

            {/* Chat Groups */}
            <div>
              {!collapsed && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-purple-700 font-fredoka font-medium uppercase tracking-wide text-xs">
                    Chat Groups
                  </h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCreateGroup}
                        className="h-6 w-6 p-0 hover:bg-meow-purple/50 rounded-lg"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create New Group</TooltipContent>
                  </Tooltip>
                </div>
              )}
              <div className="space-y-1">
                {/* Default Groups */}
                {defaultChatGroups.map((group) => (
                  <div key={group.id}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onChatSelect(group.id)}
                            className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                              currentChat === group.id ? 'bg-meow-purple text-purple-800' : ''
                            }`}
                          >
                            <group.icon className={`w-5 h-5 ${group.color}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{group.name}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <button
                        onClick={() => onChatSelect(group.id)}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                          currentChat === group.id ? 'bg-meow-purple text-purple-800' : ''
                        }`}
                      >
                        <group.icon className={`w-5 h-5 ${group.color}`} />
                        <span className="font-medium">{group.name}</span>
                        {group.unread > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {group.unread}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                ))}

                {/* Custom Groups */}
                {customGroups.map((group) => (
                  <div key={group.id}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onChatSelect(group.id)}
                            className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                              currentChat === group.id ? 'bg-meow-purple text-purple-800' : ''
                            }`}
                          >
                            <span className="text-lg">{group.icon}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{group.name}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <button
                        onClick={() => onChatSelect(group.id)}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                          currentChat === group.id ? 'bg-meow-purple text-purple-800' : ''
                        }`}
                      >
                        <span className="text-lg">{group.icon}</span>
                        <span className="font-medium">{group.name}</span>
                        {group.unread > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {group.unread}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!collapsed && <Separator className="bg-meow-purple/20" />}

            {/* Direct Messages */}
            <div>
              {!collapsed && (
                <h3 className="text-purple-700 font-fredoka font-medium uppercase tracking-wide text-xs mb-3">
                  Direct Messages
                </h3>
              )}
              <div className="space-y-1">
                {privateChats.map((dm) => (
                  <div key={dm.id}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onChatSelect(dm.id)}
                            className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                              currentChat === dm.id ? 'bg-meow-purple text-purple-800' : ''
                            }`}
                          >
                            <div className="relative">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={dm.avatar} />
                                <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                                  {dm.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div 
                                className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                                  dm.status === 'online' ? 'bg-green-500' : 
                                  dm.status === 'away' ? 'bg-white' : 'bg-gray-400'
                                }`}
                              />
                            </div>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">{dm.name}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <button
                        onClick={() => onChatSelect(dm.id)}
                        className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                          currentChat === dm.id ? 'bg-meow-purple text-purple-800' : ''
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={dm.avatar} />
                            <AvatarFallback className="bg-meow-pink text-purple-800 text-sm">
                              {dm.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div 
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                              dm.status === 'online' ? 'bg-green-500' : 
                              dm.status === 'away' ? 'bg-white' : 'bg-gray-400'
                            }`}
                          />
                        </div>
                        <span className="font-medium text-sm">{dm.name}</span>
                        {dm.unread > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {dm.unread}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-meow-purple/20">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <button onClick={() => navigate('/profile')} className="hover:opacity-80 transition-opacity">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=faces" />
                        <AvatarFallback className="bg-meow-purple text-purple-800">You</AvatarFallback>
                      </Avatar>
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">You (Online)</TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/profile')} className="hover:opacity-80 transition-opacity">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=faces" />
                    <AvatarFallback className="bg-meow-purple text-purple-800">You</AvatarFallback>
                  </Avatar>
                </button>
                <div className="flex-1">
                  <p className="font-medium text-purple-900 text-sm">You</p>
                  <p className="text-xs text-purple-600">Online</p>
                </div>
                <Button size="sm" variant="ghost" className="text-purple-600 hover:bg-meow-purple/50 rounded-xl">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
