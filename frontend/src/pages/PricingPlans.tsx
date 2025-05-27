import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import api from "../api/axiosConfig";
import { Check, Calendar, User, Lock } from "lucide-react";
import BookingModal from "./BookingModal";

type MembershipPlan = {
  id: string;
  title: string;
  price: number;
  billingType: "Daily" | "Monthly" | string;
  includesVAT: boolean;
  isActive: boolean;
  description: string;
  additionalServices: string;
  created_At: string;
};

type BookingModalPlan = {
  id: string;
  title: string;
  price: string;
  billingType: "Daily" | "Monthly";
  description: string;
};

export default function PricingPlans() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<BookingModalPlan | null>(
    null
  );
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContactClick = () => {
    navigate("/contact");
  };

  const formatPrice = (price: number, billingType: string) => {
    let period = "month";

    if (billingType.toLowerCase() === "daily") period = "day";
    else if (billingType.toLowerCase() === "monthly") period = "month";
    else if (billingType.toLowerCase() === "yearly") period = "year";

    return `£${price.toFixed(2)}/${period}`;
  };

  useEffect(() => {
    setLoading(true);
    api
      .get("/Membership")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPlans(res.data);
        }
      })
      .catch((err) => {
        setError("Failed to load plans. Please try again.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePlanSelect = (plan: MembershipPlan) => {
    setSelectedPlan({
      id: plan.id,
      title: plan.title,
      price: formatPrice(plan.price, plan.billingType),
      billingType: plan.billingType as "Daily" | "Monthly",
      description: plan.description,
    });
  };

  const getPlanIcon = (title: string) => {
    if (title.includes("Daily"))
      return <Calendar className="w-6 h-6 text-blue-600" />;
    if (title.includes("Private"))
      return <Lock className="w-6 h-6 text-blue-600" />;
    return <User className="w-6 h-6 text-blue-600" />;
  };

  const getButtonText = (title: string) => {
    return title.includes("Events") ? "Book Now" : "Select Plan";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <section className="pt-32 pb-20 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl text-center">
            <h1 className="text-xl font-bold text-blue-600 mb-3">
              Pricing Plans
            </h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Plans that fit your needs
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-500 text-lg leading-relaxed">
                In addition to the four main starting plans below, we also offer
                virtual address membership, hordeek membership, floating desk
                membership, and other customizable & flexible options.
              </p>
            </div>
          </div>
        </section>

        <section className="pt-10 pb-20 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => {
                const formattedPrice = formatPrice(
                  plan.price,
                  plan.billingType
                );
                const isPopular = plan.title.includes("Desk");
                const features = plan.description.split(", ");

                return (
                  <div
                    key={plan.id}
                    className={`
                      border rounded-2xl p-6 transition-all flex flex-col h-full
                      ${
                        isPopular
                          ? "border-2 border-blue-500 shadow-lg relative overflow-hidden"
                          : "border-gray-200 hover:border-blue-300"
                      }
                    `}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR CHOICE
                      </div>
                    )}

                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        {getPlanIcon(plan.title)}
                        <h3 className="text-xl font-bold text-gray-900">
                          {plan.title}
                        </h3>
                      </div>

                      <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-900">
                          {formattedPrice.split("/")[0]}
                        </span>
                        <span className="text-gray-500">
                          /{formattedPrice.split("/")[1]}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          {plan.includesVAT ? "Including VAT" : "Without VAT"}
                        </p>
                      </div>

                      {plan.title.includes("Hosting") && (
                        <h4 className="font-medium text-gray-900 mb-3">
                          Presentation Equipment:
                        </h4>
                      )}
                      <ul className="space-y-3 mb-6">
                        {features.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.additionalServices && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {plan.title.includes("Desk")
                              ? "Get it all with our package:"
                              : "Additional Services:"}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {plan.additionalServices}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handlePlanSelect(plan)}
                      className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition mt-auto"
                    >
                      {getButtonText(plan.title)}
                    </button>
                  </div>
                );
              })}
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
          onSuccess={() => {
            console.log("✅ Membership confirmed");
            // optional: refetch or redirect logic here
          }}
        />
      )}

      <Footer />
    </>
  );
}
