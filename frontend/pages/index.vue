<template>
  <div :class="{ 'cursor-wait animate-pulse opacity-10': isLoading }" class="px-20 py-8">
    <h1 class="text-2xl font-semibold leading-tight">Transactions</h1>
    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <TransactionTable :transactions="currentTransactions" @click:row="(transaction) => toggleModal(transaction)" />
    </div>
    <div class="flex flex-col justify-center items-center">
      <button
        class="rounded px-4 py-2 text-xs border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-blue-100 duration-300"
        @click="fetchTransactions(transactions.length)">
        Load more
      </button>
    </div>
  </div>
  <CategoryModal :is-modal-open="isModalOpen" @close="toggleModal" @save="fetchTransactions" :categories="categories"
    :edit-transaction="editTransaction" />
</template>

<script setup>
const config = useRuntimeConfig()
const transactions = reactive([])
const categories = reactive([])
const currentSearch = ref('')
const orderBy = reactive({ date: "desc" })
const isModalOpen = ref(false)
const isLoading = ref(true)
let editTransaction = reactive({})

const fetchTransactions = (offset = 0) => {
  if (isModalOpen.value) {
    isModalOpen.value = false
    transactions.splice(0, transactions.length)
  }
  isLoading.value = true
  let query = `query Transactions {
    transactions(limit: 20, offset: ${offset}, orderBy: ${JSON.stringify(orderBy).replace(/"/g, "")}) {
      account {
        id
        name
        bank
      }
      amount
      category {
        id
        name
        color
      }
      currency
      date
      id
      reference
    }
  }`
  fetch(config.public.apiBase, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: { 'content-type': 'application/json' }
  })
    .then(async (response) => {
      if (response.status != 200) {
        throw response.status
      } else {
        let res = await response.json()
        transactions.push(...res.data.transactions)
        isLoading.value = false
      }
    })
}

const fetchCategories = () => {
  isLoading.value = true
  let query = `query Categories {
    categories {
      color
      id
      name
    }
  }`
  fetch(config.public.apiBase, {
    method: 'POST',
    body: JSON.stringify({ query }),
    headers: { 'content-type': 'application/json' }
  })
    .then(async (response) => {
      if (response.status != 200) {
        throw response.status
      } else {
        let res = await response.json()
        categories.push(...res.data.categories)
        isLoading.value = false
      }
    })
}

onMounted(() => {
  fetchTransactions()
  fetchCategories()
})

const currentTransactions = computed(() => {
  //const headCellSorting = headCells.find((cell) => cell.isSortable)
  let sortedTransactions
  /*if (headCellSorting.isSorting) {
    sortedBodyRows = bodyRows
    headCellSorting.isSorting === "DESC"
      ? sortedBodyRows.sort(
        (a, b) => b[headCellSorting.id] - a[headCellSorting.id]
      )
      : sortedBodyRows.sort(
        (a, b) => a[headCellSorting.id] - b[headCellSorting.id]
      )
  }*/
  if (!currentSearch.value.length) {
    return sortedTransactions || transactions
  }
  return transactions.filter((row) => {
    const searchableValues = [
      row.account.name.toLowerCase(),
      row.account.bank.toLowerCase(),
      row.reference.toLowerCase(),
      row.category.name.toLowerCase(),
      new Date(row.date).toLocaleDateString("us-US"),
      new Intl.NumberFormat("us-US", {}).format(row.amount),
      row.currency.toLowerCase(),
    ]
    return searchableValues.find((value) =>
      value.includes(currentSearch.value.toLowerCase())
    )
  })
})

function toggleModal(transaction) {
  editTransaction = transaction
  isModalOpen.value = !isModalOpen.value
}
</script>