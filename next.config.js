/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // serverRuntimeConfig: {
    //     // Specifies the maximum allowed size for the request body
    //     // You can adjust the value as needed (e.g., 10mb, 100mb, etc.)
    //     maxBodySize: '5mb',
    // },
    // api: {
    //     bodyParser: {
    //         sizeLimit: '5mb' // Set desired value here
    //     }
    // }
}

module.exports = nextConfig
