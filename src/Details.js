import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Dimensions,Alert,Button, TouchableOpacity, FlatList, Image} from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import  GoogleStaticMap from 'react-native-google-static-map';
import {
  StaticGoogleMap,
  Marker,
  Path,
} from 'react-static-google-map';


const {height, width} = Dimensions.get('window');

export default class Details extends Component {

    constructor(props){
        super(props);
        this.state = {
            oldLocations: []
        }
    }
componentDidMount(){
    BackgroundGeolocation.getLocations((lo)=>{
        this.setState({
            oldLocations: lo
        })
        console.log('asd',this.state.oldLocations);
    })
}
render() {
    return (
        <View style={styles.container} >
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
                latitude={item.longitude.toString()}
                longitude={item.latitude.toString()}
                zoom={13}
                size={{ width: 450 , height: 250 }}
                apiKey={'AIzaSyBtGPJeKV8bZQuM73Yr97Q_FNKBqEnkDJ4'}
            />
            
            <Text style={styles.name}>{item.id}</Text>
            <Text style={styles.email}>{item.longitude}</Text>
            <Text style={styles.email}>{item.latitude}</Text>
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
      color: 'red'
    }
    
  });