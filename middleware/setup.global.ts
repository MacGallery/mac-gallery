export default defineNuxtRouteMiddleware((to, from) => {
    to.meta.layout = to.name?.toString().split('-')[0] == 'admin' ? 'admin' : 'default';
    // In a real app you would probably not redirect every route to `/`
    // however it is important to check `to.path` before redirecting or you
    // might get an infinite redirect loop
    // if (to.path !== '/') {
    //     return navigateTo('/')
    // }
})