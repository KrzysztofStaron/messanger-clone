"use client";

import React, { useEffect, useState } from "react";
import { Chat, ChatData, Message } from "./Chat";
import { MessagesRenderer } from "./MessageRenderer";
import { InputField } from "./InputField";
import { IoIosArrowBack } from "react-icons/io";
import { ChatList } from "./ChatList";

export default function App() {
  const [name, setName] = useState<string>("test_user_1");
  const [activeView, setActiveView] = useState<string>("Chat");

  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setActiveView("Debug");
      }
    });
  }, []);

  const view = () => {
    switch (activeView) {
      case "ChatList":
        return <ChatList name={name} />;
      case "Chat":
        return (
          <ChatPage
            chatID="chat"
            name={name}
            openChatsList={() => setActiveView("ChatList")}
          />
        );
      case "Debug":
        return (
          <>
            <input
              type="text"
              placeholder="name"
              className="text-black"
              onChange={(e) => setName(e.target.value)}
            />
            <button onClick={() => setActiveView("Chat")}>Log In</button>
          </>
        );
    }
  };

  return <div className="flex w-screen h-screen flex-col">{view()}</div>;
}

const ChatPage = ({
  name,
  openChatsList,
  chatID,
}: {
  name: string;
  openChatsList: () => void;
  chatID: string;
}) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const chat = new Chat(name, chatID); // userID, chatID

  useEffect(() => {
    chat.subscribe((doc: ChatData) => {
      setChatMessages(doc.messages);
    });
  }, []);

  return (
    <div className="flex w-screen h-screen flex-col">
      <div className="w-full flex bg-stone-900 h-8 text-lg px-2 gap-4">
        <button
          onClick={() => openChatsList()}
          className="flex items-center justify-center"
        >
          <IoIosArrowBack />
        </button>
        <p className="flex-grow">Chat Name</p>
      </div>
      <MessagesRenderer messages={chatMessages} myName={name} />
      <InputField chat={chat} />
    </div>
  );
};
