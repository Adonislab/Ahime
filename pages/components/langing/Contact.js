import React from "react";

const Contact = () => {
  return (
    <div className="bg-gray-100 p-8" id="contact">
      <h1 className="text-3xl text-blue-500 font-bold text-center mb-4">
        Avez vous une inquiétude ?
      </h1>
      <h1 className="text-3xl text-orange-500 font-bold text-center mb-8">Laissez votre message</h1>
      <div className="flex flex-col items-center">
        <textarea
          placeholder="Votre texte"
          className="border border-gray-300 rounded-lg p-2.5 w-full sm:w-96 h-32 mb-4 text-sm"
        >
        </textarea>
        <button className="bg-blue-600 text-white py-2 px-6 rounded-lg text-base">
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default Contact;
