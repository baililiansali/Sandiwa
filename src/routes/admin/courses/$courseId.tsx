// import { createFileRoute, Link, notFound } from "@tanstack/react-router";
// import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
// import { Button } from "@/components/ui/button";
// import { 
//   ArrowLeft, 
//   Star, 
//   Users, 
//   Clock, 
//   BookOpen, 
//   CheckCircle2,
//   Calendar,
//   RefreshCw,
//   Edit,
//   Trash2,
//   Eye
// } from "lucide-react";
// import { courses as mockCourses, type Course } from "@/data/mockCourses";
// import { mentors } from "@/data/mockMentors";
// import { toast } from "sonner";
// import { useState } from "react";

// export const Route = createFileRoute("/admin/courses/$courseId")({
//   loader: ({ params }) => {
//     const course = mockCourses.find((c) => c.id === params.courseId);
//     if (!course) throw notFound();
//     return { course };
//   },
//   head: ({ loaderData }) => ({
//     meta: [
//       { title: `${loaderData?.course.title ?? "Course"} — Admin — Sandiwa` },
//       { name: "description", content: loaderData?.course.description ?? "" },
//     ],
//   }),
//   notFoundComponent: () => (
//     <AdminDashboardLayout>
//       <div className="mx-auto max-w-2xl py-24 text-center">
//         <h1 className="font-serif text-3xl font-bold">Course not found</h1>
//         <Link to="/admin/courses" className="mt-4 inline-block text-gold hover:underline">
//           Back to Courses
//         </Link>
//       </div>
//     </AdminDashboardLayout>
//   ),
//   component: AdminCourseDetailPage,
// });

// function AdminCourseDetailPage() {
//   const { course } = Route.useLoaderData();
//   const mentor = mentors.find((m) => m.id === course.mentorId);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

//   const handleDelete = () => {
//     toast.success(`Course "${course.title}" deleted successfully!`);
//     // Navigate back to courses list
//     window.history.back();
//   };

//   return (
//     <AdminDashboardLayout>
//       <div className="p-6">
//         {/* Header with Back Button */}
//         <div className="mb-6">
//           <div className="flex items-center gap-4 mb-4">
//             <Link to="/admin/courses">
//               <Button variant="ghost" size="sm">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Courses
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Course Header */}
//         <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
//           <div className="grid md:grid-cols-3 gap-6 p-6">
//             {/* Course Image */}
//             <div className="aspect-video rounded-lg overflow-hidden bg-muted">
//               <img 
//                 src={course.image} 
//                 alt={course.title} 
//                 className="h-full w-full object-cover"
//               />
//             </div>
            
//             {/* Course Info */}
//             <div className="md:col-span-2">
//               <div className="flex items-center gap-2 flex-wrap mb-2">
//                 {course.badge && (
//                   <span className="inline-block rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
//                     {course.badge}
//                   </span>
//                 )}
//                 <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
//                   {course.category}
//                 </span>
//               </div>
//               <h1 className="font-serif text-3xl font-bold text-navy">{course.title}</h1>
//               <p className="text-muted-foreground mt-2">{course.description}</p>
              
//               <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
//                 <span className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-gold text-gold" /> {course.rating}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Users className="h-4 w-4" /> {course.enrolled.toLocaleString()} students
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Clock className="h-4 w-4" /> {course.hours} hours
//                 </span>
//               </div>
              
//               {mentor && (
//                 <div className="mt-4 flex items-center gap-3">
//                   <img 
//                     src={mentor.image} 
//                     alt={mentor.name} 
//                     className="h-10 w-10 rounded-full object-cover" 
//                   />
//                   <div>
//                     <p className="font-medium text-navy">{mentor.name}</p>
//                     <p className="text-xs text-gold">{mentor.title}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-3 mb-6">
//           <Link to="/admin/courses/$courseId/edit" params={{ courseId: course.id }}>
//             <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
//               <Edit className="h-4 w-4 mr-2" />
//               Edit Course
//             </Button>
//           </Link>
//           <Button 
//             variant="outline" 
//             className="border-red-600 text-red-600 hover:bg-red-50"
//             onClick={() => setShowDeleteConfirm(true)}
//           >
//             <Trash2 className="h-4 w-4 mr-2" />
//             Delete Course
//           </Button>
//         </div>

//         {/* Delete Confirmation Modal */}
//         {showDeleteConfirm && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-background rounded-xl max-w-md w-full">
//               <div className="p-6 border-b border-border">
//                 <h2 className="font-serif text-xl font-bold text-navy">Delete Course</h2>
//               </div>
//               <div className="p-6">
//                 <p className="text-muted-foreground">
//                   Are you sure you want to delete <strong className="text-red-600">"{course.title}"</strong>? 
//                   This action cannot be undone.
//                 </p>
//                 <div className="flex gap-3 mt-6">
//                   <Button
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => setShowDeleteConfirm(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="flex-1 bg-red-600 hover:bg-red-700"
//                     onClick={handleDelete}
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Course Details Grid */}
//         <div className="grid gap-6 lg:grid-cols-2">
//           {/* What You'll Learn */}
//           <div className="rounded-xl border border-border bg-card p-6">
//             <h2 className="font-serif text-xl font-bold text-navy mb-4">What You'll Learn</h2>
//             <div className="grid gap-3 sm:grid-cols-2">
//               {course.outcomes.map((outcome: string) => (
//                 <div key={outcome} className="flex items-start gap-2 text-sm">
//                   <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
//                   <span>{outcome}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Course Stats */}
//           <div className="rounded-xl border border-border bg-card p-6">
//             <h2 className="font-serif text-xl font-bold text-navy mb-4">Course Statistics</h2>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Total Students</span>
//                 <span className="font-semibold text-navy">{course.enrolled.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Total Revenue</span>
//                 <span className="font-semibold text-gold">₱{(course.enrolled * course.price).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Course Price</span>
//                 <span className="font-semibold">₱{course.price}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Total Hours</span>
//                 <span className="font-semibold">{course.hours} hours</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Total Lessons</span>
//                 <span className="font-semibold">{course.lessons.length}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-muted-foreground">Average Rating</span>
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-gold text-gold" />
//                   <span className="font-semibold">{course.rating}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Course Content */}
//         <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
//           <div className="p-6 border-b border-border bg-muted/30">
//             <h2 className="font-serif text-xl font-bold text-navy">Course Content</h2>
//             <p className="text-sm text-muted-foreground mt-1">
//               {course.lessons.length} lessons • {course.hours} hours total
//             </p>
//           </div>
//           <div className="divide-y divide-border">
//             {course.lessons.map((lesson, index) => (
//               <div key={lesson.title} className="flex items-center justify-between p-4 hover:bg-muted/50">
//                 <div className="flex items-center gap-3">
//                   <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
//                     {index + 1}
//                   </span>
//                   <span className="text-sm text-navy">{lesson.title}</span>
//                 </div>
//                 <span className="text-xs text-muted-foreground">{lesson.minutes} min</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Dates */}
//         <div className="mt-6 rounded-xl border border-border bg-card p-6">
//           <div className="flex flex-wrap gap-6">
//             <div>
//               <p className="text-xs text-muted-foreground">Created</p>
//               <p className="text-sm font-medium flex items-center gap-1">
//                 <Calendar className="h-3 w-3" />
//                 {new Date(course.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//             {course.updatedAt && course.updatedAt !== course.createdAt && (
//               <div>
//                 <p className="text-xs text-muted-foreground">Last Updated</p>
//                 <p className="text-sm font-medium flex items-center gap-1">
//                   <RefreshCw className="h-3 w-3" />
//                   {new Date(course.updatedAt).toLocaleDateString()}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </AdminDashboardLayout>
//   );
// }























import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  CheckCircle2,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { courses as mockCourses, type Course } from "@/data/mockCourses";
import { mentors } from "@/data/mockMentors";

export const Route = createFileRoute("/admin/courses/$courseId")({
  loader: ({ params }) => {
    const course = mockCourses.find((c) => c.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.course.title ?? "Course"} — Admin — Sandiwa` },
      { name: "description", content: loaderData?.course.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <AdminDashboardLayout>
      <div className="mx-auto max-w-2xl py-24 text-center">
        <h1 className="font-serif text-3xl font-bold">Course not found</h1>
        <Link to="/admin/courses" className="mt-4 inline-block text-gold hover:underline">
          Back to Courses
        </Link>
      </div>
    </AdminDashboardLayout>
  ),
  component: AdminCourseDetailPage,
});

function AdminCourseDetailPage() {
  const { course } = Route.useLoaderData();
  const mentor = mentors.find((m) => m.id === course.mentorId);

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/admin/courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Header */}
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Course Image */}
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img 
                src={course.image} 
                alt={course.title} 
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Course Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                {course.badge && (
                  <span className="inline-block rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                    {course.badge}
                  </span>
                )}
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {course.category}
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-navy">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
              
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" /> {course.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {course.enrolled.toLocaleString()} students
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {course.hours} hours
                </span>
              </div>
              
              {mentor && (
                <div className="mt-4 flex items-center gap-3">
                  <img 
                    src={mentor.image} 
                    alt={mentor.name} 
                    className="h-10 w-10 rounded-full object-cover" 
                  />
                  <div>
                    <p className="font-medium text-navy">{mentor.name}</p>
                    <p className="text-xs text-gold">{mentor.title}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* What You'll Learn */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold text-navy mb-4">What You'll Learn</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((outcome: string) => (
                <div key={outcome} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold text-navy mb-4">Course Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Students</span>
                <span className="font-semibold text-navy">{course.enrolled.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-semibold text-gold">₱{(course.enrolled * course.price).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Course Price</span>
                <span className="font-semibold">₱{course.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Hours</span>
                <span className="font-semibold">{course.hours} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Lessons</span>
                <span className="font-semibold">{course.lessons.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/30">
            <h2 className="font-serif text-xl font-bold text-navy">Course Content</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {course.lessons.length} lessons • {course.hours} hours total
            </p>
          </div>
          <div className="divide-y divide-border">
            {course.lessons.map((lesson, index) => (
              <div key={lesson.title} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm text-navy">{lesson.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{lesson.minutes} min</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(course.createdAt).toLocaleDateString()}
              </p>
            </div>
            {course.updatedAt && course.updatedAt !== course.createdAt && (
              <div>
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <RefreshCw className="h-3 w-3" />
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}