export const decodeHtmlEntities = (str: string) => {
  // Logger.step('Decoding HTML entities');
  try {
    return str.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  } catch (error) {
    console.error('Failed to decode HTML entities', error);
    return str;
  }
};

export const splitText = (text: string) => {
  // Logger.step('Splitting text content');
  try {
    const decodedText = decodeHtmlEntities(text);
    return decodedText.split(/<v>/);
  } catch (error) {
    console.error('Failed to split text', error);
    return [text];
  }
};
