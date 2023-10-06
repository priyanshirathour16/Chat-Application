import { ViewIcon } from "@chakra-ui/icons";
import {
  IconButton,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Avatar,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Profile = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}> {children} </span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="40px" marginLeft="30%">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0px 50px 15px 50px">
            {/* <Image
              src={user.img}
              alt={user.name}
              borderRadius="full"
              // boxSize="150px"
            /> */}
            <Avatar
              boxSize="150px"
              bg="teal.500"
              cursor="pointer"
              name={user.name}
              src={user.img}
              fontSize="10px"
              marginLeft="27%"
            />
            <Text fontSize={{ base: "25px", md: "27px" }} paddingTop="10px">
              <span className="font-bold">Email</span> : {user.email}
            </Text>
            {/* <Text fontSize={{ base: "25px", md: "27px" }}>
              <span className="font-bold">Contact No:</span> {user.number}
            </Text> */}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
