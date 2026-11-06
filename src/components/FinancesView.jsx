import React, { useMemo } from 'react';
import { 
  TrendingUp, DollarSign, Calendar, Scissors, 
  Award, PieChart, Clock
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/dateUtils';

export default function FinancesView({ services, settings }) {
  const calculations = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().substring(0, 10);
    
    // 7 days ago
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let todayTotal = 0;
    let todayCount = 0;
    let weekTotal = 0;
    let allTimeTotal = 0;

    const serviceCounts = {};

    services.forEach(srv => {
      const srvDate = new Date(srv.date);
      const srvDateStr = srv.date.substring(0, 10);
      const price = Number(srv.price) || 0;

      allTimeTotal += price;

      if (srvDateStr === todayStr) {
        todayTotal += price;
        todayCount++;
      }

      if (srvDate >= weekAgo) {
        weekTotal += price;
      }

      // Group by service type
      const type = srv.serviceType || 'otro';
      if (!serviceCounts[type]) {
        serviceCounts[type] = { count: 0, total: 0, label: srv.serviceName };
      }
      serviceCounts[type].count++;
      serviceCounts[type].total += price;
    });

    const topServices = Object.entries(serviceCounts)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.total - a.total);

    const averageTicket = services.length > 0 ? Math.round(allTimeTotal / services.length) : 0;

    return {
      todayTotal,
      todayCount,
      weekTotal,
      allTimeTotal,
      topServices,
      averageTicket
    };
  }, [services]);

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-serif">
          Caja y Rendimiento
        </h2>
        <p className="text-xs text-slate-400">
          Control financiero de servicios realizados en local
        </p>
      </div>

      {/* Main Income Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Today's Cash */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-950/70 via-dark-card to-dark-surface border border-gold-500/30 shadow-card-glow space-y-1">
          <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider flex items-center space-x-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Caja de Hoy</span>
          </span>
          <p className="text-xl font-extrabold text-slate-100 tracking-tight">
            {formatCurrency(calculations.todayTotal, settings.currencySymbol)}
          </p>
          <span className="text-[10px] text-slate-400 block">
            {calculations.todayCount} clientes atendidos hoy
          </span>
        </div>

        {/* Last 7 Days */}
        <div className="p-4 rounded-2xl bg-dark-surface border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Últimos 7 Días</span>
          </span>
          <p className="text-xl font-extrabold text-gold-300 tracking-tight">
            {formatCurrency(calculations.weekTotal, settings.currencySymbol)}
          </p>
          <span className="text-[10px] text-slate-500 block">
            Ticket promedio: {formatCurrency(calculations.averageTicket, settings.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Total Historical Card */}
      <div className="p-4 rounded-2xl bg-dark-base border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">
            Facturación Total Registrada
          </span>
          <span className="text-lg font-bold text-slate-100">
            {formatCurrency(calculations.allTimeTotal, settings.currencySymbol)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-gold-400">
            {services.length} servicios
          </span>
          <p className="text-[10px] text-slate-500">100% en local</p>
        </div>
      </div>

      {/* Top Services Breakdown */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-gold-400" />
          <span>Servicios Más Rentables</span>
        </h3>

        <div className="space-y-2">
          {calculations.topServices.map((item, idx) => {
            const percent = calculations.allTimeTotal > 0
              ? Math.round((item.total / calculations.allTimeTotal) * 100)
              : 0;

            return (
              <div 
                key={item.type}
                className="p-3 rounded-2xl bg-dark-surface border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-lg bg-slate-800 text-[10px] font-bold text-gold-400 flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {item.type === 'tinte' ? '🎨 Tintes & Color' : item.type === 'corte' ? '✂️ Cortes de Cabello' : item.type === 'barba' ? '🧔 Barba & Perfilado' : item.type === 'keratina' ? '🧴 Alisados & Keratina' : item.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gold-300">
                      {formatCurrency(item.total, settings.currencySymbol)}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1.5">
                      ({item.count} citas)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gold-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Últimas Sesiones Cobradas</span>
        </h3>

        <div className="space-y-1.5">
          {services.slice(0, 5).map(srv => (
            <div 
              key={srv.id}
              className="p-2.5 rounded-xl bg-dark-surface/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-medium text-slate-200">{srv.clientName}</p>
                <span className="text-[10px] text-slate-400">
                  {srv.serviceName} • {formatDate(srv.date)}
                </span>
              </div>
              <span className="font-bold text-gold-400">
                {formatCurrency(srv.price, settings.currencySymbol)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
