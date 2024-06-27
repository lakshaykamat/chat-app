import React, { useState, useEffect } from "react";
import { ChatSkeleton } from "./Skeleton";
import { Input } from "./ui/input";
import { NotFound } from "./Illustration";
import axiosInstance from "@/lib/axios";
import { Card } from "./ui/card";
import { ChatState } from "@/context/ChatProvider";
import { DialogClose } from "@radix-ui/react-dialog";

const SearchComponent = () => {
  const { setSelectedChat, setChats, chats } = ChatState();
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedInput.trim() === "") {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/users/?search=${debouncedInput}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedInput]);

  const accessChat = async (userId) => {
    try {
      const response = await axiosInstance.post("/chat", { userId });
  
      const newChat = response.data;
  
      // Check if the chat already exists in the chats array
      const chatExists = chats.some((c) => c._id === newChat._id);
  
      if (!chatExists) {
        setChats([newChat, ...chats]);
      }
  
      setSelectedChat(newChat);
    } catch (error) {
      console.error("Error accessing chat:", error);
    }
  };
  

  return (
    <>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search user by name or email"
      />
      {loading ? (
        <>
          <ChatSkeleton />
          <ChatSkeleton />
          <ChatSkeleton />
        </>
      ) : data.length > 0 ? (
        data.slice(0,3).map((item) => (
          <DialogClose key={item._id} asChild>
            <ChatItem
              onClick={() => accessChat(item._id)}
              key={item._id}
              name={item.name}
              avatar={item.avatar}
            />
          </DialogClose>
        ))
      ) : (
        debouncedInput.trim() !== "" && <NotFound message="No users found" />
      )}
    </>
  );
};

const ChatItem = ({ name, avatar, onClick }) => {
  return (
    <Card onClick={onClick} className="flex items-center gap-3 p-3 my-4 cursor-pointer hover:bg-secondary">
      <img className="max-w-[50px] rounded-full" src={avatar} alt={name} />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
    </Card>
  );
};
export default SearchComponent;
