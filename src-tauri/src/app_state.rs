use crate::client::StatusResponse;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, ops::Deref, path::PathBuf, sync::Mutex};
use strum::{AsRefStr, EnumString};
use tauri::{AppHandle, Emitter, State};

pub struct AppDataMutex(pub Mutex<AppData>);

#[derive(Serialize, Deserialize)]
pub struct AppData {
    pub app_status: AppStatus,
    pub verfification_period: Option<VerificationPeriod>,
    pub input_file_location: InputFileLocation,
    pub location: Option<PathBuf>,
    pub verification_information: HashMap<String, VerificationInformation>,
    pub verification_status: HashMap<String, VerificationStatus>,
}

#[derive(Copy, Clone, Debug, PartialEq, Eq, AsRefStr, EnumString, Serialize, Deserialize)]
#[strum(serialize_all = "lowercase")]
pub enum VerificationPeriod {
    #[serde(rename = "setup")]
    Setup,
    #[serde(rename = "tally")]
    Tally,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, AsRefStr, Serialize, Deserialize)]
pub enum AppStatus {
    NotInitialized,
    Initialized,
    ContextDataSetLoaded,
    PeriodDataSetLoaded,
    Extracting,
    Extracted,
    Running,
    Finished,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputFileLocation {
    pub context_zip_file: Option<PathBuf>,
    pub setup_zip_file: Option<PathBuf>,
    pub tally_zip_file: Option<PathBuf>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum VerificationStatusEnum {
    NotStarted,
    Running,
    FinishedSuccessfully,
    FinishedWithFailures,
    FinishedWithErrors,
    FinishedWithFailureAndErrors,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerificationInformation {
    pub id: String,
    pub name: String,
    pub category: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerificationStatus {
    pub id: String,
    pub status: VerificationStatusEnum,
    pub failures: Vec<String>,
    pub errors: Vec<String>,
}

impl Default for AppData {
    fn default() -> Self {
        Self {
            app_status: AppStatus::NotInitialized,
            verfification_period: None,
            input_file_location: InputFileLocation::default(),
            verification_information: HashMap::new(),
            verification_status: HashMap::new(),
            location: None,
        }
    }
}

impl Default for InputFileLocation {
    fn default() -> Self {
        Self {
            context_zip_file: Default::default(),
            setup_zip_file: Default::default(),
            tally_zip_file: Default::default(),
        }
    }
}

impl Default for VerificationStatusEnum {
    fn default() -> Self {
        VerificationStatusEnum::NotStarted
    }
}

impl Default for AppDataMutex {
    fn default() -> Self {
        Self(Mutex::new(AppData::default()))
    }
}

impl AppDataMutex {
    pub fn update_with_status_response(&self, status: StatusResponse) {
        let mut data = self.0.lock().unwrap();
        data.app_status = status.app_status;
        data.input_file_location = status.input_file_location;
        data.location = status.location;
        data.verfification_period = status.verfification_period;
        data.verification_information = status.verification_information;
        data.verification_status = status.verification_status;
    }

    pub fn emit_update_appdata_to_frontend(&self, app: &AppHandle) -> Result<(), String> {
        let state = self.0.lock().unwrap();
        let state_value = state.deref();
        app.emit("update-appdata", state_value)
            .map_err(|e| format!("Error emmiting event update-appdata {}", e))
    }
}
