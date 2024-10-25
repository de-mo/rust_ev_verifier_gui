import { ref, computed } from "vue"
import {
    STATUS_STARTING,
    STATUS_NOT_INITIALIZED,
    STATUS_INITIALIZED,
    STATUS_CONTEXT_DATA_SET_LOADED,
    STATUS_PERIOD_DATA_SET_LOADED,
    STATUS_EXTRACTING,
    STATUS_EXTRACT_ERROR,
    STATUS_EXTRACTED,
    STATUS_RUNNING,
    STATUS_RUN_ERROR,
    STATUS_FINISHED
} from "../consts/appStatus.js"
import {
    APP_DATA_PROP_STATUS,
    APP_DATA_PROP_INPUT_FILE_LOCATION,
    APP_DATA_PROP_PERIOD,
    APP_DATA_PROP_CONTEXT_ZIP_FILE,
    APP_DATA_PROP_SETUP_ZIP_FILE,
    APP_DATA_PROP_TALLY_ZIP_FILE,
    APP_DATA_PROP_ERROR,
    APP_DATA_PROP_LOCATION,
    APP_DATA_PROP_VERIFICATION_INFORMATION,
    APP_DATA_PROP_VERIFICATION_STATUS
} from "../consts/appDataProperties.js"
import { PERIOD_SETUP, PERIOD_TALLY } from "../consts/period.js"
import { TAURI_EVENT_UPDATE_APPDATA } from "../consts/tauri.js"
import { listen } from '@tauri-apps/api/event';
import _ from "lodash";

export function useAppData() {
    const appData = ref({
        app_status: STATUS_STARTING,
    })

    listen(TAURI_EVENT_UPDATE_APPDATA, (event) => {
        console.log(`listen ${TAURI_EVENT_UPDATE_APPDATA}`, event.payload)
        appData.value = event.payload
        console.log("AppData after update: ", appData.value)
    })

    const notStarted = computed(() => {
        return appData.value[APP_DATA_PROP_STATUS] == STATUS_STARTING
    })

    const period = computed(() => {
        return appData.value[APP_DATA_PROP_PERIOD]
    })

    const canReset = computed(() => {
        return ![STATUS_STARTING, STATUS_RUNNING, STATUS_EXTRACTING].includes(appData.value[APP_DATA_PROP_STATUS])
    })

    const showFiles = computed(() => {
        return ![STATUS_STARTING, STATUS_NOT_INITIALIZED].includes(appData.value[APP_DATA_PROP_STATUS])
    })

    const isExtracted = computed(() => {
        return [STATUS_EXTRACTED, STATUS_RUNNING, STATUS_RUN_ERROR, STATUS_FINISHED].includes(appData.value[APP_DATA_PROP_STATUS])
    })

    const isExtracting = computed(() => {
        return appData.value[APP_DATA_PROP_STATUS] == STATUS_EXTRACTING
    })

    const extractError = computed(() => {
        if (appData.value[APP_DATA_PROP_STATUS] == STATUS_EXTRACT_ERROR) {
            return appData.value[APP_DATA_PROP_ERROR]
        }
    })

    const runError = computed(() => {
        if (appData.value[APP_DATA_PROP_STATUS] == STATUS_RUN_ERROR) {
            return appData.value[APP_DATA_PROP_ERROR]
        }
    })

    const isRunning = computed(() => {
        return appData.value[APP_DATA_PROP_STATUS] == STATUS_RUNNING
    })

    const isFinished = computed(() => {
        return appData.value[APP_DATA_PROP_STATUS] == STATUS_FINISHED
    })

    const isBackgroundTaskRunning = computed(() => {
        return isExtracting.value || isRunning.value
    })

    const location = computed(() => {
        return appData.value[APP_DATA_PROP_LOCATION]
    })

    const contextZipLocation = computed(() => {
        const appDataFileLocation = appData.value[APP_DATA_PROP_INPUT_FILE_LOCATION]
        if (appDataFileLocation) {
            return appDataFileLocation[APP_DATA_PROP_CONTEXT_ZIP_FILE]
        }
    })

    const periodZipFile = computed(() => {
        const appDataFileLocation = appData.value[APP_DATA_PROP_INPUT_FILE_LOCATION]
        if (period.value && appDataFileLocation) {
            if (period.value == PERIOD_SETUP) {
                return appDataFileLocation[APP_DATA_PROP_SETUP_ZIP_FILE]
            } else {
                return appDataFileLocation[APP_DATA_PROP_TALLY_ZIP_FILE]
            }
        }
    })

    const verificationList = computed(() => {
        if (appData.value[APP_DATA_PROP_VERIFICATION_INFORMATION]) {
            return Object.values(appData.value[APP_DATA_PROP_VERIFICATION_INFORMATION]).sort((a, b) => a.id - b.id);
        }
        appData.value[APP_DATA_PROP_VERIFICATION_INFORMATION]
        /*const list = ;
        if (list) {
            return list.concat().sort((a, b) => a.id < b.id)
        }
        return list*/
    })

    const verificationResult = computed(() => {
        return appData.value[APP_DATA_PROP_VERIFICATION_STATUS]
    })

    return {
        appData,
        notStarted,
        period,
        canReset,
        showFiles,
        isExtracting,
        isExtracted,
        contextZipLocation,
        periodZipFile,
        isBackgroundTaskRunning,
        extractError,
        runError,
        location,
        verificationList,
        verificationResult,
        isRunning,
        isFinished
    }
}