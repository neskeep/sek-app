<script setup lang="ts">
definePageMeta({ layout: 'default' })
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
  </div>
</template>
