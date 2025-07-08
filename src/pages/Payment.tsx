import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';

interface ReservaData {
  canchaId: string;
  horarioId: string;
  canchaName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const [reservaData, setReservaData] = useState<ReservaData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('reservaData');
    if (!data) {
      navigate('/');
      return;
    }
    setReservaData(JSON.parse(data));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      // Generar QR code data
      const qrData = {
        canchaId: reservaData?.canchaId,
        canchaName: reservaData?.canchaName,
        startTime: reservaData?.startTime,
        endTime: reservaData?.endTime,
        totalPrice: reservaData?.totalPrice,
        reservationId: Date.now().toString(),
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('qrData', JSON.stringify(qrData));
      localStorage.removeItem('reservaData');
      navigate('/qr');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!reservaData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Pago Seguro</h1>
                <p className="text-green-100">Completa tu reserva</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumen de la reserva */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Resumen de la Reserva</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancha:</span>
                  <span className="font-medium">{reservaData.canchaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horario:</span>
                  <span className="font-medium">{reservaData.startTime} - {reservaData.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">1 hora</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">${reservaData.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Pago Seguro</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Tus datos de pago están protegidos con encriptación SSL de 256 bits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de pago */}
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Información de Pago</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Método de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Método de Pago
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span>Tarjeta de crédito/débito</span>
                  </label>
                </div>
              </div>

              {/* Datos de la tarjeta */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de tarjeta
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre en la tarjeta
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Juan Pérez"
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de vencimiento
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/AA"
                      maxLength={5}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cardCvv"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando pago...</span>
                  </div>
                ) : (
                  `Pagar $${reservaData.totalPrice}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 