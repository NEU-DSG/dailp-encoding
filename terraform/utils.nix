{config}:
let 
  stage = config.setup.stage ;
in {
  prefixName = base: "dailp-${stage}-${base}";
}
