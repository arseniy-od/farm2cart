import { NextApiRequest, NextApiResponse } from 'next'
import BaseContext from '../baseContext'

export default class CategoryController extends BaseContext {
    private CategoryService = this.di.CategoryService

    async getCategories() {
        const result = await this.CategoryService.getCategories()
        const categories = JSON.parse(JSON.stringify(result))
        if (!categories || !categories.length) {
            return { notFound: true }
        }
        return { categories }
    }
}
