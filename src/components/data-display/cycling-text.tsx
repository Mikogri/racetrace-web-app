import { useEffect, useState } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits = "0123456789";

function scramble(value: string, tick: number) {
  return [...value]
    .map((character, index) => {
      if (/\d/u.test(character)) {
        const seed = Number(character);
        return digits[(seed + tick * 7 + index * 3) % digits.length];
      }
      if (!/\p{L}/u.test(character)) return character;
      const seed = character.codePointAt(0) ?? 0;
      const scrambled =
        letters[(seed + tick * 7 + index * 11) % letters.length];
      return character === character.toLocaleLowerCase()
        ? scrambled.toLocaleLowerCase()
        : scrambled;
    })
    .join("");
}

export function CyclingText({
  value,
  interval = 55,
}: {
  value: string;
  interval?: number;
}) {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const intervalId = window.setInterval(
      () => setTick((current) => current + 1),
      interval,
    );
    return () => window.clearInterval(intervalId);
  }, [interval, reducedMotion]);

  return (
    <>
      <span aria-hidden="true">
        {reducedMotion ? value : scramble(value, tick)}
      </span>
      <span className="srOnly">{value}</span>
    </>
  );
}
