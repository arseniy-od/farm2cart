import {
    GetServerSidePropsContext,
    GetStaticPropsContext,
    NextApiRequest,
    NextApiResponse,
    PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'

import { NextApiRequestWithUser } from '@/app/types/interfaces'
import good from './good'

import session, { passportInit, passportSession } from '@/middleware/session'

import USE from '../decorators/use'
import GET from '../decorators/get'
import POST from '../decorators/post'
import DELETE from '../decorators/delete'
import PATCH from '../decorators/patch'
import SSR from '../decorators/ssr'

import BaseController from './baseController'

import validate from '../validation/validator'
import { categorySchema } from '../validation/schemas'
import { categoryGoodSchema, goodSchema } from '@/redux/normalSchemas'
import { jsonCopy } from '@/app/utils'
import { clientDi } from '@/redux/container'
import { CODES } from '@/app/constants'

@USE([session, passportInit, passportSession])
export default class CategoryController extends BaseController {
    private CategoryService = this.di.CategoryService

    constructor(opts) {
        super(opts)
        this.schema = clientDi('CategoryEntity').schema
    }

    @GET('/api/categories')
    @SSR('/categories')
    @SSR('/goods/:id')
    @SSR('/')
    async getCategories() {
        this.createMessage({
            successMessage: 'Categories fetched',
            failMessage: 'Categories not fetched',
            successCode: CODES.DEBUG,
            failCode: CODES.TOAST,
        })
        return await this.CategoryService.getCategories()
    }

    @POST('/api/categories')
    @USE(validate(categorySchema))
    async createCategory({ body }: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Category created',
            failMessage: 'Error while creating category',
        })
        return await this.CategoryService.createCategory(body)
    }

    @DELETE('/api/categories')
    async deleteCategory({ query }: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Category deleted',
            failMessage: 'Error while deleting category',
        })
        const id = query.id
        return await this.CategoryService.deleteCategory(id)
    }

    @PATCH('/api/categories')
    @USE(validate(categorySchema))
    async updateCategory({ query, body }: NextApiRequestWithUser) {
        this.createMessage({
            successMessage: 'Category updated',
            failMessage: 'Error while updating category',
        })
        const id = query.id
        return await this.CategoryService.updateCategory(body, id)
    }

    async getStaticPaths() {
        const paths = await this.CategoryService.getAllCategorySlugs()
        return {
            paths,
            fallback: false,
        }
    }

    @SSR('/categories/:slug')
    async getCategoryBySlug({
        params,
    }: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) {
        // this.createMessage({
        //     successMessage: 'Category fetched',
        //     failMessage: 'Category not found',
        //     successCode: CODES.DEBUG,
        //     failCode: CODES.TOAST,
        // })
        const slug = params?.slug
        let category = await this.CategoryService.getCategoryByText(slug)
        return category
    }
}
