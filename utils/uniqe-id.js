export default function getUniqueId() {
  return (Math.random() * Date.now()).toString();
}
