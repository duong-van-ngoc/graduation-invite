// Student information
export const STUDENT = {
  name: "Dương Văn Ngọc ",
  major: "Công nghệ Thông tin",
  course: "K15",
  university: "Đại học Phenikaa",
  universityShort: "PKA",
  avatar: "/images/avatar.png",
  logo: "/images/logo.png",
} as const;

// Event information
export const EVENT = {
  title: "Lễ Tốt Nghiệp",
  date: new Date("2026-08-15T08:00:00+07:00"),
  venue: "Hội trường Nhà Văn hóa Thanh Niên",
  address: "4 Phạm Ngọc Thạch, Bến Nghé, Quận 1, TP.HCM",
  time: "08:00 - 11:30",
  dressCode: "Trang phục lịch sự",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580567037!2d106.69449231526!3d10.77539059233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9ba1d5a7%3A0x5c9d0854f7d9b5ac!2zTmjDoCBWxINuIGjDs2EgVGhhbmggTmnDqm4!5e0!3m2!1svi!2svn!4v1700000000000",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=4+Ph%E1%BA%A1m+Ng%E1%BB%8Dc+Th%E1%BA%A1ch,+B%E1%BA%BFn+Ngh%C3%A9,+Qu%E1%BA%ADn+1,+TP.HCM",
  calendarUrl: "",
} as const;

// Timeline milestones
export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export const TIMELINE: TimelineMilestone[] = [
  {
    year: "2022",
    title: "Năm Nhất",
    description:
      "Bước chân đầu tiên vào giảng đường đại học. Những ngày háo hức, bỡ ngỡ nhưng tràn đầy năng lượng và ước mơ.",
    icon: "🎒",
    image: "/images/timeline-1.png",
  },
  {
    year: "2023",
    title: "Năm Hai",
    description:
      "Đắm chìm trong thế giới thuật toán và lập trình. Những đêm thức trắng code nhưng luôn có bạn bè bên cạnh.",
    icon: "💻",
    image: "/images/timeline-2.png",
  },
  {
    year: "2024",
    title: "Năm Ba",
    description:
      "Chuyên sâu vào lĩnh vực yêu thích. Tham gia các cuộc thi, hackathon và bắt đầu xây dựng portfolio.",
    icon: "🏆",
    image: "/images/timeline-3.png",
  },
  {
    year: "2025",
    title: "Thực Tập",
    description:
      "Trải nghiệm thực tế tại doanh nghiệp. Áp dụng kiến thức vào sản phẩm thật và học hỏi từ mentors.",
    icon: "🏢",
    image: "/images/timeline-4.png",
  },
  {
    year: "2025",
    title: "Đồ Án Tốt Nghiệp",
    description:
      "Đổ mồ hôi và nước mắt cho đồ án cuối cùng. Kết quả: một sản phẩm mà cả nhóm đều tự hào.",
    icon: "📝",
    image: "/images/timeline-5.png",
  },
  {
    year: "2026",
    title: "Ngày Tốt Nghiệp",
    description:
      "Khoảnh khắc vinh quang nhất — khoác lên mình chiếc áo cử nhân và nhận tấm bằng mơ ước.",
    icon: "🎓",
    image: "/images/timeline-6.png",
  },
];

// Default wishes for display
export interface Wish {
  id: string;
  name: string;
  message: string;
  emoji: string;
  timestamp: number;
}

export const DEFAULT_WISHES: Wish[] = [
  {
    id: "1",
    name: "Thầy Nguyễn Văn B",
    message:
      "Chúc em luôn tự tin, can đảm và thành công trên con đường phía trước!",
    emoji: "🌟",
    timestamp: Date.now() - 86400000,
  },
  {
    id: "2",
    name: "Bạn Trần Thị C",
    message:
      "4 năm bên nhau, biết bao kỷ niệm. Chúc cậu bay cao bay xa nhé!",
    emoji: "💕",
    timestamp: Date.now() - 43200000,
  },
  {
    id: "3",
    name: "Mẹ",
    message:
      "Con là niềm tự hào của gia đình. Chúc con mọi điều tốt đẹp nhất!",
    emoji: "❤️",
    timestamp: Date.now() - 3600000,
  },
];

// Emoji options for wish section
export const EMOJI_OPTIONS = [
  "🎉",
  "🎓",
  "💐",
  "🌟",
  "❤️",
  "💕",
  "🥳",
  "👏",
  "🎊",
  "✨",
  "🏆",
  "💪",
  "🌈",
  "🎁",
  "💝",
] as const;

// Google Calendar URL generator
export function generateCalendarUrl(): string {
  const event = EVENT;
  const startDate = event.date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const endDate = new Date(event.date.getTime() + 3.5 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0] + "Z";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${event.title} - ${STUDENT.name}`
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    `Lễ tốt nghiệp của ${STUDENT.name} - ${STUDENT.university}`
  )}&location=${encodeURIComponent(event.address)}&sf=true&output=xml`;
}
