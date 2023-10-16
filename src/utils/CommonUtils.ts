export const checkSize = (
  currentSize: number,
  maxSize: number,
  message?: string
): boolean => {
  if (currentSize >= maxSize) {
    if (message) {
      alert(message);
    }
    return false;
  }
  return true;
};
