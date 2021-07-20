import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-community/picker';
import { Text, RadioButton } from 'react-native-paper';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import MyPicker from '../../components/MyPicker';
import DateInput from '../../components/DateInput';
import BackButton from '../../components/BackButton';
import { theme } from '../../core/theme';
import { registerRequest } from '../../../actions/userActions';
import { fetchCitiesRequest, fetchDistrictsRequest } from '../../../actions/locationActions';
import { isValidLength, isPhoneNumber, isEmail, isValidDate } from '../../../extentions/ArrayEx';
import { formatDate } from '../../../utils/datetime';

class RegisterScreen extends Component {

  constructor(props) {
    super(props);
    let date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    this.state = {
      name: { value: '', error: '' },
      email: { value: '', error: '' },
      phoneNumber: { value: '', error: '' },
      password: { value: '', error: '' },
      rePassword: { value: '', error: '' },
      birthday: { value: date, error: '' },
      male: { value: true, error: '' },
      cityId: { value: 1, error: '' },
      districtId: { value: -1, error: '' },
      wardId: { value: -1, error: '' },
      streetOrBuilding: { value: '', error: '' },
    }
  }

  componentDidMount() {
    this.props.fetchCities();
    this.props.fetchDistricts(this.state.cityId.value);
  }

  checkValidate = (name, value) => {
    switch (name) {
      case 'email':
        value.error = value.value.length > 0 ? isValidLength(value.value, 5, 255).error : 'Chưa nhập';
        if (value.error.length === 0)
          value.error = !isEmail(value.value) ? '' : 'Vui lòng nhập đúng email';
        break;
      case 'password':
        value.error = value.value.length > 0 ? isValidLength(value.value, 6, 255).error : 'Chưa nhập';
        break;
      case 'rePassword':
        value.error = value.value.length > 0 ? (value.value === this.state.password.value ? '' : 'Mật khẩu không trùng khớp') : 'Chưa nhập';
        break;
      case 'name':
        value.error = value.value.length > 0 ? isValidLength(value.value, 6, 500).error : 'Chưa nhập';
        break;
      case 'phoneNumber':
        value.error = isPhoneNumber(value.value) ? '' : 'Vui lòng nhập số điện thoại';
        break;
      case 'districtId':
        value.error = value.value !== -1 ? '' : 'Vui lòng chọn quận, huyện';
        break;
      case 'wardId':
        value.error = value.value !== -1 ? '' : 'Vui lòng chọn phường, xã';
        break;
      case 'streetOrBuilding':
        value.error = value.value.length > 0 ? isValidLength(value.value, 5, 500).error : 'Chưa nhập';
        break;
      case 'birthday':
        value.error = isValidDate(value.value) ? '' : 'Ngày sinh không hợp lệ';
        break;
      default:
    }
    return value;
  }

  findIndexById = (array, id) => {
    for (var i = array.length - 1; i >= 0; i--)
      if (Number(array[i].id) === Number(id))
        return i;
    return -1;
  }

  onSubmit = () => {
    let { name, email, password, rePassword, phoneNumber, cityId, districtId, wardId, birthday, male, streetOrBuilding } = this.state;
    password.value = password.value.trim();
    rePassword.value = rePassword.value.trim();
    streetOrBuilding.value = streetOrBuilding.value.trim();
    if (name.error || email.error || password.error || rePassword.error || birthday.error || streetOrBuilding.error || phoneNumber.error)
      return;
    if (password.value !== rePassword.value)
      return;
    let city, district, ward;
    let { cities } = this.props.citiesReducer;
    let index;
    if (cities) {
      index = this.findIndexById(cities, cityId.value);
      if (index >= 0)
        city = cities[index].name;
    }
    let { districts } = this.props.districtsReducer;
    if (districts) {
      index = this.findIndexById(districts, districtId.value);
      if (index >= 0)
        district = districts[index].name;
      let wards = districts.filter(district => Number(district.id) === Number(districtId.value)).map(district => district.wards);
      if (wards && wards.length > 0) {
        wards = wards[0];
        index = this.findIndexById(wards, wardId.value);
        if (index >= 0)
          ward = wards[index].name;
      }
    }
    if (city && district && ward) {
      const data = {
        email: email.value, password: password.value, name: name.value, phoneNumber: phoneNumber.value, birthday: formatDate(birthday.value), male: male.value,
        address: {
          city,
          district,
          ward,
          streetOrBuilding: streetOrBuilding.value
        }
      };
      this.props.register(data);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userInfoReducer !== prevProps.userInfoReducer) {
      const { userInfo } = this.props.userInfoReducer;
      if (userInfo)
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
    }
  }

  onChange = (name, value) => {
    value = this.checkValidate(name, value);
    if (name === 'cityId')
      this.props.fetchDistricts(value.value);
    this.setState({
      [name]: value
    });
  };

  render() {
    const { cities } = this.props.citiesReducer;
    let optionCities = cities ? cities.map((city, index) => {
      return <Picker.Item key={city.id} index={index} value={city.id} label={city.name}></Picker.Item>
    }) : null;

    const { districts } = this.props.districtsReducer;
    let optionDistricts = null;
    let optionWards = null;

    if (districts) {
      optionDistricts = districts.map((district, index) => {
        return <Picker.Item key={district.id} index={index} value={district.id} label={district.name}></Picker.Item>
      });
      let wards = districts.filter(district => Number(district.id) === Number(this.state.districtId.value)).map(district => district.wards);
      if (wards.length > 0)
        optionWards = wards[0].map((ward, index) => {
          return <Picker.Item key={ward.id} index={index} value={ward.id} label={ward.name}></Picker.Item>
        });
    }

    const { message, loading } = this.props.userRegisterReducer;
    return (
      <ScrollView style={{ width: '100%' }}>
        <Background>
          <BackButton goBack={this.props.navigation.goBack} />
          <Logo />
          <Header>Tạo tài khoản</Header>

          <TextInput
            label="Tên"
            returnKeyType="next"
            value={this.state.name.value}
            onChangeText={(text) => this.onChange('name', { value: text, error: '' })}
            error={!!this.state.name.error}
            errorText={this.state.name.error} />

          <TextInput
            label="Email"
            returnKeyType="next"
            value={this.state.email.value}
            onChangeText={(text) => this.onChange('email', { value: text, error: '' })}
            error={!!this.state.email.error}
            errorText={this.state.email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address" />

          <TextInput
            label="Số điện thoại"
            keyboardType="phone-pad"
            returnKeyType="next"
            value={this.state.phoneNumber.value}
            onChangeText={(text) => this.onChange('phoneNumber', { value: text, error: '' })}
            error={!!this.state.phoneNumber.error}
            errorText={this.state.phoneNumber.error} />

          <TextInput
            label="Mật khẩu"
            returnKeyType="next"
            value={this.state.password.value}
            onChangeText={(text) => this.onChange('password', { value: text, error: '' })}
            error={!!this.state.password.error}
            errorText={this.state.password.error}
            secureTextEntry />

          <TextInput
            label="Nhập lại mật khẩu"
            returnKeyType="next"
            value={this.state.rePassword.value}
            onChangeText={(text) => this.onChange('rePassword', { value: text, error: '' })}
            error={!!this.state.rePassword.error}
            errorText={this.state.rePassword.error}
            secureTextEntry />

          <View style={styles.row}>
            <View style={styles.col_35}><Text style={{ textAlign: 'center' }}>Ngày sinh:</Text></View>
            <View style={{ width: "65%" }}>
              <DateInput
                // returnKeyType="next"
                date={this.state.birthday.value}
                onChange={(date) => this.onChange('birthday', { value: date, error: '' })}
                error={!!this.state.birthday.error}
                errorText={this.state.birthday.error}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col_35}><Text style={{ textAlign: 'center' }}>Giới tính:</Text></View>
            <View style={{ width: "65%", marginTop: 12 }}>
              <View style={styles.row}>
                <View style={styles.col_50_male}>
                  <RadioButton
                    value="Nam"
                    status={this.state.male.value ? 'checked' : 'unchecked'}
                    onPress={() => this.onChange('male', { value: true, error: '' })}
                  />
                  <Text style={{ marginTop: 8 }}>Nam</Text>
                </View>

                <View style={styles.col_50_male}>
                  <RadioButton
                    value="Nữ"
                    status={!this.state.male.value ? 'checked' : 'unchecked'}
                    onPress={() => this.onChange('male', { value: false, error: '' })}
                  />
                  <Text style={{ marginTop: 8 }}>Nữ</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.row}><Text style={{ marginLeft: 10, marginTop: 15 }}>Địa chỉ nhận hàng</Text></View>
          
          <View style={styles.row}>
            <View style={styles.col_35}><Text style={{ textAlign: 'center' }}>Tỉnh:</Text></View>
            <View style={{ width: "65%" }}>
              <MyPicker
                label="cityId"
                selectedValue={this.state.cityId.value}
                onValueChange={(itemValue, itemIndex) => this.onChange('cityId', { value: itemValue, error: '' })}
                error={!!this.state.cityId.error}
                errorText={this.state.cityId.error}>
                {optionCities}
              </MyPicker>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col_35}><Text style={{ textAlign: 'center' }}>Quận/Huyện:</Text></View>
            <View style={{ width: "65%" }}>
              <MyPicker
                label="districtId"
                selectedValue={this.state.districtId.value}
                onValueChange={(itemValue, itemIndex) => this.onChange('districtId', { value: itemValue, error: '' })}
                error={!!this.state.districtId.error}
                errorText={this.state.districtId.error}>
                <Picker.Item value={-1} label="Chọn quận, huyện"></Picker.Item>
                {optionDistricts}
              </MyPicker>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col_35}><Text style={{ textAlign: 'center' }}>Phường/Xã:</Text></View>
            <View style={{ width: "65%" }}>
              <MyPicker
                label="wardId"
                selectedValue={this.state.wardId.value}
                onValueChange={(itemValue, itemIndex) => this.onChange('wardId', { value: itemValue, error: '' })}
                error={!!this.state.wardId.error}
                errorText={this.state.wardId.error}>
                <Picker.Item value={-1} label="Chọn phường, xã"></Picker.Item>
                {optionWards}
              </MyPicker>
            </View>
          </View>

          <TextInput
            label="Tòa nhà, tên đường"
            returnKeyType="next"
            value={this.state.streetOrBuilding.value}
            onChangeText={(text) => this.onChange('streetOrBuilding', { value: text, error: '' })}
            error={!!this.state.streetOrBuilding.error}
            errorText={this.state.streetOrBuilding.error} />
            
          <View style={styles.row}>
            <Text style={{ color: 'red' }}>{message ? message : ''}</Text>
          </View>

          {loading ?
            <Button
              mode="contained"
              style={{ marginTop: 24 }}>
              LOADING...
            </Button>
            :
            <Button
              mode="contained"
              onPress={this.onSubmit}
              style={{ marginTop: 24 }}>
              Sign Up
            </Button>}
          <View style={styles.bottom}>
            <Text>Bạn đã có tài khoản </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('LoginScreen')}>
              <Text style={styles.link}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </Background>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', width: '100%',
    marginTop: 4
  },
  bottom: {
    flexDirection: 'row', width: '100%',
    marginTop: 4, justifyContent: 'center',
    marginBottom: 50
  },
  col_35: {
    width: "35%", marginTop: 25
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  col_50_male: {
    flexDirection: 'row', width: '50%', textAlignVertical: 'center'
  }
})

const mapStateToProps = state => {
  return {
    districtsReducer: state.districtsReducer,
    citiesReducer: state.citiesReducer,
    userRegisterReducer: state.userRegisterReducer,
    userInfoReducer: state.userInfoReducer
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    register: (register) => {
      dispatch(registerRequest(register))
    },
    fetchCities: () => {
      dispatch(fetchCitiesRequest());
    },
    fetchDistricts: (id) => {
      dispatch(fetchDistrictsRequest(id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
