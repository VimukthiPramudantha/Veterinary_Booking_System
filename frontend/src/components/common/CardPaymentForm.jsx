import React, { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const CardPaymentForm = ({ amount, onPaymentComplete, onSaveCard, existingCards = [] }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [useNewCard, setUseNewCard] = useState(existingCards.length === 0);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState('');

  // Card type detection
  useEffect(() => {
    const number = formData.cardNumber.replace(/\s/g, '');
    if (number.match(/^4/)) {
      setCardType('visa');
    } else if (number.match(/^5[1-5]/)) {
      setCardType('mastercard');
    } else if (number.match(/^3[47]/)) {
      setCardType('amex');
    } else {
      setCardType('');
    }
  }, [formData.cardNumber]);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (useNewCard) {
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      if (!cardNumber || cardNumber.length < 13) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }

      if (!formData.expiryDate || !formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        newErrors.expiryDate = 'Please enter expiry date as MM/YY';
      } else {
        const [month, year] = formData.expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiry < new Date()) {
          newErrors.expiryDate = 'Card has expired';
        }
      }

      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = 'Please enter CVV';
      }

      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Please enter cardholder name';
      }
    } else if (!selectedCard) {
      newErrors.selectedCard = 'Please select a card';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentData = useNewCard ? {
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cardholderName: formData.cardholderName,
        amount,
        saveCard: formData.saveCard
      } : {
        cardId: selectedCard.id,
        amount
      };

      // Save card if requested
      if (useNewCard && formData.saveCard) {
        const cardData = {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cardholderName: formData.cardholderName,
          cardType
        };
        onSaveCard && onSaveCard(cardData);
      }

      onPaymentComplete(paymentData);
    } catch (error) {
      setErrors({ submit: 'Payment failed. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  const getCardIcon = (type) => {
    switch (type) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Secure Payment</h2>
              <p className="text-indigo-200">Complete your appointment booking</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-indigo-200 text-sm">Amount</p>
            <p className="text-3xl font-bold">LKR {amount}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Existing Cards */}
        {existingCards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Saved Cards</h3>
              <button
                type="button"
                onClick={() => setUseNewCard(!useNewCard)}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {useNewCard ? 'Use Saved Card' : 'Add New Card'}
              </button>
            </div>

            {!useNewCard && (
              <div className="space-y-3">
                {existingCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCard(card)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedCard?.id === card.id
                        ? 'border-primary-500 bg-primary-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{getCardIcon(card.cardType)}</div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            **** **** **** {card.lastFour}
                          </p>
                          <p className="text-sm text-gray-600">
                            {card.cardholderName} • Expires {card.expiryDate}
                          </p>
                        </div>
                      </div>
                      {selectedCard?.id === card.id && (
                        <CheckCircleIcon className="h-6 w-6 text-primary-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New Card Form */}
        {useNewCard && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-gray-700">
              <SparklesIcon className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold">Add New Card</h3>
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                    errors.cardNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <CreditCardIcon className="h-5 w-5 text-gray-400" />
                </div>
                {cardType && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                    {getCardIcon(cardType)}
                  </div>
                )}
              </div>
              {errors.cardNumber && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{errors.cardNumber}</span>
                </p>
              )}
            </div>

            {/* Cardholder Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                  errors.cardholderName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              {errors.cardholderName && (
                <p className="text-red-600 text-sm flex items-center space-x-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>{errors.cardholderName}</span>
                </p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                    errors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <span>{errors.expiryDate}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  CVV
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 ${
                      errors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.cvv && (
                  <p className="text-red-600 text-sm flex items-center space-x-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <span>{errors.cvv}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Save Card Option */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="saveCard"
                  checked={formData.saveCard}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-primary-600 rounded border-2 border-gray-300 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <BookmarkIcon className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Save this card for future appointments
                  </span>
                </div>
              </label>
              <p className="text-xs text-gray-600 mt-2 ml-8">
                Your card details will be securely stored for faster checkout
              </p>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {errors.submit && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">{errors.submit}</p>
            </div>
          </div>
        )}

        {errors.selectedCard && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">{errors.selectedCard}</p>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-700">
            <LockClosedIcon className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium">Secure SSL Encryption</p>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Your payment information is encrypted and secure. We never store your CVV.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {processing ? (
            <div className="flex items-center justify-center space-x-3">
              <LoadingSpinner size="small" />
              <span>Processing Payment...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <LockClosedIcon className="h-5 w-5" />
              <span>Pay LKR {amount}</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default CardPaymentForm;