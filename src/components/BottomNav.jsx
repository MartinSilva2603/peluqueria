import React from 'react';
import { Radio, Calendar, PlusCircle, Users, TrendingUp, Settings } from 'lucide-react';

export default function BottomNav({ 
  activeTab, 
  setActiveTab, 
  overdueCount, 
  todayAppointmentsCount, 
  onNewService 
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pb-safe bg-dark-base/95 backdrop-blur-lg border-t border-dark-border px-2 py-1.5 max-w-md mx-auto">
      <div className="flex items-center justify-around">
        {/* Radar / Alertas */}
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all touch-press relative ${
            activeTab === 'radar'
              ? 'text-gold-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Radio className={`w-5 h-5 ${activeTab === 'radar' ? 'text-gold-400 animate-pulse' : ''}`} />
            {overdueCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-dark-base">
                {overdueCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Radar</span>
        </button>

        {/* Agenda / Citas */}
        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all touch-press relative ${
            activeTab === 'appointments'
              ? 'text-gold-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Calendar className="w-5 h-5" />
            {todayAppointmentsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-blue-500 text-white text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center border-2 border-dark-base">
                {todayAppointmentsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Agenda</span>
        </button>

        {/* Botón Central: Cobro / Atender */}
        <button
          onClick={onNewService}
          className="flex flex-col items-center -mt-5 touch-press group"
          title="Cobrar servicio"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 p-[1.5px] shadow-gold-glow group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-dark-base/90 rounded-[14px] flex items-center justify-center">
              <PlusCircle className="w-7 h-7 text-gold-400 group-hover:text-gold-300 transition-colors" />
            </div>
          </div>
          <span className="text-[10px] font-medium text-gold-400 mt-1">Cobrar</span>
        </button>

        {/* Clientes */}
        <button
          onClick={() => setActiveTab('clients')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all touch-press ${
            activeTab === 'clients'
              ? 'text-gold-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Clientes</span>
        </button>

        {/* Finanzas / Caja */}
        <button
          onClick={() => setActiveTab('finances')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all touch-press ${
            activeTab === 'finances'
              ? 'text-gold-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Caja</span>
        </button>
      </div>
    </nav>
  );
}
