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
  date: new Date("2026-07-26T08:00:00+07:00"),
  venue: "Hội trường tầng 2 | Tòa nhà A9-A10 | Đại học Phenikaa",
  address: "Đường Nguyễn Trác, Yên Nghĩa, Hà Đông, Hà Nội",
  time: "08:00 - 11:30",
  dressCode: "Trang phục lịch sự",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.975417646696!2d105.74558237589259!3d20.9667799806495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313453303d8916d9%3A0x868b446a9a7a0300!2sPhenikaa%20University!5e0!3m2!1sen!2s!4v1721039800000!5m2!1sen!2s",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Phenikaa+University+Nguyen+Trac+Yen+Nghia+Ha+Dong+Hanoi",
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
