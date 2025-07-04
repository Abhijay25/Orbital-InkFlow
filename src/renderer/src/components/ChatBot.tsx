import { Box } from "@mui/material";
import BotImage from "../../../../resources/bot.png";

function ChatBot(): React.ReactElement | null {

    const toggleChatBot = () => {
        console.log("toggle chatbot");
    }

    return (
        <>
            <Box
                component="img"
                src={BotImage}
                alt="ChatBot"
                sx={{
                    width: 50,
                    height: 50,
                    cursor: "pointer",
                    transform: "translate(-8px, 20px)",
                }}
                onClick={toggleChatBot}
            />
        </>
    )
}

export default ChatBot;