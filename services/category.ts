import { User, Review, Good, Order, OrderGood, Category, CategoryGood, Company } from '@/database/models'


export async function getCategoryByText(text:string) {
    return await Category.findOne(
        {
            where: {text},
            include: [
                {
                    model: Good,
                }
            ]
        })
}


export async function getAllCategorySlugs() {
    const categories = await Category.findAll()
    return categories.map(category => {
        return {
            params: {
            slug: category.text.toLowerCase()
        }}
    })    
}


export function getCategories() {
    return (
        Category.findAll({
            include: [
                {
                    model: Good,
                }
            ]
        })
    );
}