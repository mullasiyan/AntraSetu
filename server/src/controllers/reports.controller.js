import { db } from '../db/db.js';

export const getOperationalSummary = async (req, res, next) => {
  try {
    const stations = db.stations.find();
    const stationSummaries = stations.map(s => {
      const latestTelemetry = db.telemetry.getLatestForStation(s.id);
      const activeAlerts = db.alerts.find({ station_id: s.id, status: 'active' });
      const inventory = db.inventory.find({ station_id: s.id });
      const lowInventory = inventory.filter(i => {
        const days = i.daily_consumption_rate > 0 ? i.quantity / i.daily_consumption_rate : 999;
        return i.quantity <= i.min_threshold || days <= 30;
      });
      const pendingMaintenance = db.maintenance.find({ station_id: s.id }).filter(m => m.status !== 'RESOLVED');
      const openIncidents = db.incidents.find({ station_id: s.id }).filter(inc => inc.status !== 'RESOLVED');
      const criticalAlertCount = activeAlerts.filter(a => a.severity === 'CRITICAL').length;
      const highAlertCount = activeAlerts.filter(a => a.severity === 'HIGH').length;

      let operationalStatus = s.status;
      if (criticalAlertCount > 0) {
        operationalStatus = 'CRITICAL';
      } else if (highAlertCount > 0) {
        operationalStatus = 'WARNING';
      }

      return {
        station_id: s.id,
        station_code: s.code,
        station_name: s.name,
        operational_status: operationalStatus,
        outdoor_temp_c: latestTelemetry?.outdoor_temp_c,
        power_load_pct: latestTelemetry?.generator_capacity_pct,
        fuel_level_pct: latestTelemetry?.fuel_level_pct,
        personnel_count: s.personnel_count,
        active_alerts_count: activeAlerts.length,
        critical_alerts_count: criticalAlertCount,
        critical_inventory_items: lowInventory.length,
        pending_maintenance_count: pendingMaintenance.length,
        open_incidents_count: openIncidents.length
      };
    });

    const activeAlerts = db.alerts.find({ status: 'active' });
    const criticalInventory = db.inventory.find().map(item => {
      const days = item.daily_consumption_rate > 0 ? Math.floor(item.quantity / item.daily_consumption_rate) : 999;
      return { ...item, days_remaining: days };
    }).filter(item => item.quantity <= item.min_threshold || item.days_remaining <= 30);

    const openIncidents = db.incidents.find().filter(i => i.status !== 'RESOLVED');
    const overdueTasks = db.maintenance.find().filter(m => m.is_overdue);

    const report = {
      generated_at: new Date().toISOString(),
      generated_by: req.user ? `${req.user.full_name} (${req.user.role})` : 'Mission Operations Desk',
      mission_title: 'National Centre for Polar and Ocean Research (NCPOR) - Daily Polar Operations Brief',
      stations: stationSummaries,
      active_alerts: activeAlerts,
      critical_inventory: criticalInventory,
      open_incidents: openIncidents,
      overdue_maintenance: overdueTasks
    };

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

export const exportToCSV = async (req, res, next) => {
  try {
    const { type } = req.query; // 'inventory', 'alerts', 'incidents', or 'stations'
    let filename = `antarsetu_report_${type || 'summary'}_${Date.now()}.csv`;
    let csvContent = '';

    if (type === 'inventory') {
      const items = db.inventory.find();
      csvContent = 'Station ID,Resource Name,Category,SKU,Quantity,Unit,Daily Consumption,Days Remaining,Min Threshold,Storage Zone\n';
      items.forEach(i => {
        const days = i.daily_consumption_rate > 0 ? Math.floor(i.quantity / i.daily_consumption_rate) : 999;
        csvContent += `"${i.station_id}","${i.name}","${i.category}","${i.sku}",${i.quantity},"${i.unit}",${i.daily_consumption_rate},${days},${i.min_threshold},"${i.storage_zone}"\n`;
      });
    } else if (type === 'incidents') {
      const incidents = db.incidents.find();
      csvContent = 'ID,Station Code,Title,Priority,Category,Status,Assigned Team,Created At\n';
      incidents.forEach(inc => {
        csvContent += `"${inc.id}","${inc.station_code}","${inc.title.replace(/"/g, '""')}","${inc.priority}","${inc.category}","${inc.status}","${inc.assigned_team}","${inc.created_at}"\n`;
      });
    } else if (type === 'alerts') {
      const alerts = db.alerts.find();
      csvContent = 'ID,Station Code,Category,Severity,Title,Acknowledged,Resolved,Created At\n';
      alerts.forEach(a => {
        csvContent += `"${a.id}","${a.station_code}","${a.category}","${a.severity}","${a.title.replace(/"/g, '""')}",${a.is_acknowledged},${a.is_resolved},"${a.created_at}"\n`;
      });
    } else {
      // Default: Stations Summary
      const stations = db.stations.find();
      csvContent = 'Station Code,Station Name,Location,Latitude,Longitude,Status,Personnel Count,Max Capacity,Comms Status\n';
      stations.forEach(s => {
        csvContent += `"${s.code}","${s.name}","${s.location_description}",${s.latitude},${s.longitude},"${s.status}",${s.personnel_count},${s.max_capacity},"${s.comms_status}"\n`;
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
