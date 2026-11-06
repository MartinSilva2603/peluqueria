// Google Calendar and Native Calendar Integration
export function buildGoogleCalendarUrl({ clientName, clientPhone, serviceName, date, time, notes, businessName = 'Aura Peluquería' }) {
  const title = encodeURIComponent(`✂️ Cita: ${clientName} - ${serviceName}`);
  
  // Format date & time: date is YYYY-MM-DD, time is HH:MM
  const [year, month, day] = (date || new Date().toISOString().substring(0, 10)).split('-');
  const [hour, minute] = (time || '10:00').split(':');

  const startDate = new Date(year, parseInt(month) - 1, day, parseInt(hour), parseInt(minute));
  // Default duration: 1 hour (or 1h 30m for tinte)
  const isTinte = serviceName.toLowerCase().includes('tinte') || serviceName.toLowerCase().includes('color');
  const durationMinutes = isTinte ? 90 : 45;
  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  const formatCalTime = (d) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const startFormatted = formatCalTime(startDate);
  const endFormatted = formatCalTime(endDate);

  const detailsText = `Cliente: ${clientName}
WhatsApp: ${clientPhone}
Servicio: ${serviceName}
Notas: ${notes || 'Ninguna'}
Lugar: ${businessName}`;

  const details = encodeURIComponent(detailsText);
  const location = encodeURIComponent(businessName);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}`;
}

export function openGoogleCalendar(appointmentData) {
  const url = buildGoogleCalendarUrl(appointmentData);
  window.open(url, '_blank');
}
