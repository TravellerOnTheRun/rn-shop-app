import React from 'react';
import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as cartActions from '../../store/actions/cart';
import colors from '../../constants/colors';

const ProductDetailsScreen = props => {
    const dispatch = useDispatch();

    const productId = props.navigation.getParam('productId');

    const selectedProduct = useSelector(state =>
        state.products.availableProducts.find(product => product.id === productId)
    );

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
            <View style={styles.btnCont}>
                <Button
                    color={colors.primary}
                    title='Add To Cart'
                    onPress={() => dispatch(cartActions.addToCart(selectedProduct))}
                />
            </View>
            <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.desc}>{selectedProduct.desc}</Text>
        </ScrollView>
    );
};

export const screenOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productTitle')
    };
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    price: {
        fontSize: 30,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'radiant'
    },
    desc: {
        fontFamily: 'radiant',
        color: colors.dark,
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    },
    btnCont: {
        marginVertical: 10,
        alignItems: 'center'
    }
});

export default ProductDetailsScreen;