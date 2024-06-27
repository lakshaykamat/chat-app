import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { ChatState } from "@/context/ChatProvider";
import axiosInstance from "@/lib/axios";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import GroupChatModal from "../home/GroupChatModal";
import io from "socket.io-client";
import ScrollableFeed from "react-scrollable-feed";

const END_POINT = "http://localhost:5000";
var socket, selectedChatCompare;
// Helper Functions
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const getSenderName = (loggedInUser, users) => {
  if (!users || !loggedInUser) return;
  return users[0]._id === loggedInUser._id ? users[1].name : users[0].name;
};

const getSenderAvatar = (loggedInUser, users) => {
  if (!users || !loggedInUser) return;
  return users[0]._id === loggedInUser._id ? users[1].avatar : users[0].avatar;
};

// ChatItem Component
const ChatItem = ({ content, name, avatar, onClick, color = "" }) => (
  <Card
    onClick={onClick}
    className={`flex items-center gap-3 p-3 mb-2 ${color}`}
  >
    <img className="max-w-[50px] rounded-full" src={avatar} alt={name} />
    <div className="flex flex-col">
      <h3 className="text-md">{name}</h3>
      <div>
        <p className="text-xs">{content}</p>
      </div>
    </div>
  </Card>
);

// Header Component
const Header = () => (
  <div className="flex justify-between">
    <h1 className="mb-3 text-3xl font-bold">Chats</h1>
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Group Chat</span>
          <Plus strokeWidth={1.2} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-3xl font-bold mb-7">
          Create Group Chat
        </DialogTitle>
        <GroupChatModal />
      </DialogContent>
    </Dialog>
  </div>
);

// ChatSection Component
const ChatSection = ({
  chats,
  input,
  setSocketConnection,
  setInput,
  sendMessage,
  messages,
  selectedChat,
  handleChatClick,
  handleTyping,
  user,
  getSenderName,
  getSenderAvatar,
}) => {

  return (
    <div className={`gap-3 flex h-[80vh] items-stretch`}>
      <ScrollArea
        className={`${
          selectedChat ? "hidden md:block" : "block"
        } rounded overflow-y-scroll w-full md:w-[300px] no-scrollbar`}
      >
        {chats ? (
          chats.map((chat) => (
            <ChatItem
              color={chat === selectedChat && "bg-secondary"}
              content={
                chat?.latestMessage?.content ? chat?.latestMessage?.content : ""
              }
              key={chat._id}
              onClick={() => handleChatClick(chat)}
              name={
                !chat.isGroupChat ? getSenderName(user, chat.users) : chat.name
              }
              avatar={getSenderAvatar(user, chat.users)}
            />
          ))
        ) : (
          <h1>Loading...</h1>
        )}
      </ScrollArea>

      <Card
        className={`w-full flex justify-end rounded ${
          selectedChat ? "block" : "hidden"
        }`}
      >
        <CardHeader className="flex flex-row items-center gap-3 p-4 border-b-2">
          <img
            src={getSenderAvatar(user, selectedChat?.users)}
            className="rounded-full w-11"
            alt=""
          />
          <CardTitle>{getSenderName(user, selectedChat?.users)}</CardTitle>
        </CardHeader>

        {/* <ScrollableFeed> */}

      
        <div className="h-[60vh] overflow-y-scroll mt-4 flex flex-col flex-grow px-2">
          {messages?.length > 0
            ? messages.map((message) => {
                return (
                  <>
                    {message.sender._id == user._id ? (
                      <SenderChat key={message._id} content={message.content} />
                    ) : (
                      <ReciverChat
                        senderName={message.sender.name}
                        content={message.content}
                      />
                    )}
                  </>
                );
              })
            : "nothing"}
        </div>
        {/* </ScrollableFeed> */}
        <Input
          onKeyDown={(e) => sendMessage(e)}
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          className="z-10 mt-1 border border-t-2 outline-none py-7"
          placeholder="Enter Message"
        />
      </Card>
    </div>
  );
};

const SenderChat = ({ content }) => {
  return (
    <span className="self-end px-4 py-3 my-[2px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl drop-shadow bg-secondary">
      {content}
    </span>
  );
};
const ReciverChat = ({ content, senderName }) => {
  return (
    <>
      <p className="text-xs">{senderName}</p>
      <span className="self-start px-4 py-3 my-[2px] rounded-br-2xl rounded-bl-2xl rounded-tr-2xl bg-secondary">
        {content}
      </span>
    </>
  );
};

// HomePage Component
const HomePage = () => {
  const { user, setChats, chats, setSelectedChat, selectedChat } = ChatState();
  const { data, error, isLoading } = useSWR("/chat", fetcher);
  const [messages, setMessages] = useState(null);
  const [input, setInput] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);

  useEffect(()=>{
    console.log("Runns")
    socket = io(END_POINT)
    socket.emit("setup",user)
    socket.on('connection',()=>setSocketConnection(true))
},[])

useEffect(()=>{
  socket.on('message recieved',(newMessage)=>{
    // if(!selectedChatCompare || selectedChatCompare?._id ! == newMessage.chat._id){
      
    // }else{
      
    // }
    console.log(messages)
    setMessages([...messages,newMessage])
  })
})
  useEffect(() => {
    if (data) {
      setChats(data);
    }
    selectedChatCompare=selectedChat
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  const handleChatClick = async (chat) => {
    setSelectedChat(chat);
    try {
      const response = await axiosInstance.get(`/message/${chat._id}`);
      setMessages(response.data);
      console.log(chat)
      socket.emit('join chat',chat._id)
    } catch (error) {
      console.error(error);
    }
  };
  const handleTyping = (content) => {
    setInput(content);
    // Typing
  };

  const sendMessage = async (event) => {
    if (event.key == "Enter") {
      setInput("");
      const response = await axiosInstance.post("/message", {
        content: input,
        chatId: selectedChat._id,
      });
      setMessages([...messages, response.data]);
      socket.emit('new message',response.data)
    }
  };

  return (
    <div>
      <Header />

      <ChatSection
        input={input}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
        setInput={setInput}
        messages={messages}
        chats={chats}
        setSocketConnection={setSocketConnection}
        selectedChat={selectedChat}
        handleChatClick={handleChatClick}
        user={user}
        getSenderName={getSenderName}
        getSenderAvatar={getSenderAvatar}
        />
    </div>
  );
};

export default HomePage;
