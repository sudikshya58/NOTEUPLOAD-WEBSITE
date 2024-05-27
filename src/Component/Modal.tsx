/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  maxWidth?: string;
  onEnterKey?: () => void;
}

const Modal = ({
  isOpen,
  setIsOpen,
  children,
  onEnterKey,
  maxWidth = "max-w-9xl",
}: ModalProps) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && onEnterKey) {
      onEnterKey();
      closeModal();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      { (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="bg-slate-200/20   p-2 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.1 }}
            className={`bg-[#fefefefe] text-gray-900 rounded w-[90%] h-fit max-h-[90%] overflow-scroll shadow-xl cursor-default relative ${maxWidth}`}
          >
            <div className="relative z-10 h-[90%]">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
