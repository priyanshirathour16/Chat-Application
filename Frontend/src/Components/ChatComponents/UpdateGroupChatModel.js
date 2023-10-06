import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModel = ({ fetchAgain, setFetchAgain, fetchChat }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: " Only Admins Can DELETE The User !",
        status: " error ",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:8800/user/removeFromGroup",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchChat();
      setLoading(false);
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

  const renameHandle = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:8800/user/renameGroup",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
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
    setGroupChatName(" ");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:8800/search?search=${search}`,
        config
      );
      console.log(data);
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
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already Present !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: " Only Admins Can ADD The People !",
        status: " error ",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:8800/user/groupAdd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
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
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center" fontSize="35px">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap" p={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Rename group name..."
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                colorScheme="teal"
                ml="5px"
                onClick={renameHandle}
                isLoading={renameLoading}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user in group..."
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Box display="flex" justifyContent="center" pt={4}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </Box>
            ) : (
              searchResult
                ?.splice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleRemove(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModel;
