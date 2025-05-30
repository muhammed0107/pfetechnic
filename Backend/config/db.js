const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://mohamed:123456mhds@cluster0.rnmzt.mongodb.net/?retryWrites=true&w=majority");
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
