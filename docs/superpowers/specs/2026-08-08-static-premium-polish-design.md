# Static Premium Polish Design

## Goal

Increase the site’s perceived quality through restrained, static visual refinement while preserving its current content, information architecture, colour palette, layout intent, all animations, and the footer `ADAKAN` wordmark.

## Scope

- Refine border, shadow, opacity, and spacing tokens used by navigation, section frames, cards, and the footer.
- Improve typography rhythm and heading wrapping without changing copy or typefaces.
- Improve the desktop-navigation breakpoint so common laptop widths use the full navigation treatment.
- Improve static focus, active, and hover-adjacent visual hierarchy for links, controls, and form fields.
- Refine footer alignment and grouping around the existing logo, contact chip, navigation groups, and legal row.

## Explicitly Out of Scope

- No changes to Framer Motion, CSS keyframes, reduced-motion logic, or animation timing.
- No changes to `FooterWordmark` or its `ADAKAN` text.
- No changes to page structure, copy, routes, brand colours, images, or the user-modified `public/adakan-logo.png`.

## Implementation Areas

### Global styling

Adjust the existing static design utilities in `app/globals.css`: surface depth, section-frame border contrast, typography wrapping, and desktop navigation breakpoint. Existing animation declarations remain unchanged.

### Navigation

Update only static classes in `components/navbar.tsx` and related action/link components as necessary. Preserve scroll and motion behaviour exactly as it is.

### Footer

Update static spacing, borders, alignment, and text contrast in `components/footer.tsx`. `components/footer-wordmark.tsx` is excluded.

### Content surfaces

Apply consistent static card and form treatment in the existing home-section components only where it improves hierarchy without moving content or changing interactions.

## Validation

- Run lint and production build.
- Manually inspect the home page at mobile, tablet, laptop, and desktop widths.
- Confirm no animation-related files or animation declarations change.
- Confirm `FooterWordmark` and `public/adakan-logo.png` remain untouched.
