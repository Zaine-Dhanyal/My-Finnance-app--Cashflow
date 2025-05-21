
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // --- Splash Screen Styles ---
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // pastel blue
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    width: 140, // increased from 100
    height: 140,
    marginBottom: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3F51B5',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: '#5C6BC0',
    marginBottom: 30,
  },
  loader: {
    marginTop: 20,
  },
  topCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    position: 'absolute',
    top: -40,
    left: -40,
  },
  bottomCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: -40,
    right: -40,
  },

});