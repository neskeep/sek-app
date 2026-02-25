export const useNavigationStore = defineStore('navigation', () => {
  const menuItems = ref([
    { name: 'Hoy', path: '/' }
  ])

  return { menuItems }
})
