import dotenv from 'dotenv';

dotenv.config({ silent: true });

export default process.env.JWT_SECRET;
