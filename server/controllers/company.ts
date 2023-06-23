import { NextApiRequest, NextApiResponse } from 'next'
import BaseController from './baseController'
import GET from '../decorators/get'
import POST from '../decorators/post'

export default class CompanyController extends BaseController {
    private CompanyService = this.di.CompanyService

    @GET('/api/companies')
    async getCompanies() {
        const result = await this.CompanyService.getCompanies()
        return result
        // const companies = JSON.parse(JSON.stringify(result))
        // if (!companies || !companies.length) {
        //     return { notFound: true }
        // }
        // return { companies }
    }

    @POST('/api/companies')
    async createCompany({ body }) {
        console.log('==============[POST]=============')
        console.log(body)
        return { status: 'ok' }
    }
}
