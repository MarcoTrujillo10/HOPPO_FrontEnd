import { useMemo, useState } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductGrid from "../components/ProductGrid";
import "./ProductList.css";

// Datos mock (podés pasarlos a /src/data/products.js si querés)
const RAW = [
  { id: "cpu-i7", nombre: "Intel Core i7", detalle: "12C/24T", categoria: "Componentes", marca: "Intel", precio: 350, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeEZ3wJRC_iZRmm61SLDO7Hi9nNZH8JXC79xQghK3aAPKFAla1BuCoEgF5u9KSYQAnDjHh-gD84neVLlw7nMMWa0oOyQHLLoWj3ginyHsAyba8OqVibkfYkqt8MLJBoFUICfeCyD4kFYmUULzHUFKxjQHqe9tdal1DYaiEZ4nTUK61Wp6fsDFeSL_a5O-doU0VUWN6fijTVSN6Zv-6JTBy0GmLzOUp5TyXFK6GVPzbuUsj8oR_2cBz50PDnE_ex-kGcPRG5Ad2r-4" },
  { id: "gpu-3080", nombre: "NVIDIA RTX 3080", detalle: "10 GB GDDR6X", categoria: "Componentes", marca: "NVIDIA", precio: 1200, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ3WJvAue9tfr-7SvXGxS5UadyO2OGS21_qDzIY-w_NKQkCDS46H7JrkLa1fmVVHYcXSB3A5SYgNcf2Y9h7hMnlJzYKi8h8RQuMQ5Bmt2NLL4bUrNR4HNK804Agij6KzPhlrT0xE6X8HDN6BFRmHORKpki6uymsi6a8T29f_OUUfrwVgWjJqOjjoubpI5qJsO7JwrnUZtNvMr-VTmhwXx2TAJC17cNqTNCm9SnTLbnVE7swMulVPoEkmnlmtPtSmxNidAEIMvlZgk" },
  { id: "ram-ven", nombre: "Corsair Vengeance 16GB", detalle: "DDR4 3200", categoria: "Componentes", marca: "Corsair", precio: 95, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJabHAOWCQEFvtaG0SrkKL6k0ub2C2PCBfGWXiHSPSpjrA8BlPmxidgsCfpmQtAwt_lAa7Gc-W7pmZS_lTWgcoZBFlZWDVOYTQ5msC539UfRdKtF9prGEWvEO1Ev-zyXUclIj66eqf2rToXoIXP3z7SbuQD0QK7Qs6fgjCabbOGOOjuVnKYlta5Dvtv4wUYbYQyEJm2KSbPYisUJyd8jpMxufPmXWT8zcmKeiTrKRL-lYjmYmSz_1SMeFx8CFQY8MyfrUgtQ4Q2p4" },
  { id: "ssd-970", nombre: "Samsung 970 EVO 1TB", detalle: "NVMe Gen3", categoria: "Componentes", marca: "Samsung", precio: 150, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGZaayb0XYmWATQgCS90Q8EDGTcZV2iBaULUppWB0O7FjpdIAFFwLfrb1wDmkkuHBqIbsahHJvmycKJ7T55S-VUT08Fv6g8V_qmscWdtet1HgU7pcWAQX4OiasSR2zkgtuICAZWBAKoPsr8-n-YfUT2q88hhEn_hc8pGpCl7Jgo_21J6qDzbHO0qvt-bjjBsGJT9IASLvSLl4EFIicI75ppeFGRaLyxm9kvaEs0nn5ht2Gh7-ou2YXAi61JAU6d11SVqyOfWNEFaY" },
  { id: "kb-logi", nombre: "Logitech G Pro", detalle: "Teclado mecánico", categoria: "Periféricos", marca: "Logitech", precio: 130, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCDiT9I5TDv0-hTNvViiBMm-TL97QYQJdvgR8-RetLYH6eLTDJJ11wCFPd50jNshrdqrWrc4JOkNTHL2Er5zFhgMlkXiufAvhy45c-oRSj4d_PbIwaFSDYfA1QfjEkzFKLCG_OatqOuZ9_IVpHr33G9jMbL-UrksQD0dRG6SHfyi2yi0MvK17xUsqkTxeSTMnXTmMhRhh2Hv2YxW9Mk0V5wrxhHzfO3DYcV-5E95F8PkEtyZH-HGYIz7in3hMxoW_9Ztq4qvMwFA0" },
  { id: "mouse-viper", nombre: "Razer Viper", detalle: "Ratón inalámbrico 20K DPI", categoria: "Periféricos", marca: "Razer", precio: 80, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAB9-3XqvgCJAPM9ivAYfCA5VvWZSF6eXGgfbMlqrQ_PGxqgqwLiuZlcAFiJj-RXcHbtw2y0D1vc_49tFS0izptLZnoz8SiCDNEPAuKDWKx0gI5bvKhWIwz8MEadfnVYn6TlR8kVoly8TtUDOKg0Yd_GFGqr79tWrbVzAv7eEEv50Y9d6-Gf2LRpnD-4TFubIcFE2VIP5MYT-vJXGLpcEiLQEr2qEFescMW8IWZvIH7Aux8DJ98HD4crvlYGPQkXmNhfhDtouCBDlY" },
  { id: "hp-cloud2", nombre: "HyperX Cloud II", detalle: "Auriculares 7.1", categoria: "Periféricos", marca: "HyperX", precio: 99, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsnTsArs0xYlbkqu7Nrr7cwsq9paYWaPfSZfM9TDbnOthiQ5_yL9NfIdQmrIQGgbuEA4pH1FlMVUdX0PzIynw7aFGjdsvoiW9a2YcoMzSCKcXUuVlh01FBdPzoN6qMdJiBsG0D_j_t9jfVaFXEqFJFbQpkPww8qIz7p2k-pC7mewI7qDhayyZD50v1K0LG3mdLrlLUmTIb2dPKqSdVaISCQpvJV_BW36yOBCH1CTcAUaxZD68JRhrlsx5Of3NbkJuYHVdNjJV-_WA" },
  { id: "monitor-rog", nombre: 'ASUS ROG Swift 27"', detalle: "1440p 165Hz", categoria: "Periféricos", marca: "ASUS", precio: 650, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRncjYZdCPlCJRhQTjOFL7EXVJ1BkPvRmWipoIxda3UtLZe0DdwdIFUrM9_l-16M927BELd3WaxQ0NbHxx26yl9KPFQLlLx4PCf9ddcytvnChtNsylYIH1CzjAL8o0rLDWKyX94EL7_KPlUFWPG6fdWP4raQACsOsL-byARQSOaHz16YAX2DRWBiaL9..." },
];

const uniq = (arr) => [...new Set(arr)];
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const ProductList = () => {
  // Estado de filtros de toda la vista
  const [filters, setFilters] = useState({
    q: "",
    categoria: "Todos",
    marcas: [],
    min: "",
    max: "",
    orden: "relevancia",
  });

  // Opciones dinámicas para selects/checkboxes
  const categorias = useMemo(
    () => ["Todos", ...uniq(RAW.map((p) => p.categoria))],
    []
  );
  const marcasOpts = useMemo(() => uniq(RAW.map((p) => p.marca)).sort(), []);

  // Filtrado + orden (memorizado)
  const productos = useMemo(() => {
    let out = RAW.slice();
    const { q, categoria, marcas, min, max, orden } = filters;

    // Búsqueda
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      out = out.filter(
        (p) =>
          p.nombre.toLowerCase().includes(t) ||
          p.detalle.toLowerCase().includes(t) ||
          p.marca.toLowerCase().includes(t)
      );
    }

    // Categoría
    if (categoria !== "Todos") out = out.filter((p) => p.categoria === categoria);

    // Marcas (multi)
    if (marcas.length) out = out.filter((p) => marcas.includes(p.marca));

    // Precio
    const nMin = min === "" ? -Infinity : Number(min);
    const nMax = max === "" ? +Infinity : Number(max);
    out = out.filter((p) => p.precio >= nMin && p.precio <= nMax);

    // Orden
    switch (orden) {
      case "precio-asc":
        out.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        out.sort((a, b) => b.precio - a.precio);
        break;
      case "alf-asc":
        out.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "alf-desc":
        out.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        break; // relevancia: orden original
    }

    return out;
  }, [filters]);

  // Helpers que pasan a los inputs de precio
  const clampMin = (v) =>
    setFilters((f) => ({ ...f, min: v === "" ? "" : clamp(+v, 0, 100000) }));
  const clampMax = (v) =>
    setFilters((f) => ({ ...f, max: v === "" ? "" : clamp(+v, 0, 100000) }));

  return (
    <main className="productList">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        categorias={categorias}
        marcasOpts={marcasOpts}
        clampMin={clampMin}
        clampMax={clampMax}
      />

      <section className="list">
        <div className="list__head">
          <h2 className="list__title">Productos</h2>
          <span className="list__count">{productos.length} resultados</span>
        </div>

        <ProductGrid productos={productos} />
      </section>
    </main>
  );
};

export default ProductList;
