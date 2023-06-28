import Ajv, {JTDSchemaType} from "ajv/dist/jtd"
import { IUser } from "@/app/types/interfaces"


export const categorySchema = {
    properties: {
        text: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z-]+$',
        }, 
    },
    required: ['text']
}

export const userSchema = {
    properties: {
        firstName: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z]+$',
        },
        lastName: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z]+$',
        },
        username: {
            type: 'string',
            minLength: 3,
            pattern: '^[A-Za-z]+$',
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
        },
        companyId: {
            type: 'string',
            pattern: '^[0-9]+$'
        }
    },
    required: ['firstName', 'lastName', 'username', 'email', 'password', 'role']

}


export const loginSchema = {
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
    properties: {
        id: {
            type: 'string',
            pattern: '^[0-9]+$'
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
            type: 'string',
            pattern: '^[0-9]+$'
        },
        available: {
            type: 'string',
            pattern: '^[0-9]+$'
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
                    pattern: '^[0-9]+$'
                }
            ]
        }
    }

export const goodSchema = {
    properties: goodProperties,
    required: ['title', 'price', 'available']
}

// not used yet
export const goodSchemaPatch = {
    properties: goodProperties,
}

const goodOrderSchema = {
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
    properties: {
        goodId: {
            type: 'number'
        }
    }
}


export const OrderSchema = {
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
    properties: {
        goodId:  {
            type: 'string',
            pattern: '^[0-9]+$'
        },
        text:  {
            type: 'string'
        },
        score:  {
            type: 'string',
            pattern: '^[0-9]+$'
        },
    },
    required: ['goodId', 'text', 'score']
}