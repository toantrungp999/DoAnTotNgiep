import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

class MiddlePanel extends Component {
  render() {
    const {index} = this.props;
    let panel = null;
    if (index === 1) {
      panel = (
        <TouchableOpacity
          style={styles.panel}
          onPress={() => {
            this.props.navigate('black-color', 'a', 'Everything Black');
          }}>
          <Image
            style={styles.image}
            source={{
              uri:
                'https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033994/Poster/MiddlePanel_1_spzsxt.webp',
            }}
          />
          <View style={styles.textContainer1}>
            <Text style={styles.text1_1}>Everything black</Text>
            <Text style={styles.text1_2}>Thể hiện phong cách</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      panel = (
        <TouchableOpacity
          style={styles.panel}
          onPress={() => {
            this.props.navigate('sale-off', 'a', 'Siêu sale chào hè');
          }}>
          <Image
            style={styles.image}
            source={{
              uri:
                'https://res.cloudinary.com/websitebandienthoai/image/upload/v1624033994/Poster/MiddlePanel_2_p4i4ca.webp',
            }}
          />
          <View style={styles.textContainer2}>
            <Text style={styles.text2_1}>Mùa hè sôi động</Text>
            <Text style={styles.text2_2}>Giảm đến 50%</Text>
          </View>
        </TouchableOpacity>
      );
    }
    return <View style={styles.container}>{panel}</View>;
  }
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  panel: {
    width: (windowWidth * 97) / 100,
    height: (0.6 * windowWidth * 97) / 100,
    marginLeft: (windowWidth * 1.5) / 100,
    marginBottom: (windowWidth * 1.5) / 100,
    backgroundColor: '#ffffff',
    borderColor: '#A3C3FF',
    borderWidth: 1,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: (0.18 * windowWidth * 97) / 100,
    backgroundColor: 'rgba(0, 0, 0, 0.31)',
  },
  text1_1: {
    color: '#F4F4F4',
    fontSize: 30,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  text1_2: {
    color: '#F4F4F4',
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  textContainer2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: (0.2 * windowWidth * 97) / 100,
    backgroundColor: 'rgba(0, 0, 0, 0.31)',
  },
  text2_1: {
    color: '#90EFFE',
    fontSize: 18,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  text2_2: {
    color: '#90EFFF',
    fontSize: 35,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default MiddlePanel;
