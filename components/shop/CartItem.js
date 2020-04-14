import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default props => {
    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.qty}>{props.qty} </Text><Text style={styles.maintxt}>{props.title} </Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.maintxt}>${props.amount.toFixed(2)}</Text>
                {
                    props.deletable &&
                        <TouchableOpacity onPress={props.onRemove} style={styles.delBtn}>
                            <Ionicons
                                name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                                size={23}
                                color='red'
                            />
                        </TouchableOpacity>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    qty: {
        fontFamily: 'radiant',
        color: '#888',
        fontSize: 16
    },
    maintxt: {
        fontFamily: 'radiant',
        fontSize: 16
    },
    delBtn: {
        marginLeft: 20
    }
});