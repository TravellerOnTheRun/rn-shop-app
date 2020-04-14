import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';

import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ProductsOverviewScreen, { screenOptions as productsOverviewSO } from '../screens/shop/ProductsOverview';
import ProductDetailsScreen, { screenOptions as productDetailsSO } from '../screens/shop/ProductDetails';
import CartScreen, { screenOptions as cartSO } from '../screens/shop/Cart';
import OrdersScreen, { screenOptions as ordersSO } from '../screens/shop/Orders';
import UserProductsScreen, { screenOptions as userProductsSO } from '../screens/user/UserProducts';
import EditProductScreen, { screenOptions as editProductSO } from '../screens/user/EditProduct';
import AuthScreen from '../screens/user/Auth';
import StartupScreen from '../screens/Startup';

import colors from '../constants/colors';
import { useDispatch } from 'react-redux';

import { logout } from '../store/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android'
            ? colors.primary
            : ''
    },
    headerTitleStyle: {
        fontFamily: 'radiant'
    },
    headerBackTitleStyle: {
        fontFamily: 'radiant'
    },
    headerTintColor: Platform.OS === 'android'
        ? 'white'
        : colors.primary
};

//PRODUCTS STACK NAVIGATOR V5
const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
    return (
        <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <ProductsStackNavigator.Screen
                name='ProductsOverview'
                component={ProductsOverviewScreen}
                options={productsOverviewSO}
            />
            <ProductsStackNavigator.Screen
                name='ProductDetails'
                component={ProductDetailsScreen}
                options={productDetailsSO}
            />
            <ProductsStackNavigator.Screen
                name='Cart'
                component={CartScreen}
                options={cartSO}
            />
        </ProductsStackNavigator.Navigator>
    );
};

//OLD REACT-NAVIGATION PRODUCTS NAVIGATOR STACK V4 
// const ProductsNavigator = createStackNavigator({
//     ProductsOverview: ProductsOverviewScreen,
//     ProductDetails: ProductDetailsScreen,
//     Cart: CartScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         )
//     },
//     defaultNavigationOptions: defaultNavOptions
// });


//ORDERS STACK NAVIGATOR V5
const OrdersStackNavigator = createStackNavigator();

export const OrdersNavigator = () => {
    return (
        <OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <OrdersStackNavigator.Screen
                name='Orders'
                component={OrdersScreen}
                options={ordersSO}
            />
        </OrdersStackNavigator.Navigator>
    );
};

//OLD REACT-NAVIGATION ORDERS NAVIGATOR STACK V4
// const OrdersNavigator = createStackNavigator({
//     Orders: OrdersScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         )
//     },
//     defaultNavigationOptions: defaultNavOptions
// })

//ADMIN STACK NAVIGATOR V5
const AdminStacknavigator = createStackNavigator();

export const AdminNavigator = () => {
    return (
        <AdminStacknavigator.Navigator screenOptions={defaultNavOptions}>
            <AdminStacknavigator.Screen
                name='UserProducts'
                component={UserProductsScreen}
                options={userProductsSO}
            />
            <AdminStacknavigator.Screen
                name='EditProduct'
                component={EditProductScreen}
                options={editProductSO}
            />
        </AdminStacknavigator.Navigator>
    );
};

//OLD REACT-NAVIGATION ADMIN NAVIGATOR STACK V4
// const AdminNavigator = createStackNavigator({
//     UserProducts: UserProductsScreen,
//     EditProduct: EditProductScreen
// }, {
//     navigationOptions: {
//         drawerIcon: drawerConfig => (
//             <Ionicons
//                 name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
//                 size={23}
//                 color={drawerConfig.tintColor}
//             />
//         )
//     },
//     defaultNavigationOptions: defaultNavOptions
// })

const ShopDrawerNavigator = createDrawerNavigator();

const ShopNavigator = () => {
    const dispatch = useDispatch();
    return (
        <ShopDrawerNavigator.Navigator
            drawerContentOptions={{
                activeTintColor: colors.primary
            }}
            drawerContent={props => {
                return (
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <SafeAreaView
                            forceInset={{ top: 'always', horizontal: 'never' }}
                        >
                            <DrawerItemList {...props} />
                            <Button
                                title='Logout'
                                color={colors.primary}
                                onPress={() => {
                                    dispatch(logout());
                                    // props.navigation.navigate('Auth');
                                }}
                            />
                        </SafeAreaView>
                    </View>
                );
            }}
        >
            <ShopDrawerNavigator.Screen
                name='Products'
                component={ProductsNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name='Orders'
                component={OrdersNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
            <ShopDrawerNavigator.Screen
                name='Admin'
                component={AdminNavigator}
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                            size={23}
                            color={props.color}
                        />
                    )
                }}
            />
        </ShopDrawerNavigator.Navigator>
    );
};

//OLD REACT-NAVIGATION SHOP DRAWER NAVIGATOR V4
// const ShopNavigator = createDrawerNavigator({
//     Products: ProductsNavigator,
//     Orders: OrdersNavigator,
//     Admin: AdminNavigator
// }, {
//     contentOptions: {
//         activeTintColor: colors.primary
//     },
//     contentComponent: props => {
//         const dispatch = useDispatch();
//         return (
//             <View style={{ flex: 1, paddingTop: 20 }}>
//                 <SafeAreaView
//                     forceInset={{ top: 'always', horizontal: 'never' }}
//                 >
//                     <DrawerItems {...props} />
//                     <Button
//                         title='Logout'
//                         color={colors.primary}
//                         onPress={() => {
//                             dispatch(logout());
//                             // props.navigation.navigate('Auth');
//                         }}
//                     />
//                 </SafeAreaView>
//             </View>
//         );
//     }
// });


// const AuthNavigator = createStackNavigator({
//     Auth: AuthScreen
// }, {
//     defaultNavigationOptions: defaultNavOptions
// });


// const MainNavigator = createSwitchNavigator({
//     Startup: StartupScreen,
//     Auth: AuthNavigator,
//     Shop: ShopNavigator
// });

// export default createAppContainer(MainNavigator);