'use client';

import { useState } from 'react';
import {
  Search,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Pen,
  Send,
  MoreVertical,
  Plus,
  X,
  Calendar,
  User,
  File,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'pending' | 'signed' | 'expired' | 'draft';
  signers: Signer[];
  createdAt: string;
  expiresAt?: string;
  signedAt?: string;
}

interface Signer {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: string;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Company Registration Agreement.pdf',
    type: 'PDF',
    size: '2.4 MB',
    status: 'pending',
    signers: [
      { id: '1', name: 'John Smith', email: 'john@company.com', status: 'signed', signedAt: '2024-12-10' },
      { id: '2', name: 'Sarah Lee', email: 'sarah@company.com', status: 'pending' },
    ],
    createdAt: '2024-12-08',
    expiresAt: '2024-12-22',
  },
  {
    id: '2',
    name: 'Director Appointment Letter.pdf',
    type: 'PDF',
    size: '1.2 MB',
    status: 'signed',
    signers: [
      { id: '1', name: 'Ahmad Rahman', email: 'ahmad@startup.io', status: 'signed', signedAt: '2024-12-05' },
    ],
    createdAt: '2024-12-01',
    signedAt: '2024-12-05',
  },
  {
    id: '3',
    name: 'Shareholder Agreement.pdf',
    type: 'PDF',
    size: '3.8 MB',
    status: 'draft',
    signers: [],
    createdAt: '2024-12-10',
  },
  {
    id: '4',
    name: 'Annual Return Form.pdf',
    type: 'PDF',
    size: '856 KB',
    status: 'expired',
    signers: [
      { id: '1', name: 'Lisa Wong', email: 'lisa@globaltech.com', status: 'pending' },
    ],
    createdAt: '2024-11-15',
    expiresAt: '2024-11-30',
  },
];

export default function ESignaturePage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const tabs = ['All', 'Pending', 'Signed', 'Draft', 'Expired'];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && doc.status === activeTab.toLowerCase();
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      signed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      expired: 'bg-red-100 text-red-700',
      draft: 'bg-gray-100 text-gray-600',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getSignerStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      signed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      declined: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === 'pending').length,
    signed: documents.filter((d) => d.status === 'signed').length,
    draft: documents.filter((d) => d.status === 'draft').length,
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        Dashboard &gt; <span className="text-gray-900">eSignature</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">eSignature</h1>
          <p className="text-gray-500 text-sm">Digitally sign and manage your documents</p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Signature</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Signed</p>
              <p className="text-2xl font-bold text-green-600">{stats.signed}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <File className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-gray-900 border-b-2 border-blue-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-lg border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No documents found</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-4 text-blue-600 text-sm hover:underline"
            >
              Upload your first document
            </button>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{doc.name}</h3>
                    <p className="text-xs text-gray-500">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    doc.status
                  )}`}
                >
                  {getStatusIcon(doc.status)}
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
              </div>

              {/* Signers */}
              {doc.signers.length > 0 && (
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Signers</p>
                  <div className="space-y-2">
                    {doc.signers.map((signer) => (
                      <div key={signer.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs">
                            {signer.name.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-700">{signer.name}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getSignerStatusBadge(
                            signer.status
                          )}`}
                        >
                          {signer.status === 'signed' ? `Signed ${signer.signedAt}` : signer.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Created {new Date(doc.createdAt).toLocaleDateString()}
                </div>
                {doc.expiresAt && doc.status === 'pending' && (
                  <div className="text-orange-600">
                    Expires {new Date(doc.expiresAt).toLocaleDateString()}
                  </div>
                )}
                {doc.signedAt && (
                  <div className="text-green-600">
                    Signed {new Date(doc.signedAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDocument(doc)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                {doc.status === 'pending' && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-medium hover:bg-blue-800 transition-colors">
                    <Pen className="w-3.5 h-3.5" />
                    Sign Now
                  </button>
                )}
                {doc.status === 'draft' && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-900 text-white rounded-lg text-xs font-medium hover:bg-blue-800 transition-colors">
                    <Send className="w-3.5 h-3.5" />
                    Send for Signature
                  </button>
                )}
                {doc.status === 'signed' && (
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop your document here, or{' '}
                  <span className="text-blue-600 cursor-pointer hover:underline">browse</span>
                </p>
                <p className="text-xs text-gray-400">Supports PDF, DOC, DOCX (Max 10MB)</p>
              </div>

              {/* Document Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  placeholder="Enter document name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Add Signers */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Signers
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Add people who need to sign this document
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
                  Save as Draft
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800">
                  Send for Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h2>
                  <p className="text-xs text-gray-500">
                    {selectedDocument.type} • {selectedDocument.size}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex">
              {/* Document Preview */}
              <div className="flex-1 bg-gray-100 p-8 min-h-[500px] flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                  <div className="text-center text-gray-400">
                    <FileText className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm">Document Preview</p>
                    <p className="text-xs mt-1">PDF viewer would be integrated here</p>
                  </div>
                </div>
              </div>
              {/* Sidebar Info */}
              <div className="w-72 border-l border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Document Details</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        selectedDocument.status
                      )}`}
                    >
                      {getStatusIcon(selectedDocument.status)}
                      {selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedDocument.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {selectedDocument.expiresAt && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expires</p>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedDocument.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {selectedDocument.signers.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Signers</p>
                      <div className="space-y-2">
                        {selectedDocument.signers.map((signer) => (
                          <div
                            key={signer.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs">
                                {signer.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-900">{signer.name}</p>
                                <p className="text-xs text-gray-500">{signer.email}</p>
                              </div>
                            </div>
                            {signer.status === 'signed' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                  {selectedDocument.status === 'pending' && (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800">
                      <Pen className="w-4 h-4" />
                      Sign Document
                    </button>
                  )}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
