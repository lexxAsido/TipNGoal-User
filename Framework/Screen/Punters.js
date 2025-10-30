import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
import { XMLParser } from 'fast-xml-parser';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { Theme } from '../Components/Theme';
import { AppContext } from '../Components/globalVariables';
import { Button } from 'react-native-paper';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { ThemeContext } from '../Context/ThemeContext';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ✅ AdMob Banner ID — safely switches between dev & prod
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your real banner ID

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
const ITEMS_PER_PAGE = 10;

/* ----------------------------- Utility Functions ---------------------------- */
const stripHtml = (html) => html?.replace(/<\/?[^>]+(>|$)/g, '') || '';
const extractImage = (desc) => {
  const regex = /<img[^>]+src=['"]([^'">]+)['"]/;
  const match = regex.exec(desc);
  return match ? match[1] : null;
};
const interleaveAds = (items) => {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    result.push(items[i]);
    if ((i + 1) % 3 === 0) result.push({ type: 'ad', id: `ad-${i}` });
  }
  return result;
};

/* ------------------------------ Memoized Items ------------------------------ */
const FeedCard = memo(({ item, theme }) => {
  const handleLongPressText = async (text) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Text copied to clipboard.');
  };

  const handleLongPressImage = async (url) => {
    if (!url) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to your media library.');
        return;
      }

      const filename = url.split('/').pop().split('?')[0] || 'rss_image.jpg';
      const fileUri = FileSystem.documentDirectory + filename;

      const { uri } = await FileSystem.downloadAsync(url, fileUri);
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Downloads', asset, false);

      Alert.alert('✅ Saved', `Image saved to your gallery as ${filename}`);
    } catch (error) {
      console.error('Save failed:', error);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme === 'dark' ? '#2A2A2A' : '#fff',
          borderColor: theme === 'dark' ? '#444' : '#e0e0e0',
        },
      ]}
    >
      {item.punterName && (
        <TouchableOpacity onLongPress={() => handleLongPressText(item.punterName)}>
          <View style={styles.punterRow}>
            <Image
              source={require('../../assets/avatar.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text
              style={[
                styles.punterName,
                { color: Theme.colors.green },
              ]}
            >
              {item.punterName}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {item.image && (
        <View style={{ position: 'relative', marginBottom: 10 }}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            resizeMode="contain"
          />

          <TouchableOpacity
            onPress={() => handleLongPressImage(item.image)}
            style={[
              styles.downloadButton,
              {
                backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
                borderColor: theme === 'dark' ? '#444' : '#ccc',
              },
            ]}
          >
            <Ionicons
              name="download-outline"
              size={22}
              color={theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onLongPress={() => handleLongPressText(item.title)}>
        <Text
          style={[
            styles.title,
            { color: theme === 'dark' ? '#fff' : '#000' },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.pubDate,
          { color: theme === 'dark' ? '#bbb' : '#666' },
        ]}
      >
        {new Date(item.pubDate).toLocaleString()}
      </Text>

      <TouchableOpacity onLongPress={() => handleLongPressText(item.description)}>
        <Text
          style={[
            styles.description,
            { color: theme === 'dark' ? '#ddd' : '#333' },
          ]}
        >
          {item.description}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

/* ------------------------------ Banner Ad ------------------------------ */
const AdBanner = memo(() => (
  <View style={{ alignSelf: 'center', marginVertical: 10 }}>
    <BannerAd
      unitId={BANNER_ID}
      size={BannerAdSize.LARGE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      onAdFailedToLoad={(error) => console.log('Banner ad failed:', error)}
    />
  </View>
));

/* ----------------------------- Main Component ------------------------------- */
const rssFeeds = [
  { name: 'Moore Tips', url: 'https://rss.app/feeds/2YPP7rGLciEWaH7s.xml' },
  { name: 'Winning Mentality', url: 'https://rss.app/feeds/eJ4nwwO1iPrHpAJu.xml' },
  { name: 'Mr Bankstips', url: 'https://rss.app/feeds/QPKQ9nSJASBNPxui.xml' },
  { name: 'AfcSaks', url: 'https://rss.app/feeds/CxMLGgYNlepW3dpl.xml' },
  { name: 'Cindy Monel', url: 'https://rss.app/feeds/WPiXhuP0FF4wyl5g.xml' },
  { name: '39 Billion', url: 'https://rss.app/feeds/21VLutBroq098RuY.xml' },
  { name: 'Mista Felix', url: 'https://rss.app/feeds/IO6Lw4ZkY9py7JlM.xml' },
  { name: 'Jaredad', url: 'https://rss.app/feeds/6q7K3l4hlK5lVDdW.xml' },
];

const Punters = () => {
  const [allFeeds, setAllFeeds] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [noMoreFeeds, setNoMoreFeeds] = useState(false);
  const { preloader, setPreloader } = useContext(AppContext);
  const { theme } = useContext(ThemeContext);

  /* ------------------------- Fetch Feeds ------------------------- */
  const fetchFeeds = useCallback(async () => {
    setPreloader(true);
    setLoading(true);
    setPage(1);
    setNoMoreFeeds(false);
    setIsLoadingMore(false);

    try {
      const allItems = [];

      await Promise.all(
        rssFeeds.map(async (feedInfo) => {
          try {
            const response = await axios.get(feedInfo.url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ExpoApp/1.0; +https://tipngoal.com)',
                Accept: 'application/rss+xml, application/xml',
              },
            });

            const result = parser.parse(response.data);
            const items = result?.rss?.channel?.item || [];

            items.forEach((item) => {
              allItems.push({
                type: 'feed',
                punterName: feedInfo.name,
                title: item.title || 'No title',
                link: item.link || '',
                image:
                  extractImage(item.description) ||
                  item['media:content']?.url ||
                  item['media:thumbnail']?.url ||
                  null,
                description: stripHtml(item.description || ''),
                pubDate: item.pubDate || '',
              });
            });
          } catch (err) {
            console.warn(`❌ Failed to fetch: ${feedInfo.url}`, err.message);
          }
        })
      );

      allItems.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      setAllFeeds(allItems);
      setFeeds(interleaveAds(allItems.slice(0, ITEMS_PER_PAGE)));
    } catch (error) {
      console.error('Feed fetch error:', error);
    } finally {
      setPreloader(false);
      setLoading(false);
    }
  }, []);

  /* ------------------------- Load More ------------------------- */
  const loadMoreFeeds = useCallback(() => {
    if (isLoadingMore || noMoreFeeds) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;
    const end = nextPage * ITEMS_PER_PAGE;
    const newItems = allFeeds.slice(0, end);

    if (newItems.length === feeds.filter((f) => f.type === 'feed').length) {
      setNoMoreFeeds(true);
      setIsLoadingMore(false);
      return;
    }

    setPage(nextPage);
    setFeeds(interleaveAds(newItems));
    setIsLoadingMore(false);
  }, [isLoadingMore, noMoreFeeds, page, allFeeds, feeds]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const renderItem = useCallback(
    ({ item }) => (item.type === 'ad' ? <AdBanner /> : <FeedCard item={item} theme={theme} />),
    [theme]
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  if (loading) {
    return (
      <ActivityIndicator size="large" style={styles.loader} color={Theme.colors.green} />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#1E1E1E' : '#ffffff' }}>
      <Text
        style={[
          styles.headerText,
          { color: theme === 'dark' ? '#fff' : Theme.colors.black, borderBottomColor: Theme.colors.green },
        ]}
      >
        Punters
      </Text>

      <FlatList
        data={feeds}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={preloader} onRefresh={fetchFeeds} />}
        onEndReached={loadMoreFeeds}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 80 }}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={7}
        ListFooterComponent={() => {
          if (isLoadingMore)
            return (
              <ActivityIndicator
                size="small"
                color={Theme.colors.green}
                style={{ marginVertical: 16 }}
              />
            );

          if (noMoreFeeds)
            return (
              <View style={{ alignItems: 'center', marginVertical: 16 }}>
                <Text
                  style={{
                    color: theme === 'dark' ? '#ddd' : Theme.colors.black,
                    marginBottom: 8,
                  }}
                >
                  No more feeds. Pull to refresh or reload.
                </Text>
                <Button
                  mode="contained"
                  buttonColor={Theme.colors.green}
                  onPress={fetchFeeds}
                >
                  Reload
                </Button>
              </View>
            );

          return <View style={{ marginBottom: 80 }} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerText: {
    marginTop: 48,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
  },
  card: {
    margin: 10,
    padding: 18,
    borderRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 6,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  pubDate: { fontSize: 12, marginVertical: 4 },
  description: { fontSize: 14 },
  punterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  punterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  downloadButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: 6,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
  },
});

export default Punters;
