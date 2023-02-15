<template>
  <Teleport to="body">
    <transition enter-active-class="transition-opacity ease-linear duration-300" enter-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity ease-linear duration-300"
      leave-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50">
        <div class="max-w-xl p-3 mx-auto my-auto rounded-xl shadow-lg bg-white justify-center max-h-screen text-center">
          <div>
            <div class="text-center p-3 flex-auto justify-center leading-6">
              <h2 class="text-2xl font-bold py-4">Edit category</h2>
              <p class="text-md text-gray-500 px-8 text-left">
              <div class="py-4">
                <p><b>Reference:</b> {{ editTransaction.reference || 'No reference provided' }}</p>
                <p><b>Name:</b> {{ editTransaction.account.name }}</p>
                <p><b>Bank:</b> {{ editTransaction.account.bank }}</p>
                <p><b>Category:</b> {{ editTransaction.category.name }}</p>
                <p><b>Change category:</b> <select name="categories" v-model="editCategory"
                    :style="{ 'background-color': `#${editCategory.color}` }"
                    class="appearance-none bg-white border border-gray-400 hover:border-gray-500 px-1 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id"
                      :selected="cat.id === editTransaction.category.id">{{ cat.name }}</option>
                  </select></p>
              </div>
              <div class="py-2">
                <p><b>Or create a new category:</b> <input type="text" v-model="newCategory" placeholder="New category"
                    class="shadow appearance-none border rounded py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </p>
                <p><b>...and choose a color:</b> <select v-model="newColor"
                    :style="{ 'background-color': `#${newColor}` }"
                    class="appearance-none bg-white border border-gray-400 hover:border-gray-500 px-1 py-1 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                    <option disabled>Choose a new color...</option>
                    <option v-for="(color, i) in colors" :key="i" :value="color"
                      :style="{ 'background-color': `#${color}` }"></option>
                  </select></p>
              </div>
              </p>
            </div>
            <div class="p-3 mt-2 text-center space-x-4 md:block">
              <button @click="saveCategory"
                class="mb-2 md:mb-0 bg-purple-500 border border-purple-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-md hover:shadow-lg hover:bg-purple-600">
                Save category
              </button>
              <button @click="closeModal"
                class="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-gray-600 rounded-md hover:shadow-lg hover:bg-gray-100">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
const config = useRuntimeConfig()
const editCategory = ref('')
const newCategory = ref('')
const newColor = ref('')

const props = defineProps({
  isModalOpen: Boolean,
  editTransaction: {},
  categories: {
    type: Array,
    required: true,
  },
  toggleModal: {
  },
})

const colors = computed(() => {
  return [...new Set(props.categories.map(a => a.color).filter(n => n))]
})

const saveCategory = () => {
  let queryCategory = {
    query: `mutation UpdateTransactionCategory($updateTransactionCategoryId: String!, $categoryId: String!) {
      updateTransactionCategory(id: $updateTransactionCategoryId, categoryId: $categoryId) {
        id
      }
    }`,
    variables: {
      updateTransactionCategoryId: props.editTransaction.id,
      categoryId: editCategory.value
    }
  }
  if (editCategory.value != '') {
    fetchCategory(queryCategory)
  } else if (newCategory.value != '') {
    let queryNewCategory = {
      query: `mutation AddCategory($categoryContent: CategoryContent!) {
        addCategory(categoryContent: $categoryContent) {
          id
        }
      }`,
      variables: {
        categoryContent: {
          name: newCategory.value, 
          color: newColor.value || null 
        }
      }
    }
    fetch(config.public.apiBase, {
      method: 'POST',
      body: JSON.stringify(queryNewCategory),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (response) => {
        if (response.status != 200) {
          throw response.status
        } else {
          let res = await response.json()
          let queryCategory = {
            query: `mutation UpdateTransactionCategory($updateTransactionCategoryId: String!, $categoryId: String!) {
              updateTransactionCategory(id: $updateTransactionCategoryId, categoryId: $categoryId) {
                id
              }
            }`,
            variables: {
              updateTransactionCategoryId: props.editTransaction.id,
              categoryId: res.data.addCategory.id
            }
          }
          fetchCategory(queryCategory)
        }
      })
  } else closeModal()
}

const fetchCategory = (query) => {
  fetch(config.public.apiBase, {
      method: 'POST',
      body: JSON.stringify(query),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (response) => {
        if (response.status != 200) {
          throw response.status
        } else {
          saveModal()
        }
      })
}

const closeModal = () => {
  resetModal()
  emit('close')
}

const saveModal = () => {
  resetModal()
  emit('save')
}

const resetModal = () => {
  editCategory.value = ''
  newCategory.value = ''
  newColor.value = ''
}

const emit = defineEmits(['close', 'save'])
</script>
