export 
const getRandomDarkPastelColor = () => {
    // Define ranges for dark pastel colors (adjust as needed)
    const min = 20; // Minimum value for RGB channel
    const max = 50; // Maximum value for RGB channel

    // Generate random values for each RGB channel
    const r = Math.floor(Math.random() * (max - min + 1) + min) + 100;
    const g = Math.floor(Math.random() * (max - min + 1) + min) + 75;
    const b = Math.floor(Math.random() * (max - min + 1) + min) + 25;

    // Construct the color string in hex format
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

    return color;
};