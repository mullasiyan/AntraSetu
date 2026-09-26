import { db } from '../db/db.js';
import { evaluateInventoryAlerts } from '../services/alertEngine.js';

export const getInventory = async (req, res, next) => {
  try {
    const { station_id, category, status } = req.query;
    let items = db.inventory.find({ station_id, category });

    const stations = db.stations.find();
    const stationMap = Object.fromEntries(stations.map(s => [s.id, s]));

    // Calculate dynamic properties
    let enriched = items.map(item => {
      const daysRemaining = item.daily_consumption_rate > 0 
        ? Math.floor(item.quantity / item.daily_consumption_rate)
        : 999;

      let stockStatus = 'OPTIMAL';
      if (item.quantity <= item.min_threshold || daysRemaining <= 14) {
        stockStatus = 'CRITICAL';
      } else if (daysRemaining <= 30) {
        stockStatus = 'LOW';
      }

      const station = stationMap[item.station_id];

      return {
        ...item,
        station_name: station ? station.name : 'Unknown Station',
        station_code: station ? station.code : 'UNKNOWN',
        days_remaining: daysRemaining,
        stock_status: stockStatus
      };
    });

    if (status) {
      enriched = enriched.filter(i => i.stock_status.toUpperCase() === status.toUpperCase());
    }

    // Sort by lowest days remaining first (critical items top)
    enriched.sort((a, b) => a.days_remaining - b.days_remaining);

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    next(err);
  }
};

export const getInventoryItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = db.inventory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    const station = db.stations.findById(item.station_id);
    const transactions = db.inventory.getTransactions(item.id);
    const daysRemaining = item.daily_consumption_rate > 0 
      ? Math.floor(item.quantity / item.daily_consumption_rate)
      : 999;

    res.json({
      success: true,
      data: {
        ...item,
        station_name: station ? station.name : 'Unknown Station',
        station_code: station ? station.code : 'UNKNOWN',
        days_remaining: daysRemaining,
        stock_status: item.quantity <= item.min_threshold ? 'CRITICAL' : daysRemaining <= 30 ? 'LOW' : 'OPTIMAL',
        transactions
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createInventoryItem = async (req, res, next) => {
  try {
    const { station_id, name, category, sku, quantity, unit, daily_consumption_rate, min_threshold, storage_zone } = req.body;
    if (!station_id || !name || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'station_id, name, and quantity are required.' });
    }

    const newItem = db.inventory.create({
      station_id,
      name,
      category: category || 'SPARES',
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      quantity: Number(quantity),
      unit: unit || 'Units',
      daily_consumption_rate: Number(daily_consumption_rate || 1),
      min_threshold: Number(min_threshold || 10),
      storage_zone: storage_zone || 'General Depot'
    });

    const station = db.stations.findById(station_id);
    db.activityLogs.create({
      action: 'INVENTORY_CREATED',
      station_code: station ? station.code : 'UNKNOWN',
      user_name: req.user ? req.user.full_name : 'Logistics Officer',
      details: `Added new stock item: ${name} (${quantity} ${unit})`
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity_delta, transaction_type, notes, absolute_quantity } = req.body;

    const item = db.inventory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found.' });
    }

    let newQuantity = item.quantity;
    let delta = 0;

    if (absolute_quantity !== undefined) {
      delta = Number(absolute_quantity) - item.quantity;
      newQuantity = Math.max(0, Number(absolute_quantity));
    } else if (quantity_delta !== undefined) {
      delta = Number(quantity_delta);
      newQuantity = Math.max(0, item.quantity + delta);
    } else {
      return res.status(400).json({ success: false, message: 'Provide either quantity_delta or absolute_quantity.' });
    }

    const updated = db.inventory.update(id, { quantity: newQuantity });

    // Record audit transaction
    const tx = db.inventory.addTransaction({
      item_id: id,
      station_id: item.station_id,
      item_name: item.name,
      quantity_delta: delta,
      resulting_quantity: newQuantity,
      unit: item.unit,
      transaction_type: transaction_type || (delta >= 0 ? 'RESTOCK' : 'CONSUMPTION'),
      notes: notes || 'Stock adjustment logged via operations console',
      logged_by_user_id: req.user ? req.user.id : 'usr-001',
      logged_by_name: req.user ? req.user.full_name : 'Station Operator'
    });

    const station = db.stations.findById(item.station_id);

    db.activityLogs.create({
      action: delta >= 0 ? 'STOCK_RESTOCKED' : 'STOCK_CONSUMED',
      station_code: station ? station.code : 'UNKNOWN',
      user_name: req.user ? req.user.full_name : 'Station Operator',
      details: `${item.name}: ${delta >= 0 ? '+' : ''}${delta} ${item.unit} (New total: ${newQuantity} ${item.unit}).`
    });

    // Check if new stock level breaches threshold and trigger automated warning
    evaluateInventoryAlerts(updated, station);

    const daysRemaining = updated.daily_consumption_rate > 0 
      ? Math.floor(updated.quantity / updated.daily_consumption_rate)
      : 999;

    res.json({
      success: true,
      data: {
        ...updated,
        days_remaining: daysRemaining,
        stock_status: updated.quantity <= updated.min_threshold ? 'CRITICAL' : daysRemaining <= 30 ? 'LOW' : 'OPTIMAL'
      },
      transaction: tx,
      message: 'Stock updated and logged to transaction audit trail.'
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { item_id } = req.query;
    const transactions = db.inventory.getTransactions(item_id);
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    next(err);
  }
};
