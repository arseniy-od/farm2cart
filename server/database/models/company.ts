import {BuildOptions, Model, DataTypes } from "sequelize";
import { IContextContainer } from '../../container';
import { InferAttributes, InferCreationAttributes } from "sequelize";


export interface ICompanyModel extends Model<InferAttributes<ICompanyModel>, InferCreationAttributes<ICompanyModel>> {
  name: string
  description: string
  address: string,
  email: string
}


export type CompanyType = typeof Model & {
  new(values?: object, options?: BuildOptions): ICompanyModel
}


const CompanyModel = (ctx: IContextContainer) => {
  const Company = <CompanyType>ctx.db.define<ICompanyModel>('Company', {
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

