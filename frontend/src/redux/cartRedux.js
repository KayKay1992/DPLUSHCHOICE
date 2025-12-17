import { createSlice, createSelector } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    userCarts: {}, // Store carts by user ID
    currentUserId: null, // Track current user
    guestCart: {
      products: [], // Cart for non-logged-in users
      quantity: 0,
      total: 0,
    },
  },
  reducers: {
    // Set current user and switch to their cart
    setCurrentUser: (state, action) => {
      const userId = action.payload?.id || action.payload?._id || "guest";
      state.currentUserId = userId;

      // Ensure userCarts object exists
      if (!state.userCarts) {
        state.userCarts = {};
      }

      // Initialize cart for new user if it doesn't exist
      if (userId !== "guest" && !state.userCarts[userId]) {
        state.userCarts[userId] = {
          products: [],
          quantity: 0,
          total: 0,
        };
      }
    },

    // Clear cart for logout
    clearUserCart: (state) => {
      if (state.currentUserId === "guest") {
        state.guestCart = {
          products: [],
          quantity: 0,
          total: 0,
        };
      } else if (state.currentUserId) {
        state.userCarts[state.currentUserId] = {
          products: [],
          quantity: 0,
          total: 0,
        };
      }
    },

    // Add product to current user's cart
    addProduct: (state, action) => {
      const product = action.payload;
      let currentCart;

      if (state.currentUserId === "guest" || !state.currentUserId) {
        currentCart = state.guestCart;
      } else {
        // Ensure userCarts exists
        if (!state.userCarts) {
          state.userCarts = {};
        }
        if (!state.userCarts[state.currentUserId]) {
          state.userCarts[state.currentUserId] = {
            products: [],
            quantity: 0,
            total: 0,
          };
        }
        currentCart = state.userCarts[state.currentUserId];
      }

      // Check if product already exists
      const existingProductIndex = currentCart.products.findIndex(
        (p) => p.id === product.id
      );

      if (existingProductIndex !== -1) {
        // Update quantity if product exists
        currentCart.products[existingProductIndex].quantity += product.quantity;
      } else {
        // Add new product
        currentCart.products.push(product);
      }

      // Recalculate totals
      currentCart.quantity = currentCart.products.reduce(
        (total, p) => total + p.quantity,
        0
      );
      currentCart.total = currentCart.products.reduce(
        (total, p) => total + p.price * p.quantity,
        0
      );
    },

    // Remove product from current user's cart
    removeProduct: (state, action) => {
      let currentCart;

      if (state.currentUserId === "guest" || !state.currentUserId) {
        currentCart = state.guestCart;
      } else {
        // Ensure userCarts exists
        if (!state.userCarts) {
          state.userCarts = {};
        }
        currentCart = state.userCarts[state.currentUserId] || {
          products: [],
          quantity: 0,
          total: 0,
        };
      }

      const index = currentCart.products.findIndex(
        (product) => product.id === action.payload.id
      );

      if (index !== -1) {
        currentCart.products.splice(index, 1);
        // Recalculate totals
        currentCart.quantity = currentCart.products.reduce(
          (total, p) => total + p.quantity,
          0
        );
        currentCart.total = currentCart.products.reduce(
          (total, p) => total + p.price * p.quantity,
          0
        );
      }
    },

    // Update product quantity in current user's cart
    updateProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      let currentCart;

      if (state.currentUserId === "guest" || !state.currentUserId) {
        currentCart = state.guestCart;
      } else {
        // Ensure userCarts exists
        if (!state.userCarts) {
          state.userCarts = {};
        }
        currentCart = state.userCarts[state.currentUserId] || {
          products: [],
          quantity: 0,
          total: 0,
        };
      }

      const productIndex = currentCart.products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        if (quantity <= 0) {
          // Remove product if quantity is 0 or less
          currentCart.products.splice(productIndex, 1);
        } else {
          // Update quantity
          currentCart.products[productIndex].quantity = quantity;
        }

        // Recalculate totals
        currentCart.quantity = currentCart.products.reduce(
          (total, p) => total + p.quantity,
          0
        );
        currentCart.total = currentCart.products.reduce(
          (total, p) => total + p.price * p.quantity,
          0
        );
      }
    },

    // Clear current user's cart
    clearCart: (state) => {
      if (state.currentUserId === "guest" || !state.currentUserId) {
        state.guestCart = {
          products: [],
          quantity: 0,
          total: 0,
        };
      } else if (state.currentUserId) {
        // Ensure userCarts exists
        if (!state.userCarts) {
          state.userCarts = {};
        }
        state.userCarts[state.currentUserId] = {
          products: [],
          quantity: 0,
          total: 0,
        };
      }
    },
  },
});

// Selectors to get current cart data
export const selectCurrentCart = createSelector(
  [(state) => state.cart],
  (cartState) => {
    if (cartState.currentUserId === "guest" || !cartState.currentUserId) {
      return cartState.guestCart || { products: [], quantity: 0, total: 0 };
    } else {
      const userCart = cartState.userCarts?.[cartState.currentUserId] || {
        products: [],
        quantity: 0,
        total: 0,
      };
      return userCart;
    }
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
