/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert,Button, TouchableOpacity, Switch} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-ionicons'
import DeviceInfo from 'react-native-device-info';

export default class MapPage extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerStyle:{headerStyle: 'center'},
      title: 'Tracking',
    headerRight: (
      <View style={{flexDirection:'row'}}>
        <Text><Icon name="information-circle" style={{marginRight: 10}} onPress={params.toDetails} /></Text>
        <Switch
          onValueChange = {params.handleStop}
          value = {params.switch}
        />
      </View>
    )
    };
  };


  constructor(props){
    super(props);
    
    this.state = {
       routes: [],
       currentLat: 0,
       currentLng: 0,
       finalLat:0,
       finalLng:0,
       switch: false
    }

  }

getDeviceInfo(){
  DeviceInfo.getMACAddress().then(mac => {
      console.log(mac);
  });
}
  myCurrentLocation = ()=>{
    BackgroundGeolocation.getCurrentLocation((currentLocation)=>{
      console.log('My current location', currentLocation);
      this.setState({
        currentLat: currentLocation.latitude,
        currentLng: currentLocation.longitude
      })
    })
  }

  getAllLocations = ()=>{
    BackgroundGeolocation.getLocations((allLocations)=>{
      console.log('my all locations', allLocations)
      let x = [];
      allLocations.map((item,index)=>{
        console.log(item.latitude)
        x.push({latitude: item.latitude, longitude: item.longitude})
      })
      
      this.setState({
        routes : x
      })        

      console.log('routes after set', this.state.routes)
    })

    
  }
  
  componentDidMount() {
    this.props.navigation.setParams({ handleStop: this.stopTracking }); // for header functions
    this.props.navigation.setParams({switch: false})
    this.props.navigation.setParams({ toDetails: this.toDetails }); // for header functions
    this.getDeviceInfo();

    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationsEnabled: true,
      debug: false,
      startOnBoot: true,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.RAW_PROVIDER,
      interval: 5000,
      fastestInterval: 300,
      activitiesInterval: 5000,
      stopOnStillActivity: false,
      url: 'http://localhost:8100/location',
      httpHeaders: {
        'Content-Type': 'application/json'
      },
      // customize post properties
      postTemplate: {
        name: '@latitude'
      }
    });

    this.myCurrentLocation();

    
    this.getAllLocations();
    
    

  
 
    BackgroundGeolocation.on('location', (location) => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
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
    });
 
    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
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
 
  }
 
  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.removeAllListeners();
  }
  stopTracking=()=>{
    this.myCurrentLocation();
    if(this.state.switch == false){
      this.props.navigation.setParams({switch: true})
      this.setState({
        switch: true
      })
      BackgroundGeolocation.start(); 
    }else{
      this.props.navigation.setParams({switch: false})
      this.setState({
        switch: false
      })
      BackgroundGeolocation.stop();
    }

  }

  toDetails=()=>{
    this.props.navigation.push('Details')
  }



  render() {
    return (

      <MapView
        style={styles.map}
          region={{
            latitude: this.state.currentLat,
            longitude: this.state.currentLng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          
            
              <MapView.Marker
                coordinate={{latitude: this.state.currentLat, longitude: this.state.currentLng}}
              />
            
          
          <MapViewDirections
            origin={
              {
                latitude: this.state.currentLat,
                longitude: this.state.currentLng
              }
            }
            destination={
              this.state.routes[this.state.routes.length -1]
            }
            apikey={'AIzaSyBtGPJeKV8bZQuM73Yr97Q_FNKBqEnkDJ4'}
            strokeWidth={3}
            strokeColor="#000"
            waypoints={this.state.routes}
          />
          
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
