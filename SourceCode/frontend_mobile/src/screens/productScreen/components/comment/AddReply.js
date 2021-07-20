import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { TextInput } from 'react-native-paper';
export default class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reply: '',
        }
    }

    onChange = (name, value) => {
        this.setState({
            [name]: value
        });
    };

    onCreateReply = () => {
        let { reply } = this.state;
        const { commentId } = this.props;
        reply = reply.trim();
        if (reply)
            this.props.onCreateReply({ commentId, reply });
        this.props.onShowReplyForm();
        this.setState({ reply: '' });
    }

    render() {
        return (
            <View style={styles.row}>
                <View style={styles.addReply}>
                    <TextInput
                        style={styles.input}
                        underlineColor="transparent"
                        onChangeText={(text) => this.onChange('reply', text)}
                    />
                </View>
                <View style={styles.sendReply}>
                    <TouchableOpacity onPress={this.onCreateReply}><Text style={styles.sendBtn}>Gửi</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}