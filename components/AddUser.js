import { StyleSheet, View, Text, TextInput } from "react-native";
import { useEffect, useState } from 'react';

const Adduser = () => {
    const [listOfUsers, setListOfUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <View style={{justifyContent: "center", alignItems: "center"}}>
            <View style={{backgroundColor: "#202020ff", marginBottom:20, height: 70, alignItems:"center", width: "80%",justifyContent:"flex-start", gap:12, display:"flex", flexDirection:"row", borderRadius: 10, padding:8}}>
                <View style={[styles.Avatar, {width:35, height: 35}]}></View>
                <View>
                    <Text style={{color:"white", fontSize:18, fontWeight:"500"}}>Parker</Text>
                    <Text style={{color:"gray", fontSize:14, fontWeight:"300"}}>@parker</Text>
                </View>
            </View>
            <View style={{backgroundColor: "#202020ff", height: 100, width: "80%", borderRadius: 10, padding:13}}>
                <TextInput placeholder='Search...' value={searchTerm} style={{backgroundColor:"#fff", width:"89%", height:33, fontSize:18, padding:0, paddingLeft: 8, borderRadius:5}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Avatar:{
        borderRadius:50,
        width:"80",
        height:"80",
        backgroundColor:"white"
    },
});

export default Adduser;