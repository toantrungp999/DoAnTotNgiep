import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import OrderItem from './component/OrderItem';
import LoadingMore from '../../components/LoadingMore';
import SearchByStatus from './component/SearchByStatus';
import Loading from '../../components/Loading';
import {
    fetchOrdersRequest
} from '../../../actions/orderActions';

class OrderScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            status: 'Tất cả'
        }
    }

    componentDidMount() {
        this.fetchOrders();
    }

    fetchOrders = () => {
        const status = this.state.status;
        const search = this.state.search;
        const page = '1';
        this.props.fetchOrdersRequest('', status, search, page);
    }

    viewMore = () => {
        const { viewMoreloading, pageInfo } = this.props.orderReducer;
        const status = this.state.status;
        const search = this.state.search;
        const page = pageInfo.currentPage + 1;
        if (!viewMoreloading && pageInfo && pageInfo.currentPage < pageInfo.totalPage) {
            this.props.fetchOrdersRequest('', status, search, page);
        }
    }

    isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    changeStatus = (value) => {
        if (value !== this.state.status) {
            this.state.status = value;
            this.fetchOrders();
        }
    }

    changeSearch = (value) => {
        if (value !== this.state.search) {
            if (value === '' && this.state.search.length > 1) {
                this.state.search = '',
                    this.fetchOrders();
            } else {
                this.setState({ search: value })
            }
        }
    }

    render() {
        let { loading, viewMoreloading, pageInfo, currentStatus } = this.props.orderReducer;
        if (loading)
            return <Loading />
        var orders = this.props.orderReducer.orders;
        let orderList = orders && orders.length > 0 ? orders.map((order, index) => {
            return <OrderItem order={order} navigation={this.props.navigation} key={index} index={index} />
        }) : null;
        return (
            <ScrollView style={styles.container}
                onScroll={({ nativeEvent }) => {
                    if (this.isCloseToBottom(nativeEvent)) {
                        this.viewMore();
                    }
                }}
            >
                <Searchbar
                    style={styles.search}
                    inputStyle={styles.inputStyle}
                    placeholder="Tìm kiếm"
                    value={this.state.search}
                    onChangeText={(value) => { this.changeSearch(value) }}
                    onSubmitEditing={() => this.fetchOrders()}
                    onIconPress={() => this.fetchOrders()}

                />
                <SearchByStatus currentStatus={this.state.status} changeStatus={this.changeStatus} />

                {orderList}
                <LoadingMore show={viewMoreloading} />
            </ScrollView>
        );
    }
};



const styles = StyleSheet.create({
    container: {
        width: '100%',

    },
    search: {
        paddingTop: 0,
        marginTop: 0
    },
    inputStyle: {
        fontSize: 14,

    }
})


const mapStateToProps = state => {
    return {
        orderReducer: state.orderReducer,
    }
}

const mapDispatchToProps = dispatch => ({
    fetchOrdersRequest: (all, status, search, page) => { dispatch(fetchOrdersRequest(all, status, search, page)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);