import { DELETE_PRODUCT, CREATE_PRODUCT, EDIT_PRODUCT, SET_PRODUCTS } from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: [],
    userProducts: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                ...state,
                availableProducts: action.products,
                userProducts: action.userProducts
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts: state.userProducts.filter(
                    prod => prod.id !== action.itemId
                ),
                availableProducts: state.availableProducts.filter(
                    prod => prod.id !== action.itemId
                )
            };
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.id,
                action.ownerId,
                action.title,
                action.imageUrl,
                action.desc,
                action.price
            );
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            };
        case EDIT_PRODUCT:
            const prodIndex = state.userProducts.findIndex(prod => prod.id === action.prodId);
            console.log(action);
            const updatedProduct = new Product(
                action.prodId,
                state.userProducts[prodIndex].ownerId,
                action.title,
                action.imageUrl,
                action.desc,
                state.userProducts[prodIndex].price
            );
            const updatedUserProducts = [ ...state.userProducts];
            updatedUserProducts[prodIndex] = updatedProduct;
            const availableProdIndex = state.userProducts.findIndex(prod => prod.id === action.prodId);
            const updatedAvailableProducts = [...state.availableProducts];
            updatedAvailableProducts[availableProdIndex] = updatedProduct;
            return {
                ...state,
                userProducts: updatedUserProducts,
                availableProducts: updatedAvailableProducts
            };
        default:
            return state;
    };

};