import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Button, Stack, useToast, Text, Avatar } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { format } from "timeago.js";

import {
  getSender,
  getSenderChats,
  getSenderChatsTime,
  getSenderImg,
  getSenderSender,
} from "../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8800";
var socket, selectedChatCompare;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats, user } = ChatState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  console.log("here user", onlineUsers);
  const toast = useToast();
  console.log("all chats", chats);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("http://localhost:8800/user", config);
      setChats(data);
      console.log("my chats", chats);
    } catch (err) {
      toast({
        title: "Error Occured !",
        description: "Failed to liad the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  useEffect(() => {
    socket = io(ENDPOINT, {
      auth: {
        token: user._id,
      },
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.emit("new-user-connected", user._id);
    socket.on("get-user", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        bg="white"
        p={3}
        height=" 87vh"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb="3px"
          px="3px"
          fontSize={{ base: "28px", md: "30px" }}
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              // colorScheme="blue"
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          p={3}
          display="flex"
          flexDirection="column"
          bg="#F8F8F8"
          width="100%"
          height="100%"
          overflow="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => {
                return (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "teal" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    marginRight={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text>
                      {!chat.isGroupChat ? (
                        <Box
                          display="flex"
                          justifyContent="start"
                          alignItems="center"
                        >
                          <Avatar
                            name={getSender(loggedUser, chat.users)}
                            src={getSenderImg(loggedUser, chat.users)}
                            size="sm"
                          />
                          <Box marginTop="4px" pl={3} width="100%">
                            <div
                              style={{
                                fontWeight: "bold",
                                textTransform: "capitalize",
                              }}
                            >
                              {getSender(loggedUser, chat.users)}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div style={{ fontSize: "14px" }}>
                                {chat.latestMessage &&
                                  getSenderChats(
                                    loggedUser,
                                    chat.users,
                                    chat.latestMessage
                                  )}
                              </div>
                              <div
                                style={{
                                  width: "100%",
                                  textAlign: "right",
                                  fontSize: "10px",
                                }}
                              >
                                {chat.latestMessage &&
                                  format(
                                    getSenderChatsTime(
                                      loggedUser,
                                      chat.users,
                                      chat.latestMessage
                                    )
                                  )}
                              </div>
                            </div>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          display="flex"
                          justifyContent="start"
                          alignItems="center"
                        >
                          <Avatar name={chat.chatName} src="" size="sm" />
                          <Box marginTop="4px" pl={3} width="100%">
                            <div
                              style={{
                                fontWeight: "bold",
                                textTransform: "capitalize",
                              }}
                            >
                              {chat.chatName}
                            </div>
                            {chat.latestMessage ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: "10px",
                                }}
                              >
                                <div style={{ fontSize: "14px" }}>
                                  <span>~</span>
                                  <span style={{ fontWeight: "bold" }}>
                                    {chat.latestMessage &&
                                      getSenderSender(
                                        loggedUser,
                                        chat.users,
                                        chat.latestMessage
                                      )}
                                  </span>{" "}
                                  <span>:</span>
                                  {chat.latestMessage &&
                                    getSenderChats(
                                      loggedUser,
                                      chat.users,
                                      chat.latestMessage
                                    )}
                                </div>
                                <div
                                  style={{
                                    width: "100%",
                                    textAlign: "right",
                                    fontSize: "10px",
                                  }}
                                >
                                  {chat.latestMessage &&
                                    format(
                                      getSenderChatsTime(
                                        loggedUser,
                                        chat.users,
                                        chat.latestMessage
                                      )
                                    )}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </Box>
                        </Box>
                      )}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
