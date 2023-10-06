import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={3}
      variant="solid"
      fontSize={12}
      colorScheme="teal"
      bg="teal"
      cursor="poninter"
      onClick={handleFunction}
      color="white"
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
