import { readStreamableValue, StreamableValue } from "@ai-sdk/rsc";
import { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

const StreamingMessage = ({
  content,
}: {
  content: string | StreamableValue<string>;
}) => {
  const [displayContent, setDisplayContent] = useState(
    typeof content === "string" ? content : "",
  );

  useEffect(() => {
    // If it's a raw string
    if (typeof content === "string") {
      setDisplayContent(content);
      return;
    }

    // If it's a StreamableValue
    async function updateStream() {
      for await (const chunk of readStreamableValue(
        content as StreamableValue<string>,
      )) {
        if (chunk) {
          setDisplayContent(chunk);
          window.dispatchEvent(new CustomEvent("ai-stream-update"));
        }
      }
    }
    updateStream();
  }, [content]);

  return <MarkdownRenderer content={displayContent} />;
};

export default StreamingMessage;
