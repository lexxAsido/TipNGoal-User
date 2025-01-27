import React, { useState, useEffect, useContext } from 'react';
import xml2js from 'react-native-xml2js';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, RefreshControl, Button, TouchableOpacity, } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../Components/Theme';
import { AppContext } from '../Components/globalVariables';
import * as Animatable from 'react-native-animatable';

export default function Feeds({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { preloader, setPreloader } = useContext(AppContext); 

  const extractImage = (htmlString) => {
    if (!htmlString) return null;
  
   
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = regex.exec(htmlString);
  
    if (match) {
      return match[1]; 
    }
    return null;
  };
  

  const fetchRSSFeed = async () => {
    const rssUrl = 'https://feeds.bbci.co.uk/sport/football/rss.xml';
    setPreloader(true);
    try {
      const response = await axios.get(rssUrl);
      const parseString = xml2js.parseString;
  
      parseString(response.data, (err, result) => {
        if (err) {
          console.error('Error parsing XML:', err);
        } else {
          const items = result?.rss?.channel?.[0]?.item || [];
          const processedItems = items.map((item) => {
            console.log('Raw Item:', item); 
          
            const imageUrl =
              extractImage(item.description?.[0]) || 
              item['media:thumbnail']?.[0]?.$?.url || 
              null;
          
            console.log('Image URL:', imageUrl); 
          
            return {
              title: item.title?.[0] || 'No title', 
              link: item.link?.[0] || '',
              image: imageUrl, 
              description: stripHtml(item.description?.[0] || ''), 
            };
          });
          
          
          setNews(processedItems);
        }
      });
    } catch (error) {
      console.error('Error fetching RSS feed:', error);
    } finally {
      setPreloader(false);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRSSFeed();
  }, []);

  const stripHtml = (html) => html.replace(/<\/?[^>]+(>|$)/g, '');


  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader}/>;
  }

  return (
    <View style={styles.container}>
    <Text style={{marginVertical:28, fontWeight:"bold", textAlign: 'center',backgroundColor: "#0cd44f" ,paddingVertical: 5,  fontSize: 24,}}>Sport News</Text>
    <FlatList
      data={news}
      refreshControl={
        <RefreshControl refreshing={preloader} onRefresh={fetchRSSFeed} />
      }
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : null}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

         <Animatable.View animation="pulse" iterationCount="infinite" >
          <TouchableOpacity  onPress={() => navigation.navigate('Web', { uri: item.link })}>
            <Text style={{ textAlign:"center", backgroundColor:"#0cd44f", padding:5, fontSize: 18, fontWeight: 'bold', marginVertical: 8, borderRadius: 8}}>Read More</Text>
          </TouchableOpacity>
         </Animatable.View>
        </View>
      )}
    />
  </View>
);
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: Theme.colors.lightGreen },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {marginBottom: 10,padding: 10,backgroundColor: "white",borderRadius: 8,elevation: 3,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 4,},
  image: { width: '100%', height: 200, borderRadius: 8 },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 5 },
  description: { fontSize: 14, color: '#555' },
});
