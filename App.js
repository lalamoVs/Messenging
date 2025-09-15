import Conversation from './page/conversation.js';
import Chatting from './page/chatting.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Conversation" component={Conversation} />
        <Stack.Screen name="Chat" component={Chatting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}