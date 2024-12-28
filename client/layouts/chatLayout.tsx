import React from "react";
import { Button } from "@/components/ui/button";

interface MessagePropsType {
  message: string;
  sender: "user" | "llm";
}

const ChatLayout = ({
  prompt,
  setPrompt,
  loading,
  setHistory,
  history,
  children,
}: {
  children: React.ReactNode;
  prompt: string;
  setPrompt: (prompt: string) => void;
  loading: boolean;
  history: any;
  setHistory: any;
}) => {
  return (
    <div className="bg-gray-100 absolute w-full">
      <div
        style={{ height: "calc(100vh - 0px)" }}
        className="flex flex-col justify-between p-6"
      >
        <div className="bg-gray-100 mb-12 h-full overflow-scroll">
          {children}
        </div>
        <form className="flex items-center justify-between border border-gray-300 rounded-lg fixed bottom-6 w-[calc(100vw-330px)]">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-12 px-4 bg-white rounded-lg focus:outline-none"
            placeholder="Type your prompt here..."
          />
          <div>
            <Button
              type="submit"
              disabled={loading || prompt === ""}
              onClick={async () => {
                setHistory((prevHistory: any) => [
                  ...history,
                  { prompt, type: "user" },
                ]);
                setPrompt("");
              }}
              variant="default"
              className="mr-1.5"
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatLayout;
