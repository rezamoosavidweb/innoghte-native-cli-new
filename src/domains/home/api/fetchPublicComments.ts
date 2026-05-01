import {
  commentSchema,
  publicCommentsResponseSchema,
} from '@/domains/home/model/comments.schema';
import { getApiClient, parseJsonResponse } from '@/shared/infra/http';
import { endpoints } from '@/shared/infra/http/endpoints';
import type { CommentItem } from '@/domains/home/ui/CommentCarousel';
import type { z } from 'zod';

type CommentDto = z.infer<typeof commentSchema>;

function formatCommentDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function mapCommentToCommentItem(d: CommentDto): CommentItem | null {
  const content = d.comment.trim();
  if (!content) {
    return null;
  }
  return {
    user: d.user.full_name.trim() ? d.user.full_name : null,
    content,
    courseTitle: null,
    createdAt: formatCommentDate(d.created_at),
  };
}

/** Same contract as client-web `getPublicComments(page, per_page)`. */
export async function fetchPublicComments(
  page = 1,
  perPage = 20,
): Promise<readonly CommentItem[]> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  const path = `${endpoints.public.comments}?${params.toString()}`;

  const res = await parseJsonResponse(
    getApiClient().get(path),
    publicCommentsResponseSchema,
  );

  return res.data
    .map(mapCommentToCommentItem)
    .filter((item): item is CommentItem => item !== null);
}
