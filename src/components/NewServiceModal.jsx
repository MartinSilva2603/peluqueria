import React, { useState } from 'react';
import { 
  X, Check, Scissors, Palette, Sparkles, 
  User, DollarSign, Calendar, Clock, FileText, UserPlus
} from 'lucide-react';

const SERVICE_PRESETS = [
  { id: 'corte', label: '✂️ Corte de Cabello', defaultDays: 22, defaultPrice: 35 },
  { id: 'tinte', label: '🎨 Tinte & Coloración', defaultDays: 32, defaultPrice: 90 },
  { id: 'barba', label: '🧔 Perfilado de Barba', defaultDays: 14, defaultPrice: 25 },
  { id: 'keratina', label: '🧴 Alisado / Keratina', defaultDays: 75, defaultPrice: 150 },
  { id: 'peinado', label: '✨ Peinado / Cepillado', defaultDays: 15, defaultPrice: 40 },
  { id: 'unas', label: '💅 Uñas & Manicura', defaultDays: 20, defaultPrice: 30 },
  { id: 'otro', label: '🏷️ Otro Servicio', defaultDays: 30, defaultPrice: 50 },
];

export default function NewServiceModal({ 
  clients, 
  preselectedClient, 
  preselectedService,
  settings, 
  onSave, 
  onClose,
  onAddNewClient 
}) {
  const [selectedClientId, setSelectedClientId] = useState(preselectedClient ? preselectedClient.id : '');
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const [serviceType, setServiceType] = useState(preselectedService?.serviceType || 'corte');
  const [serviceName, setServiceName] = useState(preselectedService?.serviceName || 'Corte de Cabello');
  const [price, setPrice] = useState(preselectedService?.estimatedPrice || 35);
  const [recallDays, setRecallDays] = useState(22);
  const [technicalNotes, setTechnicalNotes] = useState(preselectedService?.notes || '');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().substring(0, 10));

  const currentClient = clients.find(c => c.id === selectedClientId) || preselectedClient;

  const handleSelectServiceType = (preset) => {
    setServiceType(preset.id);
    setServiceName(preset.label.replace(/^[^\s]+\s/, ''));
    
    const customDays = settings.defaultRecalls?.[preset.id] || preset.defaultDays;
    setRecallDays(customDays);

    if (!price || price === 35 || price === 90 || price === 25 || price === 150) {
      setPrice(preset.defaultPrice);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let targetClientId = selectedClientId;
    let targetClientName = currentClient?.name || '';
    let targetClientPhone = currentClient?.phone || '';

    if (isCreatingClient) {
      if (!newClientName.trim() || !newClientPhone.trim()) {
        alert("Por favor ingresa el nombre y teléfono del nuevo cliente.");
        return;
      }
      const newClient = onAddNewClient({
        name: newClientName,
        phone: newClientPhone,
        notes: technicalNotes
      });
      targetClientId = newClient.id;
      targetClientName = newClient.name;
      targetClientPhone = newClient.phone;
    } else {
      if (!targetClientId) {
        alert("Por favor selecciona un cliente existente o añade uno nuevo.");
        return;
      }
    }

    onSave({
      clientId: targetClientId,
      clientName: targetClientName,
      clientPhone: targetClientPhone,
      serviceType,
      serviceName,
      price: Number(price) || 0,
      recallDays: Number(recallDays) || 30,
      technicalNotes,
      date: new Date(serviceDate + 'T12:00:00').toISOString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-dark-surface rounded-t-3xl sm:rounded-3xl border border-gold-500/30 p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <Scissors className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Cobrar Servicio Realizado
              </h3>
              <p className="text-xs text-slate-400">
                Registra el pago y activa el radar para la próxima cita
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Cliente
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingClient(!isCreatingClient)}
                className="text-[11px] text-gold-400 hover:text-gold-300 font-medium flex items-center space-x-1"
              >
                {isCreatingClient ? (
                  <span>Seleccionar existente</span>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>+ Nuevo cliente rápido</span>
                  </>
                )}
              </button>
            </div>

            {isCreatingClient ? (
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-dark-base border border-gold-500/30 animate-fade-in">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ej. Rosa Benítez"
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
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-500"
              >
                <option value="">-- Elige un cliente --</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Service Presets */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Tipo de Servicio
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {SERVICE_PRESETS.map((preset) => {
                const isSelected = serviceType === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectServiceType(preset)}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      isSelected
                        ? 'bg-gold-500/20 border-gold-500 text-gold-300 font-bold'
                        : 'bg-dark-base border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[11px] block truncate">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Details: Name & Price */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Nombre específico</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Ej. Tinte Raíz y Matiz"
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Cobro ({settings.currencySymbol || 'S/'})
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Monto cobrado"
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500 font-bold text-gold-300"
              />
            </div>
          </div>

          {/* Recall Interval Engine */}
          <div className="p-3 rounded-2xl bg-dark-base/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gold-300 flex items-center space-x-1.5 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span>¿Cuándo recordarle su próxima cita?</span>
              </span>
              <span className="font-bold text-slate-100 bg-gold-500/20 px-2 py-0.5 rounded-lg border border-gold-500/30 text-xs">
                En {recallDays} días
              </span>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
              {[14, 21, 30, 45, 60, 75].map(days => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setRecallDays(days)}
                  className={`px-2.5 py-1 rounded-lg border transition-all ${
                    recallDays === days
                      ? 'bg-gold-500 text-dark-base font-bold'
                      : 'bg-dark-card border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {days}d {days === 30 ? '(Tinte)' : days === 21 ? '(Corte)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Chemical Formula / Technical Notes */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-300">
                Fórmula Técnica / Observaciones
              </label>
              <span className="text-[10px] text-slate-500">Se guarda en la ficha del cliente</span>
            </div>
            <textarea
              value={technicalNotes}
              onChange={(e) => setTechnicalNotes(e.target.value)}
              placeholder="Ej. Tinte Igora 7.1 + 20 volúmenes. Matizador en bacha por 6 minutos..."
              rows={2}
              className="w-full bg-dark-base border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Fecha del servicio</label>
            <input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-amber-400 hover:from-gold-500 hover:to-amber-300 text-dark-base font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-gold-glow touch-press"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Cobro y Activar Radar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
