export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface Cancha {
  id: string;
  name: string;
  sport: string;
  price: number;
  image: string;
  description: string;
  isAvailable: boolean;
}

export interface Horario {
  id: string;
  canchaId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface Reserva {
  id: string;
  canchaId: string;
  horarioId: string;
  userId: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  qrCode: string;
  createdAt: string;
}

export interface PaymentData {
  canchaId: string;
  horarioId: string;
  totalPrice: number;
  paymentMethod: string;
}

export interface AdminMetrics {
  totalReservas: number;
  totalRevenue: number;
  canchasStats: {
    canchaId: string;
    canchaName: string;
    reservasCount: number;
    revenue: number;
  }[];
} 