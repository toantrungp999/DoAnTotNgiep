import AsyncStorage from '@react-native-community/async-storage';

function GetItemFromStorage(name) {
    return AsyncStorage.getItem(name).then(data => {
        return data ? JSON.parse(data) : null;
    }).catch(error => {
        console.log(error.message);
        return null;
    });
}

function SetItemFromStorage(name, value) {
    AsyncStorage.setItem(name, JSON.stringify(value)).then().catch(error => {
        console.log(error.message);
    });
}

function ClearStorage() {
    AsyncStorage.clear().then().catch(error => {
        console.log(error.message);
    });
}

export { GetItemFromStorage, SetItemFromStorage, ClearStorage }