import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions,Alert,Button, TouchableOpacity, FlatList, Image} from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import  GoogleStaticMap from 'react-native-google-static-map';
import Geocoder from 'react-native-geocoder';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

export default class Details extends Component {

    constructor(props){
        super(props);
        this.state = {
            oldLocations: [],
            dialog: false,
            address: '',
            addData: ''
        }
    }
componentDidMount(){
  //Geocoder.init('AIzaSyBtGPJeKV8bZQuM73Yr97Q_FNKBqEnkDJ4'); // use a valid API key
    BackgroundGeolocation.getLocations((lo)=>{
        this.setState({
            oldLocations: lo
        }) 
        console.log('asd',this.state.oldLocations);
    })
}

 getAddress = (lat, lng, item)=>{
   console.log('clicked')
    this.setState({
      dialog: true,
      addData: item
    })
      Geocoder.geocodePosition({lat: lat, lng: lng}).then(res => {
          // res is an Array of geocoding object (see below)
          console.log(res);
          this.setState({
            address: res[0].formattedAddress
          }) 
      })
      .catch(err => console.log(err))


}


 
render() {
    return (
        <View style={styles.container} >
        <Dialog
        style={{padding: 10}}
          visible={this.state.dialog}
          onTouchOutside={() => {
            this.setState({ dialog: false });
          }}
        >
          <DialogContent style={{padding: 10}}>
            
            <Text style={styles.name}>Id: {this.state.addData.id}</Text>
            <Text style={styles.data}>Latitude: {this.state.addData.latitude}</Text>
            <Text style={styles.data}>Longitude: {this.state.addData.longitude}</Text>
            <Text style={styles.data}>Address: {this.state.address}</Text>
          </DialogContent>
        </Dialog>
        <Text style={styles.h2text}>
          Visited Locations: 
        </Text>
          <FlatList 
          data={this.state.oldLocations}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({item,index}) =>
        <View key={index} style={styles.flatview}>
            <GoogleStaticMap
                latitude={item.latitude.toString()}
                longitude={item.longitude.toString()}
                zoom={13}
                size={{ width: 450 , height: 250 }}
                apiKey={'AIzaSyBtGPJeKV8bZQuM73Yr97Q_FNKBqEnkDJ4'}
            />
            
            
            <TouchableOpacity style={styles.email} onPress={()=>{this.getAddress(item.latitude, item.longitude, item) }}>
              <Text>Get Details</Text>
            </TouchableOpacity>
          </View>
        
        }
          

        />
          
      </View>
        
    );
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 10,
      justifyContent: 'center',
      marginLeft: 10,
      backgroundColor: '#F5FCFF',
    },
    h2text: {
      marginTop: 10,
      fontFamily: 'Helvetica',
      fontSize: 36,
      fontWeight: 'bold',
    },
    flatview: {
      paddingTop: 30,
      borderRadius: 2,
    },
    name: {
      fontFamily: 'Verdana',
      fontSize: 18
    },
    email: {
      color: 'red',
      backgroundColor: 'skyblue',
      alignItems: 'center',
      padding: 10,
      margin: 10
    },
    data:{
      fontSize: 16
    }
    
  });