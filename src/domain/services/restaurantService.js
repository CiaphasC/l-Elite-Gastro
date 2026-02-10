const clampAtZero = (value) => Math.max(0, value);

export const addItemToCart = (cart, item) => {
  const existingItem = cart.find((line) => line.id === item.id);
  if (existingItem) {
    return cart.map((line) =>
      line.id === item.id ? { ...line, qty: line.qty + 1 } : line
    );
  }

  return [...cart, { ...item, qty: 1 }];
};

export const updateCartItemQty = (cart, itemId, delta) =>
  cart
    .map((line) => {
      if (line.id !== itemId) {
        return line;
      }

      return { ...line, qty: clampAtZero(line.qty + delta) };
    })
    .filter((line) => line.qty > 0);

export const updateInventoryStock = (inventory, itemId, delta) =>
  inventory.map((item) => {
    if (item.id !== itemId) {
      return item;
    }

    return { ...item, stock: clampAtZero(item.stock + delta) };
  });

export const appendReservation = (reservations, reservationPayload) => {
  const reservation = {
    id: Date.now(),
    name: reservationPayload.name.trim(),
    time: reservationPayload.time,
    guests: Number(reservationPayload.guests),
    table: "---",
    type: reservationPayload.type || "Nueva",
    status: "pendiente",
  };

  return [...reservations, reservation];
};

export const removeKitchenOrder = (orders, orderId) =>
  orders.filter((order) => order.id !== orderId);
