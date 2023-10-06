import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          background: "#3AB2AC",
          color: "white",
        }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        borderRadius="lg"
        px={3}
        py={2}
        mt={2}
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.img}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b> Email:</b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
