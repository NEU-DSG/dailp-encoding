//! A lambda event handler that adds a user to a group on confirmation if their email appears in a predefined list.

mod cognito_idp_operations;
mod google_sheets_operations;

use aws_config::{meta::region::RegionProviderChain, BehaviorVersion, Region};
use aws_lambda_events::cognito::{
    CognitoEventUserPoolsPostConfirmation,
    CognitoEventUserPoolsPostConfirmationResponse as CognitoPostConfirmationResponse,
};
use google_sheets_operations::SheetInterpretation;
use itertools::Itertools;
use lambda_runtime::{service_fn, Error, LambdaEvent};

/// This is the main body for the lambda function.
/// First gets the email user attribute of the user who caused this function's invocation.
/// Then, retrieves emails and roles about predetermined Editors and Contributors.
/// Finally, adds the user who caused this function's invocation to the appropriate user pool group.
/// If the user is not predetermined to be an Editor or Contributor, the final step is skipped.
///
/// # Errors:
/// This function errors under any of the following conditions:
/// 1. User attributes either did not exist or did not come with the request.
/// 2. User causing this invocation does not have an attribute named "email" or the attribute exists but has no value.
/// 3. Google Sheets API did not return any data.
/// 4. Multiple users on the permissions list use the same email.
/// 5. This program is unable to access environment variables.
/// 6. AddUserToGroup fails.
async fn function_handler(
    event: LambdaEvent<CognitoEventUserPoolsPostConfirmation>,
) -> Result<CognitoPostConfirmationResponse, Error> {
    println!("{:?}", event);

    let user_attributes = event.payload.request.user_attributes;
    if user_attributes.is_empty() {
        return Err("No email attribute found in event body.".into());
    }
    let user_email_or_none = user_attributes.get("email");
    if user_email_or_none.is_none() {
        return Err("Email attribute does not exist or is empty.".into());
    }
    let user_email = user_email_or_none.unwrap().clone();
    let user_permission_or_none = SheetInterpretation {
        sheet: dailp::SheetResult::from_sheet("1ATTekY411Jz63k6VMDn3ISFu8_f75LYFErCGY-pxVkQ", None)
            .await?,
    }
    .into_permission_list()?
    .into_iter()
    .filter(move |a| a.email == user_email)
    .at_most_one()?;
    if user_permission_or_none.is_none() {
        // We don't want to error each time a user invoking this function is not in the list.
        // Instead, we log that the user is not in the list, then exit successfully.
        println!("User does not have preset permissions.");
        return Ok(CognitoPostConfirmationResponse {});
    }
    let user_permission = user_permission_or_none.unwrap();

    let region = std::env::var("DAILP_AWS_REGION")?;
    let region_provider = RegionProviderChain::first_try(Region::new(region))
        .or_default_provider()
        .or_else(Region::new("us-east-1"));

    let config = aws_config::defaults(BehaviorVersion::latest())
        .region(region_provider)
        .load()
        .await;
    let pool_id_or_err = std::env::var("DAILP_USER_POOL");
    if pool_id_or_err.is_err() {
        return Err("Unable to access environment variable DAILP_USER_POOL.".into());
    }
    // let cognito_action = CognitoClient::new(&config, pool_id_or_err?)
    //     .await?
    //     .add_user_to_group(user_permission.email, user_permission.role)
    //     .await;

    // if cognito_action.is_err() {
    //     return Err("Failed to add user to group".into());
    // }

    Ok(CognitoPostConfirmationResponse {})
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv().ok();
    pretty_env_logger::init();

    lambda_runtime::run(service_fn(function_handler)).await
}
