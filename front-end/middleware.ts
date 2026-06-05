import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    response = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    response.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        const { data: perfil } = await supabase
        .from('perfis')
        .select('cargo')
        .eq('id', user.id)
        .single()

        const cargo = perfil?.cargo

        if (request.nextUrl.pathname === '/login') {
        if (cargo === 'admin') {
            return NextResponse.redirect(new URL('/dashboard/admins', request.url))
        } else {
            return NextResponse.redirect(new URL('/dashboard/gerentes', request.url)) 
        }
        }

        if (request.nextUrl.pathname.startsWith('/dashboard/admins') && cargo !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard/gerentes', request.url))
        }

        if (request.nextUrl.pathname.startsWith('/dashboard/gerentes') && cargo !== 'gerente') {
        return NextResponse.redirect(new URL('/dashboard/admins', request.url))
        }

    } else {
        if (request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
}