---
title: Mirrored Leitbild Source Docs
type: source-map
---

# Mirrored Leitbild Source Docs

Some pages in this wiki are mirrored from the Leitbild application repository so the wiki can act as a comprehensive reference without becoming a second hand-maintained source of architecture truth.

The sync script is:

```text
bun scripts/sync-leitbild-sources.ts
```

By default it reads from:

```text
/Users/Michael.Hildebrandt@ife.no/Documents/Code/leitbild
```

Set `LEITBILD_REPO=/path/to/leitbild` to use another checkout.

## Mirrored ADRs

Architecture decision records are mirrored under `leitbild-source/adrs/`. These pages should not be edited in the wiki. Update the ADR in the Leitbild repo and rerun the sync script.

## Mirrored Source Docs

Selected source docs are mirrored under `leitbild-source/docs/`. The current set focuses on process-plant, pack architecture, object/scenario modeling, and map capability because those are directly relevant to this wiki.

## Why Mirror Instead Of Copy

Manual copying creates drift. Mirroring keeps the wiki useful to AI agents while preserving a single source of truth for decisions that belong near the code. The wiki should explain and contextualize; the application repo should define executable architecture.

