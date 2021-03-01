export default function handler(req, res) {
  res.status(404).json({
    error: 'Unknown api endpoint',
  });
}
