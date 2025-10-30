import React, { memo, useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../Components/Theme';
import { formatDate } from '../../utils/formatDate';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../Context/ThemeContext';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// ✅ AdMob IDs (auto switch between dev and prod)
const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your real banner ID

const { width } = Dimensions.get('window');

/* ----------------------------- Banner Ad Component ----------------------------- */
const AdBanner = memo(() => (
  <View style={styles.adContainer}>
    <BannerAd
      unitId={BANNER_ID}
      size={BannerAdSize.MEDIUM_RECTANGLE} // ✅ Taller banner
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      onAdFailedToLoad={(error) =>
        console.log('🧩 Banner failed to load:', error)
      }
    />
  </View>
));

/* ----------------------------- MAIN SCREEN ----------------------------- */
export default function ArticleDetails({ route, navigation }) {
  const { article } = route.params;
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  // 🧠 Dark/Light Mode Dynamic Styles
  const dynamicStyles = useMemo(
    () => ({
      backgroundColor: { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' },
      textPrimary: { color: isDark ? '#FFFFFF' : '#111111' },
      textSecondary: { color: isDark ? '#BBBBBB' : '#555555' },
      textMuted: { color: isDark ? '#999999' : '#888888' },
      noImageBg: { backgroundColor: isDark ? '#333333' : '#E0E0E0' },
    }),
    [isDark]
  );

  return (
    <ScrollView
      style={[styles.container, dynamicStyles.backgroundColor]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* 🔙 Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: isDark ? '#333' : '#ddd' },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome
            name="long-arrow-left"
            size={24}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
        <Text
          style={[styles.headerText, { color: isDark ? '#fff' : '#111' }]}
        >
          Gossip
        </Text>
      </View>

      {/* 🖼️ Image Section */}
      {article.imageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={[
              'transparent',
              isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)',
            ]}
            style={styles.gradient}
          />
          <Text style={styles.imageTitle}>{article.title}</Text>
        </View>
      ) : (
        <View style={[styles.noImageContainer, dynamicStyles.noImageBg]}>
          <Text style={[styles.noImageText, dynamicStyles.textSecondary]}>
            No image available
          </Text>
        </View>
      )}

      {/* 📰 Article Content */}
      <View style={styles.contentContainer}>
        {!article.imageUri && (
          <Text style={[styles.title, dynamicStyles.textPrimary]}>
            {article.title}
          </Text>
        )}

        <Text style={[styles.date, dynamicStyles.textMuted]}>
          {article.createdAt?.toDate
            ? formatDate(article.createdAt.toDate())
            : 'Unknown Date'}
        </Text>

        {/* 🟢 Top Banner Ad */}
        <AdBanner />

        <Text style={[styles.content, dynamicStyles.textPrimary]}>
          {article.content}
        </Text>

        {/* 🔙 Back Button */}
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: Theme.colors.green,
              shadowColor: isDark ? '#000' : '#999',
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>

        {/* 🟢 Bottom Banner Ad */}
        <AdBanner />
      </View>
    </ScrollView>
  );
}

/* ----------------------------- STYLES ----------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 44,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    height: 160,
    width: '100%',
  },
  imageTitle: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    color: '#fff',
    fontSize: 26,
    fontFamily: 'Montserrat_900Black',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  noImageContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    marginBottom: 15,
  },
  content: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'justify',
    fontFamily: 'Montserrat_500Medium',
  },
  backButton: {
    marginVertical: 44,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    borderRadius: 10,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
  adContainer: {
    alignSelf: 'center',
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
