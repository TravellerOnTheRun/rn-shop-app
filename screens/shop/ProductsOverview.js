import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Platform,
    Button,
    ActivityIndicator,
    Text
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import HeaderBtn from '../../components/UI/HeaderBtn';

import colors from '../../constants/colors';

const ProductOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts())
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [setIsLoading, setError, dispatch]);

    useEffect(() => {
        const willFocusSubs = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSubs.remove();
        };
    }, [loadProducts])

    useEffect(() => {
        setIsLoading(true);
        loadProducts()
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetails', {
            productId: id,
            productTitle: title
        })
    };

    if (error) {
        return (
            <View style={styles.spinner}>
                <Text>{error}</Text>
                <Button
                    title='Try again'
                    onPress={loadProducts}
                    color={colors.primary}
                />
            </View>
        );
    };

    if (isLoading) {
        return <View style={styles.spinner}><ActivityIndicator size='large' color={colors.birght} /></View>
    };

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.spinner}>
                <Text>No products found! Reload the page or add something!</Text>
            </View>
        );
    };


    return <FlatList
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={products}
        // keyExtractor={}
        renderItem={itemData => (
            <ProductItem
                title={itemData.item.title}
                price={itemData.item.price}
                image={itemData.item.imageUrl}
                onSelect={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }}
            >
                <Button
                    color={colors.primary}
                    title='View Details'
                    onPress={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}
                />
                <Button
                    color={colors.primary}
                    title='To Cart'
                    onPress={() => dispatch(cartActions.addToCart(itemData.item))}
                />
            </ProductItem>
        )}
    />
};


const styles = StyleSheet.create({
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export const screenOptions = navdata => {
    return {
        headerTitle: 'All Products',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                <Item
                    title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navdata.navigation.navigate('Cart')
                    }}
                />
            </HeaderButtons>
        ),
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                <Item
                    title='Menu'
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navdata.navigation.toggleDrawer()
                    }}
                />
            </HeaderButtons>
        )
    }

};

export default ProductOverviewScreen;