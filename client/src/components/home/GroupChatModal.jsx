import React, { useState } from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axiosInstance from "@/lib/axios";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ChatSkeleton } from "../Skeleton";
import { ChatState } from "@/context/ChatProvider";

const GroupChatModal = () => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setLoading(true);
    setSearch(query);
    if (!query) return;
    try {
      const response = await axiosInstance.get(`/users/?search=${query}`);
      setSearchResult(response.data);
    } catch (error) {}
    setLoading(false);
  };

  const handleGroup = (userToAdd) => {
    // console.log(searchUsers)
    if (searchUsers.includes(userToAdd)) {
      console.log(searchUsers);
      return;
    }
    setSearchUsers([...searchUsers, userToAdd]);
    console.log(searchUsers);
  };

  const handleDelete = (delUser) => {
    setSearchUsers(searchUsers.filter((sel) => sel._id !== delUser._id));
  };
  const handleSubmit = async () => {
    if (!name || !searchUsers) {
      return;
    }

    try {
      const response = await axiosInstance.post("/chat/group", {
        name: name,
        users: JSON.stringify(searchUsers.map((u) => u._id)),
      });

      const data = response.data;
      setChats([data, ...chats]);
    } catch (error) {}
  };
  return (
    <div className="h-[28rem]">
      <Label>Name</Label>
      <Input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="mb-2"
        placeholder="Enter name"
      />
      <Label>Users</Label>
      <Input
        onChange={(e) => handleSearch(e.target.value)}
        type="text"
        className="mb-3"
        placeholder="Users name"
      />
      <div className="flex gap-3">
        <DialogClose asChild>
          <Button onClick={handleSubmit}>Create group chat</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        {searchUsers.map((user) => (
          <span key={user._id} className="px-2 py-1 text-sm rounded bg-secondary text-secondary-foreground">
            {user.name}
            <span onClick={()=>handleDelete(user)} className="text-red-500 bg-red-100">x</span>
          </span>
        ))}
      </div>
      <ScrollArea className="w-full h-48 mt-">
        {!isLoading ? (
          searchResult?.length > 0 &&
          searchResult
            .slice(0, 2)
            .map((user) => (
              <ChatItem
                key={user._id}
                name={user.name}
                avatar={user.avatar}
                onClick={() => handleGroup(user)}
              />
            ))
        ) : (
          <div className="flex flex-col gap-3 mt-3">
            <ChatSkeleton />
            <ChatSkeleton />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

const ChatItem = ({ name, avatar, onClick }) => {
  return (
    <Card onClick={onClick} className="flex items-center gap-3 p-3 my-4">
      <img className="max-w-[50px] rounded-full" src={avatar} alt={name} />
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
    </Card>
  );
};
export default GroupChatModal;
