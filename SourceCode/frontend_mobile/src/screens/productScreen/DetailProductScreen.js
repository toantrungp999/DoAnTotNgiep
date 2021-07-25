import React, {Component} from 'react';
import {
  TouchableHighlight,
  ScrollView,
  Dimensions,
  View,
  Image,
  Text,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {
  fectchProductRequest,
  fectchRecommendedProductsRequest,
} from '../../../actions/productActions';
import {fectchBrandRequest} from '../../../actions/brandActions';
import {
  fectchColorOptionsRequest,
  fectchQuantityOptionsRequest,
  fectchSizeOptionsRequest,
} from '../../../actions/productOptionActions';
import {
  fectchCommentsRequest,
  createCommentRequest,
  updateCommentRequest,
  createReplyRequest,
  updateReplyRequest,
  deleteCommentRequest,
  deleteReplyRequest,
} from '../../../actions/commentActions';
import {
  fectchRatesRequest,
  createRateRequest,
  updateRateRequest,
  createRateReplyRequest,
  updateRateReplyRequest,
  deleteRateRequest,
  deleteRateReplyRequest,
} from '../../../actions/rateActions';
import {createCartRequest} from '../../../actions/cartActions';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import ProductOption from './components/productDetail/ProductOption';
import RecommendedSection from '../homePage/components/RecommendedSection';
import More from './components/productDetail/More';
import Loading from '../../components/Loading';
import styles from './styles';

const {width: viewportWidth} = Dimensions.get('window');

class DetailProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: '',
      images: '',
      activeSlide: 0,
      lengthCmt: 5,
      lengthRate: 5,
    };
  }

  onCreateComment = (content, dataUser) => {
    this.props.createComment({productId: this.state._id, content}, dataUser);
  };

  onCreateRate = (data, dataUser) => {
    data.productId = this.state._id;
    this.props.createRate(data, dataUser);
  };

  viewMoreComments = () => {
    this.props.fectchComments(this.state._id, this.state.lengthCmt + 5);
    this.setState({lengthCmt: this.state.lengthCmt + 5});
  };

  viewMoreRates = () => {
    this.props.fectchRates(this.state._id, this.state.lengthRate + 5);
    this.setState({lengthRate: this.state.lengthRate + 5});
  };

  componentDidMount() {
    const {_id} = this.props.route.params;
    if (_id) {
      this.setState({_id});
      this.props.fectchProduct(_id);
      this.props.fectchColorOptions(_id);
      this.props.fectchSizeOptions(_id);
      this.props.fectchQuantityOptions(_id);
      this.props.fectchComments(_id, this.state.lengthCmt);
      this.props.fectchRates(_id, this.state.lengthRate);
      this.props.fectchRecommendedProducts(
        this.props.userInfoReducer.userInfo
          ? this.props.userInfoReducer.userInfo._id
          : undefined,
        _id,
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.cartsReducer !== prevProps.cartsReducer) {
      const {
        messageCreate,
        createStatus,
        createLoading,
      } = this.props.cartsReducer;
      if (createLoading === false) {
        if (messageCreate)
          Alert.alert('Cảnh báo', messageCreate, [
            {
              text: 'Xác nhận',
            },
          ]);
        if (createStatus === true)
          Alert.alert('Thông báo', 'Thêm vào giỏ hàng thành công', [
            {
              text: 'Xác nhận',
            },
          ]);
      }
    }
    if (this.props.userInfoReducer !== prevProps.userInfoReducer) {
      const {_id} = this.props.route.params;
      if (_id)
        this.props.fectchRecommendedProducts(
          this.props.userInfoReducer.userInfo
            ? this.props.userInfoReducer.userInfo._id
            : undefined,
          _id,
        );
    }
    if (
      this.props.productDetailReducer.product !==
      prevProps.productDetailReducer.product
    ) {
      console.log(this.props.productDetailReducer.product);
      if (this.props.productDetailReducer.product) {
        this.props.navigation.setOptions({
          title: this.props.productDetailReducer.product.name,
        });
      }
    }
  }

  onAddToCart = data => {
    const {userInfo} = this.props.userInfoReducer;
    if (!userInfo) this.props.navigation.navigate('Đăng nhập');
    else {
      this.setState({isAddToCart: true});
      this.props.createCart(data);
    }
  };

  renderImage = ({item}) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: item.image}} />
        {item.color ? <Text style={styles.textColor}>{item.color}</Text> : null}
      </View>
    </TouchableHighlight>
  );

  render() {
    const {product, loading} = this.props.productDetailReducer;
    const {recommendedProducts} = this.props.recommendedProductsReducer;
    const {activeSlide} = this.state;
    const {userInfo} = this.props.userInfoReducer;
    if (loading) return <Loading />;
    else {
      const {colorOptions} = this.props.productOptionsReducer;
      const productImages = product.images
        ? product.images.map(image => {
            return {image: image, color: null};
          })
        : [];
      const colorImages = colorOptions
        ? colorOptions.map(colorOption => {
            return {image: colorOption.image, color: colorOption.color};
          })
        : [];
      const images = productImages.concat(colorImages);

      return (
        <ScrollView style={styles.container}>
          <View style={styles.carouselContainer}>
            <View style={styles.carousel}>
              <Carousel
                ref={c => {
                  this.slider1Ref = c;
                }}
                data={images}
                renderItem={this.renderImage}
                sliderWidth={viewportWidth}
                itemWidth={viewportWidth}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                firstItem={0}
                loop={false}
                autoplay={false}
                autoplayDelay={500}
                autoplayInterval={3000}
                onSnapToItem={index => this.setState({activeSlide: index})}
              />
              <Pagination
                dotsLength={images.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotColor="#C4C4C4"
                dotStyle={styles.paginationDot}
                inactiveDotColor="#A3A3A3"
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.5}
                carouselRef={this.slider1Ref}
                tappableDots={!!this.slider1Ref}
              />
            </View>
          </View>
          <View style={styles.infoRecipeContainer}>
            <Text style={styles.infoRecipeName}>{product.name}</Text>
            <ProductOption
              productOptionsReducer={this.props.productOptionsReducer}
              price={product.price}
              saleOff={product.saleOff}
              onAddToCart={this.onAddToCart}
            />
            <More
              product={product}
              fectchBrand={this.props.fectchBrand}
              brandReducer={this.props.brandReducer}
              viewMoreRates={this.viewMoreRates}
              lengthRate={this.state.lengthRate}
              totalRate={this.props.ratesReducer.total}
              onCreateRate={this.onCreateRate}
              onCreateRateReply={this.props.createRateReply}
              onUpdateRate={this.props.updateRate}
              onUpdateRateReply={this.props.updateRateReply}
              onDeleteRate={this.props.deleteRate}
              onDeleteRateReply={this.props.deleteRateReply}
              ratesReducer={this.props.ratesReducer}
              viewMoreComments={this.viewMoreComments}
              lengthCmt={this.state.lengthCmt}
              totalCmt={this.props.commentsReducer.total}
              onCreateComment={this.onCreateComment}
              onCreateReply={this.props.createReply}
              onUpdateComment={this.props.updateComment}
              onDeleteComment={this.props.deleteComment}
              onUpdateCommentReply={this.props.updateReply}
              onDeleteCommentReply={this.props.deleteReply}
              commentsReducer={this.props.commentsReducer}
              userInfo={userInfo}
            />
          </View>
          {recommendedProducts && (
            <RecommendedSection
              products={recommendedProducts}
              navigation={this.props.navigation}
              title="Gợi ý"
            />
          )}
        </ScrollView>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    userInfoReducer: state.userInfoReducer,
    productDetailReducer: state.productDetailReducer,
    productOptionsReducer: state.productOptionsReducer,
    brandReducer: state.brandReducer,
    commentsReducer: state.commentsReducer,
    ratesReducer: state.ratesReducer,
    cartsReducer: state.cartsReducer,
    recommendedProductsReducer: state.recommendedProductsReducer,
  };
};

const mapDispatchToProps = dispatch => ({
  fectchProduct: _id => {
    dispatch(fectchProductRequest(_id));
  },
  fectchColorOptions: _id => {
    dispatch(fectchColorOptionsRequest(_id));
  },
  fectchQuantityOptions: _id => {
    dispatch(fectchQuantityOptionsRequest(_id));
  },
  fectchSizeOptions: _id => {
    dispatch(fectchSizeOptionsRequest(_id));
  },
  fectchBrand: _id => {
    dispatch(fectchBrandRequest(_id));
  },
  fectchComments: (_id, length) => {
    dispatch(fectchCommentsRequest(_id, length));
  },
  fectchRates: (_id, length) => {
    dispatch(fectchRatesRequest(_id, length));
  },
  //
  createComment: (data, dataUser) => {
    dispatch(createCommentRequest(data, dataUser));
  },
  updateComment: data => {
    dispatch(updateCommentRequest(data));
  },
  updateReply: data => {
    dispatch(updateReplyRequest(data));
  },
  createReply: data => {
    dispatch(createReplyRequest(data));
  },
  deleteComment: data => {
    dispatch(deleteCommentRequest(data));
  },
  deleteReply: data => {
    dispatch(deleteReplyRequest(data));
  },
  ///
  createRate: (data, dataUser) => {
    dispatch(createRateRequest(data, dataUser));
  },
  createRateReply: data => {
    dispatch(createRateReplyRequest(data));
  },
  updateRate: data => {
    dispatch(updateRateRequest(data));
  },
  updateRateReply: data => {
    dispatch(updateRateReplyRequest(data));
  },
  deleteRate: data => {
    dispatch(deleteRateRequest(data));
  },
  deleteRateReply: data => {
    dispatch(deleteRateReplyRequest(data));
  },

  createCart: data => {
    dispatch(createCartRequest(data));
  },
  fectchRecommendedProducts: (userId, productId) => {
    dispatch(fectchRecommendedProductsRequest(userId, productId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailProductScreen);
