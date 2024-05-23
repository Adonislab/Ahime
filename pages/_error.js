import React from 'react';
import Link from 'next/link';

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Oups! Cette page est introuvable.</p>
      <p className="text-lg mt-2">On dirait que vous êtes perdu dans le cyberespace...</p>
      <img src="https://media.giphy.com/media/3o7TKsQzG4nRNgp8w0/giphy.gif" alt="Funny 404" className="mt-6 rounded-lg shadow-lg"/>
      <Link href="/" className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Retour à l'accueil</Link>
    </div>
  )
}
