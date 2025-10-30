import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
  memo,
} from 'react';
import xml2js from 'react-native-xml2js';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { Theme } from '../Components/Theme';
import { AppContext } from '../Components/globalVariables';
import { Button } from 'react-native-paper';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { ThemeContext } from '../Context/ThemeContext';

// ✅ Ad IDs — safe dev/production switching
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // 🔁 replace with real banner id

/* -------------------------- Utility Functions -------------------------- */
const extractImage = (htmlString) => {
  if (!htmlString) return null;
  const regex = /<img[^>]+src="([^">]+)"/;
  const match = regex.exec(htmlString);
  return match ? match[1] : null;
};

const stripHtml = (html) => html?.replace(/<\/?[^>]+(>|$)/g, '') || '';

// 🟢 Interleave banner ads every 6 feeds
const interleaveAds = (items, interval = 6) => {
  const newData = [];
  for (let i = 0; i < items.length; i++) {
    newData.push({ type: 'news', data: items[i] });
    if ((i + 1) % interval === 0) newData.push({ type: 'ad', id: `ad-${i}` });
  }
  return newData;
};

/* --------------------------- Memoized Components --------------------------- */
const NewsCard = memo(({ item, theme, navigation }) => {
  const isDark = theme === 'dark';
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#2A2A2A' : '#fff',
          borderColor: isDark ? '#444' : '#e0e0e0',
        },
      ]}
    >
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}

      <Text
        style={[
          styles.title,
          { color: isDark ? Theme.colors.light.bg : Theme.colors.black },
        ]}
      >
        {item.title}
      </Text>

      <Text
        style={[
          styles.description,
          { color: isDark ? '#ccc' : '#555' },
        ]}
      >
        {item.description}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate('Web', { uri: item.link })}
        style={styles.readMoreButton}
      >
        <Button
          icon="newspaper"
          mode="contained"
          buttonColor={Theme.colors.green}
          textColor="white"
        >
          Read More
        </Button>
      </TouchableOpacity>
    </View>
  );
});

const AdBanner = memo(() => {
  
  return (
    <View style={{ alignSelf: 'center', marginVertical: 10 }}>
      <BannerAd
        unitId={BANNER_ID}
        size={BannerAdSize.MEDIUM_RECTANGLE} // ✅ taller ad
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) => console.log('Ad failed to load:', error)}
      />
    </View>
  );
});

/* ----------------------------- Main Component ----------------------------- */
export default function Feeds({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { preloader, setPreloader } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  const rssUrls = useMemo(
    () => [
      'https://rss.app/feeds/L7T4JzOK5GCAwSid.xml',
      'https://rss.app/feeds/xI3Nw4OmzKkpwyLG.xml',
      'https://rss.app/feeds/27izjhvdD6GZwHqG.xml',
    ],
    []
  );

  /* -------------------------- Fetch News -------------------------- */
  const fetchRSSFeed = useCallback(async () => {
    setPreloader(true);
    try {
      const allItems = [];
      const parseString = xml2js.parseString;

      await Promise.all(
        rssUrls.map(async (url) => {
          const response = await axios.get(url);
          await new Promise((resolve, reject) => {
            parseString(response.data, (err, result) => {
              if (err) return reject(err);
              const items = result?.rss?.channel?.[0]?.item || [];
              const processedItems = items.map((item) => {
                const imageUrl =
                  extractImage(item.description?.[0]) ||
                  item['media:thumbnail']?.[0]?.$?.url ||
                  null;

                return {
                  title: item.title?.[0] || 'No title',
                  link: item.link?.[0] || '',
                  image: imageUrl,
                  description: stripHtml(item.description?.[0] || ''),
                  pubDate: item.pubDate?.[0] || '',
                };
              });
              allItems.push(...processedItems);
              resolve();
            });
          });
        })
      );

      const sortedItems = allItems.sort(
        (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
      );
      setNews(interleaveAds(sortedItems, 4)); // 🟢 insert banner after every 6 news
    } catch (error) {
      console.error('Error fetching RSS feeds:', error);
    } finally {
      setPreloader(false);
      setLoading(false);
    }
  }, [rssUrls, setPreloader]);

  /* -------------------------- Interstitial Ad Logic -------------------------- */
  
// useEffect(() => {
//   let adInterval;

//   // Load and show the interstitial ad
//   const loadAndShowAd = () => {
//     interstitial.load();
//     const unsubscribe = interstitial.addAdEventListener(
//       AdEventType.LOADED,
//       () => interstitial.show()
//     );
//     return unsubscribe;
//   };

//   // 🕐 Delay the first ad for 5 minutes (show after first 5 min)
//   const firstAdTimeout = setTimeout(() => {
//     const unsubscribe = loadAndShowAd();

//     // 🕓 Then show every 3 minutes thereafter
//     adInterval = setInterval(() => {
//       interstitial.load();
//     }, 5 * 60 * 1000);

//     // Cleanup for first load
//     return () => unsubscribe();
//   }, 3 * 60 * 1000); // first ad after 5 min

//   return () => {
//     clearTimeout(firstAdTimeout);
//     clearInterval(adInterval);
//   };
// }, []);


  /* -------------------------- Initial Fetch -------------------------- */
  useEffect(() => {
    fetchRSSFeed();
  }, [fetchRSSFeed]);

  /* -------------------------- Render -------------------------- */
  const renderItem = useCallback(
    ({ item }) =>
      item.type === 'ad' ? (
        <AdBanner />
      ) : (
        <NewsCard item={item.data} theme={theme} navigation={navigation} />
      ),
    [theme, navigation]
  );

  const keyExtractor = useCallback(
    (item, index) => item.id || index.toString(),
    []
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={Theme.colors.green}
        style={styles.loader}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : '#ffffff' },
      ]}
    >
      <Text
        style={[
          styles.headerText,
          { color: isDark ? Theme.colors.light.bg : Theme.colors.black },
        ]}
      >
        Headline News
      </Text>

      <FlatList
        data={news}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={preloader} onRefresh={fetchRSSFeed} />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

/* ----------------------------- Styles ----------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginTop: 48,
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 24,
  },
  card: {
    marginBottom: 20,
    padding: 18,
    borderRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
  },
  readMoreButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});
