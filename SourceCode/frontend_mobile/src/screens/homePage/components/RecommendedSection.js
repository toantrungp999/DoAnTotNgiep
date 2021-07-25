import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, Dimensions} from 'react-native';
import ProductItem from './ProductItem';

class RecommendedSection extends Component {
  render() {
    const {products, title, navigation} = this.props;
    let productElements = products
      ? products.map((product, index) => {
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
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          {productElements}
        </ScrollView>
      </View>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eeeeee',
  },
  scrollView: {
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleSection: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    marginBottom: (windowWidth * 1.5) / 100,
    marginTop: (windowWidth * 3) / 100,
    marginLeft: '1.5%',
    marginRight: '1.5%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3694ff',
    paddingLeft: '2%',
    textTransform: 'uppercase',
    flexGrow: 1,
  },
});

export default RecommendedSection;
