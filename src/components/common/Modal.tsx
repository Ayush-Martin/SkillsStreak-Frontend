import { FC } from "react";
import { Button, ScrollArea } from "../ui";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface IModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: FC<IModalProps> = ({ onClose, title, children }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 text-white ]">
      <div className="w-full h-[600px] max-w-lg bg-[#0c0f1a] border border-white/10 rounded-xl shadow-lg p-6 space-y-6  flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {title}
          </h2>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-blue-500"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="flex-1">
          <div className="pr-2">{children}</div>
        </ScrollArea>
      </div>
    </div>,
    document.getElementById("portal")!
  );
};

export default Modal;
