import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/admin/dashboard/:path*', '/staff/dashboard/:path*', '/student/dashboard/:path*'],
}