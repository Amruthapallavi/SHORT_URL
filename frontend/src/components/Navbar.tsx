import { Link, useNavigate } from "react-router-dom";
import { Settings, LogOut, Link as LinkIcon } from "lucide-react";
import { userService } from "../services/userServices";
import { notifyError, notifySuccess } from "../utils/notify";

const Navbar = () => {

 const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await userService.logout();
      notifySuccess("Logged Out")
      navigate("/login", { replace: true }); 
    } catch (error) {
      console.error("Logout failed", error);
      notifyError("Logout Failed")
    }
  };
  return (
    <header className="flex justify-between items-center p-4 border-b border-[#98878F]/30 bg-black/20 backdrop-blur-lg sticky top-0 z-10">
      <Link to="/" className="flex items-center space-x-2">
        <div className="p-2 bg-gradient-to-br from-[#98878F] to-[#847379] rounded-xl">
          <LinkIcon className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-[#98878F] to-[#b8a8af] bg-clip-text">
          ShortLink
        </h1>
      </Link>
      <nav className="flex items-center space-x-4 text-sm">
        <Link to="#" className="hover:text-[#98878F] flex items-center gap-1">
          <Settings className="w-4 h-4" /> Settings
        </Link>
       <button
  onClick={handleLogout}
  className="hover:text-[#98878F] flex items-center gap-1 text-sm"
>
  <LogOut className="w-4 h-4" /> Logout
</button>

      </nav>
    </header>
  );
};

export default Navbar;
