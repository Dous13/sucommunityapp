import { View, Text, Image, Pressable, ScrollView } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { Link } from 'expo-router';

export default function LoginScreen() {
  return (
    <ScrollView style={{
        backgroundColor:Colors.WHITE,
        flex:1
    }}>
        <Image source={require('./../../assets/images/login.png')}
            style={{
                width:'100%',
                height: 400
            }}
        />
        <View style={{
            padding:20,
            display:'flex',
            alignItems:'center'
        }}>
            <Text style={{
                fontFamily:'coolvetica',
                fontSize:30,
                textAlign:'center'
            }}>Ready to Use the Community App?</Text>
            <Text style={{
                fontFamily:'coolvetica',
                fontSize:18,
                textAlign:'center',
                paddingTop: 5,
                color:Colors.GRAY
            }}>The SU Community App Help bring the Silliman Community Together!</Text>

            <Link href={"/login/signin"} style={{
                padding:14,
                marginTop:100,
                backgroundColor:Colors.PRIMARY,
                width:'100%',
                borderRadius:40,
                textAlign:'center'
            }}>
                <Text style={{
                    fontFamily:'coolvetica',
                    color:'white',
                    fontSize:20
                }}>Get Started</Text>
            </Link>   
        </View>
    </ScrollView>
  )
}