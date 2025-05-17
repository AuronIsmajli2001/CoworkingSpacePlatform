import { useState } from 'react';

type PaymentModalProps = {
  total: number;
  onConfirm: (method: 'Online' | 'OnSite') => void;
  onClose: () => void;
};

export const PaymentModal = ({ total, onConfirm, onClose }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'Online' | 'OnSite'>();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Complete Payment (€{total})</h2>
        
        <div className="space-y-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              onChange={() => setSelectedMethod('Online')}
            />
            <span>Pay Online (Credit Card)</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              onChange={() => setSelectedMethod('OnSite')}
            />
            <span>Pay On-Site (Cash/Card)</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onConfirm(selectedMethod!)}
            disabled={!selectedMethod}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Confirm Payment
          </button>
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};