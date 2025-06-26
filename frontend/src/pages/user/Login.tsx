import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as LinkIcon, Mail, Lock } from "lucide-react";
import { userService } from "../../services/userServices";
import { notifySuccess, notifyError } from "../../utils/notify";
import { useAuth } from "../../hook/useAuth";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
const { setUser } = useAuth();

 useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const { token, user, message } = await userService.login(formData);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  setUser(user);
    notifySuccess(message || "Login successful!");

    navigate("/dashboard", { replace: true });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
    notifyError(errorMessage);
  } finally {
    setIsLoading(false); 
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#494E6B] via-[#3d4159] to-[#2a2d42] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-[#98878F] to-[#847379] rounded-xl group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <LinkIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#98878F] to-[#b8a8af] bg-clip-text text-transparent">
              ShortLink
            </span>
          </Link>
        </div>

        <div className="rounded-xl border border-[#98878F]/20 shadow-2xl bg-black/20 backdrop-blur-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-[#98878F]">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#98878F] block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#98878F]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12 w-full bg-[#494E6B]/50 border-2 border-[#98878F]/20 focus:border-[#98878F] rounded-lg text-white placeholder:text-gray-400 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#98878F] block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#98878F]" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 h-12 w-full bg-[#494E6B]/50 border-2 border-[#98878F]/20 focus:border-[#98878F] rounded-lg text-white placeholder:text-gray-400 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-[#98878F] text-[#98878F] focus:ring-[#98878F]"
                />
                <span className="text-sm text-[#98878F]">Remember me</span>
              </label>
             
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#494E6B] to-[#98878F] hover:from-[#3d4159] hover:to-[#847379] text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Signup link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#98878F]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white hover:text-[#98878F] font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
