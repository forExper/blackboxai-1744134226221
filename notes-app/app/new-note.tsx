import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useNotes } from '../context/NoteContext';
import { Note } from '../types/note';

export default function NewNoteScreen() {
  const router = useRouter();
  const { addNote, updateNote, notes } = useNotes();
  const params = useLocalSearchParams();
  
  const [isReadMode, setIsReadMode] = useState(false);
  const [isTagDialogVisible, setIsTagDialogVisible] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]); // Start with no tags
  const [title, setTitle] = useState(""); // State for note title
  const [content, setContent] = useState(""); // State for note content
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  // Initialize note data from params if available
  useEffect(() => {
    if (params.id) {
      const noteId = params.id as string;
      const foundNote = notes.find(note => note.id === noteId);
      
      if (foundNote) {
        setCurrentNote(foundNote);
        setTitle(foundNote.title);
        setContent(foundNote.content);
        setTags(foundNote.tags);
        // Only set read mode if explicitly specified
        if (params.mode === 'read') {
          setIsReadMode(true);
        }
      }
    }
  }, [params.id, notes]); // Only re-run when id or notes change

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const newTag = tagInput.trim().startsWith('#') ? tagInput.trim() : `#${tagInput.trim()}`;
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

  const toggleEditMode = () => {
    setIsReadMode(!isReadMode);
  };

  const handleSaveNote = async () => {
    const noteData = {
      title: title,
      content: content,
      tags: tags,
    };
    
    if (currentNote) {
      // Update existing note
      await updateNote({
        ...currentNote,
        ...noteData,
      });
    } else {
      // Add new note
      await addNote(noteData);
    }
    
    router.push('/'); // Navigate back to home after saving
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <FontAwesome name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          {currentNote && (
            <TouchableOpacity onPress={toggleEditMode}>
              <FontAwesome 
                name={isReadMode ? "edit" : "eye"} 
                size={24} 
                color="#007AFF" 
              />
            </TouchableOpacity>
          )}
          <FontAwesome name="trash" size={24} color="#007AFF" />
          <FontAwesome name="search" size={24} color="#007AFF" />
        </View>
      </View>
      
      {isReadMode ? (
        <View style={styles.readModeContainer}>
          <Text style={styles.titleDisplay}>{title}</Text>
          <ScrollView style={styles.contentScrollView}>
            <Text style={styles.contentDisplay}>{content}</Text>
          </ScrollView>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.titleInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="Write your note here..."
            multiline
            value={content}
            onChangeText={setContent}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
            <Text style={styles.saveButtonText}>Save Note</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.footer}>
        {isReadMode ? (
          <ScrollView 
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.tagScrollView}
            contentContainerStyle={styles.tagScrollViewContent}
          >
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </ScrollView>
        ) : (
          <>
            <View style={styles.tagList}>
              {tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>{tag}</Text>
              ))}
            </View>
            <TouchableOpacity onPress={() => setIsTagDialogVisible(true)}>
              <FontAwesome name="hashtag" size={24} color="#007AFF" />
            </TouchableOpacity>
          </>
        )}

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
  readModeContainer: {
    flex: 1,
    marginBottom: 16,
  },
  contentScrollView: {
    flex: 1,
  },
  tagScrollView: {
    flexDirection: "row",
    maxHeight: 40,
    width: "100%",
  },
  tagScrollViewContent: {
    alignItems: "center",
    paddingRight: 10,
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
  titleDisplay: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  contentDisplay: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
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
    flexWrap: "wrap",
    flex: 1,
  },
  tag: {
    backgroundColor: "#E0E0E0",
    borderRadius: 15,
    padding: 5,
    marginRight: 5,
    marginBottom: 5,
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
