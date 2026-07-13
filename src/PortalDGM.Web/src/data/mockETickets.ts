import type { ETicket } from '../models';

export const MOCK_ETICKETS: ETicket[] = [
  {
    id: 'et-001',
    ticketNumber: 'ET-2024-000847',
    verificationCode: 'QR-ET-847-XKL9',
    userId: 'usr-001',
    type: 'entry',
    passengerName: 'María González',
    passport: 'AB123456',
    nationality: 'Venezolana',
    date: '2024-05-01',
    airline: 'LATAM Airlines',
    flightNumber: 'LA2341',
    port: 'Aeropuerto Internacional de las Américas',
    originCountry: 'Venezuela',
    destinationCountry: 'República Dominicana',
    accommodationAddress: 'Hotel Embajador, Santo Domingo',
    createdAt: '2024-04-28T10:00:00Z',
  },
];
