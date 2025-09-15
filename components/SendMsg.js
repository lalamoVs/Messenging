import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { StyleSheet, TextInput, View } from 'react-native';
import { faFaceSmile, faHeart } from '@fortawesome/free-regular-svg-icons';
import { faMicrophone, faImages } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import axios from 'axios';
import socket from '../socket';

const Send = ({ConvID, Owner}) => {
    const [inputText, setInputText] = useState("");
    const handleSend = async () => {
        if (inputText.trim() === '') return;
        
        const messageData = {
            ConvID,
            Type: "Send",
            Sender: Owner,
            Message: inputText.trim(),
            Timestamp: new Date(),
        };
        try {
            const res = await axios.post(`http://192.168.0.7:5000/api/messages/${ConvID}`, messageData)
            const savedMessage = res.data; // Includes MessageID
            setInputText('');
            socket.send(JSON.stringify(savedMessage)); // Also send message with ID
        } catch (err) {
            console.error("Error sending message: ", err);
        }
    };
    return (
        <>
            <FontAwesomeIcon icon={faFaceSmile} style={{ color: '#ffffff', padding:10 }}/>
            <TextInput style={styles.input} placeholder="Type a message..." placeholderTextColor={"#fff"} 
            value={inputText} onChangeText={setInputText} onSubmitEditing={handleSend}/>
            <View style={{display:"flex", flexDirection:"row", gap:12}}>
                <FontAwesomeIcon icon={faMicrophone} style={{color: "#ffffff", padding:12}}/>
                <FontAwesomeIcon icon={faImages} style={{color: "#ffffff", padding:12}} />
                <FontAwesomeIcon icon={faHeart} style={{color: "#ffffff", padding:12}}/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    input:{
    height:45,
    borderWidth:1,
    color:"white",
    width:"61%",
    fontSize:19,
    padding:0,
    borderColor:"rgba(255, 255, 255, 0)"
  },
})

export default Send;