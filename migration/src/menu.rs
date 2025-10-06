use dailp::Uuid;
use dailp::{Menu, Database};

// todo: remove trailing slashes from paths
pub async fn migrate_menu(db: &Database) -> anyhow::Result<()> {
  let menu = Menu {
    id: Uuid::new_v4(),
    name: "Default Nav".to_string(),
    slug: "default-nav".to_string(),
    items: serde_json::from_str(
"[
  {\"label\":\"Home\",\"path\":\"/\",\"children\":[]},
  {\"label\":\"Tools\",\"path\":\"/tools\",\"children\":[
  {\"label\":\"Glossary of Terms\",\"path\":\"/glossary\"},
  {\"label\":\"Word Search\",\"path\":\"/search\"},
  {\"label\":\"Further Learning\",\"path\":\"/credit\"}
  ]},
  {\"label\":\"About\",\"path\":\"/\",\"children\":[
  {\"label\":\"Support\",\"path\":\"/support\"},
  {\"label\":\"Goals\",\"path\":\"/home/goals\"},
  {\"label\":\"Team\",\"path\":\"/home/credits\"},
  {\"label\":\"Former Contributors\",\"path\":\"/former-contributors\"},
  {\"label\":\"Project History\",\"path\":\"/home/project-history\"},
  {\"label\":\"Why DAILP? Why Now?\",\"path\":\"/home/why-this-archive-why-now\"},
  {\"label\":\"References\",\"path\":\"/sources\"}
  ]},
  {\"label\":\"Stories\",\"path\":\"/stories\",\"children\":[
  {\"label\":\"Dollie Duncan Letter Inspires Opera\",\"path\":\"/dollie-duncan-letter-inspires-opera\"},
  {\"label\":\"About the Editors of CWKW\",\"path\":\"/editors\"},
  {\"label\":\"The Importance of Language Persistence\",\"path\":\"/dailp-language-preservation-narrative\"},
  {\"label\":\"UKB Advisory Board Members & Translators Discover Family Voices in DAILP’s Work\",\"path\":\"/ukb-advisory-board-members-translators-discover-family-voices-in-dailps-work\"},
  {\"label\":\"DAILP honored with grant from the Henry R. Luce Foundation\",\"path\":\"/stories/the-luce-foundation/dailp-honored-with-grant-from-the-henry-r-luce-foundation\"}
  ]},
  {\"label\":\"Spotlights\",\"path\":\"/category/uncategorized\",\"children\":[
  {\"label\":\"DAILP Spotlight: Melissa Torres\",\"path\":\"/stories/melissa-torres\"},
  {\"label\":\"DAILP Spotlight: Hazelyn Aroian\",\"path\":\"/dailp-spotlight-hazelyn-aroian\"},
  {\"label\":\"DAILP Spotlight: Meg Cassidy\",\"path\":\"/dailp-spotlight-meg-cassidy\"},
  {\"label\":\"DAILP Spotlight: Milan Evans\",\"path\":\"/dailp-spotlight-milan-evans\"},
  {\"label\":\"Persisting in Cherokee with Mary Rae\",\"path\":\"/persisting-in-cherokee-with-mary-%ea%ae%8a%ea%ae%85-rae\"}
  ]}
]").unwrap()};

  db.insert_menu(menu).await?;
  Ok(())
}
