SELECT
  a.article_id,
  a.title,
  a.topic,
  a.author,
  a.body,
  a.created_at,
  a.votes,
  a.article_img_url,
  COUNT(c.article_id)::INT AS comment_count
FROM
  articles AS a
  LEFT JOIN comments AS c ON a.article_id = c.article_id
WHERE
  a.article_id = 1
GROUP BY
  a.article_id;