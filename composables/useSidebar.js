import { useStorage, useToggle } from '@vueuse/core'
export const useSidebar = () => {
    const isCollapsed = useStorage('sidebar-state', true);
    const toggle = useToggle(isCollapsed);

    return {
        isCollapsed,
        toggle
    }
}