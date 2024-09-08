export const getRandomDarkPastelColor = (min = 20, max = 50) => {
    // Generate random values for each RGB channel
    const r = Math.floor(Math.random() * (max - min + 1) + min) + 100;
    const g = Math.floor(Math.random() * (max - min + 1) + min) + 75;
    const b = Math.floor(Math.random() * (max - min + 1) + min) + 25;

    // Construct the color string in hex format
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

    return color;
};

export const fetchData = (uri: string, total: number, page: number, type: string) => {
    const apiendpoint = `${process.env.ARCHIVES_INTERNAL_API}/search?uri=${uri}&total=${total}&page=${page}&type=${encodeURIComponent(type)}`;
  
    return fetch(apiendpoint, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((responseBody) => {
            throw new Error(`HTTP error! status: ${response.status}\n${responseBody}`);
          });
        }
        console.log("done");
        return response.json();
      });
  }
  