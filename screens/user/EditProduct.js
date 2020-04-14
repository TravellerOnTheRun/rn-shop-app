import React, { useEffect, useCallback, useReducer, useState } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Platform,
    Alert,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import * as productActions from '../../store/actions/products';

import HeaderBtn from '../../components/UI/HeaderBtn';
import Input from '../../components/UI/Input';
import colors from '../../constants/colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

//REDUCER
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.inputId]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.inputId]: action.inputIsValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        };
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    };
    return state;
};

const EditProduct = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    //CONFIG
    const dispatch = useDispatch();
    const prodId = props.navigation.getParam('prodId');

    const editedProduct = useSelector(state =>
        state.products.userProducts.find(prod => prod.id === prodId)
    );
    //REDUCER STATE
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.desc : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false
        },
        formIsValid: editedProduct ? true : false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'okay' }]);
        }
    }, [error]);

    //SUBMITION
    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong input!', 'Please, make sure you\'re giving a correct input', [
                { text: 'Okay' }
            ])
            return;
        };
        const {
            title, description, imageUrl, price
        } = formState.inputValues;

        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                console.log('in edit mode');
                console.log(`[title]: ${title}`);
                //in edit mode
                await dispatch(productActions.editProduct(
                    prodId,
                    title,
                    description,
                    imageUrl
                ));
            } else {
                //creating new
                await dispatch(productActions.createNewProduct(
                    title, description, imageUrl, +price)
                );
            };
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        };
        setIsLoading(false);
    }, [dispatch, prodId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    //TEXT CHANGER
    const inputChangeHandler = useCallback((inputId, inputValue, inputIsValid) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            inputIsValid,
            inputId
        });
    }, [dispatchFormState]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior='padding'
            keyboardVerticalOffset={100}
        >
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id='title'
                        label='Title'
                        errorText='Please, enter valid title!'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='imageUrl'
                        label='Image Url'
                        errorText='Please, enter valid image URL!'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {
                        editedProduct
                            ? null
                            : <Input
                                id='price'
                                label='Price'
                                errorText='Please, enter valid price!'
                                returnKeyType='next'
                                keyboardType='decimal-pad'
                                returnKeyType='next'
                                onInputChange={inputChangeHandler}
                                required
                                min={0.1}
                            />
                    }

                    <Input
                        id='description'
                        label='Description'
                        errorText='Please, enter valid description!'
                        multiline
                        autoCorrect
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.desc : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const screenOptions = navdata => {
    const submitFn = navdata.navigation.getParam('submit');
    return {
        headerTitle: navdata.navigation.getParam('productId')
            ? 'Edit Product'
            : 'Add Product',
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderBtn}>
                <Item
                    title='Save'
                    iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                    onPress={submitFn}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProduct;