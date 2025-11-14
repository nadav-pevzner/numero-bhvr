// features/math-assistant/ChatInput.tsx

import { useUiStore } from "@/store/uiStore";
import { Button } from "@numero/ui/Button";
import { Plus } from "lucide-react";
import React from "react";
import Keyboard from "./Input/Keyboard";

type Props = {
  onSend: () => void;
  onGenerateQuestion: () => void;
  onUploadImage: () => void;
  onFilesAdded: (files: File[]) => void;
};

const ChatInput: React.FC<Props> = ({
  onSend,
  onGenerateQuestion,
  onUploadImage,
  onFilesAdded,
}) => {
  // Get data from stores
  const {
    inputMessage: value,
    setInputMessage: onChange,
    isLoading,
    pendingImage,
    clearPendingImage: onRemoveImage,
  } = useUiStore();

  const hasPendingImage = !!pendingImage;
  const pendingImageName = pendingImage?.name;
  const pendingImagePreview = pendingImage?.previewUrl;

  const placeholder = "איך נומרו יכול לעזור?";

  return (
    <div className="px-4 py-2 flex justify-center items-center">
      <div className="flex flex-col gap-2 w-full">
        <Keyboard
          value={value}
          onChange={onChange}
          onSend={onSend}
          onUploadImage={onUploadImage}
          onFilesAdded={onFilesAdded}
          hasAttachment={hasPendingImage}
          attachmentName={pendingImageName}
          attachmentPreview={pendingImagePreview}
          onRemoveAttachment={onRemoveImage}
          isLoading={isLoading}
          placeholder={placeholder}
        />
        <div className="flex justify-start">
          <Button
            onClick={onGenerateQuestion}
            disabled={isLoading}
            title="שאלה חדשה"
            className="flex gap-1 justify-center items-center"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">שאלה חדשה</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatInput);
