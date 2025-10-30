import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Theme } from '../Components/Theme';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { AppContext } from '../Components/globalVariables';
import { db } from '../Firebase/Settings';
import { ThemeContext } from '../Context/ThemeContext'; // ✅ Import ThemeContext

export default function PostArticleForm({ navigation }) {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [content, setContent] = useState('');
  const { setPreloader, userUID } = useContext(AppContext);
  const { theme } = useContext(ThemeContext); // ✅ Access current theme

  const isDark = theme === 'dark';
  const colors = {
    background: isDark ? '#1E1E1E' : Theme.colors.light.bg,
    text: isDark ? '#f5f5f5' : '#111',
    placeholder: isDark ? '#aaaaaa' : '#0d0e0d38',
    border: isDark ? '#333' : '#ccc',
    inputBg: isDark ? '#2A2A2A' : '#fff',
  };

  const handlePostArticle = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setPreloader(true);
    try {
      await addDoc(collection(db, 'articles'), {
        title,
        imageUri,
        content,
        userId: userUID,
        createdAt: Timestamp.fromDate(new Date()),
      });

      setPreloader(false);
      Alert.alert('Success', 'Article has been posted!');
      setTitle('');
      setImageUri('');
      setContent('');
    } catch (error) {
      console.error(error);
      setPreloader(false);
      Alert.alert('Error', 'Failed to post article.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1,  }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginTop: 40, marginHorizontal: 20, paddingBottom: 40 }}>
            <Text style={[styles.title, { color: colors.text }]}>Post an Article</Text>

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Article Title"
              placeholderTextColor={colors.placeholder}
              value={title}
              onChangeText={setTitle}
              returnKeyType="next"
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Image URL (optional)"
              placeholderTextColor={colors.placeholder}
              value={imageUri}
              onChangeText={setImageUri}
              returnKeyType="next"
            />

            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : null}

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text },
              ]}
              placeholder="Write your article content..."
              placeholderTextColor={colors.placeholder}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            <TouchableOpacity style={styles.button} onPress={handlePostArticle}>
              <Text style={styles.buttonText}>Post Article</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 20,
    borderBottomColor: Theme.colors.green,
    borderBottomWidth: 4,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 150,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1dbf73',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat_600SemiBold',
  },
});
