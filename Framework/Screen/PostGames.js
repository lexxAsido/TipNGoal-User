import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList, TouchableWithoutFeedback, ScrollView, SafeAreaView, } from 'react-native';
import { Theme } from '../Components/Theme';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../Firebase/Settings';
import { AppContext } from '../Components/globalVariables';
import PostPicksForm from './PostPicksForm';


export default function PostBetForm({ navigation }) {
    const [punterName, setPunterName] = useState('');
    const [betCodes, setBetCodes] = useState('');
    const [odds, setOdds] = useState('');
    const [betCompany, setBetCompany] = useState('');
    const [match, setMatch] = useState("");
    const [prediction, setPrediction] = useState("");
    const [LeagueName, setLeagueName] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const { setPreloader, userUID } = useContext(AppContext);

    const bookies = [
        { name: 'SportyBet', id: 1 },
        { name: 'BetKing', id: 2 },
        { name: 'Betano', id: 3 },
        { name: 'Football.com', id: 4 },
        { name: 'Stake', id: 5 },
        { name: 'Other', id: 6 },
    ];

    

    const handleGames = async () => {
        if (!punterName || !betCodes || !betCompany || !odds) {
            Alert.alert('Error', 'Please fill all the fields');
            return;
        }

        if (isNaN(odds)) {
            Alert.alert('Error', 'Odds must be a number');
            return;
        }

        setPreloader(true);

        try {
            await addDoc(collection(db, 'games'), {
                punterName,
                betCodes,
                odds,
                betCompany,
                userId: userUID,
                createdAt: Timestamp.fromDate(new Date()),
            });
            setPreloader(false);
            Alert.alert('Success', 'Your bet has been posted!');
            setPunterName('');
            setBetCodes('');
            setBetCompany('');
            setOdds('');
            navigation.navigate('TipNGoal');
        } catch (error) {
            console.error(error);
            setPreloader(false);
            Alert.alert('Error', 'Failed to post games.');
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor:Theme.colors.lightGreen }}>
       

            <View style={{marginTop:40, marginHorizontal:20}}>
                <Text style={styles.title}>Post Your Sure Games</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Punter Name"
                    placeholderTextColor="#0d0e0d38"
                    value={punterName}
                    onChangeText={setPunterName}
                    />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Bet Codes"
                    placeholderTextColor="#0d0e0d38"
                    value={betCodes}
                    onChangeText={setBetCodes}
                    />
                <TextInput
                    style={styles.input}
                    placeholder="Total Odds"
                    placeholderTextColor="#0d0e0d38"
                    value={odds}
                    onChangeText={setOdds}
                    keyboardType="numeric"
                    />
                <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setModalVisible(true)}
                    >
                    <Text style={styles.selectText}>
                        {betCompany || 'Select Bookie'}
                    </Text>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <FlatList
                                    data={bookies}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setBetCompany(item.name);
                                            setModalVisible(false);
                                        }}
                                        >
                                            <Text style={styles.modalText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <TouchableOpacity style={styles.button} onPress={handleGames}>
                    <Text style={styles.buttonText}>Post Games</Text>
                </TouchableOpacity>
            </View>

            <PostPicksForm />

                                   
        </ScrollView>
    );
}

// Styles remain unchanged

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        borderBottomColor: Theme.colors.green,
        borderBottomWidth: 4,
        textAlign:"center"
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',

    },
    selectInput: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    selectText: {
        color: '#0b0c0c',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign:"center",
        backgroundColor: '#1dbf73',
        paddingVertical:15,
        borderRadius:10
        
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1dbf7315',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        maxHeight: '50%',
    },
    modalItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalText: {
        fontSize: 18,
        color: '#333',
    },
});
