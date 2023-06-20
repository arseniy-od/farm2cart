import { NextApiRequest, NextApiResponse } from 'next'
import BaseContext from '../baseContext'

export default class CompanyController extends BaseContext {
    private CompanyService = this.di.CompanyService

    async getCompanies() {
        const result = await this.CompanyService.getCompanies()
        const companies = JSON.parse(JSON.stringify(result))
        if (!companies || !companies.length) {
            return { props: { notFound: true } }
        }
        return { props: { companies } }
    }
}
