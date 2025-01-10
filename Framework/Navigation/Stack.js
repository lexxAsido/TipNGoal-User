
import { SignIn } from '../Screen/SignIn';
import { NavigationContainer } from '@react-navigation/native';
import { SignUp } from '../Screen/signUp';
import Intro from '../Screen/Intro';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../Screen/Profile';
import { ForgotPassword } from '../Screen/ForgotPassword';
import { HomeScreen } from '../Screen/HomeScreen';
import Football from '../Screen/Football';
import { EditProfile } from '../Screen/EditProfile';
import PostGames from '../Screen/PostGames';
import { Tipngoal } from '../Screen/TipNGoal';
import PostPicksForm from '../Screen/PostPicksForm';
import { Web } from '../Screen/Web';




const Stack = createNativeStackNavigator();


export function StackNavigator() {
    return (
        
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Intro">
                <Stack.Screen name="Intro" component={Intro} options={{headerShown:false}} />
                <Stack.Screen name="SignIn" component={SignIn} options={{headerShown:false}} />
                <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown:false, title:""}}/>
                <Stack.Screen name="Football" component={Football} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="EditProfile" component={EditProfile}  />
                <Stack.Screen name="PostGames" component={PostGames}  />
                <Stack.Screen name="Web" component={Web}  />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown:false,  title: "" }} />
                <Stack.Screen name="TipNGoal" component={Tipngoal} options={{headerShown:false,  title: "" }} />
                <Stack.Screen name="PostPicksForm" component={PostPicksForm} options={{headerShown:false,  title: "" }} />
               
            </Stack.Navigator>
        </NavigationContainer>
    );
}