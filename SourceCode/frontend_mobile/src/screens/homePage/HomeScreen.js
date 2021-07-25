import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import Poster from './components/Poster';
import MiddlePanel from './components/MiddlePanel';
import ProductSection from './components/ProductSection';
import RecommendedSection from './components/RecommendedSection';
import Drawer from 'react-native-drawer';
import GestureRecognizer from 'react-native-swipe-gestures';
import LeftMenu from '../../components/LeftMenu';
import {
  fectchProductHomepagesRequest,
  fectchRecommendedProductsRequest,
} from '../../../actions/productActions';
import {fectchCategoryGroupsWithCategoryRequest} from '../../../actions/categoryGroupActions';
import Loading from '../../components/Loading';

class HomeScreen extends Component {
  state = {open: false};

  componentDidMount() {
    this.props.fectchProducts();
    this.props.fectchCategoryGroupsWithCategory();
    this.props.fectchRecommendedProducts(
      this.props.userInfoReducer.userInfo
        ? this.props.userInfoReducer.userInfo._id
        : undefined,
      undefined,
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.userInfoReducer !== prevProps.userInfoReducer) {
      this.props.fectchRecommendedProducts(
        this.props.userInfoReducer.userInfo
          ? this.props.userInfoReducer.userInfo._id
          : undefined,
        undefined,
      );
    }
  }

  onSwipeLeft = state => {
    this.setState({open: false});
  };

  onSwipeRight = state => {
    this.setState({open: true});
  };

  navigate = (path, key, title) => {
    if (path === 'detail') {
      this.props.navigation.push('detailProductScreen', {_id: key, title});
    } else {
      this.props.navigation.push('productScreen', {path, key, title});
    }
  };

  render() {
    const {
      loading,
      message,
      productHomepages,
    } = this.props.productHomepagesReducer;
    const {recommendedProducts} = this.props.recommendedProductsReducer;

    if (loading)
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loading />
        </View>
      );
    else {
      var {
        hots,
        news,
        bestSellers,
        colorOptions,
        sizeOptions,
      } = productHomepages;
      const config = {};
      return (
        <GestureRecognizer
          onSwipeLeft={state => this.onSwipeLeft(state)}
          onSwipeRight={state => this.onSwipeRight(state)}
          config={config}
          style={{
            flex: 1,
          }}>
          <Drawer
            type="overlay"
            content={
              <LeftMenu
                navigate={this.navigate}
                categoryGroupsReducer={this.props.categoryGroupsReducer}
              />
            }
            tapToClose={false}
            openDrawerOffset={0.3} // 30% gap on the right side of drawer
            panCloseMask={0.2}
            styles={drawerStyles}
            open={this.state.open}>
            <ScrollView>
              <Poster navigate={this.navigate} />
              {recommendedProducts && (
                <RecommendedSection
                  products={recommendedProducts}
                  navigation={this.props.navigation}
                  title="Gợi ý"
                />
              )}
              <ProductSection
                products={news}
                navigation={this.props.navigation}
                sizeOptions={sizeOptions}
                colorOptions={colorOptions}
                title="Sản phẩm mới"
                description="Xu hướng thời trang dành cho bạn"
                navigate={this.navigate}
                path="new-product"
              />
              <MiddlePanel index={1} navigate={this.navigate} />
              <ProductSection
                products={hots}
                navigation={this.props.navigation}
                sizeOptions={sizeOptions}
                colorOptions={colorOptions}
                title="Sản phẩm mổi bật"
                description="Xu hướng thời trang dành cho bạn"
                navigate={this.navigate}
                path="hot-product"
              />
              <MiddlePanel index={2} navigate={this.navigate} />
              <ProductSection
                products={bestSellers}
                navigation={this.props.navigation}
                sizeOptions={sizeOptions}
                colorOptions={colorOptions}
                title="Sản phẩm bán chạy"
                description="Xu hướng thời trang dành cho bạn"
                navigate={this.navigate}
                path="best-seller"
              />
            </ScrollView>
          </Drawer>
        </GestureRecognizer>
      );
    }
  }
}
const drawerStyles = {
  drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
};

const mapStateToProps = state => {
  return {
    userInfoReducer: state.userInfoReducer,
    productHomepagesReducer: state.productHomepagesReducer,
    categoryGroupsReducer: state.categoryGroupsReducer,
    recommendedProductsReducer: state.recommendedProductsReducer,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fectchProducts: () => {
      dispatch(fectchProductHomepagesRequest());
    },
    fectchCategoryGroupsWithCategory: () => {
      dispatch(fectchCategoryGroupsWithCategoryRequest('true'));
    },
    fectchRecommendedProducts: (userId, productId) => {
      dispatch(fectchRecommendedProductsRequest(userId, productId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
