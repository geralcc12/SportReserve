import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react';
import { Cancha, Horario } from '../types';
import { addDays, format, isSameDay } from 'date-fns';
import es from 'date-fns/locale/es';
import { useApi } from '@/hooks/useApi';
import { API_BASE_URL } from '@/config/api';

const CanchaDetail = () => {
  const { request: fetchCancha } = useApi<Cancha>();
  const { request: fetchHorarios } = useApi<any[]>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;
      setLoading(true);

      // Obtener cancha
      const canchaResponse = await fetchCancha(`${API_BASE_URL}/fields/${id}`);
      if (canchaResponse) {
        setCancha({
          id: canchaResponse.id,
          name: canchaResponse.name,
          sport: canchaResponse.sportType?.name || 'Desconocido',
          price: parseFloat(canchaResponse.price),
          image: `http://localhost:5005/uploads/${canchaResponse.sportType?.name.toLowerCase()}.jpg`,
          description: canchaResponse.description || '',
          isAvailable: canchaResponse.is_active === 1 || canchaResponse.is_active === true,
        });
      }

      // Obtener horarios
      const horariosResponse = await fetchHorarios(`${API_BASE_URL}/fields/${id}/schedules`);
      if (horariosResponse) {
        const mapped = horariosResponse.map((h: any) => ({
          id: h.id.toString(),
          canchaId: h.field_id.toString(),
          startTime: h.start_time.substring(0, 5),
          endTime: h.end_time.substring(0, 5),
          isAvailable: h.is_available === 1 || h.is_available === true,
          price: parseFloat(canchaResponse?.price || '0'),
        }));
        setHorarios(mapped);
      }

      setLoading(false);
    };

    cargarDatos();
  }, [id]);

  /* useEffect(() => {
    // TODO BACKEND: Reemplazar este mock por una llamada real a obtener los datos de la cancha y los horarios del día seleccionado
    // Ejemplo:
    // obtenerHorarios(canchaId, fecha).then(res => setHorarios(res.data));
    // obtenerCancha(canchaId).then(res => setCancha(res.data));
    const mockCancha: Cancha = {
      id: id || '1',
      name: 'Cancha de Fútbol 1',
      sport: 'Fútbol',
      price: 50,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      description: 'Cancha de fútbol 11 con césped sintético profesional. Incluye iluminación nocturna, vestuarios y estacionamiento gratuito.',
      isAvailable: true
    };

    const mockHorarios: Horario[] = [
      { id: '1', canchaId: id || '1', startTime: '08:00', endTime: '09:00', isAvailable: true, price: 50 },
      { id: '2', canchaId: id || '1', startTime: '09:00', endTime: '10:00', isAvailable: true, price: 50 },
      { id: '3', canchaId: id || '1', startTime: '10:00', endTime: '11:00', isAvailable: false, price: 50 },
      { id: '4', canchaId: id || '1', startTime: '11:00', endTime: '12:00', isAvailable: true, price: 50 },
      { id: '5', canchaId: id || '1', startTime: '12:00', endTime: '13:00', isAvailable: true, price: 50 },
      { id: '6', canchaId: id || '1', startTime: '13:00', endTime: '14:00', isAvailable: false, price: 50 },
      { id: '7', canchaId: id || '1', startTime: '14:00', endTime: '15:00', isAvailable: true, price: 50 },
      { id: '8', canchaId: id || '1', startTime: '15:00', endTime: '16:00', isAvailable: true, price: 50 },
      { id: '9', canchaId: id || '1', startTime: '16:00', endTime: '17:00', isAvailable: true, price: 50 },
      { id: '10', canchaId: id || '1', startTime: '17:00', endTime: '18:00', isAvailable: false, price: 50 },
      { id: '11', canchaId: id || '1', startTime: '18:00', endTime: '19:00', isAvailable: true, price: 50 },
      { id: '12', canchaId: id || '1', startTime: '19:00', endTime: '20:00', isAvailable: true, price: 50 },
    ];

    setTimeout(() => {
      setCancha(mockCancha);
      setHorarios(mockHorarios);
      setLoading(false);
    }, 1000);
  }, [id]); */

  // Generar los días disponibles (hoy + 6 días)
  const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Filtrar horarios según el día seleccionado (mock: todos los días iguales)
  const horariosDelDia = horarios;

  const handleHorarioSelect = (horario: Horario) => {
    if (horario.isAvailable) {
      setSelectedHorario(horario);
    }
  };

  const handleReservar = () => {
    setShowModal(true);
  };

  const handleConfirmarReserva = () => {
    setShowModal(false);
    // TODO BACKEND: Aquí llamar a la API para crear la reserva y enviar el correo de confirmación
    // Ejemplo:
    // await crearReserva({ canchaId, horarioId, fecha, hora, usuarioEmail, ... })
    // El backend debe enviar el correo con el QR usando el template de email
    localStorage.setItem('reservaData', JSON.stringify({
      canchaId: cancha?.id,
      horarioId: selectedHorario?.id,
      canchaName: cancha?.name,
      startTime: selectedHorario?.startTime,
      endTime: selectedHorario?.endTime,
      totalPrice: selectedHorario?.price,
      date: format(selectedDate, 'yyyy-MM-dd'),
    }));
    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cancha) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancha no encontrada</h2>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold">{cancha.name}</h1>
              <p className="text-primary-100">Selecciona un horario disponible</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna izquierda: Información de la cancha, info útil, contacto */}
          <div className="space-y-6">
            {/* Card de la cancha */}
            <div className="card overflow-hidden">
              <div className="relative">
                <img
                  src={cancha?.image}
                  alt={cancha?.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white mb-2">{cancha?.name}</h2>
                  <div className="flex items-center space-x-4 text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>1 hora</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>22 jugadores</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-4">{cancha?.description}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Duración</p>
                      <p className="text-xs text-gray-500">1 hora por reserva</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Capacidad</p>
                      <p className="text-xs text-gray-500">Máximo 22 jugadores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Información útil */}
            <div className="card bg-white border-l-4 border-blue-400">
              <h4 className="text-lg font-bold text-blue-700 mb-2">Información útil</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Presentar el QR de la reserva.</li>
                <li>• Llega 10 minutos antes de tu horario.</li>
                <li>• Trae tu propio equipo deportivo.</li>
                <li>• Respeta el tiempo de tu reserva.</li>
                <li>• No se permite fumar ni consumir alcohol.</li>
                <li>• Puedes cancelar hasta 2 horas antes del horario reservado.</li>
              </ul>
            </div>
            {/* Contacto rápido */}
            <div className="card bg-white border-l-4 border-green-400">
              <h4 className="text-lg font-bold text-green-700 mb-2">Contacto rápido</h4>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-medium text-gray-700">Teléfono:</span>
                <a href="tel:+51999999999" className="text-green-600 hover:underline">+51 999 999 999</a>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-medium text-gray-700">WhatsApp:</span>
                <a href="https://wa.me/51999999999" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Chatear</a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700">Email:</span>
                <a href="mailto:info@canchasport.com" className="text-green-600 hover:underline">info@canchasport.com</a>
              </div>
            </div>
          </div>
          {/* Columna derecha: Selector de día, horarios, resumen de reserva */}
          <div className="space-y-6">
            {/* Selector de día */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona el día</h3>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {days.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium min-w-[110px] ${isSameDay(day, selectedDate)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                  >
                    {format(day, 'EEE dd/MM', { locale: es })}
                  </button>
                ))}
              </div>
            </div>
            {/* Horarios disponibles */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Horarios Disponibles</h3>
              <p className="text-sm text-gray-600 mb-4">{format(selectedDate, 'EEEE dd MMMM yyyy', { locale: es })}</p>
              <div className="grid grid-cols-3 gap-3">
                {horariosDelDia.map((horario) => (
                  <button
                    key={horario.id}
                    onClick={() => handleHorarioSelect(horario)}
                    className={`p-3 rounded-lg border-2 transition-all ${selectedHorario?.id === horario.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : horario.isAvailable
                        ? 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    disabled={!horario.isAvailable}
                  >
                    <div className="text-sm font-medium">
                      {horario.startTime} - {horario.endTime}
                    </div>
                    <div className="text-xs mt-1">
                      ${horario.price}
                    </div>
                    {!horario.isAvailable && (
                      <div className="text-xs mt-1 text-red-500">Ocupada</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            {/* Botón para reservar (solo si hay horario seleccionado) */}
            {selectedHorario && (
              <button
                onClick={handleReservar}
                className="w-full btn-primary mt-4"
              >
                Continuar al Pago
              </button>
            )}
            {/* Modal de confirmación de reserva */}
            {showModal && selectedHorario && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
                  <h3 className="text-2xl font-bold text-primary-700 mb-4">Confirmar Reserva</h3>
                  <div className="space-y-2 text-sm mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cancha:</span>
                      <span className="font-medium">{cancha?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{format(selectedDate, 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horario:</span>
                      <span className="font-medium">{selectedHorario.startTime} - {selectedHorario.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-bold text-primary-600">${selectedHorario.price}</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmarReserva}
                      className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow"
                    >
                      Confirmar y Pagar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanchaDetail; 