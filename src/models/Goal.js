import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Goal = sequelize.define('Goal', {
  calories: { type: DataTypes.INTEGER, defaultValue: 2000 },
  protein: { type: DataTypes.INTEGER, defaultValue: 150 },
  carbs: { type: DataTypes.INTEGER, defaultValue: 250 },
  fat: { type: DataTypes.INTEGER, defaultValue: 70 },
});