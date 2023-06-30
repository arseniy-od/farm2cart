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
        phoneNumber: {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "Should only contain numbers",
            },
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


export const OrderSchema = {
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
            type: 'string',
            pattern: '^[0-9]+$', 
            errorMessage: {
                pattern: "Id should be a string with number value",
            },
        },
        text:  {
            type: 'string'
        },
        score:  {
            type: 'string',
            pattern: '^[0-9]+$',
            errorMessage: {
                pattern: "Score should be a string with number value",
            },
        },
    },
    required: ['goodId', 'text', 'score']
}