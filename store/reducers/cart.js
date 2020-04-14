import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import CartItem from '../../models/cart-item';
import { ADD_ORDER } from '../actions/order';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;

            let updatedOrNewCartItem;

            if (state.items[addedProduct.id]) {
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].total + prodPrice
                );

            } else {
                updatedOrNewCartItem = new CartItem(
                    1, prodPrice, prodTitle, prodPrice
                );
            };
            return {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice
            }
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.itemId];
            const currentQty = selectedCartItem.quantity;
            let updateCartItems;
            if (currentQty > 1) {
                const updateCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.total - selectedCartItem.productPrice
                );
                updateCartItems = { ...state.items, [action.itemId]: updateCartItem };
            } else {
                updateCartItems = { ...state.items };
                delete updateCartItems[action.itemId];
            };
            return {
                ...state,
                items: updateCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };
            case ADD_ORDER:
                return initialState;
            case DELETE_PRODUCT:
                if(!state.items[action.itemId]) {
                    return state;
                };
                const updatedItems = { ...state.items };
                const itemTotal = state.items[action.itemId].total;
                delete updatedItems[action.itemId];
                return {
                    ...state,
                    items: updatedItems,
                    totalAmount: state.totalAmount - itemTotal
                };
        default:
            return state;

    }

};