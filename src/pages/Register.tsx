import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useUserStore from "../stores/user-store";
import { Cat, Eye, EyeOff } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Inputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const signupHandler = useUserStore((state) => state.signupHandler);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const validation = {
    username: {
      required: true,
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters long",
      },
      maxLength: {
        value: 12,
        message: "Username must be at most 12 characters long",
      },
    },
    email: {
      required: true,
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: true,
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters long",
      },
      maxLength: {
        value: 12,
        message: "Password must be at most 12 characters long",
      },
    },
    confirmPassword: {
      required: true,
      validate: (value: string) =>
        value === watch("password") || "Passwords do not match",
    },
  };

  const handleRegister: SubmitHandler<Inputs> = async (data: Inputs) => {
    setError("");
    setIsLoading(true);
    try {
      await signupHandler(data.email, data.password, data.username);
      navigate("/chat");
    } catch (err: any) {
      setError("Register failed! Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-meow-lavender via-meow-cream to-meow-pink flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-meow-purple/20 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-meow-purple rounded-full flex items-center justify-center mb-4">
            <Cat className="w-8 h-8 text-purple-800" />
          </div>
          <CardTitle className="text-2xl font-fredoka text-purple-900">
            Join MeowChat
          </CardTitle>
          <p className="text-purple-600">Create your account to get started</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-purple-900"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                {...register("username", validation.username)}
                placeholder="Choose a username"
                className="border-meow-purple/30 text-purple-500 placeholder:text-purple-300 focus-visible:ring-purple-300"
                disabled={isLoading}
                aria-invalid={errors.username ? "true" : "false"}
              />
              {errors.username && (
                <p role="alert" className="text-red-300 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-purple-900"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email", validation.email)}
                placeholder="Enter your email"
                className="border-meow-purple/30 text-purple-500 placeholder:text-purple-300 focus-visible:ring-purple-300"
                disabled={isLoading}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p role="alert" className="text-red-300 text-sm">
                  {errors.email.message}
                </p>
              )}
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
                  {...register("password", validation.password)}
                  placeholder="Create a password"
                  className="border-meow-purple/30 text-purple-500 placeholder:text-purple-300 focus-visible:ring-purple-300 pr-10"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:cursor-pointer hover:bg-violet-50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p role="alert" className="text-red-300 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-purple-900"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", validation.confirmPassword)}
                  placeholder="Confirm your password"
                  className="border-meow-purple/30 text-purple-500 placeholder:text-purple-300 focus-visible:ring-purple-300 pr-10"
                  disabled={isLoading}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:cursor-pointer hover:bg-violet-50"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p role="alert" className="text-red-300 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-700 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
