import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import socket from "../socket";
import axios from "axios";
const EditMenu = ({marginStyle, Owner, ConvID, msgId, onMessageDeleted}) => {
    const handleHide = async (msgId) => {
    const messageData = {
        ConvID,
        Type: "Delete",
        MessageID: msgId,
        Sender: Owner
    };
    try {
      await axios.put(`http://192.168.0.7:5000/api/messages/${ConvID}/${msgId}`);
       socket.send(JSON.stringify(messageData));
    //    setMessages((prev) => prev.filter((msg) => msg.MessageID !== msgId));
       if (onMessageDeleted) {
        onMessageDeleted(msgId);
      }

    } catch (err) {
      console.error("Error hiding message: ", err)
    }
  }
    const deleteAlert = () => {
        Alert.alert(
          "Delete Message",
          "Are you sure you want to delete this message?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            { text: "OK", onPress: () => handleHide(msgId) }
          ], {cancelable: true}
        );
    }

    return (
        <View style={[styles.popMenu, {marginLeft: marginStyle? 0:20, marginRight: marginStyle? 5:0}]}>
            <Pressable style={({pressed}) => ({backgroundColor:pressed? "#535353ff":"#323232ff"})}><Text style={styles.text}>Edit</Text></Pressable>
            <Pressable onPress={deleteAlert} style={({pressed}) => ({backgroundColor:pressed? "#535353ff":"#323232ff"})}><Text style={styles.text}>Delete</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    popMenu:{
      zIndex: 1000,
      width: 110,
      height: 100,
      backgroundColor: "#323232ff",
      borderRadius: 5,
   },
   text:{
    color: "white",
    padding:5,
    fontSize:15,
   }
})
export default EditMenu;