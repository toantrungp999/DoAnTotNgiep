import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductItem from './ProductItem';

class ProductSection extends Component {
  render() {
    const {products, title, navigation, path} = this.props;
    let _products = products.slice(0, 8);
    let productElements = _products
      ? _products.map((product, index) => {
          return (
            <ProductItem
              key={product._id}
              index={index}
              product={product}
              navigation={navigation}
            />
          );
        })
      : null;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigate(path, 'a', title);
          }}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            <MaterialIcons
              style={styles.rightIcon}
              name="chevron-right"
              size={20}
              color="#4274E0"
            />
          </View>
        </TouchableOpacity>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}>
          {productElements}
        </ScrollView>
      </View>
    );
  }
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eeeeee',
  },
  scrollView: {},
  content: {
    width: windowWidth,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleSection: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    marginBottom: (windowWidth * 1.5) / 100,
    marginTop: (windowWidth * 3) / 100,
    marginLeft: '1.5%',
    marginRight: '1.5%',
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3694ff',
    paddingLeft: '2%',
    textTransform: 'uppercase',
    flexGrow: 1,
  },
  rightIcon: {
    alignSelf: 'center',
    marginRight: 2,
  },
});

export default ProductSection;
