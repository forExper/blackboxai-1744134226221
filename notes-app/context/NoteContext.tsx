import React, { createContext, useContext, useState, useCallback } from 'react';
import { Note } from '../types/note';
import { saveNotes, getNotes } from '../utils/storage';

interface NoteContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getNotesByTag: (tag: string) => Note[];
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  // Initialize notes from storage
  React.useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const storedNotes = await getNotes();
    if (storedNotes) {
      setNotes(storedNotes);
    }
  };

  const addNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes, newNote];
      saveNotes(updatedNotes); // Save notes after updating state
      return updatedNotes;
    });
  }, []);

  const updateNote = useCallback(async (updatedNote: Note) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => 
        note.id === updatedNote.id 
          ? { ...updatedNote, updatedAt: new Date() }
          : note
      );
      saveNotes(updatedNotes); // Save notes after updating state
      return updatedNotes;
    });
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.filter(note => note.id !== id);
      saveNotes(updatedNotes); // Save notes after updating state
      return updatedNotes;
    });
  }, []);

  const getNotesByTag = useCallback((tag: string) => {
    return notes.filter(note => note.tags.includes(tag));
  }, [notes]);

  const value = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesByTag,
  };

  return (
    <NoteContext.Provider value={value}>
      {children}
    </NoteContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}
