import { useEffect, useState } from "react";

const API_URL = "http://localhost:5175/api/products";

export default function ProductCrud() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudieron obtener los productos.");
    }

    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const product = {
      ...(editingId !== null && { id: editingId }),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    const url = editingId !== null ? `${API_URL}/${editingId}` : API_URL;

    const method = editingId !== null ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("La operación no pudo completarse.");
      }

      resetForm();
      await getProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este producto?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el producto.");
      }

      await getProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Inventory Manager
          </h1>

          <p className="mt-2 text-gray-600">
            Gestiona tus productos y controla tu inventario.
          </p>
        </div>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId !== null ? "Editar producto" : "Agregar producto"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Precio"
              min="0"
              step="0.01"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Cantidad"
              min="0"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {loading
                  ? "Guardando..."
                  : editingId !== null
                    ? "Actualizar"
                    : "Agregar producto"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">Productos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 text-gray-600">{product.id}</td>

                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.description}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      RD$ {Number(product.price).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {product.quantity}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
