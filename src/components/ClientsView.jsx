import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Plus, Phone, MessageCircle, 
  Scissors, Palette, ChevronRight, Star, Calendar, FileText
} from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import { openWhatsApp } from '../utils/whatsapp';

export default function ClientsView({ 
  clients, 
  settings, 
  onSelectClient, 
  onOpenWhatsApp, 
  onNewClientClick 
}) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, vip, formulas

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.phone.includes(search) ||
                          (c.notes && c.notes.toLowerCase().includes(search.toLowerCase()));
      if (!matchSearch) return false;

      if (filterType === 'vip') return (c.totalVisits || 0) >= 3;
      if (filterType === 'formulas') return Boolean(c.notes && c.notes.trim().length > 0);
      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, search, filterType]);

  return (
    <div className="space-y-4 pb-24">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100 font-serif">
            Directorio de Clientes
          </h2>
          <p className="text-xs text-slate-400">
            {clients.length} clientes registrados en local
          </p>
        </div>

        <button
          onClick={onNewClientClick}
          className="bg-gold-500 hover:bg-gold-400 text-dark-base font-bold text-xs py-2 px-3 rounded-xl flex items-center space-x-1 shadow-gold-glow touch-press transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o fórmula técnica..."
            className="w-full bg-dark-surface/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-gold-500/50"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-xl transition-all ${
              filterType === 'all'
                ? 'bg-slate-700 text-slate-100 font-semibold'
                : 'bg-dark-surface text-slate-400 border border-slate-800'
            }`}
          >
            Todos ({clients.length})
          </button>

          <button
            onClick={() => setFilterType('vip')}
            className={`px-3 py-1 rounded-xl transition-all ${
              filterType === 'vip'
                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-semibold'
                : 'bg-dark-surface text-slate-400 border border-slate-800'
            }`}
          >
            ⭐ Clientes Frecuentes
          </button>

          <button
            onClick={() => setFilterType('formulas')}
            className={`px-3 py-1 rounded-xl transition-all ${
              filterType === 'formulas'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold'
                : 'bg-dark-surface text-slate-400 border border-slate-800'
            }`}
          >
            🎨 Con Fórmulas
          </button>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 bg-dark-surface/40 rounded-2xl border border-slate-800">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No se encontraron clientes</p>
            <p className="text-xs text-slate-500 mt-1">Prueba con otro término de búsqueda.</p>
          </div>
        ) : (
          filtered.map(client => (
            <div
              key={client.id}
              onClick={() => onSelectClient(client)}
              className="bg-dark-surface/80 rounded-2xl p-3.5 border border-slate-800/80 hover:border-gold-500/30 transition-all shadow-sm cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-bold text-gold-400 border border-slate-700 text-xs">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-sm text-slate-100">
                        {client.name}
                      </h4>
                      {client.totalVisits >= 3 && (
                        <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{client.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-gold-300">
                    {formatCurrency(client.totalSpent, settings.currencySymbol)}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    {client.totalVisits || 0} visitas
                  </p>
                </div>
              </div>

              {/* Formula & Last Visit Snippet */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="truncate pr-2">
                  {client.notes ? `🧪 ${client.notes.split('\n')[0]}` : `Último: ${client.lastServiceName || 'Sin servicio'}`}
                </span>
                <span className="shrink-0 text-slate-500">
                  {formatDate(client.lastVisitDate)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onOpenWhatsApp(client)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium flex items-center space-x-1 touch-press"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
                <a
                  href={`tel:${client.phone}`}
                  className="p-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 touch-press"
                  title="Llamar"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
