import { Text, View, StyleSheet, TextInput, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { useNotes } from "../../context/NoteContext";
import { NoteCardList } from "../../components/NoteCard";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { notes, deleteNote } = useNotes();

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) || 
      note.content.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [notes, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Search Notes</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={16} color="#666666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, content or tags..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <FontAwesome 
              name="times-circle" 
              size={16} 
              color="#666666" 
              style={styles.clearIcon}
              onPress={() => setSearchQuery("")}
            />
          )}
        </View>
      </View>
      
      <FlatList
        data={[{ id: 'content' }]}
        renderItem={() => (
          searchQuery.length === 0 ? (
            <View style={styles.recentSearches}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <View style={styles.recentItem}>
                <FontAwesome name="history" size={16} color="#666666" style={styles.recentIcon} />
                <Text style={styles.recentText}>Meeting notes</Text>
              </View>
              <View style={styles.recentItem}>
                <FontAwesome name="history" size={16} color="#666666" style={styles.recentIcon} />
                <Text style={styles.recentText}>Project ideas</Text>
              </View>
              <View style={styles.recentItem}>
                <FontAwesome name="history" size={16} color="#666666" style={styles.recentIcon} />
                <Text style={styles.recentText}>Shopping list</Text>
              </View>
            </View>
          ) : filteredNotes.length > 0 ? (
            <NoteCardList 
              notes={filteredNotes} 
              onDelete={deleteNote} 
            />
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="search" size={64} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>No search results</Text>
              <Text style={styles.emptyStateSubText}>
                Try searching for notes by title, content, or tags
              </Text>
            </View>
          )
        )}
        keyExtractor={item => item.id}
      />
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
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  clearIcon: {
    marginLeft: 10,
  },
  recentSearches: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  recentIcon: {
    marginRight: 12,
  },
  recentText: {
    fontSize: 16,
    color: "#333333",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
