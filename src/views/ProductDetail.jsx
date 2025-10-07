import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";

// Base de datos de productos (esto después vendrá del backend)
const PRODUCTS_DB = {
  // Productos de ProductList
  "cpu-i7": {
    id: "cpu-i7",
    nombre: "Intel Core i7",
    detalle: "12C/24T - Procesador de alta gama",
    categoria: "Componentes",
    marca: "Intel",
    precio: 350,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeEZ3wJRC_iZRmm61SLDO7Hi9nNZH8JXC79xQghK3aAPKFAla1BuCoEgF5u9KSYQAnDjHh-gD84neVLlw7nMMWa0oOyQHLLoWj3ginyHsAyba8OqVibkfYkqt8MLJBoFUICfeCyD4kFYmUULzHUFKxjQHqe9tdal1DYaiEZ4nTUK61Wp6fsDFeSL_a5O-doU0VUWN6fijTVSN6Zv-6JTBy0GmLzOUp5TyXFK6GVPzbuUsj8oR_2cBz50PDnE_ex-kGcPRG5Ad2r-4",
    descripcion: "El Intel Core i7-12700K es un procesador de 12 núcleos y 20 hilos que ofrece un rendimiento excepcional para gaming y tareas intensivas. Basado en la arquitectura Alder Lake, combina núcleos de rendimiento y eficiencia para un balance perfecto entre potencia y consumo energético.",
    especificaciones: [
      { clave: "Núcleos", valor: "12 (8P + 4E)" },
      { clave: "Hilos", valor: "20" },
      { clave: "Frecuencia Base", valor: "3.6 GHz" },
      { clave: "Frecuencia Turbo", valor: "Hasta 5.0 GHz" },
      { clave: "Socket", valor: "LGA 1700" }
    ]
  },
  "gpu-3080": {
    id: "gpu-3080",
    nombre: "NVIDIA RTX 3080",
    detalle: "10 GB GDDR6X - Tarjeta gráfica para gaming",
    categoria: "Componentes",
    marca: "NVIDIA",
    precio: 1200,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3WJvAue9tfr-7SvXGxS5UadyO2OGS21_qDzIY-w_NKQkCDS46H7JrkLa1fmVVHYcXSB3A5SYgNcf2Y9h7hMnlJzYKi8h8RQuMQ5Bmt2NLL4bUrNR4HNK804Agij6KzPhlrT0xE6X8HDN6BFRmHORKpki6uymsi6a8T29f_OUUfrwVgWjJqOjjoubpI5qJsO7JwrnUZtNvMr-VTmhwXx2TAJC17cNqTNCm9SnTLbnVE7swMulVPoEkmnlmtPtSmxNidAEIMvlZgk",
    descripcion: "La NVIDIA GeForce RTX 3080 es una tarjeta gráfica de gama alta que ofrece un rendimiento excepcional en 4K y ray tracing. Con 10GB de memoria GDDR6X, es perfecta para gaming de última generación y aplicaciones profesionales de diseño y renderizado.",
    especificaciones: [
      { clave: "Memoria", valor: "10 GB GDDR6X" },
      { clave: "Bus de Memoria", valor: "320-bit" },
      { clave: "CUDA Cores", valor: "8704" },
      { clave: "RT Cores", valor: "68" },
      { clave: "Tensor Cores", valor: "272" }
    ]
  },
  "ram-ven": {
    id: "ram-ven",
    nombre: "Corsair Vengeance 16GB",
    detalle: "DDR4 3200 - Memoria RAM de alto rendimiento",
    categoria: "Componentes",
    marca: "Corsair",
    precio: 95,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJabHAOWCQEFvtaG0SrkKL6k0ub2C2PCBfGWXiHSPSpjrA8BlPmxidgsCfpmQtAwt_lAa7Gc-W7pmZS_lTWgcoZBFlZWDVOYTQ5msC539UfRdKtF9prGEWvEO1Ev-zyXUclIj66eqf2rToXoIXP3z7SbuQD0QK7Qs6fgjCabbOGOOjuVnKYlta5Dvtv4wUYbYQyEJm2KSbPYisUJyd8jpMxufPmXWT8zcmKeiTrKRL-lYjmYmSz_1SMeFx8CFQY8MyfrUgtQ4Q2p4",
    descripcion: "La memoria Corsair Vengeance LPX DDR4 de 16GB ofrece un rendimiento confiable y eficiencia energética. Con una frecuencia de 3200MHz, es ideal para gaming, overclocking y aplicaciones que requieren alto rendimiento.",
    especificaciones: [
      { clave: "Capacidad", valor: "16 GB (2x8GB)" },
      { clave: "Tipo", valor: "DDR4" },
      { clave: "Velocidad", valor: "3200 MHz" },
      { clave: "Latencia", valor: "CL16" },
      { clave: "Voltaje", valor: "1.35V" }
    ]
  },
  // Productos de Featured
  "pc-gamer": {
    id: "pc-gamer",
    nombre: "PC Gamer de Alto Rendimiento",
    detalle: "Sistema completo optimizado para gaming",
    categoria: "Sistemas Completos",
    marca: "HOPPO",
    precio: 1599,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgepR1Gxi_5yNZIaoyoofizPVZqQQXg66gjBNvQEE_sobqKqIMMio19fHcFRBLp1wZsuBJg3bY-n7_lCp-4hR672a79S9C946YZo-8srxa55nfagG2_qTWhluKDKbJh_ALIRnVIBLweXFDvMb3n2wc6axImEPorjnBWygfMSF-rePU06FnA4Ur0i-qGQmSdNGDD02u3gwtVMcnOVkA0J2_ft8dHyYbXJO3giEegLIUvALYD_5W2hjpKxcAdI4NmOXCmz2m1rOlEH8",
    descripcion: "Sistema de PC gamer completo con componentes de última generación. Incluye procesador Intel Core i7, tarjeta gráfica RTX 3080, 16GB de RAM DDR4 y SSD NVMe de 1TB. Listo para gaming en 4K y streaming.",
    especificaciones: [
      { clave: "Procesador", valor: "Intel Core i7-12700K" },
      { clave: "Gráfica", valor: "NVIDIA RTX 3080 10GB" },
      { clave: "RAM", valor: "16GB DDR4 3200MHz" },
      { clave: "Almacenamiento", valor: "1TB SSD NVMe" },
      { clave: "Fuente", valor: "750W 80+ Gold" }
    ]
  },
  "teclado-mecanico": {
    id: "teclado-mecanico",
    nombre: "Teclado Mecánico Ergonómico",
    detalle: "Teclado mecánico para gaming y productividad",
    categoria: "Periféricos",
    marca: "Corsair",
    precio: 199,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuDXH6AMkSbr_QQsAtXnG9I6gcrudg0ZVXvYU5A2BX5v_BLpnxiJXer2C992yysfJXi3sAhsiRwrthhe6eFXRYsSg6GFYrV5-Tniuj6deZfTnSR2ru3AHzIx6l5V9-QgTlR4ARfwyfgg_4F6_IhZ-364BGex8ygRJURGy9VsXuKHZihLj30sN7F0hF6KCJAgmhTFDRUMa7igqdb7AaXKMMMbS9EiD4mngRR7bD0FTXo9ckYVYJtFEqwF4sz8u5LKFCFudlvwlflP8",
    descripcion: "Teclado mecánico de alta calidad con interruptores Cherry MX Blue para retroalimentación táctil y sonora. Diseño ergonómico que reduce la fatiga durante sesiones prolongadas de gaming o trabajo.",
    especificaciones: [
      { clave: "Interruptores", valor: "Cherry MX Blue" },
      { clave: "Retroiluminación", valor: "RGB por tecla" },
      { clave: "Conectividad", valor: "USB-C" },
      { clave: "Material", valor: "Aluminio anodizado" },
      { clave: "Compatibilidad", valor: "PC, Mac, PlayStation, Xbox" }
    ]
  },
  // Productos de NewArrivals
  "gpu-rtx": {
    id: "gpu-rtx",
    nombre: "Tarjeta Gráfica RTX 4080",
    detalle: "Potencia gráfica de nueva generación",
    categoria: "Componentes",
    marca: "NVIDIA",
    precio: 1499,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnDmZCdyWvW0hUm_f3h3Vs0kuBEhGfioeRJ9jBWGbrMGmpnhiquilHRWSZJcV00mLhKnf9Abl1LSzL2ROcjZWU8AyEGr8zVfX4CQeU4qnRGF3iTAavROnWpZ1TXc6pfCI9qM76kBUSD_9CdTHnxATMzIP8GnjVKNFIaFSPZc7lhtkVXVGbHUReVbTVqbHSo7WtCplUQXmoPeRVI6p38KYYmaGYuAgSWy-1RCysOD2YHdMinHE5h5d4x0riHj4ay2VxZJ6qT7ZKVoU",
    descripcion: "La nueva RTX 4080 ofrece un salto generacional en rendimiento con arquitectura Ada Lovelace. Perfecta para gaming en 4K, ray tracing avanzado y aplicaciones de IA. Incluye DLSS 3.0 para mayor rendimiento.",
    especificaciones: [
      { clave: "Memoria", valor: "16 GB GDDR6X" },
      { clave: "Bus de Memoria", valor: "256-bit" },
      { clave: "CUDA Cores", valor: "9728" },
      { clave: "RT Cores", valor: "76" },
      { clave: "Tensor Cores", valor: "304" }
    ]
  },
  "ram-ddr5": {
    id: "ram-ddr5",
    nombre: "Memoria RAM DDR5 32GB",
    detalle: "Memoria de nueva generación DDR5",
    categoria: "Componentes",
    marca: "G.Skill",
    precio: 249,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-cuvKiK6xVxSE1tbAvNnFwqyuxgNeOSv-RmFU7gAcCkCA5dxCWCzySPWDGG4ICW9W91ug-op4ML3NtR8MASxsEqUvbK0UDOPMOWJbTgBKvJQNAhdDH9R-_WiR_v_LT3J5m_r7P32EhZMGcDkmhMxQtECO068P14xQC75bQrBnIVLYae_vp6DpQDtwPnevOoxXAue5bHS9IqfxsBaFEIlSVYfhVTc9_vzjNnt0FGahRi1zcNofs35pZbdl-vo3dVyV3tXT3T-hN3k",
    descripcion: "Memoria DDR5 de alta velocidad que ofrece un rendimiento superior a DDR4. Con 32GB de capacidad y velocidades de hasta 5600MHz, es ideal para gaming de alta gama y aplicaciones profesionales.",
    especificaciones: [
      { clave: "Capacidad", valor: "32 GB (2x16GB)" },
      { clave: "Tipo", valor: "DDR5" },
      { clave: "Velocidad", valor: "5600 MHz" },
      { clave: "Latencia", valor: "CL36" },
      { clave: "Voltaje", valor: "1.25V" }
    ]
  },
  // Productos adicionales de ProductList
  "ssd-970": {
    id: "ssd-970",
    nombre: "Samsung 970 EVO 1TB",
    detalle: "NVMe Gen3 - Almacenamiento ultrarrápido",
    categoria: "Componentes",
    marca: "Samsung",
    precio: 150,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGZaayb0XYmWATQgCS90Q8EDGTcZV2iBaULUppWB0O7FjpdIAFFwLfrb1wDmkkuHBqIbsahHJvmycKJ7T55S-VUT08Fv6g8V_qmscWdtet1HgU7pcWAQX4OiasSR2zkgtuICAZWBAKoPsr8-n-YfUT2q88hhEn_hc8pGpCl7Jgo_21J6qDzbHO0qvt-bjjBsGJT9IASLvSLl4EFIicI75ppeFGRaLyxm9kvaEs0nn5ht2Gh7-ou2YXAi61JAU6d11SVqyOfWNEFaY",
    descripcion: "El Samsung 970 EVO Plus es un SSD NVMe de alto rendimiento que ofrece velocidades de lectura y escritura excepcionales. Perfecto para acelerar el arranque del sistema y la carga de aplicaciones.",
    especificaciones: [
      { clave: "Capacidad", valor: "1 TB" },
      { clave: "Tipo", valor: "NVMe PCIe 3.0" },
      { clave: "Velocidad Lectura", valor: "Hasta 3,500 MB/s" },
      { clave: "Velocidad Escritura", valor: "Hasta 3,300 MB/s" },
      { clave: "Formato", valor: "M.2 2280" }
    ]
  },
  "kb-logi": {
    id: "kb-logi",
    nombre: "Logitech G Pro",
    detalle: "Teclado mecánico para gaming profesional",
    categoria: "Periféricos",
    marca: "Logitech",
    precio: 130,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCDiT9I5TDv0-hTNvViiBMm-TL97QYQJdvgR8-RetLYH6eLTDJJ11wCFPd50jNshrdqrWrc4JOkNTHL2Er5zFhgMlkXiufAvhy45c-oRSj4d_PbIwaFSDYfA1QfjEkzFKLCG_OatqOuZ9_IVpHr33G9jMbL-UrksQD0dRG6SHfyi2yi0MvK17xUsqkTxeSTMnXTmMhRhh2Hv2YxW9Mk0V5wrxhHzfO3DYcV-5E95F8PkEtyZH-HGYIz7in3hMxoW_9Ztq4qvMwFA0",
    descripcion: "Teclado mecánico diseñado para gamers profesionales. Con interruptores GX Blue Clicky, retroiluminación RGB y construcción duradera. Compacto y portátil para torneos.",
    especificaciones: [
      { clave: "Interruptores", valor: "GX Blue Clicky" },
      { clave: "Retroiluminación", valor: "RGB LIGHTSYNC" },
      { clave: "Conectividad", valor: "USB" },
      { clave: "Formato", valor: "Tenkeyless" },
      { clave: "Compatibilidad", valor: "PC, Mac" }
    ]
  },
  "mouse-viper": {
    id: "mouse-viper",
    nombre: "Razer Viper",
    detalle: "Ratón inalámbrico 20K DPI",
    categoria: "Periféricos",
    marca: "Razer",
    precio: 80,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAB9-3XqvgCJAPM9ivAYfCA5VvWZSF6eXGgfbMlqrQ_PGxqgqwLiuZlcAFiJj-RXcHbtw2y0D1vc_49tFS0izptLZnoz8SiCDNEPAuKDWKx0gI5bvKhWIwz8MEadfnVYn6TlR8kVoly8TtUDOKg0Yd_GFGqr79tWrbVzAv7eEEv50Y9d6-Gf2LRpnD-4TFubIcFE2VIP5MYT-vJXGLpcEiLQEr2qEFescMW8IWZvIH7Aux8DJ98HD4crvlYGPQkXmNhfhDtouCBDlY",
    descripcion: "Ratón gaming ultra liviano con sensor óptico de 20,000 DPI. Diseño ambidiestro, switches ópticos y batería de larga duración. Perfecto para gaming competitivo.",
    especificaciones: [
      { clave: "Sensor", valor: "Razer Focus+ 20K DPI" },
      { clave: "Peso", valor: "71g" },
      { clave: "Conectividad", valor: "Inalámbrico + Cable" },
      { clave: "Batería", valor: "Hasta 70 horas" },
      { clave: "Switches", valor: "Ópticos Gen-3" }
    ]
  },
  "hp-cloud2": {
    id: "hp-cloud2",
    nombre: "HyperX Cloud II",
    detalle: "Auriculares 7.1 para gaming",
    categoria: "Periféricos",
    marca: "HyperX",
    precio: 99,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsnTsArs0xYlbkqu7Nrr7cwsq9paYWaPfSZfM9TDbnOthiQ5_yL9NfIdQmrIQGgbuEA4pH1FlMVUdX0PzIynw7aFGjdsvoiW9a2YcoMzSCKcXUuVlh01FBdPzoN6qMdJiBsG0D_j_t9jfVaFXEqFJFbQpkPww8qIz7p2k-pC7mewI7qDhayyZD50v1K0LG3mdLrlLUmTIb2dPKqSdVaISCQpvJV_BW36yOBCH1CTcAUaxZD68JRhrlsx5Of3NbkJuYHVdNjJV-_WA",
    descripcion: "Auriculares gaming con sonido virtual 7.1, micrófono desmontable con cancelación de ruido y construcción de aluminio. Comodidad excepcional para sesiones largas.",
    especificaciones: [
      { clave: "Sonido", valor: "Virtual 7.1" },
      { clave: "Driver", valor: "53mm" },
      { clave: "Micrófono", valor: "Desmontable con cancelación de ruido" },
      { clave: "Conectividad", valor: "USB + 3.5mm" },
      { clave: "Cable", valor: "2m + extensión 1m" }
    ]
  },
  "monitor-rog": {
    id: "monitor-rog",
    nombre: 'ASUS ROG Swift 27"',
    detalle: "Monitor gaming 1440p 165Hz",
    categoria: "Periféricos",
    marca: "ASUS",
    precio: 650,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsnTsArs0xYlbkqu7Nrr7cwsq9paYWaPfSZfM9TDbnOthiQ5_yL9NfIdQmrIQGgbuEA4pH1FlMVUdX0PzIynw7aFGjdsvoiW9a2YcoMzSCKcXUuVlh01FBdPzoN6qMdJiBsG0D_j_t9jfVaFXEqFJFbQpkPww8qIz7p2k-pC7mewI7qDhayyZD50v1K0LG3mdLrlLUmTIb2dPKqSdVaISCQpvJV_BW36yOBCH1CTcAUaxZD68JRhrlsx5Of3NbkJuYHVdNjJV-_WA",
    descripcion: "Monitor gaming de 27 pulgadas con resolución 1440p, tasa de refresco de 165Hz y tiempo de respuesta de 1ms. Tecnología G-Sync para gameplay suave sin tearing.",
    especificaciones: [
      { clave: "Tamaño", valor: "27 pulgadas" },
      { clave: "Resolución", valor: "2560x1440 (WQHD)" },
      { clave: "Tasa de Refresco", valor: "165Hz" },
      { clave: "Tiempo de Respuesta", valor: "1ms GtG" },
      { clave: "Sincronización", valor: "G-SYNC Compatible" }
    ]
  },
  // Productos adicionales de NewArrivals
  "ssd-nvme": {
    id: "ssd-nvme",
    nombre: "SSD NVMe Gen4 2TB",
    detalle: "Almacenamiento ultrarrápido de nueva generación",
    categoria: "Componentes",
    marca: "Samsung",
    precio: 299,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeVXj1jJnkbe5dcm9JcjKhjDQlinEOo29AVecAY8mMtvr9zWtbhIgCG4c0SubsgedLH-37gwdbX_O_p49ud011rgmy89pBlgZxaFbtQbgnkcmfduD88ApSOUyizu0bykitO6HtK6MHTQNKRK2HMuLJ-39g5V4OZhKrbGTTGso3h1lsochYrh0DYsDoeT-YfzRxCUmyDeolwy8C4PdWeKUGSwj3A3z_-GQ5GXJY84TXKEBCAL7WVNMpyFRWbBBMSMBnVfzJ1J0pk3c",
    descripcion: "SSD NVMe PCIe 4.0 de última generación con capacidades de hasta 2TB. Velocidades de lectura y escritura extremadamente rápidas para aplicaciones profesionales y gaming de alta gama.",
    especificaciones: [
      { clave: "Capacidad", valor: "2 TB" },
      { clave: "Tipo", valor: "NVMe PCIe 4.0" },
      { clave: "Velocidad Lectura", valor: "Hasta 7,000 MB/s" },
      { clave: "Velocidad Escritura", valor: "Hasta 6,500 MB/s" },
      { clave: "Formato", valor: "M.2 2280" }
    ]
  },
  "psu-modular": {
    id: "psu-modular",
    nombre: "Fuente de Alimentación Modular 850W",
    detalle: "Eficiencia y estabilidad 80+ Gold",
    categoria: "Componentes",
    marca: "Corsair",
    precio: 189,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMyYD0tviWD9RmP_Tiz2Dzb4OeMBSsBzLKTH_nu-t63YvsunTrDDVXlQRiLCeFLLJ9XGlEt9HzCZg8nCMy9g7F89f1KaS3a-9AqQnk5QscS4QPOs-Nq1dbXItJlED05Ev_vv0MsBxlcywpyjyVuxLxDsJ4vGbF8EZvCEaFWhjfTxnI7lU9JwvVDEgkL0KCuITdXLIgTn56F-oxK3LxHYoI9E7G3Vsx-Lg1C6jGpeHuGLCEKIkzYTRHe6nVKTLVfg17vV6jMmkMMDA",
    descripcion: "Fuente de alimentación modular de 850W con certificación 80+ Gold. Cableado modular para mejor gestión del cableado y eficiencia energética superior.",
    especificaciones: [
      { clave: "Potencia", valor: "850W" },
      { clave: "Certificación", valor: "80+ Gold" },
      { clave: "Modularidad", valor: "Completamente modular" },
      { clave: "Ventilador", valor: "120mm con modo híbrido" },
      { clave: "Garantía", valor: "10 años" }
    ]
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const product = PRODUCTS_DB[id];

  // Si no se encuentra el producto, mostrar error
  if (!product) {
    return (
      <main className="pd container">
        <div className="pd__error">
          <h1>Producto no encontrado</h1>
          <p>El producto que buscas no existe o ha sido eliminado.</p>
          <Link to="/productos" className="btn btn--primary">
            Volver a productos
          </Link>
        </div>
      </main>
    );
  }

  // Generar múltiples imágenes para la galería (usando la misma imagen por ahora)
  const images = [product.img, product.img, product.img, product.img];

  return (
    <main className="pd container">
      {/* migas */}
      <div className="pd__breadcrumbs">
        <Link to="/productos">Productos</Link>
        <span>/</span>
        <span>{product.categoria}</span>
      </div>

      <div className="pd__grid">
        {/* Galería */}
        <section className="pd__gallery">
          <div
            className="pd__gallery-main"
            style={{ backgroundImage: `url("${images[0]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[1]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[2]}")` }}
          />
          <div
            className="pd__thumb"
            style={{ backgroundImage: `url("${images[3]}")` }}
          />
        </section>

        {/* Info */}
        <section className="pd__info">
          <header className="pd__header">
            <h1 className="pd__title">{product.nombre}</h1>
            <p className="pd__model">{product.detalle}</p>
          </header>

          <div className="pd__price">${product.precio.toFixed(2)}</div>

          <div className="pd__block">
            <h2 className="pd__h2">Descripción del Producto</h2>
            <p className="pd__text">
              {product.descripcion}
            </p>
          </div>

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

          <div className="pd__actions">
            <button className="btn btn--primary">Añadir al Carrito</button>
            <button className="btn btn--ghost" title="Favoritos">♡</button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetail;
