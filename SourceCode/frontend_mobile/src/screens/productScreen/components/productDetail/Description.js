import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {time_ago} from '../../../../../extentions/ArrayEx';

export default class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {brand} = this.props.brandReducer;
    if (!brand || brand._id !== this.props.product.brandId)
      if (this.props.product.brandId)
        this.props.fectchBrand(this.props.product.brandId);
  }

  render() {
    const {brand} = this.props.brandReducer;
    const brandName = brand ? brand.name : null;
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.title}>Hãng: </Text>
          <Text style={styles.content}>{brandName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Chất liệu: </Text>
          <Text style={styles.content}>{this.props.product.material}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Xuất xứ: </Text>
          <Text style={styles.content}>{this.props.product.orgin}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Mô tả sản phẩm: </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.content}>{this.props.product.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Ngày đăng: </Text>
          <Text style={styles.content}>
            {time_ago(this.props.product.date)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    paddingRight: 15,
  },
  title: {
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
});
