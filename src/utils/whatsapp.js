export function formatPhoneForWhatsApp(phone, defaultCountryCode = '51') {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');
  
  // If phone is 9 digits (standard Peruvian mobile number starting with 9, e.g., 987654321), prepend 51
  if (clean.length === 9 && clean.startsWith('9') && defaultCountryCode) {
    clean = defaultCountryCode + clean;
  }
  return clean;
}

export function buildWhatsAppMessage(template, params = {}) {
  let msg = template || "¡Hola {nombre}! Te saludamos de {negocio}.";
  
  msg = msg.replace(/{nombre}/g, params.clientName || 'Estimado cliente');
  msg = msg.replace(/{negocio}/g, params.businessName || 'nuestra peluquería');
  msg = msg.replace(/{servicio}/g, params.serviceName || 'servicio');
  msg = msg.replace(/{dias}/g, params.daysElapsed || 'varios');
  msg = msg.replace(/{fecha}/g, params.date || 'la fecha acordada');
  msg = msg.replace(/{hora}/g, params.time || 'la hora acordada');
  msg = msg.replace(/{promo}/g, params.promoDetails || 'Corte + Barba con 20% de descuento');

  return msg;
}

export function openWhatsApp(phone, message, defaultCountryCode = '51') {
  const cleanPhone = formatPhoneForWhatsApp(phone, defaultCountryCode);
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(url, '_blank');
}
