/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import MapView from 'react-native-maps';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import MapViewDirections from 'react-native-maps-directions';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      markers: [{
        title: 'hello',
        coordinates: {
          latitude: 24.8654069,
          longitude: 67.0823004
        },
      },
      {
        title: 'avari',
        coordinates: {
          latitude: 24.8527251,
          longitude: 67.0301092
        },  
      }],

      routes: [{
        title: 'hello',
        coordinates: {
          latitude: 24.8654069,
          longitude: 67.0823004
        },
      },
      {
        title: 'avari',
        coordinates: {
          latitude: 24.8527251,
          longitude: 67.0301092
        },  
      }]
    }
  }

  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.RAW_PROVIDER,
      interval: 3000,
      fastestInterval: 1500,
      activitiesInterval: 5000,
      stopOnStillActivity: false,
      url: 'http://192.168.81.15:3000/location',
      httpHeaders: {
        'X-FOO': 'bar'
      },
      // customize post properties
      postTemplate: {
        lat: '@latitude',
        lon: '@longitude',
        foo: 'bar' // you can also add your own properties
      }
    });

  BackgroundGeolocation.start();
 
    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      console.log(location)
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });
 
    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      Actions.sendLocation(stationaryLocation);
    });
 
    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });
 
    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
      BackgroundGeolocation.getCurrentLocation((myLocation)=>{
        console.log('my locaiton ', myLocation);
      });
    });
 
    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });
 
    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
          ]), 1000);
      }
    });
 
    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
      BackgroundGeolocation.getCurrentLocation((myLocation)=>{
        console.log('my locaiton ', myLocation);
      });
    });
 
    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
      BackgroundGeolocation.getCurrentLocation((myLocation)=>{
        console.log('my locaiton foreground ', myLocation);
      });
    });
 
    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');
 
      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });
 
    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });
 
    // BackgroundGeolocation.checkStatus(status => {
    //   console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    //   console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    //   console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
 
    //   // you don't need to check status before start (this is just the example)
    //   if (!status.isRunning) {
    //    BackgroundGeolocation.start(); //triggers start on start event
    //   }
    // });
 
    // you can also just start without checking for status
    // BackgroundGeolocation.start();
  }
 
  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.removeAllListeners();
  }

  render() {
    return (
      <MapView
        style={styles.map}
          region={{
            latitude: 24.946218,
            longitude: 67.005615,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>

        <MapViewDirections
          origin={{latitude: 24.8654069, longitude: 67.0823004}}
          destination={{latitude: 24.8527251,longitude: 67.0301092}}
          apikey={'AIzaSyBtGPJeKV8bZQuM73Yr97Q_FNKBqEnkDJ4'}
          strokeWidth={3}
          strokeColor="hotpink"
        />

        {this.state.markers.map(marker => (
            <MapView.Marker 
              coordinate={marker.coordinates}
              title={marker.title}
            />
          ))}
        </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map:{
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1
  }
});
