export const commonStyles = {
  button: {
    backgroundColor: '#00ffff',
    borderRadius: 15,
    width: "50%",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: '400',
    fontSize: 20, 
    margin: 10,
    color: 'white',
  },
  title: {
    fontWeight: "bold",
    fontSize: 30, 
    textAlign: 'center',
  },
  content: {
    fontWeight: '400',
    fontSize: 24,
  },
}

export const lightStyles = {
  container: {
    flex: 1,
    backgroundColor: "lavender",
  },
  text: {
    color: "black",
    fontSize: 22,
  },
  header: {
    backgroundColor: "purple",
    height: 100,
    shadowColor: "black",
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "cyan"
  },
  headerTint: "cyan"
};

export const darkStyles = {
  container: {
    flex: 1,
    backgroundColor: "#878683",
  },
  text: {
    color: "white",
  },
  header: {
    backgroundColor: "#444444",
    height: 100,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f4d4"
  },
  headerTint: "#f4d4"
}