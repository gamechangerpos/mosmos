import React, { useState, useEffect } from 'react';
import { 
  TransportService, 
  INITIAL_VERIFIED_ROUTES, 
  INITIAL_VERIFIED_OPERATORS 
} from '../../services/transportService';
import { 
  TransportRoute, 
  TransportOperator 
} from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  Bus, 
  Train, 
  Ship, 
  Plane, 
  Car, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Globe
} from 'lucide-react';

export const CmsTransportManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'routes' | 'operators'>('routes');
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [operators, setOperators] = useState<TransportOperator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Modals
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Partial<TransportRoute> | null>(null);

  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Partial<TransportOperator> | null>(null);

  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [r, o] = await Promise.all([
        TransportService.getRoutes('all', true),
        TransportService.getOperators(true)
      ]);
      setRoutes(r);
      setOperators(o);
    } catch (err) {
      console.warn('[CmsTransportManager] load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Route actions
  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute || !editingRoute.origin || !editingRoute.destination) return;

    try {
      const routeToSave: TransportRoute = {
        id: editingRoute.id || `rt_${Date.now()}`,
        origin: editingRoute.origin,
        destination: editingRoute.destination,
        originCountry: editingRoute.originCountry || 'Kenya',
        destinationCountry: editingRoute.destinationCountry || 'Kenya',
        routeType: editingRoute.routeType || 'domestic',
        operatorId: editingRoute.operatorId,
        operatorName: editingRoute.operatorName || 'MOS MOS Private 4x4 Cruiser',
        transportType: editingRoute.transportType || 'Custom 4x4 Cruiser',
        typicalDuration: editingRoute.typicalDuration || '3 – 4 hours',
        description: editingRoute.description || '',
        verified: editingRoute.verified !== false,
        lastChecked: new Date().toISOString().split('T')[0],
        crossBorderRequirements: editingRoute.crossBorderRequirements || [],
        recommendedFor: editingRoute.recommendedFor || [],
        published: editingRoute.published !== false
      };

      await TransportService.saveRoute(routeToSave);
      await loadData();
      setIsRouteModalOpen(false);
      setEditingRoute(null);
      showToast('Transport route successfully saved to Firestore.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save route', 'error');
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!window.confirm('Are you sure you want to delete this route from Firestore?')) return;
    try {
      await TransportService.deleteRoute(routeId);
      await loadData();
      showToast('Route deleted.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete route', 'error');
    }
  };

  // Operator actions
  const handleSaveOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOperator || !editingOperator.name) return;

    try {
      const opToSave: TransportOperator = {
        id: editingOperator.id || `op_${Date.now()}`,
        name: editingOperator.name,
        transportType: editingOperator.transportType || 'bus',
        countries: editingOperator.countries && editingOperator.countries.length > 0 ? editingOperator.countries : ['Kenya'],
        websiteUrl: editingOperator.websiteUrl || '',
        bookingUrl: editingOperator.bookingUrl || '',
        description: editingOperator.description || '',
        verified: editingOperator.verified !== false,
        lastChecked: new Date().toISOString().split('T')[0],
        sourceReference: editingOperator.sourceReference || 'Audited by MOS MOS Operations',
        published: editingOperator.published !== false
      };

      await TransportService.saveOperator(opToSave);
      await loadData();
      setIsOperatorModalOpen(false);
      setEditingOperator(null);
      showToast('Transport operator successfully saved to Firestore.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save operator', 'error');
    }
  };

  const handleDeleteOperator = async (opId: string) => {
    if (!window.confirm('Are you sure you want to delete this operator from Firestore?')) return;
    try {
      await TransportService.deleteOperator(opId);
      await loadData();
      showToast('Operator deleted.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete operator', 'error');
    }
  };

  const filteredRoutes = routes.filter(r => {
    if (selectedCountry !== 'all') {
      const c = selectedCountry.toLowerCase();
      if (!r.originCountry.toLowerCase().includes(c) && !r.destinationCountry.toLowerCase().includes(c)) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.operatorName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredOperators = operators.filter(o => {
    if (selectedCountry !== 'all') {
      if (!o.countries.some(c => c.toLowerCase().includes(selectedCountry.toLowerCase()))) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className={`p-4 border text-xs flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Bar with Sub-tabs and Actions */}
      <div className="bg-white border border-[#D9D0C2] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('routes')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeSubTab === 'routes'
                ? 'bg-[#20221F] text-white'
                : 'bg-white text-[#78634B] border border-[#D9D0C2] hover:bg-[#F7F4ED]'
            }`}
          >
            Verified Routes ({routes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('operators')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeSubTab === 'operators'
                ? 'bg-[#20221F] text-white'
                : 'bg-white text-[#78634B] border border-[#D9D0C2] hover:bg-[#F7F4ED]'
            }`}
          >
            Carriers & Operators ({operators.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeSubTab === 'routes' ? (
            <button
              onClick={() => {
                setEditingRoute({
                  originCountry: 'Kenya',
                  destinationCountry: 'Kenya',
                  routeType: 'domestic',
                  transportType: 'Custom 4x4 Cruiser',
                  operatorName: 'MOS MOS Private 4x4 Expeditions',
                  typicalDuration: '3 – 4 hours',
                  verified: true,
                  published: true
                });
                setIsRouteModalOpen(true);
              }}
              className="px-4 py-2 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verified Route</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingOperator({
                  transportType: 'bus',
                  countries: ['Kenya'],
                  verified: true,
                  published: true
                });
                setIsOperatorModalOpen(true);
              }}
              className="px-4 py-2 bg-[#B69A68] hover:bg-[#a68a58] text-[#20221F] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Carrier</span>
            </button>
          )}

          <button
            onClick={loadData}
            title="Reload from Firestore"
            className="p-2 border border-[#D9D0C2] text-[#20221F] hover:bg-[#F7F4ED] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-[#D9D0C2] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder={`Search ${activeSubTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 pl-8 focus:outline-none focus:border-[#B69A68]"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#20221F]/60">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-[#F7F4ED] border border-[#D9D0C2] text-xs px-3 py-2 text-[#20221F] focus:outline-none"
          >
            <option value="all">All Countries</option>
            <option value="Uganda">Uganda</option>
            <option value="Kenya">Kenya</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Rwanda">Rwanda</option>
          </select>
        </div>
      </div>

      {/* CONTENT: ROUTES TABLE */}
      {activeSubTab === 'routes' && (
        <div className="bg-white border border-[#D9D0C2] overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#20221F] text-[#F7F4ED] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Route</th>
                <th className="p-3.5">Type & Operator</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Checked</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D0C2]">
              {filteredRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-[#F7F4ED]/40 transition-colors">
                  <td className="p-3.5 font-medium text-[#20221F]">
                    <div>
                      <span>{route.origin} → {route.destination}</span>
                      <span className="text-[10px] text-[#78634B] block font-light">
                        {route.originCountry} to {route.destinationCountry}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#20221F]/80">
                    <span className="font-medium text-[#20221F] block">{route.transportType}</span>
                    <span className="text-[11px] text-[#78634B]">{route.operatorName}</span>
                  </td>
                  <td className="p-3.5 text-[#20221F]/70">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B69A68]" />
                      <span>{route.typicalDuration}</span>
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        route.published !== false ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {route.published !== false ? 'Published' : 'Draft'}
                      </span>
                      {route.verified && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-gray-500 font-mono text-[11px]">
                    {route.lastChecked}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingRoute({ ...route });
                          setIsRouteModalOpen(true);
                        }}
                        className="p-1.5 text-blue-700 hover:bg-blue-50 border border-blue-200 rounded cursor-pointer"
                        title="Edit Route"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route.id)}
                        className="p-1.5 text-red-700 hover:bg-red-50 border border-red-200 rounded cursor-pointer"
                        title="Delete Route"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRoutes.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-xs">
              No matching routes found.
            </div>
          )}
        </div>
      )}

      {/* CONTENT: OPERATORS TABLE */}
      {activeSubTab === 'operators' && (
        <div className="bg-white border border-[#D9D0C2] overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#20221F] text-[#F7F4ED] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Carrier / Operator</th>
                <th className="p-3.5">Transport Mode</th>
                <th className="p-3.5">Territories Served</th>
                <th className="p-3.5">Audit Status</th>
                <th className="p-3.5">Verified Link</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9D0C2]">
              {filteredOperators.map((op) => (
                <tr key={op.id} className="hover:bg-[#F7F4ED]/40 transition-colors">
                  <td className="p-3.5 font-medium text-[#20221F]">
                    <div>
                      <span className="font-serif text-sm font-semibold">{op.name}</span>
                      <p className="text-[11px] text-[#20221F]/60 font-light max-w-sm line-clamp-1 mt-0.5">
                        {op.description}
                      </p>
                    </div>
                  </td>
                  <td className="p-3.5 capitalize font-medium text-[#78634B]">
                    {op.transportType}
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {op.countries.map(c => (
                        <span key={c} className="text-[9px] uppercase px-1.5 py-0.5 bg-[#F7F4ED] text-[#20221F] border border-[#D9D0C2]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold">
                      Verified
                    </span>
                  </td>
                  <td className="p-3.5">
                    {op.websiteUrl ? (
                      <a
                        href={op.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-[10px]">Internal</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingOperator({ ...op });
                          setIsOperatorModalOpen(true);
                        }}
                        className="p-1.5 text-blue-700 hover:bg-blue-50 border border-blue-200 rounded cursor-pointer"
                        title="Edit Carrier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOperator(op.id)}
                        className="p-1.5 text-red-700 hover:bg-red-50 border border-red-200 rounded cursor-pointer"
                        title="Delete Carrier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT ROUTE MODAL */}
      {isRouteModalOpen && editingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#D9D0C2] p-6 sm:p-8 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setIsRouteModalOpen(false); setEditingRoute(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-light text-[#20221F] mb-4">
              {editingRoute.id ? 'Edit Verified Route' : 'Add New Verified Route'}
            </h3>

            <form onSubmit={handleSaveRoute} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Origin City / Hub *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRoute.origin || ''}
                    onChange={(e) => setEditingRoute({ ...editingRoute, origin: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Origin Country
                  </label>
                  <select
                    value={editingRoute.originCountry || 'Kenya'}
                    onChange={(e) => setEditingRoute({ ...editingRoute, originCountry: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  >
                    <option value="Uganda">Uganda</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Destination City / Park *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRoute.destination || ''}
                    onChange={(e) => setEditingRoute({ ...editingRoute, destination: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Destination Country
                  </label>
                  <select
                    value={editingRoute.destinationCountry || 'Kenya'}
                    onChange={(e) => setEditingRoute({ ...editingRoute, destinationCountry: e.target.value })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  >
                    <option value="Uganda">Uganda</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Route Type
                  </label>
                  <select
                    value={editingRoute.routeType || 'domestic'}
                    onChange={(e) => setEditingRoute({ ...editingRoute, routeType: e.target.value as any })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  >
                    <option value="cross-border">Cross-Border</option>
                    <option value="domestic">Domestic Transit</option>
                    <option value="safari-transfer">Safari Transfer</option>
                    <option value="rail">Standard Gauge Rail</option>
                    <option value="ferry">Ferry / Maritime</option>
                    <option value="flight">Domestic Bush Flight</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Transport Type Label
                  </label>
                  <input
                    type="text"
                    value={editingRoute.transportType || ''}
                    onChange={(e) => setEditingRoute({ ...editingRoute, transportType: e.target.value })}
                    placeholder="e.g. SGR Train, Executive Bus..."
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Typical Duration
                  </label>
                  <input
                    type="text"
                    value={editingRoute.typicalDuration || ''}
                    onChange={(e) => setEditingRoute({ ...editingRoute, typicalDuration: e.target.value })}
                    placeholder="e.g. 4.5 hours"
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Assigned Operator Name
                </label>
                <input
                  type="text"
                  value={editingRoute.operatorName || ''}
                  onChange={(e) => setEditingRoute({ ...editingRoute, operatorName: e.target.value })}
                  placeholder="e.g. Kenya Railways, Easy Coach..."
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Route Description & Practical Tips
                </label>
                <textarea
                  rows={3}
                  value={editingRoute.description || ''}
                  onChange={(e) => setEditingRoute({ ...editingRoute, description: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-3 text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRoute.published !== false}
                    onChange={(e) => setEditingRoute({ ...editingRoute, published: e.target.checked })}
                    className="rounded border-[#D9D0C2] text-[#B69A68]"
                  />
                  <span className="font-medium text-xs">Published on Public Website</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRoute.verified !== false}
                    onChange={(e) => setEditingRoute({ ...editingRoute, verified: e.target.checked })}
                    className="rounded border-[#D9D0C2] text-[#B69A68]"
                  />
                  <span className="font-medium text-xs">Mark as Audited & Verified</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#D9D0C2] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#20221F] hover:bg-[#B69A68] hover:text-[#20221F] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Save to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OPERATOR MODAL */}
      {isOperatorModalOpen && editingOperator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white border border-[#D9D0C2] p-6 sm:p-8 my-8 shadow-2xl">
            <button
              onClick={() => { setIsOperatorModalOpen(false); setEditingOperator(null); }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-light text-[#20221F] mb-4">
              {editingOperator.id ? 'Edit Transport Carrier' : 'Add New Transport Carrier'}
            </h3>

            <form onSubmit={handleSaveOperator} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Carrier / Operator Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingOperator.name || ''}
                  onChange={(e) => setEditingOperator({ ...editingOperator, name: e.target.value })}
                  placeholder="e.g. Easy Coach, Kenya Railways..."
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Transport Mode
                  </label>
                  <select
                    value={editingOperator.transportType || 'bus'}
                    onChange={(e) => setEditingOperator({ ...editingOperator, transportType: e.target.value as any })}
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  >
                    <option value="bus">Intercity Bus / Coach</option>
                    <option value="train">Passenger Rail (SGR)</option>
                    <option value="ferry">Maritime Ferry / Boat</option>
                    <option value="flight">Domestic Airline</option>
                    <option value="private-transfer">Private Fleet / Chauffeur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                    Countries Served (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={(editingOperator.countries || []).join(', ')}
                    onChange={(e) => setEditingOperator({ 
                      ...editingOperator, 
                      countries: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                    })}
                    placeholder="e.g. Uganda, Kenya"
                    className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Official Website / Portal URL
                </label>
                <input
                  type="url"
                  value={editingOperator.websiteUrl || ''}
                  onChange={(e) => setEditingOperator({ ...editingOperator, websiteUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Description & Fleet Background
                </label>
                <textarea
                  rows={3}
                  value={editingOperator.description || ''}
                  onChange={(e) => setEditingOperator({ ...editingOperator, description: e.target.value })}
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] p-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-700 mb-1">
                  Audit Source Reference
                </label>
                <input
                  type="text"
                  value={editingOperator.sourceReference || ''}
                  onChange={(e) => setEditingOperator({ ...editingOperator, sourceReference: e.target.value })}
                  placeholder="e.g. Official timetable, RURA license registry..."
                  className="w-full bg-[#F7F4ED] border border-[#D9D0C2] px-3 py-2 text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOperator.published !== false}
                    onChange={(e) => setEditingOperator({ ...editingOperator, published: e.target.checked })}
                    className="rounded border-[#D9D0C2] text-[#B69A68]"
                  />
                  <span className="font-medium text-xs">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOperator.verified !== false}
                    onChange={(e) => setEditingOperator({ ...editingOperator, verified: e.target.checked })}
                    className="rounded border-[#D9D0C2] text-[#B69A68]"
                  />
                  <span className="font-medium text-xs">Mark as Audited & Verified</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#D9D0C2] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOperatorModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#20221F] hover:bg-[#B69A68] hover:text-[#20221F] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Save to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
