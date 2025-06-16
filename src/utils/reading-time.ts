// Utility to calculate reading time based on word count
// Average reading speed is about 200-250 words per minute for adults
// We'll use 225 words per minute as a reasonable average

export function calculateReadingTime(wordCount: number): string {
  const wordsPerMinute = 225;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes === 1) {
    return "1 min read";
  }

  return `${minutes} min read`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
