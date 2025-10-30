import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/Settings';
import { Theme } from '../Components/Theme';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { formatDate } from '../../utils/formatDate';
import { ThemeContext } from '../Context/ThemeContext';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const { width } = Dimensions.get('window');

// ✅ AdMob IDs (auto switch between dev and prod)
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your real banner ID

/* ----------------------------- Memoized Gossip Card ----------------------------- */
const GossipCard = memo(({ article, navigation }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const backgroundGradient = useMemo(
    () => ['transparent', isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)'],
    [isDark]
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ArticleDetails', { article })}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={
          article.imageUri
            ? { uri: article.imageUri }
            : require('../../assets/defaultImage.png')
        }
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 15 }}
      >
        <ExpoLinearGradient colors={backgroundGradient} style={styles.overlay} />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {article.title}
          </Text>
          <Text style={styles.snippet} numberOfLines={3}>
            {article.content}
          </Text>
          <Text style={styles.date}>
            {article.createdAt?.toDate
              ? formatDate(article.createdAt.toDate())
              : 'Unknown Date'}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
});

/* ----------------------------- Banner Ad Component ----------------------------- */
const AdBanner = memo(() => {
  return (
    <View style={{ alignSelf: 'center', marginVertical: 15 }}>
      <BannerAd
        unitId={BANNER_ID}
        // size={BannerAdSize.MEDIUM_RECTANGLE} 
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) => console.log('Banner failed to load:', error)}
      />
    </View>
  );
});

/* ----------------------------- Main Gossip Screen ----------------------------- */
export default function GossipScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // ✅ Fetch articles
  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedArticles = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(fetchedArticles);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Loader
  if (loading) {
    return (
      <View
        style={[
          styles.loaderContainer,
          { backgroundColor: isDark ? '#1E1E1E' : Theme.colors.light.bg },
        ]}
      >
        <ActivityIndicator size="large" color={Theme.colors.green} />
        <Text style={{ marginTop: 10, color: isDark ? '#bbb' : '#555' }}>
          Loading gossip...
        </Text>
      </View>
    );
  }

  // ✅ Render content
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : Theme.colors.light.bg },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.header,
          {
            color: isDark ? Theme.colors.light.bg : Theme.colors.black,
            borderBottomColor: Theme.colors.green,
            marginTop: 20,
          },
        ]}
      >
        Latest Gossip
      </Text>

      {/* 🟢 Top Banner Ad */}
      <AdBanner />

      {/* 📰 Gossip Feed */}
      {articles.length > 0 ? (
        articles.map((article) => (
          <GossipCard key={article.id} article={article} navigation={navigation} />
        ))
      ) : (
        <Text style={[styles.noArticles, { color: isDark ? '#aaa' : '#777' }]}>
          No gossip yet... Be the first to spill!
        </Text>
      )}

      {/* 🔻 Bottom Banner Ad */}
      <AdBanner />
    </ScrollView>
  );
}

/* ----------------------------- Styles ----------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    fontSize: 26,
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noArticles: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  imageBackground: {
    width: width - 30,
    height: 230,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  textContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  snippet: {
    fontSize: 15,
    color: '#ddd',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#ccc',
  },
});
