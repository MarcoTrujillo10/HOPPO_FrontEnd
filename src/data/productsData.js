export const PRODUCTS_DATA = [
  { 
    id: "cpu-i7", 
    nombre: "Intel Core i7", 
    detalle: "12C/24T", 
    categoria: "Componentes", 
    marca: "Intel", 
    precio: 350, 
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center",
    subcategoria: "cpu",
    especificaciones: {
      'Núcleos': '12 (8P + 4E)',
      'Hilos': '20',
      'Frecuencia': '3.6GHz - 5.0GHz',
      'Socket': 'LGA 1700',
      'TDP': '125W'
    },
    stock: 15
  },
  { 
    id: "gpu-3080", 
    nombre: "NVIDIA RTX 3080", 
    detalle: "10 GB GDDR6X", 
    categoria: "Componentes", 
    marca: "NVIDIA", 
    precio: 1200, 
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop&crop=center",
    subcategoria: "gpu",
    especificaciones: {
      'VRAM': '10GB GDDR6X',
      'Bus': '320-bit',
      'CUDA Cores': '8704',
      'Consumo': '320W'
    },
    stock: 8
  },
  { 
    id: "ram-ven", 
    nombre: "Corsair Vengeance 16GB", 
    detalle: "DDR4 3200", 
    categoria: "Componentes", 
    marca: "Corsair", 
    precio: 95, 
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center",
    subcategoria: "ram",
    especificaciones: {
      'Capacidad': '16GB (2x8GB)',
      'Velocidad': 'DDR4-3200',
      'Latencia': 'CL16',
      'Voltaje': '1.35V'
    },
    stock: 20
  },
  { 
    id: "ssd-970", 
    nombre: "Samsung 970 EVO 1TB", 
    detalle: "NVMe Gen3", 
    categoria: "Componentes", 
    marca: "Samsung", 
    precio: 150, 
    img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&crop=center",
    subcategoria: "storage",
    especificaciones: {
      'Capacidad': '1TB',
      'Tipo': 'NVMe M.2',
      'Lectura': '3500 MB/s',
      'Escritura': '3300 MB/s'
    },
    stock: 25
  },
  { 
    id: "mb-z690", 
    nombre: "ASUS ROG Strix Z690", 
    detalle: "LGA 1700 DDR5", 
    categoria: "Componentes", 
    marca: "ASUS", 
    precio: 280, 
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center",
    subcategoria: "motherboard",
    especificaciones: {
      'Socket': 'LGA 1700',
      'Chipset': 'Intel Z690',
      'RAM': 'DDR5-5600',
      'PCIe': 'PCIe 5.0'
    },
    stock: 12
  },
  { 
    id: "psu-850", 
    nombre: "Corsair RM850x", 
    detalle: "850W 80+ Gold", 
    categoria: "Componentes", 
    marca: "Corsair", 
    precio: 180, 
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center",
    subcategoria: "psu",
    especificaciones: {
      'Potencia': '850W',
      'Certificación': '80+ Gold',
      'Modular': 'Sí',
      'Conectores': '8+8 PCIe'
    },
    stock: 15
  },
  { 
    id: "case-nzxt", 
    nombre: "NZXT H7 Flow", 
    detalle: "ATX Mid Tower", 
    categoria: "Componentes", 
    marca: "NZXT", 
    precio: 120, 
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center",
    subcategoria: "case",
    especificaciones: {
      'Factor': 'ATX Mid Tower',
      'Ventiladores': '3x 120mm',
      'Ventanas': 'Cristal templado',
      'USB': '2x USB 3.0'
    },
    stock: 18
  },
  { 
    id: "cooler-aio", 
    nombre: "Corsair H100i Elite", 
    detalle: "AIO 240mm RGB", 
    categoria: "Componentes", 
    marca: "Corsair", 
    precio: 160, 
    img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop&crop=center",
    subcategoria: "cooling",
    especificaciones: {
      'Tipo': 'AIO 240mm',
      'TDP': '250W',
      'Ventiladores': '2x 120mm',
      'RGB': 'Sí'
    },
    stock: 10
  },
  // Periféricos
  { 
    id: "kb-logi", 
    nombre: "Logitech G Pro", 
    detalle: "Teclado mecánico", 
    categoria: "Periféricos", 
    marca: "Logitech", 
    precio: 130, 
    img: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop&crop=center",
    subcategoria: "perifericos",
    stock: 25
  },
  { 
    id: "mouse-viper", 
    nombre: "Razer Viper", 
    detalle: "Ratón inalámbrico 20K DPI", 
    categoria: "Periféricos", 
    marca: "Razer", 
    precio: 80, 
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center",
    subcategoria: "perifericos",
    stock: 30
  },
  { 
    id: "hp-cloud2", 
    nombre: "HyperX Cloud II", 
    detalle: "Auriculares 7.1", 
    categoria: "Periféricos", 
    marca: "HyperX", 
    precio: 99, 
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&crop=center",
    subcategoria: "perifericos",
    stock: 20
  },
  { 
    id: "monitor-rog", 
    nombre: 'ASUS ROG Swift 27"', 
    detalle: "1440p 165Hz", 
    categoria: "Periféricos", 
    marca: "ASUS", 
    precio: 650, 
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop&crop=center",
    subcategoria: "perifericos",
    stock: 8
  }
];

export const getProductsByPCBuilderCategory = (category) => {
  return PRODUCTS_DATA.filter(product => product.subcategoria === category);
};

export const getPCBuilderCategories = () => {
  const categories = [...new Set(PRODUCTS_DATA.map(p => p.subcategoria))];
  return categories.filter(cat => cat !== 'perifericos'); 
};

export const getProductsByCategory = (category) => {
  if (category === "Todos") return PRODUCTS_DATA;
  return PRODUCTS_DATA.filter(product => product.categoria === category);
};

export const getAllBrands = () => {
  return [...new Set(PRODUCTS_DATA.map(p => p.marca))].sort();
};

export const getAllCategories = () => {
  return [...new Set(PRODUCTS_DATA.map(p => p.categoria))];
};
