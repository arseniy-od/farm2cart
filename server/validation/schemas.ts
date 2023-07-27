import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import { IUser } from "@/app/types/interfaces"


export const categorySchema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z-]+$',
            errorMessage: {
                pattern: "Should only contain letters and '-'",
            },
        }, 
    },
    required: ['text'],
}

export const goodFilterSchema = {
    type: 'object',
    properties: {
        page: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "Page should be a string with number value",
            },
        },
        search: {
            type: 'string',
        },
        slug: {
            type: 'string',
            minLength: 3,
            pattern: '^[a-z-]+$',
            errorMessage: {
                pattern: "Slug should only contain lower-case letters and '-'",
                minLength: "Slug length should be 3 symbols or more"
            },
        },
        categorySlug: {
            type: 'string',
            minLength: 3,
            pattern: '^[a-z-]+$',
            errorMessage: {
                pattern: "Slug should only contain lower-case letters and '-'",
                minLength: "Slug length should be 3 symbols or more"
            },
        },
        currentUser: {
            type: 'string',
            pattern: '^true$',
            errorMessage: {
                pattern: "currentUser field should have value of 'true'",
            },
        },
        userId: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "userId should be a string with number value",
            },
        }

    },

}


export const userSchema = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z]+$',
            errorMessage: {
                pattern: "Should only contain letters",
            },
        },
        lastName: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z]+$',
            errorMessage: {
                pattern: "Should only contain letters",
            },
        },
        username: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z0-9]+$',
            errorMessage: {
                pattern: "Should only contain letters and numbers",
            },
        },
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            format: 'password',
            minLength: 4,
        },
        role: {
            type: 'string',
            enum: ['customer', 'seller'],
        },
        companyId: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "Id should be a string with number value",
            },
        }
    },
    required: ['firstName', 'lastName', 'username', 'email', 'password', 'role']

}


export const loginSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            format: 'password',
            minLength: 4,
        },
    },
    required: ['email', 'password']
}

const categoryIdSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "Id should be a string with number value",
            },
        }
    }
}

const goodProperties = {
        title: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        imageUrl: {
            type: 'string'
        },
        price: {
            anyOf: [
                {
                    type: 'string',
                    pattern: '^[0-9\.]+$',
                    errorMessage: {
                        pattern: "Price should be a string with number value",
                    },
                },
                {
                    type: 'number'
                }
            ]
        },
        available: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "Available should be a string with number value",
            },
        },
        active: {
            type: 'string',
            enum: ['1', '0']
        },
        categories: {
            anyOf: [
                {
                    type: 'array',
                    items: categoryIdSchema
                },
                {
                    type: 'string',
                    pattern: '^[0-9]+$',
                    errorMessage: {
                        pattern: "Category id should be a string with number value",
                    },
                }
            ]
        }
    }

export const goodSchema = {
    type: 'object',
    properties: goodProperties,
    required: ['title', 'price', 'available']
}

// not used yet
export const goodSchemaPatch = {
    type: 'object',
    properties: goodProperties,
}

const goodOrderSchema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        imageUrl: {
            type: 'string'
        },
        price: {
            type: 'number',
        },
        available: {
            type: 'number',
        },
        active: {
            type: 'number',
            enum: [1, 0]
        },
       
    },
    required: ['title', 'price', 'available', 'active']
}


export const cartSchema = {
    type: 'object',
    properties: {
        goodId: {
            type: 'number'
        }
    }
}


export const orderSchema = {
    type: 'object',
    properties: {
        goods: {
            type: 'array',
            items: goodOrderSchema
        },
        total: {
            type: 'number',
        }
    },
    required: ['goods', 'total']
}

export const orderFilterSchema = {
    type: 'object',
    properties: {
        page: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "Page should be a string with number value",
            },
        },
        // some strange error if there is no search in query
        search: {
            type: 'string',
        },
    },

}

export const CompanySchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        description: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        email: {
            type: 'string',
            format: 'email'
        }
    },
    required: ['name', 'email']
}


export const reviewSchema = {
    type: 'object',
    properties: {
        goodId:  {
            type: 'number',
            errorMessage: 'Good id must be a number'
        },
        text:  {
            type: 'string'
        },
        score:  {
            type: 'number',
            errorMessage: 'Score must be a number'
            
        },
    },
    required: ['goodId', 'text', 'score']
}