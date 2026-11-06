// Realistic initial sample data for neighborhood salon in Peru (Soles S/)
export const initialClients = [
  {
    id: "cli_1",
    name: "Carolina Méndez",
    phone: "51987654321",
    gender: "female",
    birthDate: "11-12", // Month-Day: Noviembre 12 (Upcoming Birthday!)
    notes: "Fórmula de tinte: Igora Royal 7.1 (Rubio medio ceniza) + 20 vol. Cuero cabelludo sensible, no aplicar calor excesivo.",
    favoriteServices: ["tinte", "peinado"],
    createdAt: "2026-09-10T10:00:00.000Z",
    lastVisitDate: "2026-09-28T16:30:00.000Z", // 38 days ago -> URGENT DYE REFRESH
    nextSuggestedDate: "2026-10-28T16:30:00.000Z",
    lastServiceType: "tinte",
    lastServiceName: "Tinte Raíz y Matiz",
    totalVisits: 4,
    totalSpent: 360
  },
  {
    id: "cli_2",
    name: "Alejandro Gómez",
    phone: "51976543210",
    gender: "male",
    birthDate: "03-22",
    notes: "Degradado medio (Mid Fade) con navaja arriba tijera textura. Se corta cada 20 días puntual.",
    favoriteServices: ["corte", "barba"],
    createdAt: "2026-08-15T09:00:00.000Z",
    lastVisitDate: "2026-10-14T11:00:00.000Z", // 22 days ago -> DUE FOR HAIRCUT
    nextSuggestedDate: "2026-11-03T11:00:00.000Z",
    lastServiceType: "corte",
    lastServiceName: "Corte Caballero + Barba",
    totalVisits: 6,
    totalSpent: 210
  },
  {
    id: "cli_3",
    name: "Valentina Restrepo",
    phone: "51965432109",
    gender: "female",
    birthDate: "11-08", // Noviembre 8 (Birthday in 3 days!)
    notes: "Balayage miel cálido. Se hace tratamiento de botox capilar para brillo. Champú sin sal recomendado.",
    favoriteServices: ["tinte", "keratina"],
    createdAt: "2026-07-20T14:00:00.000Z",
    lastVisitDate: "2026-10-01T15:00:00.000Z", // 35 days ago -> DYE RECALL
    nextSuggestedDate: "2026-11-01T15:00:00.000Z",
    lastServiceType: "tinte",
    lastServiceName: "Balayage & Brushing",
    totalVisits: 3,
    totalSpent: 420
  },
  {
    id: "cli_4",
    name: "Mateo Silva",
    phone: "51954321098",
    gender: "male",
    birthDate: "07-15",
    notes: "Perfilado de barba con aceite de argán y toalla caliente. Corte clásico lateral.",
    favoriteServices: ["barba", "corte"],
    createdAt: "2026-09-01T17:00:00.000Z",
    lastVisitDate: "2026-10-23T18:00:00.000Z", // 13 days ago -> READY FOR BEARD TRIM
    nextSuggestedDate: "2026-11-06T18:00:00.000Z",
    lastServiceType: "barba",
    lastServiceName: "Perfilado & Spa de Barba",
    totalVisits: 5,
    totalSpent: 125
  },
  {
    id: "cli_5",
    name: "Lucía Fernández",
    phone: "51943210987",
    gender: "female",
    birthDate: "12-04",
    notes: "Tratamiento alisado de keratina orgánica brasileña. Lavar solo con productos post-keratina.",
    favoriteServices: ["keratina", "corte"],
    createdAt: "2026-08-01T12:00:00.000Z",
    lastVisitDate: "2026-08-25T14:00:00.000Z", // 72 days ago -> TIME FOR KERATIN REFRESH
    nextSuggestedDate: "2026-11-08T14:00:00.000Z",
    lastServiceType: "keratina",
    lastServiceName: "Alisado Keratina Brasileña",
    totalVisits: 2,
    totalSpent: 300
  },
  {
    id: "cli_6",
    name: "Sofía Torres",
    phone: "51932109876",
    gender: "female",
    birthDate: "05-19",
    notes: "Corte en capas largas y flequillo cortina. Le encanta el café capuchino.",
    favoriteServices: ["corte"],
    createdAt: "2026-10-25T11:00:00.000Z",
    lastVisitDate: "2026-10-28T10:00:00.000Z", // 8 days ago -> FRESH / UP TO DATE
    nextSuggestedDate: "2026-11-28T10:00:00.000Z",
    lastServiceType: "corte",
    lastServiceName: "Corte Dama & Secado",
    totalVisits: 1,
    totalSpent: 45
  }
];

export const initialServices = [
  {
    id: "srv_1",
    clientId: "cli_1",
    clientName: "Carolina Méndez",
    clientPhone: "51987654321",
    serviceType: "tinte",
    serviceName: "Tinte Raíz y Matiz",
    price: 90,
    date: "2026-09-28T16:30:00.000Z",
    technicalNotes: "Igora Royal 7.1 + 20 vol. Matizador 9.5-1 en lavacabezas por 5 min.",
    recallDays: 30
  },
  {
    id: "srv_2",
    clientId: "cli_2",
    clientName: "Alejandro Gómez",
    clientPhone: "51976543210",
    serviceType: "corte",
    serviceName: "Corte Caballero + Barba",
    price: 35,
    date: "2026-10-14T11:00:00.000Z",
    technicalNotes: "Mid fade #0.5 a #2. Tijera superior 3 dedos.",
    recallDays: 20
  },
  {
    id: "srv_3",
    clientId: "cli_3",
    clientName: "Valentina Restrepo",
    clientPhone: "51965432109",
    serviceType: "tinte",
    serviceName: "Balayage & Brushing",
    price: 180,
    date: "2026-10-01T15:00:00.000Z",
    technicalNotes: "Deco a 30 vol con Plex. Tonalizante Dialight 9.12.",
    recallDays: 30
  },
  {
    id: "srv_4",
    clientId: "cli_4",
    clientName: "Mateo Silva",
    clientPhone: "51954321098",
    serviceType: "barba",
    serviceName: "Perfilado & Spa de Barba",
    price: 25,
    date: "2026-10-23T18:00:00.000Z",
    technicalNotes: "Aceite de eucalipto, recorte a 6mm con degradado patilla.",
    recallDays: 14
  },
  {
    id: "srv_5",
    clientId: "cli_5",
    clientName: "Lucía Fernández",
    clientPhone: "51943210987",
    serviceType: "keratina",
    serviceName: "Alisado Keratina Brasileña",
    price: 150,
    date: "2026-08-25T14:00:00.000Z",
    technicalNotes: "Planchado a 410°F mechones delgados. Dejar reposar 48h.",
    recallDays: 75
  },
  {
    id: "srv_6",
    clientId: "cli_6",
    clientName: "Sofía Torres",
    clientPhone: "51932109876",
    serviceType: "corte",
    serviceName: "Corte Dama & Secado",
    price: 45,
    date: "2026-10-28T10:00:00.000Z",
    technicalNotes: "Capas largas texturizadas, flequillo cortina.",
    recallDays: 30
  }
];

export const initialAppointments = [
  {
    id: "apt_1",
    clientId: "cli_2",
    clientName: "Alejandro Gómez",
    clientPhone: "51976543210",
    serviceType: "corte",
    serviceName: "Corte Fade + Barba",
    date: "2026-11-06",
    time: "10:30",
    status: "programada",
    estimatedPrice: 35,
    notes: "Viene en su descanso laboral, atender puntual."
  },
  {
    id: "apt_2",
    clientId: "cli_1",
    clientName: "Carolina Méndez",
    clientPhone: "51987654321",
    serviceType: "tinte",
    serviceName: "Retoque de Raíz Rubio Ceniza",
    date: "2026-11-06",
    time: "15:00",
    status: "programada",
    estimatedPrice: 90,
    notes: "Tener listo tinte Igora 7.1 con 20 vol."
  },
  {
    id: "apt_3",
    clientId: "cli_4",
    clientName: "Mateo Silva",
    clientPhone: "51954321098",
    serviceType: "barba",
    serviceName: "Perfilado y Toalla Caliente",
    date: "2026-11-07",
    time: "17:00",
    status: "programada",
    estimatedPrice: 25,
    notes: ""
  }
];

export const initialSettings = {
  businessName: "Aura Studio & Barbería",
  ownerName: "Administrador",
  currencySymbol: "S/",
  countryCode: "51",
  defaultRecalls: {
    corte: 22,
    tinte: 32,
    barba: 14,
    keratina: 75,
    uñas: 20,
    otro: 30
  },
  templates: {
    tinte: "¡Hola {nombre}! ✨ Te saludamos de {negocio}. Notamos que ya han pasado {dias} días desde tu último tinte ({servicio}). Para mantener tu color vibrante y sin raíz visible, te recomendamos renovarlo estos días. ¿Te gustaría apartar tu cita esta semana? 💇‍♀️🎨",
    corte: "¡Hola {nombre}! ✂️ En {negocio} queremos que tu look siempre esté impecable. Ya se cumplieron {dias} días desde tu último corte. ¿Te agendamos un espacio para renovar tu estilo? 💈",
    barba: "¡Hola {nombre}! 🧔 Saludos de {negocio}. Ya van {dias} días desde tu último perfilado de barba. ¿Pasas esta semana para dejarla perfecta? ¡Un abrazo!",
    keratina: "¡Hola {nombre}! 🌟 ¿Cómo está tu cabello? Han pasado {dias} días desde tu tratamiento en {negocio}. Es un momento excelente para un retoque o hidratación profunda. ¿Te gustaría agendar?",
    cumpleanos: "¡Feliz Cumpleaños {nombre}! 🎂🎉 Desde {negocio} te mandamos un gran abrazo. Para celebrar tu día, tienes un 20% DE DESCUENTO DE REGALO en tu corte o servicio durante todo este mes 🎁. ¿Te gustaría pasar hoy o apartar tu cita? ¡Te esperamos!",
    promocion_dias_lentos: "¡Hola {nombre}! 💈 En {negocio} tenemos una promo especial de Martes y Miércoles: {promo}. ¡Aprovecha para consentirte y lucir increíble! ¿Te apartamos un espacio para hoy? ✨",
    promocion_tinte: "¡Hola {nombre}! 🎨 ¿Ganas de renovar tu look? Esta semana en {negocio} por tu servicio de tinte te obsequiamos una sesión de tratamiento capilar hidratante con brillo espejo. Cupos limitados, ¿te agendamos? 💇‍♀️",
    confirmacion_cita: "¡Hola {nombre}! 📅 Tu cita en {negocio} ha sido confirmada con éxito para el {fecha} a las {hora} ({servicio}). Si necesitas modificarla nos avisas. ¡Te esperamos!",
    recordatorio_cita: "¡Hola {nombre}! 👋 Te recordamos tu cita de hoy en {negocio} a las {hora} ({servicio}). ¡Ya tenemos todo listo para recibirte! ✂️✨",
    general: "¡Hola {nombre}! 👋 En {negocio} nos encanta atenderte. Ya han pasado {dias} días desde tu última visita ({servicio}). ¿Deseas agendar tu próxima cita? ¡Te esperamos con gusto!"
  },
  lastBackupDate: null
};
