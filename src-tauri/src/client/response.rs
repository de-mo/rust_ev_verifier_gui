use crate::app_state;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, path::PathBuf};

#[derive(Serialize, Deserialize)]
pub struct StatusResponse {
    pub app_status: app_state::AppStatus,
    pub verfification_period: Option<app_state::VerificationPeriod>,
    pub input_file_location: app_state::InputFileLocation,
    pub location: Option<PathBuf>,
    pub verification_information: HashMap<String, app_state::VerificationInformation>,
    pub verification_status: HashMap<String, app_state::VerificationStatus>,
}
