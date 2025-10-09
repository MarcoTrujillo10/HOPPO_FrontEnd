export const PC_PARTS = {
  cpu: [
    { id: "cpu-i5-12400F", nombre: "Intel Core i5-12400F", precio: 205, socket: "LGA1700", nucleos: "6C/12T",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=600&fit=crop&crop=center" },
    { id: "cpu-ryzen-5-5600", nombre: "AMD Ryzen 5 5600", precio: 170, socket: "AM4", nucleos: "6C/12T",
      img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&h=600&fit=crop&crop=center" },
  ],
  motherboard: [
    { id: "mb-b660", nombre: "MSI PRO B660M", precio: 135, socket: "LGA1700", chipset: "B660", factor: "mATX",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop&crop=center" },
    { id: "mb-b550", nombre: "Gigabyte B550M DS3H", precio: 120, socket: "AM4", chipset: "B550", factor: "mATX",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop&crop=center" },
  ],
  gpu: [
    { id: "gpu-rtx3060", nombre: "NVIDIA RTX 3060 12GB", precio: 310, watts: 170,
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=600&fit=crop&crop=center" },
    { id: "gpu-rx6700xt", nombre: "AMD RX 6700 XT 12GB", precio: 359, watts: 230,
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=600&fit=crop&crop=center" },
  ],
  ram: [
    { id: "ram-16-3200", nombre: "DDR4 16GB (2x8) 3200", precio: 65, tipo: "DDR4",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=600&fit=crop&crop=center" },
    { id: "ram-ddr5-32", nombre: "DDR5 32GB (2x16) 5600", precio: 180, tipo: "DDR5",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&h=600&fit=crop&crop=center" },
  ],
  storage: [
    { id: "ssd-1tb", nombre: "SSD NVMe 1TB Gen3", precio: 75, tipo: "NVMe",
      img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop&crop=center" },
    { id: "ssd-2tb-gen4", nombre: "SSD NVMe 2TB Gen4", precio: 149, tipo: "NVMe",
      img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop&crop=center" },
  ],
  psu: [
    { id: "psu-650", nombre: "Fuente 650W 80+ Bronze", precio: 69, watts: 650,
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center" },
    { id: "psu-750-gold", nombre: "Fuente 750W 80+ Gold", precio: 109, watts: 750,
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&crop=center" },
  ],
  case: [
    { id: "case-atx", nombre: "Gabinete ATX con vidrio", precio: 79, factor: "ATX",
      img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=600&fit=crop&crop=center" },
    { id: "case-matx", nombre: "Gabinete mATX compacto", precio: 59, factor: "mATX",
      img: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=600&fit=crop&crop=center" },
  ],
  cooling: [
    { id: "cool-air", nombre: "Cooler Aire 120mm", precio: 25, tipo: "Aire",
      img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&crop=center" },
    { id: "cool-aio", nombre: "AIO 240mm", precio: 95, tipo: "Líquida",
      img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&crop=center" },
  ],
};
