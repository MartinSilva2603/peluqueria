import React, { useState, useEffect } from 'react';
import { 
  X, Phone, MessageCircle, Calendar, Scissors, 
  Trash2, Edit3, Check, DollarSign, Clock, FileText, Palette, Gift
} from 'lucide-react';
import { getServicesByClient, updateClient, deleteClient } from '../db/db';
import { formatDate, formatCurrency, getDaysDiff, checkUpcomingBirthday } from '../utils/dateUtils';
import { openWhatsApp } from '../utils/whatsapp';

export default function ClientDetailModal({ 
  client, 
  settings, 
  onClose, 
  onOpenWhatsApp, 
  onNewService,
  onScheduleAppointment,
  onClientUpdated,
  onClientDeleted
}) {
  if (!client) return null;

  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);
  const [birthDate, setBirthDate] = useState(client.birthDate || '');
  const [notes, setNotes] = useState(client.notes || '');

  useEffect(() => {
    async function loadClientServices() {
      const history = await getServicesByClient(client.id);
      setServices(history);
    }
    loadClientServices();
  }, [client.id]);

  const handleSaveEdit = async () => {
    const updated = await updateClient(client.id, {
      name: name.trim(),
      phone: phone.trim(),
      birthDate: birthDate,
      notes: notes.trim()
    });
    setIsEditing(false);
    onClientUpdated(updated);
  };

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar a ${client.name} y todo su historial de servicios?`)) {
      await deleteClient(client.id);
      onClientDeleted(client.id);
      onClose();
    }
  };

  const daysSince = client.lastVisitDate ? getDaysDiff(client.lastVisitDate) : null;
  const bdayInfo = checkUpcomingBirthday(client.birthDate);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-dark-surface rounded-t-3xl sm:rounded-3xl border border-gold-500/30 p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gold-600 to-amber-300 flex items-center justify-center text-dark-base font-bold text-base shadow-gold-glow">
              {client.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-slate-100 font-serif">
                  {client.name}
                </h3>
                {bdayInfo && (
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    🎂 Cumpleaños
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>{client.phone}</span>
                <span>•</span>
                <span className="text-gold-400 font-medium">{client.totalVisits || 0} visitas</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-gold-400"
              title="Editar datos"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Edit mode or View mode */}
        {isEditing ? (
          <div className="space-y-3 p-3 rounded-2xl bg-dark-base border border-gold-500/30 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-dark-surface border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Celular</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-dark-surface border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Cumpleaños</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-dark-surface border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Fórmulas y Notas Técnicas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full bg-dark-surface border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-xl bg-gold-500 text-dark-base font-bold shadow-gold-glow flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        ) : (
          /* Technical notes card */
          <div className="p-3.5 rounded-2xl bg-dark-base border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gold-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <Palette className="w-3.5 h-3.5" />
                <span>Fórmula Técnica & Preferencias</span>
              </span>
              <span className="text-[10px] text-slate-500">
                {client.birthDate ? `🎂 Cumple: ${client.birthDate}` : 'Sin fecha cumple'}
              </span>
            </div>
            <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              {client.notes || 'Sin notas técnicas guardadas aún. Pulsa el lápiz para añadir su fórmula de tinte o corte.'}
            </p>
          </div>
        )}

        {/* Quick Summary Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-dark-base border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Total Invertido</span>
            <span className="text-sm font-bold text-gold-300">
              {formatCurrency(client.totalSpent, settings.currencySymbol)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-dark-base border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Última Visita</span>
            <span className="text-sm font-bold text-slate-200">
              {daysSince !== null ? `Hace ${daysSince} días` : 'Nunca'}
            </span>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onOpenWhatsApp(client, bdayInfo ? 'cumpleanos' : null);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md touch-press"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onScheduleAppointment(client);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md touch-press"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar Cita</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNewService(client);
            }}
            className="bg-gold-500 hover:bg-gold-400 text-dark-base font-bold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-gold-glow touch-press"
          >
            <Scissors className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Cobrar Hoy</span>
          </button>
        </div>

        {/* Service History Timeline */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>Historial de Visitas ({services.length})</span>
          </h4>

          {services.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-3 text-center bg-dark-base/50 rounded-xl">
              No hay servicios registrados para este cliente.
            </p>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {services.map(srv => (
                <div 
                  key={srv.id}
                  className="p-2.5 rounded-xl bg-dark-base border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-slate-200">{srv.serviceName}</span>
                    <span className="text-gold-400 font-bold">
                      {formatCurrency(srv.price, settings.currencySymbol)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{formatDate(srv.date)}</span>
                    <span>Avisar a los {srv.recallDays} días</span>
                  </div>
                  {srv.technicalNotes && (
                    <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                      📝 {srv.technicalNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete option */}
        <div className="pt-1 text-right">
          <button
            onClick={handleDelete}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center space-x-1 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar cliente</span>
          </button>
        </div>
      </div>
    </div>
  );
}
