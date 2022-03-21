import React from 'react'
import { View, Text, Button } from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'

const Avatar = (props) => {
    return (
        <View style={{
            padding: 10,
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 50,
                backgroundColor: 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))',
                borderWidth: 2,
                borderColor: 'rgba(144, 202, 249, 0.46)',
            }}>
                <View style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flexDirection: 'row',
                    }}>
                        <View
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: props.bgColor,
                                width: 45,
                                height: 45,
                                borderRadius: 50,
                                marginRight: 5,
                                position: 'relative',
                            }}>
                            <Text style={{ color: props.fontColor }}>{props.name[0]}</Text>

                            <View
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    bottom: -4,
                                    right: -2,

                                    width: 20,
                                    height: 20,
                                    borderRadius: 50,
                                    backgroundColor: '#fff'
                                }}>
                                <View style={{
                                    width: 13,
                                    height: 13,
                                    borderRadius: 50,
                                    backgroundColor: 'green'
                                }}>

                                </View>
                            </View>
                        </View>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{props.name}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 15
                    }}
                >
                    {props.fontColor !== "#fff" ?
                        <View style={{ flexDirection: 'row' }}>
                            <IconFontAwesome style={{ marginRight: 15 }} onPress={() => props.callUser(props.id)} name="phone" size={25} color="#ffce54" />
                            <IconFontAwesome onPress={() => props.callUser(props.id)} name="video-camera" size={25} color="#ffce54" />
                        </View>
                        : <Text />}

                </View>
            </View>
        </View>
    )
}

export default Avatar