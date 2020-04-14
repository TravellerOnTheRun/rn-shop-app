import React from 'react';
import { FlatList, Platform, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderBtn from '../../components/UI/HeaderBtn';
import ProductItem from '../../components/shop/ProductItem';

import * as productActions from '../../store/actions/products';

import colors from '../../constants/colors';

const UserProductsScreen = props => {
    const dispatch = useDispatch();
    const userProducts = useSelector(state => state.products.userProducts);

    const selectProductForEdit = id => {
        props.navigation.navigate('EditProduct', { prodId: id });
    };

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you want ot delete this item?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: () => {
                    dispatch(productActions.deleteProduct(id))
                }
            }
        ]);
    };

    return <FlatList
        data={userProducts}
        renderItem={itemData => (
            <ProductItem
                image={itemData.item.imageUrl}
                title={itemData.item.title}
                price={itemData.item.price}
                desc={itemData.item.desc}
                onSelect={() => {
                    selectProductForEdit(itemData.item.id)
                }}
            >
                <Button
                    color={colors.primary}
                    title='Edit'
                    onPress={() => {
                        selectProductForEdit(itemData.item.id)
                    }}
                />
                <Button
                    color={colors.primary}
                    title='Delete'
                    onPress={deleteHandler.bind(this, itemData.item.id)}
                />
            </ProductItem>
        )}
    />
};

export const screenOptions = navdata => {
    return {
        headerTitle: 'Your Products',
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
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                <Item
                    title='Add'
                    iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    onPress={() => {
                        navdata.navigation.navigate('EditProduct')
                    }}
                />
            </HeaderButtons>
        ),
    };
};

export default UserProductsScreen;