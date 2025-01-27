import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AppContext } from '../Components/globalVariables';
import WebView from 'react-native-webview';


export function Web({ navigation, route }) {
    const { setPreloader } = useContext(AppContext);
    const { uri } = route.params;
  
    const isValidUri = typeof uri === 'string' && uri.startsWith('http');
  
    useEffect(() => {
      setPreloader(true);
      return () => setPreloader(false);
    }, []);
  
    if (!isValidUri) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>Invalid URL</Text>
        </View>
      );
    }
  
    return (
      <View style={{ flex: 1, width: '100%', height: '100%' }}>
        <WebView source={{ uri }} onLoadEnd={() => setPreloader(false)} />
      </View>
    );
  }