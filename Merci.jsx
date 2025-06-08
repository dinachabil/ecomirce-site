import React from 'react';

const Merci = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Paiement réussi !</h1>
        <p className="text-lg text-gray-600">Merci pour votre commande. Nous allons la traiter rapidement.</p>
      </div>
    </div>
  );
};

export default Merci;
