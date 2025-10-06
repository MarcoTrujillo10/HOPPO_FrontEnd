import "./Featured.css";

const ITEMS = [
  {
    title: "PC Gamer de Alto Rendimiento",
    desc: "Experimenta el máximo rendimiento.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgepR1Gxi_5yNZIaoyoofizPVZqQQXg66gjBNvQEE_sobqKqIMMio19fHcFRBLp1wZsuBJg3bY-n7_lCp-4hR672a79S9C946YZo-8srxa55nfagG2_qTWhluKDKbJh_ALIRnVIBLweXFDvMb3n2wc6axImEPorjnBWygfMSF-rePU06FnA4Ur0i-qGQmSdNGDD02u3gwtVMcnOVkA0J2_ft8dHyYbXJO3giEegLIUvALYD_5W2hjpKxcAdI4NmOXCmz2m1rOlEH8",
  },
  {
    title: "Teclado Mecánico Ergonómico",
    desc: "Mejora tu productividad y comodidad.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuDXH6AMkSbr_QQsAtXnG9I6gcrudg0ZVXvYU5A2BX5v_BLpnxiJXer2C992yysfJXi3sAhsiRwrthhe6eFXRYsSg6GFYrV5-Tniuj6deZfTnSR2ru3AHzIx6l5V9-QgTlR4ARfwyfgg_4F6_IhZ-364BGex8ygRJURGy9VsXuKHZihLj30sN7F0hF6KCJAgmhTFDRUMa7igqdb7AaXKMMMbS9EiD4mngRR7bD0FTXo9ckYVYJtFEqwF4sz8u5LKFCFudlvwlflP8",
  },
  {
    title: "Mouse Inalámbrico para Gaming",
    desc: "Precisión y libertad de movimiento.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGEieVtrRLLArEzSrZ3aLFQdunn3Y28vNghRlyaLrEzmaQFvyfiO3o0nffXNEzaabJ39g0MJ_nbsizraX_ij9xOFwDbDal8ydAdqu96lqemRbS5_-HVx6rN5e306FRQs8schpF5FuHOKsREbFydyVmOWIid8U5j5su9d-8cN9LQk9kCC3x5QP-fIkN0_-tIhpspHcz3clNkNEreSU6iqmTfrNvcQE8_GVYiUK8bHH55mVSUN8O_nhnkcTzJVomTV7xVyIMPqIpBM0",
  },
  {
    title: "Monitor Curvo para Gaming",
    desc: "Sumérgete en tus juegos favoritos.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp89u2vodRuvxvhhTbVkEtcsPekPrNb3iea15bjcNuUr3I2xlcP5pg01E_XLPCPjH86FWdoY5lnfTPjNEsmOvSTzh-vY95Fvq4S2qXGsj3qNUjVYgQ02mQ4IdSpKYpGo19gZTT5YzvyAltAm63te_BNHFEHsxyGUIp0JQCBOB_Sg9vTUQ1Hy-PcfAEHCm0y5NCaHbkizoFLK1ZhQJqmi5NT5qtevTnxjgcKJaoKyXYNWEPuUIEm4bMjN4mAs3irPopZBds2jvrMqA",
  },
];

const Featured = () =>{
  return (
    <section className="feat">
      <h2 className="feat__title">Productos destacados</h2>
      <div className="feat__grid">
        {ITEMS.map((it) => (
          <article key={it.title} className="card">
            <div className="card__img" style={{ backgroundImage: `url("${it.img}")` }} />
            <div className="card__body">
              <h3 className="card__h">{it.title}</h3>
              <p className="card__p">{it.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
export default Featured;
