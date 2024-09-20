import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import React, {Children} from 'react';
import {globalPath} from '../constants/globalpaths';

const Background = ({children}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={globalPath.background}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
};

export default Background;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
