({stage, hideProd ? true}: let hide = hideProd && stage == "prod"; in base: "dailp${if hide then "" else "-${stage}"}-${base}")
