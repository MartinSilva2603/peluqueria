import React, { useState } from 'react';
import { X, UserPlus, Check, Sparkles, Phone, Palette, Scissors, Gift } from 'lucide-react';

export default function NewClientModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('female');
  const [birthDate, setBirthDate] = useState('');
  const [notes, setNotes] = useState('');
  const [favoriteServices, setFavoriteServices] = useState(['corte']);

  const toggleFavorite = (type) => {
    if (favoriteServices.includes(type)) {
      setFavoriteServices(favoriteServices.filter(s => s !== type));
    } else {
      setFavoriteServices([...favoriteServices, type]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Por favor ingresa el nombre y celular del cliente.");
      return;
    }

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      gender,
      birthDate,
      notes: notes.trim(),
      favoriteServices
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
              <UserPlus className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                Nuevo Cliente
              </h3>
              <p className="text-xs text-slate-400">
                Ficha técnica, fórmulas y cumpleaños
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

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Laura González"
              className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Celular / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 987654321"
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1 flex items-center space-x-1">
                <Gift className="w-3 h-3 text-purple-400" />
                <span>Fecha Cumpleaños</span>
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-dark-base border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Servicios Frecuentes</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'corte', label: '✂️ Corte' },
                { id: 'tinte', label: '🎨 Tinte' },
                { id: 'barba', label: '🧔 Barba' },
                { id: 'keratina', label: '🧴 Keratina' },
                { id: 'peinado', label: '✨ Peinado' },
                { id: 'unas', label: '💅 Uñas' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleFavorite(s.id)}
                  className={`px-2.5 py-1 rounded-xl border text-[11px] transition-all ${
                    favoriteServices.includes(s.id)
                      ? 'bg-gold-500/20 border-gold-500 text-gold-300 font-bold'
                      : 'bg-dark-base border-slate-800 text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">
              Fórmula de Color / Preferencias Técnicas
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Tinte Igora 6.0 con 20 vol. Cuero cabelludo seco. Corte degrafilado puntas."
              rows={3}
              className="w-full bg-dark-base border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-400 text-dark-base font-bold py-3 px-4 rounded-2xl text-sm flex items-center justify-center space-x-1.5 shadow-gold-glow touch-press"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Ficha del Cliente</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
