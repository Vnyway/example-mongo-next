"use client";

import React, { useEffect, useState } from "react";

const AddUser = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    console.log([username, email, password]);
  }, [username, email, password]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = { username, email, password };
    try {
      const res = await fetch(`http://localhost:3000/api/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        alert("User Has been added saccessfully!");
      } else {
        alert("You don't have right. Oh, you don't have right to...");
      }
    } catch (error) {
      alert("Error deleting user!");
    }
  };
  return (
    <main className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-[20px] w-[50%] p-[40px] bg-white rounded-[20px] shadow-md">
        <h1 className="font-semibold text-[20px] text-center">Add User</h1>
        <input
          type="text"
          placeholder="username"
          className="h-[40px] rounded-[10px] border-[1px] border-black outline-none capitalize pl-[15px] items-center flex"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          className="h-[40px] rounded-[10px] border-[1px] border-black outline-none capitalize pl-[15px] items-center flex"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="h-[40px] rounded-[10px] border-[1px] border-black outline-none capitalize pl-[15px] items-center flex"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full h-[40px] border-[1px] border-black rounded-[10px]">
          Submit
        </button>
      </form>
    </main>
  );
};

export default AddUser;
