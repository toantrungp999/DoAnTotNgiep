import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import {Text, RadioButton} from 'react-native-paper';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import DateInput from '../../components/DateInput';
import BackButton from '../../components/BackButton';
import {theme} from '../../core/theme';
import {isValidLength, isValidDate} from '../../../extentions/ArrayEx';
import {
  fetchProfileRequest,
  updateProfileRequest,
  updateAvatarRequest,
} from '../../../actions/userActions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    let date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    this.state = {
      name: '',
      email: '',
      male: true,
      data: {},
      birthday: date,
      updateImage: false,
      isEditing: false,
      errors: {
        name: '',
        birthday: '',
      },
      isVisible: false,
    };
  }

  componentDidMount() {
    const {userProfile} = this.props.userProfileReducer;
    if (!userProfile || JSON.stringify(userProfile) === '{}') {
      this.props.fetchProfile();
    } else
      this.setState({
        name: userProfile.name,
        email: userProfile.email,
        birthday: userProfile.birthday || this.state.birthday,
        male:
          userProfile.male === true || userProfile.male === false
            ? userProfile.male
            : true,
        image: userProfile.image,
        oldImage: userProfile.image,
      });
  }

  checkValidate = (name, value) => {
    let errors = this.state.errors;
    switch (name) {
      case 'name':
        errors.name =
          value.length > 0 ? isValidLength(value, 6, 500).error : 'Chưa nhập';
        break;
      case 'birthday':
        errors.birthday = isValidDate(value) ? '' : 'Ngày sinh không hợp lệ';
        break;
      default:
    }
    this.setState({errors});
  };

  onUpdatePrifle = () => {
    if (this.validateForm(this.state.errors)) {
      const data = {
        name: this.state.name,
        birthday: this.state.birthday,
        male: this.state.male,
      };
      this.props.updateProfile(data);
    }
  };

  validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
  };

  componentDidUpdate(prevProps) {
    //userActionReducer
    if (
      this.props.userProfileReducer !== prevProps.userProfileReducer &&
      this.props.userProfileReducer.loading === false
    ) {
      const {userProfile} = this.props.userProfileReducer;
      if (userProfile && !this.state.name)
        this.setState({
          name: userProfile.name,
          email: userProfile.email,
          birthday: userProfile.birthday || this.state.birthday,
          male:
            userProfile.male === true || userProfile.male === false
              ? userProfile.male
              : true,
          image: userProfile.image,
          oldImage: userProfile.image,
        });
    }
    if (
      this.props.userActionReducer !== prevProps.userActionReducer &&
      this.props.userActionReducer.loading === false
    ) {
      const {
        changeAvatarSuccess,
        updateProfileSuccess,
      } = this.props.userActionReducer;
      if (changeAvatarSuccess === true)
        Alert.alert('Thông báo', 'Cập nhật ảnh bìa thành công');
      else if (updateProfileSuccess === true)
        Alert.alert('Thông báo', 'Cập nhật thông tin thành công');
    }
  }

  onChange = (name, value) => {
    this.checkValidate(name, value);
    this.setState({
      [name]: value,
    });
  };

  onShowModal = () => {
    this.setState({isVisible: !this.state.isVisible});
  };

  launchCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) console.log('User cancelled image picker');
      else if (response.error)
        console.log('ImagePicker Error: ', response.error);
      else if (response.customButton)
        console.log('User tapped custom button: ', response.customButton);
      else {
        const image = response.uri;
        this.setState({data: response, image});
        this.props.updateAvatar(response);
        this.onShowModal();
      }
    });
  };

  launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) console.log('User cancelled image picker');
      else if (response.error)
        console.log('ImagePicker Error: ', response.error);
      else if (response.customButton)
        console.log('User tapped custom button: ', response.customButton);
      else {
        const image = response.uri;
        this.setState({data: response, image});
        this.props.updateAvatar(response);
        this.onShowModal();
      }
    });
  };

  render() {
    const {message, loading} = this.props.userProfileReducer;
    const {
      updateProfileMessage,
      changeAvatarMessage,
    } = this.props.userActionReducer;
    return (
      <ScrollView style={{width: '100%'}}>
        <Background style={styles.containerMain}>
          <BackButton goBack={this.props.navigation.goBack} />
          <Header>Thông tin tài khoản</Header>
          {this.state.image && (
            <TouchableOpacity onPress={this.onShowModal}>
              <Image source={{uri: this.state.image}} style={styles.image} />
            </TouchableOpacity>
          )}
          <Modal
            transparent={true}
            visible={this.state.isVisible}
            onRequestClose={this.onCloseModel}>
            <View style={styles.bottomView}>
              <View>
                <TouchableOpacity
                  style={styles.rowModal}
                  onPress={this.launchCamera}>
                  <MaterialIcons name="photo-camera" size={20} />
                  <Text style={styles.textRowModal}>Chụp ảnh mới</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rowModal}
                  onPress={this.launchImageLibrary}>
                  <MaterialIcons name="photo" size={20} />
                  <Text style={styles.textRowModal}>Chọn ảnh từ thiết bị</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rowModal}
                  onPress={this.onShowModal}>
                  <MaterialIcons name="cancel" size={20} />
                  <Text style={styles.textRowModal}>Hủy bỏ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TextInput
            label="Tên"
            returnKeyType="next"
            value={this.state.name}
            onChangeText={text => this.onChange('name', text)}
            error={!!this.state.errors.name}
            errorText={this.state.errors.name}
          />
          <TextInput
            label="Email"
            returnKeyType="next"
            value={this.state.email}
            onChangeText={text => this.onChange('email', text)}
            error={!!this.state.errors.email}
            errorText={this.state.errors.email}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <View style={styles.row}>
            <View style={styles.col_35}>
              <Text style={{textAlign: 'center'}}>Ngày sinh:</Text>
            </View>
            <View style={{width: '65%'}}>
              <DateInput
                date={this.state.birthday}
                onChange={date => this.onChange('birthday', date)}
                error={!!this.state.errors.birthday}
                errorText={this.state.errors.birthday}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col_35}>
              <Text style={{textAlign: 'center'}}>Giới tính:</Text>
            </View>
            <View style={{width: '65%', marginTop: 12}}>
              <View style={styles.row}>
                <View style={styles.col_50_male}>
                  <RadioButton
                    value="Nam"
                    status={this.state.male ? 'checked' : 'unchecked'}
                    onPress={() => this.onChange('male', true)}
                  />
                  <Text style={{marginTop: 8}}>Nam</Text>
                </View>
                <View style={styles.col_50_male}>
                  <RadioButton
                    value="Nữ"
                    status={!this.state.male ? 'checked' : 'unchecked'}
                    onPress={() => this.onChange('male', false)}
                  />
                  <Text style={{marginTop: 8}}>Nữ</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={{color: 'red'}}>{message ? message : ''}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{color: 'red'}}>
              {updateProfileMessage ? updateProfileMessage : ''}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{color: 'red'}}>
              {changeAvatarMessage ? changeAvatarMessage : ''}
            </Text>
          </View>
          {loading ? (
            <Button mode="contained" style={{marginTop: 24}}>
              LOADING...
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={this.onUpdatePrifle}
              style={{marginTop: 24}}>
              Cập nhật
            </Button>
          )}
        </Background>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
  },
  bottom: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
    justifyContent: 'center',
    marginBottom: 50,
  },
  col_35: {
    width: '35%',
    marginTop: 25,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  col_50_male: {
    flexDirection: 'row',
    width: '50%',
    textAlignVertical: 'center',
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: 8,
    borderRadius: 55,
    borderColor: 'white',
    borderWidth: 3,
  },
  rowModal: {
    opacity: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  textRowModal: {
    fontSize: 18,
    paddingLeft: 15,
    fontWeight: 'bold',
    color: 'black',
  },
});

const mapStateToProps = state => {
  return {
    userProfileReducer: state.userProfileReducer,
    userInfoReducer: state.userInfoReducer,
    userActionReducer: state.userActionReducer,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchProfile: () => {
      dispatch(fetchProfileRequest());
    },
    updateProfile: profile => {
      dispatch(updateProfileRequest(profile));
    },
    updateAvatar: file => {
      dispatch(updateAvatarRequest(file));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
