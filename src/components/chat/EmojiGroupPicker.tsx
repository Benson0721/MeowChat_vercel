
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const groupEmojis = [
  '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐸', '🐵', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅',
  '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌',
  '🐞', '🐜', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕',
  '🐙', '🦑', '🦐', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋',
  '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏'
];

interface EmojiGroupPickerProps {
  onSelect: (emoji: string) => void;
  selectedEmoji: string;
}

export function EmojiGroupPicker({ onSelect, selectedEmoji }: EmojiGroupPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-16 h-16 text-2xl rounded-xl border-meow-purple/20 hover:bg-meow-purple/20"
        >
          {selectedEmoji || '🐱'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side="bottom">
        <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
          {groupEmojis.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`h-10 w-10 p-0 text-lg rounded-lg hover:bg-meow-purple/30 ${
                selectedEmoji === emoji ? 'bg-meow-purple/50' : ''
              }`}
              onClick={() => handleSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
