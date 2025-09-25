import { React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Zap } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Button from "./Ui/Button";

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/auth");
  };

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 absolute w-full z-10 top-0 max-h-24">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl cursor-pointer"
            >
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
                Lead Intent Platform
              </h1>
              <p className="text-xs text-gray-600">
                AI-powered lead scoring system
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    System Ready
                  </span>
                </div>
                <Button onClick={() => navigate("/dashboard")}>DashBoard</Button>
                <Button onClick={handleLogoutClick}> Logout </Button>
              </>
            ) : (
              <>
                <Button onClick={handleRegisterClick}> Login </Button>
                <Button onClick={handleRegisterClick}> SignUp </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
