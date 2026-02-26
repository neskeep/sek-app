<script setup lang="ts">
definePageMeta({ layout: 'default' })

useSeoMeta({
  title: 'SEK Colombia - Calendario Escolar',
  description: 'Calendario escolar del Colegio SEK Colombia con sistema rotativo de 6 dias',
  robots: 'noindex, nofollow',
})

// Badge API: show cycle day number on app icon
useAppBadge()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-white">
    <!-- Hero: Today's Cycle Day -->
    <FeaturesTodayHero />

    <!-- Week Strip -->
    <FeaturesWeekStrip />

    <!-- Divider -->
    <div class="container-app max-w-2xl">
      <hr class="border-gray-100" />
    </div>

    <!-- Monthly Calendar Grid -->
    <FeaturesMonthGrid />

    <!-- Legend -->
    <FeaturesCalendarLegend />

    <!-- PWA Install Banner -->
    <FeaturesInstallBanner />

    <!-- Push Notification Banner -->
    <FeaturesNotificationBanner />

    <!-- Day Detail Sheet -->
    <FeaturesDayDetailSheet />
  </div>
</template>
