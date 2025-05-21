import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import firebase from '../services/firebase';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const res = await firebase.get('/users.json');
      const users = res.data;
      let loggedInUser = null;

      for (let key in users) {
        if (
          users[key].email === email.trim() &&
          users[key].password === password.trim()
        ) {
          loggedInUser = users[key];
          break;
        }
      }

      if (loggedInUser) {
        alert('Login Successful', 'Welcome back!');
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Image
        source={require('../assets/login.png')}
        style={{ width: 150, height: 150, marginBottom: 15 }}
      />
      <View style={styles.card}>
        <Text style={styles.loginTitle}>Glad to see you again!</Text>
        <TextInput
          placeholder="Email"style={styles.loginInput} keyboardType="email-address" value={email}  onChangeText={setEmail} autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password" style={styles.passwordInput} secureTextEntry={!showPassword} value={password} onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
     <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>
            Don't have an account? <Text style={styles.signupText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#eaf4ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
  },

  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#0047ab',
    textAlign: 'center',
  },

  loginInput: {
    width: '100%',
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    padding: 15,
  },

  eyeIcon: {
    marginLeft: 10,
    fontSize: 22,
    color: '#666',
  },

  loginButton: {
    backgroundColor: '#0047ab',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  signupLink: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },

  signupText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
});

export default Login;
