import BaseContext from '../baseContext'

export default class CompanyService extends BaseContext {
    private User = this.di.User
    private Company = this.di.Company

    async getCompanies() {
        return await this.Company.findAll({
            include: [
                {
                    attributes: ['username', 'email'],
                    model: this.User,
                    as: 'sellers',
                },
            ],
        })
    }
}
