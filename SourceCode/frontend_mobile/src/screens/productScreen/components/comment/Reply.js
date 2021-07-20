import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';
import { TextInput } from 'react-native-paper';
import { time_ago } from '../../../../../extentions/ArrayEx';

export default class Reply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            replyId: '',
            content: '',
            user: {},
            oldContent: '',
            date: '',
            isEdit: false
        }
    }

    componentDidMount() {
        const { _id, content, user, date } = this.props.reply;
        this.setState({
            replyId: _id, content, user, date, oldContent: content
        });
    }

    onDelete = () => {
        let { replyId } = this.state;
        this.props.onDeleteReply({ productId: this.props.productId, replyId, commentId: this.props.commentId });
    }

    onChange = (name, value) => {
        this.setState({
            [name]: value
        });
    };

    onUpdateCommentReply = () => {
        let { replyId, content } = this.state;
        content = content.trim();
        if (content) {
            this.props.onUpdateCommentReply({ commentId: this.props.commentId, replyId, content });
            this.setState({ isEdit: false });
        }
    }

    prepareToDelete = () => {
        Alert.alert(
            "Cảnh báo",
            "Bạn muốn xóa bình luận này",
            [
                {
                    text: "Đồng ý",
                    onPress: () => this.onDelete()
                },
                {
                    text: "Hủy",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
            ]
        );
    }

    render() {
        var isUser = this.props.userInfo && this.state.user._id === this.props.userInfo._id;
        return (
            !this.state.isEdit ?
                <View style={styles.row}>
                    <View style={styles.img}>
                        <Image source={{ uri: this.state.user.image }} style={styles.avartarReply} />
                    </View>
                    <View style={styles.contentArea}>
                        <View style={styles.content}>
                            <Text style={styles.name}>{this.state.user.name && this.state.user.name}</Text>
                            <Text style={styles.text}>{this.state.content}</Text>
                        </View>
                        <View style={styles.areaAction}>
                            <Text style={styles.textAction}>{time_ago(this.state.date)}</Text>
                            {isUser && <TouchableOpacity onPress={() => this.setState({ isEdit: true })}><Text style={styles.textAction}>Chỉnh sửa</Text></TouchableOpacity>}
                            {isUser && <TouchableOpacity onPress={this.prepareToDelete}><Text style={styles.textAction}>Xóa</Text></TouchableOpacity>}</View>
                    </View>
                </View> :
                <View>
                    <View style={styles.row}>
                        <View style={styles.editComent}>
                            <TextInput
                                value={this.state.content}
                                style={styles.input}
                                underlineColor="transparent"
                                onChangeText={(text) => this.onChange('content', text)}
                            />
                        </View>
                        <View style={styles.viewEditAction}>
                            <TouchableOpacity onPress={this.onUpdateCommentReply}><Text style={styles.textAction}>Lưu</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rowEdit}>
                        <TouchableOpacity onPress={() => this.setState({ isEdit: false, content: this.state.oldContent })}><Text style={styles.textAction}>Hủy</Text></TouchableOpacity>
                    </View>
                </View>
        );
    }
}