import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {Check,User,Calendar,Lock,Wallet,CreditCard,X,Plus,Minus} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "../utils/auth";
import { reservationApi } from "../api/reservationApi";
import { getCurrentUser } from "../api/authApi";
import { membershipApi } from "../api/membershipApi";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

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
    setBookingSuccess(false);
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
    if (!selectedPlan || !bookingDate) return;
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelect = (method: 'Online' | 'OnSite') => {
    if (method === 'Online') {
      setShowCardForm(true);
    } else {
      handlePaymentConfirm(method);
    }
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate the card details here
    handlePaymentConfirm('Online');
  };

  const handlePaymentConfirm = async (method: 'Online' | 'OnSite') => {
    try {
      const currentUser = await getCurrentUser();
      const total = calculateTotal();

      if (selectedPlan?.period === 'month') {
        await membershipApi.createMembership({
          type: selectedPlan.id,
          price: total,
          paymentMethod: method,
          isPaid: method === 'Online' // Assuming online payments are immediately processed
        });
      } else {
        await reservationApi.createReservation({
          userId: currentUser.id,
          spaceId: "default-space-id",
          startDateTime: new Date(bookingDate).toISOString(),
          endDateTime: new Date(
            new Date(bookingDate).getTime() + 
            (bookingDuration * 24 * 60 * 60 * 1000)
          ).toISOString(),
          paymentMethod: method,
          isPaid: method === 'Online',
          status: 'Confirmed'
        });
      }

      setBookingSuccess(true);
      setShowPaymentModal(false);
      setShowCardForm(false);
    } catch (error) {
      alert(`Payment failed: ${error.message}`);
    }
  };

  const resetBookingFlow = () => {
    setSelectedPlan(null);
    setBookingSuccess(false);
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
                  className={`flex flex-col justify-between border ${plan.popular ? 'border-2 border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'} rounded-2xl p-6 transition-all relative`}
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
      {selectedPlan && !bookingSuccess && (
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
              {selectedPlan.period === 'month' ? 'Start Membership' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Options Modal */}
      {showPaymentModal && !showCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <button
                onClick={() => handlePaymentMethodSelect('Online')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Pay with Card</span>
                </div>
                <span className="text-gray-500">Visa, Mastercard, etc.</span>
              </button>

              <button
                onClick={() => handlePaymentMethodSelect('OnSite')}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <span className="font-medium">Pay On Site</span>
                </div>
                <span className="text-gray-500">Cash or card at our office</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card Payment Form */}
      {showCardForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Card Payment</h2>
              <button 
                onClick={() => {
                  setShowCardForm(false);
                  setShowPaymentModal(true);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCardSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">€{calculateTotal()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Confirm Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your {selectedPlan?.title.toLowerCase()} has been confirmed.
              {selectedPlan?.period === 'month' ? ' Welcome to our coworking space!' : 
               ' We look forward to seeing you!'}
            </p>
            <button
              onClick={resetBookingFlow}
              className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Done
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

      <Footer/>
    </>
  );
};

export default PricingPlans;