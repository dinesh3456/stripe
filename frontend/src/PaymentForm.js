// src/PaymentForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './PaymentForm.css';
import donatuzLogo from './donatuz-logo.png';


const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'IN', // Default country as India
  });
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:5002/create-payment-intent', {
        amount: amount * 100,
        description,
        name,
        address,
      });
      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setPaymentSuccessful(true);
        }
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
      },
    },
    hidePostalCode: false, // Ensure that the postal code field is shown
  };

  return (
    <div className="payment-form-container">
      <div className="payment-form-header">
        <img src={donatuzLogo} alt="Logo" />
        <h2>Stripe Payment</h2>
      </div>
      <form onSubmit={handleSubmit} className="payment-form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          placeholder="Address Line 1"
        />
        <input
          type="text"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          placeholder="City"
        />
        <input
          type="text"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          placeholder="State"
        />
        <input
          type="text"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
          placeholder="Postal Code"
        />
        <CardElement options={cardElementOptions} /> {/* Pass the options here */}
        <button type="submit" disabled={!stripe}>
         complete Payment
        </button>
      </form>
      {paymentSuccessful && <p className="payment-success">Payment Successful!</p>}
    </div>
  );
};

export default PaymentForm;