import Dexie from 'dexie';
import { initialClients, initialServices, initialAppointments, initialSettings } from './seedData';

// Initialize Dexie database
export const db = new Dexie('AuraSalonDB');

db.version(2).stores({
  clients: 'id, name, phone, lastVisitDate, nextSuggestedDate, lastServiceType, birthDate',
  services: 'id, clientId, date, serviceType, price',
  appointments: 'id, clientId, date, status, time',
  settings: 'id'
});

const STORAGE_KEY_CLIENTS = 'aura_clients_backup_v2';
const STORAGE_KEY_SERVICES = 'aura_services_backup_v2';
const STORAGE_KEY_APPOINTMENTS = 'aura_appointments_backup_v2';
const STORAGE_KEY_SETTINGS = 'aura_settings_backup_v2';

export async function initDatabase() {
  try {
    const clientsCount = await db.clients.count();
    if (clientsCount === 0) {
      // Check if localStorage has existing data
      const localClients = localStorage.getItem(STORAGE_KEY_CLIENTS);
      const localServices = localStorage.getItem(STORAGE_KEY_SERVICES);
      const localAppointments = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
      const localSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

      if (localClients) {
        await db.clients.bulkAdd(JSON.parse(localClients));
        if (localServices) await db.services.bulkAdd(JSON.parse(localServices));
        if (localAppointments) await db.appointments.bulkAdd(JSON.parse(localAppointments));
        if (localSettings) await db.settings.put({ id: 'main', ...JSON.parse(localSettings) });
      } else {
        // Seed with realistic Peru salon data
        await db.clients.bulkAdd(initialClients);
        await db.services.bulkAdd(initialServices);
        await db.appointments.bulkAdd(initialAppointments);
        await db.settings.put({ id: 'main', ...initialSettings });
        await syncToLocalStorage();
      }
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Mirror to localStorage as instant offline fallback
export async function syncToLocalStorage() {
  try {
    const clients = await db.clients.toArray();
    const services = await db.services.toArray();
    const appointments = await db.appointments.toArray();
    const settings = await db.settings.get('main');
    
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
    localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(appointments));
    if (settings) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    }
  } catch (err) {
    console.warn('Sync to localStorage failed:', err);
  }
}

// Client operations
export async function getAllClients() {
  return await db.clients.toArray();
}

export async function getClientById(id) {
  return await db.clients.get(id);
}

export async function addClient(clientData) {
  const id = 'cli_' + Date.now();
  const newClient = {
    id,
    name: clientData.name.trim(),
    phone: clientData.phone.trim().replace(/\D/g, ''),
    gender: clientData.gender || 'female',
    birthDate: clientData.birthDate || '', // format MM-DD or YYYY-MM-DD
    notes: clientData.notes || '',
    favoriteServices: clientData.favoriteServices || [],
    createdAt: new Date().toISOString(),
    lastVisitDate: null,
    nextSuggestedDate: null,
    lastServiceType: null,
    lastServiceName: null,
    totalVisits: 0,
    totalSpent: 0
  };
  await db.clients.add(newClient);
  await syncToLocalStorage();
  return newClient;
}

export async function updateClient(id, updates) {
  await db.clients.update(id, updates);
  await syncToLocalStorage();
  return await db.clients.get(id);
}

export async function deleteClient(id) {
  await db.clients.delete(id);
  await db.services.where('clientId').equals(id).delete();
  await db.appointments.where('clientId').equals(id).delete();
  await syncToLocalStorage();
}

// Services operations
export async function getAllServices() {
  return await db.services.orderBy('date').reverse().toArray();
}

export async function getServicesByClient(clientId) {
  return await db.services.where('clientId').equals(clientId).reverse().sortBy('date');
}

export async function recordService(serviceData) {
  const serviceId = 'srv_' + Date.now();
  const dateStr = serviceData.date || new Date().toISOString();
  
  const recallDays = parseInt(serviceData.recallDays) || 30;
  const nextDate = new Date(new Date(dateStr).getTime() + recallDays * 24 * 60 * 60 * 1000).toISOString();

  const service = {
    id: serviceId,
    clientId: serviceData.clientId,
    clientName: serviceData.clientName,
    clientPhone: serviceData.clientPhone,
    serviceType: serviceData.serviceType,
    serviceName: serviceData.serviceName,
    price: Number(serviceData.price) || 0,
    date: dateStr,
    technicalNotes: serviceData.technicalNotes || '',
    recallDays: recallDays
  };

  await db.services.add(service);

  // Update client
  const client = await db.clients.get(serviceData.clientId);
  if (client) {
    const updatedVisits = (client.totalVisits || 0) + 1;
    const updatedSpent = (client.totalSpent || 0) + service.price;
    
    let combinedNotes = client.notes || '';
    if (service.technicalNotes && !combinedNotes.includes(service.technicalNotes)) {
      const dateLabel = new Date(dateStr).toLocaleDateString();
      combinedNotes = combinedNotes 
        ? `${combinedNotes}\n[${dateLabel}] ${service.technicalNotes}`
        : `[${dateLabel}] ${service.technicalNotes}`;
    }

    await db.clients.update(serviceData.clientId, {
      lastVisitDate: dateStr,
      nextSuggestedDate: nextDate,
      lastServiceType: service.serviceType,
      lastServiceName: service.serviceName,
      totalVisits: updatedVisits,
      totalSpent: updatedSpent,
      notes: combinedNotes
    });
  }

  // If there was a scheduled appointment for this client today, mark it completed
  const todayStr = dateStr.substring(0, 10);
  const pendingApts = await db.appointments
    .where('clientId').equals(serviceData.clientId)
    .and(apt => apt.status === 'programada' && apt.date === todayStr)
    .toArray();
  for (const apt of pendingApts) {
    await db.appointments.update(apt.id, { status: 'completada' });
  }

  await syncToLocalStorage();
  return service;
}

// Appointments Operations (Agenda de Citas)
export async function getAllAppointments() {
  return await db.appointments.orderBy('date').toArray();
}

export async function addAppointment(data) {
  const id = 'apt_' + Date.now();
  const appointment = {
    id,
    clientId: data.clientId,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    serviceType: data.serviceType || 'corte',
    serviceName: data.serviceName || 'Corte de Cabello',
    date: data.date, // YYYY-MM-DD
    time: data.time || '10:00', // HH:MM
    status: 'programada', // 'programada' | 'completada' | 'cancelada'
    estimatedPrice: Number(data.estimatedPrice) || 0,
    notes: data.notes || '',
    createdAt: new Date().toISOString()
  };

  await db.appointments.add(appointment);
  await syncToLocalStorage();
  return appointment;
}

export async function updateAppointment(id, updates) {
  await db.appointments.update(id, updates);
  await syncToLocalStorage();
  return await db.appointments.get(id);
}

export async function deleteAppointment(id) {
  await db.appointments.delete(id);
  await syncToLocalStorage();
}

// Settings operations
export async function getSettings() {
  const settings = await db.settings.get('main');
  return settings || initialSettings;
}

export async function updateSettings(newSettings) {
  await db.settings.put({ id: 'main', ...newSettings });
  await syncToLocalStorage();
}

// Full Database Backup & Restore (100% Local)
export async function createFullBackup() {
  const clients = await db.clients.toArray();
  const services = await db.services.toArray();
  const appointments = await db.appointments.toArray();
  const settings = await db.settings.get('main');

  const backupData = {
    version: 2,
    appName: "Aura Salon Manager",
    exportedAt: new Date().toISOString(),
    data: {
      clients,
      services,
      appointments,
      settings: settings || initialSettings
    }
  };

  return backupData;
}

export async function restoreFromBackup(backupJsonString) {
  try {
    const parsed = typeof backupJsonString === 'string' ? JSON.parse(backupJsonString) : backupJsonString;
    
    if (!parsed || !parsed.data || !Array.isArray(parsed.data.clients)) {
      throw new Error("El archivo no tiene el formato válido de respaldo de Aura Salon.");
    }

    await db.transaction('rw', db.clients, db.services, db.appointments, db.settings, async () => {
      await db.clients.clear();
      await db.services.clear();
      await db.appointments.clear();
      await db.settings.clear();

      if (parsed.data.clients.length > 0) {
        await db.clients.bulkAdd(parsed.data.clients);
      }
      if (parsed.data.services && parsed.data.services.length > 0) {
        await db.services.bulkAdd(parsed.data.services);
      }
      if (parsed.data.appointments && parsed.data.appointments.length > 0) {
        await db.appointments.bulkAdd(parsed.data.appointments);
      }
      if (parsed.data.settings) {
        await db.settings.put({ id: 'main', ...parsed.data.settings, lastBackupDate: new Date().toISOString() });
      }
    });

    await syncToLocalStorage();
    return { 
      success: true, 
      clientsCount: parsed.data.clients.length, 
      servicesCount: parsed.data.services?.length || 0,
      appointmentsCount: parsed.data.appointments?.length || 0
    };
  } catch (error) {
    console.error("Restore failed:", error);
    return { success: false, error: error.message };
  }
}

export async function resetToDemoData() {
  await db.clients.clear();
  await db.services.clear();
  await db.appointments.clear();
  await db.settings.clear();
  await db.clients.bulkAdd(initialClients);
  await db.services.bulkAdd(initialServices);
  await db.appointments.bulkAdd(initialAppointments);
  await db.settings.put({ id: 'main', ...initialSettings });
  await syncToLocalStorage();
}
