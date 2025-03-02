<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { useApiStore } from "../store/api.js"

const Api = useApiStore()

const organisations = ref([])
const currentOrganisationId = ref('')
const data = ref({
    data: [],
    included: []
})
const realData = ref({})

onMounted(async () => {
    organisations.value = await Api.Request('http://localhost:8080/test/v1.0/org', 'GET')
    currentOrganisationId.value = organisations.value.data[0].id
    // await loadData();
})

watch(() => currentOrganisationId.value, () => {
    if (currentOrganisationId.value) {
        query.value.keyword = ''
        query.value.page = 0
        loadData()
    }
})

async function loadData() {
    const data = await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/real`, 'GET', query.value)
    realData.value = data.data
    totalPage.value = Math.ceil(data.count / query.value.limit)
    // data.value = await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/sample`, 'GET')
    // const temp = data.value.data
    // data.value.data = [...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp,]
}

const query = ref({
    keyword: '',
    page: 0,
    limit: 15
})

const totalPage = ref(0)

watch(() => query.value, async () => {
    loadData()
}, { deep: true })

// Circle

const currentOrganisationIsCircle = computed(() => {
    return organisations.value?.data?.find(o => o.id === currentOrganisationId.value)?.attributes.name === 'Circle'
})

// New Result
async function seed() {
    const user1 = await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/profile`, 'POST', {
        data: {
            type: "profile",
            attributes: {
                "name": "JingAn Chen"
            }
        }
    })
    const user2 = await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/profile`, 'POST', {
        data: {
            type: "profile",
            attributes: {
                "name": "Kimberly Broadwater"
            }
        }
    })
    await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/profile/${user1.data.id}/sample`, 'POST', {
        data: {
            type: "sample",
            attributes: {
                sampleId: "123456789",
                resultType: "antigen"
            }
        }
    })
    await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/profile/${user1.data.id}/sample`, 'POST', {
        data: {
            type: "sample",
            attributes: {
                sampleId: "555555555",
                resultType: "rtpcr"
            }
        }
    })
    await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/profile/${user2.data.id}/sample`, 'POST', {
        data: {
            type: "sample",
            attributes: {
                sampleId: "987654321",
                resultType: "antibody"
            }
        }
    })
    await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/profile/${user2.data.id}/sample`, 'POST', {
        data: {
            type: "sample",
            attributes: {
                sampleId: "999999900",
                resultType: "rtpcr"
            }
        }
    })
}
</script>
<template>
    <div class="flex flex-col justify-start items-stretch bg-gray-100">
        <header class="h-14 bg-white px-v flex justify-between items-center">
            <span class="text-primary text-xl font-bold">Patient Management</span>
            <i @click="seed">add</i>
            <select class="w-auto grow-0 shrink-0" v-model="currentOrganisationId">
                <option v-for="org in organisations.data" :key="org.id" :value="org.id">{{ org.attributes?.name }}</option>
            </select>
        </header>
        <main class="p-v flex flex-col justify-start items-stretch grow shrink gap-v">
            <main class="bg-white h-1 grow shrink rounded-v flex flex-col justify-start items-stretch overflow-y-scroll">
                <header class="flex flex-nowrap justify-start items-center gap-v-sm sticky top-0 bg-white z-10 p-v">
                    <i>search</i>
                    <input placeholder="Search for..." v-model="query.keyword">
                </header>
                <main class="flex flex-col justify-start items-stretch px-v">
                    <table>
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>Activation</th>
                                <th>Report Released</th>
                                <th>Rejection</th>
                                <th>Name</th>
                                <th>Result</th>
                                <th v-if="currentOrganisationIsCircle">Result Type</th>
                                <th v-if="currentOrganisationIsCircle">Patient ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(d, i) in realData" :key="i">
                                <td>{{ d.sampleId }}</td>
                                <td>{{ d.activateTime }}</td>
                                <td>{{ d.resultTime ?? '-' }}</td>
                                <td>{{ d.rejection ?? '-' }}</td>
                                <td>{{ d.profile?.name }}</td>
                                <td>{{ d.result ? d.result === 'negative' ? 'not-detected' : 'detected' : '-' }}</td>
                                <td v-if="currentOrganisationIsCircle">{{ d.type }}</td>
                                <td v-if="currentOrganisationIsCircle" class="text-sm text-gray-400">{{ d.profile.profileId }}</td>
                            </tr>
                        </tbody>
                    </table>
                </main>
            </main>
            <footer class="h-12 flex flex-nowrap justify-end items-center gap-v">
                <div>{{ data.data.length }} records in total</div>
                <nav class="h-full rounded-v bg-white flex justify-center items-center flex-nowrap">
                    <button class="h-full px-v flex justify-center items-center cursor-pointer select-none" @click="query.page = Math.max(0, query.page - 1)">Prev</button>
                    <div class="flex flex-nowrap justify-center items-center gap-v">
                        <div v-for="(_, i) in new Array(totalPage)" :key="i" class="cursor-pointer select-none" @click="query.page = i" :class="{
                            'text-blue-500 underline underline-offset-4 font-bold decoration-2': query.page === i
                        }">{{ i + 1 }}</div>
                    </div>
                    <button class="h-full px-v flex justify-center items-center cursor-pointer select-none" @click="query.page = Math.min(totalPage - 1, query.page + 1)">Next</button>
                </nav>
            </footer>
        </main>
    </div>
</template>