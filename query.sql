SELECT
  a.article_id,
  a.author,
  a.title,
  a.topic,
  a.created_at,
  a.votes,
  a.article_img_url,
  COUNT(c.article_id) as comment_count
FROM
  articles AS a
  LEFT JOIN comments AS c ON a.article_id = c.article_id
GROUP BY
  a.article_id
ORDER BY
  comment_count ASC;