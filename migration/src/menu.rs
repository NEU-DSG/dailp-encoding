use dailp::Uuid;
use dailp::{Database, Menu};

// todo: remove trailing slashes from paths
pub async fn migrate_menu(db: &Database) -> anyhow::Result<()> {
    let menu = Menu {
    id: Uuid::new_v4(),
    name: "Default Nav".to_string(),
    slug: "default-nav".to_string(),
    items: serde_json::from_str(
"[
  {\"label\":\"Glossary of Terms\",\"path\":\"/glossary\"},
  {\"label\":\"Word Search\",\"path\":\"/search\"},
  {\"label\":\"Home\",                \"path\":\"/\",\"children\":[]},
  {\"label\":\"Tools\",               \"path\":\"/tools\",\"children\":[
  {\"label\":\"Further Learning\",    \"path\":\"/tools/further-learning\"}
  ]},
  {\"label\":\"About\",               \"path\":\"/\",\"children\":[
  {\"label\":\"Support\",             \"path\":\"/about/support\"},
  {\"label\":\"Goals\",               \"path\":\"/about/goals\"},
  {\"label\":\"Team\",                \"path\":\"/about/team\"},
  {\"label\":\"Former Contributors\", \"path\":\"/about/former-contributors\"},
  {\"label\":\"Project History\",     \"path\":\"/about/project-history\"},
  {\"label\":\"Why DAILP? Why Now?\", \"path\":\"/about/why-this-archive-why-now\"},
  {\"label\":\"References\",          \"path\":\"/about/sources\"}
  ]},
  {\"label\":\"Stories\",                                           \"path\":\"/\",\"children\":[
  {\"label\":\"Dollie Duncan Letter Inspires Opera\",               \"path\":\"/story/dollie-duncan-letter-inspires-opera\"},
  {\"label\":\"About the Editors of CWKW\",                         \"path\":\"/story/editors-of-cwkw\"},
  {\"label\":\"The Importance of Language Persistence\",            \"path\":\"/story/the-importance-of-language-persistence\"},
  {\"label\":\"UKB Advisory Board Members & Translators Discover Family Voices in DAILP’s Work\",\"path\":\"/story/ukb-advisory-board-members-translators-discover-family-voices-in-dailps-work\"},
  {\"label\":\"DAILP honored with grant from the Henry R. Luce Foundation\",\"path\":\"/story/dailp-honored-with-grant-from-the-henry-r-luce-foundation\"}
  ]},
  {\"label\":\"Spotlights\",                              \"path\":\"/\",\"children\":[
  {\"label\":\"DAILP Spotlight: Melissa Torres\",         \"path\":\"/spotlight/melissa-torres\"},
  {\"label\":\"DAILP Spotlight: Hazelyn Aroian\",         \"path\":\"/spotlight/hazelyn-aroian\"},
  {\"label\":\"DAILP Spotlight: Meg Cassidy\",            \"path\":\"/spotlight/meg-cassidy\"},
  {\"label\":\"DAILP Spotlight: Milan Evans\",            \"path\":\"/spotlight/milan-evans\"},
  {\"label\":\"Persisting in Cherokee with Mary Rae\",    \"path\":\"/spotlight/persisting-in-cherokee-with-mary-rae\"}

  ]}
]").unwrap()};
    db.insert_menu(menu).await?;
    Ok(())
}
