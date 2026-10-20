const moduleMessage = 'See muutuja kuulub ainult moodulile';

console.log('module: skript käivitus');
console.log('Mooduli muutuja:', moduleMessage);
console.log('Kas muutuja on globaalne?', 'moduleMessage' in window);