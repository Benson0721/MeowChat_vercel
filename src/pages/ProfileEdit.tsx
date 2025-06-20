import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { ArrowLeft } from "lucide-react";
//import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/stores/user-store";

const avatarOptions = [
  "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop&crop=faces",
  "", // Empty for default avatar
];

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [error, setError] = useState("");
  const user = useUserStore((state) => state.user);
  const editUser = useUserStore((state) => state.editUser);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username);
    setSelectedAvatar(user.avatar);
  }, [user]);

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }

    // Save to localStorage (in a real app, this would be an API call)
    const updatedUser = {
      ...user,
      username: username.trim(),
      avatar: selectedAvatar,
    };
    await editUser(updatedUser);

    toast("Your profile has been successfully updated!☺️☺️", {
      duration: 5000,
    });

    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-meow-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-meow-purple/20">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/chat")}
              className="rounded-xl hover:bg-meow-purple/50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="font-fredoka font-bold text-purple-900 text-xl">
                Edit Profile
              </CardTitle>
              <CardDescription className="text-purple-600">
                Update your username and avatar
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label className="text-purple-700 font-medium">Avatar</Label>
            <div className="grid grid-cols-3 gap-3">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-2 rounded-xl border-2 transition-all ${
                    selectedAvatar === avatar
                      ? "border-purple-500 bg-meow-purple/20"
                      : "border-meow-purple/20 hover:border-purple-300"
                  }`}
                >
                  <Avatar className="w-12 h-12 mx-auto">
                    <AvatarImage src={avatar} />
                    <AvatarFallback className="bg-meow-pink text-purple-800">
                      {index === avatarOptions.length - 1
                        ? `${user.username}`
                        : `A${index + 1}`}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-purple-700 font-medium">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Enter your username"
              className="rounded-xl border-meow-purple/20 focus:border-purple-500 focus:ring-purple-500/20"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-sm"
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileEdit;
