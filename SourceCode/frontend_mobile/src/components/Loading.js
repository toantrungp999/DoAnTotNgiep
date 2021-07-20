import React from 'react'
import { StyleSheet,View } from 'react-native'
import { ActivityIndicator } from "react-native";

const Loading = (props) => <View style={styles.container}>
    <ActivityIndicator size="small" color="#5495ff" />
</View>

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:'100%',
        paddingTop:'80%'

    },
})

export default Loading
