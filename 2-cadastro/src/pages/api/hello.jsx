export default function handler(req, res) {
  res.status(200).json({ 
    name: 'Douglas A B Novato',
    method: req.method,
  })
}
