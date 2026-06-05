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

    // 🚨 NOVA REGRA DE SEGURANÇA INTELIGENTE E ANTI-LOOP
  if (user) {
    // 1. Buscamos o cargo na tabela perfis
    const { data: perfil } = await supabase
      .from('perfis')
      .select('cargo')
      .eq('id', user.id)
      .single()

    const cargo = perfil?.cargo // Pode ser 'admin', 'gerente', ou vir vazio (null)

    // 2. Se tentar aceder ao /login já estando logado
    if (request.nextUrl.pathname.startsWith('/login')) {
      if (cargo === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admins', request.url))
      } else if (cargo === 'gerente') {
        return NextResponse.redirect(new URL('/dashboard/gerentes', request.url))
      }
      // 🔹 ANTI-LOOP: Se não tiver cargo, NÃO fazemos redirect! 
      // Deixamos a pessoa ficar na página de login.
    }

    // 3. Proteção Cruzada do Painel Admin
    if (request.nextUrl.pathname.startsWith('/dashboard/admins')) {
      if (cargo === 'gerente') {
        return NextResponse.redirect(new URL('/dashboard/gerentes', request.url))
      } else if (cargo !== 'admin') {
        // Se não for admin nem gerente (conta defeituosa), expulsa para o login
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // 4. Proteção Cruzada do Painel Gerente
    if (request.nextUrl.pathname.startsWith('/dashboard/gerentes')) {
      if (cargo === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admins', request.url))
      } else if (cargo !== 'gerente') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
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