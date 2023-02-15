<template>
  <table class="table-auto bg-transparent stripe hover min-w-full leading-normal">
    <thead class="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
      <tr>
        <th class="px-6 py-3 border-zinc-200 whitespace-nowrap font-semibold text-xs"
          >
            Reference
        </th>
        <th class="px-6 py-3 border-zinc-200 whitespace-nowrap font-semibold text-xs"
          >
            Category
        </th>
        <th class="px-6 py-3 border-zinc-200 whitespace-nowrap font-semibold text-xs"
          >
            Date
        </th>
        <th class="px-6 py-3  border-zinc-200 whitespace-nowrap font-semibold text-xs"
          >
            Amount
        </th>
      </tr>
    </thead>
    <tbody class="border-b border-gray-200 bg-white text-sm">
      <tr v-for="row in transactions" :key="row.id" class="hover:bg-slate-50 hover:cursor-pointer border-b-2"
        @click="() => emit('click:row', row)">
        <td class="p-2" :class="row.reference ?? 'text-gray-400'">{{ row.reference || 'No reference provided' }}</td>
        <td class="p-2">
          <span v-if="row.category"
              class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
            >
            <span v-if="row.category?.color"
              aria-hidden
              :style="{ 'background-color': `#${row.category?.color}` }"
              class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            ></span>
            <span class="relative">{{ row.category?.name }}</span>
          </span>
        </td>
        <td class="p-2">{{ new Date(row.date).toLocaleDateString('us-US') }}</td>
        <td class="p-2 w-0 text-right">{{ new Intl.NumberFormat('us-US', {}).format(row.amount) }} <span
            class="text-zinc-400"> {{ row.currency }} </span></td>
      </tr>
    </tbody>
  </table>
</template>
  
<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  },
})

const emit = defineEmits(['click:row']);
</script>