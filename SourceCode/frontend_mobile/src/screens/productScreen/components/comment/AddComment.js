import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import { TextInput } from 'react-native-paper';
export default class AddComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
        }
    }

    onChange = (name, value) => {
        this.setState({
            [name]: value
        });
    };

    onSubmit = () => {
        const content = this.state.content.trim();
        if (content) {
            this.props.onCreateComment(this.state.content, { name: this.props.userInfo.name, image: this.props.userInfo.image, role: this.props.userInfo.role });
            this.setState({
                content: '',
            });
        }
    }

    render() {
        return (
            <View style={styles.row}>
                <View style={styles.addComment}>
                    <TextInput
                        style={styles.input}
                        underlineColor="transparent"
                        onChangeText={(text) => this.onChange('content', text)}
                    />
                </View>
                <View style={styles.viewSend}>
                    <TouchableOpacity onPress={this.onSubmit}><Text style={styles.sendBtn}>Bình luận</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}