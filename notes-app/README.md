# Notes App

A modern note-taking application built with React Native and Expo, featuring a clean and intuitive interface for managing your notes.

## Features

- **Create and Edit Notes**: Create new notes with titles, content, and tags
- **Rich Text Support**: Write notes with multiline support
- **Tag Management**: Add and organize notes with tags
- **Search Functionality**: Search notes by title, content, or tags
- **Tag Browsing**: View and filter notes by tags
- **Read/Edit Modes**: Comfortable reading mode with easy toggle to edit mode
- **Swipe Actions**: Swipe to delete notes
- **Local Storage**: All notes are stored locally on your device

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd notes-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## Usage

### Creating Notes
- Tap the '+' button to create a new note
- Add a title and content
- Add tags using the hashtag button
- Save your note

### Managing Notes
- View all notes on the home screen
- Search notes using the search tab
- Browse notes by tags in the hashtags tab
- Swipe left on a note to delete it

### Reading and Editing
- Tap any note to view it in read mode
- Use the edit button to switch to edit mode
- Make changes and save them

## Technical Details

Built with:
- React Native
- Expo
- React Navigation
- AsyncStorage for local data persistence
- TypeScript for type safety

## Project Structure

```
notes-app/
├── app/                   # Main application screens
│   ├── (tabs)/           # Tab-based navigation screens
│   └── new-note.tsx      # Note creation/editing screen
├── components/           # Reusable components
├── context/             # React Context for state management
├── types/               # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
