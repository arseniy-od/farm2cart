import { NextApiRequest, NextApiResponse } from 'next'
import BaseController from './baseController'
import GET from '../decorators/get'
import POST from '../decorators/post'
import SSR from '../decorators/ssr'
import USE from '../decorators/use'
import session, { middlewares } from '@/middleware/session'
import passport from '@/middleware/passport'

@USE([session, middlewares[0], middlewares[1]])
export default class CompanyController extends BaseController {
    private CompanyService = this.di.CompanyService

    @SSR('/companies')
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
