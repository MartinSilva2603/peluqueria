export function getDaysDiff(pastDateStr) {
  if (!pastDateStr) return null;
  const now = new Date();
  const past = new Date(pastDateStr);
  const diffTime = now.getTime() - past.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getClientStatus(client) {
  if (!client.lastVisitDate || !client.nextSuggestedDate) {
    return {
      status: 'never',
      label: 'Sin visitas',
      badgeClass: 'bg-slate-800 text-slate-400 border border-slate-700',
      daysElapsed: 0,
      daysOverdue: 0
    };
  }

  const daysElapsed = getDaysDiff(client.lastVisitDate);
  const now = new Date();
  const next = new Date(client.nextSuggestedDate);
  const diffFromTarget = Math.floor((now.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));

  if (diffFromTarget >= 7) {
    return {
      status: 'urgent',
      label: `Vencido (+${diffFromTarget}d)`,
      badgeClass: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      daysElapsed,
      daysOverdue: diffFromTarget
    };
  } else if (diffFromTarget >= 0) {
    return {
      status: 'due',
      label: diffFromTarget === 0 ? '¡Toca hoy!' : `Toca ya (${diffFromTarget}d)`,
      badgeClass: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      daysElapsed,
      daysOverdue: diffFromTarget
    };
  } else if (diffFromTarget >= -4) {
    return {
      status: 'upcoming',
      label: `En ${Math.abs(diffFromTarget)} días`,
      badgeClass: 'bg-gold-500/15 text-gold-300 border border-gold-500/30',
      daysElapsed,
      daysOverdue: diffFromTarget
    };
  } else {
    return {
      status: 'ok',
      label: 'Al día',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      daysElapsed,
      daysOverdue: diffFromTarget
    };
  }
}

// Check upcoming birthdays (next 10 days)
export function checkUpcomingBirthday(birthDateStr) {
  if (!birthDateStr) return null;

  // Extract month and day (supports MM-DD or YYYY-MM-DD)
  const parts = birthDateStr.split('-');
  const month = parseInt(parts.length === 3 ? parts[1] : parts[0], 10);
  const day = parseInt(parts.length === 3 ? parts[2] : parts[1], 10);

  if (isNaN(month) || isNaN(day)) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  let bdayThisYear = new Date(currentYear, month - 1, day);

  // If already passed more than 10 days ago, consider next year
  const diffMs = bdayThisYear.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays >= 0 && diffDays <= 10) {
    return {
      isToday: diffDays === 0,
      daysUntil: diffDays,
      label: diffDays === 0 ? '¡Cumpleaños Hoy! 🎂' : `Cumple en ${diffDays} días 🎁`,
      dateFormatted: `${day}/${month}`
    };
  }
  return null;
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Nunca';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatCurrency(amount, symbol = 'S/') {
  return `${symbol} ${Number(amount || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
