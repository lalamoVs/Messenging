import {
   Pressable,
   StyleSheet,
   Text,
   View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import socket from "../socket";
import { useLayoutEffect } from "react";
import Send from "../components/SendMsg";
import Reaction from "../components/reaction";
import EditMenu from "../components/popMenu";
const formatDateTime = (isoString) => {
   const date = new Date(isoString);
   return date.toLocaleString("en-US", {
      weekday: "short", // "Mon", "Tue", etc.
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // AM/PM format
   });
};

const Chatting = ({ navigation, route }) => {
   const [message, setMessage] = useState([]);
   const { targetUser, ConvID, owner } = route.params;
   useLayoutEffect(() => {
      navigation.setOptions({ title: targetUser });
   }, [navigation, targetUser]);

   useEffect(() => {
      if (!ConvID) return;

      const handleMessage = (event) => {
         const newMessage = JSON.parse(event.data);

         if (newMessage.ConvID === ConvID) {
            if (newMessage.Type === "Delete") {
               // 🔁 Update the message's type in state
               setMessage((prev) =>
                  prev.map((msg) =>
                     msg.MessageID === newMessage.MessageID
                        ? { ...msg, Type: "Delete" }
                        : msg
                  )
               );
            } else {
               setMessage((prev) => [...prev, newMessage]);
            }
         }
      };
      socket.addEventListener("message", handleMessage);

      return () => {
         socket.removeEventListener("message", handleMessage);
      };
   }, [ConvID]); // Still depends on ConvID to use latest

   useEffect(() => {
      axios
         .get(`http://192.168.0.7:5000/api/messages/${ConvID}`)
         .then((res) => setMessage(res.data))
         .catch(console.error);
   }, [ConvID]);

   const handleDeleteMessage = (msgId) => {
    setMessage((prev) => prev.filter((msg) => msg.MessageID !== msgId));
  };

   const getDisplayTimes = (messages) => {
      let lastShownTime = null;

      return messages.map((message) => {
         const current = new Date(message.Timestamp).getTime();
         const show =
            !lastShownTime ||
            (current - lastShownTime >= 5 * 60 * 1000 &&
               message.Type !== "Delete");

         if (show) {
            lastShownTime = current;
         }

         return {
            ...message,
            show,
            showTime: show ? formatDateTime(message.Timestamp) : null,
            formattedTime: formatDateTime(message.Timestamp),
         };
      });
   };
   const updatedMessages = getDisplayTimes(message);
   const [menuVisible, setMenuVisible] = useState();
   const [checked, setChecked] = useState(false);
   const handleLongPress = (MessageID) => {
      setChecked((prev) => !prev);
      setMenuVisible((prev) => (prev === MessageID ? null : MessageID));
   };
   return (
      <LinearGradient
         colors={["#0A2472", "#0E6BA8", "#287FB6", "#A6E1FA"]}
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 1 }}
         style={[styles.message, { position: "relative", flex: 1 }]}
      >
         <View style={[styles.messagebody]}>
            <View style={{ zIndex: 4 }}>
               {updatedMessages.map((message, index) => {
                  const isOwner = owner === message.Sender;
                  const msgSend = message.Type === "Send";
                  const isActive = menuVisible === message.MessageID;
                  return (
                     <View key={index}>
                        {msgSend && (
                           <View>
                              <View style={styles.Time}>
                                 {message.show && (
                                    <Text
                                       style={{
                                          color: "white",
                                          marginBottom: 20,
                                       }}
                                    >
                                       {message.showTime}
                                    </Text>
                                 )}
                              </View>
                              <Pressable
                                 onLongPress={() => [
                                    handleLongPress(message.MessageID),
                                 ]}
                                 style={[
                                    styles.messages,
                                    isOwner && styles.Send,
                                    { Index: 1000 },
                                 ]}
                              >
                                 <View
                                    style={{
                                       display: "flex",
                                       flexDirection: "row",
                                       width: "fit-content",
                                       height: "auto",
                                       alignItems: "flex-end",
                                       gap: 6,
                                    }}
                                 >
                                    {!isOwner ? (
                                       <View style={[styles.Avatar]}></View>
                                    ) : (
                                       <View style={{ marginLeft: 1 }}></View>
                                    )}
                                    <View>
                                       <View style={[styles.messageContent]}>
                                          <Text
                                             style={{
                                                color: "white",
                                                fontSize: 15,
                                             }}
                                          >
                                             {message.Message}
                                          </Text>
                                       </View>
                                       <View style={[styles.reaction, {right:isOwner? 5:""}]}><Text style={{fontSize:12}}>😂</Text></View>
                                    </View>
                                 </View>
                              </Pressable>
                           </View>
                        )}
                        <View>
                  {isActive && (
                      <>
                        {checked && (
                            <Pressable
                              style={[
                                  StyleSheet.absoluteFillObject,
                                  {
                                    position: "absolute",
                                    width: 895,
                                    height: 1650,
                                    top: -836,
                                    left: -235,
                                    backgroundColor:
                                        "#0000004b",
                                    zIndex: 5,
                                    flex: 1,
                                  },
                              ]}
                              onPress={() =>
                                  handleLongPress(0)
                              }
                            />
                        )}

                        <View
                            style={{
                              justifyContent: "flex-end",
                              alignItems: isOwner
                              ? "flex-end"
                              : "flex-start",
                              width: "100%",
                              height: 110,
                              position:"absolute",
                              bottom:50,
                            }}
                        >
                          <Reaction emojis={["😂","👍", "🫠", "❤️", "🥲"]} marginStyle={isOwner}>

                          </Reaction>
                           <EditMenu marginStyle={isOwner} Owner={owner} ConvID={ConvID} msgId={message.MessageID} onMessageDeleted={handleDeleteMessage}></EditMenu>
                        </View>
                      </>
                  )}
                </View>
                     </View>
                     
                  );
               })}
               
            </View>
         </View>

         <View style={styles.feedback}>
            {/* <TextInput style={styles.input}/> */}
            <View style={styles.textBar}>
               <Send ConvID={ConvID} Owner={owner}></Send>
            </View>
         </View>
      </LinearGradient>
   );
};

const styles = StyleSheet.create({
   message: {
      display: "flex",
      flexDirection: "column",
   },
   reactionMenu:{
      zIndex: 20,
      marginBottom: 10,
      elevation: 5,
      width: 150,
      height: 30,
      backgroundColor: "#bfbfbfff",
      borderRadius: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
   },
   popMenu:{
      zIndex: 1000,
      width: 110,
      height: 100,
      backgroundColor: "#323232ff",
      borderRadius: 5,
   },
   reaction:{
      position:"absolute", 
      height:23, width:27, 
      borderRadius:5, 
      alignItems:"center", 
      justifyContent:"center", 
      backgroundColor:"#001C55", bottom:-21, 
      zIndex:20,
   },
   textBar: {
      width: "95%",
      height: 35,
      borderColor: "#fff",
      borderWidth: 1,
      borderRadius: 6,
      padding: 3,
      alignItems: "center",
      gap: 8,
      display: "flex",
      flexDirection: "row",
      paddingLeft: 6,
   },
   messagebody: {
      display: "flex",
      flexDirection: "column-reverse",
      position: "relative",
      height: "86%" /* 86% 52% */,
   },
   messages: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 6,
      paddingLeft: 8,
      marginBottom: 15,
   },
   Send: {
      display: "flex",
      flexDirection: "row-reverse",
   },
   Time: {
      display: "flex",
      alignItems: "center",
   },
   Avatar: {
      backgroundColor: "white",
      borderRadius: 40,
      width: 20,
      height: 20,
   },
   messageContent: {
      backgroundColor: "#001C55",
      padding: 4,
      paddingLeft: 8,
      marginRight: 5,
      paddingRight: 8,
      borderRadius: 5,
      zIndex: 10,
   },
   feedback: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
      paddingTop: 15,
      paddingLeft: 20,
      marginTop:12,
      backgroundColor: "#0a2472",
   },
});

export default Chatting;
