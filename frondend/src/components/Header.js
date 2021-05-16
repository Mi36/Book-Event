import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../styles/Colors';

const Header = ({pageName, onBack, backButtonInvisible}) => {
  return (
    <View style={styles.container}>
      {backButtonInvisible ? null : (
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.backBtnStyle}
          onPress={onBack}></TouchableOpacity>
      )}
      <View style={styles.pageNameStyles}>
        <Text>{pageName}</Text>
      </View>
    </View>
  );
};

export default Header;

Header.propTypes = {
  pageName: PropTypes.string,
  onBack: PropTypes.func,
  backuttonInvisible: PropTypes.bool,
};
Header.defaultProps = {
  pageName: 'Page Name',
  onBack: null,
  backButtonInvisible: false,
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: Colors.pink4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  backBtnStyle: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.purple,
  },
  pageNameStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
