<script setup>
import ChoosePeriodVue from './ChoosePeriod.vue'
import LogVue from './Log.vue'
import ResetVue from './Reset.vue'
import ChooseFilesVue from './ChooseFiles.vue'
import VerificationsVue from './Verifications.vue'
import { onMounted, ref } from "vue";
import { useAppData } from '../composables/useAppData'
import { useTauriCommand } from '../composables/useTauriCommand'
import { useRunningTasks } from '../composables/useRunningTasks.js'
import { message } from '@tauri-apps/plugin-dialog';
import { APP_DATA_PROP_PERIOD } from "../consts/appDataProperties.js"

const {
    appData,
    period,
    notStarted,
    canReset,
    showFiles,
    isExtracting,
    isExtracted,
    contextZipLocation,
    periodZipFile,
    isBackgroundTaskRunning,
    extractError,
    location,
    verificationList,
    verificationResult,
    isRunning,
    isFinished
} = useAppData()

const { tauriStatus, tauriExtract, tauriRun } = useTauriCommand()
const { tryConnectToServer, askStatusUntilTaskFinished } = useRunningTasks()

const startExtract = async () => {
    await tauriExtract();
    askStatusUntilTaskFinished(isBackgroundTaskRunning)
}

const startRun = async () => {
    await tauriRun();
    askStatusUntilTaskFinished(isBackgroundTaskRunning)
}

let isNotStarted = ref(notStarted.value)
onMounted(async () => {
    console.log("onMounted")
    tryConnectToServer(isNotStarted)
        .then(async () => await tauriStatus())
        .catch(async (error) => message(`Cannot connect to the backend: ${error}`, { title: 'Fatal Error', kind: 'error' }))
})
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
                        :period-zip-file="periodZipFile" :is-extracting="isExtracting" :is-extracted="isExtracted"
                        :error="extractError" :location="location" @extract="startExtract" />
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
        <div v-if="isExtracted" class="row">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">Verifications</h6>
                    <VerificationsVue :verification-list="verificationList" :verification-result="verificationResult"
                        :is-running="isRunning" :is-finished="isFinished" :error="extractError" @run="startRun" />
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