import { SocialShareButtons } from "@/components/SocialShareButtons";
import { calculateReadingTime, formatDate } from "@/utils/reading-time";
import { Calendar, Clock } from "lucide-react";

interface ArticleMetaProps {
  publishDate: string;
  wordCount: number;
  title: string;
  url: string;
  className?: string;
}

export const ArticleMeta = ({
  publishDate,
  wordCount,
  title,
  url,
  className = "",
}: ArticleMetaProps) => {
  const readingTime = calculateReadingTime(wordCount);
  const formattedDate = formatDate(publishDate);

  return (
    <div
      className={`flex flex-col md:flex-row md:justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <time dateTime={publishDate} className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </time>

        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {readingTime}
        </span>
      </div>

      <SocialShareButtons title={title} url={url} />
    </div>
  );
};
