import { ref, computed } from "vue"
import {
    STATUS_STARTING,
    STATUS_NOT_INITIALIZED,
    STATUS_RUNNING,
    STATUS_EXTRACTING,
} from "../consts/appStatus.js"
import {
    APP_DATA_PROP_STATUS,
    APP_DATA_PROP_INPUT_FILE_LOCATION,
    APP_DATA_PROP_PERIOD,
    APP_DATA_PROP_CONTEXT_ZIP_FILE,
    APP_DATA_PROP_SETUP_ZIP_FILE,
    APP_DATA_PROP_TALLY_ZIP_FILE
} from "../consts/appDataProperties.js"
import { PERIOD_SETUP, PERIOD_TALLY } from "../consts/period.js"
import { TAURI_EVENT_UPDATE_APPDATA } from "../consts/tauri.js"
import { listen } from '@tauri-apps/api/event';

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

    const contextZipLocation = computed(() => {
        const appDataFileLocation = appData.value[APP_DATA_PROP_INPUT_FILE_LOCATION]
        if (appDataFileLocation) {
            return appDataFileLocation[APP_DATA_PROP_CONTEXT_ZIP_FILE]
        }
    })

    const periodZipFile = computed(() => {
        const appDataFileLocation = appData.value[APP_DATA_PROP_INPUT_FILE_LOCATION]
        if (period && appDataFileLocation) {
            if (period == PERIOD_SETUP) {
                return appDataFileLocation[APP_DATA_PROP_SETUP_ZIP_FILE]
            } else {
                return appDataFileLocation[APP_DATA_PROP_TALLY_ZIP_FILE]
            }
        }
    })

    return {
        appData,
        notStarted,
        period,
        canReset,
        showFiles,
        contextZipLocation,
        periodZipFile
    }
}