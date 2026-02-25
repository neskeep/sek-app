export const useUiStore = defineStore('ui', () => {
  const isMobileMenuOpen = ref(false)
  const isLoading = ref(false)

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function setLoading(value: boolean) {
    isLoading.value = value
  }

  return {
    isMobileMenuOpen,
    isLoading,
    toggleMobileMenu,
    setLoading
  }
})
