// Weekly power rankings endpoint
export default function handler(req, res) {
  return res.status(200).json({
    article: 'RABKL Weekly Power Rankings - Week 3',
    result: false,
    status: 'success'
  });
}

