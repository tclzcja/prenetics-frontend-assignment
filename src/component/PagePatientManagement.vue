<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useApiStore } from "../store/api.js";

const Api = useApiStore();

const organisations = ref([]);
const currentOrganisationId = ref('');
const data = ref({
    data: [],
    included: []
});

const profilesMap = computed(() => {
    const result = new Map();
    for (const profile of data.value.included.filter(i => i.type === 'profile')) {
        result.set(profile.id, {
            id: profile.id,
            name: profile.attributes.name
        });
    }
    return result;
});

onMounted(async () => {
    organisations.value = await Api.Request('http://localhost:8080/test/v1.0/org', 'GET');
    currentOrganisationId.value = organisations.value.data[0].id;
    // await loadData();
});

watch(() => currentOrganisationId.value, () => {
    if (currentOrganisationId.value) {
        loadData();
    }
});

async function loadData() {
    data.value = await Api.Request(`http://localhost:8080/test/v1.0/org/${currentOrganisationId.value}/sample`, 'GET');
    console.log(data.value);
    const temp = data.value.data;
    data.value.data = [...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp, ...temp,];
}

const keyword = ref('');

const filteredData = computed(() => {
    if (keyword.value) {
        if (currentOrganisationIsCircle.value) {
            return data.value.data.filter(d => d.attributes.sampleId.includes(keyword.value) || d.attributes.activateTime.includes(keyword.value) || d.attributes.resultTime.includes(keyword.value) || profilesMap.value.get(d.relationships.profile.data.id).name.includes(keyword.value) || d.relationships.profile.data.id.includes(keyword.value));
        } else {
            return data.value.data.filter(d => d.attributes.sampleId.includes(keyword.value) || d.attributes.activateTime.includes(keyword.value) || d.attributes.resultTime.includes(keyword.value) || profilesMap.value.get(d.relationships.profile.data.id).name.includes(keyword.value));
        }
    } else {
        return data.value.data;
    }
});

const currentPage = ref(0);
const totalPage = computed(() => {
    return Math.ceil(filteredData.value.length / 15);
});

const currentPageData = computed(() => {
    return filteredData.value.slice(15 * currentPage.value, 15 * (currentPage.value + 1));
});

// Circle

const currentOrganisationIsCircle = computed(() => {
    return currentOrganisationId.value === 'bd0d1c2e-f081-4f3b-a6c3-76d0bda22151';
});
</script>
<template>
    <div class="flex flex-col justify-start items-stretch bg-gray-100">
        <header class="h-14 bg-white px-v flex justify-between items-center">
            <span class="text-primary text-xl font-bold">Patient Management</span>
            <select class="w-auto grow-0 shrink-0" v-model="currentOrganisationId">
                <option v-for="org in organisations.data" :key="org.id" :value="org.id">{{ org.attributes?.name }}</option>
            </select>
        </header>
        <main class="p-v flex flex-col justify-start items-stretch grow shrink gap-v">
            <main class="bg-white h-1 grow shrink rounded-v flex flex-col justify-start items-stretch overflow-y-scroll">
                <header class="flex flex-nowrap justify-start items-center gap-v-sm sticky top-0 bg-white z-10 p-v">
                    <i>search</i>
                    <input placeholder="Search for..." v-model="keyword">
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
                            <tr v-for="(d, i) in currentPageData" :key="i">
                                <td>{{ d.attributes.sampleId }}</td>
                                <td>{{ d.attributes.activateTime }}</td>
                                <td>{{ d.attributes.resultTime ?? '-' }}</td>
                                <td>{{ d.attributes.rejection ?? '-' }}</td>
                                <td>{{ profilesMap.get(d.relationships.profile.data.id).name }}</td>
                                <td>{{ d.attributes.result === 'negative' ? 'not-detected' : 'detected' }}</td>
                                <td v-if="currentOrganisationIsCircle">{{ d.attributes.resultType }}</td>
                                <td v-if="currentOrganisationIsCircle" class="text-sm text-gray-400">{{ d.relationships.profile.data.id }}</td>
                            </tr>
                        </tbody>
                    </table>
                </main>
            </main>
            <footer class="h-12 flex flex-nowrap justify-end items-center gap-v">
                <div>{{ data.data.length }} records in total</div>
                <nav class="h-full rounded-v bg-white flex justify-center items-center flex-nowrap">
                    <button class="h-full px-v flex justify-center items-center cursor-pointer select-none" @click="currentPage = Math.max(0, currentPage - 1)">Prev</button>
                    <div class="flex flex-nowrap justify-center items-center gap-v">
                        <div v-for="(_, i) in new Array(totalPage)" :key="i" class="cursor-pointer select-none" @click="currentPage = i" :class="{
                            'text-blue-500 underline underline-offset-4 font-bold decoration-2': currentPage === i
                        }">{{ i + 1 }}</div>
                    </div>
                    <button class="h-full px-v flex justify-center items-center cursor-pointer select-none" @click="currentPage = Math.min(totalPage - 1, currentPage + 1)">Next</button>
                </nav>
            </footer>
        </main>
    </div>
</template>