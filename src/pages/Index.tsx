import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, MessageSquare, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-meow-lavender via-meow-cream to-meow-pink">
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-meow-purple rounded-full flex items-center justify-center">
            <Cat className="w-6 h-6 text-purple-800" />
          </div>
          <h1 className="text-2xl font-fredoka font-bold text-purple-900">
            MeowChat
          </h1>
        </div>

        <div className="flex gap-3">
          <Link to="/login">
            <Button
              variant="outline"
              className="rounded-xl border-purple-300 hover:bg-meow-purple text-purple-700"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-fredoka font-bold text-purple-900 mb-4">
              Purr-fect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {" "}
                Conversations
              </span>
            </h2>
            <p className="text-xl text-purple-700 max-w-2xl mx-auto leading-relaxed">
              Join the coziest chat community for meet new friends! Share
              stories, make friends, and connect with fellow feline enthusiasts
              from around the world.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl px-8 py-6 text-lg font-medium hover-lift paw-cursor"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Chatting
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 hover:bg-meow-purple text-purple-700 rounded-2xl px-8 py-6 text-lg font-medium hover-lift"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/80 backdrop-blur-sm border-meow-purple/20 hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-meow-pink rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-purple-800" />
                </div>
                <h3 className="text-xl font-fredoka font-semibold text-purple-900 mb-3">
                  Real-time Chat
                </h3>
                <p className="text-purple-600">
                  Connect instantly with cat lovers worldwide. Share photos,
                  stories, and get real-time advice.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-meow-purple/20 hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-meow-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-800" />
                </div>
                <h3 className="text-xl font-fredoka font-semibold text-purple-900 mb-3">
                  Cat Communities
                </h3>
                <p className="text-purple-600">
                  Join specialized groups for different breeds, topics, and
                  interests. Find your perfect community.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-meow-purple/20 hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-meow-mint rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-800" />
                </div>
                <h3 className="text-xl font-fredoka font-semibold text-purple-900 mb-3">
                  Safe & Friendly
                </h3>
                <p className="text-purple-600">
                  A moderated, welcoming space where kindness rules. Share your
                  cat journey in a supportive environment.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Bubble Illustration */}
          <div className="relative max-w-md mx-auto">
            <div className="flex flex-col gap-4">
              <div className="chat-bubble chat-bubble-other animate-bounce-gentle ml-8">
                <p className="text-sm">Welcome to MeowChat! 🐱</p>
              </div>
              <div
                className="chat-bubble chat-bubble-me animate-bounce-gentle mr-8"
                style={{ animationDelay: "0.5s" }}
              >
                <p className="text-sm">Can't wait to meet new friends! 😸</p>
              </div>
              <div
                className="chat-bubble chat-bubble-other animate-bounce-gentle ml-8"
                style={{ animationDelay: "1s" }}
              >
                <p className="text-sm">You'll love our community! 💜</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-purple-600">
        <p>&copy; 2025 MeowChat. Made with 💜 for cat lovers everywhere.</p>
      </footer>
    </div>
  );
};

export default Index;
