const baseURLs = {
  dev: 'https://moon.crocodic.net/latihan-api/public',
};

export const selectedBaseURL: keyof typeof baseURLs = 'dev'; // Change the selected base url string here

export default baseURLs[selectedBaseURL];
