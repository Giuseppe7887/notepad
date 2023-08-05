import { View, TouchableOpacity } from "react-native"

// ICONS
import { MaterialIcons, Ionicons, FontAwesome, AntDesign } from '@expo/vector-icons';


export default function AppBar({ styles, closeModal, addNote, currentNote,deleteNote}) {

    return (
        <View style={styles.appBar}>
            <View style={styles.containerIcons}>
                <TouchableOpacity onPress={() => closeModal()} style={styles.icon0}>
                    <AntDesign name="close" size={30} color="black" />
                </TouchableOpacity>
                <View style={styles.icon1}>
                    <TouchableOpacity onPress={()=>deleteNote(currentNote.id)}>
                    <Ionicons name="md-trash-bin-sharp" size={30} color="black" style={styles.icon} />
                    </TouchableOpacity>
                    <Ionicons name="color-fill-sharp" size={30} color="black" style={styles.icon} />
                    <FontAwesome name="font" size={30} color="black" style={styles.icon} />
                    <TouchableOpacity onPress={() => addNote(currentNote.testo, currentNote.id)}>
                        <MaterialIcons name="done" size={30} color="black" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
