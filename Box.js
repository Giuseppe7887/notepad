import { Text, TouchableOpacity } from 'react-native';

export default function Box(props) {



    function ePari(x) {
        return x % 2 === 0;
    };


    return (
        <TouchableOpacity
            onLongPress={() =>props.deleteNote(props.k) }
            onPress={() => {
                props.setCurrentNote({ ...props.currentNote, id: props.k })
                props.openExistingNote(props.k)
            }}
            style={[props.styles.box, {
                marginLeft: ePari(props.index) ? "4%" : "2%",
                marginRight: ePari(props.index) ? "2%" : "4%",
            }]
            }
            key={props.k}>
            <Text style={{ textAlign: "center", padding: 20,color:props.colore}}>
                {props.testo.length <= 50 ? props.testo : props.testo.slice(0, 50) + "..."}
            </Text>
            <Text style={props.styles.boxFooter}>
                {new Date(props.data).toLocaleDateString()}
            </Text>
        
        </TouchableOpacity>
    )
};