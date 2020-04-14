import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';

import { ProductsNavigator } from './ShopNavigator';

const AppNavigator = props => {
    const isAuth = useSelector(state => !!state.auth.token);

    return (
        <NavigationContainer>
            <ProductsNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;

