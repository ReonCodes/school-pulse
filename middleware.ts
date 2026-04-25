import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/admin/dashboard/:path*', '/teacher/dashboard/:path*', '/student/dashboard/:path*'],
}