# Homework 67–76 submission index

Reviewed November 16, 2026 against the teacher's assignment emails.
Each folder contains setup instructions in HOMEWORK.md.

| Homework | Submission folder | Topic |
|---|---|---|
| 67 | [js/67](js/67) | AJAX recipe list and details |
| 68 | [js/68](js/68) | Maps, GeoNames search, markers and sidebar |
| 69 | [js/69](js/69) | Accumulating, restoring and clearing saved places |
| 70 | [js/70](js/70) | Potato game: dragging, layering, storage and music |
| 71 | [js/71](js/71) | Constructors, prototypes and overriding methods |
| 72 | [js/72](js/72) | Multiple bouncing balls, color, radius and gravity |
| 73 | [js/73](js/73) | Snake movement, apples, score, growth and collisions |
| 74 | [js/74](js/74) | Vite packaging of the potato game |
| 75 | [js/75](js/75) | React JSX, components and address props |
| 76 | [js/76](js/76) | React effects, state and weather fetching |

## Submission status

Homework 67 was already published. Homework 68–76 has been published in separate commits.

## Checks performed

- JavaScript syntax scan passed.
- Homework 74, 75 and 76 Vite production builds passed with the installed dependencies. React 75 and 76 ESLint checks passed.
- Mocked runtime tests passed for potato custom dragging, rotation, named saves, draft restoration and music controls; vehicle inheritance and logs; ball boundaries; snake grid placement, eating, scoring, growth, acceleration, direction reversal and wall/self collisions; maps initialization, repeated searches, persistence and clearing.
- No credential patterns found in the new submission files. Local environment files and build output are ignored. Classroom files containing example credentials were not included.
- Re-run the logic tests with `node verification/homework-tests.cjs`.

## Remaining verification (do not mark as passed)

- Actual browser interaction and visual verification: this session could not launch a test browser or local HTTP server.
- Homework 68/69 live Google Maps and GeoNames calls: supply your own valid credentials at runtime.
- Homework 76 live OpenWeather request: configure your own local .env. VITE_ values become visible to browser users; do not publish credential-bearing builds.
- Homework 70/74 child playtesting: the teacher requests kid approval, which has not been performed.
- Fresh npm dependency installation was not tested; builds used the installed class-project dependency versions. Native config loading was used because the original node_modules directory was read-only in this session.

The runtime tests use mocked DOM and APIs. They do not establish actual rendering, browser audio playback or live API availability.
