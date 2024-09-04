import React, {useState} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Trash from '../assets/frame.svg';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type Comment = {
  id: number;
  name: string;
  comment: string;
  time: string;
  replies: Comment[];
};

function Comments(): React.JSX.Element {
  const [name, setName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const getCurrentTime = (): string => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const validateInput = (text: string): boolean => {
    const maxLength = 20;
    const regex = /^[a-zA-Z0-9\s]*$/;
    return text.length <= maxLength && regex.test(text);
  };

  const handlePost = () => {
    if (name && comment) {
      const newComment: Comment = {
        id: Date.now(),
        name,
        comment,
        time: getCurrentTime(),
        replies: [],
      };

      if (replyingTo !== null) {
        const updatedComments = comments.map(c =>
          c.id === replyingTo ? {...c, replies: [...c.replies, newComment]} : c,
        );
        setComments(updatedComments);
      } else {
        setComments([...comments, newComment]);
      }

      setName('');
      setComment('');
      setReplyingTo(null);
    }
  };

  const handleEdit = (id: number) => {
    const findCommentOrReplyToEdit = (
      commentsList: Comment[],
    ): Comment | null => {
      for (let comment of commentsList) {
        if (comment.id === id) {
          return comment;
        }
        const nestedReply = findCommentOrReplyToEdit(comment.replies);
        if (nestedReply) {
          return nestedReply;
        }
      }
      return null;
    };

    const commentToEdit = findCommentOrReplyToEdit(comments);
    if (commentToEdit) {
      setComment(commentToEdit.comment);
      setEditingId(id);
    }
  };

  const handleSaveEdit = () => {
    if (editingId !== null) {
      const updatedComments = comments.map(c =>
        c.id === editingId ? {...c, comment, time: getCurrentTime()} : c,
      );
      setComments(updatedComments);
      setEditingId(null);
      setComment('');
    }
  };

  const handleDelete = (id: number) => {
    const deleteCommentOrReply = (commentsList: Comment[]): Comment[] => {
      return commentsList
        .map(comment => {
          if (comment.id === id) {
            return null;
          }

          const updatedReplies = deleteCommentOrReply(comment.replies);
          return {...comment, replies: updatedReplies};
        })
        .filter(comment => comment !== null) as Comment[];
    };

    const updatedComments = deleteCommentOrReply(comments);
    setComments(updatedComments);
  };

  const handleReply = (id: number) => {
    setReplyingTo(id);
  };

  const handleSort = () => {
    const sortedComments = [...comments].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
    setComments(sortedComments);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={[
            styles.commentSection,
            {borderColor: '#ccc', borderWidth: 1},
          ]}>
          <Text style={{color: 'black', fontSize: 16, fontWeight: '700'}}>
            Comment
          </Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor={'#b5b5b5'}
            value={name}
            onChangeText={text => validateInput(text) && setName(text)}
            style={[styles.input, {height: 40}]}
          />
          <TextInput
            placeholder="Comment"
            multiline={true}
            placeholderTextColor={'#b5b5b5'}
            value={comment}
            onChangeText={text => validateInput(text) && setComment(text)}
            style={[styles.input, {height: 50}]}
          />
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity onPress={handlePost} style={styles.postButton}>
              <Text style={styles.buttonText}>POST</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={handleSort}>
            <Text style={{color: 'black', fontWeight: '700'}}>
              Sort By: Date and Time
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={comments}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View>
              <View style={styles.replySection}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: 'black', fontWeight: '700'}}>
                    {item.name}
                  </Text>
                  <Text style={{color: 'black', fontWeight: '700'}}>
                    {item.time}
                  </Text>
                </View>
                <Text style={{color: 'black'}}>{item.comment}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleReply(item.id)}>
                    <Text style={styles.actionText}>Reply</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEdit(item.id)}
                    style={{paddingLeft: 20}}>
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      position: 'absolute',
                      left: windowWidth * 0.74,
                    }}>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Trash />
                    </TouchableOpacity>
                  </View>
                </View>
                {replyingTo === item.id || editingId === item.id ? (
                  <View style={styles.commentSection}>
                    <TextInput
                      placeholder="Name"
                      placeholderTextColor={'#b5b5b5'}
                      value={name}
                      onChangeText={text =>
                        validateInput(text) && setName(text)
                      }
                      editable={editingId === null}
                      style={[styles.input, {height: 40}]}
                    />
                    <TextInput
                      placeholder="Comment"
                      multiline={true}
                      placeholderTextColor={'#b5b5b5'}
                      value={comment}
                      onChangeText={text =>
                        validateInput(text) && setComment(text)
                      }
                      style={[styles.input, {height: 50}]}
                    />
                    <View style={{alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        onPress={
                          editingId !== null ? handleSaveEdit : handlePost
                        }
                        style={styles.postButton}>
                        <Text style={styles.buttonText}>
                          {editingId !== null ? 'SAVE' : 'POST'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </View>
              <FlatList
                data={item.replies}
                keyExtractor={reply => reply.id.toString()}
                renderItem={({item: reply}) => (
                  <View style={styles.reply}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={{color: 'black', fontWeight: '700'}}>
                        {reply.name}
                      </Text>
                      <Text style={{color: 'black', fontWeight: '700'}}>
                        {reply.time}
                      </Text>
                    </View>
                    <Text style={{color: 'black'}}>{reply.comment}</Text>
                    <View style={styles.actions}>
                      <TouchableOpacity onPress={() => handleEdit(reply.id)}>
                        <Text style={styles.actionText}>Edit</Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          alignItems: 'flex-end',
                          position: 'absolute',
                          left: windowWidth * 0.65,
                        }}>
                        <TouchableOpacity
                          onPress={() => handleDelete(reply.id)}>
                          <Trash />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {editingId === reply.id ? (
                      <View style={styles.commentSection}>
                        <TextInput
                          placeholder="Name"
                          placeholderTextColor={'#b5b5b5'}
                          value={name}
                          onChangeText={text =>
                            validateInput(text) && setName(text)
                          }
                          editable={editingId === null}
                          style={[styles.input, {height: 40}]}
                        />
                        <TextInput
                          placeholder="Comment"
                          multiline={true}
                          placeholderTextColor={'#b5b5b5'}
                          value={comment}
                          onChangeText={text =>
                            validateInput(text) && setComment(text)
                          }
                          style={[styles.input, {height: 50}]}
                        />
                        <View style={{alignItems: 'flex-end'}}>
                          <TouchableOpacity
                            onPress={
                              editingId !== null ? handleSaveEdit : handlePost
                            }
                            style={styles.postButton}>
                            <Text style={styles.buttonText}>
                              {editingId !== null ? 'SAVE' : 'POST'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null}
                  </View>
                )}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  commentSection: {
    marginBottom: 20,
    backgroundColor: '#E6F4FF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 4,
    borderRadius: 4,
  },
  input: {
    color: 'black',
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
    height: windowHeight * 0.04,
    width: windowWidth * 0.24,
    backgroundColor: '#4096FF',
    borderRadius: 4,
  },
  buttonText: {color: 'white', fontSize: 14, fontWeight: '700'},
  replySection: {
    width: windowWidth * 0.88,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#E6F4FF',
    margin: 4,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
  actionText: {
    color: '#4096FF',
    fontWeight: '700',
  },
  reply: {
    padding: 10,
    marginLeft: 40,
    marginTop: 5,
    backgroundColor: '#E6F4FF',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
  },
});

export default Comments;
