# Github Search Filters

## Only see finished work.
Excludes PRs that are either failing CI or are marked as a draft.
Useful for seeing what PRs need follow-ups across the team, either for review or merge.
```text
is:pr is:open status:success draft:false
```

## Only see unfinished work.
Only shows PRs that are either failing CI or marked as a draft.
Useful for understanding which PRs require developer intervention before they can be reviewed or merged.
```text
is:pr is:open -status:success or draft:true
```
