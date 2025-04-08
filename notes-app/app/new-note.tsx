import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useNotes } from '../context/NoteContext';

export default function NewNoteScreen() {
  const router = useRouter();
  const { addNote } = useNotes();
  const [isTagDialogVisible, setIsTagDialogVisible] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]); // Start with no tags

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const newTag = `#${tagInput}`;
      // Only add if it's not already in the list
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput(""); // Reset input
    }
  };

  const handleTimeTag = () => {
    const now = new Date();
    const dateString = now.toLocaleDateString(); // Get the current date
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Get the current time
    const formattedDateTime = `${dateString} ${timeString}`; // Combine date and time
    setTagInput(formattedDateTime.replace(/[/:]/g, '')); // Remove colons and forward slashes
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveNote = async () => {
    const noteData = {
      title: "New Note", // Placeholder title, you can replace it with a TextInput value
      content: "Note content goes here...", // Placeholder content, you can replace it with a TextInput value
      tags: tags,
    };
    await addNote(noteData);
    router.push('/'); // Navigate back to home after saving
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <FontAwesome name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <FontAwesome name="eye" size={24} color="#007AFF" />
          <FontAwesome name="trash" size={24} color="#007AFF" />
          <FontAwesome name="search" size={24} color="#007AFF" />
        </View>
      </View>
      
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Write your note here..."
        multiline
      />
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.tagList}>
          {tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>{tag}</Text>
          ))}
        </View>
        <TouchableOpacity onPress={() => setIsTagDialogVisible(true)}>
          <FontAwesome name="hashtag" size={24} color="#007AFF" />
        </TouchableOpacity>

        {/* Tag Dialog Modal */}
        <Modal
          visible={isTagDialogVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsTagDialogVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Tag</Text>
              
              <View style={styles.tagInputContainer}>
                <View style={styles.hashContainer}>
                  <Text style={styles.hashText}>#</Text>
                  <TextInput
                    style={styles.tagInput}
                    value={tagInput}
                    onChangeText={setTagInput}
                    autoFocus
                  />
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={handleTimeTag}>
                  <FontAwesome name="clock-o" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleAddTag}>
                  <FontAwesome name="plus" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.dialogTagList}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.dialogTagContainer}>
                    <Text style={styles.dialogTagText}>{tag}</Text>
                    <TouchableOpacity 
                      style={styles.removeTagButton}
                      onPress={() => handleRemoveTag(tag)}
                    >
                      <FontAwesome name="times" size={16} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsTagDialogVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  tagInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 0,
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
  dialogTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
    width: '100%',
  },
  dialogTagContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    padding: 8,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialogTagText: {
    marginRight: 8,
  },
  removeTagButton: {
    padding: 2,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  hashContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  hashText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    color: '#000',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 15,
  },
  titleInput: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  contentInput: {
    flex: 1,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  tagList: {
    flexDirection: "row",
  },
  tag: {
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    padding: 5,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
