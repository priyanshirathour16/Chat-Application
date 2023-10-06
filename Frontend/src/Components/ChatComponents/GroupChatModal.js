import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast({
        title: "Please Filled All The Feilds !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:8800/user/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New group chat added !",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      console.log(err);
      toast({
        title: " Failed to Create Group Chat !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleGrpup = (userToadd) => {
    if (selectedUser.includes(userToadd)) {
      toast({
        title: " User Already Added  !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setSelectedUser([...selectedUser, userToadd]);
  };
  const handleDelete = (deleteUser) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== deleteUser._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user e.g john , jiya"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedUser.map((u) => (
                <UserBadgeItem
                  keys={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            ) : (
              searchResult
                ?.splice(0, 4)
                .map((user) => (
                  <UserListItem
                    keys={user._id}
                    user={user}
                    handleFunction={() => handleGrpup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
