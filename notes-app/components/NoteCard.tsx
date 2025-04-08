import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Swipeable } from 'react-native-gesture-handler';
import { Note } from '../types/note';
import { useRouter } from "expo-router";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onPress?: (note: Note) => void;
}

export const NoteCard = ({ note, onDelete, onPress }: NoteCardProps) => {
  const router = useRouter();

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onDelete(note.id)}
      >
        <FontAwesome name="trash" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    );
  };

  const handleNotePress = () => {
    if (onPress) {
      onPress(note);
    } else {
      // Navigate to new-note screen in read mode
      router.push({
        pathname: '/new-note',
        params: { id: note.id, mode: 'read' }
      });
    }
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableRightOpen={() => onDelete(note.id)}
    >
      <TouchableOpacity 
        style={styles.noteItem}
        onPress={handleNotePress}
        activeOpacity={0.7}
      >
        <Text style={styles.noteTitle}>{note.title}</Text>
        <Text 
          style={styles.noteContent}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {note.content}
        </Text>
        <ScrollView 
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          style={styles.noteTags}
          contentContainerStyle={styles.noteTagsContent}
        >
          {note.tags.map((tag, index) => (
            <Text key={index} style={styles.noteTag}>#{tag}</Text>
          ))}
        </ScrollView>
        <Text style={styles.noteDate}>
          {new Date(note.updatedAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

export const NoteCardList = ({ 
  notes, 
  onDelete,
  onPress
}: {
  notes: Note[];
  onDelete: (id: string) => void;
  onPress?: (note: Note) => void;
}) => {
  if (notes.length === 0) {
    return (
      <View style={styles.emptyState}>
        <FontAwesome name="file-text-o" size={64} color="#CCCCCC" />
        <Text style={styles.emptyStateText}>No notes yet</Text>
        <Text style={styles.emptyStateSubText}>
          Create your first note by tapping the + button below
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.noteList}>
      {notes.map((note) => (
        <NoteCard 
          key={note.id} 
          note={note} 
          onDelete={onDelete}
          onPress={onPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  noteList: {
    padding: 16,
  },
  noteItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noteContent: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  noteTags: {
    flexDirection: "row",
    marginBottom: 4,
    height: 30, // Fixed height for the tags row
  },
  noteTagsContent: {
    alignItems: "center",
    paddingRight: 10, // Add some padding at the end for better scrolling
  },
  noteTag: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  noteDate: {
    fontSize: 12,
    color: "#999999",
    textAlign: "right",
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
