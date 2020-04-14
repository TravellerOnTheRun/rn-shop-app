import Product from "../../models/product";

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const EDIT_PRODUCT = 'EDIT_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch('https://rn-server.firebaseio.com/products.json');
            if (!response.ok) {
                throw new Error('Something went wrong!');
            };
            const resData = await response.json();
            const loadedProducts = [];

            for (const key in resData) {
                loadedProducts.push(
                    new Product(
                        key,
                        resData[key].ownerId,
                        resData[key].title,
                        resData[key].imageUrl,
                        resData[key].desc,
                        resData[key].price,
                    )
                );
            };
            dispatch({ 
                type: SET_PRODUCTS, 
                products: loadedProducts, 
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            });
        } catch (err) {
            //send to custom analytics
            throw err;
        };
    };
};

export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-server.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE'
        });
        if(!response.ok) {
            throw new Error('Something went wrong!');
        };
        dispatch({ type: DELETE_PRODUCT, itemId: productId });
    };
};

export const createNewProduct = (title, desc, imageUrl, price) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-server.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                desc,
                imageUrl,
                price,
                ownerId: userId
            })
        });
        const resData = await response.json();

        dispatch({
            id: resData.name,
            type: CREATE_PRODUCT,
            title,
            desc,
            imageUrl,
            price,
            ownderId: userId
        });
    };

};

export const editProduct = (prodId, title, desc, imageUrl) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-server.firebaseio.com/products/${prodId}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                desc,
                imageUrl
            })
        });

        if(!response.ok) {
            throw new Error('Something went wrong!');
        };
        dispatch({
            type: EDIT_PRODUCT,
            prodId: prodId,
            title,
            desc,
            imageUrl
        });
    };
};