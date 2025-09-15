import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { ContentBlock } from '../../src/lib/db/schema';
import { useTheme } from '../contexts/ThemeContext';

const ContentScreen: React.FC = () => {
  const [contentBlock, setContentBlock] = useState<ContentBlock | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Assuming the web app is running on localhost:3000
        const response = await fetch('http://localhost:3000/api/content');
        const data = await response.json();
        setContentBlock(data.sample);
      } catch (error) {
        console.error('Failed to fetch content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, theme === 'dark' ? darkStyles.container : lightStyles.container]}>
        <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#000'} />
      </View>
    );
  }

  if (!contentBlock) {
    return (
      <View style={[styles.container, theme === 'dark' ? darkStyles.container : lightStyles.container]}>
        <Text style={theme === 'dark' ? { color: '#fff' } : { color: '#000' }}>No content found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, theme === 'dark' ? darkStyles.container : lightStyles.container]}>
      <Text style={[styles.title, theme === 'dark' ? { color: '#fff' } : { color: '#000' }]}>Content Block</Text>
      <View style={[styles.card, theme === 'dark' ? darkStyles.card : lightStyles.card]}>
        <Text style={[styles.cardTitle, theme === 'dark' ? { color: '#fff' } : { color: '#000' }]}>{contentBlock.type}</Text>
        <Text style={[styles.cardText, theme === 'dark' ? { color: '#fff' } : { color: '#000' }]}>Locale: {contentBlock.locale}</Text>
        <Text style={[styles.cardText, theme === 'dark' ? { color: '#fff' } : { color: '#000' }]}>Version: {contentBlock.version}</Text>
        <Text style={[styles.cardContent, theme === 'dark' ? { color: '#fff' } : { color: '#000' }]}>
          {JSON.stringify(contentBlock.content, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    marginBottom: 3,
  },
  cardContent: {
    marginTop: 10,
    fontFamily: 'monospace',
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderColor: '#ccc',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#212529',
  },
  card: {
    backgroundColor: '#343a40',
    borderColor: '#555',
  },
});

export default ContentScreen;
