import React, { Component, memo } from 'react';
import { connect } from 'react-redux';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { sendMessageToUser, sendMessageToBot } from '../../../actions/messengerActions';
import { fectchAllUsersRequest } from '../../../actions/usersAction';
import Feather from 'react-native-vector-icons/Feather';
import { BOT_ID } from '../../../constants/MessengerData';
import { CUSTOMER } from '../../../constants/Roles';

class CreateMessengerScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            content: '',
            to: '',
            image: '',
            name: '',
            hadSend: false,
            hadNavi: false
        }
    }

    onChange = (e) => {
        const target = e.target;
        const name = target.name;
        let value = target.value;
        this.setState({
            [name]: value
        });
    }

    onSelected = (selectedOption) => {
        this.setState({ to: selectedOption.value });
    }

    componentDidMount() {
        const { loading, users } = this.props.allUserReducer;
        if (!loading && !users)
            this.props.fectchAllUsers();
    }

    componentDidUpdate(prevProps) {
        if (this.state.hadSend === true && prevProps.messengersReducer !== this.props.messengersReducer && this.props.messengersReducer.loading === false && this.state.hadNavi == false) {
            const { to, index } = this.props.messengersReducer;
            console.log(this.state.to);
            console.log(to);
            if (!to) {
                if (index > -1 && this.state.to === "customerCare") {
                    this.props.navigation.replace('detailMessengerScreen');
                    this.setState({ hadNavi: true });
                }
                return;
            }
            if (to._id === BOT_ID && index > -1 && this.state.to === "bot") {
                this.props.navigation.replace('detailMessengerScreen');
                this.setState({ hadNavi: true });
                return;
            }
            else if (to._id === this.state.to && index > -1) {
                this.props.navigation.replace('detailMessengerScreen');
                this.setState({ hadNavi: true });
                return;
            }
        }
    }

    onChange = (name, value) => {
        this.setState({
            [name]: value
        });
    };

    onSend = () => {
        const content = this.state.content.trim();
        if (content) {
            if (this.state.to === "customerCare")
                this.props.sendMessageToUser(null, content);

            else if (this.state.to === "bot")
                this.props.sendMessageToBot(content);
            else
                this.props.sendMessageToUser(this.state.to, content);
            this.setState({ hadSend: true, content: '' });
        }
    }

    onChoose = (user) => {
        this.setState({ to: user._id, name: user.name, image: user.image, content: '' });
    }

    render() {
        const { users, loading } = this.props.allUserReducer;

        let userElements = users?.map(user => {
            return <View key={user._id} style={styles.row}>
                <Image style={{ width: 36, height: 36, borderRadius: 18 }} source={{ uri: user.image }}></Image>
                <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => { this.onChoose(user); }}><Text style={{ fontSize: 16 }}>{user.name}</Text></TouchableOpacity>
            </View>;
        }) || null;


        const { userInfo } = this.props.userInfoReducer;
        if (userElements && userInfo.role === CUSTOMER) {
            const customerCare = { _id: 'customerCare', name: "Chăm sóc khác hàng", image: null };
            const bot = { _id: "bot", name: 'Trợ lý ảo', image: "http://res.cloudinary.com/websitebandienthoai/image/upload/v1621843345/blog/2021-05-24T08:02:24.316Z.jpg" }
            userElements.unshift(
                <View key={customerCare._id} style={styles.row}>
                    <Image style={{ width: 36, height: 36, borderRadius: 18 }} source={require('../../../assets/CSKH.jpg')}></Image>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => { this.onChoose(customerCare); }}><Text style={{ fontSize: 16 }}>{customerCare.name}</Text></TouchableOpacity>
                </View>
            );
            userElements.unshift(
                <View key={bot._id} style={styles.row}>
                    <Image style={{ width: 36, height: 36, borderRadius: 18 }} source={{ uri: bot.image }}></Image>
                    <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => { this.onChoose(bot); }}><Text style={{ fontSize: 16 }}>{bot.name}</Text></TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.containerMain}>
                <View style={styles.header}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}><Ionicons style={{ marginTop: 4 }} name="arrow-back-sharp" size={25} /></TouchableOpacity>
                        <Text style={styles.title}>Tin nhắn mới</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10
                    }}>
                        <Text style={{ fontSize: 18, marginLeft: 0 }}>Tới:</Text>
                        {this.state.to ? <Image style={{ width: 32, height: 32, borderRadius: 16, marginLeft: 15 }} source={this.state.image ? { uri: this.state.image } : require('../../../assets/CSKH.jpg')}></Image> : null}
                        <Text style={{ fontSize: 18, marginLeft: 10 }}>{this.state.name}</Text>
                    </View>
                </View>
                <ScrollView style={{ width: '100%', minHeight: '40%', padding: 10 }}>
                    {loading === true ? <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }}><Text>LOADING</Text></View> : userElements}
                </ScrollView>
                <View style={styles.bottomView}>
                    <TextInput
                        value={this.state.content}
                        placeholder="Nhập tin nhắn"
                        multiline={true}
                        style={styles.input}
                        onChangeText={(text) => this.onChange('content', text)}
                    />
                    <View style={{ width: '11%' }}>
                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.onSend}><Feather name="send" size={24} color='black' /></TouchableOpacity>
                    </View>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    containerMain: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        padding: 12,
        marginTop: 5,
        borderBottomColor: "black",
        borderBottomWidth: 0.2
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 15
    },
    bottomView: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row', padding: 10, justifyContent: 'space-between', alignItems: 'center'
    },
    row: {
        flexDirection: 'row', width: '100%',
        marginTop: 4, padding: 10, alignItems: 'center'
    },
    bottom: {
        flexDirection: 'row', width: '100%',
        marginTop: 4, justifyContent: 'center',
        marginBottom: 50
    },
    input: {
        height: 40,
        width: '89%',
        alignSelf: 'stretch',
        backgroundColor: '#F0F2F5',
        paddingLeft: 15,
        borderRadius: 40

    }
})

const mapStateToProps = state => {
    return {
        userInfoReducer: state.userInfoReducer,
        allUserReducer: state.allUserReducer,
        messengersReducer: state.messengersReducer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fectchAllUsers: () => dispatch(fectchAllUsersRequest()),
        sendMessageToBot: (content) => dispatch(sendMessageToBot(content)),
        sendMessageToUser: (to, content) => dispatch(sendMessageToUser(to, content, false))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(CreateMessengerScreen));
