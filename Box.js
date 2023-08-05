import { View, Text, TouchableOpacity,Animated } from 'react-native';


export default function Box(props) {

   
    return (
        <TouchableOpacity
            onPress={() => {
                props.setCurrentNote({ ...props.currentNote, id: props.k })
                props.openExistingNote(props.k)
            }}
            style={props.styles.box}
            key={props.k}>
            <Text style={{ textAlign: "center", padding: 20 }}>
            {props.testo.length <= 50 ? props.testo:props.testo.slice(0,50) + "..."}
            </Text>
            <Text style={props.styles.boxFooter}>
                {new Date(props.k).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    )
};