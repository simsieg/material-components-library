import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import { RippleFeedback, IconToggle } from '@protonapp/react-native-material-ui'

export default class SimpleList extends Component {
  static defaultProps = {
    items: [],
  }
  state = {
    fullWidth: 0,
  }
  handleLayout = ({ nativeEvent }) => {
    const { width } = (nativeEvent && nativeEvent.layout) || {}
    const { fullWidth: prevWidth } = this.state

    if (width !== prevWidth) {
      this.setState({ fullWidth: width })
    }
  }

  renderHeader() {
    let { listHeader, background } = this.props
    if (!listHeader || !listHeader.header || !listHeader.enabled) {
      return null
    }
    let space = 0
    if (background && background.enabled) {
      space = 10
    }

    return (
      <>
        <Text style={styles.header}>{listHeader.header}</Text>
        <View style={{ height: space }}></View>
      </>
    )
  }

  render() {
    let {
      items,
      dividerType,
      dividerColor,
      background,
      listHeader,
    } = this.props

    let wrap = [styles.wrapper]
    if (background && background.enabled) {
      let {
        backgroundColor,
        border,
        borderSize,
        borderColor,
        rounding,
        shadow,
      } = background
      wrap.push({ backgroundColor: backgroundColor, borderRadius: rounding })
      if (border) {
        wrap.push({ borderWidth: borderSize, borderColor: borderColor })
      }
      if (shadow) {
        wrap.push({
          shadowColor: '#000000',
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.15,
          shadowRadius: 10,
        })
      }
    } else {
      if (listHeader && listHeader.enabled) {
        wrap.push({ paddingTop: 4 })
      } else {
        wrap.push({ paddingTop: 8 })
      }
    }

    return (
      <>
        {this.renderHeader()}
        <View style={wrap} onLayout={this.handleLayout}>
          {items.map((itm, i) => (
            <Row
              {...itm}
              key={itm.id}
              dividerType={dividerType}
              dividerColor={dividerColor}
              lastRow={i === items.length - 1}
              fullWidth={this.state.fullWidth}
            />
          ))}
        </View>
      </>
    )
  }
}

class Row extends Component {
  getWidthLimit() {
    let { leftSection, rightSection, fullWidth } = this.props
    let leftSectWidth = 0
    let rightSectWidth = 0

    if (leftSection && leftSection.enabled) {
      if (leftSection.type === 'image') {
        leftSectWidth = 72
      } else {
        leftSectWidth = 56
      }
    }
    if (rightSection && rightSection.enabled) {
      rightSectWidth = 36
    }
    return fullWidth - leftSectWidth - rightSectWidth - 32
  }

  getDividerInset() {
    let { dividerType, leftSection } = this.props

    if (dividerType !== 'inset') {
      return 0
    }

    let baseInset = 16

    if (!leftSection || !leftSection.enabled) {
      return baseInset
    }

    if (leftSection.type === 'icon' || leftSection.type === 'avatar') {
      return baseInset * 2 + 40
    }

    if (leftSection.type === 'image') {
      return baseInset * 2 + 56
    }

    return 0
  }

  getDividerStyles() {
    let { dividerColor } = this.props

    if (!dividerColor) {
      dividerColor = '#e0e0e0'
    }

    return {
      left: this.getDividerInset(),
      backgroundColor: dividerColor,
    }
  }

  hasDivider() {
    let { dividerType, lastRow } = this.props

    if (!lastRow && dividerType && dividerType !== 'none') {
      return true
    }

    return false
  }

  renderLeftSection() {
    let { leftSection } = this.props
    if (!leftSection || !leftSection.enabled) {
      return null
    }

    let source = leftSection.image

    if (leftSection.type === 'icon') {
      //56
      return (
        <View style={styles.iconWrapper} pointerEvents="none">
          <Icon
            size={24}
            name={leftSection.icon}
            color={leftSection.iconColor}
          />
        </View>
      )
    }

    if (leftSection.type === 'avatar') {
      //56
      return (
        <Image
          resizeMode="cover"
          source={source}
          style={styles.avatar}
          pointerEvents="none"
        />
      )
    }

    if (leftSection.type === 'image') {
      //72
      return (
        <Image
          resizeMode="cover"
          source={source}
          style={styles.image}
          pointerEvents="none"
        />
      )
    }
  }

  renderRightSection() {
    let { rightSection } = this.props

    if (!rightSection || !rightSection.enabled) {
      return null
    }

    let iconStyles = { marginRight: -12 }

    if (rightSection.icon) {
      return (
        <IconToggle
          name={rightSection.icon}
          color={rightSection.iconColor}
          underlayColor={rightSection.iconColor}
          maxOpacity={0.3}
          size={24}
          onPress={rightSection.onPress}
          style={{ container: iconStyles }}
        />
      )
    }

    return null
  }

  renderContent() {
    let { leftSection, firstLine, secondLine } = this.props
    let hasDivider = this.hasDivider()

    return (
      <View style={styles.row}>
        {this.renderLeftSection()}
        <View style={styles.main} pointerEvents="none">
          <FirstLine {...firstLine} widthLimit={this.getWidthLimit()} />
          {secondLine && secondLine.enabled ? (
            <SecondLine {...secondLine} widthLimit={this.getWidthLimit()} />
          ) : null}
        </View>
        {this.renderRightSection()}
        {hasDivider ? (
          <View style={[styles.divider, this.getDividerStyles()]} />
        ) : null}
      </View>
    )
  }

  render() {
    let { onPress } = this.props

    if (onPress) {
      return (
        <View style={styles.rowWrapper}>
          <RippleFeedback onPress={onPress}>
            {this.renderContent()}
          </RippleFeedback>
        </View>
      )
    }

    return <View style={styles.rowWrapper}>{this.renderContent()}</View>
  }
}

class FirstLine extends Component {
  static defaultProps = {
    text: '',
    color: '#212121',
  }
  render() {
    let { text, color, titleLineNum, widthLimit } = this.props
    let breakless = text.replace(/(\r\n|\n|\r)/gm, '')

    let propStyles = { color: color }
    let titleLimit = widthLimit / 7.7
    if (titleLineNum == 2) {
      if (breakless.length > titleLimit) {
        const firstLine = breakless.substring(0, titleLimit + 1)
        const i = firstLine.lastIndexOf(' ')
        return (
          <View style={styles.titleContainer}>
            <Text style={[styles.firstLine, propStyles]}>
              {breakless.substring(0, i + 1)}
            </Text>
            <Text
              style={[styles.firstLine, propStyles]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {breakless.substring(i + 1)}
            </Text>
          </View>
        )
      } else {
        return (
          <View style={styles.titleContainer}>
            <Text style={[styles.firstLine, propStyles]}>{breakless}</Text>
          </View>
        )
      }
    }

    if (titleLineNum > 2) {
      return (
        <Text style={[styles.firstLine, propStyles]} ellipsizeMode="tail">
          {breakless}
        </Text>
      )
    }

    return (
      <Text
        style={[styles.firstLine, propStyles]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {breakless}
      </Text>
    )
  }
}

class SecondLine extends Component {
  static defaultProps = {
    text: '',
    color: '#757575',
  }

  render() {
    let { text, color, subtitleLineNum, widthLimit } = this.props
    let propStyles = { color: color }
    let subtitleLimit = widthLimit / 7
    let breakless = text.replace(/(\r\n|\n|\r)/gm, '')
    if (subtitleLineNum == 2) {
      if (breakless.length > subtitleLimit) {
        const firstLine = breakless.substring(0, subtitleLimit + 1)
        const i = firstLine.lastIndexOf(' ')
        return (
          <View style={styles.titleContainer}>
            <Text style={[styles.secondLine, propStyles]}>
              {breakless.substring(0, i + 1)}
            </Text>
            <Text
              style={[styles.secondLine, propStyles]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {breakless.substring(i + 1)}
            </Text>
          </View>
        )
      } else {
        return (
          <View style={styles.titleContainer}>
            <Text style={[styles.secondLine, propStyles]}>{breakless}</Text>
          </View>
        )
      }
    }
    if (subtitleLineNum > 2) {
      return (
        <Text style={[styles.secondLine, propStyles]} ellipsizeMode="tail">
          {breakless}
        </Text>
      )
    }

    return (
      <Text
        style={[styles.secondLine, propStyles]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {breakless}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  row: {
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 1,
  },
  iconWrapper: {
    marginRight: 32,
    width: 24,
    height: 24,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginTop: 16,
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  avatar: {
    marginRight: 16,
    borderRadius: 20,
    height: 40,
    width: 40,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#ccc',
  },
  image: {
    marginRight: 16,
    marginTop: 8,
    marginBottom: 8,
    height: 56,
    width: 56,
    backgroundColor: '#ccc',
  },
  main: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  firstLine: {
    lineHeight: 20,
    fontSize: 16,
  },
  secondLine: {
    lineHeight: 18,
    marginTop: 2,
    fontSize: 14,
    maxWidth: '100%',
  },
  titleContainer: {},
})
