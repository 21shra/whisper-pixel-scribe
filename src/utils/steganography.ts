
// Simple LSB (Least Significant Bit) Steganography Implementation

const DELIMITER = "###END###";

export const encodeMessage = async (imageFile: File, message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) throw new Error('Failed to get image data');
        
        const data = imageData.data;
        const messageWithDelimiter = message + DELIMITER;
        const messageBinary = stringToBinary(messageWithDelimiter);
        
        // Check if image is large enough to hold the message
        const maxBits = (data.length / 4) * 3; // RGB channels only, skip alpha
        if (messageBinary.length > maxBits) {
          throw new Error('Message too long for this image');
        }
        
        // Embed message in LSBs of RGB channels
        let bitIndex = 0;
        for (let i = 0; i < data.length && bitIndex < messageBinary.length; i += 4) {
          // Red channel
          if (bitIndex < messageBinary.length) {
            data[i] = (data[i] & 0xFE) | parseInt(messageBinary[bitIndex]);
            bitIndex++;
          }
          // Green channel
          if (bitIndex < messageBinary.length) {
            data[i + 1] = (data[i + 1] & 0xFE) | parseInt(messageBinary[bitIndex]);
            bitIndex++;
          }
          // Blue channel
          if (bitIndex < messageBinary.length) {
            data[i + 2] = (data[i + 2] & 0xFE) | parseInt(messageBinary[bitIndex]);
            bitIndex++;
          }
          // Skip alpha channel (i + 3)
        }
        
        ctx?.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
};

export const decodeMessage = async (imageFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      try {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) throw new Error('Failed to get image data');
        
        const data = imageData.data;
        let binaryMessage = '';
        
        // Extract LSBs from RGB channels
        for (let i = 0; i < data.length; i += 4) {
          binaryMessage += (data[i] & 1).toString(); // Red
          binaryMessage += (data[i + 1] & 1).toString(); // Green
          binaryMessage += (data[i + 2] & 1).toString(); // Blue
          // Skip alpha channel
        }
        
        const message = binaryToString(binaryMessage);
        const delimiterIndex = message.indexOf(DELIMITER);
        
        if (delimiterIndex !== -1) {
          resolve(message.substring(0, delimiterIndex));
        } else {
          resolve(''); // No hidden message found
        }
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageFile);
  });
};

const stringToBinary = (str: string): string => {
  return str
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
};

const binaryToString = (binary: string): string => {
  let result = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    if (byte.length === 8) {
      const charCode = parseInt(byte, 2);
      if (charCode === 0) break; // Stop at null character
      result += String.fromCharCode(charCode);
    }
  }
  return result;
};
