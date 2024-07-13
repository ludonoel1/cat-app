import { FormEvent, useEffect, useState } from "react";
import * as RecipeAPI from "../api";
import { ICat } from "../page";

interface Props {
  cat: ICat;
  onClose: () => void;
  handleUpdateCat: (input: ICat) => void
}

const CatModal = ({ cat, onClose, handleUpdateCat }: Props) => {

      const [catNameInput, setCatNameInput] = useState<string>(cat.name);
      const [catDescriptionInput, setCatDescriptionInput] = useState<string>(cat.description);  
  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Cat id: {cat.id}</h2>
            <span className="close-btn" onClick={onClose}>
              &times;
            </span>
          </div>
          <div className="w-full max-w-xs">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Username
      </label>
      <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  type="text"
  placeholder="Enter a name for this cat"
  value={catNameInput}
  onChange={(event) => setCatNameInput(event.target.value)}
></input>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2" >
        Description
      </label>
      <textarea
  placeholder="Enter a description"
  value={catDescriptionInput}
  onChange={(event) => setCatDescriptionInput(event.target.value)}
></textarea>
    </div>
    <div className="flex items-center justify-between">
      <button type="button" onClick={() =>{onClose(); handleUpdateCat({...cat, name: catNameInput, description: catDescriptionInput })}}>
        Submit
      </button>
    </div>
  </form>
</div>
        </div>
      </div>
    </>
  );
};

export default CatModal;
