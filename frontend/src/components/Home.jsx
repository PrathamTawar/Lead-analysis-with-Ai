import React from "react";
import { useNavigate } from "react-router-dom";
import { Target, Zap } from "lucide-react";
import Button from "../components/Ui/Button";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/auth"); // redirect to login/signup page
  };

  const cardDetails = [
    {
      title: "Capture Offer Info",
      desc: "Enter product/offer details to start qualifying leads.",
    },
    {
      title: "Upload Leads",
      desc: "Upload a CSV file of your prospects to analyze their intent.",
    },
    {
      title: "AI Scoring",
      desc: "Use rule-based + AI logic to score leads and display results instantly.",
    },
  ];

  return (
    <div className="pb-2 min-h-screen pt-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-2">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Lead Intent Platform
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          AI-powered lead scoring system to prioritize prospects effectively.
        </p>
        <Button variant="primary" size="lg" onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 mt-16 grid md:grid-cols-3 gap-8 text-center">
        {cardDetails.map((card, index) => (
          <div
            key={index} // Add a unique key
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Dashboard CTA Section */}
      <div className="flex items-center justify-center mx-auto px-4 mt-24 text-center">
        <div className="bg-indigo-600 text-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to prioritize your leads?
          </h2>
          <p className="text-gray-100 mb-6">
            Start by logging in or signing up to manage your offers and leads.
          </p>
          <Button variant="secondary" size="lg" onClick={handleGetStarted}>
            Login / Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
