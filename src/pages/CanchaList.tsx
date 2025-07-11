import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Cancha } from '../types';
import { LogOut, BarChart3, Clock, MapPin } from 'lucide-react';
import { API_BASE_URL } from '@/config/api';
import { useApi } from '@/hooks/useApi';

const CanchaList = () => {
  const { user, logout } = useAuth();
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const { request, loading, error } = useApi<any[]>();
  useEffect(() => {
    const obtenerCanchas = async () => {
      const data = await request(`${API_BASE_URL}/fields/available`);
      if (data) {
        const parsed: Cancha[] = data.map((field: any) => ({
          id: field.id.toString(),
          name: field.name,
          sport: field.sportType?.name || 'Desconocido',
          price: field.price,
          image: `http://localhost:5005/uploads/${field.sportType.name.toLowerCase()}.jpg`,
          description: field.description,
          isAvailable: field.is_active === 1 || field.is_active === true,
        }));
        setCanchas(parsed);
      }
    };

    obtenerCanchas();
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">SportReserve</h1>
                <p className="text-primary-100">Alquiler de canchas deportivas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                <div className="h-6 w-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Hola, {user?.name}</span>
              </div>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Canchas Disponibles
          </h2>
          <p className="text-gray-600 text-lg">Selecciona una cancha y horario para reservar</p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Ocupada</span>
            </div>
          </div>
        </div>

        {/* Canchas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {canchas.map((cancha) => (
            <div
              key={cancha.id}
              className={`card transition-all duration-300 hover:shadow-xl border-0 ${
                !cancha.isAvailable ? 'opacity-60' : 'hover:scale-105 hover:shadow-2xl'
              }`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={cancha.image}
                  alt={cancha.name}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-lg text-xs font-semibold">
                    {cancha.sport}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 p-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{cancha.name}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{cancha.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4 text-primary-500" />
                    <span className="text-sm font-medium">1 hora</span>
                  </div>
                  <div className="text-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    ${cancha.price}
                  </div>
                </div>
                
                <Link
                  to={`/cancha/${cancha.id}`}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-all duration-200 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  Ver horarios
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CanchaList; 