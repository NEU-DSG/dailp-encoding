use {
    crate::async_graphql::{self, dataloader::DataLoader, Context, FieldResult},
    crate::Database,
    async_graphql::InputObject,
    serde::{Deserialize, Serialize},
    slug::slugify,
    sqlx::types::Uuid,
};

/// Menu object representing the navbar menu that can be edited.
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct Menu {
    /// Id for menu.
    pub id: Uuid,
    /// Name for the menu.
    pub name: String,
    /// Slug for the menu.
    pub slug: String,
    /// Menu items.
    pub items: Vec<MenuItem>,
}

/// Input for updating a menu.
#[derive(Debug, Clone, InputObject, Serialize, Deserialize)]
pub struct MenuUpdate {
    /// Menu id.
    pub id: Uuid,
    /// New name (optional).
    pub name: Option<String>,
    /// New menu items (optional).
    pub items: Option<Vec<MenuItemInput>>,
}

/// A single item in the menu.
#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject)]
pub struct MenuItem {
    /// Display label.
    pub label: String,
    /// Destination path.
    pub path: String,
    /// Child items (dropdown), optional.
    #[serde(alias = "children")]
    pub items: Option<Vec<MenuItem>>,
}

/// Input for a single menu item.
#[derive(Debug, Clone, InputObject, Serialize, Deserialize)]
pub struct MenuItemInput {
    /// Display label.
    pub label: String,
    /// Destination path.
    pub path: String,
    /// Child items (dropdown), optional.
    #[serde(alias = "children")]
    pub items: Option<Vec<MenuItemInput>>,
}

impl From<MenuItemInput> for MenuItem {
    fn from(value: MenuItemInput) -> Self {
        MenuItem {
            label: value.label,
            path: value.path,
            items: value.items.map(|v| v.into_iter().map(Into::into).collect()),
        }
    }
}

impl Menu {
    /// Fetch a menu by slug.
    pub async fn menu_by_slug(&self, context: &Context<'_>, slug: String) -> FieldResult<Menu> {
        let db = context.data::<DataLoader<Database>>()?.loader();
        let menu = db.get_menu_by_slug(slugify(&slug)).await?;
        Ok(menu)
    }
}
