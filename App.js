import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ToastAndroid, Alert, FlatList, Modal } from 'react-native';
import  { useState, useEffect, useRef } from 'react';

// UTILS
import storage from '@react-native-async-storage/async-storage';
import uuid from 'uuid';
import { FAB, PaperProvider } from 'react-native-paper';

// COMPONETS
import AppBar from './AppBar.js';
import Box from './Box.js';

// ICONS
import { AntDesign } from '@expo/vector-icons';

export default function App() {

  let [text, setText] = useState({
    size: 20,
    color: "black"
  });

  let [note, setNote] = useState([]);

  let [currentNote, setCurrentNote] = useState({ open: false, testo: { testo: "", data: "", colore: "" }, id: "", isNew: false, color: 'black' })

  const stileTesto = {
    color: text.color,
    fontSize: text.size
  };

  function riordina(a,b) {
    const dateA = new Date(Object.values(a)[0].data);
    const dateB = new Date(Object.values(b)[0].data);
    return dateB - dateA;

  }
  // FUNZIONI MODAL
  const closeModal = () => {
    setCurrentNote({ open: false, color: "black", testo: { testo: "", data: "", colore: "" }, id: "", isNew: false });
    setText({ size: 20, color: "black" })
  }


  const openModal = () => {
    setCurrentNote({ ...currentNote, open: true, testo: "", isNew: true, id: '' });
    setText({ size: 20, color: 'black' })
  };

  // FUNZIONI NOTE

  async function deleteNote(id) {
    if(!id || id ==="") return

    async function del(){
      try {
        if (await storage.getItem(id)) {
          setCurrentNote({ ...currentNote, open: false });
          await storage.removeItem(id);
          updateNotes();
          setTimeout(() => {
            ToastAndroid.show("Nota eliminata", ToastAndroid.SHORT)
          }, 300);
        }
  
      } catch (err) {
        setTimeout(() => {
          ToastAndroid.show("Errore", ToastAndroid.SHORT)
        }, 300);
      }
    }
    Alert.alert(
      'Confermi?',
      'Confermi di voler eliminare la nota?',
      [
        {
          text:"Annulla"
        },
        {
          text:"Conferma",
          onPress:del
        }
      ]
    )
    


  };

  async function updateNotes() {

    try {
      const allKeys = await storage.getAllKeys();
      const notes = await storage.multiGet(allKeys);
      const objs = [];
      for (let i = 0; i < notes.length; i++) {
        objs.push(
          {
            [notes[i][0]]: JSON.parse(notes[i][1])
          }
        )
      }
      setNote(objs.sort(riordina));

    } catch (err) {
      console.log("update err:" + err);
    }
  }

  async function addNote(testo, id) {
    if (testo === "") return deleteNote(id);


    if (currentNote.isNew) {
      const ID = uuid();
      try {
        await storage.setItem(ID, JSON.stringify({ testo: testo, data: new Date(), color: text.color }).trim());
        setCurrentNote({ ...currentNote, isNew: true, open: false });
        updateNotes();
        setTimeout(() => {
          ToastAndroid.show("Nota aggiunta", ToastAndroid.SHORT)
        }, 300);
      } catch (err) {
        Alert.alert("Errore", "Errore durante il salvataggio della nota, riprova")
      };
    } else {
      try {

        await storage.setItem(currentNote.id, JSON.stringify({ testo: testo, data: new Date(), color: text.color }).trim());
        setCurrentNote({ ...currentNote, isNew: false, open: false });
        updateNotes()
      } catch (err) {
        Alert.alert("Errore", "Errore durante la modifica della nota, riprova")
      };
    };
  };

  async function openExistingNote(id) {
    const notaFound = await storage.getItem(id);
    let parsed = JSON.parse(notaFound);
    setCurrentNote({ open: true, testo: parsed.testo, isNew: false, id: id, color: parsed.color });
    setText({ size: 20, color: parsed.color })
  };

  useEffect(() => {    
    updateNotes();
  }, []);

  let inputRef = useRef();
  useEffect(() => {
    if (currentNote.open) {
      setTimeout(() => {
        inputRef.current.focus()

      }, 300);
    }
  }, [currentNote.open]);


  return (
    <PaperProvider >
      <View style={{ backgroundColor: "#dedede", flex: 1 }}>
        <View style={{ width: "100%", height: 50, backgroundColor: "transparent" }}></View>
        <View style={styles.titoloWrapper}>
          <Text style={styles.titolo}>NOTE</Text>
        </View>
        {note.length ?
          <FlatList
            style={styles.main}
            numColumns={2}
            data={note}
            renderItem={({ item, index }) => {
              return <Box colore={Object.values(item)[0].color} index={index} deleteNote={deleteNote} setCurrentNote={setCurrentNote} currentNote={currentNote} openExistingNote={openExistingNote} k={Object.keys(item)[0]} testo={Object.values(item)[0].testo} data={Object.values(item)[0].data} styles={styles} />
            }
            }
          /> :
          <View style={{ width: "100%", height: "80%", justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>Nulla da vedere qui..</Text>
          </View>
        }

        <StatusBar style='auto' />
        <FAB
          style={{ position: "absolute", bottom: 35, right: 25, borderRadius: 100, backgroundColor: "blue" }}
          onPress={() => openModal()}
          icon={() => <AntDesign name="plus" size={24} color="white" />}
          color='blue'
        />
        <Modal
          onRequestClose={closeModal}
          visible={currentNote.open}
          animationType='slide'>
          <PaperProvider>
            <View style={styles.container}>
              <AppBar setText={setText} text={text} deleteNote={deleteNote} addNote={addNote} styles={styles} closeModal={closeModal} currentNote={currentNote} />
              <TextInput
                ref={inputRef}
                placeholder='scrivi qui il tuo testo..'
                multiline
                value={currentNote.testo.toString()}
                onChangeText={text => setCurrentNote({ ...currentNote, testo: text })}
                style={{ ...styles.textArea, ...stileTesto, color: text.color }}>
              </TextInput>
            </View>
          </PaperProvider>

        </Modal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  titoloWrapper: {
    alignItems: "center",
    transform: "translateY(-20px)"
  },
  titolo: {
    fontSize: 30
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
    justifyContent: "center",
    alignItems: "center",
    width: "44%",
    height: 170,
    backgroundColor: "white",
    borderRadius: 7,
    textAlign: "center",
    marginBottom: 20
  },
  boxFooter: {
    position: 'absolute',
    bottom: 5,
    color: 'grey'
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 100,
    // position: 'absolute',
    // right: 10
  }
});
