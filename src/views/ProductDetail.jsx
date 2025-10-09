import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";

const PRODUCTS_DB = {
  "cpu-i7": {
    id: "cpu-i7",
    nombre: "Intel Core i7",
    detalle: "12C/24T - Procesador de alta gama",
    categoria: "Componentes",
    marca: "Intel",
    precio: 350,
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "El Intel Core i7-12700K es un procesador de 12 núcleos y 20 hilos que ofrece un rendimiento excepcional.",
    especificaciones: [
      { clave: "Núcleos", valor: "12 (8P + 4E)" },
      { clave: "Hilos", valor: "20" },
      { clave: "Frecuencia Base", valor: "3.6 GHz" },
      { clave: "Frecuencia Turbo", valor: "Hasta 5.0 GHz" },
      { clave: "Socket", valor: "LGA 1700" },
    ],
  },
  "gpu-3080": {
    id: "gpu-3080",
    nombre: "NVIDIA RTX 3080",
    detalle: "10 GB GDDR6X - Tarjeta gráfica para gaming",
    categoria: "Componentes",
    marca: "NVIDIA",
    precio: 1200,
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "La NVIDIA GeForce RTX 3080 ofrece rendimiento 4K y ray tracing avanzado.",
    especificaciones: [
      { clave: "Memoria", valor: "10 GB GDDR6X" },
      { clave: "Bus de Memoria", valor: "320-bit" },
      { clave: "CUDA Cores", valor: "8704" },
      { clave: "RT Cores", valor: "68" },
      { clave: "Tensor Cores", valor: "272" },
    ],
  },
  "ram-ven": {
    id: "ram-ven",
    nombre: "Corsair Vengeance 16GB",
    detalle: "DDR4 3200 - Memoria RAM de alto rendimiento",
    categoria: "Componentes",
    marca: "Corsair",
    precio: 95,
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Corsair Vengeance LPX DDR4 16GB. Ideal para gaming y tareas exigentes.",
    especificaciones: [
      { clave: "Capacidad", valor: "16 GB (2x8GB)" },
      { clave: "Tipo", valor: "DDR4" },
      { clave: "Velocidad", valor: "3200 MHz" },
      { clave: "Latencia", valor: "CL16" },
      { clave: "Voltaje", valor: "1.35V" },
    ],
  },
  "pc-gamer": {
    id: "pc-gamer",
    nombre: "PC Gamer de Alto Rendimiento",
    detalle: "Sistema completo optimizado para gaming",
    categoria: "Sistemas Completos",
    marca: "HOPPO",
    precio: 1599,
    img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "PC completa con i7, RTX 3080, 16GB RAM y SSD NVMe de 1TB.",
    especificaciones: [
      { clave: "Procesador", valor: "Intel Core i7-12700K" },
      { clave: "Gráfica", valor: "NVIDIA RTX 3080 10GB" },
      { clave: "RAM", valor: "16GB DDR4 3200MHz" },
      { clave: "Almacenamiento", valor: "1TB SSD NVMe" },
      { clave: "Fuente", valor: "750W 80+ Gold" },
    ],
  },
  "teclado-mecanico": {
    id: "teclado-mecanico",
    nombre: "Teclado Mecánico Ergonómico",
    detalle: "Teclado mecánico para gaming y productividad",
    categoria: "Periféricos",
    marca: "Corsair",
    precio: 199,
    img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Cherry MX Blue, RGB por tecla, construcción en aluminio.",
    especificaciones: [
      { clave: "Interruptores", valor: "Cherry MX Blue" },
      { clave: "Retroiluminación", valor: "RGB por tecla" },
      { clave: "Conectividad", valor: "USB-C" },
      { clave: "Material", valor: "Aluminio anodizado" },
      { clave: "Compatibilidad", valor: "PC, Mac, Consolas" },
    ],
  },
  "gpu-rtx": {
    id: "gpu-rtx",
    nombre: "Tarjeta Gráfica RTX 4080",
    detalle: "Potencia gráfica de nueva generación",
    categoria: "Componentes",
    marca: "NVIDIA",
    precio: 1499,
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Arquitectura Ada Lovelace, ideal para 4K y apps de IA.",
    especificaciones: [
      { clave: "Memoria", valor: "16 GB GDDR6X" },
      { clave: "Bus de Memoria", valor: "256-bit" },
      { clave: "CUDA Cores", valor: "9728" },
      { clave: "RT Cores", valor: "76" },
      { clave: "Tensor Cores", valor: "304" },
    ],
  },
  "ram-ddr5": {
    id: "ram-ddr5",
    nombre: "Memoria RAM DDR5 32GB",
    detalle: "Memoria de nueva generación DDR5",
    categoria: "Componentes",
    marca: "G.Skill",
    precio: 249,
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "32GB DDR5 hasta 5600MHz para gaming y tareas pro.",
    especificaciones: [
      { clave: "Capacidad", valor: "32 GB (2x16GB)" },
      { clave: "Tipo", valor: "DDR5" },
      { clave: "Velocidad", valor: "5600 MHz" },
      { clave: "Latencia", valor: "CL36" },
      { clave: "Voltaje", valor: "1.25V" },
    ],
  },
  "ssd-970": {
    id: "ssd-970",
    nombre: "Samsung 970 EVO 1TB",
    detalle: "NVMe Gen3 - Almacenamiento ultrarrápido",
    categoria: "Componentes",
    marca: "Samsung",
    precio: 150,
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Velocidades de lectura/escritura muy altas para OS y apps.",
    especificaciones: [
      { clave: "Capacidad", valor: "1 TB" },
      { clave: "Tipo", valor: "NVMe PCIe 3.0" },
      { clave: "Lectura", valor: "Hasta 3,500 MB/s" },
      { clave: "Escritura", valor: "Hasta 3,300 MB/s" },
      { clave: "Formato", valor: "M.2 2280" },
    ],
  },
  "kb-logi": {
    id: "kb-logi",
    nombre: "Logitech G Pro",
    detalle: "Teclado mecánico para gaming profesional",
    categoria: "Periféricos",
    marca: "Logitech",
    precio: 130,
    img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Switches GX Blue, RGB LIGHTSYNC y formato TKL.",
    especificaciones: [
      { clave: "Interruptores", valor: "GX Blue Clicky" },
      { clave: "Retroiluminación", valor: "RGB LIGHTSYNC" },
      { clave: "Conectividad", valor: "USB" },
      { clave: "Formato", valor: "Tenkeyless" },
      { clave: "Compatibilidad", valor: "PC, Mac" },
    ],
  },
  "mouse-viper": {
    id: "mouse-viper",
    nombre: "Razer Viper",
    detalle: "Ratón inalámbrico 20K DPI",
    categoria: "Periféricos",
    marca: "Razer",
    precio: 80,
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Sensor 20K DPI, 71g y switches ópticos Gen-3.",
    especificaciones: [
      { clave: "Sensor", valor: "Razer Focus+ 20K DPI" },
      { clave: "Peso", valor: "71g" },
      { clave: "Conectividad", valor: "Inalámbrico + Cable" },
      { clave: "Batería", valor: "Hasta 70 horas" },
      { clave: "Switches", valor: "Ópticos Gen-3" },
    ],
  },
  "hp-cloud2": {
    id: "hp-cloud2",
    nombre: "HyperX Cloud II",
    detalle: "Auriculares 7.1 para gaming",
    categoria: "Periféricos",
    marca: "HyperX",
    precio: 99,
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Audio 7.1, mic con cancelación y gran comodidad.",
    especificaciones: [
      { clave: "Sonido", valor: "Virtual 7.1" },
      { clave: "Driver", valor: "53mm" },
      { clave: "Micrófono", valor: "Desmontable" },
      { clave: "Conectividad", valor: "USB + 3.5mm" },
      { clave: "Cable", valor: "2m + extensión 1m" },
    ],
  },
  "monitor-rog": {
    id: "monitor-rog",
    nombre: 'ASUS ROG Swift 27"',
    detalle: "Monitor gaming 1440p 165Hz",
    categoria: "Periféricos",
    marca: "ASUS",
    precio: 650,
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "27\" QHD, 165Hz, 1ms, G-SYNC compatible.",
    especificaciones: [
      { clave: "Tamaño", valor: "27 pulgadas" },
      { clave: "Resolución", valor: "2560x1440 (WQHD)" },
      { clave: "Refresco", valor: "165Hz" },
      { clave: "Respuesta", valor: "1ms GtG" },
      { clave: "Sync", valor: "G-SYNC Compatible" },
    ],
  },
  "ssd-nvme": {
    id: "ssd-nvme",
    nombre: "SSD NVMe Gen4 2TB",
    detalle: "Almacenamiento ultrarrápido de nueva generación",
    categoria: "Componentes",
    marca: "Samsung",
    precio: 299,
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "PCIe 4.0 con velocidades extremas para tareas pro.",
    especificaciones: [
      { clave: "Capacidad", valor: "2 TB" },
      { clave: "Tipo", valor: "NVMe PCIe 4.0" },
      { clave: "Lectura", valor: "Hasta 7,000 MB/s" },
      { clave: "Escritura", valor: "Hasta 6,500 MB/s" },
      { clave: "Formato", valor: "M.2 2280" },
    ],
  },
  "psu-modular": {
    id: "psu-modular",
    nombre: "Fuente de Alimentación Modular 850W",
    detalle: "Eficiencia y estabilidad 80+ Gold",
    categoria: "Componentes",
    marca: "Corsair",
    precio: 189,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&crop=center",
    descripcion:
      "Fuente 850W 80+ Gold con cableado totalmente modular.",
    especificaciones: [
      { clave: "Potencia", valor: "850W" },
      { clave: "Certificación", valor: "80+ Gold" },
      { clave: "Modularidad", valor: "Completa" },
      { clave: "Ventilador", valor: "120mm modo híbrido" },
      { clave: "Garantía", valor: "10 años" },
    ],
  },
};

export default function ProductDetail() {
  /** 1) Tomamos el :id de la URL */
  const { id } = useParams();

  /** 2) Buscamos el producto por id (maneja not found) */
  const product = PRODUCTS_DB[id];

  if (!product) {
    return (
      <main className="container" style={{ padding: "32px 0" }}>
        <h2>Producto no encontrado</h2>
        <p>El artículo no existe o fue movido.</p>
        <Link to="/productos" className="btn-back">← Volver a productos</Link>
      </main>
    );
  }

  /** 3) Galería simple (usa la imagen principal y variantes de respaldo) */
  const images = [
    product.img,
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB5zy8sSs6HvceClddGnXQNWAxFK3KGvSpJ-9bIaEowDZXI5IRKIG0jj5B_pVVpRaopOs_YXWOtz0_Acbg9dJIHm4hBHOHP6aiyLn4Gjj4GiKc5EOx4pIjOLUWa8E10ul846gNoLFo44GU1loiWVaUqlhb9DSSvYq9Gqmzs25N1O7XDfc6tG5NOM97QKx8ecd85Y4g-v4MKPB50Eh1wJkO1WI6x17yC-NLvd8bPI1R_2wJp3J8nlMwSPDbqwID5tOIDUOMv4nqIFZA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD_Cwajjri_b1SvOHsRh9Jt1xv5N_xAWrDeQS4q4RTEYlg8auBXKW-n_IB22VLQGMf_8d-AH-WySZGEM-Efgk3UsldHw_ypmShMPJ7xWCgTjsgVePoT6_CWEgE2x4kR9Rjvenmyi4R6BtVltA7m4TKMySKw77zu71mx8sX3bqlRsbhCiT8c5YUWPRlUrzX1N6bMhXyVJzZMGnteIelvByrbT5xXSnlzqCQZx27IK9K9AYcwzxnJKthp0Z0v18Lsb8hrBGgIbnVDBEk",
    product.img,
  ];

  return (
    <main className="pd container">
      <div className="pd__breadcrumbs">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/productos">Productos</Link>
        <span>/</span>
        <span>{product.categoria}</span>
      </div>

      <div className="pd__grid">
        <section className="pd__gallery">
          <div
            className="pd__gallery-main"
            style={{ backgroundImage: `url("${images[0]}")` }}
          />
          {images.slice(1).map((src, i) => (
            <div
              key={i}
              className="pd__thumb"
              style={{ backgroundImage: `url("${src}")` }}
            />
          ))}
        </section>

        <section className="pd__info">
          <header className="pd__header">
            <h1 className="pd__title">{product.nombre}</h1>
            <p className="pd__model">{product.detalle}</p>
          </header>

          <div className="pd__price">${product.precio.toFixed(2)}</div>

          <div className="pd__block">
            <h2 className="pd__h2">Descripción del Producto</h2>
            <p className="pd__text">{product.descripcion}</p>
          </div>

          {Array.isArray(product.especificaciones) && product.especificaciones.length > 0 && (
            <div className="pd__block">
              <h2 className="pd__h2">Especificaciones Técnicas</h2>
              <div className="pd__specs">
                {product.especificaciones.map((spec, index) => (
                  <div key={index} className="pd__spec">
                    <p className="pd__spec-k">{spec.clave}</p>
                    <p className="pd__spec-v">{spec.valor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pd__actions">
            <button className="btn btn--primary">Añadir al Carrito</button>
            <button className="btn btn--ghost" title="Favoritos">♡</button>
          </div>
        </section>
      </div>
    </main>
  );
}
