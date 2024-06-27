import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/lib/axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const LoginPage = () => {
  return (
    <Tabs defaultValue="account" className="max-w-xl mx-auto">
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="account">
          Login
        </TabsTrigger>
        <TabsTrigger className="w-full" value="password">
          Register
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <LoginComponent />
      </TabsContent>
      <TabsContent value="password">
        <RegisterComponent />
      </TabsContent>
    </Tabs>
  );
};

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      localStorage.setItem("authToken", JSON.stringify(response.data));
      history.push("/");
      toast({
        title: "Login Successfull",
        description: "Enjoy your social journey :)",
      });
      

      setLoading(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: err.response.data.message,
        description: "There was a problem with your request.",
      });
      console.log(err);
      console.error("Login Error:", err.response.data.message);
      setError(err.response.data.message || "Login failed. Please try again.");
    }
    setLoading(false)
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md bg-card drop-shadow-md p-7"
    >
      <h1 className="text-3xl font-bold mb-7">Login</h1>
      <Label htmlFor="email">Email</Label>
      <Input
        className="mb-5"
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Label htmlFor="password">Password</Label>
      <Input
        className="mb-5"
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <p className="mt-4 text-red-500">{error}</p>
      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </Button>
    </form>
  );
};

const RegisterComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [err, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();
  const history = useHistory();

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Recheck password",
      });
    }

    try {
      const response = await axiosInstance.post("/users/register", {
        name,
        email,
        password,
        avatar,
      });

      localStorage.setItem("authToken", response.data.token);
      history.push("/")
      setLoading(false)
    } catch (err) {
      console.log(err);
      console.error("Registration Error:", err.response.data.message);
      setError(
        err.response.data.message || "Registration failed. Please try again."
      );
      setLoading(false)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-md bg-card drop-shadow-md p-7"
    >
      <h1 className="text-3xl font-bold mb-7">Register</h1>
      <Label htmlFor="name">Name</Label>
      <Input
        className="mb-5"
        id="name"
        required
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Label htmlFor="email">Email</Label>
      <Input
        className="mb-5"
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Label htmlFor="password">Password</Label>
      <Input
        className="mb-5"
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Label htmlFor="confirmpassword">Confirm Password</Label>
      <Input
        className="mb-5"
        id="confirmpassword"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Label htmlFor="avatar">Avatar</Label>
      <Input
        id="avatar"
        type="text"
        placeholder="Avatar url"
        onChange={(e) => setAvatar(e.target.value)}
      />
      <p className="mt-4 text-red-500">{err}</p>
      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        {isLoading ? "Loading..." : "Create Account"}
      </Button>
    </form>
  );
};

export default LoginPage;
