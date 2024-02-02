use anyhow::Result;
use dailp::{auth::UserGroup, SheetResult};
use serde::{Deserialize, Serialize};
use std::str::FromStr;

/// Represents one user's predetermined role.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserPermission {
    /// The user's role
    pub role: UserGroup,
    /// The user's group
    pub email: String,
}

pub struct SheetInterpretation {
    pub sheet: SheetResult,
}

impl SheetInterpretation {
    /// Reads each line of the spreadsheet and encodes any roles defined in it.
    pub fn into_permission_list(self) -> Result<Vec<UserPermission>> {
        let mut sections: Vec<UserPermission> = Vec::new();
        // First row is headers "Full Name" "Alt name" "DOB" "Role" "email"
        for row in self.sheet.values.into_iter().skip(1) {
            if row.len() > 4 && !row[3].is_empty() && !row[4].is_empty() {
                let role = UserGroup::from_str(&format!("{}s", uppercase_first_letter(&row[3])))?;
                sections.push(UserPermission {
                    role,
                    email: row[4].clone(),
                })
            }
        }
        Ok(sections)
    }
}

/// Capitalizes the first letter of a string.
fn uppercase_first_letter(s: &str) -> String {
    let mut c = s.chars();
    match c.next() {
        None => String::new(),
        Some(f) => f.to_uppercase().collect::<String>() + c.as_str(),
    }
}
