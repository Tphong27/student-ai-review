const quickActionPrompts = {
  "Tóm tắt chủ đề":
    "Hãy tóm tắt chủ đề đang học bằng các ý chính ngắn gọn, dễ ôn tập.",
  "Giải thích dễ hiểu":
    "Hãy giải thích chủ đề đang học thật đơn giản, phù hợp với học sinh và kèm một ví dụ dễ hiểu nếu hữu ích.",
  "Tạo 5 câu trắc nghiệm":
    "Hãy tạo đúng 5 câu hỏi trắc nghiệm ôn tập về chủ đề đang học. Mỗi câu có đúng 4 lựa chọn A, B, C, D và chưa tiết lộ đáp án trước khi học sinh trả lời.",
};

function normalizeGrade(grade) {
  return grade.replace(/^Lớp\s+/i, "");
}

function getErrorMessage(status, responseMessage) {
  const knownMessages = {
    "AI service is not configured yet.":
      "StudyMate chưa được cấu hình đầy đủ. Vui lòng thử lại sau.",
    "AI response timed out. Please try again.":
      "StudyMate phản hồi quá lâu. Vui lòng thử lại.",
    "AI service authentication failed.":
      "StudyMate đang gặp lỗi xác thực. Vui lòng thử lại sau.",
    "AI service is busy. Please try again shortly.":
      "StudyMate đang được nhiều bạn sử dụng. Vui lòng thử lại sau ít phút.",
    "AI returned an empty response. Please try again.":
      "StudyMate chưa tạo được nội dung trả lời. Vui lòng thử lại.",
    "Unable to get an AI response right now.":
      "StudyMate chưa thể tạo phản hồi lúc này. Vui lòng thử lại sau.",
    "Unable to process the request.":
      "StudyMate chưa thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.",
  };

  if (responseMessage && knownMessages[responseMessage]) {
    return knownMessages[responseMessage];
  }

  if (status === 400) {
    return "Thông tin buổi học chưa hợp lệ. Vui lòng kiểm tra lại lớp, môn và câu hỏi.";
  }

  if (status === 429) {
    return "StudyMate đang được nhiều bạn sử dụng. Vui lòng thử lại sau ít phút.";
  }

  if (status >= 500) {
    return "StudyMate chưa thể tạo phản hồi lúc này. Vui lòng thử lại sau.";
  }

  return "Không thể kết nối với StudyMate. Vui lòng kiểm tra kết nối và thử lại.";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function sendChatMessage({
  grade,
  subject,
  topic,
  message,
  signal,
}) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grade: normalizeGrade(grade),
      subject,
      topic: topic.trim(),
      message,
    }),
    signal,
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (
    !response.ok ||
    !payload?.success ||
    typeof payload.message !== "string"
  ) {
    throw new Error(getErrorMessage(response.status, payload?.message));
  }

  return payload.message;
}

export function getQuickActionPrompt(action) {
  return quickActionPrompts[action] || action;
}
