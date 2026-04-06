# Asana MUJI — Env Vars Reference

## Full Variable List

```bash
# Who I am
ASANA_USER_GID=                        # Your Asana user GID (find via get_me)

# Projects (MUJI-specific)
ASANA_IOS_LIBRARIES_GID=               # iOS Libraries project
ASANA_MUJI_TASKS_GID=                  # MUJI Tasks kanban project
ASANA_MUJI_PLAN_GID=                   # MUJI Plan project

# Section GIDs — MUJI Tasks (3-step kanban)
ASANA_SECTION_TODO_GID=                # TO DO
ASANA_SECTION_INPROGRESS_GID=          # IN PROGRESS
ASANA_SECTION_DONE_GID=                # DONE

# Section GIDs — MUJI Plan (5-step workflow)
ASANA_SECTION_NEW_REQUESTS_GID=        # New Requests
ASANA_SECTION_IN_PROGRESS_GID=         # In progress
ASANA_SECTION_INTEGRATION_GID=         # Integration
ASANA_SECTION_TEST_GID=                # Test
ASANA_SECTION_PLAN_DONE_GID=           # Done

# Section GIDs — iOS Libraries (module-based)
ASANA_SECTION_IOS_THEME_SHOWCASE_GID=  # ios_theme_showcase
ASANA_SECTION_IOS_THEME_UI_GID=        # ios_theme_ui
ASANA_SECTION_EPOST_BOTTOM_MENU_GID=   # ePost <> Bottom Menu Bar
```

## How to Find GIDs

**User GID**: Ask Claude to call Asana `get_me` — the `gid` field is your user GID.

**Project GID**: Open the project in Asana → the URL contains the GID:
`https://app.asana.com/0/{PROJECT_GID}/list`

**Section GID**: Use Asana API or ask Claude to call `get_project` with your project GID — sections are listed in the response.

## Example .env.connectors

Create `.env.connectors` in your project root (add to `.gitignore`):

```bash
# Asana MUJI
ASANA_USER_GID=1207699335267611
ASANA_IOS_LIBRARIES_GID=1207773169815446
ASANA_MUJI_TASKS_GID=1176686389740521
ASANA_MUJI_PLAN_GID=1184227957274218
ASANA_SECTION_TODO_GID=1176686389740524
ASANA_SECTION_INPROGRESS_GID=1176695177250162
ASANA_SECTION_DONE_GID=1177202920874126
ASANA_SECTION_NEW_REQUESTS_GID=1184227957274234
ASANA_SECTION_IN_PROGRESS_GID=1199525853631481
ASANA_SECTION_INTEGRATION_GID=1199525853631509
ASANA_SECTION_TEST_GID=1199525853631505
ASANA_SECTION_PLAN_DONE_GID=1199525853631508
ASANA_SECTION_IOS_THEME_SHOWCASE_GID=1207773169815450
ASANA_SECTION_IOS_THEME_UI_GID=1207773169815451
ASANA_SECTION_EPOST_BOTTOM_MENU_GID=1209604293257010
```

Note: The GIDs above are examples from the original MUJI iOS/Android skills. Replace with your own if they differ.
