import { StyleSheet, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AppContext } from '../Components/globalVariables';
import WebView from 'react-native-webview';


export function Web({ navigation, route }) {
    const { setPreloader } = useContext(AppContext);
    const { uri } = route.params;

    useEffect(() => {
        setPreloader(true)
    }, [])

    return (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <WebView source={{ uri }} onLoadEnd={() => setPreloader(false)} />
        </View>
    )
}