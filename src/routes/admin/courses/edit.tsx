// import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
// import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
// import { Button } from "@/components/ui/button";
// import { 
//   ArrowLeft, 
//   Save,
//   X
// } from "lucide-react";
// import { courses as mockCourses } from "@/data/mockCourses";
// import { toast } from "sonner";
// import { useState } from "react";

// export const Route = createFileRoute("/admin/courses/$courseId/edit")({
//   loader: ({ params }) => {
//     const course = mockCourses.find((c) => c.id === params.courseId);
//     if (!course) throw notFound();
//     return { course };
//   },
//   head: ({ loaderData }) => ({
//     meta: [
//       { title: `Edit ${loaderData?.course.title ?? "Course"} — Admin — Sandiwa` },
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
//   component: AdminCourseEditPage,
// });

// function AdminCourseEditPage() {
//   const { course } = Route.useLoaderData();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: course.title,
//     description: course.description,
//     price: course.price,
//     category: course.category,
//   });
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     setIsSaving(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     toast.success(`Course "${formData.title}" updated successfully!`);
//     setIsSaving(false);
//     navigate({ to: "/admin/courses/$courseId", params: { courseId: course.id } });
//   };

//   const handleCancel = () => {
//     navigate({ to: "/admin/courses/$courseId", params: { courseId: course.id } });
//   };

//   return (
//     <AdminDashboardLayout>
//       <div className="p-6 max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center gap-4 mb-4">
//             <Link to="/admin/courses/$courseId" params={{ courseId: course.id }}>
//               <Button variant="ghost" size="sm">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Course
//               </Button>
//             </Link>
//           </div>
//           <h1 className="font-serif text-3xl font-bold text-navy">Edit Course</h1>
//           <p className="text-muted-foreground mt-1">Make changes to your course information</p>
//         </div>

//         {/* Edit Form */}
//         <div className="rounded-xl border border-border bg-card p-6">
//           <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
//             {/* Course Title */}
//             <div>
//               <label className="block text-sm font-medium text-navy mb-2">
//                 Course Title
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-navy mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 rows={4}
//                 className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
//                 required
//               />
//             </div>

//             {/* Price and Category */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-navy mb-2">
//                   Price (₱)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
//                   className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
//                   required
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-navy mb-2">
//                   Category
//                 </label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
//                 >
//                   <option value="Language">Language</option>
//                   <option value="History">History</option>
//                   <option value="Cuisine">Cuisine</option>
//                   <option value="Arts">Arts</option>
//                 </select>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 pt-4 border-t border-border">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleCancel}
//                 className="flex-1"
//               >
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="flex-1 bg-gold hover:bg-gold/90 text-gold-foreground"
//                 disabled={isSaving}
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 {isSaving ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </AdminDashboardLayout>
//   );
// }



































import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Save,
  X
} from "lucide-react";
import { courses as mockCourses } from "@/data/mockCourses";
import { toast } from "sonner";
import { useState } from "react";

// Define the search params type
interface EditSearchParams {
  courseId: string;
}

export const Route = createFileRoute("/admin/courses/edit")({
  validateSearch: (search: Record<string, unknown>): EditSearchParams => {
    return {
      courseId: String(search.courseId || ""),
    };
  },
  component: AdminCourseEditPage,
});

function AdminCourseEditPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const courseId = search.courseId;
  
  const course = mockCourses.find((c) => c.id === courseId);
  
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    price: course?.price || 0,
    category: course?.category || "",
    hours: course?.hours || 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!course) {
    return (
      <AdminDashboardLayout>
        <div className="mx-auto max-w-2xl py-24 text-center">
          <h1 className="font-serif text-3xl font-bold">Course not found</h1>
          <Link to="/admin/courses" className="mt-4 inline-block text-gold hover:underline">
            Back to Courses
          </Link>
        </div>
      </AdminDashboardLayout>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Course "${formData.title}" updated successfully!`);
    setIsSaving(false);
    navigate({ to: "/admin/courses" });
  };

  const handleCancel = () => {
    navigate({ to: "/admin/courses" });
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/admin/courses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy">Edit Course</h1>
          <p className="text-muted-foreground mt-1">Make changes to your course information</p>
        </div>

        {/* Edit Form */}
        <div className="rounded-xl border border-border bg-card p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                required
              />
            </div>

            {/* Price, Category, and Hours */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Price (₱)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="Language">Language</option>
                  <option value="History">History</option>
                  <option value="Cuisine">Cuisine</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Total Hours
                </label>
                <input
                  type="number"
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold"
                  required
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gold hover:bg-gold/90 text-gold-foreground"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}