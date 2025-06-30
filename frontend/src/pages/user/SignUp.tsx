import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as LinkIcon, Mail, Lock, User } from "lucide-react";
import { userService } from "../../services/userServices";
import { notifyError } from "../../utils/notify";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
      } else if (value.length > 10) {
        setPasswordError("Password must not exceed 10 characters.");
      } else {
        setPasswordError("");
      }

      if (confirmPassword && value !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
      } else {
        setConfirmPasswordError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (formData.password !== value) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      alert(passwordError);
      return;
    }
    if (confirmPasswordError) {
      alert(confirmPasswordError);
      return;
    }
    if (!confirmPassword) {
      alert("Please confirm your password.");
      return;
    }
    if (formData.password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await userService.signup(formData);

      toast.success("Successfully Registered...Please login to continue !")
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      let errorMessage = "Login failed. Please try again.";

       if (error && typeof error === "object" && "response" in error) {
  const err = error as any;
  errorMessage = err.response?.data?.message || errorMessage;
}

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
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-[#98878F]">Join thousands of users managing their links</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#98878F] block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-[#98878F]" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 h-12 w-full bg-[#494E6B]/50 border-2 border-[#98878F]/20 focus:border-[#98878F] rounded-lg text-white placeholder:text-gray-400 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 h-12 w-full bg-[#494E6B]/50 border-2 rounded-lg text-white placeholder:text-gray-400 backdrop-blur-sm ${
                    passwordError ? "border-red-500 focus:border-red-500" : "border-[#98878F]/20 focus:border-[#98878F]"
                  }`}
                  required
                />
              </div>
              {passwordError && <p className="text-red-400 text-xs mt-1">{passwordError}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#98878F] block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#98878F]" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`pl-10 h-12 w-full bg-[#494E6B]/50 border-2 rounded-lg text-white placeholder:text-gray-400 backdrop-blur-sm ${
                    confirmPasswordError ? "border-red-500 focus:border-red-500" : "border-[#98878F]/20 focus:border-[#98878F]"
                  }`}
                  required
                />
              </div>
              {confirmPasswordError && <p className="text-red-400 text-xs mt-1">{confirmPasswordError}</p>}
            </div>

            <div className="flex items-center space-x-2">
            
             
            </div>

            <button
              type="submit"
              disabled={isLoading || !!passwordError || !!confirmPasswordError}
              className="w-full h-12 bg-gradient-to-r from-[#494E6B] to-[#98878F] hover:from-[#3d4159] hover:to-[#847379] text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#98878F]">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:text-[#98878F] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
