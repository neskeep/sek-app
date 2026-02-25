export const useNavigationStore = defineStore('navigation', () => {
  const menuItems = ref([
    { name: 'Inicio', path: '/' },
    { name: 'Calendario', path: '/calendario' },
    { name: 'Horario', path: '/horario' }
  ])

  return { menuItems }
})
