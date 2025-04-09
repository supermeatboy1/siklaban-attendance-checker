import { useState } from "react";
import { createPortal } from "react-dom";

const DialogModal = ({ message, buttonText, onClick }) => {
  return createPortal(
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800/40">
      <div className="bg-amber-100 p-6 rounded-lg w-4/5 shadow-[-4px_4px_4px_#888888]"> 
        <p className="text-2xl font-bold text-center p-2">{message}</p>

        <div className="flex flex-row justify-center">        
          <button onClick={() => { onClick() } } className="font-bold rounded-lg text-2xl text-orange-400/70 p-3 text-white bg-orange-400/70 hover:bg-orange-400/90 m-4">
            {buttonText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default DialogModal;
