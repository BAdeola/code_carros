import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
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
    const isAdmin = cargo === 'admin' || cargo === 'super_admin'
    const isGerente = cargo === 'gerente'

    // Usuário logado tentando acessar /login → manda pro dashboard certo
    if (request.nextUrl.pathname.startsWith('/login')) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/dashboard/admins', request.url))
      } else if (isGerente) {
        return NextResponse.redirect(new URL('/dashboard/gerentes', request.url))
      }
    }

    // Proteção cruzada
    if (request.nextUrl.pathname.startsWith('/dashboard/admins') && !isAdmin) {
      return NextResponse.redirect(
        new URL(isGerente ? '/dashboard/gerentes' : '/login', request.url)
      )
    }

    if (request.nextUrl.pathname.startsWith('/dashboard/gerentes') && !isGerente) {
      return NextResponse.redirect(
        new URL(isAdmin ? '/dashboard/admins' : '/login', request.url)
      )
    }

  } else {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}