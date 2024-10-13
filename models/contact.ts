import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define an interface for Contact attributes
interface ContactAttributes {
    id: number;
    phoneNumber?: string;
    email?: string;
    linkedId?: number;
    linkPrecedence: 'primary' | 'secondary';
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }
  
  // Define an interface for optional Contact creation attributes
  interface ContactCreationAttributes extends Optional<ContactAttributes, 'id' | 'linkedId' | 'deletedAt'> {}
  
  // Extend Sequelize's Model class with Contact attributess
  class Contact extends Model<ContactAttributes, ContactCreationAttributes> implements ContactAttributes {
    declare id: number; // Non-nullable field
    declare phoneNumber?: string;
    declare email?: string;
    declare linkedId?: number;
    declare linkPrecedence: 'primary' | 'secondary';
    declare createdAt: Date;
    declare updatedAt: Date;
    declare deletedAt?: Date;
  }
  Contact.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      linkPrecedence: {
        type: DataTypes.ENUM('primary', 'secondary'),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize, 
      modelName: 'Contact',
      tableName: 'Contacts',
      timestamps: true,
      paranoid: true,
    }
  );
  
  export default Contact;