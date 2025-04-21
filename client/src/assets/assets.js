import profile_img1 from "./profile_img_1.png";
import profile_img2 from "./profile_img_2.png";
import profile_img3 from "./profile_img_3.png";
import background from "./bg.png";
import img_placeholder from "./landscape-placeholder.svg";
import language_introduction from "./language_introduction.png";
import wave from "./wave.png";
import bg_software from "./pngtree-software-development.png";
import click_course from "./xem-khoa-hoc.svg";
import pay_course from "./thanh-toan.svg";
import learn_course from "./vao-hoc.svg";
import line_1 from "./line-1.svg";
import line_2 from "./line-2.svg";
import error404 from "./error404.png";
import intro_1 from "./intro-1.png";
import intro_2 from "./intro-2.png";
import intro_3 from "./intro-3.png";
import icon_learn from "./icon-learn.svg";
import icon_standart from "./icon-standart.svg";
import icon_anything from "./icon-anything.svg";
import icon_flexible from "./icon-flexible.svg";
import bg_student_learn from "./student_learn.png";
import search_icon from "./search_icon.svg";
import star from "./star.svg";
import star_blank from "./star_blank.svg";
import logo from "./logo.png";
import logo_fold from "./logo-fold.png";

export const assets = {
  background,
  img_placeholder,
  profile_img1,
  profile_img2,
  profile_img3,
  language_introduction,
  wave,
  bg_software,
  click_course,
  pay_course,
  learn_course,
  line_1,
  line_2,
  error404,
  intro_1,
  intro_2,
  intro_3,
  icon_anything,
  icon_flexible,
  icon_learn,
  icon_standart,
  bg_student_learn,
  search_icon,
  star,
  star_blank,
  logo,
  logo_fold,
};

export const dummyEducatorData = {
  _id: "675ac1512100b91a6d9b8b24",
  name: "GreatStack",
  email: "user.greatstack@gmail.com",
  imageUrl:
    "https://img.clerk.com/eyJ0eXB1IjoichlVeHkiLCJzcmMiOiJodHRwczovL21tYWd1cy5jbGVyay5kZXYvb2F1dGhfZ29vZ2x1L21tZ18yc1FkaDBOMmFqMnBoTTRBOXZUanZxVlo0aXYifQ",
  createdAt: "2024-12-12T10:56:17.930Z",
  updatedAt: "2024-12-12T10:56:17.930Z",
  __v: 0,
};

export const dummyTestimonial = [
  {
    name: "Donald Jackman",
    role: "SME 1 @ Amazon",
    image: assets.profile_img_1,
    rating: 5,
    feedback:
      "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
  },
  {
    name: "Richard Nelson",
    role: "SME 2 @ Samsung",
    image: assets.profile_img_2,
    rating: 4,
    feedback:
      "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
  },
  {
    name: "James Washington",
    role: "SME 2 @ Google",
    image: assets.profile_img_3,
    rating: 4.5,
    feedback:
      "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
  },
];

export const dummyDashboardData = {
  totalEarnings: 19000000,
  enrolledStudentsData: [
    {
      courseTitle: "Introduction to JavaScript",
      student: {
        _id: "user_2qQ1vXyr0284Bq6hT0Gvaa5fT9V",
        name: "Great Stack",
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoichJveHkiLCJzcmMiloiJodHRwczovL21tYWd1cy5jbGVyay5kZXYvb2F1dGhrZ29vZ2x1L21tZ18ycVFsdmFMSkw3ckIxNHZWU204ZURWNEtmR2IifQ",
      },
    },
  ],
  totalCourses: 1,
};

export const dummyStudentEnrolled = [
  {
    student: {
      _id: "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      name: "Vũ Nguyễn",
      imageUrl:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydlkwNEZDbTFqSjFFeG9qUWZBNGlSRXo2ODIifQ?width=160",
    },
    courseTitle: "Introduction to JavaScript",
    purchaseDate: "2024-12-20T08:39:55.509Z",
  },
];

export const dummyCourses = [
  {
    _id: "605c72efb3fic2b1f8e4ela1",
    courseTitle: "Introduction to JavaScript",
    courseDescription:
      "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p><p>This course is perfect for beginners who want to start their journey in web development. By the end of this course, you will be able to create interactive web pages and understand the core concepts of JavaScript.</p><ul><li>Understand the basics of programming</li><li>Learn how to manipulate the DOM</li><li>Create dynamic web applications</li></ul>",
    coursePrice: 4000000,
    isPublished: true,
    discount: 20,
    courseContent: [
      {
        chapterId: "chapter1",
        chapterOrder: 1,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: "lecture2",
            lectureTitle: "Test 1",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: false,
            lectureOrder: 1,
          },
        ],
      },
      {
        chapterId: "chapter2",
        chapterOrder: 2,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: "lecture2",
            lectureTitle: "Test 1",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: false,
            lectureOrder: 1,
          },
        ],
      },
      {
        chapterId: "chapter3",
        chapterOrder: 3,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: "lecture2",
            lectureTitle: "Test 1",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: false,
            lectureOrder: 1,
          },
        ],
      },
      {
        chapterId: "chapter4",
        chapterOrder: 1,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: "lecture2",
            lectureTitle: "Test 1",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: false,
            lectureOrder: 1,
          },
        ],
      },
      {
        chapterId: "chapter5",
        chapterOrder: 1,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
          {
            lectureId: "lecture2",
            lectureTitle: "Test 1",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: false,
            lectureOrder: 1,
          },
        ],
      },
    ],
    educator: "675ac1512100b91a6d9b8b24",
    enrolledStudents: [
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
    ],
    courseRatings: [
      {
        userId: "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
        rating: 4,
        _id: "6773e37360cb0ab974342314",
      },
    ],
    createdAt: "2024-12-17T08:16:53.622Z",
    updateAt: "2025-12-02T04:47:44.701Z",
    __v: 4,
    courseThumbnail:
      "https://i.ytimg.com/vi/CBWnBi-awSA/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLDMAyTJqP49sfOInVJWei1dQ1eM1g",
  },
  {
    _id: "605c72efb3fic2b1f8e4ela2",
    courseTitle: "Introduction to JavaScript",
    courseDescription:
      "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p><p>This course is perfect for beginners who want to start their journey in web development. By the end of this course, you will be able to create interactive web pages and understand the core concepts of JavaScript.</p><ul><li>Understand the basics of programming</li><li>Learn how to manipulate the DOM</li><li>Create dynamic web applications</li></ul>",
    coursePrice: 4000000,
    isPublished: true,
    discount: 20,
    courseContent: [
      {
        chapterId: "chapter1",
        chapterOrder: 1,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
        ],
      },
    ],
    educator: "675ac1512100b91a6d9b8b24",
    enrolledStudents: [
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
    ],
    courseRatings: [
      {
        userId: "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
        rating: 3,
        _id: "6773e37360cb0ab974342314",
      },
    ],
    createdAt: "2024-12-17T08:16:53.622Z",
    updateAt: "2025-12-02T04:47:44.701Z",
    __v: 4,
    courseThumbnail: "https://img.youtube.com/vi/HdLIMoQkXFA/maxresdefault.jpg",
  },
  {
    _id: "605c72efb3fic2b1f8e4ela3",
    courseTitle: "Introduction to C/C++",
    courseDescription:
      "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p><p>This course is perfect for beginners who want to start their journey in web development. By the end of this course, you will be able to create interactive web pages and understand the core concepts of JavaScript.</p><ul><li>Understand the basics of programming</li><li>Learn how to manipulate the DOM</li><li>Create dynamic web applications</li></ul>",
    coursePrice: 4000000,
    isPublished: true,
    discount: 20,
    courseContent: [
      {
        chapterId: "chapter1",
        chapterOrder: 1,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
        ],
      },
    ],
    educator: "675ac1512100b91a6d9b8b24",
    enrolledStudents: [
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
    ],
    courseRatings: [
      {
        userId: "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
        rating: 1,
        _id: "6773e37360cb0ab974342314",
      },
    ],
    createdAt: "2024-12-17T08:16:53.622Z",
    updateAt: "2025-12-02T04:47:44.701Z",
    __v: 4,
    courseThumbnail: "https://img.youtube.com/vi/lpx2zFkapIk/maxresdefault.jpg",
  },
  {
    _id: "605c72efb3fic2b1f8e4ela4",
    courseTitle: "Introduction to Python",
    courseDescription:
      "<h2>Learn the Basics of JavaScript</h2><p>JavaScript is a versatile programming language that powers the web. In this course, you will learn the fundamentals of JavaScript, including syntax, data types, and control structures.</p><p>This course is perfect for beginners who want to start their journey in web development. By the end of this course, you will be able to create interactive web pages and understand the core concepts of JavaScript.</p><ul><li>Understand the basics of programming</li><li>Learn how to manipulate the DOM</li><li>Create dynamic web applications</li></ul>",
    coursePrice: 4000000,
    isPublished: true,
    discount: 20,
    courseContent: [
      {
        chapterId: "chapter1",
        chapterOrder: 1,
        chapterTitle: "Getting Started with JavaScript",
        chapterContent: [
          {
            lectureId: "lecture1",
            lectureTitle: "What is JavaScript?",
            lectureDuration: 16,
            lectureUrl: "https://youtu.be/CBWnBi-awSA",
            isPreviewFree: true,
            lectureOrder: 1,
          },
        ],
      },
    ],
    educator: "675ac1512100b91a6d9b8b24",
    enrolledStudents: [
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
      "user_2qQlvXyr02B4Bq6hT0Gvaa5fT9V",
    ],
    courseRatings: [
      {
        userId: "user_2qjlgkAqIMpiR2flWIRzvWKtE0w",
        rating: 5,
        _id: "6773e37360cb0ab974342314",
      },
    ],
    createdAt: "2024-12-17T08:16:53.622Z",
    updateAt: "2025-12-02T04:47:44.701Z",
    __v: 4,
    courseThumbnail: "https://img.youtube.com/vi/jZFaMEqEqEQ/maxresdefault.jpg",
  },
];
