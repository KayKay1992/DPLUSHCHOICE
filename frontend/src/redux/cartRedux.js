import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialCartState = {
  products: [],
  quantity: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    userCarts: {},
    currentUserId: null,
    guestCart: { ...initialCartState },
  },

  reducers: {
    // =========================
    // SET CURRENT USER
    // =========================
    setCurrentUser: (state, action) => {
      const userId = action.payload?.id || action.payload?._id || "guest";
      state.currentUserId = userId;

      if (userId !== "guest" && !state.userCarts[userId]) {
        state.userCarts[userId] = { ...initialCartState };
      }
    },

    // =========================
    // CLEAR USER CART (LOGOUT)
    // =========================
    clearUserCart: (state) => {
      if (state.currentUserId === "guest" || !state.currentUserId) {
        state.guestCart = { ...initialCartState };
      } else {
        state.userCarts[state.currentUserId] = { ...initialCartState };
      }
    },

    // =========================
    // ADD PRODUCT (INCREMENT)
    // =========================
    addProduct: (state, action) => {
      const product = action.payload;

      const currentCart =
        state.currentUserId === "guest" || !state.currentUserId
          ? state.guestCart
          : state.userCarts[state.currentUserId];

      const existingItem = currentCart.products.find(
        (item) => item.id === product.id
      );

      const increment = Number(product.quantity) || 1;

      if (existingItem) {
        // ✅ increment quantity (CRITICAL FIX)
        existingItem.quantity += increment;
      } else {
        currentCart.products.push({
          ...product,
          quantity: increment,
        });
      }

      // ✅ recalc totals
      currentCart.quantity = currentCart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      currentCart.total = currentCart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    // =========================
    // REMOVE PRODUCT
    // =========================
    removeProduct: (state, action) => {
      const currentCart =
        state.currentUserId === "guest" || !state.currentUserId
          ? state.guestCart
          : state.userCarts[state.currentUserId];

      currentCart.products = currentCart.products.filter(
        (item) => item.id !== action.payload.id
      );

      currentCart.quantity = currentCart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      currentCart.total = currentCart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    // =========================
    // UPDATE PRODUCT QUANTITY (ABSOLUTE)
    // =========================
    updateProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      if (quantity < 1) return;

      const currentCart =
        state.currentUserId === "guest" || !state.currentUserId
          ? state.guestCart
          : state.userCarts[state.currentUserId];

      const item = currentCart.products.find(
        (product) => product.id === productId
      );

      if (!item) return;

      // ✅ absolute quantity set (SAFE)
      item.quantity = Number(quantity);

      // Optional: wholesale logic
      if (
        item.wholesalePrice &&
        item.wholesaleMinimumQuantity &&
        item.quantity >= item.wholesaleMinimumQuantity
      ) {
        item.price = item.wholesalePrice;
        item.isWholesale = true;
      } else {
        item.price = item.discountPrice || item.originalPrice;
        item.isWholesale = false;
      }

      currentCart.quantity = currentCart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      currentCart.total = currentCart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    // =========================
    // CLEAR CART
    // =========================
    clearCart: (state) => {
      if (state.currentUserId === "guest" || !state.currentUserId) {
        state.guestCart = { ...initialCartState };
      } else {
        state.userCarts[state.currentUserId] = { ...initialCartState };
      }
    },
  },
});

// =========================
// SELECTOR
// =========================
export const selectCurrentCart = createSelector(
  [(state) => state.cart],
  (cartState) => {
    if (cartState.currentUserId === "guest" || !cartState.currentUserId) {
      return cartState.guestCart;
    }
    return (
      cartState.userCarts[cartState.currentUserId] || {
        ...initialCartState,
      }
    );
  }
);

export const {
  setCurrentUser,
  clearUserCart,
  addProduct,
  removeProduct,
  updateProductQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
