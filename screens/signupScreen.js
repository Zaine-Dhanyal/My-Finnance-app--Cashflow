import React, { useState } from 'react';
import { View,Text, TextInput, TouchableOpacity,ScrollView,Alert,StyleSheet,Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../services/firebase';

const SignUp = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const res = await firebase.get('/users.json');
      const users = res.data || {};

      for (let key in users) {
        if (users[key].email === email.trim()) {
          Alert.alert('Error', 'Email already registered');
          return;
        }
      }

      const newUser = { fullName, email, password };
      await firebase.post('/users.json', newUser);
      Alert.alert('Success', 'Account created successfully');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>  
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput placeholder="Full Name" style={styles.input} value={fullName} onChangeText={setFullName}
        />
        <TextInput placeholder="Email" style={styles.input} keyboardType="email-address"  autoCapitalize="none"value={email} onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput placeholder="Password" style={styles.passwordInput}secureTextEntry={!showPassword}value={password}onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput placeholder="Confirm Password" style={styles.passwordInput} secureTextEntry={!showConfirm} value={confirmPassword}onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons name={showConfirm ? 'eye-off' : 'eye'} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.loginText}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#dbeafe', // soft pastel blue
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
 
  card: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    padding: 17,
    color: '#0047ab',
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingRight: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
  },
  eyeIcon: {
    fontSize: 22,
    color: '#666',
  },
  button: {
    backgroundColor: '#0047ab',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  loginText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
});

export default SignUp;
