# CHANGELOG

## [v2.1] - 2026-01-16 "Optimization & Polish"
### Changed
- **Math Section**: Implemented automatic filtering to skip problems with Asymptote diagrams, ensuring instant loading for all questions (no more timeouts).
- **Learn Section**: Added randomized example keywords (30 topics total) that shuffle on each page refresh, providing fresh inspiration every visit.
- **Global CTA**: Refined visibility—now hidden on the homepage for a cleaner landing experience, visible on all other sections.

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
