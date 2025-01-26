
export function copyTextToClipboard(text: string | null) {
  if(!text)return
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }
  
    navigator.clipboard.writeText(text).then(() => {
    }).catch((error) => {
      console.error('Error copying text to clipboard:', error);
    });
  }


  export const shouldHide = (pathname: string, pathsToHide: string[]) => pathsToHide.some(pathToHide => pathname.includes(pathToHide))

  export function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

  export function convertToNumber(value: string | number, defaultValue: number): number {
    if (typeof value === 'number') {
      return value;
    }
  
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      return defaultValue;
    }
  
    return parsedValue;
  }
  
  export function camelCaseToWords(input: string): string {
    const result = input
      .replace(/([a-z])([A-Z])/g, '$1 $2')  
      .replace(/\b\w/g, (char) => char.toUpperCase());
    
    return result;
  }