import ChatLayout from "@/layouts/chatLayout";
import MainLayout from "@/layouts/mainLayout";

import React, { useState, useEffect } from "react";
import Message from "@/components/message";
import authHOC from "@/hoc/authHOC";

const Home = () => {
  const [history, setHistory] = useState<
    { type: "llm" | "user"; prompt: string }[]
  >([{ prompt: "Hello, how can I help you today?", type: "llm" }]);
  const [context, setContext] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [initialMessage, setInitialMessage] = useState<boolean>(true);
  const [conversations, setConversations] = useState<any>([]);
  const [currentConversation, setCurrentConversation] = useState<any>();

  // save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  // if lenght of history from local storage is greater than history state, update history state with local storage
  useEffect(() => {
    const localHistory = JSON.parse(localStorage.getItem("history") || "[]");
    if (localHistory.length > history.length) {
      setHistory(localHistory);
    }
  }, []);

  useEffect(() => {
    setInput(prompt);
  }, [prompt]);

  const sendPrompt = async () => {
    setLoading(true);

    let tempHistory = [...history, { prompt: "", type: "llm" as "llm" }];

    setHistory(tempHistory);
    const tempIndex = tempHistory.length - 1;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt: input,
        system:
          "you are a legal assistant with knowledge of indian law, when answering questions please give the answer first and then the disclaimer saying you are not a lawyer",
        template: "",
        context,
        options: { temperature: 0.8 },
      }),
    };

    const response = await fetch(
      "http://localhost:11434/api/generate",
      requestOptions,
    );
    const reader = response.body?.getReader();

    if (reader) {
      let serverResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }

        const decodedValue = new TextDecoder("utf-8").decode(value);

        try {
          const { response, done, context } = JSON.parse(decodedValue);

          if (response) {
            serverResponse += response;
            tempHistory[tempIndex].prompt = serverResponse;
            setHistory([...tempHistory]);
          }

          if (done) {
            setContext(context);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    if (history.length > 0 && history[history.length - 1].type === "user") {
      sendPrompt();
    }
  }, [history, sendPrompt]);

  const updateCurrentConversation = (conversation: any) => {
    let tempConversations = conversations.conversations.map((conv: any) => {
      if (conv.id === conversation.id) {
        if (conv.name !== "Initial Conversation") {
          let renamedConversation = conv;
          renamedConversation.name += conversation.name;
          return {
            ...renamedConversation,
            name: renamedConversation.name.replace(/['"]+/g, ""),
          };
        } else {
          return {
            ...conversation,
            name: conversation.name.replace(/['"]+/g, ""),
          };
        }
      }
      return conv;
    });

    setCurrentConversation(conversation);
    let oldConversations = conversations;
    oldConversations.conversations = tempConversations;
    setConversations(oldConversations);
  };

  const createTopicFromMessage = async (userQueryFromHistory: any) => {
    const requestOptions = userQueryFromHistory && {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3:latest",
        prompt:
          "generate a topic for this user query in 2 to 3 words: " +
          userQueryFromHistory.prompt,
        system: "return the response strictly within 2 to 3 words",
        template: "",
        context,
        options: { temperature: 0.8 },
      }),
    };

    const response = await fetch(
      "http://localhost:11434/api/generate",
      requestOptions,
    );

    const reader = response.body?.getReader();

    if (reader) {
      let serverResponse = "";

      let generatingResponse = true;

      while (generatingResponse && history.length < 3) {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }

        const decodedValue = new TextDecoder("utf-8").decode(value);

        try {
          const { response, done, context } = JSON.parse(decodedValue);

          // if (response) {
          //   serverResponse += response;
          //   // setHistory([...tempHistory]);
          //   console.log("topic response: ", response);
          // }

          console.log("topic response: ", response);

          response &&
            updateCurrentConversation({
              ...currentConversation,
              name: response,
            });
          if (done) {
            generatingResponse = false;
            console.log("done creating topic");
            setContext(context);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    const asyncFunc = async () => {
      const userQueryFromHistory = history[1];

      if (userQueryFromHistory) {
        createTopicFromMessage(userQueryFromHistory);
        // paste here
        // if (history.length > 2) {
        //   setInitialMessage(false);
        // }
      }
    };

    asyncFunc();
  }, [history]);

  useEffect(() => {
    const userId =
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") || "").id;

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    userId &&
      fetch(
        `http://localhost:8000/api/getAllConversations?userId=${userId}`,
        requestOptions,
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("conversations: ", data);
          setConversations(data);
          setCurrentConversation(data.conversations[0]);
        });
  }, []);

  useEffect(() => {
    console.log("current conversation: ", currentConversation);
    console.log("conversations: ", conversations);
  }, [currentConversation, conversations]);

  // useEffect(() => {
  //   // send an initial hello message from llm
  //   setHistory([
  //     { prompt: "Hello, how can I help you today?", type: "llm" },
  //   ]);
  // }, []}

  // useEffect(() => {
  //   if (currentConversation) {
  //     const userId = localStorage.getItem("user") && JSON.parse(localStorage.getItem("user") || "").id;
  //
  //     const requestOptions: any = {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         conversation: conversations.conversations.map((conv: any) => {
  //           if (conv.id === currentConversation.id) {
  //             return {
  //               ...conv,
  //               messages: history,
  //             }
  //           }
  //           return conv;
  //         }),
  //       })
  //     }
  //
  //     userId && fetch(
  //       `http://localhost:8000/api/updateConversation?id=${currentConversation.id}`,
  //       requestOptions,
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("updated conversation: ", data);
  //       });
  //   }
  // }, [currentConversation])

  useEffect(() => {
    conversations &&
      console.log("retrieved conv:", conversations.conversations);
  }, [conversations]);

  return (
    <MainLayout
      currentConversation={currentConversation}
      passedConversations={conversations.conversations}
    >
      <ChatLayout
        prompt={prompt}
        setPrompt={setPrompt}
        loading={loading}
        history={history}
        setHistory={setHistory}
      >
        <div className="flex h-full w-full flex-col">
          {history.map((message, index) => (
            <div key={index} className="mb-2">
              <div>
                <Message MessageProps={message} />
              </div>
            </div>
          ))}
        </div>
      </ChatLayout>
    </MainLayout>
  );
};

export default authHOC(Home);
