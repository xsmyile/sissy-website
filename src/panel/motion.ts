/**
 * Sissy's eye movements, as the site replays them.
 *
 * Mirrors `SissyMenuBarMotion` in the app repository
 * (`app/Sissy/Menu/SissyMenuBarMotion.swift`): the frame counts and each
 * gesture's own duration, carried as milliseconds because that is what a web
 * animation is given.
 *
 * **The blink and the halves run on different clocks, as they do in the app.**
 * `eyeClose` and `eyeOpen` are measured off the frames they actually carry, at
 * 60 fps. The blink is the whole sequence in `blinkDuration`, which falls a
 * frame short of 24 at 60 fps on purpose, so playing it is faster than playing
 * its halves and the two sets of numbers do not reconcile.
 *
 * The frames themselves are not mirrored. The catalogue's sequence is traced
 * at the menu bar's 22 px and does not hold at the sizes the page draws Sissy
 * in, so the page redraws the lid and plays it on the app's clock, the way
 * `Glyph.tsx` redraws the symbols the panel needs. When the app retimes the
 * blink, diff this file against the Swift one first.
 */

const FRAMES_PER_SECOND = 60;
const FRAME_COUNT = 24;
const SHUT_EYE_FIRST = 6;
const SHUT_EYE_LAST = 9;

/** Frames 0 through the first shut one, which is what `eyeClose` carries. */
const CLOSING_FRAMES = SHUT_EYE_FIRST + 1;
/** The rest of the hold, drawn once and held, after the closing half's last frame. */
const SHUT_FRAMES = SHUT_EYE_LAST - SHUT_EYE_FIRST;
/** The last shut frame through the last, which is what `eyeOpen` carries. */
const OPENING_FRAMES = FRAME_COUNT - SHUT_EYE_LAST;

const frameMs = (frames: number): number => Math.round((frames / FRAMES_PER_SECOND) * 1000);
const blinkFrameMs = (frames: number): number => Math.round((frames / FRAME_COUNT) * BLINK_MS);

/** `SissyMenuBarMotion.blinkDuration`: shut and open again, the whole gesture. */
export const BLINK_MS = 380;

/** `SissyMenuBarMotion.eyeClose`: the closing half alone, left resting on the shut eye. */
export const EYE_CLOSE_MS = frameMs(CLOSING_FRAMES);

/** `SissyMenuBarMotion.eyeOpen`: the opening half alone, back to the resting silhouette. */
export const EYE_OPEN_MS = frameMs(OPENING_FRAMES);

/** The same three parts inside a blink, which runs all 24 frames in `BLINK_MS`. */
export const BLINK_CLOSE_MS = blinkFrameMs(CLOSING_FRAMES);
export const BLINK_SHUT_MS = blinkFrameMs(SHUT_FRAMES);
export const BLINK_OPEN_MS = BLINK_MS - BLINK_CLOSE_MS - BLINK_SHUT_MS;

/** `SissyMenuBarMotion.dataBlinkCooldown`: the shortest spacing between two blinks. */
export const BLINK_COOLDOWN_MS = 3000;
