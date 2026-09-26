import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import {
  Boxes,
  PlusCircle,
  History,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  PackagePlus,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [stationFilter, setStationFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Update Stock Modal
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateActionType, setUpdateActionType] = useState('CONSUMPTION'); // 'CONSUMPTION' or 'RESTOCK'
  const [quantityDelta, setQuantityDelta] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [submittingStock, setSubmittingStock] = useState(false);

  // History Modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyItem, setHistoryItem] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Create Item Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    station_id: 'stn-bharati',
    name: '',
    category: 'FUEL',
    sku: '',
    quantity: 100,
    unit: 'Litres',
    daily_consumption_rate: 5,
    min_threshold: 20,
    storage_zone: 'Bulk Storage Bay'
  });

  const fetchInventory = async () => {
    try {
      const [invRes, stnRes] = await Promise.all([
        api.inventory.getAll({
          station_id: stationFilter !== 'ALL' ? stationFilter : undefined,
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
          status: statusFilter !== 'ALL' ? statusFilter : undefined
        }),
        api.stations.getAll()
      ]);

      if (invRes.success) setItems(invRes.data);
      if (stnRes.success) setStations(stnRes.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [stationFilter, categoryFilter, statusFilter]);

  const handleOpenUpdate = (item, type = 'CONSUMPTION') => {
    setSelectedItemForUpdate(item);
    setUpdateActionType(type);
    setQuantityDelta(type === 'CONSUMPTION' ? String(item.daily_consumption_rate) : '500');
    setUpdateNotes(type === 'CONSUMPTION' ? 'Routine daily habitat consumption' : 'Depot resupply convoy delivery');
    setIsUpdateModalOpen(true);
  };

  const handleConfirmStockUpdate = async (e) => {
    e.preventDefault();
    if (!selectedItemForUpdate || !quantityDelta) return;
    setSubmittingStock(true);
    try {
      const deltaNumber = Number(quantityDelta);
      const finalDelta = updateActionType === 'CONSUMPTION' ? -Math.abs(deltaNumber) : Math.abs(deltaNumber);

      await api.inventory.updateStock(selectedItemForUpdate.id, {
        quantity_delta: finalDelta,
        transaction_type: updateActionType,
        notes: updateNotes
      });

      setIsUpdateModalOpen(false);
      setSelectedItemForUpdate(null);
      fetchInventory();
    } catch (err) {
      alert('Error updating stock: ' + err.message);
    } finally {
      setSubmittingStock(false);
    }
  };

  const handleOpenHistory = async (item) => {
    setHistoryItem(item);
    try {
      const res = await api.inventory.getTransactions(item.id);
      if (res.success) {
        setTransactions(res.data);
      }
      setIsHistoryModalOpen(true);
    } catch (err) {
      alert('Error fetching transaction logs: ' + err.message);
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      await api.inventory.create(createForm);
      setIsCreateModalOpen(false);
      setCreateForm({
        station_id: 'stn-bharati',
        name: '',
        category: 'FUEL',
        sku: '',
        quantity: 100,
        unit: 'Litres',
        daily_consumption_rate: 5,
        min_threshold: 20,
        storage_zone: 'Bulk Storage Bay'
      });
      fetchInventory();
    } catch (err) {
      alert('Error creating item: ' + err.message);
    }
  };

  // Filtered view by search
  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.storage_zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-polar-800 pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide flex items-center gap-2">
            <Boxes size={22} className="text-cyan-400" />
            POLAR RESOURCE & LOGISTICS MANAGEMENT
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Life-support consumables, fuel reserves, burn-rate calculators & safety buffer monitoring
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition shadow-[0_0_15px_rgba(0,229,255,0.25)]"
        >
          <PackagePlus size={15} />
          <span>Catalog New Resource</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-polar-900/90 border border-polar-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resource, SKU, storage bunker..."
              className="w-full pl-9 pr-3 py-1.5 bg-polar-950 border border-polar-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Station Filter */}
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Stations</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Categories</option>
            <option value="FUEL">Fuel & Hydrocarbons</option>
            <option value="FOOD">Crew Food Rations</option>
            <option value="MEDICAL">Medical Supplies</option>
            <option value="SPARES">Mechanical & Generator Spares</option>
            <option value="LIFE_SUPPORT">Life-Support Filters & Gases</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-polar-950 border border-polar-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="CRITICAL">Critical Depletion (&lt; 14 Days)</option>
            <option value="LOW">Low Stock (&lt; 30 Days)</option>
            <option value="OPTIMAL">Optimal Runway</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-polar-900/90 border border-polar-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-polar-950 border-b border-polar-800 text-[11px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Station</th>
                <th className="py-3 px-4">Resource & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 text-right">Daily Burn</th>
                <th className="py-3 px-4 text-center">Runway (Days)</th>
                <th className="py-3 px-4 text-center">Safety Buffer</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Boxes size={32} className="mx-auto text-slate-600 mb-2" />
                    No inventory records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isCritical = item.stock_status === 'CRITICAL';
                  const isLow = item.stock_status === 'LOW';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-polar-850/60 transition ${
                        isCritical ? 'bg-rose-950/20' : isLow ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-cyan-300">{item.station_code}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100">{item.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          SKU: {item.sku} • {item.storage_zone}
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-slate-300">
                        <span className="px-2 py-0.5 bg-polar-950 rounded border border-polar-800 text-[10px]">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right font-bold text-slate-100">
                        {item.quantity.toLocaleString()} <span className="text-slate-400 font-normal">{item.unit}</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right text-slate-300">
                        -{item.daily_consumption_rate} <span className="text-slate-500">{item.unit}/day</span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-xs inline-flex items-center gap-1 ${
                            isCritical
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/50 animate-pulse'
                              : isLow
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.days_remaining} d
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-center text-slate-400 text-[11px]">
                        Min: {item.min_threshold.toLocaleString()} {item.unit}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <StatusBadge status={item.stock_status} size="sm" pulse={isCritical} />
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right space-x-1.5">
                        <button
                          onClick={() => handleOpenUpdate(item, 'CONSUMPTION')}
                          title="Record Consumption"
                          className="px-2 py-1 bg-polar-800 hover:bg-polar-700 text-slate-300 rounded text-[11px] font-semibold border border-polar-700 transition"
                        >
                          - Burn
                        </button>
                        <button
                          onClick={() => handleOpenUpdate(item, 'RESTOCK')}
                          title="Restock Supplies"
                          className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded text-[11px] font-bold border border-emerald-500/40 transition"
                        >
                          + Restock
                        </button>
                        <button
                          onClick={() => handleOpenHistory(item)}
                          title="View Transaction Audit Trail"
                          className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-polar-800 rounded transition inline-block align-middle"
                        >
                          <History size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Update / Consumption Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={updateActionType === 'CONSUMPTION' ? 'Log Resource Consumption' : 'Log Stock Replenishment'}
        subtitle={`${selectedItemForUpdate?.name} (${selectedItemForUpdate?.station_code})`}
      >
        <form onSubmit={handleConfirmStockUpdate} className="space-y-4 font-mono text-xs">
          <div className="bg-polar-950 p-3 rounded-lg border border-polar-800">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span>Current Stock on Hand:</span>
              <strong className="text-white text-sm">
                {selectedItemForUpdate?.quantity} {selectedItemForUpdate?.unit}
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Daily Normal Consumption:</span>
              <span>{selectedItemForUpdate?.daily_consumption_rate} {selectedItemForUpdate?.unit}/day</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">
              Quantity to {updateActionType === 'CONSUMPTION' ? 'Deduct (Burn)' : 'Add (Restock)'} *
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={quantityDelta}
                onChange={(e) => setQuantityDelta(e.target.value)}
                placeholder="Enter quantity..."
                className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 font-bold focus:outline-none focus:border-cyan-400"
              />
              <span className="absolute right-3 top-2.5 text-slate-400">
                {selectedItemForUpdate?.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">
              Operations Audit Note / Reason *
            </label>
            <input
              type="text"
              required
              value={updateNotes}
              onChange={(e) => setUpdateNotes(e.target.value)}
              placeholder="e.g. Generator primary tank replenishment from reserve bunker"
              className="w-full p-2.5 bg-polar-950 border border-polar-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-polar-800">
            <button
              type="button"
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 bg-polar-800 hover:bg-polar-700 rounded-lg text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingStock}
              className={`px-4 py-2 text-white rounded-lg font-bold transition ${
                updateActionType === 'CONSUMPTION'
                  ? 'bg-rose-600 hover:bg-rose-500'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
            >
              {submittingStock ? 'Recording...' : `Commit ${updateActionType === 'CONSUMPTION' ? 'Consumption' : 'Restock'}`}
            </button>
          </div>
        </form>
      </Modal>

      {/* Transaction History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Inventory Transaction Audit Log"
        subtitle={historyItem ? `${historyItem.name} (${historyItem.sku})` : ''}
      >
        <div className="space-y-3 font-mono text-xs">
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No previous stock adjustments recorded for this SKU.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3 bg-polar-950 rounded-lg border border-polar-800">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        tx.quantity_delta >= 0
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {tx.transaction_type}: {tx.quantity_delta >= 0 ? '+' : ''}{tx.quantity_delta} {tx.unit}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(tx.recorded_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-slate-300 mt-1.5">{tx.notes}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Logged by: {tx.logged_by_name || 'Station Crew'}</span>
                    <span>Resulting Stock: {tx.resulting_quantity} {tx.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Catalog New Resource Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Catalog New Station Consumable"
        subtitle="Register tracking parameters, daily consumption burn-rate and low-stock threshold"
      >
        <form onSubmit={handleCreateItem} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Antarctic Base *</label>
              <select
                value={createForm.station_id}
                onChange={(e) => setCreateForm({ ...createForm, station_id: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Resource Category *</label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              >
                <option value="FUEL">Fuel & Hydrocarbons</option>
                <option value="FOOD">Food Rations</option>
                <option value="MEDICAL">Medical Supplies</option>
                <option value="SPARES">Mechanical Spares</option>
                <option value="LIFE_SUPPORT">Life Support Gases</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold uppercase">Resource Name *</label>
            <input
              type="text"
              required
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="e.g. Liquid Helium Cryogenic Dewars"
              className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Current Qty *</label>
              <input
                type="number"
                required
                value={createForm.quantity}
                onChange={(e) => setCreateForm({ ...createForm, quantity: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Unit (L, kg, etc.) *</label>
              <input
                type="text"
                required
                value={createForm.unit}
                onChange={(e) => setCreateForm({ ...createForm, unit: e.target.value })}
                placeholder="Litres"
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Daily Burn Rate *</label>
              <input
                type="number"
                step="any"
                required
                value={createForm.daily_consumption_rate}
                onChange={(e) => setCreateForm({ ...createForm, daily_consumption_rate: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Min Safety Threshold *</label>
              <input
                type="number"
                required
                value={createForm.min_threshold}
                onChange={(e) => setCreateForm({ ...createForm, min_threshold: e.target.value })}
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-bold uppercase">Storage Bunker / Zone</label>
              <input
                type="text"
                value={createForm.storage_zone}
                onChange={(e) => setCreateForm({ ...createForm, storage_zone: e.target.value })}
                placeholder="Cryo Bunker North"
                className="w-full p-2 bg-polar-950 border border-polar-700 rounded-lg text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-polar-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 bg-polar-800 hover:bg-polar-700 rounded-lg text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
            >
              Register Resource
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
