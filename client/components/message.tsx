import React from "react";

const Message = ({ MessageProps }: { MessageProps: any }) => {
  return (
    <>
      {MessageProps.type === "llm" ? (
        <div className="flex items-end justify-start mb-2">
          <div className="flex items-center max-w-[500px] px-4 py-2 bg-white rounded-lg dark:bg-gray-600 border">
            <p className="text-sm">
              {MessageProps.prompt ? MessageProps.prompt : "..."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-end mb-2 mr-[290px]">
          <div className="flex items-center max-w-sm px-4 py-2 bg-green-600 rounded-lg dark:bg-green-800">
            <p className="text-sm text-white">{MessageProps.prompt}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
