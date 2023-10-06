import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { format } from "timeago.js";
import {
  isSameSender,
  isLastMessage,
  // isSameSenderMargin,
} from "../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, Tooltip, ring } from "@chakra-ui/react";

const ScrollabelChat = ({ message }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {message &&
        message.map((m, i) => {
          return (
            <div style={{ display: "flex" }} key={m._id}>
              {(isSameSender(message, m, i, user._id) ||
                isLastMessage(message, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <>
                    <Avatar
                      name={m.sender.name}
                      src={m.sender.pic}
                      cursor="pointer"
                      size="sm"
                      mb="10px"
                      mr={1}
                    />
                  </>
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#5DADE2" : "pink"
                  }`,
                  borderRadius: "10px",
                  padding: "5px 15px",
                  maxWidth: "65%",
                  // marginLeft: isSameSenderMargin(message, m, i, user._id),
                  marginLeft: `${m.sender._id === user._id ? "auto" : ""}`,
                  marginBottom: "10px",
                  marginRight: "10px",
                }}
              >
                {m.content}
                <div
                  style={{
                    width: "100%",
                    textAlign: "right",
                    fontSize: "10px",
                    paddingRight: "0px",
                    paddingLeft: "auto",
                  }}
                >
                  {format(m.createdAt)}
                </div>
              </span>
            </div>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollabelChat;
