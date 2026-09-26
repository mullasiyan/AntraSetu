import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import CriticalBanner from './CriticalBanner';
import { api } from '../../services/api';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await api.alerts.getAll({ status: 'active' });
      if (res.success && res.data) {
        setActiveAlerts(res.data);
        setCriticalAlerts(res.data.filter((a) => a.severity === 'CRITICAL'));
      }
    } catch (err) {
      console.warn('Failed to refresh alert banner:', err.message);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 8000); // 8s telemetry loop
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await api.alerts.acknowledge(id);
      fetchAlerts();
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B16] flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeAlertsCount={activeAlerts.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Critical Alarm Alert Bar */}
        <CriticalBanner
          criticalAlerts={criticalAlerts}
          onAcknowledge={handleAcknowledge}
        />

        {/* Global Operations Header */}
        <Header
          activeAlertsCount={activeAlerts.length}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshAlerts: fetchAlerts }} />
        </main>
      </div>
    </div>
  );
}
