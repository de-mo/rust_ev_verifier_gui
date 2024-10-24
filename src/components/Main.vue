<script setup>
import ChoosePeriodVue from './ChoosePeriod.vue'
import LogVue from './Log.vue'
import ResetVue from './Reset.vue'
import ChooseFilesVue from './ChooseFiles.vue'
import { onMounted, ref } from "vue";
import { useAppData } from '../composables/useAppData'
import { useTauriCommand } from '../composables/useTauriCommand'
import { message } from '@tauri-apps/plugin-dialog';
import { APP_DATA_PROP_PERIOD } from "../consts/appDataProperties.js"

const {
    appData,
    period,
    notStarted,
    canReset,
    showFiles,
    contextZipLocation,
    periodZipFile
} = useAppData()

const { tauri_healthCheck, tauri_status } = useTauriCommand()

let is_not_started = ref(notStarted.value)

const try_connect_to_server = async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const max_try_connect = 10;
    let current_try_connect = 0;
    while (is_not_started.value && current_try_connect < max_try_connect) {
        try {
            await tauri_healthCheck()
            is_not_started.value = false
        }
        catch {
            current_try_connect += 1
            await sleep(1000)
        }
    }

    if (is_not_started.value) {
        throw "Not started"
    }
}

onMounted(async () => {
    console.log("onMounted")
    try_connect_to_server()
        .then(async () => await tauri_status())
        .catch(async () => message('Cannot connect to the backend', { title: 'Fatal Error', kind: 'error' }))
}
)
</script>

<template>
    <div class="col">
        <div class="row">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Verification Period</h6>
                    <ChoosePeriodVue :period="period" />
                </div>
            </div>
        </div>
        <div v-if="showFiles" class="row">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Input files</h6>
                    <ChooseFilesVue :period="period" :context-zip-file="contextZipLocation"
                        :period-zip-file="periodZipFile" />
                </div>
            </div>
        </div>
        <div v-if="canReset" class="row">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Reset</h6>
                    <ResetVue :can-reset="canReset" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Log</h6>
                    <LogVue :app-data="appData" />
                </div>
            </div>
        </div>
    </div>
</template>