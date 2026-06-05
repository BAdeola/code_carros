import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // 1. Cria a resposta inicial que pode ser modificada
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Inicializa o Supabase com a nova estrutura recomendada
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Verifica ativamente o usuário e atualiza a sessão (IMPORTANTÍSSIMO)
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Lógica de Redirecionamento Baseada em Cargos (Role-Based)
  if (user) {
    // Busca o cargo do usuário
    const { data: perfil } = await supabase
      .from('perfis')
      .select('cargo')
      .eq('id', user.id)
      .single()

    const cargo = perfil?.cargo

    // Se estiver na tela de login, manda pro dashboard certo
    if (request.nextUrl.pathname.startsWith('/login')) {
      if (cargo === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admins', request.url))
      } else if (cargo === 'gerente') {
        return NextResponse.redirect(new URL('/dashboard/gerentes', request.url))
      }
    }

    // Proteção Cruzada - Admin
    if (request.nextUrl.pathname.startsWith('/dashboard/admins') && cargo !== 'admin') {
      return NextResponse.redirect(new URL(cargo === 'gerente' ? '/dashboard/gerentes' : '/login', request.url))
    }

    // Proteção Cruzada - Gerente
    if (request.nextUrl.pathname.startsWith('/dashboard/gerentes') && cargo !== 'gerente') {
      return NextResponse.redirect(new URL(cargo === 'admin' ? '/dashboard/admins' : '/login', request.url))
    }

  } else {
    // Se não tem usuário e tenta entrar numa rota protegida, chuta pro login
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}