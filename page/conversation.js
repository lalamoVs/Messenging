import { Pressable, TouchableOpacity , SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Modal from 'react-native-modal';
import { useEffect, useState } from 'react';
import { faBars, faLeftLong, faMagnifyingGlass, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import qs from 'qs';
import Adduser from '../components/AddUser';
import { width } from '@fortawesome/free-regular-svg-icons/faAddressBook';

const Conversation = ({navigation}) => {
    const owner = "UA1";
    const [conversation, setConversation] = useState([])
    const [listOfUsers, setListOfUsers] = useState([]);
    useEffect(() => {
        axios.get(`http://192.168.0.7:5000/api/convers/${owner}`)
        .then(response => {
        setConversation(response.data);
        })
        .catch(error => {
            console.error('Axios error:', error);
        });
        
    }, [])
    useEffect(() => {
        if (conversation.length === 0) return;
        const convers = conversation.map(c => 
          c.participant_1 === owner ? c.participant_2 : c.participant_1
        );
        
        axios.get('http://192.168.0.7:5000/api/users', {
            params: { UserID: convers },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat'})
        })
        .then(response => {
        setListOfUsers(response.data);
        })
        .catch(error => {
        console.error('Failed to fetch users:', error);
        });
    }, [conversation])
    const [menuVisible, setMenuVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const toggleAdd = () => {
        setAddVisible(!addVisible);
    };
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    }
    return (
    <>
    <View style={{backgroundColor: '#001C55', display:"flex", flexDirection:"column", position:"relative", flex:1}}>
        <Modal isVisible={menuVisible} backdropColor="#363636ff" onBackdropPress={() => {toggleMenu()}}>
            <View style={{justifyContent: "center", alignItems: "center"}}>
                <View style={{backgroundColor: "#202020ff", height: 200, width: "80%", borderRadius: 10, padding:8}}>
                    <Pressable style={({pressed}) => ({ backgroundColor: pressed ? "#174ab0ff" : "#202020ff"})}>
                        <View style={{alignItems:"center"}}><Text style={styles.text}>Profile</Text></View>
                    </Pressable>
                    <Pressable style={({pressed}) => ({ backgroundColor: pressed ? "#174ab0ff" : "#202020ff"})}>
                        <View style={{alignItems:"center"}}><Text style={styles.text}>Settings</Text></View>
                    </Pressable>
                    <Pressable style={({pressed}) => ({ backgroundColor: pressed ? "#174ab0ff" : "#202020ff"})}>
                        <View style={{alignItems:"center"}}><Text style={styles.text}>Change account</Text></View>
                    </Pressable>
                    <Pressable style={({pressed}) => ({ backgroundColor: pressed ? "#d60d09ff" : "#eb3734ff"})}>
                        <View style={{alignItems:"center"}}><Text style={styles.text}>Logout</Text></View>
                    </Pressable>
                </View>
            </View>
        </Modal>
        <Modal isVisible={addVisible} backdropColor="#363636ff" onBackdropPress={() => {toggleAdd()}}>
            <Adduser />
        </Modal>
        <View style={styles.Search}>
            <TouchableOpacity onPress={() => {toggleMenu()}}>
                <FontAwesomeIcon 
                    icon={faBars} 
                    style={{ color: "#ffffff", padding: 15 }} // note: padding should be a number, not string
                />
            </TouchableOpacity>
            <View style={{backgroundColor:"#ffffff43", borderWidth: 1, gap: 10,borderRadius: 6, width:"78%", height:33, display:"flex", padding:"10", flexDirection:"row", alignItems:"center"}}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#ffffff87",padding:"10"}} />
                <TextInput style={styles.SearchInput} placeholderTextColor={"#fff"} placeholder="Search"/>
            </View>
        </View>
        <View style={styles.Activity}>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Messages</Text>
            <Text style={[styles.text, {color:'gray', fontWeight:"400"}]}>Request</Text>
        </View>
        <ScrollView style={styles.ListOfUser}>
            {
                listOfUsers.map((user, i) => (
                <Pressable
                key={i}
                style={({ pressed }) => [
                    styles.Profile,
                    { backgroundColor: pressed ? "#3466ccff" : "#001C55" }
                ]}
                onPress={() => navigation.navigate("Chat", {ConvID: conversation[i].ConvID, owner: owner, targetUser: user.username})}
                >
                <View style={styles.Avatar} />

                <View style={{ flexDirection: "column" }}>
                    <Text style={[styles.userText, { fontWeight: "bold" }]}>
                    {user.username}
                    </Text>
                    <Text style={[styles.userText, { fontWeight: "300", color: "gray" }]}>
                    Hii
                    </Text>
                </View>
                </Pressable>
            ))
        }
        </ScrollView>
        <Pressable style={styles.Add} onPress={() => {toggleAdd()}}>
            <FontAwesomeIcon icon={faPenToSquare} style={{padding:14, color:"white"}}/>
        </Pressable>
        
    </View>
    
    </>
    );
}

const styles = StyleSheet.create({
    text:{
        color: "white",
        padding:8,
        fontSize:20,
    },
    Add:{
        width:60,
        height:60,
        borderRadius:15,
        backgroundColor:"#6f91d6ff",
        zIndex: 1,
        position:"absolute",
        bottom:10,
        // elevation: 5,
        right:10,
        justifyContent:"center",
        alignItems:"center",
    },
    SearchInput:{
        color: "#ffffffff",
        width:"100%",
        height:40,
        fontSize:16,
        padding:0,
    },
    Avatar:{
        borderRadius:50,
        width:"80",
        height:"80",
        backgroundColor:"white"
    },
    userText:{
        color: "white",
        display:"flex",
        flexDirection:"column",
        fontSize:18
    },
    Profile:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        gap:20,
        paddingTop:18,
        paddingLeft:8,
        paddingBottom:10
    },

  Search:{
    display: "flex",
    backgroundColor:"#000000",
    height:"70",
    gap: 10,
    flexDirection:"row",
    width:"100%",
    alignItems:"center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  Activity:{
    backgroundColor: "#00072D",
    height: "90",
    width:"100%"
  },
  ListOfUser: {
    flex: 1,
    display:"flex",
    flexDirection:"column",
    width:"100%",
    height:"50",
    overflowY:"auto"
  },
});

export default Conversation;
