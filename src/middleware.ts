import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Protect all admin routes
  if (pathname.startsWith('/admin')) {
    // Check if user is authenticated with Cloudflare Access
    const cfAccessJwt = context.request.headers.get('cf-access-jwt-assertion');
    const cfAccessEmail = context.request.headers.get('cf-access-user-email');

    if (!cfAccessJwt || !cfAccessEmail) {
      // Redirect to Cloudflare Access login
      return context.redirect('/.cloudflareaccess/');
    }

    // Optional: Add user info to context for use in admin pages
    context.locals.user = {
      email: cfAccessEmail,
      jwt: cfAccessJwt
    };
  }

  return next();
});
