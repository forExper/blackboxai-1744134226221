import { Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNotes } from '../../context/NoteContext';
import { NoteCardList } from '../../components/NoteCard';

export default function HomeScreen() {
  const router = useRouter();
  const { notes, deleteNote } = useNotes();

  const navigateToNewNote = () => {
    router.push('/new-note'); // Navigate to the new note screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="sticky-note" size={32} color="#007AFF" />
        <Text style={styles.headerText}>My Notes</Text>
        <TouchableOpacity onPress={navigateToNewNote}>
          <FontAwesome name="plus-circle" size={25} color="#007AFF" style={styles.composeIcon} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={[{ id: 'content' }]}
        renderItem={() => (
          <NoteCardList 
            notes={notes} 
            onDelete={deleteNote} 
          />
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
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#333333",
    flex: 1,
  },
  composeIcon: {
    marginLeft: 12,
  },
});
