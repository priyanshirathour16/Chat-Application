import React, { useState } from "react";
import NotificationBadge, { Effect } from "react-notification-badge";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Spinner,
} from "@chakra-ui/react";

import {
  Input,
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Flex,
  Spacer,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";
import { getSender } from "../config/ChatLogics";
const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: " Please enter something in search !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8800/search?search=${search}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      setLoading(false);
      setSearchResult(data);
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
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:8800/user/chat",
        { userId },
        config
      );
      if (!chats.find((ch) => ch._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat("false");
      onClose();
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occured to fetching chats !",
        description: err.messsage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <Box
        alignItems="center"
        bg="white"
        p="5px 10px 5px 10px"
        m="5px"
        borderWidth="5px"
      >
        <Flex>
          <Tooltip
            label="Search User from here to chat !"
            hasArrow
            placement="bottom-end"
          >
            <Button colorScheme="teal" variant="ghost" onClick={onOpen}>
              <i class="fa-solid fa-magnifying-glass"></i>
              <Text d={{ base: "none", md: "flex" }} px="4">
                Search User
              </Text>
            </Button>
          </Tooltip>
          <Spacer />
          <div>
            <Menu>
              <MenuButton p={1} fontSize="lg">
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <i class="fa-solid fa-bell"></i>
              </MenuButton>
              <MenuList pl={3}>
                {!notification.length && "no new messages"}
                {notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `new messgaein ${notif.chat.chatName}`
                      : `new message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                bg="white"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                <Avatar
                  size="sm"
                  bg="teal.500"
                  cursor="pointer"
                  name={user.name}
                  src={user.img}
                />
              </MenuButton>
              <MenuList>
                <Profile user={user}>
                  <MenuItem>My Profile</MenuItem>
                </Profile>

                <MenuDivider />
                <MenuItem onClick={logoutHandler}> Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Flex>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" gap={2}>
              <Input
                placeholder="Type here..."
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <Button size="md" onClick={handleSearch} colorScheme="blue">
                search
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button>save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
