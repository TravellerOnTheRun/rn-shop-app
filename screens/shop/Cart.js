import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/order';

import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';

import colors from '../../constants/colors';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].price,
                quantity: state.cart.items[key].quantity,
                total: state.cart.items[key].total,
            })
        };
        return transformedCartItems.sort((a, b) =>
            a.productId > b.productId ? 1 : -1
        );
    });

    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
        setIsLoading(false);
    }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.sumtxt}>
                    Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100 / 100)}</Text>
                </Text>
                {
                    isLoading ?
                        <ActivityIndicator size='small' color={colors.primary} />
                        : <Button
                            color={colors.primary}
                            title='Order Now'
                            disabled={cartItems.length === 0}
                            onPress={sendOrderHandler}
                        />
                }

            </Card>
            <FlatList
                data={cartItems}
                keyExtractor={item => item.productId}
                renderItem={itemData => (
                    <CartItem
                        qty={itemData.item.quantity}
                        title={itemData.item.productTitle}
                        amount={itemData.item.total}
                        deletable
                        onRemove={() => {
                            dispatch(cartActions.removeFromCart(itemData.item.productId))
                        }} />
                )} />
        </View>
    );
};

export const screenOptions = {
    headerTitle: 'Your Cart'
};

export default CartScreen;

const styles = StyleSheet.create({
    screen: {
        margin: 20,

    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },
    sumtxt: {
        fontFamily: 'radiant',
        fontSize: 18
    },
    amount: {
        color: colors.accent
    }
});