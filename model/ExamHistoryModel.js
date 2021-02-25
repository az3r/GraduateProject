export default function createHistoryInstance(userId, examId, status, content) {
  const historyData = {
    userId: userId,
    examId: examId,
    status: status,
    content: content,
  };

  return historyData;
}
