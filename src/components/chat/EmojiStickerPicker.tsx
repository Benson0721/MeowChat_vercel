
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile } from 'lucide-react';

const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙'
];

const stickers = [
  { id: 1, emoji: '😸', name: 'Happy Cat' },
  { id: 2, emoji: '😹', name: 'Laughing Cat' },
  { id: 3, emoji: '😻', name: 'Heart Eyes Cat' },
  { id: 4, emoji: '😼', name: 'Smirking Cat' },
  { id: 5, emoji: '😽', name: 'Kissing Cat' },
  { id: 6, emoji: '🙀', name: 'Shocked Cat' },
  { id: 7, emoji: '😿', name: 'Crying Cat' },
  { id: 8, emoji: '😾', name: 'Angry Cat' },
  { id: 9, emoji: '🐾', name: 'Paw Prints' },
  { id: 10, emoji: '🎾', name: 'Ball' },
  { id: 11, emoji: '🐟', name: 'Fish' },
  { id: 12, emoji: '🥛', name: 'Milk' }
];

interface EmojiStickerPickerProps {
  onSelect: (content: string, type: 'emoji' | 'sticker') => void;
}

export function EmojiStickerPicker({ onSelect }: EmojiStickerPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (content: string, type: 'emoji' | 'sticker') => {
    onSelect(content, type);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-purple-600 hover:bg-meow-purple/50 rounded-xl"
        >
          <Smile className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="top" align="end">
        <Tabs defaultValue="emojis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-meow-cream/50">
            <TabsTrigger value="emojis" className="text-purple-700">Emojis</TabsTrigger>
            <TabsTrigger value="stickers" className="text-purple-700">Stickers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emojis" className="p-4">
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {emojis.map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-meow-purple/30 rounded-lg text-lg"
                  onClick={() => handleSelect(emoji, 'emoji')}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stickers" className="p-4">
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
              {stickers.map((sticker) => (
                <Button
                  key={sticker.id}
                  variant="ghost"
                  className="h-16 w-16 p-2 hover:bg-meow-purple/30 rounded-xl flex flex-col items-center justify-center"
                  onClick={() => handleSelect(sticker.emoji, 'sticker')}
                >
                  <span className="text-2xl">{sticker.emoji}</span>
                  <span className="text-xs text-purple-600 mt-1">{sticker.name}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
