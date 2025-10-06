import "./NewArrivals.css";

const ITEMS = [
  {
    title: "Tarjeta Gráfica",
    desc: "Potencia gráfica sin igual.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnDmZCdyWvW0hUm_f3h3Vs0kuBEhGfioeRJ9jBWGbrMGmpnhiquilHRWSZJcV00mLhKnf9Abl1LSzL2ROcjZWU8AyEGr8zVfX4CQeU4qnRGF3iTAavROnWpZ1TXc6pfCI9qM76kBUSD_9CdTHnxATMzIP8GnjVKNFIaFSPZc7lhtkVXVGbHUReVbTVqbHSo7WtCplUQXmoPeRVI6p38KYYmaGYuAgSWy-1RCysOD2YHdMinHE5h5d4x0riHj4ay2VxZJ6qT7ZKVoU",
  },
  {
    title: "Memoria RAM",
    desc: "Aumenta la velocidad de tu sistema.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-cuvKiK6xVxSE1tbAvNnFwqyuxgNeOSv-RmFU7gAcCkCA5dxCWCzySPWDGG4ICW9W91ug-op4ML3NtR8MASxsEqUvbK0UDOPMOWJbTgBKvJQNAhdDH9R-_WiR_v_LT3J5m_r7P32EhZMGcDkmhMxQtECO068P14xQC75bQrBnIVLYae_vp6DpQDtwPnevOoxXAue5bHS9IqfxsBaFEIlSVYfhVTc9_vzjNnt0FGahRi1zcNofs35pZbdl-vo3dVyV3tXT3T-hN3k",
  },
  {
    title: "SSD NVMe",
    desc: "Almacenamiento ultrarrápido.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeVXj1jJnkbe5dcm9JcjKhjDQlinEOo29AVecAY8mMtvr9zWtbhIgCG4c0SubsgedLH-37gwdbX_O_p49ud011rgmy89pBlgZxaFbtQbgnkcmfduD88ApSOUyizu0bykitO6HtK6MHTQNKRK2HMuLJ-39g5V4OZhKrbGTTGso3h1lsochYrh0DYsDoeT-YfzRxCUmyDeolwy8C4PdWeKUGSwj3A3z_-GQ5GXJY84TXKEBCAL7WVNMpyFRWbBBMSMBnVfzJ1J0pk3c",
  },
  {
    title: "Fuente de Alimentación",
    desc: "Eficiencia y estabilidad.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMyYD0tviWD9RmP_Tiz2Dzb4OeMBSsBzLKTH_nu-t63YvsunTrDDVXlQRiLCeFLLJ9XGlEt9HzCZg8nCMy9g7F89f1KaS3a-9AqQnk5QscS4QPOs-Nq1dbXItJlED05Ev_vv0MsBxlcywpyjyVuxLxDsJ4vGbF8EZvCEaFWhjfTxnI7lU9JwvVDEgkL0KCuITdXLIgTn56F-oxK3LxHYoI9E7G3Vsx-Lg1C6jGpeHuGLCEKIkzYTRHe6nVKTLVfg17vV6jMmkMMDA",
  },
];

const NewArrivals = () => {
  return (
    <section className="new">
      <h2 className="new__title">Nuevas incorporaciones</h2>
      <div className="new__grid">
        {ITEMS.map((it) => (
          <article key={it.title} className="newcard">
            <div className="newcard__img" style={{ backgroundImage: `url("${it.img}")` }} />
            <div className="newcard__body">
              <h3 className="newcard__h">{it.title}</h3>
              <p className="newcard__p">{it.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
export default NewArrivals;
