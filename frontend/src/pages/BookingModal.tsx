import { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, Building, Plus, Minus } from 'lucide-react';

type BookingModalProps = {
  plan: {
    id: number;
    title: string;
    price: string;
    billingType: 'Daily' | 'Monthly';
    description: string;
  };
  onClose: () => void;
};

type ExtraItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function BookingModal({ plan, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'selection' | 'payment'>('selection');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'card' | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const availableExtras: ExtraItem[] = [
    { id: '1', name: 'Additional Monitor', price: 15, quantity: 0 },
    { id: '2', name: 'Whiteboard', price: 10, quantity: 0 },
    { id: '3', name: 'Video Conference Setup', price: 20, quantity: 0 },
    { id: '4', name: 'Professional Cleaning', price: 25, quantity: 0 }
  ];

  const [extras, setExtras] = useState<ExtraItem[]>(availableExtras);

  // Calculate base price from plan.price (extract numbers)
  const basePrice = Number(plan.price.replace(/[^0-9.-]+/g, ''));

  // Calculate total
  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
  const total = basePrice + extrasTotal;

  const handleExtraChange = (id: string, change: number) => {
    setExtras(prev => prev.map(extra => 
      extra.id === id 
        ? { ...extra, quantity: Math.max(0, extra.quantity + change) } 
        : extra
    ));
  };

  const handleConfirmBooking = () => {
    console.log({
      planId: plan.id,
      date: selectedDate,
      extras: extras.filter(e => e.quantity > 0),
      paymentMethod,
      total
    });
    onClose();
    alert(`Booking confirmed for €${total}!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{plan.title} Booking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {step === 'selection' && (
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Calendar className="text-blue-500" /> Booking Date
              </h4>
              <input
                type={plan.billingType === 'Monthly' ? 'month' : 'date'}
                className="w-full p-2 border rounded-lg"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>

            {/* Additional Equipment */}
            <div>
              <h4 className="font-medium mb-3">Additional Equipment</h4>
              <div className="space-y-3">
                {extras.map((extra) => (
                  <div key={extra.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{extra.name}</p>
                      <p className="text-sm text-gray-500">€{extra.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleExtraChange(extra.id, -1)}
                        disabled={extra.quantity === 0}
                        className="p-1 rounded-full bg-gray-100 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{extra.quantity}</span>
                      <button 
                        onClick={() => handleExtraChange(extra.id, 1)}
                        className="p-1 rounded-full bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Display */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-1">
                <span>Base Price:</span>
                <span>€{basePrice}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Extras:</span>
                <span>€{extrasTotal}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>€{total}</span>
              </div>
            </div>

            <button
              onClick={() => setStep('payment')}
              disabled={!selectedDate}
              className={`w-full py-3 rounded-lg mt-2 ${
                !selectedDate ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <p className="text-sm">{plan.title} - {plan.price}</p>
              {extras.filter(e => e.quantity > 0).map(extra => (
                <p key={extra.id} className="text-sm">
                  {extra.name} x{extra.quantity} - €{extra.price * extra.quantity}
                </p>
              ))}
              <div className="flex justify-between font-bold mt-2">
                <span>Total:</span>
                <span>€{total}</span>
              </div>
            </div>

            <h4 className="font-medium">Select Payment Method</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('onsite')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'onsite' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <Building className="text-blue-500 mb-2" />
                Pay Onsite
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border rounded-lg flex flex-col items-center ${
                  paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <CreditCard className="text-blue-500 mb-2" />
                Card Payment
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full p-2 border rounded-lg"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-2 border rounded-lg"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="p-2 border rounded-lg"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmBooking}
              disabled={!paymentMethod || (paymentMethod === 'card' && !cardDetails.number)}
              className={`w-full py-3 rounded-lg mt-4 ${
                (!paymentMethod || (paymentMethod === 'card' && !cardDetails.number))
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 text-white'
              }`}
            >
              Confirm Booking (€{total})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}