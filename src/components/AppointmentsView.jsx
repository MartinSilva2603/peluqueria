import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, CheckCircle2, XCircle, Plus, 
  MessageCircle, ExternalLink, Scissors, User, Phone,
  Bell, AlertCircle, Share2
} from 'lucide-react';
import { openGoogleCalendar } from '../utils/calendar';
import { openWhatsApp, buildWhatsAppMessage } from '../utils/whatsapp';
import { formatCurrency, formatDate } from '../utils/dateUtils';
import { sendLocalNotification, requestNotificationPermission } from '../utils/notifications';

export default function AppointmentsView({ 
  appointments, 
  settings, 
  onNewAppointment, 
  onUpdateStatus, 
  onDeleteAppointment,
  onCompleteAndCharge 
}) {
  const [filterPeriod, setFilterPeriod] = useState('upcoming'); // 'today', 'upcoming', 'all'
  const todayStr = new Date().toISOString().substring(0, 10);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      if (filterPeriod === 'today') {
        return apt.date === todayStr;
      }
      if (filterPeriod === 'upcoming') {
        return apt.status === 'programada' && apt.date >= todayStr;
      }
      return true;
    }).sort((a, b) => {
      const dateA = a.date + ' ' + a.time;
      const dateB = b.date + ' ' + b.time;
      return dateA.localeCompare(dateB);
    });
  }, [appointments, filterPeriod, todayStr]);

  const todayCount = appointments.filter(a => a.date === todayStr && a.status === 'programada').length;

  const handleSendReminderWA = (apt) => {
    const isToday = apt.date === todayStr;
    const template = isToday 
      ? settings.templates?.recordatorio_cita 
      : settings.templates?.confirmacion_cita;

    const msg = buildWhatsAppMessage(template, {
      clientName: apt.clientName,
      businessName: settings.businessName || 'Aura Peluquería',
      serviceName: apt.serviceName,
      fecha: apt.date,
      hora: apt.time
    });

    openWhatsApp(apt.clientPhone, msg, settings.countryCode || '51');
  };

  const handleNotificationTest = async (apt) => {
    const perm = await requestNotificationPermission();
    if (perm.granted) {
      sendLocalNotification(`🔔 Cita en Peluquería: ${apt.clientName}`, {
        body: `A las ${apt.time} - ${apt.serviceName}. ¡Ten listo tu puesto de trabajo!`,
      });
      alert(`Alerta enviada a la barra de notificaciones del celular para ${apt.clientName}`);
    } else {
      alert("Por favor permite las notificaciones en tu navegador/móvil para recibir alertas.");
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 font-serif">
            Agenda de Citas & Turnos
          </h2>
          <p className="text-xs text-slate-400">
            {todayCount > 0 ? `${todayCount} citas programadas para hoy` : 'Sin citas pendientes para hoy'}
          </p>
        </div>

        <button
          onClick={onNewAppointment}
          className="bg-gold-500 hover:bg-gold-400 text-dark-base font-bold text-xs py-2 px-3 rounded-xl flex items-center space-x-1 shadow-gold-glow touch-press transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Agendar Cita</span>
        </button>
      </div>

      {/* Sync with Google Calendar Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/40 via-dark-card to-dark-surface border border-blue-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-200">Sincronización con Google Calendar</p>
            <span className="text-[10px] text-slate-400">Guarda tus citas directamente en el calendario de tu celular</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 text-xs">
        <button
          onClick={() => setFilterPeriod('today')}
          className={`px-3 py-1.5 rounded-xl transition-all font-medium ${
            filterPeriod === 'today'
              ? 'bg-gold-500 text-dark-base font-bold shadow-gold-glow'
              : 'bg-dark-surface text-slate-400 border border-slate-800'
          }`}
        >
          Hoy ({appointments.filter(a => a.date === todayStr).length})
        </button>

        <button
          onClick={() => setFilterPeriod('upcoming')}
          className={`px-3 py-1.5 rounded-xl transition-all font-medium ${
            filterPeriod === 'upcoming'
              ? 'bg-gold-500 text-dark-base font-bold shadow-gold-glow'
              : 'bg-dark-surface text-slate-400 border border-slate-800'
          }`}
        >
          Próximas Activas
        </button>

        <button
          onClick={() => setFilterPeriod('all')}
          className={`px-3 py-1.5 rounded-xl transition-all font-medium ${
            filterPeriod === 'all'
              ? 'bg-gold-500 text-dark-base font-bold shadow-gold-glow'
              : 'bg-dark-surface text-slate-400 border border-slate-800'
          }`}
        >
          Historial Completo
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 px-4 bg-dark-surface/40 rounded-2xl border border-slate-800">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No hay citas en este periodo</p>
            <p className="text-xs text-slate-500 mt-1">
              Toca el botón "+ Agendar Cita" para programar el próximo turno.
            </p>
          </div>
        ) : (
          filteredAppointments.map(apt => {
            const isToday = apt.date === todayStr;
            const isDone = apt.status === 'completada';
            const isCancelled = apt.status === 'cancelada';

            return (
              <div 
                key={apt.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isToday 
                    ? 'bg-gradient-to-br from-gold-950/40 via-dark-surface to-dark-card border-gold-500/40 shadow-card-glow'
                    : 'bg-dark-surface border-slate-800/80'
                }`}
              >
                {/* Time & Client Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-lg bg-gold-500/20 text-gold-300 font-mono font-bold text-xs border border-gold-500/30">
                        ⏰ {apt.time}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {isToday ? '¡Hoy!' : formatDate(apt.date)}
                      </span>
                      {isToday && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-slate-100 mt-1">
                      {apt.clientName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {apt.serviceName} • {formatCurrency(apt.estimatedPrice, settings.currencySymbol)}
                    </p>
                  </div>

                  {/* Status chip */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isDone 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : isCancelled
                      ? 'bg-slate-800 text-slate-500 border border-slate-700'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {isDone ? 'Atendido' : isCancelled ? 'Cancelado' : 'Pendiente'}
                  </span>
                </div>

                {/* Notes if any */}
                {apt.notes && (
                  <p className="text-[11px] text-slate-400 bg-dark-base/50 p-2 rounded-xl border border-slate-800/60 italic">
                    📌 {apt.notes}
                  </p>
                )}

                {/* Actions row: Calendar sync, WhatsApp, Attend/Charge */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {/* Google Calendar button */}
                  <button
                    onClick={() => openGoogleCalendar({
                      clientName: apt.clientName,
                      clientPhone: apt.clientPhone,
                      serviceName: apt.serviceName,
                      date: apt.date,
                      time: apt.time,
                      notes: apt.notes,
                      businessName: settings.businessName
                    })}
                    className="p-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-500/30 text-[11px] font-medium flex items-center justify-center space-x-1 touch-press"
                    title="Guardar en Google Calendar"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>G-Calendar</span>
                  </button>

                  {/* WhatsApp Reminder */}
                  <button
                    onClick={() => handleSendReminderWA(apt)}
                    className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium flex items-center justify-center space-x-1 touch-press"
                    title="Avisar por WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Complete & Charge (Or Reopen) */}
                  {!isDone ? (
                    <button
                      onClick={() => onCompleteAndCharge(apt)}
                      className="p-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-base text-[11px] font-bold flex items-center justify-center space-x-1 shadow-gold-glow touch-press"
                    >
                      <Scissors className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Cobrar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(apt.id, 'programada')}
                      className="p-2 rounded-xl bg-slate-800 text-slate-400 text-[11px] flex items-center justify-center space-x-1"
                    >
                      <span>Reabrir</span>
                    </button>
                  )}
                </div>

                {/* Additional option: trigger alert to phone */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                  <button
                    onClick={() => handleNotificationTest(apt)}
                    className="hover:text-gold-400 flex items-center space-x-1"
                  >
                    <Bell className="w-3 h-3 text-gold-400" />
                    <span>Probar alerta en móvil</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("¿Deseas eliminar esta cita?")) {
                        onDeleteAppointment(apt.id);
                      }
                    }}
                    className="hover:text-rose-400"
                  >
                    Eliminar cita
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
