import ProductCard from "./ProductCard";

const ProductGrid = ({ productos }) => {
  return (
    <div className="grid">
      {productos.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
