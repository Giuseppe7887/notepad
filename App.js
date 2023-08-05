import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Alert, ScrollView, FlatList, Modal,BackHandler } from 'react-native';
import react, { useState, useEffect } from 'react';

// UTILS
import storage from '@react-native-async-storage/async-storage';
import uuid from 'uuid';

import { FAB, Portal, PaperProvider } from 'react-native-paper';

// COMPONETS
import AppBar from './AppBar.js';
import Box from './Box.js';

export default function App() {

  let [text, setText] = useState({
    size: 20,
    color: "black"
  });

  let [note, setNote] = useState([]);

  let [currentNote, setCurrentNote] = useState({ open: false, testo: "", id: "", isNew: false })

  const stileTesto = {
    color: text.color,
    fontSize: text.size
  };

  // FUNZIONI MODAL
  const closeModal = () => setCurrentNote({ ...currentNote, open: false })


  const openModal = () => {
    setCurrentNote({ ...currentNote, open: true, testo: "", isNew: true, id: 'false' })
  };


  // FUNZIONI NOTE

  async function deleteNote(id) {
    if (await storage.getItem(id)) {
      setCurrentNote({ ...currentNote, open: false });
      await storage.removeItem(id);
      updateNotes();
    }

  };

  async function updateNotes() {
    // await storage.clear()

    try {
      // await storage.setItem("note",JSON.stringify("ciaociao"))
      const allKeys = await storage.getAllKeys();
      const notes = await storage.multiGet(allKeys);

      setNote(notes);
      // await storage.clear()
    } catch (err) {
      console.log(err);
    }
  }

  async function addNote(testo, id) {
    if (testo === "") return deleteNote(id)
    if (currentNote.isNew) {
      const ID = new Date().toString();
      try {
        await storage.setItem(ID, testo);
        setCurrentNote({ ...currentNote, open: false, isNew: true });
        updateNotes()
      } catch (err) {
        Alert.alert("Errore", "Errore durante il salvataggio della nota, riprova")
      };
    } else {
      try {
        await storage.setItem(currentNote.id, testo);
        setCurrentNote({ ...currentNote, open: false, isNew: false });
        updateNotes()
      } catch (err) {
        Alert.alert("Errore", "Errore durante la modifica della nota, riprova")
      };
    };
  };

  async function openExistingNote(id) {
    const notaFound = await storage.getItem(id);
    setCurrentNote({ open: true, testo: notaFound, isNew: false, id: id });
  };

  useEffect(() => {
    updateNotes();

    BackHandler.addEventListener('hardwareBackPress',()=>{
      return
      // if(currentNote.open) setCurrentNote({...currentNote,open:false})
    })
  }, []);

  return (
    <PaperProvider>
      <View style={{backgroundColor:"#dedede",flex:1}}>
      <View style={{ width: "100%", height: 50, backgroundColor: "transparent" }}></View>
      <View style={styles.titoloWrapper}>
      <Text style={styles.titolo}>NOTE</Text>
      </View>
      {note.length ?<FlatList
        style={styles.main}
        numColumns={2}
        data={note}
        renderItem={({ item }) =><Box setCurrentNote={setCurrentNote} currentNote={currentNote} openExistingNote={openExistingNote} k={item[0]} testo={item[1]} styles={styles} />
        }
      />:
        <View style={{width:"100%",height:"80%",justifyContent:"center",alignItems:"center"}}>
          <Text style={{fontSize:20}}>Nulla da vedere qui..</Text>
          </View>
      }

      <StatusBar style='auto' />
      <FAB
        style={{ position: "absolute", bottom: 50, right: 35 }}
        onPress={() => openModal()}
        icon="plus"
      />
      <Modal
        visible={currentNote.open}
        animationType='slide'>
        <View style={styles.container}>
          <AppBar deleteNote={deleteNote} addNote={addNote} styles={styles} closeModal={closeModal} currentNote={currentNote} />
          <TextInput
          placeholder='scrivi qui il tuo testo..'
            multiline
            value={currentNote.testo.toString()}
            onChangeText={text => setCurrentNote({ ...currentNote, testo: text })}
            style={{ ...styles.textArea, ...stileTesto }}>
          </TextInput>
        </View>

      </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  titoloWrapper:{
    alignItems:"center",
    transform:"translateY(-20px)"
  },
  titolo:{
    fontSize:30
},
  main: {
    backgroundColor: "transparent"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    width: "100%",
    height: "100%",
    textAlignVertical: "top",
    padding: 20
  },
  appBar: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row"
  },
  icon0: {
    width: "20%",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  icon1: {
    width: "80%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  icon: {
    paddingRight: 20
  },
  containerIcons: {
    width: "100%",
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  box: {
    justifyContent:"center",
    alignItems:"center",
    margin: "2.5%",
    width: "45%",
    height: 170,
    backgroundColor: "white",
    borderRadius: 7,
    textAlign: "center"
  },
  boxFooter:{
    position:'absolute',
    bottom:5,
    color:'grey'
  }
});
