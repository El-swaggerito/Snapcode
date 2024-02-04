"use client";
import Image from "next/image";
import { EmojiPopover } from "./emoji-popover";
import { TextMessageSent } from "../svgs/chatSvg";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { sendMessageAction } from "@/lib/actions";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { readFileAsDataURL } from "@/lib/utils";
import ChatImagePreviewDialog from "./chat-image-preview-dialog";

const SendMsgInput = () => {
  const [messageContent, setMessageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const recieverId = params.id;
  const [selectedFile, setSelectedFile] = useState<string>("");
  const imgRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendMessageAction(recieverId, messageContent, "text");
      setMessageContent("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      setSelectedFile(dataUrl);
    }
  };

  const closeDialog = () => {
    setSelectedFile("");
  };
  return (
    <div className="flex gap-2 items-center py-1">
      <div className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-sigBackgroundSecondaryHover">
        <div onClick={() => imgRef.current!.click()}>
          <Image
            src={"/camera.svg"}
            height={0}
            width={0}
            style={{ width: "20px", height: "auto" }}
            alt="camera icon"
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleFileChange}
          />
        </div>
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex-1 flex  items-center gap-1 bg-sigBackgroundSecondaryHover rounded-full border   border-sigColorBgBorder"
      >
        <Input
          placeholder="Send a chat"
          className="bg-transparent focus:outline-transparent border-none outline-none w-full h-full rounded-full"
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
        />
        <Button
          size={"sm"}
          className="bg-transparent hover:bg-transparent text-sigSnapChat"
          type="submit"
        >
          {!isLoading && <TextMessageSent className=" scale-150 mr-1" />}
          {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
        </Button>
      </form>
      <div className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center text-white bg-sigBackgroundSecondaryHover">
        <EmojiPopover />
      </div>

      <ChatImagePreviewDialog
        selectedFile={selectedFile}
        onClose={closeDialog}
        onImageChange={() => imgRef.current!.click()}
      />
    </div>
  );
};
export default SendMsgInput;
