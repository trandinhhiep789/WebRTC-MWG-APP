
import React from 'react';
import io from 'socket.io-client'
import { FlatList, StyleSheet, View, Button, Pressable } from 'react-native';
import { color } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import RoomCalling from "./src/components/RoomCalling"
import Avatar from './src/components/Avatar';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import { IconButton, Dialog, Text } from 'react-native-paper';
import BackgroundService from 'react-native-background-actions';
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

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask titlessssss',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};
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
    this.serviceIP = 'http://192.168.1.6:8082/webrtcPeerOnlineUser' // o nha
    // this.serviceIP = 'https://api-webrtc-mwg.herokuapp.com/webrtcPeerOnlineUser'

    // this.sdp
    this.socket = null
    // this.candidates = []
  }

  alwaysConnect = () => {
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

  veryIntensiveTask = (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    new Promise((resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(i);
        this.alwaysConnect(delay);
      }
    });
  };

  componentWillUnmount = () => {

    BackgroundService.start(this.veryIntensiveTask, options);
    BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
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
        <View style={{ flex: 1 }}>
          {this.state.requestCalling || this.state.acceptCalling ? (
            this.state.requestCalling ?
              <RoomCalling setStateCalling={this.setStateCalling} IdRoom={this.state.IdRequestToCall} />
              :
              <RoomCalling setStateCalling={this.setStateCalling} IdRoom={this.state.linkMeet} />) :
            <View>
              <View style={{ backgroundColor: "#1d4e89", padding: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <IconFontAwesome name="tasks" size={30} color="#ffce54" />
                  <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: "#ffce54" }}>Meetup</Text>
                  </View>
                  <IconFontAwesome name="users" size={25} color="#ffce54" />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: "#0072B5", fontWeight: 'bold', fontSize: 15, paddingLeft: 10 }}>Mã ID của bạn: </Text>
                <Avatar bgColor="#42b5a6" fontColor="#fff" name={this.state.myId.substring(this.state.myId.indexOf("#") + 1, this.state.myId.length)} />
                <Text style={{ color: "#0072B5", fontWeight: 'bold', fontSize: 15, paddingLeft: 10 }}>Danh sách người dùng đang online: </Text>
                <FlatList
                  data={this.state.listUserOnline}
                  renderItem={({ item }) =>
                    <Avatar callUser={this.callUser} bgColor="#1d6f5a" fontColor="rgb(255, 206, 84)" style={styles.item} name={item.name} id={item.id} />
                  }
                />
              </ View>
            </View >}
        </View>
        <Dialog visible={this.state.isModalVisible} style={{ zIndex: 100, elevation: 100 }}>
          <Dialog.Title>Thông báo</Dialog.Title>
          <Dialog.Content>
            <View>
              <Text>
                Bạn đang có cuộc gọi tới từ {this.state.nguoiGoiDen}
              </Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <IconButton
                  icon="phone-hangup"
                  color="#fff"
                  style={{ backgroundColor: "red" }}
                  size={35}
                  onPress={() => this.setState({ isModalVisible: false })}
                />
                <IconButton
                  icon="phone"
                  color="#fff"
                  style={{ backgroundColor: "#0072B5" }}
                  size={35}
                  onPress={() => {
                    this.setState({ isModalVisible: false })
                    this.setState({ acceptCalling: true })
                  }}
                />
              </View>
            </View>
          </Dialog.Content>
        </Dialog>
      </View>
    )
  }

}
export default ListUserOnline;