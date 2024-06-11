// src/App.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('pk_test_51PQ5bZSJ7yk0JPHpLPbqWTnp3gMuJHDTS5iXqXpyGfMzGsJKciruIQTb4FvQOOADVjhhdHqA4U1XDUEvtmZD2ypN00ycTjKc4V');

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="App">
       
        <PaymentForm />
      </div>
    </Elements>
  );
};

export default App;
