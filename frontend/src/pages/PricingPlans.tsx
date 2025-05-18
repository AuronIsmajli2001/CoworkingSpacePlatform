import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api/axiosConfig";
import { Check, Calendar, User, Lock } from "lucide-react";
import BookingModal from "./BookingModal";

type MembershipPlan = {
  id: number;
  title: string;
  price: string;
  billingType: 'Daily' | 'Monthly'; // Add this
  includesVAT: boolean;
  description: string;
  additionalServices: string;
  features: string[];
  isPopular?: boolean;
};

export default function PricingPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
   const handleContactClick = () => {
    navigate("/contact");
  };
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    api.get("/api/Membership")
      .then((res) => {
        if (Array.isArray(res.data)) {
            setPlans(
              res.data.map((plan: any) => ({
                id: plan.id,
                title: plan.title,
                price: plan.price,
                billingType: plan.billingType as 'Daily' | 'Monthly', 
                includesVAT: plan.includesVAT,
                description: plan.description,
                additionalServices: plan.additionalServices,
                features: plan.description.split(', '),
                isPopular: plan.title.includes("Desk")
              }))
            );
        }
      })
      .catch(console.error);
  }, []);

  const getPlanIcon = (title: string) => {
    if (title.includes("Daily")) return <Calendar className="w-6 h-6 text-blue-600" />;
    if (title.includes("Private")) return <Lock className="w-6 h-6 text-blue-600" />;
    return <User className="w-6 h-6 text-blue-600" />;
  };

  // Ensure consistent button text
  const getButtonText = (title: string) => {
    return title.includes("Events") ? "Book Now" : "Select Plan";
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 bg-gray-50"> 
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <h1 className="text-xl font-bold text-blue-600 mb-3">Pricing Plans</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Plans that fit your needs</h2>
        <div className="max-w-4xl mx-auto"> 
          <p className="text-gray-500 text-lg leading-relaxed"> 
            In addition to the four main starting plans below, we also offer virtual address membership,
            hordeek membership, floating desk membership, and other customizable & flexible options.
          </p>
        </div>
      </div>
    </section>

        {/* Cards with perfectly aligned buttons */}
        <section className="pt-10 pb-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`
                    border rounded-2xl p-6 transition-all flex flex-col h-full
                    ${plan.isPopular 
                      ? "border-2 border-blue-500 shadow-lg relative overflow-hidden" 
                      : "border-gray-200 hover:border-blue-300"
                    }
                  `}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR CHOICE
                    </div>
                  )}

                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      {getPlanIcon(plan.title)}
                      <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                    </div>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-gray-900">{plan.price.split('/')[0]}</span>
                      <span className="text-gray-500">/{plan.price.split('/')[1] || 'month'}</span>
                      <p className="text-sm text-gray-500 mt-1">
                        {plan.includesVAT ? "Including VAT" : "Without VAT"}
                      </p>
                    </div>

                    {plan.title.includes("Hosting") && (
                      <h4 className="font-medium text-gray-900 mb-3">Presentation Equipment:</h4>
                    )}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.additionalServices && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {plan.title.includes("Desk") ? "Get it all with our package:" : "Additional Services:"}
                        </h4>
                        <p className="text-gray-600 text-sm">{plan.additionalServices}</p>
                      </div>
                    )}
                  </div>

                 <button
                        onClick={() => setSelectedPlan(plan)}
                        className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition mt-auto"
                      >
                        {getButtonText(plan.title)}
                      </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>




 <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our team is happy to help you choose the perfect plan.
          </p>
          <button
            onClick={handleContactClick}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Contact Us
          </button>
        </div>
      </section>

          {selectedPlan && (
          <BookingModal 
            plan={selectedPlan} 
            onClose={() => setSelectedPlan(null)} 
          />
        )}      


      <Footer />
    </>
  );
}