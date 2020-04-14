import React, { useEffect, useState } from 'react';
import { FlatList, Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderBtn from '../../components/UI/HeaderBtn';
import OrderItem from '../../components//shop/OrderItem';

import * as orderActions from '../../store/actions/order';
import colors from '../../constants/colors';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.orders);

    useEffect(() => {
        setIsLoading(true);
        dispatch(orderActions.fetchOrders())
            .then(res => setIsLoading(false))
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, [dispatch]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={colors.primary} />
            </View>
        );
    };

    return <FlatList
        data={orders}
        renderItem={itemData => <OrderItem
            amount={itemData.item.totalAmount}
            date={itemData.item.readableDate}
            items={itemData.item.items}
        />}
    />
};

export const screenOptions = navdata => {
    return {
        headerTitle: 'Orders',
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


const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;

