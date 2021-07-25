import React, { Component, memo } from "react";
import { connect } from "react-redux";
import {
  fectchCommentsRequest,
  createCommentRequest,
  updateCommentRequest,
  createReplyRequest,
  updateReplyRequest,
  deleteCommentRequest,
  deleteReplyRequest,
} from "../../../actions/commentActions";
import {
  fectchRatesRequest,
  createRateRequest,
  updateRateRequest,
  createRateReplyRequest,
  updateRateReplyRequest,
  deleteRateRequest,
  deleteRateReplyRequest,
} from "../../../actions/rateActions";
import {
  fectchProductRequest,
  fectchRecommendedProductsRequest,
} from "../../../actions/productActions";
import {
  createCartRequest,
  clearStateCart,
} from "../../../actions/cartActions";
import ProductOption from "../../../components/customer/productColorOption/ProductOption";
import {
  fectchColorOptionsRequest,
  fectchQuantityOptionsRequest,
  fectchSizeOptionsRequest,
} from "../../../actions/productOptionActions";
import Comments from "../../../components/customer/comments/Comments";
import "./main.css";
import Loading from "../../../components/common/loading/Loading";
import Rates from "../../../components/customer/rates/Rates";
import RecommendedSection from "../../../components/customer/recommendedProduct/RecommendedSection";
import MessageSuccess from "../../../components/common/dialogs/MessageSuccess";
import MeesageError from "../../../components/common/dialogs/MessageError";
import NotFound from "../notFound/NotFound";
import PageTitle from "../../../components/customer/pageTitle/PageTitle";
import { Collapse } from "@material-ui/core";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import ReactImageMagnify from "react-image-magnify";
import "./DetailProductPage.css";

class DetailProductPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: "",
      currentShow: 0,
      readMore: false,
      showDialogSuccess: false,
      showDialogError: false,
      isAddToCart: false,
      isBuy: false,
      viewType: "description",
      lengthCmt: 5,
      lengthRate: 5,
      zoomX: 0,
      zoomY: 0,
      top: 0,
    };
  }

  onCreateComment = (content, dataUser) => {
    this.props.createComment({ productId: this.state._id, content }, dataUser);
  };

  onCreateRate = (data, dataUser) => {
    data.productId = this.state._id;
    this.props.createRate(data, dataUser);
  };

  viewMoreComments = () => {
    this.props.fectchComments(this.state._id, this.state.lengthCmt + 5);
    this.setState({ lengthCmt: this.state.lengthCmt + 5 });
  };

  viewMoreRates = () => {
    this.props.fectchRates(this.state._id, this.state.lengthRate + 5);
    this.setState({ lengthRate: this.state.lengthRate + 5 });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      let { productDetailReducer, productOptionsReducer, cartsReducer } =
        nextProps;
      if (
        !productDetailReducer.colorLoading &&
        !productDetailReducer.sizeLoading &&
        !productDetailReducer.quantityLoading
      ) {
        let { product } = productDetailReducer;
        let { colorOptions } = productOptionsReducer;
        var listImage = [];
        if (colorOptions && product) {
          listImage = [...product.images];
          for (let i = 0; i < colorOptions.length; i++)
            listImage.push(colorOptions[i].image);
        }
        this.setState({
          images: listImage,
          startIndex: 0,
          endIndex: listImage.length >= 5 ? 5 : listImage.length,
        });
      }
      let { createStatus, messageCreate, cartId } = cartsReducer;
      if (createStatus && this.state.isAddToCart)
        this.setState({ showDialogSuccess: true });
      else if (createStatus && this.state.isBuy)
        this.props.history.push({
          pathname: "/cart",
          state: { cartId: cartId },
        });
      else if (messageCreate) this.setState({ showDialogError: true });
    }
  }

  componentDidMount() {
    this.moreImagesComponent = React.createRef();
    let _id = this.props.match.params._id;
    if (_id) {
      this.setState({
        _id,
      });
      //reset state Cart reducer, tránh trường hợp load thông báo từ trang detail trước
      this.props.clearStateCart();
      this.props.fectchProduct(_id);
      this.props.fectchRecommendedProducts(
        this.props.userInfoReducer.userInfo
          ? this.props.userInfoReducer.userInfo._id
          : undefined,
        _id
      );
      this.props.fectchColorOptions(_id);
      this.props.fectchSizeOptions(_id);
      this.props.fectchQuantityOptions(_id);
      this.props.fectchComments(_id, this.state.lengthCmt);
      this.props.fectchRates(_id, this.state.lengthRate);
    } else this.props.history.push("/notfound");
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.props.productDetailReducer;
    if (!loading && this.props.location !== prevProps.location) {
      let _id = this.props.match.params._id;
      if (_id) {
        this.setState({
          _id: _id,
        });
        this.props.fectchProduct(
          _id,
          this.props.userInfoReducer.userInfo
            ? this.props.userInfoReducer.userInfo._id
            : undefined
        );
        this.props.fectchColorOptions(_id);
        this.props.fectchSizeOptions(_id);
        this.props.fectchQuantityOptions(_id);
        this.props.fectchComments(_id, this.state.lengthCmt);
        this.props.fectchRates(_id, this.state.lengthRate);
        this.props.fectchRecommendedProducts(
          this.props.userInfoReducer.userInfo
            ? this.props.userInfoReducer.userInfo._id
            : undefined,
          _id
        );
      }
    }

    if (
      !this.props.userInfoReducer.userInfo &&
      prevProps.userInfoReducer.userInfo
    ) {
      let _id = this.props.match.params._id;
      this.props.fectchRecommendedProducts(
        this.props.userInfoReducer.userInfo
          ? this.props.userInfoReducer.userInfo._id
          : undefined,
        _id
      );
    }
  }

  onPrevious = () => {
    const width = window.innerWidth;
    const property = width <= 768 ? "left" : "top";
    const div = this.moreImagesComponent.current;
    let nodeStyle = window.getComputedStyle(div);
    let top = nodeStyle.getPropertyValue(property);
    top = Number(top.replace("px", ""));
    if (top + 120 > 0) {
      this.setState({ top: 0 });
    } else {
      this.setState({ top: this.state.top + 120 });
    }
  };

  onNext = () => {
    const width = window.innerWidth;
    const property = width <= 768 ? "right" : "bottom";
    const div = this.moreImagesComponent.current;
    let nodeStyle = window.getComputedStyle(div);
    let bottom = nodeStyle.getPropertyValue(property);
    bottom = Number(bottom.replace("px", ""));
    if (bottom + 120 > 0) {
      this.setState({ top: this.state.top + bottom });
    } else {
      this.setState({ top: this.state.top - 120 });
    }
  };

  onShow = (index) => {
    let { images } = this.state;
    if (index >= 0 && index < images.length) {
      this.setState({ currentShow: index });
    }
  };

  readMore = () => {
    this.setState({ readMore: !this.state.readMore });
  };

  onShowColorImage = (index) => {
    let { product } = this.props.productDetailReducer;
    if (product) {
      index += product.images.length;
      this.setState({
        currentShow: index,
      });
    }
  };

  onOkay = () => {
    this.setState({
      showDialogSuccess: false,
      isAddToCart: false,
      isBuy: false,
    });
  };

  onCloseDialog = () => {
    this.setState({
      showDialogError: false,
      isAddToCart: false,
      isBuy: false,
    });
  };

  onAddCart = (data) => {
    const { userInfo } = this.props.userInfoReducer;
    if (!userInfo) this.props.history.push("/login");
    else {
      this.setState({ isAddToCart: true });
      this.props.createCart(data);
    }
  };

  onBuy = (data) => {
    const { userInfo } = this.props.userInfoReducer;
    if (!userInfo) this.props.history.push("/login");
    else {
      this.setState({ isBuy: true });
      this.props.createCart(data);
    }
  };

  changeViewType = (e, name) => {
    e.preventDefault();
    if (window.innerWidth <= 768 && this.state.viewType === name) {
      this.setState({ viewType: "" });
    } else {
      this.setState({ viewType: name });
    }
  };

  onZoomImage = (e) => {
    this.setState({
      zoomX: e.nativeEvent.offsetX,
      zoomY: e.nativeEvent.offsetY,
    });
  };

  render() {
    const { recommendedProducts } = this.props.recommendedProductsReducer;
    const recommendedColorOptions =
      this.props.recommendedProductsReducer.colorOptions;
    const recommendedSizeOptions =
      this.props.recommendedProductsReducer.sizeOptions;
    const width = window.innerWidth;
    const style =
      width <= 768
        ? { left: `${this.state.top}px` }
        : { top: `${this.state.top}px` };
    const { loading, product } = this.props.productDetailReducer;
    const viewType = this.state.viewType;
    if (loading)
      return (
        <div>
          <Loading />
        </div>
      );
    else if (product === null) {
      return <NotFound link={"/"}></NotFound>;
    } else {
      const {
        name,
        price,
        orgin,
        saleOff,
        material,
        description,
        images,
        review,
        categoryId,
      } = product;
      let { messageCreate, createLoading } = this.props.cartsReducer;
      let productOption = "";
      // if (!colorLoading && !quantityLoading && !sizeLoading)
      //   productOption = <ProductOption price={price} saleOff={saleOff} productOptionsReducer={this.props.productOptionsReducer} onShowColorImage={this.onShowColorImage} onAddCart={this.onAddCart} onBuy={this.onBuy} />;
      productOption = (
        <ProductOption
          price={price}
          saleOff={saleOff}
          categoryId={categoryId}
          productOptionsReducer={this.props.productOptionsReducer}
          onShowColorImage={this.onShowColorImage}
          onAddCart={this.onAddCart}
          onBuy={this.onBuy}
          createLoading={createLoading}
        />
      );
      const { userInfo } = this.props.userInfoReducer;
      const { currentShow } = this.state;
      const stateImages = this.state.images;
      const allImage = stateImages
        ? stateImages.map((image, index) => {
            return (
              <div
                key={index}
                onClick={() => this.onShow(index)}
                className={
                  currentShow === index
                    ? "more-image choose-image"
                    : "more-image"
                }
              >
                <img src={image} alt={123} />
              </div>
            );
          })
        : "";

      function htmlDecode(input) {
        const e = document.createElement("textarea");
        e.innerHTML = input;
        // handle case of empty input
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }

      const commentAndRate = (
        <>
          <div className="">
            <Rates
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
              userInfo={userInfo}
            />
          </div>
          <div className="">
            <Comments
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
          </div>
        </>
      );

      const descriptionArea = (
        <div>
          <div
            className="mt-20 pl-4 pr-5"
            dangerouslySetInnerHTML={{
              __html: review ? htmlDecode(review) : "",
            }}
          ></div>
        </div>
      );

      const information = (
        <div className="col-12">
          <table className="table text-left table-bordered table-information">
            <tbody>
              <tr>
                <td className="table-header">Xuất xứ</td>
                <td>{orgin}</td>
              </tr>
              <tr>
                <td className="table-header">Chất liệu</td>
                <td>{material}</td>
              </tr>
              <tr>
                <td className="table-header">Mô tả ngắn</td>
                <td>
                  <p
                    style={{ whiteSpace: "pre-line", marginBlockStart: "0px" }}
                  >
                    {description}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      // const {zoomX,zoomY} = this.state;
      // const left = zoomX<120?'0px':((zoomX-120).toString() + 'px');
      // const top = zoomY<120?'0px':((zoomY-120).toString() + 'px');
      // const zoomEffectStyle = {
      //   left,
      //   top
      // }

      return (
        <main>
          <PageTitle location={this.props.location} product={product} />
          <div className="product-detail-page">
            {/* <SearchByBrands brandsReducer={this.props.brandsReducer} /> */}
            {/* <SearchByTypes match={this.props.match} categoriesReducer={this.props.categoriesReducer} /> */}
            {this.state.showDialogSuccess ? (
              <MessageSuccess
                message="Thêm sản phẩm vào giỏ hàng thành công"
                onOkay={this.onOkay}
              />
            ) : null}
            {this.state.showDialogError ? (
              <MeesageError
                message={messageCreate}
                onClose={this.onCloseDialog}
              />
            ) : null}
            <div className="product-section">
              <div className="image-section">
                <div className="more-image-section">
                  {/* //this is container */}
                  <div>
                    <button onClick={this.onPrevious} className="btn-top-left">
                      <UpOutlined />
                    </button>
                    <div className="more-images-container">
                      <div
                        className="more-images"
                        style={style}
                        ref={this.moreImagesComponent}
                      >
                        {allImage}
                      </div>
                    </div>
                    <button onClick={this.onNext} className="btn-bottom-right">
                      <DownOutlined />
                    </button>
                  </div>
                </div>
                <div
                  className="selected-image-section"
                  onMouseMove={this.onZoomImage}
                >
                  {/* //this is container */}
                  <div>
                    <ReactImageMagnify
                      className="selected-image"
                      {...{
                        smallImage: {
                          alt: "Lỗi rồi nè",
                          isFluidWidth: true,
                          src:
                            stateImages && stateImages.length > 0
                              ? stateImages[this.state.currentShow]
                              : images[this.state.currentShow],
                        },
                        largeImage: {
                          src:
                            stateImages && stateImages.length > 0
                              ? stateImages[this.state.currentShow]
                              : images[this.state.currentShow],
                          width: 1000,
                          height: 1250,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="option-section">
                <div className="product-name">{name}</div>
                {productOption}
              </div>
            </div>
            <div className="view-type">
              <div className="view-type-header">
                <div
                  className={
                    "description view-type-title" +
                    (viewType === "description" ? " active" : "")
                  }
                >
                  <button
                    onClick={(e) => this.changeViewType(e, "description")}
                  >
                    <span className="button-description">Mô tả</span>
                    <span className="button-icon"></span>
                  </button>
                  <div className="view-type-content-inside">
                    <Collapse
                      in={viewType === "description" ? true : false}
                      timeout={500}
                      collapsedHeight={0}
                    >
                      {descriptionArea}
                    </Collapse>
                  </div>
                </div>
                <div
                  className={
                    "information view-type-title" +
                    (viewType === "information" ? " active" : "")
                  }
                >
                  <button
                    onClick={(e) => this.changeViewType(e, "information")}
                  >
                    <span className="button-description">Thông tin</span>
                    <span className="button-icon"></span>
                  </button>
                  <div className="view-type-content-inside">
                    <Collapse
                      in={viewType === "information" ? true : false}
                      timeout={500}
                      collapsedHeight={0}
                    >
                      {information}
                    </Collapse>
                  </div>
                </div>
                <div
                  className={
                    "review view-type-title" +
                    (viewType === "review" ? " active" : "")
                  }
                >
                  <button onClick={(e) => this.changeViewType(e, "review")}>
                    <span className="button-description">Đánh giá</span>
                    <span className="button-icon"></span>
                  </button>
                  <div className="view-type-content-inside">
                    <Collapse
                      in={viewType === "review" ? true : false}
                      timeout={500}
                      collapsedHeight={0}
                    >
                      {commentAndRate}
                    </Collapse>
                  </div>
                </div>
              </div>
              <div className="view-type-content-outside">
                {viewType === "description" ? (
                  <div className="description">{descriptionArea}</div>
                ) : (
                  ""
                )}
                {viewType === "information" ? (
                  <div className="information">{information}</div>
                ) : (
                  ""
                )}
                {viewType === "review" ? (
                  <div className="review">{commentAndRate}</div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {recommendedProducts && (
              <RecommendedSection
                products={recommendedProducts}
                sizeOptions={recommendedSizeOptions}
                colorOptions={recommendedColorOptions}
                title="Gợi ý"
                description="Có thể bạn quan tâm"
              />
            )}
          </div>
        </main>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    // brandsReducer: state.brandsReducer,
    userInfoReducer: state.userInfoReducer,
    productDetailReducer: state.productDetailReducer,
    productOptionsReducer: state.productOptionsReducer,
    recommendedProductsReducer: state.recommendedProductsReducer,
    commentsReducer: state.commentsReducer,
    ratesReducer: state.ratesReducer,
    cartsReducer: state.cartsReducer,
    categoriesReducer: state.categoriesReducer,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fectchComments: (_id, length) => {
    dispatch(fectchCommentsRequest(_id, length));
  },
  fectchRates: (_id, length) => {
    dispatch(fectchRatesRequest(_id, length));
  },
  fectchProduct: (productId, userId) => {
    dispatch(fectchProductRequest(productId, userId));
  },
  fectchColorOptions: (_id) => {
    dispatch(fectchColorOptionsRequest(_id));
  },
  fectchSizeOptions: (_id) => {
    dispatch(fectchSizeOptionsRequest(_id));
  },
  fectchQuantityOptions: (_id) => {
    dispatch(fectchQuantityOptionsRequest(_id));
  },
  fectchRecommendedProducts: (userId, productId) => {
    dispatch(fectchRecommendedProductsRequest(userId, productId));
  },
  ///
  createComment: (data, dataUser) => {
    dispatch(createCommentRequest(data, dataUser));
  },
  updateComment: (data) => {
    dispatch(updateCommentRequest(data));
  },
  updateReply: (data) => {
    dispatch(updateReplyRequest(data));
  },
  createReply: (data) => {
    dispatch(createReplyRequest(data));
  },
  deleteComment: (data) => {
    dispatch(deleteCommentRequest(data));
  },
  deleteReply: (data) => {
    dispatch(deleteReplyRequest(data));
  },
  ///
  createRate: (data, dataUser) => {
    dispatch(createRateRequest(data, dataUser));
  },
  createRateReply: (data) => {
    dispatch(createRateReplyRequest(data));
  },
  updateRate: (data) => {
    dispatch(updateRateRequest(data));
  },
  updateRateReply: (data) => {
    dispatch(updateRateReplyRequest(data));
  },
  deleteRate: (data) => {
    dispatch(deleteRateRequest(data));
  },
  deleteRateReply: (data) => {
    dispatch(deleteRateReplyRequest(data));
  },

  createCart: (data) => {
    dispatch(createCartRequest(data));
  },
  clearStateCart: () => {
    dispatch(clearStateCart());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(DetailProductPage));
