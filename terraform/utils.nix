# For now, this module is a higher order function generating a function that creates a template string from a given string
{stage, hideProd ? true}: 
let 
  hide = hideProd && stage == "prod";
in base: "dailp${if hide then "" else "-${stage}"}-${base}"
