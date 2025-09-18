// Newsroom loop endpoint
export default function handler(req, res) {
  return res.status(200).json({
    generated_articles: 0,
    published_articles: 0,
    status: 'success',
    message: 'No new articles to publish or publisher not available.'
  });
}

