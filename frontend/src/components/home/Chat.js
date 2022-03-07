import React, { useEffect, useState } from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';
import * as chimeApi from '../classroom/utils/chime';
import {
  InfiniteList,
  ChatBubble,
  lightTheme,
  GlobalStyles,
  formatTime,
  ChatBubbleContainer,
  Input,
}
from 'amazon-chime-sdk-component-library-react';
import { ThemeProvider } from 'styled-components';
import * as Chime from 'aws-sdk/clients/chime';
import * as AWS from 'aws-sdk/global';
import appConfig from '../classroom/utils/chimeConfig';
import {
  ConsoleLogger,
  DefaultMessagingSession,
  LogLevel,
  MessagingSessionConfiguration,
}
from 'amazon-chime-sdk-js';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';
import { 
  addChattingToDB,
  getChattingFromDB
 } from '../classroom/utils/api';
import { Box } from '@awsui/components-react';

const Chat = (props) => {

  const [messageList, setMessageList] = useState([]);
  const [chatChannel, setChatChannel] = useState("");
  const [title, setTitle] = useState(props.title);
  const [owner, setOwner] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [member, setMember] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState(null);
  const [logger, setLogger] = useState(new ConsoleLogger('SDK', LogLevel.INFO));
  const [endpoint, setEndpoint] = useState(null);

  const user = useRecoilValue(userState);

  useEffect(() => {

    joinChat();

  }, []);

  const joinChat = async () => {

    console.log("CHAT DIDMOUNT");

    const userName = user.nickname;

    const memberArn = await chimeApi.createAppInstanceUser(userName);

    const chattingResponse = await getChattingFromDB(title);
    const chattingJson = chattingResponse.data.getChatting;

    try {
      console.log("Member ARN: " + memberArn)
      if (chattingJson) {
        const chattingData = JSON.parse(chattingJson.data);
        const ret = await chimeApi.createChannelMembership(chattingData.ChannelArn, memberArn);
        setChatChannel(chattingData.ChannelArn);
        setMember({
          userId: memberArn.split('/')[3],
          username: ret.Name,
        });
      } else {
        const chattingInfo = await chimeApi.createChannel(appConfig.appInstanceArn, title);
        console.log(chattingInfo)
        setChatChannel(chattingInfo.ChannelArn);
        await addChattingToDB(chattingInfo.ChannelArn, title, JSON.stringify(chattingInfo))
        const ret = await chimeApi.createChannelMembership(chattingInfo.ChannelArn, memberArn);
        setMember({
          userId: memberArn.split('/')[3],
          username: ret.Name,
        });
      }
      
    } catch (e) {
      console.log("ERROR!! ");
      console.log(e);
    }

    await initSession();
  }

  const initSession = async () => {
    const logger = new ConsoleLogger('SDK', LogLevel.INFO);
    const endpoint = await chimeApi.getMessagingSessionEndpoint();

    const userArn = chimeApi.createMemberArn(member.userId);
    const sessionId = null;
    AWS.config.credentials = new AWS.Credentials(
      appConfig.accessKeyId, appConfig.secretAccessKey
    );
    const chime = new Chime({
      region: appConfig.region,
    });
    const configuration = new MessagingSessionConfiguration(userArn, sessionId, endpoint.Endpoint.Url, chime, AWS);
    const messagingSession = new DefaultMessagingSession(configuration, logger);
    const observer = {
      messagingSessionDidStart: () => {
        console.log('Session started');
      },
      messagingSessionDidStartConnecting: reconnecting => {
        if (reconnecting) {
          console.log('Start reconnecting');
        }
        else {
          console.log('Start connecting');
        }
      },
      messagingSessionDidStop: event => {
        console.log(`Closed: ${event.code} ${event.reason}`);
        messagingSession.stop()
      },
      messagingSessionDidReceiveMessage: message => {
        console.log(`Receive message type ${message.type}`);
        if (message.type == 'CREATE_CHANNEL_MESSAGE'){
          const msg = JSON.parse(message.payload)
          console.log(msg);
          if (msg !== null && msg.Sender.Name !== member.userName) {
            addMessageList(msg, msg.Content, "incoming");
          }
        }
      }
    };
    messagingSession.addObserver(observer);
    messagingSession.start();
  }

  const sendMessage = async (msg) => {
    try {
      console.log("SENDMSG : " + msg);
      console.log("ChannelARN: " + chatChannel);
      console.log("member: ");
      console.log(member);
      const ret = await chimeApi.sendChannelMessage(chatChannel, msg, member)
      console.log(ret);
      await addMessageList(ret, msg, "outgoing");
    }
    catch (e) {
      console.log("send msg ERROR");
      console.log(e);
    }

  }

  const addMessageList = async (msg, content, variant) => {
    let Messages = messageList;
    const index = Messages.length;

    setIsLoading(true);

    Messages.push(
      <ChatBubbleContainer
        timestamp={formatTime(msg.CreatedTimestamp)}
        css="margin: 1rem;"
        key={`message${index.toString()}`}
      >
        <ChatBubble
            variant={variant}
            senderName={msg.Sender.Name}
            showName={true}
            showTail={true}
        > {content} </ChatBubble>
    </ChatBubbleContainer>
    );

    setIsLoading(false);
  }

  const getMessages = async () => {
    let Messages = messageList;
    
    const userName = user.nickname;
    console.log("NAME!!!!: " + userName);

    setIsLoading(true);
    console.log("GET MESSAGE!!!")
    try {

      console.log(chatChannel);

      let messageList = await chimeApi.listChannelMessages(chatChannel, userName, nextToken);
      console.log("messages: ");
      console.log(messageList);
      console.log(messageList.length);
      messageList.Messages.map((msg, index) => {
        let variant = "incoming";
        if (msg.Sender.Name === userName) {
          variant = "outgoing"
        }
        console.log(variant);
        Messages.push(
          <ChatBubbleContainer
                timestamp={formatTime(msg.CreatedTimestamp)}
                css="margin: 1rem;"
                key={`message${index.toString()}`}
              >
                <ChatBubble
                    variant={variant}
                    senderName={msg.Sender.Name}
                    showName={true}
                    showTail={true}
                > {msg.Content} </ChatBubble>
            </ChatBubbleContainer>
        );
      });
    }
    catch (e) {
      console.log("ERROR!!! GET MESSAGE!!");
      console.log(e);
    }

    setIsLoading(false);

    return Messages;
  }

  const handleChange = (e) => {
    setChatMsg(e.target.value)
  }

  const handleClick = () => {
    console.log("CHAT!!: " + chatMsg)
    if (chatMsg !== '') {
      sendMessage(chatMsg);
      console.log("NOT NULL");
    }
    setChatMsg("");
  }

  const handleKeyPress = (e) => {
    e.stopPropagation()
    console.log(e.key);
    if (e.key === 'Enter') { handleClick(); }
  };

  const handleScrollTop = async () => {
    console.log("handleScrollTop");
    setIsLoading(true);
    const messageList = await getMessages();
    setMessageList(messageList); 
    setIsLoading(false);
  };


  return (
    <div style={{height: '100%'}}>
        <h2>Chatting</h2>
        <ThemeProvider theme={lightTheme}>
            <GlobalStyles />
              <InfiniteList
                style={{ display: 'flex', flexGrow: '1', height: '80vh' }}
                items={messageList}
                onLoad={handleScrollTop}
                isLoading={isLoading}
                css="border: 1px solid #D3D3D3;"
                className="chat-message-list"
                />
        
          <Segment>
            <Form>
              <Form.Field>
                <Input 
                  style={{display: 'flex', flexGlow: '1', width: '100%'}}
                  name="chatMsg"
                  autocomplete="off" 
                  value={chatMsg} 
                  placeholder='Type your message' 
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  />
              </Form.Field>

            </Form>
          </Segment>
        </ThemeProvider>
      </div>
    );
};

export default Chat;
