import React, { useEffect, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import io from "socket.io-client";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import "./Style.css";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import Profile from "./Profile";
import UpdateGroupChatModel from "./UpdateGroupChatModel";
import axios from "axios";
import ScrollabelChat from "./ScrollabelChat";

const ENDPOINT = "http://localhost:8800";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { setSelectedChat, selectedChat, user, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // const [onlineId, setOnlineId] = useState("");
  // const [offlineId, setOfflineId] = useState("");

  // const userRecod = async (e) => {
  // e.preventDefault();
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${user.token}`,
  //   },
  // };
  //   var id = user._id;
  //   const { data } = await axios.get(`http://localhost:8800/userData/${id}`);
  //   socket.on("onlineUser", (data) => setOnlineId(data.user_id));
  //   socket.on("offlineUser", (data) => setOfflineId(data.user_id));
  //   console.log("this is", onlineId);
  //   setUserData(data);
  // };

  // useEffect(() => {
  //   userRecod();
  // });
  console.log("online user are -----------", onlineUsers);

  const fetchChat = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8800/chat/${selectedChat._id}`,
        config
      );
      console.log(message);
      setMessage(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast({
        title: " Error Occured !",
        description: "Failed to load the chats !",
        status: " error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  console.log("messages allll", message);
  console.log("new message", newMessage);

  useEffect(() => {
    socket = io(ENDPOINT, {
      auth: {
        token: user._id,
      },
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.emit("new-user-connected", user._id);
    // socket.on("get-user", (users) => {
    //   setOnlineUsers(users);
    // });
  }, [user]);

  useEffect(() => {
    socket.on("get-user", (users) => {
      users.map((user) => setOnlineUsers(user));
    });
  }, [user]);

  useEffect(() => {
    fetchChat();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageReceived]);
      }
    });
  });

  const handleInputMessage = async () => {
    if (newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage(" ");
        const { data } = await axios.post(
          "http://localhost:8800/chat",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("new message", data);
        setMessage([...message, data]);
      } catch (err) {
        toast({
          title: " Error Occured !",
          description: "Failed to load search result !",
          status: " error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };
  const typingHandler = (e) => {
    socket.emit("stop typing", selectedChat._id);
    setNewMessage(e.target.value);

    //Typing indicator logic----
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 8000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDIfference = timeNow - lastTypingTime;
      if (timeDIfference >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        // setIsTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            align="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {/* <div>
                  {userData.is_online && userData.is_online == "1" ? (
                    <span key={userData._id}>online...</span>
                  ) : (
                    <span key={userData._id}>offline...</span>
                  )}
                </div> */}
                <div>
                  {/* {onlineUsers.map((currUser) => {
                    return (
                      currUser._id !== selectedChat._id && (
                        <span> online...</span>
                      )
                    );
                  })} */}
                  {/* {onlineUsers == selectedChat._id && "online"} */}
                  {/* {selectedChat.users.includes(onlineUsers) ? "online" : " "} */}
                </div>

                <Box>
                  <i
                    class="fa-solid fa-phone"
                    style={{ fontSize: "20px", marginRight: "30px" }}
                  ></i>
                  <i
                    class="fa-solid fa-video"
                    style={{ fontSize: "20px", marginRight: "30px" }}
                  ></i>
                  <Profile user={getSenderFull(user, selectedChat.users)} />
                </Box>
              </>
            ) : (
              <>
                <>
                  {selectedChat.chatName.toUpperCase()}
                  {
                    <UpdateGroupChatModel
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchChat={fetchChat}
                    />
                  }
                </>
              </>
            )}
          </Text>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            bg="#E8E8E8"
            p={3}
            width="100%"
            height="100%"
            borderRadius="lg"
            borderWidth="1px"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                width="20"
                height="20"
                alignItems="center"
                margin="auto"
              />
            ) : (
              <div className="message">
                <ScrollabelChat message={message} />
              </div>
            )}

            <FormControl>
              {isTyping ? <div display="block">🔵🔵🔵</div> : <> </>}
              <Box display="flex">
                <Input
                  marginRight={4}
                  outline="none"
                  border="none"
                  bg="white"
                  placeholder="write a message ..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Button colorScheme="blue" onClick={handleInputMessage}>
                  <BsFillSendFill />
                </Button>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" height="100%">
          <Text fontSize="3xl" pb={3}>
            Select The User to Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
