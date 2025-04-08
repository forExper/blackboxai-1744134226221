import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTags } from '../../context/TagContext';
import { useNotes } from '../../context/NoteContext';
import { useMemo } from 'react';
import { useRouter } from "expo-router";

// Function to generate a random color
const getRandomColor = () => {
  const colors = [
    '#007AFF', // Blue
    '#34C759', // Green
    '#FF9500', // Orange
    '#FF2D55', // Pink
    '#5856D6', // Purple
    '#FF3B30', // Red
    '#5AC8FA', // Light Blue
    '#FFCC00', // Yellow
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function HashTagsScreen() {
  const { tags: storedTags, deleteTag } = useTags();
  const { notes, getNotesByTag } = useNotes();
  const router = useRouter();

  // Extract unique tags from notes and count their occurrences
  const tagsFromNotes = useMemo(() => {
    const tagMap = new Map();
    
    notes.forEach(note => {
      note.tags.forEach(tagName => {
        if (tagMap.has(tagName)) {
          tagMap.set(tagName, tagMap.get(tagName) + 1);
        } else {
          tagMap.set(tagName, 1);
        }
      });
    });
    
    // Convert map to array of tag objects
    return Array.from(tagMap.entries()).map(([name, count]) => {
      // Try to find existing tag with same name to preserve color
      const existingTag = storedTags.find(t => t.name === name);
      return {
        id: existingTag?.id || `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        count,
        color: existingTag?.color || getRandomColor()
      };
    });
  }, [notes, storedTags]);

  // Handle tag click to navigate to filtered notes
  const handleTagPress = (tagName: string) => {
    // You could navigate to a filtered view of notes with this tag
    console.log(`Tag pressed: ${tagName}`);
    const filteredNotes = getNotesByTag(tagName);
    // For now, just log the number of notes with this tag
    console.log(`Found ${filteredNotes.length} notes with tag: ${tagName}`);
    
    // TODO: Navigate to a filtered view or show a modal with the notes
  };

  // Sort tags by count (most used first)
  const sortedTags = useMemo(() => {
    return [...tagsFromNotes].sort((a, b) => b.count - a.count);
  }, [tagsFromNotes]);

  // Get top 5 tags for the pinned section
  const topTags = useMemo(() => {
    return sortedTags.slice(0, 5);
  }, [sortedTags]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tags</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {topTags.length > 0 && (
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>Popular Tags</Text>
            <View style={styles.tagCloud}>
              {topTags.map((tag, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.tagBadge, { backgroundColor: tag.color }]}
                  onPress={() => handleTagPress(tag.name)}
                >
                  <FontAwesome name="hashtag" size={14} color="#FFFFFF" />
                  <Text style={styles.tagText}>{tag.name}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{tag.count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {sortedTags.length > 0 ? (
          <View style={styles.allTagsSection}>
            <Text style={styles.sectionTitle}>All Tags</Text>
            <View style={styles.tagList}>
              {sortedTags.map((tag, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.tagItem}
                  onPress={() => handleTagPress(tag.name)}
                >
                  <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                  <Text style={styles.tagItemText}>#{tag.name}</Text>
                  <Text style={styles.tagItemCount}>{tag.count} notes</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <FontAwesome name="tags" size={64} color="#CCCCCC" />
            <Text style={styles.emptyStateText}>No tags yet</Text>
            <Text style={styles.emptyStateSubText}>
              Tags will appear here when you add them to your notes
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  popularSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 16,
  },
  tagCloud: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
  },
  countBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  allTagsSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 16,
  },
  tagList: {
    marginTop: 8,
  },
  tagItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  tagDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  tagItemText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  tagItemCount: {
    fontSize: 14,
    color: "#999999",
    marginRight: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333333",
  },
  emptyStateSubText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 250,
  },
});
