import React, { Component } from 'react';
import { ListView } from 'react-native';
import {
    StyleSheet,
    View,
    FlatList,
    Text,
    ScrollView,

} from 'react-native';
import { List, Searchbar } from 'react-native-paper';

class LeftMenu extends Component {

    navigate = (path, key, title) => {
        this.props.navigate(path, key, title);
    }
    render() {
        const { categoryGroups } = this.props.categoryGroupsReducer;
        const menu = categoryGroups ? categoryGroups.map((group,index) => {
            const categoryMenu = group.categorys ? group.categorys.map(category => {
                return <List.Item style={styles.subItem} key={index} index={index}
                    title={category.name}
                    onPress={() => { this.navigate('category', category._id, category.name) }} />
            }) : null;
            return (
                <List.Accordion style={styles.item} key={index} index={index}
                    onLongPress={() => { this.navigate('category-group', group.categoryGroup._id, group.categoryGroup.name) }}
                    title={group.categoryGroup.name}>
                    {categoryMenu}
                </List.Accordion>
            )
        }) : null;
        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Searchbar style={styles.searchBar}
                    placeholder="Tìm kiếm"
                    onSubmitEditing={(e) => { (e.nativeEvent.text.trim()) && this.navigate('search', e.nativeEvent.text.trim(), e.nativeEvent.text.trim()) }}

                />
                <List.Item style={styles.item}
                    onPress={() => { this.navigate('all', 'a', 'Sản phẩm') }}
                    title='Tất cả sản phẩm'>
                </List.Item>
                <List.Item style={styles.item}
                    onPress={() => { this.navigate('hot-product', 'a', 'Sản phẩm nổi bật') }}
                    title='Sản phẩm nổi bật'>
                </List.Item>
                <List.Item style={styles.item}
                    onPress={() => { this.navigate('new-product', 'a', 'Sản phẩm mới') }}
                    title='Sản phẩm mới'>
                </List.Item>
                <List.Item style={styles.item}
                    onPress={() => { this.navigate('best-seller', 'a', 'Bán chạy') }}
                    title='Bán chạy'>
                </List.Item>
                <List.Item style={styles.item}
                    onPress={() => { this.navigate('sale-off', 'a', 'Giảm giá') }}
                    title='Giảm giá'>
                </List.Item>
                <List.Item style={styles.item}
                    onPress={() => { this.navigate('black-color', 'a', 'Everything Black') }}
                    title='Everything Black'>
                </List.Item>

                {menu}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fafafa'
    },
    searchBar: {

        marginTop: 10,
        marginLeft: 5,
        marginRight: 5
    },
    item: {
        borderBottomWidth: 0.3,
        borderBottomColor: '#eeeeff',
        paddingTop: 15,
        paddingBottom: 15
    },

    subItem: {
        paddingLeft: 30,
        borderBottomWidth: 0.3,
        borderBottomColor: '#eeeeff',
    }
});


export default (LeftMenu);