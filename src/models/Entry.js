import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Entry = sequelize.define('Entry', {
  name: { type: DataTypes.STRING, allowNull: false },
  calories: { type: DataTypes.FLOAT, allowNull: false }, // per 100 g
  protein: { type: DataTypes.FLOAT, allowNull: false },  // per 100 g
  carbs: { type: DataTypes.FLOAT, allowNull: false },    // per 100 g
  fat: { type: DataTypes.FLOAT, allowNull: false },      // per 100 g
  grams: { type: DataTypes.FLOAT, allowNull: false },    // how much the user ate
});