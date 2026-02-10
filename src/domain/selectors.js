const normalizeText = (value = "") => value.trim().toLowerCase();

const includesText = (source, term) =>
  term.length === 0 || source.toLowerCase().includes(term);

export const selectFilteredMenuItems = (state) => {
  const term = normalizeText(state.searchTerm);
  return state.inventory.filter(
    (item) =>
      item.category === state.selectedCategory && includesText(item.name, term)
  );
};

export const selectFilteredInventoryItems = (state) => {
  const term = normalizeText(state.searchTerm);
  return state.inventory.filter(
    (item) =>
      includesText(item.name, term) ||
      includesText(item.category, term) ||
      includesText(item.unit, term)
  );
};

export const selectFilteredClients = (state) => {
  const term = normalizeText(state.searchTerm);
  return state.clients.filter(
    (client) =>
      includesText(client.name, term) ||
      includesText(client.tier, term) ||
      includesText(client.preferences, term)
  );
};

export const selectCartSubtotal = (state) =>
  state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);

export const selectCartServiceFee = (state) => selectCartSubtotal(state) * 0.1;

export const selectCartTotal = (state) =>
  selectCartSubtotal(state) + selectCartServiceFee(state);

export const selectCartItemsCount = (state) =>
  state.cart.reduce((acc, item) => acc + item.qty, 0);

export const selectLowStockItems = (state, threshold = 10) =>
  state.inventory.filter((item) => item.stock < threshold);

export const selectSelectedKitchenOrder = (state) =>
  state.kitchenOrders.find((order) => order.id === state.ui.selectedOrderId) ||
  null;
