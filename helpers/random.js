export default function random({ min, max }) {
  return min + Math.round((Math.random() * (max - min)));
}
