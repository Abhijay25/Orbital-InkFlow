import { Box } from "@mui/material";
import { useState } from "react";
import BotImage from "../../../../../resources/bot.png";
import ChatInterface from "./ChatInterface";

function ChatBot(): React.ReactElement | null {
  const [chatIsOpen, setIsChat] = useState<boolean>(false);

  const toggleChatBot = (): void => {
    setIsChat((prev) => !prev);
  };

  return (
    <>
      <Box>
        <Box
          component="img"
          src={BotImage}
          alt="ChatBot"
          sx={{
            width: 50,
            height: 50,
            cursor: "pointer",
          }}
          onClick={toggleChatBot}
          data-testid="chat-button"
        />
      </Box>

      {/* Chat box: Toggle open and close */}
      {chatIsOpen ? <ChatInterface setIsChat={setIsChat} /> : <></>}
    </>
  );
}

export default ChatBot;
