import BACKEND_URLS from '@api/urls';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    //cookie expires in fifteen minutes
    const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);

    let token = null
    if (!request.cookies.has('access_token') && request.cookies.has('refresh_token')) {
        const res = await fetch(`${process.env.BACKEND_BASE_URL}${BACKEND_URLS.auth.refreshToken}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refreshToken: request.cookies.get("refresh_token")?.value
            })
        })

        if (res.ok) {
            const data = await res.json();
            token = data?.token?.accesstoken
        }
    }

    // Setting cookies on the response using the `ResponseCookies` API
    const response = NextResponse.next()
    if (token) {
        response.cookies.set({
            name: 'access_token',
            value: token,
            expires: inFifteenMinutes
        })
    }


    return response
}