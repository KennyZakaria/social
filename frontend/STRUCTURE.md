# Frontend Structure

This frontend follows a feature-first structure.

## Rules

- Put each business area under `src/app/features/<feature-name>/`.
- Do not create a `pages/` directory.
- Each screen gets its own folder directly inside the feature.
- Each screen folder contains its own component files:
  - `*.component.ts`
  - `*.component.html`
  - `*.component.scss` or `*.component.css`
- Keep shared feature services inside `src/app/features/<feature-name>/services/`.
- Keep the feature route file at the feature root as `<feature-name>.routes.ts`.
- Keep cross-feature infrastructure inside `src/app/core/`.

## Shape

```text
src/app/
  app.component.*
  app.config.ts
  app.routes.ts

  core/
    auth/
      auth-state.service.ts
      auth.interceptor.ts
      guards.ts
    config/
      module-map.ts
    models/
      models.ts

  layout/
    footer/
    navbar/
    sidebar/

  features/
    auth/
      auth.routes.ts
      services/
      login/
      signup/

    home/
      home/

    dashboard/
      dashboard.routes.ts
      services/
      dashboard/

    bureau-order/
      bureau-order.routes.ts
      services/
      bureau-order/

    adherents/
      adherents.routes.ts
      services/
      adherent-list/

    users/
      users.routes.ts
      services/
      user-list/
      user-create/
      user-management/

    deces/
      deces.routes.ts
      services/
      dashboard/
      dossiers-list/
      dossier-detail/
      nouveau-dossier/
      adherents/
      ayants-droit/
      demandes/
      fiche-renseignements-deces/
      fiche-renseignements-retraite/
      validation/

    mutuelle/
      mutuelle.routes.ts
      services/
      adherents/
      dossier-form/
      history/

    assurance-sociale/
      assurance-sociale.routes.ts
      services/
      adherents/
      record-form/
      history/

    retraites/
      retraites.routes.ts
      services/
      dashboard/
      list/
      record/
      global-history/
      validation/

    assistance-sociale/
      assistance-sociale.routes.ts

    culture-loisirs/
      culture-loisirs.routes.ts

    module-cases/
      module-cases.routes.ts
      services/
      module-page/
      module-placeholder/
```

## Naming

- Feature folder: domain name such as `mutuelle`, `deces`, `users`.
- Screen folder: route or use-case name such as `dossier-form`, `user-list`, `dashboard`.
- Component file: keep Angular component naming, for example `mutuelle-dossier-form-page.component.ts`.

## When Adding A New Feature

Create:

```text
src/app/features/<feature-name>/
  <feature-name>.routes.ts
  services/
  <screen-name>/
    <screen-name>.component.ts
    <screen-name>.component.html
    <screen-name>.component.scss
```

If the feature only has one screen, still keep that screen in its own folder.