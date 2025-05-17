import React, { useState } from "react";
import Header from "../components/Header";
import {
  Check,
  Zap,
  Star,
  Coffee,
  User,
  Clock,
  Calendar,
  Printer,
  Wifi,
  Lock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Wallet,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";

type Plan = {
  id: string;
  title: string;
  price: number;
  period: 'day' | 'month';
  vatIncluded: boolean;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  addOns?: AddOn[];
};

type AddOn = {
  id: string;
  name: string;
  price: number;
  description: string;
  maxQuantity?: number;
};

const PricingPlans = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDuration, setBookingDuration] = useState(1);

 
  const plans: Plan[] = [
    {
      id: 'daily',
      title: 'Daily Plan',
      price: 20,
      period: 'day',
      vatIncluded: true,
      features: [
        "Designated desk & chair",
        "High-speed WiFi",
        "Meeting room access",
        "Printing & scanner access",
        "Kitchen access",
        "Coffee, tea & water",
      ],
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      addOns: [
        {
          id: 'projector',
          name: 'Projector',
          price: 10,
          description: 'HD projector for presentations',
          maxQuantity: 2
        },
        {
          id: 'monitor',
          name: 'Monitor',
          price: 3,
          description: 'Additional monitor',
        },
        {
          id: 'parking',
          name: 'Parking Spot',
          price: 3,
          description: 'Dedicated parking space for the day',
        }
      ]
    },
    {
      id: 'desk',
      title: 'Desk Plans',
      price: 99,
      period: 'month',
      vatIncluded: false,
      features: [
        "24/7 space access",
        "Desk & ergonomic chair",
        "High-speed WiFi",
        "Meeting room use",
        "Printing & scanning",
        "Kitchen perks",
        "Coffee bar access",
        "Easy-to-use booking app",
      ],
      popular: true,
      icon: <User className="w-6 h-6 text-blue-600" />,
    },
    {
      id: 'events',
      title: 'Hosting Events',
      price: 149,
      period: 'day',
      vatIncluded: false,
      features: [
        "Wi-Fi",
        "HD Projector & Screen",
        "Chairs & tables",
        "Sound system",
      ],
      icon: <User className="w-6 h-6 text-blue-600" />,
      addOns: [
        {
          id: 'catering',
          name: 'Catering',
          price: 50,
          description: 'In-house catering service',
        },
        {
          id: 'extra-chairs',
          name: 'Extra Chairs',
          price: 3,
          description: 'Additional chairs (per chair)',
        },
        {
          id: 'photographer',
          name: 'Photographer',
          price: 100,
          description: 'Professional event photography',
        }
      ]
    },
    {
      id: 'private',
      title: 'Private Office',
      price: 350,
      period: 'month',
      vatIncluded: false,
      features: [
        "Team of 2-3 people",
        "Designated private office",
        "24/7 space access",
        "Desks & ergonomic chairs",
        "High-speed WiFi",
        "Printing & scanning",
        "Kitchen perks",
        "Coffee bar access",
      ],
      icon: <Lock className="w-6 h-6 text-blue-600" />,
    }
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleContactClick = () => {
    navigate("/contact");
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setSelectedAddOns({});
    setBookingDate('');
    setBookingDuration(1);
  };

  const handleAddOnChange = (addOnId: string, quantity: number) => {
    setSelectedAddOns(prev => {
      if (quantity === 0) {
        const newState = {...prev};
        delete newState[addOnId];
        return newState;
      }
      return {...prev, [addOnId]: quantity};
    });
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    
    let total = selectedPlan.price;
    if (selectedPlan.period === 'day') {
      total *= bookingDuration;
    }
    
    Object.entries(selectedAddOns).forEach(([addOnId, quantity]) => {
      const addOn = selectedPlan.addOns?.find(a => a.id === addOnId);
      if (addOn) {
        total += addOn.price * quantity;
      }
    });
    
    return total;
  };

  const handleBookingSubmit = () => {
    const bookingData = {
      plan: selectedPlan?.title,
      date: bookingDate,
      duration: bookingDuration,
      addOns: selectedAddOns,
      totalPrice: calculateTotal()
    };
    
    console.log('Booking submitted:', bookingData);
    alert(`Booking confirmed for ${selectedPlan?.title}! Total: €${calculateTotal()}`);
    setSelectedPlan(null);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative py-32 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full mb-4">
            PRICING PLANS
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Plans that fit <span className="text-blue-600">your needs</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            In addition to our main plans, we offer virtual addresses, hot
            desks, and customizable options.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`border ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'} rounded-2xl p-6 transition-all relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR CHOICE
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  {plan.icon}
                  <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    €{plan.price}
                  </span>
                  <span className="text-gray-500">/{plan.period}</span>
                  <p className="text-sm text-gray-500 mt-1">
                    {plan.vatIncluded ? 'Including VAT' : 'Without VAT'}
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                {plan.addOns && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Additional Equipments:
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {plan.addOns.map(a => a.name).join(', ')} available
                    </p>
                  </div>
                )}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-3 px-6 ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'} font-medium rounded-lg transition`}
                >
                  {plan.period === 'month' ? 'Get Started' : 'Book now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Book {selectedPlan.title}
              </h2>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Plan Details</h3>
              <p className="text-gray-700">
                <span className="font-semibold">Price:</span> €{selectedPlan.price}/{selectedPlan.period}
                {selectedPlan.vatIncluded ? ' (VAT included)' : ' (VAT not included)'}
              </p>
              <ul className="mt-2 space-y-1">
                {selectedPlan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedPlan.period === 'day' && (
              <>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Duration (days)
                  </label>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setBookingDuration(Math.max(1, bookingDuration - 1))}
                      className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 bg-gray-100 rounded-lg">
                      {bookingDuration}
                    </span>
                    <button 
                      onClick={() => setBookingDuration(bookingDuration + 1)}
                      className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {selectedPlan.addOns && selectedPlan.addOns.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Additional Equipment
                </h3>
                <div className="space-y-4">
                  {selectedPlan.addOns.map((addOn) => (
                    <div key={addOn.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium">{addOn.name}</h4>
                        <p className="text-sm text-gray-600">{addOn.description}</p>
                        <p className="text-sm font-medium mt-1">€{addOn.price} {addOn.maxQuantity ? '/unit (max ' + addOn.maxQuantity + ')' : '/unit'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAddOnChange(addOn.id, (selectedAddOns[addOn.id] || 0) - 1)}
                          disabled={!selectedAddOns[addOn.id]}
                          className="p-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">
                          {selectedAddOns[addOn.id] || 0}
                        </span>
                        <button 
                          onClick={() => handleAddOnChange(addOn.id, (selectedAddOns[addOn.id] || 0) + 1)}
                          disabled={addOn.maxQuantity ? (selectedAddOns[addOn.id] || 0) >= addOn.maxQuantity : false}
                          className="p-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Subtotal:</span>
                <span>€{selectedPlan.price * (selectedPlan.period === 'day' ? bookingDuration : 1)}</span>
              </div>
              
              {Object.keys(selectedAddOns).length > 0 && (
                <div className="mb-2">
                  <p className="font-medium mb-1">Add-ons:</p>
                  <ul className="space-y-1 pl-4">
                    {Object.entries(selectedAddOns).map(([addOnId, quantity]) => {
                      const addOn = selectedPlan.addOns?.find(a => a.id === addOnId);
                      if (!addOn) return null;
                      return (
                        <li key={addOnId} className="flex justify-between">
                          <span>{addOn.name} (x{quantity})</span>
                          <span>€{addOn.price * quantity}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-lg">€{calculateTotal()}</span>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              className="w-full mt-6 py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              disabled={selectedPlan.period === 'day' && !bookingDate}
            >
              {selectedPlan.period === 'month' ? 'Start Membership' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
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

       {/* Footer */}
          <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-6 py-16 grid gap-12 md:grid-cols-3">
              {/* 1️⃣ Logo + Desc */}
              <div className="space-y-6">
                <h2 className="text-3xl font-extrabold tracking-wider">
                  Co<span className="text-blue-500">Space</span>
                </h2>
                <p className="max-w-xs text-sm text-neutral-300">
                  Work for yourself, not by yourself. Flexible, connected,
                  inspiring.
                </p>
              </div>
    
              {/* 2️⃣ Socials + Payments */}
              <div className="space-y-10">
                <div>
                  <h4 className="text-2xl font-semibold mb-4">Our Socials</h4>
                  <p className="text-white text-[16px] mb-6">
                    A monthly digest of the latest news and resources.
                  </p>
                  <div className="flex gap-3">
                    {[Facebook, Instagram, Twitter, Linkedin, Youtube].map(
                      (Icon, i) => (
                        <a
                          key={i}
                          href="#"
                          className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition"
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </a>
                      )
                    )}
                  </div>
                </div>
    
                <div>
                  <h4 className="text-2xl font-semibold mb-4">Payment Methods</h4>
                  <div className="flex gap-3">
                    {[CreditCard, Wallet].map((Icon, i) => (
                      <span
                        key={i}
                        className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
    
              {/* 3️⃣ Contacts */}
              <div className="space-y-8">
                <h4 className="text-2xl font-semibold">Our Contacts</h4>
                {[
                  { icon: MapPin, text: "10 B St, Prishtinë, 10000" },
                  { icon: Mail, text: "info@cospace.com" },
                  { icon: Phone, text: "+383 48 739 738" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
    
            {/* Bottom Bar */}
            <div className="border-t border-neutral-700 text-sm flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-6 container mx-auto">
              <span>
                © {new Date().getFullYear()} CoSpace. All rights reserved.
              </span>
              <a href="#" className="hover:text-neutral-400">
                Terms of use
              </a>
            </div>
          </footer>
    </>
  );
};

export default PricingPlans;