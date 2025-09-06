const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { authMiddleware } = require('../middleware/auth');

// Mock saved cards data for demo (in production, use database)
let savedCardsData = [
  {
    id: 'card_1',
    userId: 'sample-user-id', // This will be replaced with actual user IDs
    cardholderName: 'John Doe',
    cardType: 'visa',
    lastFour: '1234',
    expiryDate: '12/26',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'card_2', 
    userId: 'sample-user-id-2',
    cardholderName: 'Jane Smith',
    cardType: 'mastercard',
    lastFour: '5678',
    expiryDate: '08/25',
    isActive: true,
    createdAt: new Date()
  }
];

// Get saved cards for authenticated user
router.get('/saved-cards', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching saved cards for user:', req.userId);
    
    const userCards = savedCardsData.filter(card => 
      card.userId === req.userId && card.isActive
    );
    
    console.log('Found user cards:', userCards.length);
    
    // If no cards found for the actual user, create some sample cards for testing
    if (userCards.length === 0) {
      const sampleCards = [
        {
          id: 'card_' + Date.now() + '_1',
          userId: req.userId,
          cardholderName: 'John Doe',
          cardType: 'visa',
          lastFour: '4321',
          expiryDate: '12/27',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'card_' + Date.now() + '_2',
          userId: req.userId,
          cardholderName: 'John Doe',
          cardType: 'mastercard',
          lastFour: '8765',
          expiryDate: '08/26',
          isActive: true,
          createdAt: new Date()
        }
      ];
      
      // Add sample cards to the mock data for this user
      savedCardsData.push(...sampleCards);
      
      console.log('Created sample cards for user');
      res.json(sampleCards);
    } else {
      res.json(userCards);
    }
  } catch (error) {
    console.error('Error fetching saved cards:', error);
    res.status(500).json({ message: 'Error fetching saved cards' });
  }
});

// Save a new card for authenticated user
router.post('/save-card', authMiddleware, async (req, res) => {
  try {
    const { cardNumber, expiryDate, cardholderName, cardType, lastFour } = req.body;
    
    // Check if card already exists
    const existingCard = savedCardsData.find(card =>
      card.userId === req.userId &&
      card.lastFour === lastFour &&
      card.expiryDate === expiryDate &&
      card.isActive
    );
    
    if (existingCard) {
      return res.status(400).json({ 
        success: false,
        message: 'This card is already saved' 
      });
    }
    
    // Create new saved card
    const newCard = {
      id: Date.now().toString(),
      userId: req.userId,
      cardholderName,
      cardType: cardType || 'unknown',
      lastFour,
      expiryDate,
      isActive: true,
      createdAt: new Date()
    };
    
    savedCardsData.push(newCard);
    
    res.status(201).json({
      success: true,
      message: 'Card saved successfully',
      card: newCard
    });
  } catch (error) {
    console.error('Error saving card:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error saving card' 
    });
  }
});

// Delete a saved card
router.delete('/saved-cards/:cardId', authMiddleware, async (req, res) => {
  try {
    const cardIndex = savedCardsData.findIndex(card =>
      card.id === req.params.cardId &&
      card.userId === req.userId
    );
    
    if (cardIndex === -1) {
      return res.status(404).json({ message: 'Card not found' });
    }
    
    // Soft delete - mark as inactive
    savedCardsData[cardIndex].isActive = false;
    
    res.json({ 
      success: true,
      message: 'Card deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ message: 'Error deleting card' });
  }
});

// Process payment (simulated)
router.post('/process-payment', authMiddleware, async (req, res) => {
  try {
    const { amount, paymentData, appointmentId } = req.body;
    
    // Simulate payment processing
    const isSuccessful = Math.random() > 0.1; // 90% success rate
    
    if (isSuccessful) {
      // Generate a fake transaction ID
      const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      res.json({
        success: true,
        transactionId,
        amount,
        currency: 'LKR',
        status: 'completed',
        message: 'Payment processed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again or use a different payment method.',
        errorCode: 'PAYMENT_DECLINED'
      });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      success: false,
      message: 'Payment processing error' 
    });
  }
});

router.post('/cash-payment', authMiddleware, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.paymentMethod = 'cash';
    appointment.paymentStatus = 'pending';
    await appointment.save();

    res.json({
      message: 'Cash payment option selected. Please pay at the clinic.',
      appointment
    });
  } catch (error) {
    console.error('Error setting cash payment:', error);
    res.status(500).json({ message: 'Error setting payment method' });
  }
});

module.exports = router;