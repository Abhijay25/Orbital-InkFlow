import { Box } from "@mui/material";
import { useContext, useState } from "react";
import BotImage from "../../../../../resources/bot.png";
import ChatInterface from "./ChatInterface";
import WindowSizeContext from "../Context/WindowSizeContext";

function ChatBot(): React.ReactElement | null {
  const [chatIsOpen, setIsChat] = useState<boolean>(false);

  const windowSizeContent = useContext(WindowSizeContext);

  const toggleChatBot = (): void => {
    if (chatIsOpen) {
      windowSizeContent?.setContentSize(79.5);
      windowSizeContent?.setToolBarSize(6.5);
    } else {
      windowSizeContent?.setContentSize(50);
      windowSizeContent?.setToolBarSize(36);
    }
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
