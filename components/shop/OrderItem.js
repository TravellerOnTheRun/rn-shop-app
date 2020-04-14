import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import CartItem from './CartItem';
import Card from '../UI/Card';

import colors from '../../constants/colors';

export default props => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.amount}>${props.amount.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button
                title={showDetails ? 'Hide Details' : 'See Details'}
                color={colors.primary}
                onPress={() => {
                    setShowDetails(prevState => !prevState);
                }} />
            {showDetails && (
                <View style={styles.detailItems}>
                    {props.items.map(item => (
                        <CartItem
                            key={item.productId}
                            qty={item.quantity}
                            amount={item.total}
                            title={item.productTitle}
                        />
                    ))}
                </View>)
            }
        </Card>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    amount: {
        fontFamily: 'radiant',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'radiant',
        color: '#888'
    },
    detailItems: {
        width: '100%'
    }
});