import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

export default class SearchBar extends Component {
  state = {
    searchResult: '',
  }

  render() {
    let { searchBar, onFilterElement } = this.props
    if (searchBar.enabled) {
      return (
        <>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: searchBar.backgroundColor,
                borderWidth: searchBar.borderSize,
                borderRadius: searchBar.rounding,
              },
            ]}
          >
            <View style={([styles.icon], {})}>
              <Icon
                size={24}
                name={searchBar.icon}
                styles={styles.icon}
                color={searchBar.iconColor}
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={styles.input}
                placeholder={searchBar.placeholderText}
                onChange={(e) => {
                  this.setState({ searchResult: e.target.value })
                  onFilterElement(e.target.value)
                }}
              />
            </View>
          </View>
        </>
      )
    } else {
      return <></>
    }
  }
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    height: 60,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
  },
  input: {
    flex: 0.95,
    height: 40,
    font: '18px',
  },
  icon: {
    justifyContent: 'center',
    flex: 0.05,
  },
})
