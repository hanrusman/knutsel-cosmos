const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('new_questions.json', 'utf8'));

// Asset Mappings
const ASSETS = {
    planet: '/assets/generic-planet.png',
    robot: '/assets/sparky-jar.png',
    star: '/assets/items/magic-wand.png', // It has a star
    rocket: '/assets/items/rocket-boots.png',
    sound: '/assets/items/headphones.png',
    light: '/assets/items/disco-ball.png', // Shiny
    art: '/assets/items/paint-bucket.png',
    tool: '/assets/items/gold-antenna.png', // Looks techy
    balloon: '/assets/items/red-balloon.png' // Float/Air
};

// Keywords to map
const KEYWORDS = {
    'planeet': ASSETS.planet,
    'mars': ASSETS.planet,
    'jupiter': ASSETS.planet,
    'saturnus': ASSETS.planet,
    'venus': ASSETS.planet,
    'uranus': ASSETS.planet,
    'neptunus': ASSETS.planet,
    'mercurius': ASSETS.planet,
    'aarde': ASSETS.planet,
    'maan': ASSETS.planet, // Close enough for a sticker
    'zon': ASSETS.star, // Star
    'ster': ASSETS.star,
    'nevel': ASSETS.star, // Spacey
    'melkweg': ASSETS.star,
    'robot': ASSETS.robot,
    'machine': ASSETS.robot,
    'rover': ASSETS.robot,
    'android': ASSETS.robot,
    'raket': ASSETS.rocket,
    'lancering': ASSETS.rocket,
    'space shuttle': ASSETS.rocket,
    'motor': ASSETS.rocket, // Power/Movement
    'beweging': ASSETS.rocket,
    'sensor': ASSETS.tool,
    'camera': ASSETS.tool,
    'microcontroller': ASSETS.tool,
    'chip': ASSETS.tool,
    'geluid': ASSETS.sound,
    'licht': ASSETS.light,
    'lamp': ASSETS.light,
    'laser': ASSETS.light,
    'verf': ASSETS.art,
    'kleur': ASSETS.art
};

const processed = questions.map(q => {
    const answers = q.answers.map(a => {
        let image = '';
        const lowerLabel = a.label.toLowerCase();

        // Exact keyword match search
        for (const [key, path] of Object.entries(KEYWORDS)) {
            if (lowerLabel.includes(key)) {
                image = path;
                break; // Take first match
            }
        }

        return { ...a, image };
    });
    return { ...q, answers };
});

fs.writeFileSync('new_questions_mapped.json', JSON.stringify(processed, null, 2));
console.log('Mapped images to answers.');
