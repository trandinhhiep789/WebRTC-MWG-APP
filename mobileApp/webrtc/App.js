
import React from 'react';
import io from 'socket.io-client'
import { FlatList, StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

import RoomCalling from "./src/components/RoomCalling"

const Separator = () => (
  <View style={styles.separator} />
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 17,
    height: 50,
  },
  separator: {
    marginVertical: 4,
  },
});

class ListUserOnline extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      myId: '',
      nguoiGoiDen: '',
      linkMeet: '',
      acceptCalling: false,
      requestCalling: false,
      IdRequestToCall: 0,

      listUserOnline: [],
      isModalVisible: false,
    }

    // DONT FORGET TO CHANGE TO YOUR URL
    // this.serviceIP = 'http://192.168.1.11:8082/webrtcPeerOnlineUser'
    this.serviceIP = 'https://api-webrtc-mwg.herokuapp.com/webrtcPeerOnlineUser'

    // this.sdp
    this.socket = null
    // this.candidates = []
  }

  componentDidMount = () => {
    this.socket = io.connect(
      this.serviceIP,
      {
        path: '/io/webrtc',
        query: {
          username: ""
        }
      }
    )
    this.socket.on("myId", myId => {
      this.setState({ myId })
    })
    this.socket.emit('addUser', "hiep")
    this.socket.on("getUserOnline", userList => {
      console.log(userList)
      userList = userList.filter((user) => user.id !== this.state.myId)
      this.setState({ listUserOnline: userList })
    })
    this.socket.on("getLinkToCall", ({ senderId, link }) => {
      this.setState({ isModalVisible: true })
      console.log(senderId, link)
      this.setState({
        nguoiGoiDen: senderId,
        linkMeet: link,
      })
    })
  }

  setModalVisible = (visible) => {
    this.setState({ isModalVisible: visible });
  }

  makeid = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  callUser = (id) => {
    let id_room = this.makeid(7)
    id_room = "room/" + id_room
    this.setState({ IdRequestToCall: id_room });
    this.setState({ requestCalling: true });
    this.socket.emit('sendLinkToCall', {
      senderId: 'Nam Nguyen',
      receiverId: id,
      link: id_room
    })
  }

  setStateCalling = () => {
    this.setState({
      acceptCalling: false,
      requestCalling: false,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.requestCalling || this.state.acceptCalling ? (
          this.state.requestCalling ?
            <RoomCalling setStateCalling={this.setStateCalling} IdRoom={this.state.IdRequestToCall} />
            :
            <RoomCalling setStateCalling={this.setStateCalling} IdRoom={this.state.linkMeet} />) :
          <View>
            {this.state.isModalVisible ?
              <View>
                <Text style={{ color: "orange", fontWeight: 'bold', fontSize: 20 }}>
                  Bạn đang có cuộc gọi tới từ {this.state.nguoiGoiDen}
                </Text>
                <Separator />
                <Separator />
                <View>
                  <Button
                    title="Trả lời"
                    onPress={() => {
                      this.setState({ isModalVisible: false })
                      this.setState({ acceptCalling: true })
                    }}
                  />
                  <Separator />
                  <Button
                    color="#f194ff"
                    title="Từ chối"
                    onPress={() => this.setState({ isModalVisible: false })}
                  />
                </View>
              </View>
              :
              <Text></Text>}
            <Separator />
            <View>
              <Text style={{ color: "blue", fontWeight: 'bold', fontSize: 20 }}>Mã ID của bạn: </Text>
              <Text style={styles.item}>{this.state.myId.substring(this.state.myId.indexOf("#"), this.state.myId.length)}</Text>
              <Text style={{ color: "green", fontWeight: 'bold', fontSize: 20 }}>Danh sách người dùng đang online: </Text>
              <FlatList
                data={this.state.listUserOnline}
                renderItem={({ item }) =>
                  <Text onPress={() => { this.callUser(item.id) }} style={styles.item}>
                    {item.id.substring(item.id.indexOf("#"), item.id.length)}
                  </Text>
                }
              />
            </View>
          </View>
        }
      </View>
    )
  }

}

export default ListUserOnline;