import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Edit, Users, Eye, 
  Settings, BookOpen, MessageCircle,
  Play, Clock, CheckCircle, Calendar, Video, Pencil, Trash2,
  Award, Trophy, Star, ThumbsUp, User
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MentorDashboardLayout } from "@/components/MentorDashboardLayout";
import { AddLessonModal } from "@/components/AddLessonModal";
import { 
  mockLessons, 
  mockCourse, 
  mockRecentReviews, 
  mockRecentStudents,
  mockEnrolledStudents,
  type Lesson,
  type RecentReview
} from "@/data/mockCourseData";

export const Route = createFileRoute("/mentor/courses/manage/$courseId")({
  component: CourseManagementPage,
});

// Custom Philippine Peso Icon
const PhilippinePeso = ({ className }: { className?: string }) => (
  <span className={className} style={{ fontFamily: "sans-serif", fontWeight: 600 }}>₱</span>
);

// Helper function to render stars
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} className="h-4 w-4 fill-gold text-gold" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<Star key={i} className="h-4 w-4 fill-gold/50 text-gold" />);
    } else {
      stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
    }
  }
  return stars;
};

function CourseManagementPage() {
  const navigate = useNavigate();
  const { courseId } = Route.useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [courseStatus, setCourseStatus] = useState("published");
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [recentReviews] = useState<RecentReview[]>(mockRecentReviews);
  const [recentStudents] = useState(mockRecentStudents);
  const [enrolledStudents] = useState(mockEnrolledStudents);
  const course = { ...mockCourse, id: courseId };

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "content", label: "Course Content", icon: Play },
    { id: "students", label: "Students", icon: Users },
    { id: "reviews", label: "Reviews", icon: MessageCircle },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleAddCourses = () => {
    setEditingLesson(null);
    setShowLessonForm(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonForm(true);
  };

  const handleAddLesson = (lessonData: { title: string; minutes: number; videoUrl?: string; videoFile?: File }) => {
    if (editingLesson) {
      // Update existing lesson
      const updatedLessons = lessons.map(lesson => {
        if (lesson.id === editingLesson.id) {
          // Clean up old video preview if exists
          if (lesson.videoPreview) {
            URL.revokeObjectURL(lesson.videoPreview);
          }
          
          const updatedLesson: Lesson = {
            ...lesson,
            title: lessonData.title,
            duration: lessonData.minutes,
            videoUrl: lessonData.videoUrl,
            videoFile: lessonData.videoFile,
          };
          
          // Create preview URL for new video file if exists
          if (lessonData.videoFile) {
            updatedLesson.videoPreview = URL.createObjectURL(lessonData.videoFile);
          } else {
            updatedLesson.videoPreview = undefined;
          }
          
          return updatedLesson;
        }
        return lesson;
      });
      
      setLessons(updatedLessons);
      toast.success("Lesson updated successfully!");
    } else {
      // Add new lesson
      const newLesson: Lesson = {
        id: (lessons.length + 1).toString(),
        title: lessonData.title,
        duration: lessonData.minutes,
        completed: false,
        videoUrl: lessonData.videoUrl,
        videoFile: lessonData.videoFile,
      };
      
      // Create preview URL for video file if exists
      if (lessonData.videoFile) {
        newLesson.videoPreview = URL.createObjectURL(lessonData.videoFile);
      }
      
      setLessons([...lessons, newLesson]);
      toast.success("Lesson added successfully!");
    }
    
    setShowLessonForm(false);
    setEditingLesson(null);
  };

  const handlePublish = () => {
    setCourseStatus("published");
    toast.success("Course published successfully!");
  };

  const handleUnpublish = () => {
    setCourseStatus("draft");
    toast.success("Course unpublished");
  };

  const handleDeleteLesson = (lessonId: string) => {
    const lessonToDelete = lessons.find(l => l.id === lessonId);
    if (lessonToDelete?.videoPreview) {
      URL.revokeObjectURL(lessonToDelete.videoPreview);
    }
    if (confirm("Are you sure you want to delete this lesson?")) {
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      toast.success("Lesson deleted successfully");
    }
  };

  return (
    <MentorDashboardLayout>
      <div className="p-6">
        {/* Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>

        {/* Course Header */}
        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  courseStatus === "published" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                }`}>
                  {courseStatus === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-navy dark:text-gold">{course.title}</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">{course.description}</p>
              
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <PhilippinePeso className="h-4 w-4 text-gold" />
                  <span className="font-semibold">₱{course.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gold" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(course.rating) ? "text-gold" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <span>{course.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link to="/mentor/courses/edit/$courseId" params={{ courseId }}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" /> Edit Course
                </Button>
              </Link>
              {courseStatus === "published" ? (
                <Button variant="outline" onClick={handleUnpublish}>Unpublish</Button>
              ) : (
                <Button className="bg-gold hover:bg-gold/90" onClick={handlePublish}>Publish</Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id 
                    ? "text-gold border-b-2 border-gold" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Course Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold text-navy dark:text-gold">{course.students.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Enrollments</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold text-navy dark:text-gold">₱{(course.students * course.price).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold text-navy dark:text-gold">87%</p>
                  <p className="text-xs text-muted-foreground">Completion Rate</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-2xl font-bold text-navy dark:text-gold">{course.rating}</p>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </div>
              </div>

              {/* Recent Student Activity */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-serif text-lg font-bold text-navy dark:text-gold mb-4">Recent Student Activity</h3>
                <div className="space-y-3">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.activity} • {student.time}</p>
                        </div>
                      </div>
                      <Eye 
                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-gold transition-colors" 
                        onClick={() => navigate({ to: "/mentor/students/$studentId", params: { studentId: student.id } })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "content" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted flex justify-between items-center">
                <h3 className="font-semibold text-navy dark:text-gold">Course Lessons</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddCourses}
                >
                  + Add New Lesson
                </Button>
              </div>
              <div className="divide-y divide-border">
                {lessons.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No lessons added yet. Click "Add New Lesson" to get started.
                  </div>
                ) : (
                  lessons.map((lesson, index) => (
                    <div key={lesson.id} className="p-4 hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-sm font-medium text-muted-foreground w-8">{index + 1}</span>
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Play className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{lesson.title}</p>
                              {lesson.videoUrl || lesson.videoFile ? (
                                <Video className="h-3 w-3 text-gold" />
                              ) : null}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{lesson.duration} min</span>
                            </div>
                            {(lesson.videoUrl || lesson.videoPreview) && (
                              <div className="mt-2">
                                {lesson.videoUrl && (
                                  <a 
                                    href={lesson.videoUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-gold hover:underline inline-flex items-center gap-1"
                                  >
                                    <Video className="h-3 w-3" />
                                    Watch Video
                                  </a>
                                )}
                                {lesson.videoPreview && (
                                  <video 
                                    src={lesson.videoPreview} 
                                    controls 
                                    className="mt-2 w-full max-h-48 rounded-md"
                                    preload="metadata"
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEditLesson(lesson)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-navy dark:text-gold">Enrolled Students ({course.students.toLocaleString()})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Enrolled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {enrolledStudents.map((student, i) => (
                      <tr key={i} className="hover:bg-muted/50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-gold" style={{ width: `${student.progress}%` }} />
                            </div>
                            <span className="text-xs">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{student.lastActive}</td>
                        <td className="px-6 py-4">
                          <Link to="/mentor/students/$studentId" params={{ studentId: student.id }}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-navy dark:text-gold">Student Reviews</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    See what students are saying about this course
                  </p>
                </div>
                {/* <Link to="/mentor/courses/manage/reviews/$courseId" params={{ courseId }}>
                  <Button variant="outline">
                    View All Reviews
                  </Button>
                </Link> */}
              </div>

              {/* Quick review stats */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
                  <div className="flex justify-center mb-2">
                    {renderStars(4.8)}
                  </div>
                  <p className="text-2xl font-bold text-navy">4.8</p>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
                  <MessageCircle className="h-8 w-8 text-gold mx-auto mb-2" />
                  <p className="text-2xl font-bold text-navy">{course.totalReviews.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Reviews</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
                  <ThumbsUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-navy">87%</p>
                  <p className="text-xs text-muted-foreground">Would Recommend</p>
                </div>
              </div>

              {/* Sample of recent reviews */}
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="font-medium text-navy mb-1">{review.title}</p>
                    <p className="text-sm text-muted-foreground">{review.content.substring(0, 150)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{review.studentName}</span>
                      {review.verified && (
                        <span className="text-xs text-green-600">✓ Verified Student</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <Link to="/mentor/courses/manage/reviews/$courseId" params={{ courseId }}>
                  <Button variant="link" className="text-gold">
                    See all {course.totalReviews.toLocaleString()} reviews →
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-navy dark:text-gold">Course Certificates</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create and manage certificates for this course
                    </p>
                  </div>
                  <Link to="/mentor/courses/manage/certificates">
                    <Button size="sm" variant="outline">
                      Manage All Certificates
                    </Button>
                  </Link>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <p className="text-2xl font-bold text-navy dark:text-gold">156</p>
                    <p className="text-xs text-muted-foreground">Certificates Issued</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <p className="text-2xl font-bold text-navy dark:text-gold">87%</p>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <p className="text-2xl font-bold text-navy dark:text-gold">Active</p>
                    <p className="text-xs text-muted-foreground">Certificate Status</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-gold/30">
                  <div className="text-center">
                    <Award className="h-16 w-16 text-gold mx-auto mb-4" />
                    <div className="inline-block px-4 py-1 bg-gold/10 rounded-full mb-4">
                      <span className="text-gold text-sm font-semibold">CERTIFICATE OF COMPLETION</span>
                    </div>
                    <h4 className="text-2xl font-serif font-bold text-navy mb-2">Certificate of Achievement</h4>
                    <p className="text-muted-foreground mb-3">This certificate is presented to</p>
                    <p className="text-3xl font-bold text-gold mb-3 font-serif">[Student Name]</p>
                    <p className="text-muted-foreground mb-3">for successfully completing</p>
                    <p className="text-xl font-bold text-navy mb-4 italic">"{course.title}"</p>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                      <div>
                        <Calendar className="h-4 w-4 text-gold mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-semibold">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <CheckCircle className="h-4 w-4 text-gold mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Certificate ID</p>
                        <p className="text-sm font-semibold">CERT-XXXX-XXXX</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 max-w-md mx-auto pt-4">
                      <div className="border-t-2 border-gold/40 pt-2">
                        <p className="text-sm font-semibold">Instructor Name</p>
                        <p className="text-xs text-muted-foreground">Course Instructor</p>
                      </div>
                      <div className="border-t-2 border-gold/40 pt-2">
                        <p className="text-sm font-semibold">Sandiwa Academy</p>
                        <p className="text-xs text-muted-foreground">Authorized Signatory</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>✨ Pro tip:</strong> Certificates are automatically generated when students complete all course lessons. 
                    Click "Manage All Certificates" to customize designs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-navy dark:text-gold mb-2">Course Status</h3>
                <div className="flex items-center gap-3">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    courseStatus === "published" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}>
                    {courseStatus === "published" ? "Published" : "Draft"}
                  </span>
                  {courseStatus === "published" ? (
                    <Button variant="outline" onClick={handleUnpublish}>Unpublish Course</Button>
                  ) : (
                    <Button className="bg-gold hover:bg-gold/90" onClick={handlePublish}>Publish Course</Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-navy dark:text-gold mb-2">Price</h3>
                <p className="text-2xl font-serif font-bold text-gold">₱{course.price}</p>
                <Link to="/mentor/courses/edit/$courseId" params={{ courseId }}>
                  <Button variant="outline" size="sm" className="mt-2">Edit Price</Button>
                </Link>
              </div>

              <div>
                <h3 className="font-semibold text-navy dark:text-gold mb-2">Danger Zone</h3>
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <p className="text-sm text-destructive font-medium">Delete this course</p>
                  <p className="text-xs text-muted-foreground mt-1">Once deleted, all data will be permanently removed.</p>
                  <Button variant="destructive" size="sm" className="mt-3">Delete Course</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Lesson Modal */}
        {showLessonForm && (
          <AddLessonModal
            onClose={() => {
              setShowLessonForm(false);
              setEditingLesson(null);
            }}
            onAdd={handleAddLesson}
            editingLesson={editingLesson}
          />
        )}
      </div>
    </MentorDashboardLayout>
  );
}