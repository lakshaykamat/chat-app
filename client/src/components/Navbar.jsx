import React from "react";
import { ModeToggle } from "./mode-toggle";
import { Bell, Search } from "lucide-react";
import { Button } from "./ui/button";
import { ChatState } from "@/context/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useHistory } from "react-router-dom";
import SearchComponent from "./SearchUser";

const Navbar = (props) => {
  const { user } = ChatState();

  return (
    <nav className="flex items-center justify-between py-3 border-b-2 sm:py-0 px-7">
      <div className="flex items-center gap-6 p-3">
        <h1 className="text-xl font-bold text-center text-primary">
          <a href="/">{props.appName}</a>
        </h1>

        <div className="items-center hidden gap-6 text-sm lg:flex">
          {props.routes.map((route) => (
            <a
              className="p-3 transition-all rounded-lg hover:bg-foreground hover:text-primary-foreground hover:font-semibold"
              key={route.id}
              href={route.path}
            >
              {route.name}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        {user && (
          <Dialog>
            <DialogTrigger>
              <Search strokeWidth={1.2} className="w-5 h-5 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogTitle className="text-3xl font-bold mb-7">
                Search Users
              </DialogTitle>
              <div className="h-72">
                <SearchComponent />
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Bell strokeWidth={1.2} className="w-5 h-5 cursor-pointer" />
        <ModeToggle />

        <Dialog>
          <DialogTrigger>
            <AvatarCard pic={user?.avatar} name={user?.name} />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-3xl font-bold mb-7">
              Your Profile
            </DialogTitle>
            <ProfileCard
              name={user?.name}
              avatar={user?.avatar}
              email={user?.email}
              createdOn={user?.createdAt}
            />
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

const AvatarCard = ({ pic, name }) => {
  return (
    <Avatar>
      <AvatarImage src={pic} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
};
const ProfileCard = ({ avatar, name, email, createdOn }) => {
  const history = useHistory();
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // Options for formatting the date
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  }
  return (
    <>
      <div className="flex items-start gap-6">
        <img src={avatar} className="rounded-full max-w-40" alt="" />
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p>{email}</p>
          <p>Bio...</p>
        </div>
      </div>
      <div>
        <i>Account created on {formatTimestamp(createdOn)}</i>
      </div>
      <Button
        variant="destructive"
        onClick={() => {
          localStorage.clear();
          history.push("/login");
        }}
      >
        Logout
      </Button>
    </>
  );
};
export default Navbar;
