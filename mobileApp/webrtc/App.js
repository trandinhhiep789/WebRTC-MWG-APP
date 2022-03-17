
import React from 'react';
import io from 'socket.io-client'
import { FlatList, StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import RoomCalling from "./src/components/RoomCalling"
import Avatar from './src/components/Avatar';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Separator = () => (
  <View style={styles.separator} />
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // this.serviceIP = 'http://10.152.82.207:8082/webrtcPeerOnlineUser'
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
        <View style={{ backgroundColor: "#1d4e89", padding: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <IconFontAwesome name="tasks" size={30} color="#ffce54" />
            <Text style={{ color: "#ffce54" }}>Meetup</Text>
            <IconFontAwesome name="users" size={25} color="#ffce54" />
          </View>
        </View>
        {this.state.requestCalling || this.state.acceptCalling ? (
          this.state.requestCalling ?
            <RoomCalling setStateCalling={this.setStateCalling} IdRoom={this.state.IdRequestToCall} />
            :
            <RoomCalling setStateCalling={this.setStateCalling} IdRoom={this.state.linkMeet} />) :
          <View>
            {this.state.isModalVisible ?
              // <View>
              //   <Text style={{ color: "orange", fontWeight: 'bold', fontSize: 15 }}>
              //     Bạn đang có cuộc gọi tới từ {this.state.nguoiGoiDen}
              //   </Text>
              //   <View style={{
              //     flexDirection: 'row',
              //     justifyContent: 'space-between'
              //   }}>
              //     <Button
              //       title="Trả lời"
              //       onPress={() => {
              //         this.setState({ isModalVisible: false })
              //         this.setState({ acceptCalling: true })
              //       }}
              //     />
              //     <Separator />
              //     <Button
              //       color="#f194ff"
              //       title="Từ chối"
              //       onPress={() => this.setState({ isModalVisible: false })}
              //     />
              //   </View>
              // </View>

              <View>
                <Text style={{ color: "orange", fontWeight: 'bold', fontSize: 15 }}>
                  Bạn đang có cuộc gọi tới từ {this.state.nguoiGoiDen}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around'
                }}>
                  <View
                    onPress={() => this.setState({ isModalVisible: false })}
                    style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: "red", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="phone-hangup" size={30} color="#fff" />
                  </View>
                  <View
                    onPress={() => {
                      this.setState({ isModalVisible: false })
                      this.setState({ acceptCalling: true })
                    }}
                    style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: "#0072B5", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconFontAwesome name="phone" size={30} color="#fff" />
                  </View>
                </View>
              </View>
              :
              <Text></Text>}
            < View >
              <Text style={{ color: "#0072B5", fontWeight: 'bold', fontSize: 15, paddingLeft: 10 }}>Mã ID của bạn: </Text>
              <Avatar bgColor="#42b5a6" fontColor="#fff" name={this.state.myId.substring(this.state.myId.indexOf("#") + 1, this.state.myId.length)} />
              <Text style={{ color: "#0072B5", fontWeight: 'bold', fontSize: 15, paddingLeft: 10 }}>Danh sách người dùng đang online: </Text>
              <FlatList
                data={this.state.listUserOnline}
                renderItem={({ item }) =>
                  <View>
                    <Avatar callUser={this.callUser} bgColor="#1d6f5a" fontColor="rgb(255, 206, 84)" style={styles.item} name={item.name} id={item.id} />
                  </View>
                }
              />
            </ View>
          </View >
        }
      </View>
    )
  }

}

export default ListUserOnline;