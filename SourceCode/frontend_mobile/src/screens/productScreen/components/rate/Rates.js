import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import Rate from './Rate';
import AddRate from './AddRate';

export default class Rates extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { rates, createLoading, updateLoading, deleteLoading,
            createReplyLoading, updateReplyLoading, deleteReplyLoading } = this.props.ratesReducer;
        let exist;
        const listRates = rates ? rates.map((rate, index) => {
            if (!this.props.userInfo || rate.user._id === this.props.userInfo._id)
                    exist = true;
            let { _id } = rate;
            return <Rate key={_id} index={index}
                updateLoading={updateLoading} updateReplyLoading={updateReplyLoading}
                deleteLoading={deleteLoading} deleteReplyLoading={deleteReplyLoading} createReplyLoading={createReplyLoading}
                rate={rate}
                userInfo={this.props.userInfo}
                onCreateReply={this.props.onCreateReply}
                onUpdateRate={this.props.onUpdateRate} onDeleteRate={this.props.onDeleteRate}
                onUpdateRateReply={this.props.onUpdateRateReply} onDeleteRateReply={this.props.onDeleteRateReply}
            />
        }) : null;
        return (
            <View style={styles.container}>
                {this.props.userInfo && !createLoading && !exist ? <AddRate onCreateRate={this.props.onCreateRate} userInfo={this.props.userInfo} /> : null}
                {listRates}
                {this.props.totalRate > this.props.lengthRate && <View style={styles.row}><TouchableOpacity onPress={this.props.viewMoreRates}><Text style={styles.textAction}>Xem thêm đánh giá</Text></TouchableOpacity></View>}
            </View>
        );
    }
}