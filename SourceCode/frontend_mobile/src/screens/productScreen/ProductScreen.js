import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import ProductItem from '../homePage/components/ProductItem';
import LoadingMore from '../../components/LoadingMore';
import LeftMenu from '../../components/LeftMenu';
import RightMenu from './components/menu/RightMenu';
import GestureRecognizer from 'react-native-swipe-gestures';
import Drawer from 'react-native-drawer';
import Loading from '../../components/Loading';

import {fectchProductsRequest} from '../../../actions/productActions';

class ProductScreen extends Component {
  state = {
    min: 0,
    max: 2000000,
    option: 1,
    leftMenu: false,
    rightMenu: false,
  };
  intervalId = 0;

  componentDidMount() {
    const {min, max, option} = this.state;
    const page = 1;
    const {path, key} = this.props.route.params;
    this.props.fectchProducts(path, key, min, max, option, page);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.productsReducer.searchInfo !==
      prevProps.productsReducer.searchInfo
    ) {
      const searchInfo = this.props.productsReducer.searchInfo;
      if (searchInfo && searchInfo !== '') {
        this.props.navigation.setOptions({
          title: searchInfo.categoryGroupName
            ? searchInfo.categoryGroupName.name
            : searchInfo.categoryName.name,
        });
      }
    }
  }

  isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
    return (
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20
    );
  }

  viewMore = () => {
    const {viewMoreloading, pagingInfo} = this.props.productsReducer;
    const {min, max, option} = this.state;
    const {path, key} = this.props.route.params;
    const page = pagingInfo.currentPage + 1;
    if (
      !viewMoreloading &&
      pagingInfo &&
      pagingInfo.currentPage < pagingInfo.totalPage
    ) {
      this.props.fectchProducts(path, key, min, max, option, page);
    }
  };

  changeFilter = (min, max, option) => {
    this.state.min = min;
    this.state.max = max;
    this.state.option = option;
    this.state.rightMenu = false;
    const {path, key} = this.props.route.params;
    const page = 1;
    this.props.fectchProducts(path, key, min, max, option, page);
  };

  onSwipeLeft = state => {
    if (this.state.leftMenu) this.setState({leftMenu: false});
    else this.setState({rightMenu: true});
  };

  onSwipeRight = state => {
    if (this.state.rightMenu) this.setState({rightMenu: false});
    else this.setState({leftMenu: true});
  };

  navigate = (path, key, title) => {
    this.props.navigation.setParams({path, key, title});
    this.state.min = 0;
    this.state.max = 2000000;
    this.state.option = 1;
    this.state.leftMenu = false;
    this.props.fectchProducts(path, key, 1, 2000000, 1, 1);
  };

  render() {
    const {
      loading,
      viewMoreloading,
      products
    } = this.props.productsReducer;
    if (loading) return <Loading />;
    let productElements =
      products && products.length > 0 ? (
        products.map((product, index) => {
          return (
            <ProductItem
              key={product._id}
              index={index}
              product={product}
              navigation={this.props.navigation}
            />
          );
        })
      ) : (
        <Text>Không tìm thấy sản phẩm</Text>
      );
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
      <GestureRecognizer
        onSwipeLeft={state => this.onSwipeLeft(state)}
        onSwipeRight={state => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor,
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
          openDrawerOffset={0.3} // 20% gap on the right side of drawer
          panCloseMask={0.2}
          styles={drawerStyles}
          open={this.state.leftMenu}>
          <Drawer
            type="overlay"
            content={
              <RightMenu
                min={this.state.min}
                max={this.state.max}
                option={this.state.option}
                path={this.props.route.params.path}
                changeFilter={this.changeFilter}
              />
            }
            tapToClose={false}
            openDrawerOffset={0.3} // 20% gap on the right side of drawer
            panCloseMask={0.2}
            styles={drawerStyles}
            side={'right'}
            open={this.state.rightMenu}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.content}
              onScroll={({nativeEvent}) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  this.viewMore();
                }
              }}>
              {productElements}
              <LoadingMore show={viewMoreloading} />
            </ScrollView>
          </Drawer>
        </Drawer>
      </GestureRecognizer>
    );
  }
}
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollView: {},
  content: {
    width: windowWidth,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const drawerStyles = {
  drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
  main: {paddingLeft: 0},
};

const mapStateToProps = state => {
  return {
    productsReducer: state.productsReducer,
    categoryGroupsReducer: state.categoryGroupsReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fectchProducts: (path, key, min, max, option, page) => {
      dispatch(
        fectchProductsRequest(path, key, min, max, option, page, 'true'),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductScreen);
