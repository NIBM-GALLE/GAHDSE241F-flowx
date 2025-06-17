import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//compare passwords
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

//generate JWT token
export const generateToken = (member_id) => {
  return jwt.sign(
    { member_id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};