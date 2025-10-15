# Integración Frontend-Backend HOPPO

## ✅ Funcionalidades Implementadas

### Backend (Spring Boot)
- ✅ Configuración CORS para permitir requests del frontend
- ✅ Endpoints REST para productos, categorías, marcas, carrito y órdenes
- ✅ Autenticación JWT
- ✅ Sistema de roles (COMPRADOR/VENDEDOR)

### Frontend (React)
- ✅ Servicio de API con axios
- ✅ Hook useAuth para manejo de autenticación
- ✅ Hook useCart para funcionalidad del carrito
- ✅ Integración de ProductList con backend
- ✅ Integración de ProductDetail con backend
- ✅ Integración de Cart con backend
- ✅ Componentes de Login y Register
- ✅ Providers configurados en App.jsx

## 🚀 Cómo Probar la Integración

### 1. Iniciar el Backend
```bash
cd /Users/juanbautistaespino/Documents/HOPPO_Backend
./mvnw spring-boot:run
```
El backend estará disponible en: `http://localhost:8081`

### 2. Iniciar el Frontend
```bash
cd /Users/juanbautistaespino/HOPPO_FrontEnd
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

### 3. Funcionalidades a Probar

#### 🔐 Autenticación
1. **Registro de Usuario**:
   - Ir a `/register`
   - Crear una cuenta nueva
   - Verificar que se registra correctamente

2. **Inicio de Sesión**:
   - Ir a `/login`
   - Iniciar sesión con las credenciales creadas
   - Verificar que se redirige al home

#### 🛍️ Productos
1. **Lista de Productos**:
   - Ir a `/productos`
   - Verificar que se cargan productos del backend
   - Probar filtros (categoría, precio, marcas)
   - Probar búsqueda

2. **Detalle de Producto**:
   - Hacer clic en cualquier producto
   - Verificar que se carga la información del backend
   - Verificar que se muestran especificaciones y stock

#### 🛒 Carrito de Compras
1. **Agregar al Carrito**:
   - Desde ProductDetail, agregar productos al carrito
   - Verificar que requiere autenticación
   - Verificar que se actualiza la cantidad

2. **Gestionar Carrito**:
   - Ir a `/cart`
   - Verificar que se muestran los productos agregados
   - Probar cambiar cantidades (+/-)
   - Probar eliminar productos
   - Verificar cálculo de totales

3. **Extender Carrito**:
   - Usar el botón "Extender carrito" para aumentar el tiempo de expiración

## 🔧 Endpoints del Backend Utilizados

### Productos
- `GET /products` - Listar productos con filtros
- `GET /products/{id}` - Obtener producto por ID

### Categorías
- `GET /categories` - Listar categorías
- `GET /categories/{id}/products` - Productos por categoría

### Marcas
- `GET /brands` - Listar marcas

### Carrito
- `GET /carts/my-cart` - Obtener carrito activo del usuario
- `POST /carts` - Crear nuevo carrito
- `POST /carts/my-cart/extend` - Extender expiración del carrito

### Productos del Carrito
- `GET /cart-products` - Obtener productos del carrito
- `POST /cart-products` - Agregar producto al carrito
- `PUT /cart-products/{id}` - Actualizar cantidad
- `DELETE /cart-products/{id}` - Eliminar producto del carrito

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/authenticate` - Iniciar sesión

## 🐛 Posibles Problemas y Soluciones

### CORS Error
Si aparece error de CORS:
- Verificar que el backend esté ejecutándose en puerto 8081
- Verificar la configuración CORS en SecurityConfig.java

### Error de Conexión
Si no se pueden cargar los datos:
- Verificar que el backend esté ejecutándose
- Verificar la URL en api.js (debe ser http://localhost:8081)
- Revisar la consola del navegador para errores

### Error de Autenticación
Si hay problemas con login/registro:
- Verificar que el backend tenga usuarios en la base de datos
- Revisar los logs del backend para errores de autenticación

## 📝 Próximos Pasos

1. **Completar Autenticación**:
   - Agregar botones de login/logout en el Header
   - Implementar protección de rutas

2. **Mejorar UX**:
   - Agregar indicadores de carga
   - Mejorar manejo de errores
   - Agregar notificaciones toast

3. **Funcionalidades Adicionales**:
   - Implementar órdenes/checkout
   - Agregar favoritos
   - Implementar búsqueda avanzada

4. **Optimizaciones**:
   - Implementar caché de datos
   - Agregar paginación
   - Optimizar imágenes

## 🔍 Archivos Principales Modificados

### Backend
- `SecurityConfig.java` - Configuración CORS
- Endpoints ya existentes en controllers/

### Frontend
- `src/services/api.js` - Servicio de API
- `src/hooks/useAuth.js` - Hook de autenticación
- `src/hooks/useCart.js` - Hook del carrito
- `src/views/ProductList.jsx` - Integración con backend
- `src/views/ProductDetail.jsx` - Integración con backend
- `src/views/Cart.jsx` - Integración con backend
- `src/views/Login.jsx` - Componente de login
- `src/views/Register.jsx` - Componente de registro
- `src/App.jsx` - Providers configurados
- `src/components/ProductCard.jsx` - Mapeo de datos del backend

