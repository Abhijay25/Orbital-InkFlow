import { useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Paper,
  TextField,
  Fab,
  Stack,
} from "@mui/material";
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../../styles/ChatInterface.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#0a0a0a",
      paper: "#1a1a1a",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

interface ChatInterfaceProps {
  setIsChat: React.Dispatch<React.SetStateAction<boolean>>,
}

function ChatInterface({ setIsChat }: ChatInterfaceProps): React.ReactElement | null {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setInput("");
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: userMessage.content,
        sessionId: sessionId.current
      }),
    });

    const responseData = await response.json();

    // AI response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          responseData.response || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const closeChat = (): void => {
    
    // Deletes the original session history
    fetch(`http://localhost:3001/api/chat/${sessionId.current}`, {
      method: "DELETE",
    }).catch(console.error);

    setIsChat(false);
  }

  const handleKeyPress = (e): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: Date): string => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="chat-container">
        <AppBar position="static" className="chat-header">
          <Toolbar>
            <Avatar className="header-avatar">
              <BotIcon />
            </Avatar>
            <Box className="header-content">
              <Typography variant="h6" component="div" className="header-title">
                AI Assistant
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="header-subtitle"
              >
                Always here to help
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} className="header-spacing">
              <IconButton color="inherit" onClick={closeChat}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Messages Area */}
        <Box className="messages-container">
          <Box className="messages-list">
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`message-wrapper ${message.type}`}
              >
                <Stack
                  direction={message.type === "user" ? "row-reverse" : "row"}
                  spacing={1}
                  alignItems="flex-end"
                  className={`message-stack ${message.type} message-spacing`}
                >
                  <Avatar className={`message-avatar ${message.type}`}>
                    {message.type === "user" ? (
                      <PersonIcon fontSize="small" />
                    ) : (
                      <BotIcon fontSize="small" />
                    )}
                  </Avatar>
                  <Box>
                    <Paper elevation={3} className="message-bubble">
                      <Typography variant="body2" className="message-content">
                        {message.content}
                      </Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      className={`message-timestamp ${message.type}`}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}

            {isTyping && (
              <Box className="typing-wrapper">
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="flex-end"
                  className="message-spacing"
                >
                  <Avatar className="message-avatar bot">
                    <BotIcon fontSize="small" />
                  </Avatar>
                  <Paper elevation={3} className="message-bubble">
                    <Box className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </Box>
                  </Paper>
                </Stack>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Input Area */}
        <Paper elevation={8} className="input-container">
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-end"
            className="input-stack"
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="chat-textfield"
            />
            <Fab
              color="primary"
              size="medium"
              onClick={handleSend}
              disabled={!input.trim()}
              className={`send-button ${input.trim() ? "active" : ""}`}
            >
              <SendIcon />
            </Fab>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default ChatInterface;
