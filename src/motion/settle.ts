/**
 * Puts back whatever an animation wrote inline, once it has finished writing.
 *
 * Motion commits an animation's last frame after its promise resolves, so the
 * clearing waits a frame: run it any sooner and the commit writes the inline
 * styles straight back. A `translateY(0px)` left behind is not nothing — it is
 * a containing block and a stacking context the stylesheet never asked for.
 */
export function clearInline(elements: HTMLElement[]): void {
  requestAnimationFrame(() => {
    for (const element of elements) {
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
    }
  });
}
