import React, { useState } from 'react';
import { 
  X, Calendar, Clock, Scissors, User, DollarSign, 
  Check, MessageCircle, ExternalLink, UserPlus
} from 'lucide-react';
import { openGoogleCalendar } from '../utils/calendar';
import { openWhatsApp, buildWhatsAppMessage } from '../utils/whatsapp';

export default function NewAppointmentModal({ 
  clients, 
  settings, 
  preselectedClient, 
  onSave, 
  onClose,
  onAddNewClient 
}) {
  const [clientId, setClientId] = useState(preselectedClient ? preselectedClient.id : '');
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [time, setTime] = useState('10:00');
  const [serviceType, setServiceType] = useState('corte');
  const [serviceName, setServiceName] = useState('Corte de Cabello');
  const [estimatedPrice, setEstimatedPrice] = useState(35);
  const [notes, setNotes] = useState('');

  const [syncToCalendar, setSyncToCalendar] = useState(true);
  const [sendWhatsAppConfirmation, setSendWhatsAppConfirmation] = useState(true);

  const currentClient = clients.find(c => c.id === clientId) || preselectedClient;

  const handleSelectService = (type, name, price) => {
    setServiceType(type);
    setServiceName(name);
    setEstimatedPrice(price);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let targetClientId = clientId;
    let targetName = currentClient?.name || '';
    let targetPhone = currentClient?.phone || '';

    if (isNewClient) {
      if (!newClientName.trim() || !newClientPhone.trim()) {
        alert("Ingresa el nombre y celular del cliente.");
        return;
      }
      const created = onAddNewClient({
        name: newClientName,
        phone: newClientPhone
      });
      targetClientId = created.id;
      targetName = created.name;
      targetPhone = created.phone;
    } else {
      if (!targetClientId) {
        alert("Por favor selecciona un cliente.");
        return;
      }
    }

    const appointmentData = {
      clientId: targetClientId,
      clientName: targetName,
      clientPhone: targetPhone,
      serviceType,
      serviceName,
      date,
      time,
      estimatedPrice: Number(estimatedPrice) || 0,
      notes
    };

    onSave(appointmentData);

    // Option 1: Launch Google Calendar intent in mobile
    if (syncToCalendar) {
      openGoogleCalendar({
        ...appointmentData,
        businessName: settings.businessName || 'Aura Peluquería'
      });
    }

    // Option 2: Send WhatsApp confirmation
    if (sendWhatsAppConfirmation) {
      const template = settings.templates?.confirmacion_cita;
      const msg = buildWhatsAppMessage(template, {
        clientName: targetName,
        businessName: settings.businessName || 'Aura Peluquería',
        serviceName,
        date,
        hora: time
      });
      openWhatsApp(targetPhone, msg, settings.countryCode || '51');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-dark-surface rounded-t-3xl sm:rounded-3xl border border-gold-500/30 p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <Calendar className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Agendar Nueva Cita
              </h3>
              <p className="text-xs text-slate-400">
                Programa fecha y hora para el cliente
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Client Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Cliente
              </label>
              <button
                type="button"
                onClick={() => setIsNewClient(!isNewClient)}
                className="text-[11px] text-gold-400 hover:text-gold-300 font-medium flex items-center space-x-1"
              >
                {isNewClient ? (
                  <span>Seleccionar existente</span>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>+ Nuevo rápido</span>
                  </>
                )}
              </button>
            </div>

            {isNewClient ? (
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-dark-base border border-gold-500/30 animate-fade-in">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-dark-surface border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="Ej. 987654321"
                    className="w-full bg-dark-surface border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            ) : (
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-500"
              >
                <option value="">-- Selecciona el cliente --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Fecha</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Hora</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Quick Service Presets in Soles */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 block">Servicio a agendar</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { type: 'corte', name: 'Corte de Cabello', price: 35, label: '✂️ Corte (S/ 35)' },
                { type: 'tinte', name: 'Tinte & Coloración', price: 90, label: '🎨 Tinte (S/ 90)' },
                { type: 'barba', name: 'Perfilado de Barba', price: 25, label: '🧔 Barba (S/ 25)' },
                { type: 'keratina', name: 'Alisado Keratina', price: 150, label: '🧴 Keratina (S/ 150)' },
              ].map(item => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleSelectService(item.type, item.name, item.price)}
                  className={`p-2 rounded-xl text-center border transition-all text-[11px] ${
                    serviceType === item.type
                      ? 'bg-gold-500/20 border-gold-500 text-gold-300 font-bold'
                      : 'bg-dark-base border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Nombre Servicio</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Precio Estimado ({settings.currencySymbol || 'S/'})</label>
              <input
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Observaciones / Preferencias</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Llega 10 min antes, preparar fórmula previa..."
              rows={2}
              className="w-full bg-dark-base border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          {/* Automations check */}
          <div className="p-3 rounded-2xl bg-dark-base/80 border border-slate-800 space-y-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={syncToCalendar}
                onChange={(e) => setSyncToCalendar(e.target.checked)}
                className="rounded accent-gold-500 w-4 h-4"
              />
              <span className="text-slate-300 font-medium text-[11px]">
                📅 Abrir Google Calendar al guardar
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={sendWhatsAppConfirmation}
                onChange={(e) => setSendWhatsAppConfirmation(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4"
              />
              <span className="text-slate-300 font-medium text-[11px]">
                💬 Enviar mensaje de confirmación por WhatsApp
              </span>
            </label>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-dark-base font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-gold-glow touch-press"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Cita en la Agenda</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
