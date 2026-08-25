import riderBlue from "../assets/riders/rider-blue.png";
import riderGreen from "../assets/riders/rider-green.png";
import riderRedWhite from "../assets/riders/rider-red-white.png";
import riderRed from "../assets/riders/rider-red.png";
import riderWhite from "../assets/riders/rider-white.png";
import riderYellowBlack from "../assets/riders/rider-yellow-black.png";

const riderImages = [
  riderBlue,
  riderGreen,
  riderRedWhite,
  riderRed,
  riderWhite,
  riderYellowBlack,
];

export function riderImageFromId(id: string, fullName?: string | null) {
  const normalizedName = fullName
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase();
  if (normalizedName === "loic bruni") return riderRed;

  const hash = [...id].reduce(
    (value, character) =>
      (Math.imul(value, 31) + (character.codePointAt(0) ?? 0)) >>> 0,
    0,
  );
  return riderImages[hash % riderImages.length];
}
