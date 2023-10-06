import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/ChatComponents/SideDrawer";
import MyChats from "../Components/ChatComponents/MyChats";
import ChatBox from "../Components/ChatComponents/ChatBox";
import { Box } from "@chakra-ui/react";
const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className="bg-sky-400	 w-full">
      <Box>
        {user && <SideDrawer />}
        <div className="flex justify-between p-3">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </div>
      </Box>
    </div>
  );
};

export default Chat;
