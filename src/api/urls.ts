
const BACKEND_URLS = {
    baseURl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    auth: {
        me: "/users/current-user/",
        register: "/users/",
        login: "/users/login/",
        resendOtp: "/users/resend-verification/",
        forgotPassword: "/users/forgot-password/",
        resetPassword: "/users/reset-password/",
        verifyEmail: "/users/verify/",
        logout: "/users/logout/",
        refreshToken: "/users/refresh-access-token/",
        google: "/auth/google/callback/"
    },
    seller: {
        myBusinesses: "/business/current-user/",
        business: "/store/",
        public: "/store/public/",
        analytics: "/store/dashboard/",
        wallet: {
            index: "/wallet/",
            bank: "/wallet/bank/",
            transaction: "/wallet/transactions/",
            withdraw: "/wallet/withdraw/",
            verify: "/wallet/bank-verify/"
        },
        sales: "/store/sales-chart/",
        best_seller: "/store/best-seller/",
        logo: "/store/logo/"
    },
    product: {
        create: "/product/store/",
        index: "/product/",
        seller: "/product/store/",
        addReview: "/review/",
        topPick: "/product/top-pick-products/",
        newArrival: ";product/all-products/",
        min_max_price: "/product/min-max-price/"
    },
    user: {
        order: "/order/",
        get: "/order/get-user/",
        summary: "/order/summary/",
        cart: "/cart/",
        wishlist: "/wishlist/",
        download: "/users/downloads/",
        checkout: "/checkout/initialize/",
        verify_payment: "/checkout/verify/",
        verify_coupon: "/coupon",
        profile_picture: "/users/profile-picture/"
    },
    make_payment: {
        with_paystack: "/checkout/paystack/payment/"
    },
    register_business: "/store/",
    order: {
        create: "/order/place-order/",
        get: "/order/",
        store: "/order/store/"
    },
    catalog: {
        categories: "/catalog/categories/",
        subcategories: "/catalog/sub-categories/",
        colors: "/catalog/colors/",
        active_colors: "/catalog/active-colors/",
        brands: "/catalog/brands/",
        active_brands: "/catalog/active-brands/",
        active_categories: "/catalog/active-categories"
    },
    shipping: "/shipping",
    report: "/report/"
};

export default BACKEND_URLS;