import React, {Component} from 'react';
import {Modal, Portal, Provider, Button} from 'react-native-paper';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Type extends Component {
  render() {
    const {text, fee, date} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.textBottom}>
            {fee ? <Text style={styles.fee}>{fee}</Text> : null}
            {date ? <Text style={styles.date}>{date}</Text> : null}
          </View>
        </View>
        <Ionicons
          style={styles.icon}
          name="chevron-forward-outline"
          size={14}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 11,
    paddingTop: 15,
    paddingBottom: 17,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0.4,
    borderRadius: 3,
    borderColor: '#6789c2',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '92%',
  },

  text: {
    fontSize: 16,
    color: '#2e4875',
  },
  textBottom: {
    display: 'flex',
    flexDirection: 'row',
  },
  fee: {
    color: '#444444',
    marginTop: 5,
  },
  date: {
    marginLeft: 'auto',
    color: '#444444',
    marginTop: 5,
  },
  icon: {
    marginLeft: 'auto',
    paddingLeft: 10,
    alignSelf: 'center',
    color: '#002d75',
  },
});

export default Type;
