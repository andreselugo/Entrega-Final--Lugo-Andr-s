const productos = [];

const carrito = {
  items: [],
  agregar(producto, cantidad) {
    const existente = this.items.find(p => p.nombre === producto.nombre);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.items.push({ ...producto, cantidad });
    }
    actualizarCantidadCarrito();
  },
  vaciar() {
    this.items.length = 0;
    actualizarCantidadCarrito();
  },
  total() {
    return this.items.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  },
  estaVacio() {
    return this.items.length === 0;
  }
};

async function cargarProductos() {
  // Simula una carga de datos asíncrona
  const datosSimulados = [
    { nombre: "Campera", precio: 12000 },
    { nombre: "Gorra", precio: 3000 },
    { nombre: "Pantalón", precio: 8000 },
    { nombre: "Remera", precio: 5000 },
    { nombre: "Zapatillas", precio: 15000 },
    { nombre: "Buzo", precio: 10000 }
  ];
  return new Promise(resolve => {
    setTimeout(() => resolve(datosSimulados), 500);
  });
}

function mostrarProductos() {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";
  productos.forEach((producto, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${producto.nombre}</strong>
      <p>Precio: $${producto.precio}</p>
      <label>
        <input type="number" min="1" value="1" id="cantidad-${index}">
      </label>
      <button data-index="${index}">Agregar</button>
    `;
    contenedor.appendChild(card);
  });

  const botones = contenedor.querySelectorAll("button");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.getAttribute("data-index"));
      agregarAlCarrito(index);
    });
  });
}

function agregarAlCarrito(index) {
  const cantidadInput = document.getElementById(`cantidad-${index}`);
  const cantidad = parseInt(cantidadInput.value);
  if (cantidad > 0) {
    carrito.agregar(productos[index], cantidad);
  }
}

function actualizarCantidadCarrito() {
  const cantidadTotal = carrito.items.reduce((acc, prod) => acc + prod.cantidad, 0);
  document.getElementById("cantidad-carrito").textContent = cantidadTotal;
}

function mostrarModalCarrito() {
  const modal = document.getElementById("modal-carrito");
  const contenido = document.getElementById("contenido-carrito");
  contenido.innerHTML = "";

  if (carrito.estaVacio()) {
    contenido.textContent = "El carrito está vacío.";
  } else {
    carrito.items.forEach(p => {
      const item = document.createElement("p");
      item.textContent = `${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}`;
      contenido.appendChild(item);
    });
    const total = document.createElement("p");
    total.style.fontWeight = "bold";
    total.textContent = `Total: $${carrito.total()}`;
    contenido.appendChild(total);
  }
  modal.style.display = "flex";
}

function ocultarModalCarrito() {
  document.getElementById("modal-carrito").style.display = "none";
}

function mostrarMensajeModal(mensaje) {
  const modal = document.getElementById("modal-carrito");
  const contenido = document.getElementById("contenido-carrito");
  contenido.innerHTML = mensaje;
  modal.style.display = "flex";
}

function realizarCompra() {
  if (carrito.estaVacio()) {
    mostrarMensajeModal("El carrito está vacío.");
  } else {
    carrito.vaciar();
    actualizarCantidadCarrito();
    ocultarModalCarrito();
    mostrarMensajeModal("¡Compra realizada con éxito!");
  }
}

function vaciarCarrito() {
  if (carrito.estaVacio()) {
    mostrarMensajeModal("El carrito está vacío.");
  } else {
    carrito.vaciar();
    actualizarCantidadCarrito();
    ocultarModalCarrito();
    mostrarMensajeModal("Carrito vaciado con éxito.");
  }
}

document.getElementById("btn-ver-carrito").addEventListener("click", mostrarModalCarrito);
document.getElementById("btn-cerrar-modal").addEventListener("click", ocultarModalCarrito);
document.getElementById("btn-vaciar").addEventListener("click", vaciarCarrito);
document.getElementById("btn-comprar").addEventListener("click", realizarCompra);

cargarProductos().then(data => {
  productos.push(...data);
  mostrarProductos();
});
