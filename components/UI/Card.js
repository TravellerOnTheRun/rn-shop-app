import React from 'react';
import { View, StyleSheet } from 'react-native';

export default props => {
    return <View style={{...styles.main, ...props.style }}>{props.children}</View>
};


const styles = StyleSheet.create({
    main: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
    }
});