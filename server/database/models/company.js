import { Model, DataTypes } from "sequelize";


const CompanyModel = (ctx) => {
  const Company = ctx.db.define('Company', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    email: DataTypes.STRING
  },
    {
      timestamps: false,
      tableName: 'companies',
    }
  );
  return Company
}

export default CompanyModel

