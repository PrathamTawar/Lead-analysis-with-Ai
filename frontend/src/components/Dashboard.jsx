import React, { useState, useEffect } from "react";
import OfferForm from "./OfferForm";
import FileUpload from "./FileUpload";
import StatsCards from "./StatsCards";
import ResultsTable from "./ResultsTable";
import apiService from "../services/apiService";
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [Offers, setOffers] = useState([]);
  const [leads, setLeads] = useState([])
  const [results, setResults] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterIntent, setFilterIntent] = useState("all"); // offer, upload, process, results
  const [offerId, setOfferId] = useState(null);


  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await apiService.getResults();
        setResults(data);
      } catch (err) {
        console.error(err);
      }
    };
    const loadOffers = async () => {
      try {
        const data = await apiService.getOffers();
        setOffers(data);
      } catch (err) {
        console.error(err);
      }
    };
    const loadLeads = async () => {
      try {
        const data = await apiService.getLeads();
        setLeads(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadLeads();
    loadOffers();
    loadResults();
  }, []);

  const handleOfferSubmit = async (offer) => {
    try {
      const res = await apiService.postOffer(offer);
      setOfferId(res.order_id || res.id);
      toast.success('Offer saved successfully!');
      setOffers((prevOffers) => [...prevOffers, res]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setUploadProgress(0);
      const res = await apiService.uploadCsvFile(file, (progress) =>
        setUploadProgress(progress)
      );
      console.log(res)
      res.leads.map((lead)=>setLeads((prevLeads)=>[...prevLeads,lead]))
      toast.success('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      setUploadProgress(0);
    }
  };

  const handleProcessLeads = async (offerId) => {
    try {
      setIsProcessing(true);
      const scoredLeads = await apiService.getAiScore(offerId);
      setResults(scoredLeads.results);
    } catch (err) {
      toast.error(err.response?.data || "Failed to score leads.");
      console.error(err.response.data);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredResults = results.filter(
    (r) => filterIntent === "all" || r.ai_intent === filterIntent
  );

  const getStats = () => ({
    total: leads.length,
    high: results.filter((r) => r.ai_intent === "High").length,
    medium: results.filter((r) => r.ai_intent === "Medium").length,
    low: results.filter((r) => r.ai_intent === "Low").length,
    offers: Offers.length,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Stats Cards */}
      <StatsCards stats={getStats()} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Left Column: Forms & Upload */}
        <div className="space-y-8">
          <OfferForm
            offers={Offers}
            setOffers={setOffers}
            onSubmit={handleOfferSubmit}
            onStartAI={handleProcessLeads}
            isProcessing={isProcessing}
          />

          <FileUpload
            onFileUpload={handleFileUpload}
            uploadProgress={uploadProgress}
          />
        </div>

        {/* Right Column: Results Table */}
        <div className="space-y-8">
          <ResultsTable
            results={filteredResults}
            filterIntent={filterIntent}
            onFilterChange={setFilterIntent}
            showFilters={results.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
