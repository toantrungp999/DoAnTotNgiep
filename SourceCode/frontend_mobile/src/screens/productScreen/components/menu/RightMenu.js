import React, { Component } from 'react';
import { ListView } from 'react-native';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    ScrollView,

} from 'react-native';
import { SPECIAL_SEARCH, OPTION } from '../../../../../constants/ProductSearchTypes';
import { Button } from 'react-native-paper';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { convertNumberToVND } from '../../../../../extentions/ArrayEx';
import {
    fectchProductHomepagesRequest
} from '../../../actions/productActions';

class RightMenu extends Component {
    state = {
        min: 1,
        max: 2000000,
        option: 1
    }

    componentDidMount() {
        this.setState({ min: this.props.min, max: this.props.max,option:this.props.option })
    }
    navigate = (path, key, title) => {
        this.props.navigation.push('productScreen', { path, key, title });
    }

    onApply = () => {
        const { min, max, option } = this.state;
        this.props.changeFilter(min, max, option);
    }

    render() {
        const { min, max, option } = this.state;
        const {path} = this.props;
        let optionButtons = null;
        if (path !== 'hot-product' && path !== 'new-product' && path !== 'best-seller') //don't use filer for 3 paths
            optionButtons = OPTION.map((opt,index) => {
                return <Button style={styles.button} key={index} index={index}
                    labelStyle={styles.buttonLable}
                    color={'#00a2ff'}
                    mode={opt.key === option ? 'contained' : 'outlined'}
                    onPress={() => { this.setState({ option: opt.key }) }}
                >
                    {opt.name}
                </Button>
            })

        return (
            <View style={styles.container} >
                <Text style={styles.mainTitle}>Bộ lọc</Text>
                <View style={styles.section}>
                    <Text style={styles.title}>Giá:</Text>
                    <View style={styles.priceSection}>
                        <Text>{convertNumberToVND(min)}₫</Text>
                        <Text> - </Text>
                        <Text>{convertNumberToVND(max)}₫</Text>
                    </View>
                    <MultiSlider style={styles.slider}
                        values={[min, max]}
                        min={50000}
                        max={2000000}
                        step={50000}
                        sliderLength={200}
                        onValuesChange={(values) => { this.setState({ min: values[0], max: values[1] }) }}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Sắp xếp:</Text>

                    {optionButtons}
                </View>
                <Button
                    style={{ marginLeft: 20, marginRight: 20, marginTop: 30, paddingTop: 4, paddingBottom: 4 }}
                    color='#0d7ebf'
                    mode='contained'
                    onPress={() => this.onApply()}>
                    Áp dụng
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fafafa',
        paddingLeft: 20,
        paddingRight: 20,
    },
    mainTitle: {
        width: '100%',
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333333',
        paddingBottom: 12,
        paddingTop: 12,
        borderBottomWidth: 0.3,
        borderColor: '#ebebeb',
        textAlign: 'center'
    },
    section: {
        marginTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
        borderBottomWidth: 0.3,
        borderColor: '#ebebeb'
    },
    title: {
        fontSize: 16,
        color: '#444444',
        width: '100%',
        textAlign: 'left',
        paddingBottom: 12
    },
    priceSection: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: '70%',
        marginBottom: 10
    },
    buttonLable: {
        fontSize: 12
    }

});


export default (RightMenu);