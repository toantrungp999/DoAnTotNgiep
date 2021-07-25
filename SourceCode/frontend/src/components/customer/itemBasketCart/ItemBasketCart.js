import React, { Component, memo } from "react";
import { convertNumberToVND } from "../../../extentions/ArrayEx";
import ConfirmDialog from "../../common/dialogs/ConfirmDialog";
import MesageError from "../../common/dialogs/MessageError";
import DialogChangeTypeInCart from "../../common/dialogs/DialogChangeTypeInCart";
import { CaretDownOutlined, DeleteOutlined } from "@ant-design/icons";
//dùng file css BasketCart.css

class ItemBasketCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      quantity: 0,
      price: 0,
      type: "",
      showDialogError: false,
      showDiaLogConfirm: false,
      message: "",
      isLoading: false,
      showDiaLogChangeType: false,
    };
  }

  componentDidMount() {
    let { _id, quantity, price, type, quantityInStore, defaultCheck } =
      this.props;
    this.setState({ _id, quantity, price, type, quantityInStore });
    if (defaultCheck) {
      this.props.onUpdateSelectedList(_id, true);
    }
  }

  onUp = () => {
    let { _id, quantity, quantityInStore } = this.state;
    if (quantity < quantityInStore && quantity < 5) {
      quantity += 1;
      this.setState({ quantity });
      this.onUpdate(_id, quantity);
    } else if (quantity >= quantityInStore)
      this.setState({
        showDialogError: true,
        message: "Số lượng sản phẩm vượt quá số lượng có trong kho",
      });
    else
      this.setState({
        showDialogError: true,
        message: "Không thể thêm quá 5 sản phẩm cùng 1 loại vào giỏ hàng!",
      });
  };

  onDown = () => {
    let { _id, quantity } = this.state;
    let checkQuantity = this.props.quantityInStore - quantity;
    if (this.props.quantity === 1)
      this.setState({
        showDiaLogConfirm: true,
        message: "Bạn muốn xóa sản phẩm này?",
      });
    else if (checkQuantity < 0) {
      quantity = this.props.quantityInStore;
      this.setState({ quantity });
      this.onUpdate(_id, quantity);
    } else if (quantity > 1) {
      quantity -= 1;
      this.setState({ quantity });
      this.onUpdate(_id, quantity);
    }
  };

  onCloseDialogError = () => {
    this.setState({ showDialogError: false, message: "" });
  };

  onCloseDialogConfirm = () => {
    this.setState({ showDiaLogConfirm: false, message: "" });
  };

  onDelete = () => {
    this.setState({
      showDiaLogConfirm: true,
      message: "Bạn muốn xóa sản phẩm này?",
    });
  };

  onUpdate = (_id, quantity) => {
    this.props.updateCart({ _id, quantity });
    this.setState({ isLoading: true });
  };

  onConfirm = () => {
    this.setState({ showDiaLogConfirm: false, message: "" });
    this.props.deleteCart(this.state._id);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps) {
      let { updateLoading, quantity, quantityInStore } = nextProps;
      if (!updateLoading && this.state.isLoading)
        this.setState({ isLoading: false });
      if (quantity) this.setState({ quantity });
      if (quantityInStore) this.setState({ quantityInStore });
    }
  }

  onCheck = (event) => {
    let checked = event.target.checked;
    this.props.onUpdateSelectedList(this.state._id, checked);
  };

  onEditType = () => {
    this.setState({ showDiaLogChangeType: true });
  };

  onCloseDialogEditType = () => {
    this.setState({ showDiaLogChangeType: false });
  };

  render() {
    let message = "";
    let checkQuantity = this.state.quantity - this.props.quantityInStore;
    if (checkQuantity > 0) message = <>Không đủ sản phẩm</>;
    return (
      <>
        <div className={"cart-item " + (this.props.index === 0 && "first")}>
          {this.state.showDialogError ? (
            <MesageError
              message={this.state.message}
              onClose={this.onCloseDialogError}
            />
          ) : null}
          {this.state.showDiaLogConfirm ? (
            <ConfirmDialog
              onConfirm={this.onConfirm}
              message={this.state.message}
              onClose={this.onCloseDialogConfirm}
            />
          ) : null}
          {this.state.showDiaLogChangeType ? (
            <DialogChangeTypeInCart
              price={this.props.price}
              saleOff={this.props.saleOff}
              cartId={this.state._id}
              quantity={this.state.quantity}
              colorId={this.props.colorId}
              sizeId={this.props.sizeId}
              productId={this.props.productId}
              onClose={this.onCloseDialogEditType}
            />
          ) : null}

          <div className="check-section">
            <input
              type="checkbox"
              className="checkbox-cart-item"
              id={this.state._id}
              name="isChoose"
              checked={this.props.checked}
              onChange={this.onCheck}
            />
            <label
              className="label-checkbox-cart-item"
              htmlFor={this.state._id}
            >
              <i className="fa fa-check item-checkbox-cart-item"></i>
            </label>
          </div>
          <div className="product-info">
            <img className="" alt={this.props.name} src={this.props.image} />
            <div className="info">
              <span className="product-name">{this.props.name}</span>
              <div>
                <div className="type-price-section">
                  <span className="product-type" onClick={this.onEditType}>
                    {this.props.type} <CaretDownOutlined />
                  </span>
                  <span>
                    {this.props.saleOff ? (
                      <del className="orgin-price">
                        {convertNumberToVND(this.props.price)}₫
                      </del>
                    ) : (
                      ""
                    )}
                    <span className="price">
                      {convertNumberToVND(
                        this.props.price - this.props.saleOff
                      )}
                      ₫
                    </span>
                  </span>
                  <div className="quantity-section mobile">
                    <div className="number-updown">
                      <button
                        disabled={this.state.isLoading}
                        className="button-up-down btn-down"
                        onClick={this.onDown}
                        type="button"
                      >
                        -
                      </button>
                      <input
                        disabled={this.state.isLoading}
                        className="input-numberic"
                        readOnly
                        type="number"
                        value={this.state.quantity}
                      />
                      <button
                        disabled={this.state.isLoading}
                        className="button-up-down btn-up"
                        onClick={this.onUp}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                    {/* <span className='change-type' onClick={this.onEditType} to="#">Chỉnh sửa loại</span> */}
                    <div className="quantity-instore">
                      {this.props.quantityInStore + " sản phẩm có sẳn"}
                    </div>
                    {message ? <div className="message">{message}</div> : null}
                  </div>
                </div>
                <div className="quantity-section">
                  <div className="number-updown">
                    <button
                      disabled={this.state.isLoading}
                      className="button-up-down btn-down"
                      onClick={this.onDown}
                      type="button"
                    >
                      -
                    </button>
                    <input
                      disabled={this.state.isLoading}
                      className="input-numberic"
                      readOnly
                      type="number"
                      value={this.state.quantity}
                    />
                    <button
                      disabled={this.state.isLoading}
                      className="button-up-down btn-up"
                      onClick={this.onUp}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                  <div className="quantity-instore">
                    {this.props.quantityInStore + " sản phẩm có sẳn"}
                  </div>
                  {message ? <div className="message">{message}</div> : null}
                </div>
                <div className="delete-section">
                  <button className="btn-remove" onClick={this.onDelete}>
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default memo(ItemBasketCart);
