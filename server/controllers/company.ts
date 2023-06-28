import { NextApiRequest, NextApiResponse } from 'next'
import BaseController from './baseController'
import GET from '../decorators/get'
import POST from '../decorators/post'
import SSR from '../decorators/ssr'
import USE from '../decorators/use'
import session, { passportInit, passportSession } from '@/middleware/session'
import { NextApiRequestWithUser } from '@/app/types/interfaces'
import { CompanySchema } from '../validation/schemas'
import validate from '../validation/validator'
// import passport from '@/middleware/passport'

@USE([session, passportInit, passportSession])
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
    @USE(validate(CompanySchema))
    async createCompany({ body }: NextApiRequestWithUser) {
        return await this.CompanyService.createCompany(body)
    }
}
