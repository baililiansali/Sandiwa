import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Users, Video, DollarSign, Clock, CreditCard, Gift, Save, Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Event } from "@/data/mockEvents";

type Category = "workshop" | "meetup" | "celebration" | "conversation";

export const Route = createFileRoute("/learner/community/events/$eventId/edit")({
  head: () => ({
    meta: [
      { title: "Edit Event — Sandiwa" },
      { name: "description", content: "Edit your community event." },
    ],
  }),
  component: EditEventPage,
});

function EditEventPage() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFree, setIsFree] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [location, setLocation] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("0");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [category, setCategory] = useState<Category>("workshop");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "workshop", label: "Workshop" },
    { value: "meetup", label: "Meetup" },
    { value: "celebration", label: "Celebration" },
    { value: "conversation", label: "Conversation" },
  ];

  useEffect(() => {
    // Load event data
    const storedEvents: Event[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
    const event = storedEvents.find(e => e.id === eventId);
    
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setLocation(event.location);
      setIsVirtual(event.isVirtual || false);
      setCapacity(event.capacity?.toString() || "");
      setPrice(event.price?.toString() || "0");
      setIsFree(event.price === 0);
      setImage(event.image || "");
      setImagePreview(event.image || "");
      setCategory(event.category);
      
      // Handle dates
      const startDate = new Date(event.date);
      setDateFrom(startDate.toISOString().split('T')[0]);
      setTimeFrom(startDate.toTimeString().slice(0, 5));
      
      if (event.dateTo) {
        setIsMultiDay(true);
        const endDate = new Date(event.dateTo);
        setDateTo(endDate.toISOString().split('T')[0]);
        setTimeTo(endDate.toTimeString().slice(0, 5));
      } else {
        setTimeTo(startDate.toTimeString().slice(0, 5));
      }
    } else {
      toast.error("Event not found");
      navigate({ to: "/learner/community/events" });
    }
    
    setLoading(false);
  }, [eventId, navigate]);

  const handleFreeToggle = (free: boolean) => {
    setIsFree(free);
    setPrice(free ? "0" : "100");
  };

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImage(base64String);
      setIsUploading(false);
      toast.success("Image uploaded successfully!");
    };
    reader.onerror = () => {
      toast.error("Failed to upload image");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle image URL input
  const handleImageUrlChange = (url: string) => {
    setImage(url);
    setImagePreview(url);
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
      toast.success("Image URL set successfully!");
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImage("");
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Image removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    
    if (!dateFrom) {
      toast.error("Please select a start date");
      return;
    }
    
    if (isMultiDay && !dateTo) {
      toast.error("Please select an end date");
      return;
    }
    
    if (isMultiDay && dateTo && new Date(dateTo) < new Date(dateFrom)) {
      toast.error("End date cannot be before start date");
      return;
    }
    
    if (!timeFrom) {
      toast.error("Please select a start time");
      return;
    }
    
    if (!timeTo) {
      toast.error("Please select an end time");
      return;
    }
    
    if (timeTo <= timeFrom && dateFrom === dateTo) {
      toast.error("End time must be after start time");
      return;
    }
    
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const startDateTime = new Date(`${dateFrom}T${timeFrom}`);
      const endDateTime = isMultiDay && dateTo 
        ? new Date(`${dateTo}T${timeTo}`)
        : new Date(`${dateFrom}T${timeTo}`);

      // Get existing events and update
      const storedEvents: Event[] = JSON.parse(localStorage.getItem("sandiwa.events") || "[]");
      const eventIndex = storedEvents.findIndex(e => e.id === eventId);
      
      if (eventIndex !== -1) {
        const updatedEvent = {
          ...storedEvents[eventIndex],
          title: title.trim(),
          description: description.trim(),
          date: startDateTime,
          dateTo: endDateTime,
          location: location.trim(),
          isVirtual: isVirtual,
          price: parseFloat(price) || 0,
          capacity: capacity ? parseInt(capacity) : undefined,
          image: image || storedEvents[eventIndex].image,
          category: category,
        };
        
        storedEvents[eventIndex] = updatedEvent;
        localStorage.setItem("sandiwa.events", JSON.stringify(storedEvents));
        
        toast.success("Event updated successfully!");
      }
      
      setIsSubmitting(false);
      
      setTimeout(() => {
        navigate({ to: "/learner/community/events/$eventId", params: { eventId } });
      }, 500);
    }, 1000);
  };

  const handleGoBack = () => {
    navigate({ to: "/learner/community/events/$eventId", params: { eventId } });
  };

  if (loading) {
    return (
      <AuthGuard>
        <SiteLayout>
          <div className="bg-cream min-h-screen py-20 text-center">
            <p className="text-muted-foreground">Loading event data...</p>
          </div>
        </SiteLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SiteLayout>
        <section className="bg-cream py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-gold mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Event
            </button>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h1 className="font-serif text-3xl font-bold text-navy">Edit Event</h1>
              <p className="mt-2 text-muted-foreground">
                Update your workshop, meetup, or cultural celebration
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={100}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {title.length}/100 characters
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe what attendees will learn and experience..."
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={2000}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {description.length}/2000 characters
                  </p>
                </div>

                {/* Multi-day Event Toggle */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={isMultiDay}
                      onChange={(e) => setIsMultiDay(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-navy flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> This is a multi-day event (2+ days)
                    </span>
                  </label>
                </div>

                {/* Date Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> {isMultiDay ? "Start Date *" : "Date *"}
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  
                  {isMultiDay && (
                    <div>
                      <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> End Date *
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        min={dateFrom}
                        className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Time Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Start Time *
                    </label>
                    <input
                      type="time"
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Clock className="h-4 w-4" /> End Time *
                    </label>
                    <input
                      type="time"
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Zoom, Quezon City, Manila..."
                    className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      <Users className="h-4 w-4" /> Capacity (optional)
                    </label>
                    <input
                      type="number"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Max attendees"
                      className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-1">
                      {isFree ? <Gift className="h-4 w-4 text-green-500" /> : <DollarSign className="h-4 w-4 text-gold" />}
                      Price
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleFreeToggle(true)}
                        className={`flex-1 px-3 py-2 rounded-md text-sm transition ${
                          isFree 
                            ? "bg-green-500 text-white" 
                            : "bg-muted text-muted-foreground hover:bg-green-100"
                        }`}
                      >
                        <Gift className="h-4 w-4 inline mr-1" />
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFreeToggle(false)}
                        className={`flex-1 px-3 py-2 rounded-md text-sm transition ${
                          !isFree 
                            ? "bg-gold text-white" 
                            : "bg-muted text-muted-foreground hover:bg-gold/20"
                        }`}
                      >
                        <CreditCard className="h-4 w-4 inline mr-1" />
                        Paid
                      </button>
                    </div>
                    {!isFree && (
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price in ₱"
                        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        min="1"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVirtual}
                      onChange={(e) => setIsVirtual(e.target.checked)}
                      className="h-4 w-4 rounded border-border text-gold focus:ring-gold"
                    />
                    <span className="text-sm font-medium text-navy flex items-center gap-1">
                      <Video className="h-4 w-4" /> This is a virtual event
                    </span>
                  </label>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-navy flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-gold" />
                    Event Image
                  </label>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    Upload an image or provide an image URL for your event
                  </p>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4 relative">
                      <div className="rounded-lg overflow-hidden border border-border relative group">
                        <img 
                          src={imagePreview} 
                          alt="Event preview" 
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Options */}
                  <div className="space-y-3">
                    {/* File Upload Button */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gold text-gold hover:bg-gold hover:text-white transition cursor-pointer"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Image"}
                      </label>
                    </div>

                    {/* OR Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-card px-2 text-muted-foreground">OR</span>
                      </div>
                    </div>

                    {/* Image URL Input */}
                    <div>
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://example.com/event-image.jpg"
                        className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Provide a direct image URL (JPEG, PNG, GIF)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold hover:bg-gold/90 text-white"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </SiteLayout>
    </AuthGuard>
  );
}