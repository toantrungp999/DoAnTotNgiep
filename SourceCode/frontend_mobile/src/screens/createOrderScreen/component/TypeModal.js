import React, {Component} from 'react';
import {Modal, Portal} from 'react-native-paper';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  convertNumberToVND,
  getStringDate,
} from '../../../../extentions/ArrayEx';

class TypeModal extends Component {
  render() {
    const {visible, type, options, hideModal, shipInfos} = this.props;
    let optionsList = null;
    if (type !== 'shipId') {
      optionsList = options
        ? options.map((option, index) => {
            return (
              <TouchableOpacity
                style={styles.row}
                key={index}
                index={index}
                onPress={() => {
                  this.props.changeType(type, option.value);
                }}>
                <Text style={styles.fontRow}>{option.label}</Text>
              </TouchableOpacity>
            );
          })
        : null;
    } else {
      optionsList = shipInfos ? (
        shipInfos.map((ship, index) => {
          return (
            <TouchableOpacity
              style={styles.rowShip}
              key={index}
              index={index}
              onPress={() => {
                this.props.changeType(type, index);
              }}>
              <View>
                <Text style={styles.shipName}>{ship.name}</Text>
                <View style={styles.shipBottom}>
                  <Text style={styles.shipFee}>
                    {convertNumberToVND(ship.shippingFee)}₫
                  </Text>
                  <Text style={styles.shipDate}>
                    Nhận: {getStringDate(ship.date * 1000)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3ea5e6" />
        </View>
      );
    }

    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
          animationType="slide">
          <View>
            <Text style={styles.title}>Chọn phương thức</Text>
          </View>
          <View>{optionsList}</View>
        </Modal>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingBottom: 15,
    fontWeight: 'bold',
  },
  row: {
    paddingTop: 18,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  rowTop: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderBottomColor: '#dddddd',
  },
  fontRow: {
    fontSize: 16,
  },

  rowShip: {
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },

  shipName: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 16,
  },

  shipBottom: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },

  shipFee: {
    color: '#444444',
  },

  shipDate: {
    marginLeft: 'auto',
    color: '#444444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 30,
  },
});

export default TypeModal;
