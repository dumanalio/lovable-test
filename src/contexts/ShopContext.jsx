import { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  cart: [],
  wishlist: [],
  products: [
    {
      id: 1,
      name: "Liquid Dreams",
      description: "Fließende Formen in harmonischen Farbtönen",
      price: 29.99,
      category: "abstract",
      rating: 4.9,
  image: "/poster1.jpg",
    },
    {
      id: 2,
      name: "Urban Harmony",
      description: "Moderne Architektur im goldenen Licht",
      price: 34.99,
      category: "nature",
      rating: 4.7,
  image: "/poster2.jpg",
    },
    {
      id: 3,
      name: "Geometric Essence",
      description: "Minimalistische Geometrie in Perfektion",
      price: 24.99,
      category: "minimal",
      rating: 5.0,
  image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1200&q=80",
    },
  ],
  activeFilter: "all",
  notifications: [],
};

// Action types
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const TOGGLE_WISHLIST = "TOGGLE_WISHLIST";
const SET_FILTER = "SET_FILTER";
const ADD_NOTIFICATION = "ADD_NOTIFICATION";
const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";

// Reducer
function shopReducer(state, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, cartId: Date.now() }],
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((item) => item.cartId !== action.payload),
      };

    case TOGGLE_WISHLIST: {
      const isInWishlist = state.wishlist.some(
        (item) => item.id === action.payload.id
      );
      return {
        ...state,
        wishlist: isInWishlist
          ? state.wishlist.filter((item) => item.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }

    case SET_FILTER:
      return {
        ...state,
        activeFilter: action.payload,
      };

    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          { ...action.payload, id: Date.now() },
        ],
      };

    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notif) => notif.id !== action.payload
        ),
      };

    default:
      return state;
  }
}

// Context
const ShopContext = createContext();

// Provider component
export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  const addToCart = (product) => {
    dispatch({ type: ADD_TO_CART, payload: product });
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        message: `${product.name} wurde zum Warenkorb hinzugefügt!`,
        type: "success",
      },
    });
  };

  const removeFromCart = (cartId) => {
    dispatch({ type: REMOVE_FROM_CART, payload: cartId });
  };

  const toggleWishlist = (product) => {
    dispatch({ type: TOGGLE_WISHLIST, payload: product });
    const isInWishlist = state.wishlist.some((item) => item.id === product.id);
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        message: isInWishlist
          ? `${product.name} aus Wunschliste entfernt`
          : `${product.name} zur Wunschliste hinzugefügt!`,
        type: isInWishlist ? "info" : "success",
      },
    });
  };

  const setFilter = (filter) => {
    dispatch({ type: SET_FILTER, payload: filter });
  };

  const removeNotification = (id) => {
    dispatch({ type: REMOVE_NOTIFICATION, payload: id });
  };

  const value = {
    state,
    addToCart,
    removeFromCart,
    toggleWishlist,
    setFilter,
    removeNotification,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// Custom hook
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
