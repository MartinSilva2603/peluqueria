import React from 'react';
import { Sparkles, Scissors, ShieldCheck, AlertCircle, Settings } from 'lucide-react';

export default function Header({ settings, overdueCount, onOpenBackup }) {
  const needsBackup = !settings.lastBackupDate || 
    (new Date().getTime() - new Date(settings.lastBackupDate).getTime()) > 7 * 24 * 60 * 60 * 1000;

  return (
    <header className="sticky top-0 z-30 pt-safe bg-dark-base/90 backdrop-blur-md border-b border-dark-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 flex items-center justify-center shadow-gold-glow">
            <Scissors className="w-5 h-5 text-dark-base stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-base tracking-wide text-slate-100 font-serif">
                {settings.businessName || "Aura Salon"}
              </h1>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 fill-gold-400/20" />
            </div>
            <p className="text-[11px] font-medium text-gold-400/90 tracking-wide uppercase">
              Control & Retención de Clientes
            </p>
          </div>
        </div>

        {/* Status badges & Settings shortcut */}
        <div className="flex items-center space-x-2">
          {needsBackup ? (
            <button
              onClick={onOpenBackup}
              title="Copia de seguridad pendiente"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 touch-press"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Backup</span>
            </button>
          ) : (
            <button
              onClick={onOpenBackup}
              title="Base de datos respaldada"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 touch-press"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Seguro</span>
            </button>
          )}

          <button
            onClick={onOpenBackup}
            title="Ajustes y Copia de Seguridad"
            className="p-1.5 rounded-xl bg-dark-card border border-slate-800 text-slate-400 hover:text-gold-400 touch-press"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
