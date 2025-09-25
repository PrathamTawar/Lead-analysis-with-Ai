import React, { useState } from "react";
import { Target, CheckCircle, Edit3, Loader, Tag } from "lucide-react";
import Button from "./Ui/Button";
import Card from "./Ui/Card";

const OfferForm = ({ offers, onSubmit, setOffers, onStartAI, isProcessing }) => {
  const [showForm, setShowForm] = useState(false);
  const [currentOffer, setCurrentOffer] = useState({
    name: "",
    value_props: "",
    ideal_use_cases: "",
    target_roles: [],
    target_industries: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const offerToSave = {
      ...currentOffer,
      target_roles: currentOffer.target_roles
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
      target_industries: currentOffer.target_industries
        .map((i) => i.trim())
        .filter((r) => r.length > 0),
    };
    try {
      await onSubmit(offerToSave);
      setOffers([...offers, currentOffer]);
      setCurrentOffer({
        name: "",
        value_props: "",
        ideal_use_cases: "",
        target_roles: [],
        target_industries: [],
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
      setShowForm(false);
    }
  };

  const isValid =
    currentOffer.name &&
    currentOffer.value_props &&
    currentOffer.ideal_use_cases;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Tag className="w-5 h-5 text-indigo-600" />
        All Offers/Products
      </h2>
      {/* Button to add new offer */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="primary">
          Add Offer
        </Button>
      )}

      {/* Offer Form */}
      {showForm && (
        <Card className="p-6">
          <div className="text-xl font-bold text-gray-900 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <h2>New Product/Offer Information</h2>
            </div>
            <p
              onClick={() => setShowForm(false)}
              className="text-red-500 cursor-pointer"
            >
              X
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product/Service Name *
              </label>
              <input
                type="text"
                value={currentOffer.name}
                onChange={(e) =>
                  setCurrentOffer({ ...currentOffer, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., AI-Powered CRM Platform"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Propositions *
              </label>
              <textarea
                value={currentOffer.value_props}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    value_props: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="e.g., Increases sales efficiency by 40%, Reduces manual data entry, Provides real-time analytics"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ideal Use Cases *
              </label>
              <textarea
                value={currentOffer.ideal_use_cases}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    ideal_use_cases: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                placeholder="e.g., Technology companies, SaaS platforms, E-commerce businesses"
                required
              />
            </div>
            {/* Target Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Roles (comma-separated)
              </label>
              <input
                type="text"
                value={currentOffer.target_roles.join(", ")}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    target_roles: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., CEO, CTO, Product Manager"
              />
            </div>

            {/* Target Industries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Industries (comma-separated)
              </label>
              <input
                type="text"
                value={currentOffer.target_industries.join(", ")}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    target_industries: e.target.value
                      .split(",")
                      .map((item) => item.trim()),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="e.g., SaaS, E-commerce, Fintech"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Save Offer
            </Button>
          </form>
        </Card>
      )}

      {/* Display all offers */}
      {offers?.map((offer) => (
        <Card key={offer.id} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              {offer.name}
            </h3>
          </div>

          <div className="text-gray-700 text-sm space-y-2">
            <p>
              <strong>Value Propositions:</strong> {offer.value_props}
            </p>
            <p>
              <strong>Ideal Use Cases:</strong> {offer.ideal_use_cases}
            </p>
          </div>

          <Button
            disabled={isProcessing}
            onClick={() => onStartAI(offer.id)}
            variant="primary"
            size="sm"
          >
            Start AI Intent of Leads
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default OfferForm;
