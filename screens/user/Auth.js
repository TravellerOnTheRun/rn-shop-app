import React, { useEffect, useReducer, useCallback, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import colors from '../../constants/colors';
import { useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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

const AuthScreen = props => {
    //State
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    //Use Reducer
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => { 
        if(error) {
            Alert.alert('An error occurred!', error, [{text: 'Okay'}]);
        };
    }, [error]);

    const authHandler = async () => {

        let action;
        if (isSignup) {
            action =
                authActions.signup(
                    formState.inputValues.email,
                    formState.inputValues.password
                );
        } else {
            action =
                authActions.login(
                    formState.inputValues.email,
                    formState.inputValues.password
                );
        };
        setIsLoading(true);
        try {
            await dispatch(action);
            props.navigation.navigate('Shop');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        };
    };

    const inputChangeHandler = useCallback((inputId, inputValue, inputIsValid) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            inputIsValid,
            inputId
        });
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView
            behavior='padding'
            style={styles.screen}
            keyboardVerticalOffset={50}
        >
            <LinearGradient
                colors={[colors.dark, colors.lighter]}
                style={styles.gradient}
            >
                <Card style={styles.authCont}>
                    <ScrollView>
                        <Input
                            id='email'
                            label='E-mail'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize='none'
                            errorText="Please, enter a valid email address"
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <Input
                            id='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize='none'
                            errorText="Please, enter a valid password"
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <View style={styles.btnCont}>
                            {
                                isLoading
                                    ? <ActivityIndicator
                                        size='small'
                                        color={colors.birght}
                                    />
                                    : <Button
                                        title={isSignup ? 'Sign Up' : 'Login'}
                                        color={colors.primary}
                                        onPress={authHandler}
                                    />
                            }
                        </View>
                        <View style={styles.btnCont}>
                            <Button
                                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                color={colors.birght}
                                onPress={() => {
                                    setIsSignup(prevState => !prevState)
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authentication',
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    authCont: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    btnCont: {
        marginTop: 10
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default AuthScreen;