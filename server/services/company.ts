// import { company } from '@/app/types/interfaces'
// import BaseContext from '../baseContext'
// import GET from '../decorators/get'

// export default class CompanyService extends BaseContext {
//     private User = this.di.User
//     private Company = this.di.Company

//     async getCompanies() {
//         return await this.Company.findAll({
//             include: [
//                 {
//                     attributes: ['username', 'email'],
//                     model: this.User,
//                     as: 'sellers',
//                 },
//             ],
//         })
//     }

//     async createCompany(companyData: company) {
//         return await this.Company.create(companyData)
//     }
// }
