import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Cat, Eye, EyeOff } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import useUserStore from "../stores/user-store";

interface Inputs {
  email: string;
  password: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginHandler = useUserStore((state) => state.loginHandler);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const handleLogin: SubmitHandler<Inputs> = async (data: Inputs) => {
    setError("");
    setIsLoading(true);
    try {
      await loginHandler(data.email, data.password);
      navigate("/chat");
    } catch (error) {
      if (error.response.status === 401) {
        setError("email or password is incorrect");
      } else {
        setError("login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-meow-lavender via-meow-cream to-meow-pink flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-meow-purple/20 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-meow-purple rounded-full flex items-center justify-center mb-4">
            <Cat className="w-8 h-8 text-purple-800" />
          </div>
          <CardTitle className="text-2xl font-fredoka text-purple-900">
            Welcome to MeowChat
          </CardTitle>
          <p className="text-purple-600">Sign in to start chatting</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            {errors.email && (
              <p role="alert" className="text-red-300 text-sm">
                {errors.email.message}
              </p>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-purple-900"
              >
                Email
              </label>
              <Input
                id="email"
                type="text"
                {...register("email", { required: true })}
                placeholder="Enter your email"
                className="border-meow-purple/30 focus-visible:ring-purple-300"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-purple-900"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Enter your password"
                  className="border-meow-purple/30 focus-visible:ring-purple-300 pr-10"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p role="alert" className="text-red-300 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-700 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="absolute top-4 right-14 bg-white/90 border border-purple-300 p-2 rounded-md">
        <p className="text-purple-600">測試用帳號: Benson0721@gmail.com</p>
        <p className="text-purple-600">測試用密碼: 123456789</p>
      </div>
    </div>
  );
};

export default Login;
