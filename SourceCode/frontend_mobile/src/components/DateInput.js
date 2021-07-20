import React, { Component } from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../core/theme';
import { TextInput as Input } from 'react-native-paper';
import { formatDate } from './../../utils/datetime';

export default class DateInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date,
            mode: 'date',
            show: false,
        }
    }

    setDate = (event, date) => {
        date = date || this.state.date;
        this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
        });
        this.props.onChange(date);
    }

    render() {
        const { show, date } = this.state;

        return (
            <View style={styles.container}>

                { show ? <DateTimePicker value={date}
                    mode='date'
                    // is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
                    :
                    <Input
                        onFocus={() => { this.setState({ show: true }) }}
                        value={formatDate(date)}
                        style={styles.input}
                        selectionColor={theme.colors.primary}
                        underlineColor="transparent"
                        mode="outlined"
                        selectTextOnFocus={false}
                    />
                }
                {this.props.description && !this.props.errorText ? (
                    <Text style={styles.description}>{this.props.description}</Text>
                ) : null}
                {this.props.errorText ? <Text style={styles.error}>{this.props.errorText}</Text> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    input: {
        backgroundColor: theme.colors.surface,
    },
    description: {
        fontSize: 13,
        color: theme.colors.secondary,
        paddingTop: 8,
    },
    error: {
        fontSize: 13,
        color: theme.colors.error,
        paddingTop: 8,
    },
})