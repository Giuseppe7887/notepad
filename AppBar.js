import { View, TouchableOpacity } from "react-native"
import { Menu } from "react-native-paper";

// ICONS
import { MaterialIcons, Ionicons, AntDesign,FontAwesome } from '@expo/vector-icons';

import { useState } from "react";


const Selected = (x)=>{
    if(x)return <MaterialIcons name="done" size={20} color="black"  />
    return <MaterialIcons name="done" size={20} color="transparent" />
}

export default function AppBar({ styles, closeModal, addNote, currentNote, deleteNote, setText, text }) {

    let [menuVisible, setMenuVisible] =useState(false);

    return (
        <View style={styles.appBar}>
            <View style={styles.containerIcons}>
                <TouchableOpacity onPress={() => closeModal()} style={styles.icon0}>
                    <AntDesign name="close" size={30} color="black" />
                </TouchableOpacity>
                <View style={styles.icon1}>
                    <TouchableOpacity onPress={() => deleteNote(currentNote.id)}>
                        <Ionicons name="md-trash-bin-sharp" size={30} color="black" style={styles.icon} />
                    </TouchableOpacity>
                    <Menu
                        visible={menuVisible}
                        onDismiss={()=>setMenuVisible(false)}
                        anchor={<TouchableOpacity onPress={()=>setMenuVisible(!menuVisible)}><Ionicons name="color-fill" size={30} style={styles.icon} color={text.color}/></TouchableOpacity>}>
                        <Menu.Item onPress={() => {setText({...text,color:'black'}) }} title="Nero" leadingIcon={()=>Selected(text.color === "black")} trailingIcon={()=><FontAwesome name="circle" size={20} color="black" />} />
                        <Menu.Item onPress={() => { setText({...text,color:'blue'})}} title="Blu" leadingIcon={()=>Selected(text.color === "blue")} trailingIcon={()=><FontAwesome name="circle" size={20} color="blue" />} />
                        <Menu.Item onPress={() => {setText({...text,color:'green'}) }} title="Verde" leadingIcon={()=>Selected(text.color === "green")} trailingIcon={()=><FontAwesome  name="circle" size={20} color="green" />} />
                        <Menu.Item onPress={() => { setText({...text,color:'red'})}} title="Rosso" leadingIcon={()=>Selected(text.color === "red")} trailingIcon={()=><FontAwesome  name="circle" size={20} color="red" />} />
                    </Menu>
                    <TouchableOpacity onPress={() => addNote(currentNote.testo, currentNote.id)}>
                        <MaterialIcons name="done" size={30} color="black" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
