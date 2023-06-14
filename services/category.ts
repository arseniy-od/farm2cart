import { User, Review, Good, Order, OrderGood, Category, CategoryGood, Company } from '@/database/models'


export async function getCategoryByText(text:string) {
    return await Category.findOne(
        {
            where: {text},
            include: [
                {
                    model: Good,
                    include : [
                        {model: User, as: "seller"},
                        {model: Category, as: "Categories"}
                    ]
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

export async function createCategory(categoryData) {
    return await Category.create(categoryData);
}

export async function deleteCategory(id) {
    return await Category.destroy({where: { id }})
}

export async function updateCategory(id, categoryData) {
    const category = await Category.findOne({where: {id}})
    if (!category) {
        return {error: true, message: "Category not found"}
    }
    return await category.update(categoryData)
}