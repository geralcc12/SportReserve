# SportReserve - Sistema de Alquiler de Canchas Deportivas

Un sistema completo de reserva de canchas deportivas con autenticación, pagos y panel de administración.

## 🚀 Características

- **Autenticación de usuarios**: Login y registro
- **Lista de canchas**: Vista tipo cine con horarios en vivo
- **Selección de horarios**: Interfaz intuitiva para elegir horarios disponibles
- **Proceso de pago**: Simulación completa de pago con tarjeta
- **Código QR**: Generación automática de QR con datos de la reserva
- **Panel de administración**: Métricas y estadísticas detalladas
- **Diseño responsive**: Optimizado para móviles y desktop

## 🛠️ Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router** para navegación
- **Tailwind CSS** para estilos
- **React Query** para manejo de estado
- **Chart.js** para gráficos
- **QRCode.react** para generación de códigos QR
- **Lucide React** para iconos
- **Vite** como bundler

## 📦 Instalación

1. **Clona el repositorio**:
```bash
git clone <url-del-repositorio>
cd SportReserve
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Ejecuta el proyecto**:
```bash
npm run dev
```

4. **Abre tu navegador** en `http://localhost:5173`

## 🎯 Cómo Usar

### Para Usuarios Regulares

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Explorar canchas**: Ve la lista de canchas disponibles
3. **Seleccionar horario**: Elige una cancha y un horario disponible
4. **Completar pago**: Llena los datos de pago (simulado)
5. **Obtener QR**: Recibe tu código QR con los detalles de la reserva

### Para Administradores

1. **Acceso admin**: Usa un email que contenga "admin" para acceder al panel
2. **Ver métricas**: Revisa estadísticas de reservas e ingresos
3. **Analizar datos**: Usa los gráficos para tomar decisiones

## 📱 Páginas del Sistema

- **`/login`** - Página de inicio de sesión
- **`/register`** - Página de registro
- **`/`** - Lista principal de canchas
- **`/cancha/:id`** - Detalle de cancha con horarios
- **`/payment`** - Proceso de pago
- **`/qr`** - Código QR de la reserva
- **`/admin`** - Panel de administración

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SportReserve
```

### Personalización

- **Colores**: Modifica `tailwind.config.js` para cambiar la paleta de colores
- **Datos mock**: Edita los datos en cada componente para personalizar la información
- **Imágenes**: Reemplaza las URLs de Unsplash con tus propias imágenes

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ProtectedRoute.tsx
│   └── AdminRoute.tsx
├── contexts/           # Contextos de React
│   └── AuthContext.tsx
├── pages/              # Páginas principales
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── CanchaList.tsx
│   ├── CanchaDetail.tsx
│   ├── Payment.tsx
│   ├── QRCode.tsx
│   └── AdminDashboard.tsx
├── types/              # Tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🚀 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 🔒 Autenticación

El sistema incluye autenticación simulada:

- **Usuarios normales**: Cualquier email sin "admin"
- **Administradores**: Emails que contengan "admin" (ej: admin@test.com)

## 💳 Proceso de Pago

El pago es simulado y incluye:

- Validación de formularios
- Formateo automático de números de tarjeta
- Simulación de procesamiento
- Generación de QR con datos de la reserva

## 📈 Panel de Administración

Incluye métricas como:

- Total de reservas
- Ingresos totales
- Estadísticas por cancha
- Gráficos de barras y dona
- Tabla detallada de rendimiento

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

**¡Disfruta usando SportReserve! ⚽🏀🎾** 