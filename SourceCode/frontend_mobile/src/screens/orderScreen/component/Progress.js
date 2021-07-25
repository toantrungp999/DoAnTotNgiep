import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {List} from 'react-native-paper';
import {formatDate} from '../../../../extentions/ArrayEx';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class Progress extends Component {
  render() {
    const {orderType, paymentType, receiveType} = this.props.orderInfo;
    const logs = this.props.orderInfo.actionLog;
    const items = logs
      ? logs.map((log, index) => {
          var date = formatDate(log.date);
          var description = log.description;
          return (
            <View style={styles.item} key={index} index={index}>
              <View style={styles.icon}></View>
              <View>
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.action}>{log.action}</Text>
                {description ? (
                  <Text style={styles.description}>{description}</Text>
                ) : null}
                {index === 0 ? (
                  <>
                    <Text style={styles.description}>{orderType}</Text>
                    <Text style={styles.description}>{paymentType}</Text>
                    <Text style={styles.description}>{receiveType}</Text>
                  </>
                ) : null}
              </View>
            </View>
          );
        })
      : null;
    return (
      <List.Accordion
        style={styles.container}
        title="Thông tin đặt hàng"
        titleStyle={styles.titleStyle}
        left={props => (
          <MaterialIcons
            name="info-outline"
            outlined
            color="#49a358"
            size={25}
          />
        )}>
        {items}
      </List.Accordion>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 0,
    marginLeft: 0,
    color: '#49a358',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 0,
    paddingLeft: 30,
    marginBottom: 10,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 15,
    backgroundColor: '#06c700',
    borderRadius: 30,
    marginTop: 3,
  },
  date: {
    color: '#777777',
    fontSize: 13,
  },
  action: {
    marginTop: 0,
  },
  description: {
    color: '#777777',
    fontSize: 13,
    marginTop: 2,
  },
});

export default Progress;
