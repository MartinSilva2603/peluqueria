import React, { useState } from 'react';
import { 
  Download, Upload, ShieldCheck, Database, RefreshCw, 
  Settings, Check, AlertTriangle, Share2, Sparkles, Sliders
} from 'lucide-react';
import { 
  createFullBackup, 
  restoreFromBackup, 
  resetToDemoData, 
  updateSettings 
} from '../db/db';
import { formatDate } from '../utils/dateUtils';

export default function BackupView({ 
  settings, 
  clientsCount, 
  servicesCount, 
  onDataRestored 
}) {
  const [businessName, setBusinessName] = useState(settings.businessName || 'Aura Peluquería');
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || '$');
  const [corteDays, setCorteDays] = useState(settings.defaultRecalls?.corte || 22);
  const [tinteDays, setTinteDays] = useState(settings.defaultRecalls?.tinte || 32);
  const [barbaDays, setBarbaDays] = useState(settings.defaultRecalls?.barba || 14);
  const [keratinaDays, setKeratinaDays] = useState(settings.defaultRecalls?.keratina || 75);

  const [savingSettings, setSavingSettings] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState(null);

  // Export database backup
  const handleExportBackup = async () => {
    try {
      const backupObj = await createFullBackup();
      const jsonStr = JSON.stringify(backupObj, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const nowStr = new Date().toISOString().substring(0, 10);
      const fileName = `Respaldo_Peluqueria_${nowStr}.json`;

      // Check if navigator.share with files is supported on mobile
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'application/json' })] })) {
        const file = new File([blob], fileName, { type: 'application/json' });
        await navigator.share({
          title: 'Respaldo Base de Datos Peluquería',
          text: `Copia de seguridad con ${clientsCount} clientes y ${servicesCount} servicios.`,
          files: [file]
        });
      } else {
        // Fallback: standard web download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Update last backup timestamp
      await updateSettings({
        ...settings,
        lastBackupDate: new Date().toISOString()
      });

      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3500);
    } catch (err) {
      console.error('Export backup error:', err);
      alert('Error al generar la copia: ' + err.message);
    }
  };

  // Restore database from file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target.result;
        const res = await restoreFromBackup(content);
        if (res.success) {
          setRestoreMessage({
            type: 'success',
            text: `¡Base de datos restaurada con éxito! Se cargaron ${res.clientsCount} clientes y ${res.servicesCount} servicios.`
          });
          onDataRestored();
        } else {
          setRestoreMessage({
            type: 'error',
            text: 'Error al restaurar: ' + res.error
          });
        }
      } catch (err) {
        setRestoreMessage({
          type: 'error',
          text: 'Archivo corrupto o formato no válido.'
        });
      }
    };
    reader.readAsText(file);
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    await updateSettings({
      ...settings,
      businessName,
      currencySymbol,
      defaultRecalls: {
        corte: Number(corteDays) || 22,
        tinte: Number(tinteDays) || 32,
        barba: Number(barbaDays) || 14,
        keratina: Number(keratinaDays) || 75
      }
    });
    setSavingSettings(false);
    alert('¡Ajustes guardados correctamente!');
  };

  // Reset to Demo Data
  const handleResetDemo = async () => {
    if (window.confirm("¿Deseas restaurar los datos de demostración iniciales? Esto reemplazará los datos actuales.")) {
      await resetToDemoData();
      onDataRestored();
      alert("Datos de demostración restaurados.");
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-serif">
          Copias de Seguridad & Ajustes
        </h2>
        <p className="text-xs text-slate-400">
          Tus datos se almacenan 100% en este dispositivo móvil
        </p>
      </div>

      {/* Backup Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-dark-card to-dark-surface border border-gold-500/30 shadow-card-glow space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
            <Database className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">
              Respaldo de Base de Datos
            </h3>
            <p className="text-xs text-slate-400">
              {clientsCount} clientes • {servicesCount} servicios registrados
            </p>
          </div>
        </div>

        <div className="bg-dark-base/70 rounded-xl p-3 text-xs text-slate-300 space-y-1 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Último respaldo:</span>
            <span className="font-semibold text-gold-300">
              {settings.lastBackupDate ? formatDate(settings.lastBackupDate) : 'Nunca realizado'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            💡 Puedes exportar tu copia y enviártela por WhatsApp o guardarla en Google Drive para que nunca pierdas los datos de tus clientes.
          </p>
        </div>

        {backupSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>¡Copia de seguridad generada y descargada con éxito!</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="bg-gold-500 hover:bg-gold-400 text-dark-base font-bold py-3 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-gold-glow touch-press transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Descargar Respaldo</span>
          </button>

          <label className="bg-dark-base hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold py-3 px-3 rounded-xl text-xs flex items-center justify-center space-x-1.5 cursor-pointer touch-press transition-all">
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Restaurar Archivo</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {restoreMessage && (
          <div className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
            restoreMessage.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            <span>{restoreMessage.text}</span>
          </div>
        )}
      </div>

      {/* Salon Settings */}
      <form onSubmit={handleSaveSettings} className="p-4 rounded-2xl bg-dark-surface border border-slate-800 space-y-3.5 text-xs">
        <h3 className="font-bold text-sm text-slate-200 flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-gold-400" />
          <span>Configuración del Negocio</span>
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Nombre del Salón</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Símbolo de Moneda</label>
            <input
              type="text"
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Default recall days */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-300 block">
            Tiempos de Recordatorio Sugeridos (Días)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">🎨 Tinte (Raíz)</label>
              <input
                type="number"
                value={tinteDays}
                onChange={(e) => setTinteDays(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">✂️ Corte de Cabello</label>
              <input
                type="number"
                value={corteDays}
                onChange={(e) => setCorteDays(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">🧔 Barba</label>
              <input
                type="number"
                value={barbaDays}
                onChange={(e) => setBarbaDays(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">🧴 Keratina / Alisado</label>
              <input
                type="number"
                value={keratinaDays}
                onChange={(e) => setKeratinaDays(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={savingSettings}
          className="w-full bg-slate-800 hover:bg-slate-700 text-gold-400 border border-gold-500/30 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1 touch-press"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Guardar Configuración</span>
        </button>
      </form>

      {/* Demo Reset Card */}
      <div className="p-3.5 rounded-2xl bg-dark-base/60 border border-slate-800 text-xs flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-300">Restablecer Demostración</p>
          <span className="text-[10px] text-slate-500">Cargar clientes y citas de ejemplo</span>
        </div>
        <button
          onClick={handleResetDemo}
          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium"
        >
          Restablecer
        </button>
      </div>
    </div>
  );
}
