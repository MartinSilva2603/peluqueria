import React, { useState, useEffect } from 'react';
import { 
  X, MessageCircle, Copy, Check, Sparkles, 
  Palette, Scissors, Clock, Send, Gift, Tag, Calendar
} from 'lucide-react';
import { openWhatsApp, buildWhatsAppMessage } from '../utils/whatsapp';
import { getDaysDiff } from '../utils/dateUtils';

export default function WhatsAppModal({ client, settings, initialType = null, onClose }) {
  if (!client) return null;

  const daysElapsed = client.lastVisitDate ? getDaysDiff(client.lastVisitDate) : 30;
  const isTinte = client.lastServiceType === 'tinte';
  
  // Decide initial category
  let defaultCategory = initialType || (isTinte ? 'tinte' : (client.lastServiceType === 'barba' ? 'barba' : 'corte'));

  const [category, setCategory] = useState(defaultCategory);
  const [customMessage, setCustomMessage] = useState('');
  const [promoText, setPromoText] = useState('Corte + Lavado con 20% de descuento');
  const [copied, setCopied] = useState(false);

  // Generate message based on selected template category
  useEffect(() => {
    let tpl = settings.templates?.[category] || settings.templates?.general;
    
    if (category === 'cumpleanos') {
      tpl = settings.templates?.cumpleanos || "¡Feliz Cumpleaños {nombre}! 🎂🎉 Desde {negocio} te enviamos un fuerte abrazo. Tienes un 20% DE DESCUENTO DE REGALO en tu corte o servicio durante todo tu mes 🎁. ¿Te gustaría pasar hoy?";
    } else if (category === 'promocion_dias_lentos') {
      tpl = settings.templates?.promocion_dias_lentos || "¡Hola {nombre}! 💈 En {negocio} tenemos una promo especial de Martes y Miércoles: {promo}. ¿Te apartamos un espacio para hoy? ✨";
    } else if (category === 'promocion_tinte') {
      tpl = settings.templates?.promocion_tinte || "¡Hola {nombre}! 🎨 Esta semana en {negocio} por tu servicio de tinte te obsequiamos una sesión de nutrición e hidratación profunda con brillo espejo. ¿Te gustaría agendar?";
    }

    const compiled = buildWhatsAppMessage(tpl, {
      clientName: client.name,
      businessName: settings.businessName || 'Aura Peluquería',
      serviceName: client.lastServiceName || (isTinte ? 'Tinte de cabello' : 'Corte de cabello'),
      daysElapsed: daysElapsed,
      promoDetails: promoText
    });

    setCustomMessage(compiled);
  }, [category, client, settings, daysElapsed, isTinte, promoText]);

  const handleSend = () => {
    openWhatsApp(client.phone, customMessage, settings.countryCode || '51');
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-dark-surface rounded-t-3xl sm:rounded-3xl border border-gold-500/30 p-5 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MessageCircle className="w-5 h-5 fill-emerald-400/20" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Enviar Mensaje por WhatsApp
              </h3>
              <p className="text-xs text-slate-400">
                Cliente: <strong className="text-gold-300">{client.name}</strong> ({client.phone})
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

        {/* Template Selector Pills */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Elige la plantilla del mensaje:
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Cumpleaños */}
            <button
              onClick={() => setCategory('cumpleanos')}
              className={`p-2.5 rounded-xl font-medium text-left flex items-center space-x-2 border transition-all ${
                category === 'cumpleanos'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                  : 'bg-dark-card border-slate-800 text-slate-400'
              }`}
            >
              <Gift className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <p className="leading-tight">🎂 Cumpleaños</p>
                <span className="text-[10px] text-slate-500 font-normal">Saludo + Regalo</span>
              </div>
            </button>

            {/* Promo Martes/Miércoles */}
            <button
              onClick={() => setCategory('promocion_dias_lentos')}
              className={`p-2.5 rounded-xl font-medium text-left flex items-center space-x-2 border transition-all ${
                category === 'promocion_dias_lentos'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-dark-card border-slate-800 text-slate-400'
              }`}
            >
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="leading-tight">💈 Promo Días Lentos</p>
                <span className="text-[10px] text-slate-500 font-normal">Mar y Miér</span>
              </div>
            </button>

            {/* Renovación Tinte */}
            <button
              onClick={() => setCategory('tinte')}
              className={`p-2.5 rounded-xl font-medium text-left flex items-center space-x-2 border transition-all ${
                category === 'tinte'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                  : 'bg-dark-card border-slate-800 text-slate-400'
              }`}
            >
              <Palette className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <p className="leading-tight">🎨 Renovación Tinte</p>
                <span className="text-[10px] text-slate-500 font-normal">Raíz y brillo</span>
              </div>
            </button>

            {/* Retoque Corte */}
            <button
              onClick={() => setCategory('corte')}
              className={`p-2.5 rounded-xl font-medium text-left flex items-center space-x-2 border transition-all ${
                category === 'corte'
                  ? 'bg-gold-500/20 border-gold-500 text-gold-300 font-bold'
                  : 'bg-dark-card border-slate-800 text-slate-400'
              }`}
            >
              <Scissors className="w-4 h-4 text-gold-400 shrink-0" />
              <div>
                <p className="leading-tight">✂️ Retoque Corte</p>
                <span className="text-[10px] text-slate-500 font-normal">Mantener estilo</span>
              </div>
            </button>

            {/* Promo Tinte + Hidratación */}
            <button
              onClick={() => setCategory('promocion_tinte')}
              className={`p-2.5 rounded-xl font-medium text-left flex items-center space-x-2 border transition-all ${
                category === 'promocion_tinte'
                  ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                  : 'bg-dark-card border-slate-800 text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
              <div>
                <p className="leading-tight">✨ Color + Brillo</p>
                <span className="text-[10px] text-slate-500 font-normal">Promo semanal</span>
              </div>
            </button>

            {/* Saludo General */}
            <button
              onClick={() => setCategory('general')}
              className={`p-2.5 rounded-xl font-medium text-left flex items-center space-x-2 border transition-all ${
                category === 'general'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-dark-card border-slate-800 text-slate-400'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="leading-tight">👋 Saludo General</p>
                <span className="text-[10px] text-slate-500 font-normal">Reactivar cliente</span>
              </div>
            </button>
          </div>
        </div>

        {/* If Promo selected, allow editing promo offer */}
        {category === 'promocion_dias_lentos' && (
          <div className="p-2.5 rounded-xl bg-dark-base border border-slate-800 space-y-1">
            <label className="text-[10px] text-slate-400 block">Detalle de la Promoción:</label>
            <input
              type="text"
              value={promoText}
              onChange={(e) => setPromoText(e.target.value)}
              className="w-full bg-dark-surface border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>
        )}

        {/* Message Editor / Preview */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Mensaje listo para enviar:
            </span>
            <button
              onClick={handleCopy}
              className="text-[11px] text-gold-400 hover:text-gold-300 flex items-center space-x-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? '¡Copiado!' : 'Copiar texto'}</span>
            </button>
          </div>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={5}
            className="w-full bg-dark-base border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-gold-500/50 leading-relaxed resize-none"
          />
        </div>

        {/* Send Action */}
        <div className="pt-1">
          <button
            onClick={handleSend}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 touch-press transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Abrir WhatsApp y Enviar</span>
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-2">
            Se abrirá directamente la app de WhatsApp en tu teléfono con el texto y el número {client.phone}.
          </p>
        </div>
      </div>
    </div>
  );
}
