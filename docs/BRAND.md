# ArcScore brand

## The idea
An athlete's value is a ball in flight. **Score** is where it is now. **Arc** is where it's going.
The whole identity comes from that one image: a single arc and a single ball.

## Principles
1. **Paper and ink do the work.** Most surfaces are calm and neutral, so color means something when it appears.
2. **Cobalt is the path, orange is the ball.** Cobalt carries trajectory and data: chart lines, meters, focus and selection. Signal orange is the athlete right now: the ball in the mark, the dot on the score gauge, "now" on a chart, and projections ahead of it.
3. **Night is the stage.** Hero moments (the home page, sign-in, the closing scene) run as a floodlit night game in 3D, where the ball flies the arc and lands in the scoring ring.
4. **Tints, not paint.** Peach, sky, mint, lilac and sand give people, categories and audiences warmth without turning the UI loud.
5. **The product is the hero.** Marketing shows the real interface.
6. **Explain, don't decorate.** Each number can be traced to the signals behind it.

## Mark
A half arc in ink (white on night) with the ball at its landing point in Signal orange. The wordmark "arcscore" is set lowercase in Geist Semibold with tight tracking. The score gauge in the product is the same mark drawn to scale, its arc running cobalt into orange.

## Color
| Token | Hex | Use |
|---|---|---|
| Paper | `#F6F5F1` | Page background |
| Surface | `#FFFFFF` | Cards, sheets |
| Ink | `#111110` | Text, primary buttons |
| Night | `#070B18` | 3D stage, hero sections |
| **Cobalt** | `#3B5BFF` | The path: data, trajectory, focus |
| **Signal** | `#FF5A1F` | The ball: now, the athlete, projections |
| Arc gradient | `#7D92FF → #FF8A5C → #FF5A1F` | Display words on night only |
| Tints | Peach `#FFEADF`, Sky `#E6EBFF`, Mint `#E2F3EA`, Lilac `#EFEAFF`, Sand `#F5EEDD` | Avatars, categories, audience chips (each with a matching deep text tone) |
| Good / Warn / Bad | `#1F7A4D` / `#A86A00` / `#C03A2B` | Status only, always with an icon and a label |

## Motion and 3D
The home hero is a scroll-driven 3D scene (React Three Fiber): a clearcoat orange ball, a luminous trajectory that draws as the ball flies, a reflective floodlit field and a scoring ring that lights on landing. The story runs in three beats: Worth, Score, Arc. Reflections come from procedural light panels, with no downloaded HDRs. Scenes pause off-screen and respect reduced-motion settings.

## Type
Geist for everything, Geist Mono for chart axes. Display sizes use −0.045em tracking and a 0.95 line height. Numbers are tabular.

## Data
History is a cobalt line with a cobalt wash, "now" is the orange ball, and the projection is a dashed orange line over a peach band. Bars and meters are cobalt. Status colors never stand in for series colors.
