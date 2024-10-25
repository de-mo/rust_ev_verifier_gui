import { useTauriCommand } from "./useTauriCommand.js"

export function useRunningTasks() {
    const tryConnectToServer = async (refIsnotStarted) => {
        const { tauriHealthCheck } = useTauriCommand()
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const max_try_connect = 10;
        let current_try_connect = 0;
        while (refIsnotStarted.value && current_try_connect < max_try_connect) {
            try {
                await tauriHealthCheck()
                refIsnotStarted.value = false
            }
            catch {
                current_try_connect += 1
                await sleep(1000)
            }
        }

        if (refIsnotStarted.value) {
            throw "Not started"
        }
    }

    const askStatusUntilTaskFinished = async (isBackgroundTaskRunning) => {
        const { tauriStatus } = useTauriCommand()
        const interval = setInterval(async () => {
            await tauriStatus();
            if (!isBackgroundTaskRunning.value) {
                clearInterval(interval)
            }
        }, 1000);
    }

    return {
        tryConnectToServer,
        askStatusUntilTaskFinished
    }
}