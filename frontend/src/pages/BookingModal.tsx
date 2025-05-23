import { useState } from 'react';
import { X, Calendar, CreditCard, Building, Check } from 'lucide-react';

type BookingModalProps = {
  plan: {
    id: number;
    title: string;
    price: string;
    billingType: 'Daily' | 'Monthly';
    description: string;
    includesVAT?: boolean;
    additionalServices?: string;
  };
  onClose: () => void;
};

export default function BookingModal({ plan, onClose }: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'card' | null>(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Extract numeric price
  const priceValue = Number(plan.price.replace(/[^0-9.-]+/g, ''));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
          <h3 className="text-xl font-bold">{plan.title} Membership</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {step === 'details' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Membership Details</h4>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{plan.title}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">{plan.price}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Billing Cycle:</span>
                  <span className="font-medium">{plan.billingType}</span>
                </p>
                {plan.includesVAT && (
                  <p className="flex justify-between">
                    <span className="text-gray-600">VAT:</span>
                    <span className="font-medium">Included</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-2">What's Included</h4>
              <ul className="space-y-2">
                {plan.description.split(', ').map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {plan.additionalServices && (
              <div>
                <h4 className="font-bold mb-2">Additional Services</h4>
                <p className="text-gray-600">{plan.additionalServices}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-bold mb-2">Terms & Conditions</h4>
              <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto text-sm">
                <p className="mb-2">1. This membership will automatically renew at the end of each billing period.</p>
                <p className="mb-2">2. You may cancel anytime before your next billing date.</p>
                <p className="mb-2">3. All payments are non-refundable.</p>
                <p className="mb-2">4. Membership access begins immediately after payment confirmation.</p>
                <p>5. Violation of our community guidelines may result in membership termination.</p>
              </div>
              <div className="mt-3 flex items-center">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="termsCheckbox" className="text-sm">
                  I agree to the terms and conditions
                </label>
              </div>
            </div>

            <button
              onClick={() => setStep('payment')}
              disabled={!acceptedTerms}
              className={`w-full py-3 rounded-lg mt-4 ${
                !acceptedTerms ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'
              }`}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <p className="text-sm">{plan.title} - {plan.price}</p>
              <div className="flex justify-between font-bold mt-2">
                <span>Total:</span>
                <span>{plan.price}</span>
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

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setStep('details')}
                className="flex-1 py-3 border border-gray-300 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => {
                  onClose();
                  alert(`Membership confirmed! Thank you for joining ${plan.title}`);
                }}
                disabled={!paymentMethod || (paymentMethod === 'card' && !cardDetails.number)}
                className={`flex-1 py-3 rounded-lg ${
                  (!paymentMethod || (paymentMethod === 'card' && !cardDetails.number))
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white'
                }`}
              >
                Confirm Membership
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}