import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Theme } from './Theme';

export function AppBotton({ disabled, textStyle, onPress, children, style, textColor, buttonColor, icon }) {

    const styles = StyleSheet.create({
        btn: {
            // flex: 1,
            borderRadius: 30,
            backgroundColor: buttonColor || Theme.colors.black,
            padding: 12,
            
        },
    });
    return (
        <TouchableOpacity disabled={disabled} activeOpacity={0.7} onPress={onPress} style={[styles.btn, style]}>
            {icon}
            <Text style={{ color:Theme.colors.black, textAlign: "center", fontFamily: Theme.fonts.text900 }}>
                {children}
            </Text>
        </TouchableOpacity>
    )
}