# CHANGELOG

## [v3.0] - 2026-01-16 "Production Ready & Premium UX"
### Added
- **Favicon**: Complete favicon suite for all devices (16x16, 32x32, 180x180, ICO format)
- **PWA Manifest**: Progressive Web App support with custom branding and theme colors
- **Loading Animations**: 
  - Homepage video background with elegant pink gradient pulse loader
  - Smooth fade-in transitions for video, shadow, and vignette overlay (no black frame!)
  - All cat mascot images fade in gracefully across all sections (Learn, Math, Game, Art)
- **Custom Domain**: Deployed to https://aibreaktime.com with www redirect support

### Changed
- **Branding**: Updated page title to "AI Break Time - While You Wait"
- **Visual Polish**: Video and overlay now fade in together, eliminating the initial black frame issue

## [v2.1] - 2026-01-16 "Optimization & Polish"
### Changed
- **Math Section**: Implemented automatic filtering to skip problems with Asymptote diagrams, ensuring instant loading for all questions (no more timeouts).
- **Learn Section**: Added randomized example keywords (30 topics total) that shuffle on each page refresh, providing fresh inspiration every visit.
- **Global CTA**: Refined visibility—now hidden on the homepage for a cleaner landing experience, visible on all other sections.
- **Performance**: Optimized all assets for production—compressed cat images from PNG to JPG (85% quality) and background video to 720p, reducing total asset size from 49MB to 6.4MB (87% reduction).

### Removed
- **Math Section**: Removed all Asymptote diagram rendering infrastructure (AsyRenderer, Vite proxy, timeout handling) for a simpler, faster experience.

## [v1.3] - 2026-01-16 "Home Redesign Milestone"
### Added / Changed
- **Home**: **Interactive Tiles**: Completely redesigned action buttons as "Interactive Tiles" with integrated cat mascots.
- **Home**: **Visual Polish**: 
    - Implemented high-end glassmorphism with backdrop blur for action cards.
    - Added color-coded gradients (Orange, Teal, Blue, Purple) for better mode distinguishability.
    - Set up coordinated hover animations (mascot peeking + tile glowing).
- **Home**: **Layout Cleanup**: Removed redundant top avatar and footer icons to achieve a clean, centered "Hero" focus.
- **UI**: **Color Calibration**: Restored the original premium pink outer background and set subpage cards to pure white for maximum clarity.
- **Layout**: **Stability**: Fixed layout shifts caused by dynamic reward text and resolved button overlaps.

### TODO / Pending
- [ ] **Home**: Further optimize the homepage design for even more premium aesthetics (micro-animations, spacing refinement).
- [ ] **Math**: **Geometry Fix**: Resolve the issue where Asymptote diagrams fail to render or display correctly in the Math section.

## [V6.0 Interactive Tile Redesign] - 2026-01-16
- *(Superseded by v1.3 milestone above)*

## [V5.22 Layout Stability Fix] - 2026-01-16
- Fixed "jumping" layout when reward text appeared.
- Increased bottom buffer to 150px.
