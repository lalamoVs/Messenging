import { StyleSheet, View, Text } from "react-native";
const Reaction = ({emojis, marginStyle}) => {
    return (
        <View style={[styles.reactionMenu, {marginLeft: marginStyle? 0:20, marginRight: marginStyle? 5:0}]}>
            {emojis.map((emoji, index) => (
                <Text key={index}>{emoji}</Text>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    reactionMenu:{
      zIndex: 20,
      marginBottom: 10,
      elevation: 5,
      display: "flex",
      flexDirection: "row",
      gap: 5,
      justifyContent:"flex-start",
      alignContent:"space-between",
      width: 150,
      padding: 5,
      paddingLeft:10,
      height: 30,
      backgroundColor: "#ffffffff",
      borderRadius: 5,
      display: "flex",
      alignItems: "center",
   },
})

export default Reaction;