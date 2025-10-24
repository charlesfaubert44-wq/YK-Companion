'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function AddSaleButton() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!user) {
      alert('Please sign in to add a garage sale');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-lg hover:shadow-aurora transition-all flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Add Your Sale
      </button>

      {/* TODO: Implement Add Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl p-8 max-w-2xl w-full border border-aurora-green/20">
            <h2 className="text-2xl font-bold text-white mb-4">Add Your Garage Sale</h2>
            <p className="text-gray-400">Form coming soon...</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
