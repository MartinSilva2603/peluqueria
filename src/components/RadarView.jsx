import React, { useState, useMemo } from 'react';
import { 
  Sparkles, MessageCircle, Calendar, AlertTriangle, 
  CheckCircle2, Clock, Filter, Search, ChevronRight,
  TrendingUp, Phone, Scissors, Palette, Gift, Tag
} from 'lucide-react';
import { getClientStatus, formatDate, formatCurrency, checkUpcomingBirthday } from '../utils/dateUtils';

export default function RadarView({ 
  clients, 
  settings, 
  onOpenWhatsApp, 
  onSelectClient, 
  onNewServiceForClient,
  onScheduleForClient 
}) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'tinte', 'corte', 'urgent', 'birthday'
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statuses, birthdays, and sort by urgency
  const analyzedClients = useMemo(() => {
    return clients.map(client => {
      const statusInfo = getClientStatus(client);
      const bdayInfo = checkUpcomingBirthday(client.birthDate);
      return {
        ...client,
        statusInfo,
        bdayInfo
      };
    }).sort((a, b) => {
      // Prioritize upcoming birthdays if filter is not set
      if (a.bdayInfo && !b.bdayInfo) return -1;
      if (!a.bdayInfo && b.bdayInfo) return 1;

      const priorityOrder = { urgent: 0, due: 1, upcoming: 2, ok: 3, never: 4 };
      const diff = priorityOrder[a.statusInfo.status] - priorityOrder[b.statusInfo.status];
      if (diff !== 0) return diff;
      return (b.statusInfo.daysElapsed || 0) - (a.statusInfo.daysElapsed || 0);
    });
  }, [clients]);

  // Upcoming birthday clients
  const birthdayClients = useMemo(() => {
    return analyzedClients.filter(c => c.bdayInfo !== null);
  }, [analyzedClients]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return analyzedClients.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.phone.includes(searchQuery);
      if (!matchesSearch) return false;

      if (filterType === 'all') return true;
      if (filterType === 'birthday') return c.bdayInfo !== null;
      if (filterType === 'urgent') return c.statusInfo.status === 'urgent';
      if (filterType === 'due') return c.statusInfo.status === 'due' || c.statusInfo.status === 'urgent';
      if (filterType === 'tinte') return c.lastServiceType === 'tinte' || (c.favoriteServices && c.favoriteServices.includes('tinte'));
      if (filterType === 'corte') return c.lastServiceType === 'corte' || (c.favoriteServices && c.favoriteServices.includes('corte'));
      return true;
    });
  }, [analyzedClients, filterType, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const urgent = analyzedClients.filter(c => c.statusInfo.status === 'urgent').length;
    const due = analyzedClients.filter(c => c.statusInfo.status === 'due').length;
    const tintes = analyzedClients.filter(c => 
      (c.lastServiceType === 'tinte' || c.favoriteServices?.includes('tinte')) &&
      (c.statusInfo.status === 'urgent' || c.statusInfo.status === 'due')
    ).length;
    
    const potentialRevenue = analyzedClients
      .filter(c => c.statusInfo.status === 'urgent' || c.statusInfo.status === 'due')
      .reduce((sum, c) => sum + ((c.totalSpent / Math.max(c.totalVisits || 1, 1)) || 35), 0);

    return { urgent, due, tintes, potentialRevenue };
  }, [analyzedClients]);

  return (
    <div className="space-y-4 pb-24">
      {/* Smart Opportunity Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold-950/60 via-dark-card to-dark-surface p-4 border border-gold-500/20 shadow-card-glow">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-1.5">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Radar de Reenganche Automático</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 font-serif">
              Oportunidades de Hoy
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Clientes listos para corte, tinte o saludo de cumpleaños.
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-800/80">
          <div className="bg-dark-base/50 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] font-medium text-slate-400 block">Tintes por citar</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-base font-bold text-rose-300">{stats.tintes}</span>
            </div>
          </div>

          <div className="bg-dark-base/50 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] font-medium text-slate-400 block">Total a contactar</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-base font-bold text-amber-300">{stats.urgent + stats.due}</span>
            </div>
          </div>

          <div className="bg-dark-base/50 rounded-xl p-2.5 border border-slate-800">
            <span className="text-[10px] font-medium text-slate-400 block">Ingreso estimado</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-bold text-gold-300 truncate">
                {formatCurrency(stats.potentialRevenue, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Birthday Banner if any upcoming */}
      {birthdayClients.length > 0 && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/50 via-dark-card to-dark-surface border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Gift className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-purple-200">
                  🎉 Cumpleaños Próximos ({birthdayClients.length})
                </span>
                <p className="text-[10px] text-slate-400">
                  Envíales una felicitación con descuento para fidelizarlos
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            {birthdayClients.map(client => (
              <div 
                key={client.id}
                className="flex items-center justify-between p-2 rounded-xl bg-dark-base/60 border border-purple-500/20 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200">{client.name}</span>
                  <span className="text-[10px] text-purple-300 ml-2 font-medium">
                    {client.bdayInfo.label}
                  </span>
                </div>
                <button
                  onClick={() => onOpenWhatsApp(client, 'cumpleanos')}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex items-center space-x-1 touch-press"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Felicitar</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Segment Pills */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente o celular..."
            className="w-full bg-dark-surface/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all touch-press font-medium ${
              filterType === 'all'
                ? 'bg-gold-500 text-dark-base font-bold shadow-gold-glow'
                : 'bg-dark-surface text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Todos ({clients.length})
          </button>

          <button
            onClick={() => setFilterType('tinte')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all touch-press font-medium ${
              filterType === 'tinte'
                ? 'bg-gold-500 text-dark-base font-bold shadow-gold-glow'
                : 'bg-dark-surface text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>🎨 Tintes</span>
          </button>

          <button
            onClick={() => setFilterType('corte')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all touch-press font-medium ${
              filterType === 'corte'
                ? 'bg-gold-500 text-dark-base font-bold shadow-gold-glow'
                : 'bg-dark-surface text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <Scissors className="w-3 h-3" />
            <span>✂️ Cortes</span>
          </button>

          <button
            onClick={() => setFilterType('urgent')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all touch-press font-medium ${
              filterType === 'urgent'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                : 'bg-dark-surface text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>🚨 Vencidos ({stats.urgent})</span>
          </button>

          {birthdayClients.length > 0 && (
            <button
              onClick={() => setFilterType('birthday')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all touch-press font-medium ${
                filterType === 'birthday'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-dark-surface text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Gift className="w-3 h-3 text-purple-400" />
              <span>🎂 Cumpleaños ({birthdayClients.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* List of Client Radar Cards */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 px-4 bg-dark-surface/40 rounded-2xl border border-slate-800">
            <Clock className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No hay clientes con este filtro</p>
            <p className="text-xs text-slate-500 mt-1">Prueba seleccionando "Todos" o busca otro nombre.</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const isTinte = client.lastServiceType === 'tinte';
            const days = client.statusInfo.daysElapsed;

            return (
              <div 
                key={client.id}
                className="bg-dark-surface/80 rounded-2xl p-4 border border-slate-800/80 hover:border-gold-500/30 transition-all shadow-card-glow space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div 
                    onClick={() => onSelectClient(client)}
                    className="cursor-pointer group flex-1 pr-2"
                  >
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-gold-400 transition-colors">
                        {client.name}
                      </h3>
                      {client.totalVisits > 3 && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                          VIP
                        </span>
                      )}
                      {client.bdayInfo && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          🎂 Cumple
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1.5">
                      <span>{client.phone}</span>
                      <span>•</span>
                      <span>{client.totalVisits || 0} visitas</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${client.statusInfo.badgeClass}`}>
                    {client.statusInfo.label}
                  </span>
                </div>

                {/* Service Details & Timeline info */}
                <div className="bg-dark-base/60 rounded-xl p-2.5 border border-slate-800/60 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5 text-slate-400">
                      {isTinte ? (
                        <Palette className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Scissors className="w-3.5 h-3.5 text-gold-400" />
                      )}
                      <span>Último servicio:</span>
                    </span>
                    <span className="font-semibold text-slate-200">
                      {client.lastServiceName || (isTinte ? 'Tinte / Color' : 'Corte de cabello')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fecha de visita:</span>
                    <span className="text-slate-300 font-medium">
                      {formatDate(client.lastVisitDate)} ({days ? `Hace ${days} días` : 'Sin fecha'})
                    </span>
                  </div>

                  {client.notes && (
                    <div className="pt-1.5 border-t border-slate-800 text-[11px] text-gold-300/90 italic truncate">
                      💡 {client.notes.split('\n')[0]}
                    </div>
                  )}
                </div>

                {/* Action Buttons: 1-Tap WhatsApp, Agendar Cita, Atender */}
                <div className="flex items-center space-x-1.5 pt-1">
                  <button
                    onClick={() => onOpenWhatsApp(client, client.bdayInfo ? 'cumpleanos' : null)}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-2 px-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-md shadow-emerald-900/30 touch-press transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-white/20" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => onScheduleForClient(client)}
                    title="Agendar turno en calendario"
                    className="bg-dark-card hover:bg-slate-800 text-blue-400 border border-blue-500/30 py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 touch-press transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Agendar</span>
                  </button>

                  <button
                    onClick={() => onNewServiceForClient(client)}
                    title="Cobrar sesión hoy"
                    className="bg-dark-card hover:bg-slate-800 text-gold-400 border border-gold-500/30 py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center space-x-1 touch-press transition-all"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Atender</span>
                  </button>

                  <button
                    onClick={() => onSelectClient(client)}
                    title="Ver ficha completa"
                    className="p-2 rounded-xl bg-dark-card border border-slate-800 text-slate-400 hover:text-slate-200 touch-press"
                  >
                    <ChevronRight className="w-4 h-4" />
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
