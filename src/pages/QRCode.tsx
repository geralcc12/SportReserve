import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Download, Share2 } from 'lucide-react';
import QRCode from 'qrcode.react';

interface QRData {
  canchaId: string;
  canchaName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  reservationId: string;
  timestamp: string;
}

const QRCodePage = () => {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('qrData');
    if (!data) {
      navigate('/');
      return;
    }
    setQrData(JSON.parse(data));
    setLoading(false);
  }, [navigate]);

  const handleDownloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `reserva-${qrData?.reservationId}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi reserva en SportReserve',
          text: `Reservé ${qrData?.canchaName} para ${qrData?.startTime} - ${qrData?.endTime}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(
        `Reservé ${qrData?.canchaName} para ${qrData?.startTime} - ${qrData?.endTime}`
      );
      alert('Información copiada al portapapeles');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No se encontró la reserva</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all duration-200 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al inicio</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">¡Reserva Confirmada!</h1>
                <p className="text-green-100">Tu código QR está listo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="card text-center bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center justify-center space-x-2 text-success-600 mb-8">
              <div className="h-12 w-12 bg-success-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-success-600 to-green-600 bg-clip-text text-transparent">
                Pago Exitoso
              </h2>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 inline-block mb-8 shadow-xl">
              <QRCode
                value={JSON.stringify(qrData)}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Muestra este código QR al llegar a la cancha para validar tu reserva
            </p>
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleDownloadQR}
                className="flex items-center space-x-2 btn-secondary"
              >
                <Download className="h-4 w-4" />
                <span>Descargar QR</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 btn-secondary"
              >
                <Share2 className="h-4 w-4" />
                <span>Compartir</span>
              </button>
            </div>
          </div>

          {/* Detalles de la reserva */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detalles de la Reserva</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número de reserva:</span>
                  <span className="font-mono font-medium">{qrData.reservationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancha:</span>
                  <span className="font-medium">{qrData.canchaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">
                    {new Date(qrData.timestamp).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horario:</span>
                  <span className="font-medium">{qrData.startTime} - {qrData.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">1 hora</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total pagado:</span>
                  <span className="text-success-600">${qrData.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="card bg-blue-50 border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Instrucciones</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Llega 10 minutos antes de tu horario</li>
                <li>• Muestra el código QR al personal</li>
                <li>• Trae tu propio equipo deportivo</li>
                <li>• Respeta el tiempo de tu reserva</li>
              </ul>
            </div>

            <div className="card bg-yellow-50 border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Política de cancelación</h4>
              <p className="text-sm text-yellow-700">
                Puedes cancelar tu reserva hasta 2 horas antes del horario programado. 
                Después de ese tiempo, no se realizarán reembolsos.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full btn-primary py-3"
            >
              Hacer otra reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage; 