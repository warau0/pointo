export function isCommand(msg) {
  const commandChar = ['!', ''];

  return commandChar.indexOf(msg.substring(0, 1)) !== -1;
}
