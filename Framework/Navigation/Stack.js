
import { SignIn } from '../Screen/auth/SignIn';
import { NavigationContainer } from '@react-navigation/native';
import { SignUp } from '../Screen/SignUp';
import Intro from '../Screen/Intro';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../Screen/Profile';
import { ForgotPassword } from '../Screen/ForgotPassword';
import { HomeScreen } from '../Screen/HomeScreen';
import Gossip from '../Screen/Gossips';
import { EditProfile } from '../Screen/EditProfile';
import PostGames from '../Screen/PostGames';
import { Tipngoal } from '../Screen/TipNGoal';
import PostPicksForm from '../Screen/PostPicksForm';
import { Web } from '../Screen/Web';
import Feeds from '../Screen/Feeds';
import Punters from '../Screen/Punters';
import Onboarding from '../Screen/auth/Onboarding';
import ArticleDetails from '../Screen/ArticleDetails';





const Stack = createNativeStackNavigator();


export function StackNavigator() {
    return (

        <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
                {/* <Stack.Screen name="Intro" component={Intro} options={{headerShown:false}} /> */}
                <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
                <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false, title: "" }} />
                <Stack.Screen name="Gossip" component={Gossip} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Feeds" component={Feeds} />
                <Stack.Screen name="Punters" component={Punters} />
                <Stack.Screen name="EditProfile" component={EditProfile} />
                <Stack.Screen name="PostGames" component={PostGames} />
                <Stack.Screen name="Web" component={Web} options={{ headerShown: true, title: "Blogs" }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false, title: "" }} />
                <Stack.Screen name="TipNGoal" component={Tipngoal} options={{ headerShown: false, title: "" }} />
                <Stack.Screen name="PostPicksForm" component={PostPicksForm} options={{ headerShown: false, title: "" }} />
                <Stack.Screen name="ArticleDetails" component={ArticleDetails} options={{ headerShown: false, title: "" }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}