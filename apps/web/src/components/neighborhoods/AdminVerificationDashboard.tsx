'use client';

import { useState } from 'react';

/**
 * AdminVerificationDashboard - Admin interface for reviewing verification requests
 *
 * Features:
 * - Pending verification queue
 * - Document viewer
 * - Approval/rejection workflow
 * - Vouching system review
 * - Activity logging
 * - Filters and search
 */

interface VerificationRequest {
  id: string;
  userName: string;
  userInitial: string;
  neighborhood: string;
  address: string;
  moveInDate: string;
  residencyType: 'homeowner' | 'renter';
  submittedDays: number;
  documentType: string;
  hasDocuments: boolean;
  vouchedBy: Array<{ name: string; verified: boolean }>;
  accountAge: string;
  activityLevel: string;
  redFlags: string[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
}

// Mock data
const MOCK_REQUESTS: VerificationRequest[] = [
  {
    id: '1',
    userName: 'Jennifer Martinez',
    userInitial: 'J',
    neighborhood: 'Range Lake',
    address: '4802 - 52nd Avenue',
    moveInDate: 'January 2024',
    residencyType: 'renter',
    submittedDays: 3,
    documentType: 'Power Bill & Lease Agreement',
    hasDocuments: true,
    vouchedBy: [],
    accountAge: '6 months',
    activityLevel: '12 posts, 8 comments',
    redFlags: [],
    status: 'pending',
  },
  {
    id: '2',
    userName: 'David Chen',
    userInitial: 'D',
    neighborhood: 'Old Town',
    address: '4 Lessard Drive',
    moveInDate: 'March 2024',
    residencyType: 'homeowner',
    submittedDays: 1,
    documentType: 'Neighbor Vouching',
    hasDocuments: false,
    vouchedBy: [
      { name: 'Sarah Thompson', verified: true },
      { name: 'Mike Roberts', verified: true },
    ],
    accountAge: '3 months',
    activityLevel: '5 posts, 12 comments',
    redFlags: [],
    status: 'pending',
  },
  {
    id: '3',
    userName: 'Alex Johnson',
    userInitial: 'A',
    neighborhood: 'Niven Lake',
    address: '102 Baffin Road',
    moveInDate: 'December 2023',
    residencyType: 'homeowner',
    submittedDays: 7,
    documentType: 'Property Tax Notice',
    hasDocuments: true,
    vouchedBy: [],
    accountAge: '2 weeks',
    activityLevel: 'No activity',
    redFlags: ['New account', 'No prior activity'],
    status: 'pending',
  },
];

export default function AdminVerificationDashboard() {
  const [requests, setRequests] = useState<VerificationRequest[]>(MOCK_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [filterNeighborhood, setFilterNeighborhood] = useState('all');
  const [sortBy, setSortBy] = useState<'oldest' | 'newest'>('oldest');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = async (requestId: string) => {
    setActionInProgress(true);

    // Simulate API call
    setTimeout(() => {
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setSelectedRequest(null);
      setActionInProgress(false);
    }, 1500);
  };

  const handleReject = async (requestId: string) => {
    if (!rejectReason) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionInProgress(true);

    // Simulate API call
    setTimeout(() => {
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setSelectedRequest(null);
      setShowRejectModal(false);
      setRejectReason('');
      setActionInProgress(false);
    }, 1500);
  };

  const handleRequestInfo = async (requestId: string) => {
    // Simulate API call
    alert('Request for more information sent to user');
  };

  const filteredRequests = requests
    .filter(r => filterNeighborhood === 'all' || r.neighborhood === filterNeighborhood)
    .sort((a, b) => sortBy === 'oldest' ? a.submittedDays - b.submittedDays : b.submittedDays - a.submittedDays);

  return (
    <div className="min-h-screen bg-gradient-to-br from-northern-midnight via-dark-900 to-northern-midnight py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Verification Queue
              </h1>
              <p className="text-gray-400">Review and approve neighborhood membership requests</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <div className="text-2xl font-bold text-white">{requests.length}</div>
                    <div className="text-xs text-gray-400">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-gray-700 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Neighborhood</label>
                <select
                  value={filterNeighborhood}
                  onChange={(e) => setFilterNeighborhood(e.target.value)}
                  className="px-4 py-2 bg-dark-800 border-2 border-gray-700 rounded-xl text-white focus:border-aurora-blue focus:outline-none"
                >
                  <option value="all">All Neighborhoods</option>
                  <option value="Range Lake">Range Lake</option>
                  <option value="Old Town">Old Town</option>
                  <option value="Niven Lake">Niven Lake</option>
                  <option value="Downtown">Downtown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-dark-800 border-2 border-gray-700 rounded-xl text-white focus:border-aurora-blue focus:outline-none"
                >
                  <option value="oldest">Oldest First</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              <div className="ml-auto">
                <button className="px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-xl hover:shadow-aurora transition-all duration-300">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request List */}
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-gray-700 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-xl text-white mb-2">All caught up!</p>
                <p className="text-gray-400">No pending verification requests</p>
              </div>
            ) : (
              filteredRequests.map((request, index) => (
                <div
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={`group relative cursor-pointer animate-in fade-in slide-in-from-bottom-5 duration-500 ${
                    selectedRequest?.id === request.id ? 'ring-2 ring-aurora-blue' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Urgent indicator */}
                  {request.submittedDays > 5 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        Urgent
                      </div>
                    </div>
                  )}

                  <div className={`bg-dark-900/95 backdrop-blur-xl border-2 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                    selectedRequest?.id === request.id
                      ? 'border-aurora-blue shadow-aurora'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}>
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-aurora-green to-aurora-blue flex items-center justify-center text-white text-xl font-bold shadow-glow flex-shrink-0">
                        {request.userInitial}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name and Neighborhood */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">{request.userName}</h3>
                            <p className="text-sm text-gray-400">{request.neighborhood}</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {request.submittedDays}d ago
                          </span>
                        </div>

                        {/* Address */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">📍</span>
                          <span className="text-sm text-gray-300">{request.address}</span>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs px-2 py-1 bg-dark-800 rounded-full text-gray-400">
                            {request.residencyType === 'homeowner' ? '🏠 Owner' : '🔑 Renter'}
                          </span>
                          <span className="text-xs px-2 py-1 bg-dark-800 rounded-full text-gray-400">
                            Since {request.moveInDate}
                          </span>
                          {request.vouchedBy.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-aurora-purple/20 text-aurora-purple rounded-full">
                              🤝 {request.vouchedBy.length} vouches
                            </span>
                          )}
                        </div>

                        {/* Red Flags */}
                        {request.redFlags.length > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <span className="text-sm">⚠️</span>
                            <span className="text-xs text-red-300">{request.redFlags.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {selectedRequest ? (
              <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-aurora-blue/30 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aurora-green to-aurora-blue flex items-center justify-center text-white text-2xl font-bold shadow-glow">
                      {selectedRequest.userInitial}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedRequest.userName}</h2>
                      <p className="text-gray-400">{selectedRequest.neighborhood}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 mb-6">
                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Address</div>
                    <div className="text-white font-medium">{selectedRequest.address}</div>
                    {selectedRequest.residencyType && (
                      <div className="text-sm text-gray-400 mt-1">
                        {selectedRequest.residencyType === 'homeowner' ? '🏠 Homeowner' : '🔑 Renter'}
                      </div>
                    )}
                  </div>

                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-1">Move-in Date</div>
                    <div className="text-white font-medium">{selectedRequest.moveInDate}</div>
                  </div>

                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-2">Verification Method</div>
                    {selectedRequest.hasDocuments ? (
                      <div>
                        <div className="text-white font-medium mb-2">{selectedRequest.documentType}</div>
                        <button
                          onClick={() => setShowDocumentModal(true)}
                          className="px-4 py-2 bg-aurora-blue/20 text-aurora-blue rounded-lg hover:bg-aurora-blue/30 transition-colors text-sm font-semibold"
                        >
                          📄 View Documents
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="text-white font-medium mb-2">Neighbor Vouching</div>
                        <div className="space-y-2">
                          {selectedRequest.vouchedBy.map((vouch, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <span className={vouch.verified ? 'text-aurora-green' : 'text-gray-400'}>
                                {vouch.verified ? '✓' : '○'}
                              </span>
                              <span className="text-gray-300">{vouch.name}</span>
                              <span className="text-xs text-gray-500">({vouch.verified ? 'verified' : 'pending'})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-dark-800/50 rounded-xl p-4">
                    <div className="text-sm text-gray-400 mb-2">Account Information</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Member since:</span>
                        <span className="text-white">{selectedRequest.accountAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Activity:</span>
                        <span className="text-white">{selectedRequest.activityLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Red flags:</span>
                        <span className={selectedRequest.redFlags.length > 0 ? 'text-red-400' : 'text-green-400'}>
                          {selectedRequest.redFlags.length > 0 ? selectedRequest.redFlags.length : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionInProgress}
                    className="w-full group relative px-6 py-4 bg-gradient-to-r from-aurora-green to-emerald-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-aurora hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionInProgress ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-xl">✓</span>
                        <span>Approve Verification</span>
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleRequestInfo(selectedRequest.id)}
                    disabled={actionInProgress}
                    className="w-full px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>❓</span>
                      <span>Request More Information</span>
                    </span>
                  </button>

                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionInProgress}
                    className="w-full px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl transition-colors border-2 border-red-500/30 disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>✕</span>
                      <span>Reject Request</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-dark-900/95 backdrop-blur-xl border-2 border-gray-700 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">👈</div>
                <p className="text-xl text-white mb-2">Select a request</p>
                <p className="text-gray-400">Click a verification request to review details</p>
              </div>
            )}
          </div>
        </div>

        {/* Document Modal */}
        {showDocumentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-dark-900 border-2 border-aurora-blue/30 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Verification Documents</h2>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              {/* Document Viewer */}
              <div className="bg-dark-800 rounded-xl p-8 mb-4">
                <div className="aspect-[8.5/11] bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-lg font-semibold">Document Preview</p>
                    <p className="text-sm">Power Bill - February 2024</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl transition-colors">
                  Previous Document
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-xl hover:shadow-aurora transition-all">
                  Next Document
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-dark-900 border-2 border-red-500/50 rounded-3xl p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Reject Verification</h2>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>

              <p className="text-gray-300 mb-6">
                Please provide a reason for rejection. This will be sent to {selectedRequest.userName}.
              </p>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows={4}
                className="w-full px-4 py-3 bg-dark-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:outline-none transition-colors resize-none mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={!rejectReason || actionInProgress}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionInProgress ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
