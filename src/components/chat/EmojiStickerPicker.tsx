import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile } from "lucide-react";

const emojis = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "👍",
  "👎",
  "👌",
  "🤌",
  "🤏",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
];

interface Sticker {
  id: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface EmojiStickerPickerProps {
  onSelect: (content: string, type: "emoji" | "sticker") => void;
  stickers: Sticker[];
}

export function EmojiStickerPicker({
  onSelect,
  stickers,
}: EmojiStickerPickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (stickers.length > 0) {
      setSelectedCategory(stickers[0].category);
    }
  }, [stickers]);

  const handleSelect = (content: string, type: "emoji" | "sticker") => {
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
      <PopoverContent className="w-100 p-0" side="top" align="end">
        <Tabs defaultValue="emojis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-meow-cream/50">
            <TabsTrigger value="emojis" className="text-purple-700">
              Emojis
            </TabsTrigger>
            <TabsTrigger value="stickers" className="text-purple-700">
              Stickers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emojis" className="p-4">
            <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {emojis.map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-meow-purple/30 rounded-lg text-lg"
                  onClick={() => handleSelect(emoji, "emoji")}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stickers" className="p-2">
            {stickers?.map((sticker, index) => (
              <div key={index} className="flex items-center gap-2 rounded-xl overflow-hidden mb-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-meow-purple/30 rounded-lg text-lg"
                  onClick={() => setSelectedCategory(sticker.category)}
                >
                  <img src={sticker.thumbnail} alt={sticker.category} className="" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
              {stickers?.map(
                (sticker) =>
                  selectedCategory === sticker.category &&
                  sticker.images.map((image, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-20 w-20 p-0 hover:bg-meow-purple/30 rounded-lg text-lg"
                      onClick={() => handleSelect(image, "sticker")}
                    >
                      <img src={image}  />
                    </Button>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
