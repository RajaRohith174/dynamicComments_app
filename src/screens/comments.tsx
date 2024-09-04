import React, {useState} from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function Comments(): React.JSX.Element {
  const [name, setName] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.commentSection}>
          <Text style={{color: 'black'}}>Comment</Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor={'#b5b5b5'}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Comment"
            multiline={true}
            placeholderTextColor={'#b5b5b5'}
            value={comment}
            onChangeText={setComment}
            style={[styles.input, {height: 60}]}
          />
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => {}} style={styles.postButton}>
              <Text style={styles.buttonText}>POST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#cecece',
  },
  commentSection: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  postButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight * 0.05,
    width: windowWidth * 0.24,
    backgroundColor: '#597ef7',
    borderRadius: 4,
  },
  buttonText: {color: 'white', fontSize: 14, fontWeight: 700},
});

export default Comments;
