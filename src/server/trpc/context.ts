import { db } from '../db';

export const createContext = async () => {
  return {
    db,
  };
};