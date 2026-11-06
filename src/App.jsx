import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import RadarView from './components/RadarView';
import AppointmentsView from './components/AppointmentsView';
import ClientsView from './components/ClientsView';
import FinancesView from './components/FinancesView';
import BackupView from './components/BackupView';
import WhatsAppModal from './components/WhatsAppModal';
import ClientDetailModal from './components/ClientDetailModal';
import NewServiceModal from './components/NewServiceModal';
import NewClientModal from './components/NewClientModal';
import NewAppointmentModal from './components/NewAppointmentModal';

import { 
  initDatabase, 
  getAllClients, 
  getAllServices, 
  getAllAppointments,
  getSettings, 
  recordService, 
  addClient,
  addAppointment,
  updateAppointment,
  deleteAppointment
} from './db/db';
import { getClientStatus } from './utils/dateUtils';
import { Sparkles, Scissors } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState('radar');

  // Modals
  const [whatsAppModalData, setWhatsAppModalData] = useState(null); // { client, type }
  const [detailModalClient, setDetailModalClient] = useState(null);
  
  // New service (charge) modal
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [preselectedClientForService, setPreselectedClientForService] = useState(null);
  const [preselectedServiceDetails, setPreselectedServiceDetails] = useState(null);

  // New client modal
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);

  // New appointment modal
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [preselectedClientForAppointment, setPreselectedClientForAppointment] = useState(null);

  // Load database on start
  const refreshData = async () => {
    try {
      await initDatabase();
      const [allClients, allServices, allApts, appSettings] = await Promise.all([
        getAllClients(),
        getAllServices(),
        getAllAppointments(),
        getSettings()
      ]);
      setClients(allClients);
      setServices(allServices);
      setAppointments(allApts);
      setSettings(appSettings);
    } catch (err) {
      console.error("Error cargando base de datos local:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Compute overdue count for notification badges
  const overdueCount = clients.filter(c => {
    const s = getClientStatus(c);
    return s.status === 'urgent' || s.status === 'due';
  }).length;

  // Compute today's pending appointments
  const todayStr = new Date().toISOString().substring(0, 10);
  const todayAppointmentsCount = appointments.filter(a => a.date === todayStr && a.status === 'programada').length;

  // Handlers
  const handleOpenWhatsApp = (client, type = null) => {
    setWhatsAppModalData({ client, type });
  };

  const handleSelectClient = (client) => {
    setDetailModalClient(client);
  };

  const handleStartNewService = (client = null, servicePreset = null) => {
    setPreselectedClientForService(client);
    setPreselectedServiceDetails(servicePreset);
    setIsNewServiceOpen(true);
  };

  const handleSaveService = async (serviceData) => {
    await recordService(serviceData);
    await refreshData();
  };

  const handleSaveNewClient = async (clientData) => {
    const newClient = await addClient(clientData);
    await refreshData();
    return newClient;
  };

  // Appointments handlers
  const handleStartNewAppointment = (client = null) => {
    setPreselectedClientForAppointment(client);
    setIsNewAppointmentOpen(true);
  };

  const handleSaveAppointment = async (appointmentData) => {
    await addAppointment(appointmentData);
    await refreshData();
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    await updateAppointment(id, { status });
    await refreshData();
  };

  const handleDeleteAppointment = async (id) => {
    await deleteAppointment(id);
    await refreshData();
  };

  const handleCompleteAndCharge = (apt) => {
    const matchedClient = clients.find(c => c.id === apt.clientId) || {
      id: apt.clientId,
      name: apt.clientName,
      phone: apt.clientPhone
    };

    handleStartNewService(matchedClient, {
      serviceType: apt.serviceType,
      serviceName: apt.serviceName,
      estimatedPrice: apt.estimatedPrice,
      notes: apt.notes
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-base flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 flex items-center justify-center shadow-gold-glow animate-pulse mb-3">
          <Scissors className="w-7 h-7 text-dark-base stroke-[2.5]" />
        </div>
        <h2 className="text-base font-bold text-slate-100 font-serif tracking-wider">
          Aura Peluquería
        </h2>
        <p className="text-xs text-gold-400/80 mt-1">
          Cargando base de datos local en Soles (S/)...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-base text-slate-100 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-x-hidden">
      {/* Top Header */}
      <Header 
        settings={settings}
        overdueCount={overdueCount}
        onOpenBackup={() => setActiveTab('settings')}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-4 pb-20">
        {activeTab === 'radar' && (
          <RadarView 
            clients={clients}
            settings={settings}
            onOpenWhatsApp={handleOpenWhatsApp}
            onSelectClient={handleSelectClient}
            onNewServiceForClient={handleStartNewService}
            onScheduleForClient={handleStartNewAppointment}
          />
        )}

        {activeTab === 'appointments' && (
          <AppointmentsView 
            appointments={appointments}
            settings={settings}
            onNewAppointment={() => handleStartNewAppointment(null)}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
            onCompleteAndCharge={handleCompleteAndCharge}
          />
        )}

        {activeTab === 'clients' && (
          <ClientsView 
            clients={clients}
            settings={settings}
            onSelectClient={handleSelectClient}
            onOpenWhatsApp={handleOpenWhatsApp}
            onNewClientClick={() => setIsNewClientOpen(true)}
          />
        )}

        {activeTab === 'finances' && (
          <FinancesView 
            services={services}
            settings={settings}
          />
        )}

        {activeTab === 'settings' && (
          <BackupView 
            settings={settings}
            clientsCount={clients.length}
            servicesCount={services.length}
            onDataRestored={refreshData}
          />
        )}
      </main>

      {/* Floating / Fixed Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overdueCount={overdueCount}
        todayAppointmentsCount={todayAppointmentsCount}
        onNewService={() => handleStartNewService(null)}
      />

      {/* WhatsApp Message Modal */}
      {whatsAppModalData && (
        <WhatsAppModal 
          client={whatsAppModalData.client}
          initialType={whatsAppModalData.type}
          settings={settings}
          onClose={() => setWhatsAppModalData(null)}
        />
      )}

      {/* Client Profile / Formulas Modal */}
      {detailModalClient && (
        <ClientDetailModal 
          client={detailModalClient}
          settings={settings}
          onClose={() => setDetailModalClient(null)}
          onOpenWhatsApp={handleOpenWhatsApp}
          onNewService={handleStartNewService}
          onScheduleAppointment={handleStartNewAppointment}
          onClientUpdated={async (updated) => {
            await refreshData();
            setDetailModalClient(updated);
          }}
          onClientDeleted={async () => {
            await refreshData();
            setDetailModalClient(null);
          }}
        />
      )}

      {/* New Service / Session Modal */}
      {isNewServiceOpen && (
        <NewServiceModal 
          clients={clients}
          preselectedClient={preselectedClientForService}
          preselectedService={preselectedServiceDetails}
          settings={settings}
          onSave={handleSaveService}
          onClose={() => {
            setIsNewServiceOpen(false);
            setPreselectedClientForService(null);
            setPreselectedServiceDetails(null);
          }}
          onAddNewClient={handleSaveNewClient}
        />
      )}

      {/* New Client Modal */}
      {isNewClientOpen && (
        <NewClientModal 
          onSave={handleSaveNewClient}
          onClose={() => setIsNewClientOpen(false)}
        />
      )}

      {/* New Appointment Modal */}
      {isNewAppointmentOpen && (
        <NewAppointmentModal 
          clients={clients}
          settings={settings}
          preselectedClient={preselectedClientForAppointment}
          onSave={handleSaveAppointment}
          onClose={() => {
            setIsNewAppointmentOpen(false);
            setPreselectedClientForAppointment(null);
          }}
          onAddNewClient={handleSaveNewClient}
        />
      )}
    </div>
  );
}
